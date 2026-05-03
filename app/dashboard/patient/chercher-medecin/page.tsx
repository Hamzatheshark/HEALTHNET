"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, Calendar, Filter } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SPECIALITES } from "@/lib/constants"

type Doctor = {
  id: string
  name: string
  specialty: string
  location: string
  rating: number
  reviews: number
  nextAvailable: string
  consultationFee: number
}

const sampleLocations = ["Paris 15e", "Paris 8e", "Paris 16e", "Paris 12e"]
const sampleTimes = ["Aujourd'hui 14:00", "Demain 09:00", "18 Avril 10:30", "Aujourd'hui 16:00"]
const sampleFees = [30, 40, 45, 50]

export default function SearchDoctorPage() {
  const [search, setSearch] = useState("")
  const [specialty, setSpecialty] = useState("Toutes les spécialités")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [bookingDate, setBookingDate] = useState("")
  const [bookingTime, setBookingTime] = useState("09:00")
  const [bookingType, setBookingType] = useState("IN_PERSON")
  const [bookingReason, setBookingReason] = useState("")
  const [bookingError, setBookingError] = useState("")
  const [bookingSuccess, setBookingSuccess] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const today = new Date().toISOString().slice(0, 10)
  const currentTime = new Date().toTimeString().slice(0, 5)
  const minTime = bookingDate === today ? currentTime : "00:00"

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors")
        const data = await response.json()
        const mapped = data.map((doctor: any, index: number) => ({
          id: doctor.id,
          name: `${doctor.firstName} ${doctor.lastName}`,
          specialty: doctor.specialty || "Généraliste",
          location: sampleLocations[index % sampleLocations.length],
          rating: 4.7 + (index * 0.1),
          reviews: 80 + index * 20,
          nextAvailable: sampleTimes[index % sampleTimes.length],
          consultationFee: sampleFees[index % sampleFees.length],
        }))
        setDoctors(mapped)
      } catch {
        setDoctors([])
      }
    }

    fetchDoctors()
  }, [])

  const filteredDoctors = useMemo(
    () => doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.location.toLowerCase().includes(search.toLowerCase())
      const matchesSpecialty =
        specialty === "Toutes les spécialités" || doctor.specialty === specialty
      return matchesSearch && matchesSpecialty
    }),
    [doctors, search, specialty]
  )

  const handleBookClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setBookingDate("")
    setBookingTime("09:00")
    setBookingReason("")
    setBookingError("")
    setBookingSuccess("")
  }

  const handleBookingSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedDoctor) return
    if (!bookingDate || !bookingTime) {
      setBookingError("Veuillez choisir une date et une heure")
      return
    }

    const selectedDateTime = new Date(`${bookingDate}T${bookingTime}`)
    if (isNaN(selectedDateTime.getTime()) || selectedDateTime <= new Date()) {
      setBookingError("La date et l'heure doivent être dans le futur")
      return
    }

    setBookingLoading(true)
    setBookingError("")
    setBookingSuccess("")

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          date: bookingDate,
          time: bookingTime,
          type: bookingType,
          location: bookingType === "IN_PERSON" ? selectedDoctor.location : "En ligne",
          reason: bookingReason,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Impossible de prendre le rendez-vous")
      }

      setBookingSuccess("Rendez-vous pris avec succès !")
      setSelectedDoctor(null)
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Erreur inconnue")
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Chercher un médecin</h1>
        <p className="text-muted-foreground">Trouvez le praticien adapté à vos besoins</p>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou localisation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Toutes les spécialités">Toutes les spécialités</SelectItem>
                {SPECIALITES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {filteredDoctors.length} médecin{filteredDoctors.length > 1 ? "s" : ""} trouvé{filteredDoctors.length > 1 ? "s" : ""}
        </p>

        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="border-border/50 transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {doctor.name.split(" ").slice(1).map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                    <p className="text-sm text-primary">{doctor.specialty}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {doctor.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                        {doctor.rating.toFixed(1)} ({doctor.reviews} avis)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 lg:items-end">
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                    <Calendar className="mr-1 h-3 w-3" />
                    {doctor.nextAvailable}
                  </Badge>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{doctor.consultationFee} EUR</span>
                    <Button onClick={() => handleBookClick(doctor)}>Prendre RDV</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedDoctor && (
        <Card className="border-border/50">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Réserver un rendez-vous avec {selectedDoctor.name}</h2>
                <p className="text-sm text-muted-foreground">Spécialité : {selectedDoctor.specialty}</p>
              </div>
              <Button variant="ghost" onClick={() => setSelectedDoctor(null)}>
                Annuler
              </Button>
            </div>

            <form onSubmit={handleBookingSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date</label>
                <Input
                  type="date"
                  value={bookingDate}
                  min={today}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Heure</label>
                <Input
                  type="time"
                  value={bookingTime}
                  min={minTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-foreground">Type de consultation</label>
                <Select value={bookingType} onValueChange={setBookingType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_PERSON">En cabinet</SelectItem>
                    <SelectItem value="TELECONSULTATION">Téléconsultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-foreground">Motif</label>
                <Input
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  placeholder="Indiquez le motif du rendez-vous"
                />
              </div>

              {bookingError && <div className="sm:col-span-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{bookingError}</div>}
              {bookingSuccess && <div className="sm:col-span-2 rounded-md bg-secondary/10 p-3 text-sm text-secondary">{bookingSuccess}</div>}

              <div className="sm:col-span-2 flex flex-wrap gap-3">
                <Button type="submit" disabled={bookingLoading}>
                  {bookingLoading ? "Réservation..." : "Confirmer le RDV"}
                </Button>
                <Button variant="outline" onClick={() => setSelectedDoctor(null)}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

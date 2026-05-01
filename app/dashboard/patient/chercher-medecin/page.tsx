"use client"

import { useState } from "react"
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

const doctors = [
  {
    id: 1,
    name: "Dr. Sophie Bernard",
    specialty: "Medecine generale",
    location: "Paris 15e",
    rating: 4.9,
    reviews: 127,
    nextAvailable: "Aujourd hui 14:00",
    consultationFee: 25,
  },
  {
    id: 2,
    name: "Dr. Pierre Martin",
    specialty: "Cardiologie",
    location: "Paris 8e",
    rating: 4.8,
    reviews: 89,
    nextAvailable: "Demain 09:00",
    consultationFee: 50,
  },
  {
    id: 3,
    name: "Dr. Marie Leroy",
    specialty: "Dermatologie",
    location: "Paris 16e",
    rating: 4.7,
    reviews: 156,
    nextAvailable: "18 Avril 10:30",
    consultationFee: 45,
  },
  {
    id: 4,
    name: "Dr. Jean Dubois",
    specialty: "Pediatrie",
    location: "Paris 12e",
    rating: 4.9,
    reviews: 203,
    nextAvailable: "Aujourd hui 16:00",
    consultationFee: 35,
  },
]

const specialties = [
  "Toutes les specialites",
  "Medecine generale",
  "Cardiologie",
  "Dermatologie",
  "Pediatrie",
  "Ophtalmologie",
  "Orthopedie",
]

export default function SearchDoctorPage() {
  const [search, setSearch] = useState("")
  const [specialty, setSpecialty] = useState("Toutes les specialites")

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      doctor.location.toLowerCase().includes(search.toLowerCase())
    const matchesSpecialty = specialty === "Toutes les specialites" || doctor.specialty === specialty
    return matchesSearch && matchesSpecialty
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Chercher un medecin</h1>
        <p className="text-muted-foreground">Trouvez le praticien adapte a vos besoins</p>
      </div>

      {/* Search & Filters */}
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
                {specialties.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {filteredDoctors.length} medecin{filteredDoctors.length > 1 ? "s" : ""} trouve{filteredDoctors.length > 1 ? "s" : ""}
        </p>

        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="border-border/50 transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {doctor.name.split(" ").slice(1).map(n => n[0]).join("")}
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
                        {doctor.rating} ({doctor.reviews} avis)
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
                    <Button>Prendre RDV</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

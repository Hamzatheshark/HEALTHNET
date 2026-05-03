"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PublicNavbar } from "@/components/public-navbar"
import { PublicFooter } from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, Calendar } from "lucide-react"
import { SPECIALITES } from "@/lib/constants"

type Doctor = {
  id: string
  firstName: string
  lastName: string
  specialty?: string
}

const sampleLocations = ["Paris 15e", "Paris 8e", "Paris 16e", "Paris 12e"]
const sampleTimes = ["Aujourd hui", "Demain", "Dans 2 jours", "Aujourd hui"]
const sampleRatings = [4.9, 4.8, 4.7, 4.9, 4.6, 4.8]
const sampleReviews = [127, 89, 156, 203, 78, 112]

export default function MedecinsPage() {
  const [search, setSearch] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("Tous")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors")
        const data = await response.json()
        setDoctors(data)
      } catch (error) {
        console.error("Error fetching doctors:", error)
        setDoctors([])
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase()
    const specialty = doctor.specialty || "Médecine générale"
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      specialty.toLowerCase().includes(search.toLowerCase())
    const matchesSpecialty =
      selectedSpecialty === "Tous" || specialty === selectedSpecialty
    return matchesSearch && matchesSpecialty
  })

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Trouvez votre medecin
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Parcourez notre reseau de professionnels de sante qualifies 
                et prenez rendez-vous en quelques clics.
              </p>
            </div>

            {/* Search */}
            <div className="mx-auto mt-10 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher un medecin ou une specialite..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters & Results */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Specialty Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedSpecialty === "Tous" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSpecialty("Tous")}
              >
                Tous
              </Button>
              {SPECIALITES.map((specialty) => (
                <Button
                  key={specialty}
                  variant={selectedSpecialty === specialty ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSpecialty(specialty)}
                >
                  {specialty}
                </Button>
              ))}
            </div>

            {/* Results Count */}
            <p className="mt-6 text-sm text-muted-foreground">
              {filteredDoctors.length} medecin{filteredDoctors.length > 1 ? "s" : ""} trouve{filteredDoctors.length > 1 ? "s" : ""}
            </p>

            {/* Doctors Grid */}
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor, index) => {
                  const specialty = doctor.specialty || "Médecine générale"
                  const location = sampleLocations[index % sampleLocations.length]
                  const rating = sampleRatings[index % sampleRatings.length]
                  const reviews = sampleReviews[index % sampleReviews.length]
                  const nextAvailable = sampleTimes[index % sampleTimes.length]
                  const initials = `${doctor.firstName[0]}${doctor.lastName[0]}`.toUpperCase()
                  
                  return (
                    <Card key={doctor.id} className="border-border/50 transition-shadow hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                            {initials}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              Dr. {doctor.firstName} {doctor.lastName}
                            </h3>
                            <p className="text-sm text-primary">{specialty}</p>
                            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              {location}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            <span className="text-sm font-medium text-foreground">{rating}</span>
                            <span className="text-sm text-muted-foreground">({reviews} avis)</span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                            <Calendar className="mr-1 h-3 w-3" />
                            {nextAvailable}
                          </Badge>
                          <Button size="sm" asChild>
                            <Link href="/register">Prendre RDV</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    {loading ? "Chargement des médecins..." : "Aucun médecin ne correspond à votre recherche."}
                  </p>
                </div>
              )}
            </div>

          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}

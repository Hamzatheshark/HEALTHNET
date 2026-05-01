"use client"

import { useState } from "react"
import Link from "next/link"
import { PublicNavbar } from "@/components/public-navbar"
import { PublicFooter } from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, Calendar } from "lucide-react"

const doctors = [
  {
    id: 1,
    name: "Dr. Sophie Bernard",
    specialty: "Medecine generale",
    location: "Paris 15e",
    rating: 4.9,
    reviews: 127,
    nextAvailable: "Aujourd hui",
    image: "SB",
  },
  {
    id: 2,
    name: "Dr. Pierre Martin",
    specialty: "Cardiologie",
    location: "Paris 8e",
    rating: 4.8,
    reviews: 89,
    nextAvailable: "Demain",
    image: "PM",
  },
  {
    id: 3,
    name: "Dr. Marie Leroy",
    specialty: "Dermatologie",
    location: "Paris 16e",
    rating: 4.7,
    reviews: 156,
    nextAvailable: "Dans 2 jours",
    image: "ML",
  },
  {
    id: 4,
    name: "Dr. Jean Dubois",
    specialty: "Pediatrie",
    location: "Paris 12e",
    rating: 4.9,
    reviews: 203,
    nextAvailable: "Aujourd hui",
    image: "JD",
  },
  {
    id: 5,
    name: "Dr. Claire Moreau",
    specialty: "Ophtalmologie",
    location: "Paris 5e",
    rating: 4.6,
    reviews: 78,
    nextAvailable: "Dans 3 jours",
    image: "CM",
  },
  {
    id: 6,
    name: "Dr. Antoine Petit",
    specialty: "Orthopedie",
    location: "Paris 14e",
    rating: 4.8,
    reviews: 112,
    nextAvailable: "Demain",
    image: "AP",
  },
]

const specialties = [
  "Tous",
  "Medecine generale",
  "Cardiologie",
  "Dermatologie",
  "Pediatrie",
  "Ophtalmologie",
  "Orthopedie",
]

export default function MedecinsPage() {
  const [search, setSearch] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("Tous")

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(search.toLowerCase())
    const matchesSpecialty = selectedSpecialty === "Tous" || doctor.specialty === selectedSpecialty
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
              {specialties.map((specialty) => (
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
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="border-border/50 transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                        {doctor.image}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                        <p className="text-sm text-primary">{doctor.specialty}</p>
                        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {doctor.location}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="text-sm font-medium text-foreground">{doctor.rating}</span>
                        <span className="text-sm text-muted-foreground">({doctor.reviews} avis)</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                        <Calendar className="mr-1 h-3 w-3" />
                        {doctor.nextAvailable}
                      </Badge>
                      <Button size="sm" asChild>
                        <Link href="/register">Prendre RDV</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="mt-12 text-center">
                <p className="text-muted-foreground">Aucun medecin ne correspond a votre recherche.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}

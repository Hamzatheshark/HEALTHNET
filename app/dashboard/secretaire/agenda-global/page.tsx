"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, ChevronLeft, ChevronRight, User, Clock, Edit, X, Plus, Search } from "lucide-react"

const doctors = [
  { id: "all", name: "Tous les medecins" },
  { id: "dr-bernard", name: "Dr. Sophie Bernard" },
  { id: "dr-martin", name: "Dr. Pierre Martin" },
  { id: "dr-leroy", name: "Dr. Marie Leroy" },
]

const appointments = [
  { id: 1, time: "09:00", patient: "Jean Dupont", doctor: "Dr. Sophie Bernard", type: "Consultation", status: "confirme" },
  { id: 2, time: "09:30", patient: "Marie Curie", doctor: "Dr. Pierre Martin", type: "Suivi", status: "confirme" },
  { id: 3, time: "10:00", patient: "Pierre Leroy", doctor: "Dr. Sophie Bernard", type: "Premiere visite", status: "en-attente" },
  { id: 4, time: "10:30", patient: "Sophie Martin", doctor: "Dr. Marie Leroy", type: "Consultation", status: "confirme" },
  { id: 5, time: "11:00", patient: "Paul Dubois", doctor: "Dr. Sophie Bernard", type: "Suivi", status: "confirme" },
  { id: 6, time: "14:00", patient: "Claire Bernard", doctor: "Dr. Pierre Martin", type: "Consultation", status: "confirme" },
  { id: 7, time: "14:30", patient: "Luc Moreau", doctor: "Dr. Marie Leroy", type: "Premiere visite", status: "en-attente" },
  { id: 8, time: "15:00", patient: "Emma Petit", doctor: "Dr. Sophie Bernard", type: "Teleconsultation", status: "confirme" },
]

const statusColors = {
  confirme: "bg-secondary/10 text-secondary border-secondary/30",
  "en-attente": "bg-accent/10 text-accent border-accent/30",
  annule: "bg-destructive/10 text-destructive border-destructive/30",
}

export default function SecretaryAgendaPage() {
  const [selectedDoctor, setSelectedDoctor] = useState("all")
  const [search, setSearch] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 14))

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  }

  const filteredAppointments = appointments.filter((apt) => {
    const matchesDoctor = selectedDoctor === "all" || apt.doctor.toLowerCase().includes(selectedDoctor.replace("dr-", ""))
    const matchesSearch = apt.patient.toLowerCase().includes(search.toLowerCase())
    return matchesDoctor && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agenda global</h1>
          <p className="text-muted-foreground">Gerez les rendez-vous de tous les medecins</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau RDV
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Date Navigation */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setDate(newDate.getDate() - 1)
              setCurrentDate(newDate)
            }}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <p className="text-lg font-semibold capitalize text-foreground">{formatDate(currentDate)}</p>
              <p className="text-sm text-muted-foreground">{filteredAppointments.length} rendez-vous</p>
            </div>
            <Button variant="outline" size="icon" onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setDate(newDate.getDate() + 1)
              setCurrentDate(newDate)
            }}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.map((apt) => (
          <Card key={apt.id} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-medium text-primary">
                    {apt.time}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{apt.patient}</h3>
                      <Badge variant="outline" className={statusColors[apt.status as keyof typeof statusColors]}>
                        {apt.status === "confirme" ? "Confirme" : apt.status === "en-attente" ? "En attente" : "Annule"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{apt.doctor} - {apt.type}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                    <X className="mr-2 h-4 w-4" />
                    Annuler
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAppointments.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">Aucun rendez-vous trouve</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, User, Video, X, CheckCircle } from "lucide-react"

const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sophie Bernard",
    specialty: "Medecine generale",
    date: "18 Avril 2026",
    time: "09:30",
    type: "cabinet",
    location: "15 Rue de la Sante, Paris 15e",
    status: "confirme",
  },
  {
    id: 2,
    doctor: "Dr. Pierre Martin",
    specialty: "Cardiologie",
    date: "25 Avril 2026",
    time: "14:00",
    type: "teleconsultation",
    location: "En ligne",
    status: "en-attente",
  },
]

const pastAppointments = [
  {
    id: 3,
    doctor: "Dr. Sophie Bernard",
    specialty: "Medecine generale",
    date: "10 Mars 2026",
    time: "10:00",
    type: "cabinet",
    status: "termine",
  },
  {
    id: 4,
    doctor: "Dr. Marie Leroy",
    specialty: "Dermatologie",
    date: "15 Fevrier 2026",
    time: "11:30",
    type: "cabinet",
    status: "termine",
  },
]

const statusColors = {
  confirme: "bg-secondary/10 text-secondary border-secondary/20",
  "en-attente": "bg-accent/10 text-accent border-accent/20",
  termine: "bg-muted text-muted-foreground border-muted",
  annule: "bg-destructive/10 text-destructive border-destructive/20",
}

const statusLabels = {
  confirme: "Confirme",
  "en-attente": "En attente",
  termine: "Termine",
  annule: "Annule",
}

export default function PatientAppointmentsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes rendez-vous</h1>
          <p className="text-muted-foreground">Gerez vos consultations medicales</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Nouveau rendez-vous
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">A venir ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="past">Passes ({pastAppointments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="space-y-4">
            {upcomingAppointments.map((apt) => (
              <Card key={apt.id} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{apt.doctor}</h3>
                        <p className="text-sm text-primary">{apt.specialty}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {apt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {apt.time}
                          </span>
                          <span className="flex items-center gap-1">
                            {apt.type === "teleconsultation" ? (
                              <Video className="h-4 w-4" />
                            ) : (
                              <MapPin className="h-4 w-4" />
                            )}
                            {apt.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={statusColors[apt.status as keyof typeof statusColors]}>
                        {apt.status === "confirme" && <CheckCircle className="mr-1 h-3 w-3" />}
                        {statusLabels[apt.status as keyof typeof statusLabels]}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="space-y-4">
            {pastAppointments.map((apt) => (
              <Card key={apt.id} className="border-border/50 bg-muted/30">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{apt.doctor}</h3>
                        <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                        <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {apt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {apt.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={statusColors[apt.status as keyof typeof statusColors]}>
                        {statusLabels[apt.status as keyof typeof statusLabels]}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Voir details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

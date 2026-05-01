"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, User, Video, MapPin, X, Check } from "lucide-react"

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
]

const appointments = [
  { time: "09:00", duration: 30, patient: "Jean Dupont", type: "Consultation", status: "confirme" },
  { time: "10:30", duration: 30, patient: "Marie Martin", type: "Suivi", status: "confirme" },
  { time: "11:30", duration: 60, patient: "Pierre Leroy", type: "Premiere consultation", status: "en-attente" },
  { time: "14:00", duration: 30, patient: "Sophie Bernard", type: "Teleconsultation", status: "confirme", teleconsultation: true },
  { time: "16:00", duration: 30, patient: "Paul Dubois", type: "Consultation", status: "confirme" },
]

const blockedSlots = ["12:00", "17:30"]

const statusColors = {
  confirme: "bg-secondary/10 border-secondary/30 text-secondary",
  "en-attente": "bg-accent/10 border-accent/30 text-accent",
}

export default function DoctorAgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 14)) // April 14, 2026
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  }

  const getAppointmentForSlot = (slot: string) => {
    return appointments.find(apt => apt.time === slot)
  }

  const isBlocked = (slot: string) => blockedSlots.includes(slot)

  const prevDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 1)
    setCurrentDate(newDate)
  }

  const nextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 1)
    setCurrentDate(newDate)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
          <p className="text-muted-foreground">Gerez vos creneaux et rendez-vous</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Bloquer un creneau
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Nouveau RDV
          </Button>
        </div>
      </div>

      {/* Date Navigation */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={prevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <p className="text-lg font-semibold capitalize text-foreground">{formatDate(currentDate)}</p>
              <p className="text-sm text-muted-foreground">{appointments.length} rendez-vous</p>
            </div>
            <Button variant="outline" size="icon" onClick={nextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Time Slots */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle>Creneaux horaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {timeSlots.map((slot) => {
                const appointment = getAppointmentForSlot(slot)
                const blocked = isBlocked(slot)

                return (
                  <div
                    key={slot}
                    className={`flex items-center gap-4 rounded-lg border p-3 transition-colors ${
                      appointment
                        ? statusColors[appointment.status as keyof typeof statusColors]
                        : blocked
                        ? "bg-muted/50 border-border"
                        : "border-border hover:bg-muted/30 cursor-pointer"
                    }`}
                    onClick={() => !appointment && !blocked && setSelectedSlot(slot)}
                  >
                    <div className="flex h-10 w-16 items-center justify-center rounded bg-background text-sm font-medium">
                      {slot}
                    </div>

                    {appointment ? (
                      <div className="flex flex-1 items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{appointment.patient}</p>
                            <p className="flex items-center gap-1 text-sm opacity-80">
                              {appointment.teleconsultation ? (
                                <><Video className="h-3 w-3" /> Teleconsultation</>
                              ) : (
                                <><MapPin className="h-3 w-3" /> Cabinet</>
                              )}
                              <span className="mx-1">-</span>
                              {appointment.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {appointment.status === "en-attente" && (
                            <>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Check className="h-4 w-4 text-secondary" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <X className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            Details
                          </Button>
                        </div>
                      </div>
                    ) : blocked ? (
                      <div className="flex flex-1 items-center justify-between">
                        <span className="text-muted-foreground">Creneau bloque</span>
                        <Button size="sm" variant="outline">
                          Debloquer
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-1 items-center justify-between">
                        <span className="text-muted-foreground">Disponible</span>
                        <Button size="sm" variant="ghost">
                          + Ajouter
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Resume du jour</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rendez-vous</span>
                <span className="font-semibold text-foreground">{appointments.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Confirmes</span>
                <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                  {appointments.filter(a => a.status === "confirme").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">En attente</span>
                <Badge variant="outline" className="border-accent/30 text-accent">
                  {appointments.filter(a => a.status === "en-attente").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Teleconsultations</span>
                <span className="font-semibold text-foreground">
                  {appointments.filter(a => a.teleconsultation).length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un creneau
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Bloquer une periode
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Voir la semaine
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

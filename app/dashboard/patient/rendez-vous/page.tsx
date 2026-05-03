"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, User, Video, X, CheckCircle, Edit3 } from "lucide-react"

type Appointment = {
  id: string
  date: string
  time: string
  type: string
  location?: string | null
  status: string
  reason?: string | null
  doctor: {
    id: string
    firstName: string
    lastName: string
    specialty: string | null
  }
}

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-secondary/10 text-secondary border-secondary/20",
  PENDING: "bg-accent/10 text-accent border-accent/20",
  en_attente: "bg-accent/10 text-accent border-accent/20",
  CONFIRME: "bg-secondary/10 text-secondary border-secondary/20",
  TERMINED: "bg-muted text-muted-foreground border-muted",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
  TERMINE: "bg-muted text-muted-foreground border-muted",
  annule: "bg-destructive/10 text-destructive border-destructive/20",
}

const statusLabels: Record<string, string> = {
  CONFIRMED: "Confirmé",
  PENDING: "En attente",
  en_attente: "En attente",
  CONFIRME: "Confirmé",
  TERMINED: "Terminé",
  CANCELLED: "Annulé",
  TERMINE: "Terminé",
  annule: "Annulé",
}

export default function PatientAppointmentsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [editDate, setEditDate] = useState("")
  const [editTime, setEditTime] = useState("")
  const [editReason, setEditReason] = useState("")
  const [savingEdit, setSavingEdit] = useState(false)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/appointments")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement des rendez-vous")
      }

      setAppointments(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setEditDate(new Date(appointment.date).toISOString().slice(0, 10))
    setEditTime(appointment.time)
    setEditReason(appointment.reason ?? "")
    setActiveTab("upcoming")
  }

  const handleSaveEdit = async () => {
    if (!editingAppointment) return

    setSavingEdit(true)
    setError("")

    try {
      const response = await fetch(`/api/appointments/${editingAppointment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: editDate,
          time: editTime,
          reason: editReason,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la modification")
      }

      setAppointments((prev) => prev.map((apt) => (apt.id === data.id ? data : apt)))
      setEditingAppointment(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur inconnue")
    } finally {
      setSavingEdit(false)
    }
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm("Voulez-vous vraiment annuler ce rendez-vous ?")) {
      return
    }

    setCancellingId(appointmentId)
    setError("")

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erreur lors de l'annulation")
      }

      setAppointments((prev) => prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "CANCELLED" } : apt)))
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur inconnue")
    } finally {
      setCancellingId(null)
    }
  }

  const getAppointmentDateTime = (apt: Appointment) => {
    const date = new Date(apt.date)
    const [hours, minutes] = apt.time.split(":").map(Number)
    date.setHours(hours, minutes, 0, 0)
    return date
  }

  const isPastAppointment = (apt: Appointment) => {
    const statusPast = ["TERMINE", "termine", "CANCELLED", "annule"].includes(apt.status)
    if (statusPast) {
      return true
    }

    return getAppointmentDateTime(apt).getTime() <= Date.now()
  }

  const upcomingAppointments = appointments
    .filter((apt) => !isPastAppointment(apt))
    .sort((a, b) => getAppointmentDateTime(a).getTime() - getAppointmentDateTime(b).getTime())

  const pastAppointments = appointments
    .filter((apt) => isPastAppointment(apt))
    .sort((a, b) => getAppointmentDateTime(b).getTime() - getAppointmentDateTime(a).getTime())

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes rendez-vous</h1>
          <p className="text-muted-foreground">Gérez vos consultations médicales</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-border/50 bg-background p-8 text-center text-muted-foreground">
          Chargement des rendez-vous...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">{error}</div>
      ) : (
        <>
          {editingAppointment && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Modifier le rendez-vous</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="edit-date" className="text-sm font-medium text-foreground">Date</label>
                    <input
                      id="edit-date"
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full rounded-md border border-border px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-time" className="text-sm font-medium text-foreground">Heure</label>
                    <input
                      id="edit-time"
                      type="time"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                      className="w-full rounded-md border border-border px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-reason" className="text-sm font-medium text-foreground">Raison</label>
                    <input
                      id="edit-reason"
                      type="text"
                      value={editReason}
                      onChange={(e) => setEditReason(e.target.value)}
                      className="w-full rounded-md border border-border px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleSaveEdit} disabled={savingEdit}>
                    {savingEdit ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingAppointment(null)}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="upcoming">À venir ({upcomingAppointments.length})</TabsTrigger>
              <TabsTrigger value="past">Passés ({pastAppointments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              <div className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <div className="rounded-lg border border-border/50 bg-background p-8 text-center text-muted-foreground">
                    Aucun rendez-vous à venir.
                  </div>
                ) : (
                  upcomingAppointments.map((apt) => (
                    <Card key={apt.id} className="border-border/50">
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <User className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {apt.doctor.firstName} {apt.doctor.lastName}
                              </h3>
                              <p className="text-sm text-primary">{apt.doctor.specialty}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(apt.date).toLocaleDateString("fr-FR")}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {apt.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  {apt.type === "TELECONSULTATION" ? (
                                    <Video className="h-4 w-4" />
                                  ) : (
                                    <MapPin className="h-4 w-4" />
                                  )}
                                  {apt.location || (apt.type === "TELECONSULTATION" ? "En ligne" : "Cabinet")}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={statusColors[apt.status] ?? "bg-muted text-muted-foreground border-muted"}>
                              {statusLabels[apt.status] ?? apt.status}
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => handleEditClick(apt)}>
                              <Edit3 className="mr-2 h-4 w-4" />Modifier
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleCancelAppointment(apt.id)}
                              disabled={cancellingId === apt.id}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              <div className="space-y-4">
                {pastAppointments.length === 0 ? (
                  <div className="rounded-lg border border-border/50 bg-background p-8 text-center text-muted-foreground">
                    Aucun rendez-vous passé.
                  </div>
                ) : (
                  pastAppointments.map((apt) => (
                    <Card key={apt.id} className="border-border/50 bg-muted/30">
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                              <User className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {apt.doctor.firstName} {apt.doctor.lastName}
                              </h3>
                              <p className="text-sm text-muted-foreground">{apt.doctor.specialty}</p>
                              <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(apt.date).toLocaleDateString("fr-FR")}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {apt.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={statusColors[apt.status] ?? "bg-muted text-muted-foreground border-muted"}>
                              {statusLabels[apt.status] ?? apt.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              Voir détails
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

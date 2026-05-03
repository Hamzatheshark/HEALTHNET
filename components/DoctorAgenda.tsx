"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, User, Video, MapPin, X, Check, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
]

const statusColors = {
  CONFIRME: "bg-secondary/10 border-secondary/30 text-secondary",
  PLANIFIE: "bg-accent/10 border-accent/30 text-accent",
  ANNULE: "bg-destructive/10 border-destructive/30 text-destructive",
  TERMINE: "bg-primary/10 border-primary/30 text-primary",
  BLOQUE: "bg-muted border-muted-foreground/30 text-muted-foreground",
}

interface DoctorAgendaProps {
  doctorId?: string // Optional, if empty uses current doctor session
  isSecretary?: boolean
}

export function DoctorAgenda({ doctorId, isSecretary = false }: DoctorAgendaProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [patients, setPatients] = useState<any[]>([])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const url = `/api/medecin/agenda?date=${currentDate.toISOString()}${doctorId ? `&doctorId=${doctorId}` : ""}`
      const response = await fetch(url)
      const data = await response.json()
      if (response.ok) {
        setAppointments(data)
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients")
      const data = await response.json()
      if (response.ok) setPatients(data)
    } catch (error) {
      console.error("Error fetching patients:", error)
    }
  }

  useEffect(() => {
    fetchAppointments()
    fetchPatients()
  }, [currentDate, doctorId])

  const handleConfirm = async (id: string) => {
    try {
      const response = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "CONFIRME" })
      })
      if (response.ok) {
        toast.success("Rendez-vous confirme")
        fetchAppointments()
      }
    } catch (error) {
      toast.error("Erreur")
    }
  }

  const handleCancel = async (id: string, isUnblock = false) => {
    if (!isUnblock && !confirm("Annuler ce rendez-vous ?")) return
    try {
      const response = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "ANNULE" })
      })
      if (response.ok) {
        toast.success(isUnblock ? "Creneau debloque" : "Rendez-vous annule")
        fetchAppointments()
      }
    } catch (error) {
      toast.error("Erreur")
    }
  }

  const handleBlockSlot = async (slot: string) => {
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: doctorId || "current", 
          date: currentDate.toISOString().split('T')[0],
          time: slot,
          type: "IN_PERSON",
          reason: "BLOQUE",
        })
      })
      if (response.ok) {
        toast.success(`Creneau ${slot} bloque`)
        fetchAppointments()
      }
    } catch (error) {
      toast.error("Erreur")
    }
  }

  const handleAddManual = async () => {
    if (!selectedSlot || !selectedPatientId) return
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: doctorId || "current",
          patientId: selectedPatientId,
          date: currentDate.toISOString().split('T')[0],
          time: selectedSlot,
          type: "IN_PERSON",
          reason: "RDV Manuel",
          status: "CONFIRME"
        })
      })
      if (response.ok) {
        toast.success("Rendez-vous ajoute")
        setIsAddOpen(false)
        fetchAppointments()
      }
    } catch (error) {
      toast.error("Erreur")
    }
  }

  const formatDate = (date: Date) => {
    return format(date, "EEEE d MMMM yyyy", { locale: fr })
  }

  const getAppointmentForSlot = (slot: string) => {
    return appointments.find(apt => apt.time === slot)
  }

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
      {/* Date Navigation */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={prevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <p className="text-lg font-semibold capitalize text-foreground">{formatDate(currentDate)}</p>
              <p className="text-sm text-muted-foreground">
                {appointments.filter(a => a.reason !== "BLOQUE").length} rendez-vous
              </p>
            </div>
            <Button variant="outline" size="icon" onClick={nextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle>Creneaux horaires</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-2">
                {timeSlots.map((slot) => {
                  const appointment = getAppointmentForSlot(slot)
                  const isBlocked = appointment?.reason === "BLOQUE"

                  return (
                    <div
                      key={slot}
                      className={`flex items-center gap-4 rounded-lg border p-3 transition-colors ${
                        appointment
                          ? statusColors[appointment.status as keyof typeof statusColors] || "border-border"
                          : "border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex h-10 w-16 items-center justify-center rounded bg-background text-sm font-medium">
                        {slot}
                      </div>

                      {isBlocked ? (
                        <div className="flex flex-1 items-center justify-between">
                          <span className="text-muted-foreground">Creneau bloque</span>
                          <Button size="sm" variant="outline" onClick={() => handleCancel(appointment.id, true)}>
                            Debloquer
                          </Button>
                        </div>
                      ) : appointment ? (
                        <div className="flex flex-1 items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{appointment.patient.firstName} {appointment.patient.lastName}</p>
                              <p className="flex items-center gap-1 text-sm opacity-80">
                                {appointment.type === "VIDEO" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                                {appointment.reason || "Consultation"}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {appointment.status === "PLANIFIE" && (
                              <>
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => handleConfirm(appointment.id)}>
                                  <Check className="h-4 w-4 text-secondary" />
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => handleCancel(appointment.id)}>
                                  <X className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-1 items-center justify-between">
                          <span className="text-muted-foreground">Disponible</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => { setSelectedSlot(slot); setIsAddOpen(true); }}>
                              + Ajouter
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleBlockSlot(slot)}>
                              Bloquer
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
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
                <span className="font-semibold text-foreground">
                  {appointments.filter(a => a.reason !== "BLOQUE").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Confirmes</span>
                <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                  {appointments.filter(a => a.status === "CONFIRME").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">En attente</span>
                <Badge variant="outline" className="border-accent/30 text-accent">
                  {appointments.filter(a => a.status === "PLANIFIE").length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Manual RDV Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau rendez-vous manuel ({selectedSlot})</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Patient</Label>
              <Select onValueChange={(v) => setSelectedPatientId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Annuler</Button>
            <Button onClick={handleAddManual} disabled={!selectedPatientId}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

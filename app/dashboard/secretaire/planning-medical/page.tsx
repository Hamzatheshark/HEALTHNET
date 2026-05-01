"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Lock, Unlock, ChevronLeft, ChevronRight, User, Clock } from "lucide-react"

const doctors = [
  { id: "dr-bernard", name: "Dr. Sophie Bernard", specialty: "Medecine generale" },
  { id: "dr-martin", name: "Dr. Pierre Martin", specialty: "Cardiologie" },
  { id: "dr-leroy", name: "Dr. Marie Leroy", specialty: "Dermatologie" },
]

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
]

const blockedSlots = {
  "dr-bernard": ["12:00", "17:30"],
  "dr-martin": ["08:00", "08:30", "17:00", "17:30"],
  "dr-leroy": ["11:30", "14:00"],
}

const bookedSlots = {
  "dr-bernard": ["09:00", "10:30", "14:00", "16:00"],
  "dr-martin": ["09:30", "10:00", "15:00"],
  "dr-leroy": ["09:00", "10:30", "15:30", "16:30"],
}

export default function SecretaryPlanningPage() {
  const [selectedDoctor, setSelectedDoctor] = useState("dr-bernard")
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 14))
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  }

  const isBlocked = (slot: string) => {
    return blockedSlots[selectedDoctor as keyof typeof blockedSlots]?.includes(slot)
  }

  const isBooked = (slot: string) => {
    return bookedSlots[selectedDoctor as keyof typeof bookedSlots]?.includes(slot)
  }

  const toggleSlotSelection = (slot: string) => {
    if (isBooked(slot)) return
    setSelectedSlots(prev => 
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    )
  }

  const currentDoctor = doctors.find(d => d.id === selectedDoctor)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Planning medical</h1>
          <p className="text-muted-foreground">Gerez les creneaux des medecins</p>
        </div>
        {selectedSlots.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedSlots([])}>
              Deselectionner ({selectedSlots.length})
            </Button>
            <Button variant="destructive">
              <Lock className="mr-2 h-4 w-4" />
              Bloquer
            </Button>
            <Button variant="secondary">
              <Unlock className="mr-2 h-4 w-4" />
              Debloquer
            </Button>
          </div>
        )}
      </div>

      {/* Doctor Selection */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {doc.name} - {doc.specialty}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setDate(newDate.getDate() - 1)
                setCurrentDate(newDate)
              }}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-[200px] text-center">
                <p className="font-medium capitalize text-foreground">{formatDate(currentDate)}</p>
              </div>
              <Button variant="outline" size="icon" onClick={() => {
                const newDate = new Date(currentDate)
                newDate.setDate(newDate.getDate() + 1)
                setCurrentDate(newDate)
              }}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Time Slots Grid */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Creneaux de {currentDoctor?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => {
                const blocked = isBlocked(slot)
                const booked = isBooked(slot)
                const selected = selectedSlots.includes(slot)

                return (
                  <button
                    key={slot}
                    onClick={() => toggleSlotSelection(slot)}
                    disabled={booked}
                    className={`flex h-14 flex-col items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                      booked
                        ? "cursor-not-allowed border-primary/30 bg-primary/10 text-primary"
                        : blocked
                        ? "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                        : selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <span>{slot}</span>
                    {booked && <span className="text-xs">Occupe</span>}
                    {blocked && !booked && <span className="text-xs">Bloque</span>}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend & Summary */}
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Legende</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border border-border bg-background" />
                <span className="text-sm text-muted-foreground">Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border border-primary/30 bg-primary/10" />
                <span className="text-sm text-muted-foreground">Occupe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border border-destructive/30 bg-destructive/10" />
                <span className="text-sm text-muted-foreground">Bloque</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border border-primary bg-primary" />
                <span className="text-sm text-muted-foreground">Selectionne</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Resume du jour</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total creneaux</span>
                <span className="font-medium text-foreground">{timeSlots.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Occupes</span>
                <Badge className="bg-primary/10 text-primary">
                  {bookedSlots[selectedDoctor as keyof typeof bookedSlots]?.length || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bloques</span>
                <Badge variant="destructive">
                  {blockedSlots[selectedDoctor as keyof typeof blockedSlots]?.length || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Disponibles</span>
                <Badge className="bg-secondary/10 text-secondary">
                  {timeSlots.length - 
                    (bookedSlots[selectedDoctor as keyof typeof bookedSlots]?.length || 0) - 
                    (blockedSlots[selectedDoctor as keyof typeof blockedSlots]?.length || 0)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

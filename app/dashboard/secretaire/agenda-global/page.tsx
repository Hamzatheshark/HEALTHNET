"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, ChevronLeft, ChevronRight, User, Clock, Edit, X, Plus, Search, Check, Loader2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const statusColors = {
  CONFIRME: "bg-secondary/10 text-secondary border-secondary/30",
  PLANIFIE: "bg-accent/10 text-accent border-accent/30",
  ANNULE: "bg-destructive/10 text-destructive border-destructive/30",
  TERMINE: "bg-primary/10 text-primary border-primary/30",
}

export default function SecretaryAgendaPage() {
  const router = useRouter()
  const [doctors, setDoctors] = useState<any[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState("all")
  const [search, setSearch] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false)
  const [creatingPatient, setCreatingPatient] = useState(false)

  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    cin: "",
    password: "Password123",
  })

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/secretaire/managed-doctors")
      const data = await response.json()
      if (response.ok) setDoctors(data)
    } catch (error) {
      console.error("Error fetching doctors:", error)
    }
  }

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const url = `/api/medecin/agenda?date=${currentDate.toISOString()}&doctorId=${selectedDoctor}`
      const response = await fetch(url)
      const data = await response.json()
      if (response.ok) setAppointments(data)
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePatientAndBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingPatient(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPatient, role: "PATIENT" }),
      })
      
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Erreur")
      
      toast.success("Patient cree. Redirection vers le planning...")
      setIsNewPatientOpen(false)
      
      // Redirect to planning with patient ID and name
      router.push(`/dashboard/secretaire/planning-medical?patientId=${data.user.id}&patientName=${encodeURIComponent(data.user.firstName + ' ' + data.user.lastName)}`)
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la creation")
    } finally {
      setCreatingPatient(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [currentDate, selectedDoctor])

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      if (response.ok) {
        toast.success(`Rendez-vous ${status.toLowerCase()}`)
        fetchAppointments()
      }
    } catch (error) {
      toast.error("Erreur lors de la mise a jour")
    }
  }

  const formatDate = (date: Date) => {
    return format(date, "EEEE d MMMM yyyy", { locale: fr })
  }

  const filteredAppointments = appointments.filter((apt) => {
    const matchesDoctor = selectedDoctor === "all" || apt.doctorId === selectedDoctor
    const patientName = `${apt.patient.firstName} ${apt.patient.lastName}`.toLowerCase()
    const matchesSearch = patientName.includes(search.toLowerCase())
    return matchesDoctor && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agenda global</h1>
          <p className="text-muted-foreground">Gerez les rendez-vous de tous les medecins</p>
        </div>
        <Dialog open={isNewPatientOpen} onOpenChange={setIsNewPatientOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              NOUVEAU RDV
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau Patient & Rendez-vous</DialogTitle>
              <DialogDescription>
                Créez le compte du patient pour ensuite lui choisir un créneau.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePatientAndBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prenom</Label>
                  <Input required value={newPatient.firstName} onChange={e => setNewPatient({...newPatient, firstName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input required value={newPatient.lastName} onChange={e => setNewPatient({...newPatient, lastName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" required value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Telephone</Label>
                <Input type="tel" required value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>CIN</Label>
                <Input value={newPatient.cin} onChange={e => setNewPatient({...newPatient, cin: e.target.value})} />
              </div>
              <Button type="submit" className="w-full" disabled={creatingPatient}>
                {creatingPatient ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                Créer et Planifier
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
                <SelectValue placeholder="Tous les medecins" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les medecins</SelectItem>
                {doctors.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>Dr. {doc.lastName}</SelectItem>
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
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">Aucun rendez-vous trouve</p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((apt) => (
            <Card key={apt.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-medium text-primary">
                      {apt.time}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{apt.patient.firstName} {apt.patient.lastName}</h3>
                        <Badge variant="outline" className={statusColors[apt.status as keyof typeof statusColors]}>
                          {apt.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Dr. {apt.doctor?.lastName || "Inconnu"} - {apt.reason || "Consultation"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {apt.status === "PLANIFIE" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-secondary hover:bg-secondary/10"
                        onClick={() => handleUpdateStatus(apt.id, "CONFIRME")}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Confirmer
                      </Button>
                    )}
                    {apt.status !== "ANNULE" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleUpdateStatus(apt.id, "ANNULE")}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Annuler
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}


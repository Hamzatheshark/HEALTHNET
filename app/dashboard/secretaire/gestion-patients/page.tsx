"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, UserPlus, Edit, Phone, Mail, Calendar, User, Loader2, FileText } from "lucide-react"
import { MedicalRecordForm } from "@/components/MedicalRecordForm"
import { toast } from "sonner"

export default function SecretaryPatientsPage() {
  const [search, setSearch] = useState("")
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isRecordOpen, setIsRecordOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  
  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "Password123", // Default password for new patients created by secretary
  })

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/patients")
      const data = await response.json()
      if (response.ok) {
        setPatients(data)
      }
    } catch (error) {
      console.error("Error fetching patients:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const filteredPatients = patients.filter((patient) =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    patient.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleNewPatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value })
  }

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPatient, role: "PATIENT" }),
      })
      
      if (!response.ok) throw new Error("Erreur lors de la creation")
      
      toast.success("Patient cree avec succes")
      setDialogOpen(false)
      setNewPatient({ firstName: "", lastName: "", email: "", phone: "", birthDate: "", password: "Password123" })
      fetchPatients()
    } catch (error) {
      toast.error("Erreur lors de la creation du patient")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des patients</h1>
          <p className="text-muted-foreground">{patients.length} patients enregistres</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nouveau patient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Creer un compte patient</DialogTitle>
              <DialogDescription>
                Renseignez les informations du nouveau patient
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prenom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={newPatient.firstName}
                    onChange={handleNewPatientChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={newPatient.lastName}
                    onChange={handleNewPatientChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newPatient.email}
                  onChange={handleNewPatientChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telephone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={newPatient.phone}
                  onChange={handleNewPatientChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Date de naissance</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={newPatient.birthDate}
                  onChange={handleNewPatientChange}
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1">Creer le compte</Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <div className="space-y-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {patient.firstName[0]}{patient.lastName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{patient.firstName} {patient.lastName}</h3>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-muted-foreground sm:grid-cols-2">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {patient.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {patient.phone || "-"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Ne(e) le {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString() : "Non renseignee"}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        Role: {patient.role}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isRecordOpen && selectedPatient?.id === patient.id} onOpenChange={(open) => {
                    setIsRecordOpen(open)
                    if (open) setSelectedPatient(patient)
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Dossier
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Dossier Medical - {patient.firstName} {patient.lastName}</DialogTitle>
                      </DialogHeader>
                      <MedicalRecordForm 
                        patientId={patient.id} 
                        initialData={patient.medicalRecord}
                        onSuccess={() => {
                          setIsRecordOpen(false)
                          fetchPatients()
                        }} 
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <Button size="sm" asChild>
                    <a href={`/dashboard/secretaire/agenda-global?patient=${patient.id}`}>
                      <Calendar className="mr-2 h-4 w-4" />
                      RDV
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


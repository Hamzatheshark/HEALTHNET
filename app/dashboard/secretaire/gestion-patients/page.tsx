"use client"

import { useState } from "react"
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
import { Search, UserPlus, Edit, Phone, Mail, Calendar, User } from "lucide-react"

const patients = [
  {
    id: 1,
    name: "Jean Dupont",
    email: "jean.dupont@email.fr",
    phone: "06 12 34 56 78",
    birthDate: "15/05/1975",
    registeredDate: "10/01/2024",
    lastVisit: "10/04/2026",
    status: "actif",
  },
  {
    id: 2,
    name: "Marie Martin",
    email: "marie.martin@email.fr",
    phone: "06 98 76 54 32",
    birthDate: "22/08/1982",
    registeredDate: "15/03/2023",
    lastVisit: "05/04/2026",
    status: "actif",
  },
  {
    id: 3,
    name: "Pierre Leroy",
    email: "pierre.leroy@email.fr",
    phone: "06 11 22 33 44",
    birthDate: "03/12/1990",
    registeredDate: "01/04/2026",
    lastVisit: "01/04/2026",
    status: "nouveau",
  },
  {
    id: 4,
    name: "Sophie Bernard",
    email: "sophie.bernard@email.fr",
    phone: "06 55 66 77 88",
    birthDate: "18/03/1968",
    registeredDate: "20/06/2022",
    lastVisit: "28/03/2026",
    status: "actif",
  },
]

const statusColors = {
  actif: "bg-secondary/10 text-secondary",
  nouveau: "bg-primary/10 text-primary",
  inactif: "bg-muted text-muted-foreground",
}

export default function SecretaryPatientsPage() {
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
  })

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase()) ||
    patient.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleNewPatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value })
  }

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault()
    setDialogOpen(false)
    setNewPatient({ firstName: "", lastName: "", email: "", phone: "", birthDate: "" })
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
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
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
                    {patient.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{patient.name}</h3>
                      <Badge className={statusColors[patient.status as keyof typeof statusColors]}>
                        {patient.status === "nouveau" ? "Nouveau" : patient.status === "actif" ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {patient.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {patient.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Ne(e) le {patient.birthDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        Inscrit le {patient.registeredDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                  <Button size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Prendre RDV
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

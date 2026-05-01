"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, User, FileText, Calendar, Phone, Mail, ChevronRight } from "lucide-react"

const patients = [
  {
    id: 1,
    name: "Jean Dupont",
    birthDate: "15/05/1975",
    phone: "06 12 34 56 78",
    email: "jean.dupont@email.fr",
    lastVisit: "10/04/2026",
    nextAppointment: "18/04/2026",
    conditions: ["Hypertension"],
  },
  {
    id: 2,
    name: "Marie Martin",
    birthDate: "22/08/1982",
    phone: "06 98 76 54 32",
    email: "marie.martin@email.fr",
    lastVisit: "05/04/2026",
    nextAppointment: "14/04/2026",
    conditions: ["Diabete type 2", "Asthme"],
  },
  {
    id: 3,
    name: "Pierre Leroy",
    birthDate: "03/12/1990",
    phone: "06 11 22 33 44",
    email: "pierre.leroy@email.fr",
    lastVisit: "01/04/2026",
    nextAppointment: null,
    conditions: [],
  },
  {
    id: 4,
    name: "Sophie Bernard",
    birthDate: "18/03/1968",
    phone: "06 55 66 77 88",
    email: "sophie.bernard@email.fr",
    lastVisit: "28/03/2026",
    nextAppointment: "20/04/2026",
    conditions: ["Arthrose"],
  },
  {
    id: 5,
    name: "Paul Dubois",
    birthDate: "07/09/1955",
    phone: "06 99 88 77 66",
    email: "paul.dubois@email.fr",
    lastVisit: "15/03/2026",
    nextAppointment: "14/04/2026",
    conditions: ["Hypertension", "Cholesterol"],
  },
]

export default function DoctorPatientsPage() {
  const [search, setSearch] = useState("")

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase()) ||
    patient.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground">{patients.length} patients enregistres</p>
        </div>
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
          <Card key={patient.id} className="border-border/50 transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {patient.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">Ne(e) le {patient.birthDate}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {patient.conditions.length > 0 ? (
                        patient.conditions.map((condition) => (
                          <Badge key={condition} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary text-xs">
                          Aucune condition
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:gap-6">
                  <div className="grid grid-cols-2 gap-4 text-sm lg:flex lg:gap-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate max-w-[150px]">{patient.email}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Derniere visite</p>
                      <p className="font-medium text-foreground">{patient.lastVisit}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Prochain RDV</p>
                      <p className={`font-medium ${patient.nextAppointment ? "text-primary" : "text-muted-foreground"}`}>
                        {patient.nextAppointment || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Dossier
                    </Button>
                    <Button size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      RDV
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <User className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">Aucun patient trouve</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

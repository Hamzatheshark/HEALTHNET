"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, User, FileText, Calendar, Phone, Mail, ChevronRight, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MedicalRecordForm } from "@/components/MedicalRecordForm"

export default function DoctorPatientsPage() {
  const [search, setSearch] = useState("")
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isRecordOpen, setIsRecordOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const fetchPatients = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/patients", { cache: "no-store" })
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
                    {patient.firstName[0]}{patient.lastName[0]}
                  </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{patient.firstName} {patient.lastName}</h3>
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        <p className="text-sm text-muted-foreground">Ne(e) le {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString() : "Non renseignee"}</p>
                        <p className="text-sm text-muted-foreground">CIN: {patient.cin || "Non renseignee"}</p>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {patient.medicalRecord?.chronicDiseases ? (
                          patient.medicalRecord.chronicDiseases.split(",").map((condition: string) => (
                            <Badge key={condition} variant="outline" className="text-xs">
                              {condition.trim()}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary" className="bg-secondary/10 text-secondary text-xs">
                            Aucun antecedent
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:gap-6">
                    <div className="grid grid-cols-2 gap-4 text-sm lg:flex lg:gap-6">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{patient.phone || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate max-w-[150px]">{patient.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog open={isRecordOpen && selectedPatient?.id === patient.id} onOpenChange={(open) => {
                        setIsRecordOpen(open)
                        if (open) {
                          setSelectedPatient(patient)
                          setIsEditMode(false)
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Dossier
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <DialogTitle>Dossier Medical - {patient.firstName} {patient.lastName}</DialogTitle>
                            <Button 
                              variant={isEditMode ? "ghost" : "outline"} 
                              size="sm" 
                              onClick={() => setIsEditMode(!isEditMode)}
                            >
                              {isEditMode ? "Annuler" : "Modifier"}
                            </Button>
                          </DialogHeader>
                          <MedicalRecordForm 
                            patientId={patient.id} 
                            initialData={{
                              ...(patient.medicalRecord || {}),
                              birthDate: patient.birthDate,
                              cin: patient.cin
                            }}
                            readOnly={!isEditMode}
                            onSuccess={() => {
                              setIsRecordOpen(false)
                              fetchPatients()
                            }} 
                          />
                        </DialogContent>
                      </Dialog>
                    
                    <Button size="sm" asChild>
                      <a href={`/dashboard/medecin/agenda?patient=${patient.id}`}>
                        <Calendar className="mr-2 h-4 w-4" />
                        RDV
                      </a>
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


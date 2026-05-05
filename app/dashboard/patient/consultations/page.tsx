"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, User, Stethoscope, Check, Pill } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Consultation = {
  id: string
  date: string
  reason: string
  diagnosis: string | null
  treatment: string | null
  prescription: boolean
  followUp: string | null
  doctor: {
    firstName: string
    lastName: string
    specialty: string | null
  }
  appointment: {
    date: string
    time: string
    type: string
  } | null
}

export default function PatientConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await fetch("/api/consultations")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Erreur lors du chargement des consultations")
        }

        setConsultations(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }

    fetchConsultations()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mes consultations</h1>
        <p className="text-muted-foreground">Historique de vos consultations medicales</p>
      </div>

      {loading ? (
        <div className="rounded-lg border border-border/50 bg-background p-8 text-center text-muted-foreground">
          Chargement des consultations...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
          {error}
        </div>
      ) : consultations.length === 0 ? (
        <div className="rounded-lg border border-border/50 bg-background p-8 text-center text-muted-foreground">
          Aucune consultation trouvee.
        </div>
      ) : (
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <Card key={consultation.id} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Stethoscope className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(consultation.date).toLocaleDateString("fr-FR")}
                        </Badge>
                        {consultation.prescription && (
                          <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                            Ordonnance
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground">{consultation.reason}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        Dr. {consultation.doctor.firstName} {consultation.doctor.lastName} - {consultation.doctor.specialty ?? "Specialite inconnue"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedConsultation(consultation)
                        setIsDetailsOpen(true)
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />Voir details
                    </Button>
                    {consultation.prescription && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/consultations/${consultation.id}/pdf`, { method: "POST" })
                            const data = await res.json()
                            if (res.ok) {
                              alert(`Ordonnance sauvegardée dans ${data.path}`)
                            } else {
                              alert((data.error || "Erreur lors de la génération") + (data.details ? ": " + data.details : ""))
                            }
                          } catch (e) {
                            alert("Erreur reseau")
                          }
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />Ordonnance
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Details de la consultation</DialogTitle>
          </DialogHeader>
          {selectedConsultation && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Docteur</p>
                  <p className="font-semibold text-lg">Dr. {selectedConsultation.doctor.firstName} {selectedConsultation.doctor.lastName}</p>
                  <p className="text-sm text-muted-foreground">{selectedConsultation.doctor.specialty}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedConsultation.date).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" /> Motif
                  </h4>
                  <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                    {selectedConsultation.reason}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <Check className="h-4 w-4 text-secondary" /> Diagnostic
                  </h4>
                  <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                    {selectedConsultation.diagnosis || "Aucun diagnostic renseigne"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <Pill className="h-4 w-4 text-accent" /> Traitement & Recommendations
                </h4>
                <p className="text-sm text-muted-foreground p-4 border rounded-lg whitespace-pre-wrap">
                  {selectedConsultation.treatment || "Aucun traitement specifie"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

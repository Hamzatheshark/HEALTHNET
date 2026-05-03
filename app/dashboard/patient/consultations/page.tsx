"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, User, Stethoscope } from "lucide-react"

type Consultation = {
  id: string
  date: string
  reason: string
  diagnosis: string | null
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
                      {consultation.appointment && (
                        <div className="rounded-lg bg-muted/50 p-3">
                          <p className="text-sm font-medium text-foreground">Rendez-vous lie</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(consultation.appointment.date).toLocaleDateString("fr-FR")} à {consultation.appointment.time} - {consultation.appointment.type === "TELECONSULTATION" ? "Téléconsultation" : "Consultation en cabinet"}
                          </p>
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Suivi:</span> {consultation.followUp ?? "Aucun suivi enregistre"}
                      </p>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-sm font-medium text-foreground">Diagnostic</p>
                        <p className="text-sm text-muted-foreground">{consultation.diagnosis ?? "Non renseigne"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />Voir details
                    </Button>
                    {consultation.prescription && (
                      <Button variant="outline" size="sm">
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
    </div>
  )
}

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, User, Stethoscope } from "lucide-react"

const consultations = [
  {
    id: 1,
    date: "10/03/2026",
    doctor: "Dr. Sophie Bernard",
    specialty: "Medecine generale",
    reason: "Consultation de routine",
    diagnosis: "Bonne sante generale - Renouvellement traitement asthme",
    prescription: true,
    followUp: "Dans 6 mois",
  },
  {
    id: 2,
    date: "15/02/2026",
    doctor: "Dr. Marie Leroy",
    specialty: "Dermatologie",
    reason: "Bilan dermatologique annuel",
    diagnosis: "Aucune anomalie detectee",
    prescription: false,
    followUp: "Dans 1 an",
  },
  {
    id: 3,
    date: "05/12/2025",
    doctor: "Dr. Sophie Bernard",
    specialty: "Medecine generale",
    reason: "Symptomes grippaux",
    diagnosis: "Syndrome grippal - Repos recommande",
    prescription: true,
    followUp: "Si persistance des symptomes",
  },
  {
    id: 4,
    date: "20/09/2025",
    doctor: "Dr. Pierre Martin",
    specialty: "Cardiologie",
    reason: "Bilan cardiaque preventif",
    diagnosis: "Bilan satisfaisant - Aucune anomalie",
    prescription: false,
    followUp: "Dans 2 ans",
  },
]

export default function PatientConsultationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mes consultations</h1>
        <p className="text-muted-foreground">Historique de vos consultations medicales</p>
      </div>

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
                        {consultation.date}
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
                      {consultation.doctor} - {consultation.specialty}
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm font-medium text-foreground">Diagnostic</p>
                      <p className="text-sm text-muted-foreground">{consultation.diagnosis}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Suivi:</span> {consultation.followUp}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Voir details
                  </Button>
                  {consultation.prescription && (
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Ordonnance
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

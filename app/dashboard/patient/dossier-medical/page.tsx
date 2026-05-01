import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Activity, Pill, AlertTriangle, User, Calendar, Droplet, Heart, Scale, Ruler } from "lucide-react"

const patientInfo = {
  name: "Marie Dupont",
  birthDate: "15/03/1985",
  bloodType: "A+",
  height: "165 cm",
  weight: "62 kg",
  allergies: ["Penicilline", "Arachides"],
  chronicConditions: ["Asthme leger"],
}

const medicalHistory = [
  {
    date: "10/03/2026",
    type: "Consultation",
    doctor: "Dr. Sophie Bernard",
    summary: "Consultation de routine - Renouvellement ordonnance",
    documents: ["Ordonnance", "Compte-rendu"],
  },
  {
    date: "15/02/2026",
    type: "Examen",
    doctor: "Dr. Marie Leroy",
    summary: "Bilan dermatologique annuel - RAS",
    documents: ["Compte-rendu"],
  },
  {
    date: "20/01/2026",
    type: "Analyse",
    doctor: "Laboratoire Central",
    summary: "Bilan sanguin complet",
    documents: ["Resultats analyses"],
  },
]

const currentTreatments = [
  {
    name: "Ventoline",
    dosage: "100 mcg",
    frequency: "Si besoin",
    prescribedBy: "Dr. Sophie Bernard",
    startDate: "01/01/2024",
  },
  {
    name: "Vitamine D",
    dosage: "1000 UI",
    frequency: "1x par jour",
    prescribedBy: "Dr. Sophie Bernard",
    startDate: "15/10/2025",
  },
]

const vaccinations = [
  { name: "COVID-19 (3e dose)", date: "15/12/2023", nextDue: "-" },
  { name: "Grippe", date: "10/10/2025", nextDue: "Octobre 2026" },
  { name: "Tetanos", date: "20/05/2021", nextDue: "Mai 2031" },
]

export default function MedicalFilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mon dossier medical</h1>
        <p className="text-muted-foreground">Consultez votre historique medical (lecture seule)</p>
      </div>

      {/* Patient Summary Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patient</p>
                <p className="font-medium text-foreground">{patientInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de naissance</p>
                <p className="font-medium text-foreground">{patientInfo.birthDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <Droplet className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Groupe sanguin</p>
                <p className="font-medium text-foreground">{patientInfo.bloodType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <Scale className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Poids / Taille</p>
                <p className="font-medium text-foreground">{patientInfo.weight} / {patientInfo.height}</p>
              </div>
            </div>
          </div>

          {/* Allergies & Conditions */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="font-medium text-destructive">Allergies</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {patientInfo.allergies.map((allergy) => (
                  <Badge key={allergy} variant="destructive">{allergy}</Badge>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-accent" />
                <span className="font-medium text-accent">Conditions chroniques</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {patientInfo.chronicConditions.map((condition) => (
                  <Badge key={condition} variant="outline" className="border-accent/50 text-accent">{condition}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">
            <Activity className="mr-2 h-4 w-4" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="treatments">
            <Pill className="mr-2 h-4 w-4" />
            Traitements
          </TabsTrigger>
          <TabsTrigger value="vaccinations">
            <FileText className="mr-2 h-4 w-4" />
            Vaccinations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-6">
          <div className="space-y-4">
            {medicalHistory.map((item, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.type}</Badge>
                        <span className="text-sm text-muted-foreground">{item.date}</span>
                      </div>
                      <p className="mt-2 font-medium text-foreground">{item.summary}</p>
                      <p className="text-sm text-muted-foreground">{item.doctor}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.documents.map((doc) => (
                        <Badge key={doc} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                          <FileText className="mr-1 h-3 w-3" />
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="treatments" className="mt-6">
          <div className="space-y-4">
            {currentTreatments.map((treatment, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{treatment.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {treatment.dosage} - {treatment.frequency}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Prescrit par: {treatment.prescribedBy}</p>
                      <p>Depuis: {treatment.startDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vaccinations" className="mt-6">
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Vaccin</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Prochain rappel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vaccinations.map((vax, index) => (
                      <tr key={index} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 text-sm text-foreground">{vax.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{vax.date}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{vax.nextDue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

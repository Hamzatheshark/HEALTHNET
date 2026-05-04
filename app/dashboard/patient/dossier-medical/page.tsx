"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Activity, Pill, AlertTriangle, User, Calendar, Droplet, Heart, Scale, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"

const defaultPatientInfo = {
  name: "Patient",
  birthDate: "15/03/1985",
  bloodType: "A+",
  height: "165 cm",
  weight: "62 kg",
  allergies: ["Penicilline", "Arachides"],
  chronicConditions: ["Asthme leger"],
}

type MedicalHistoryItem = {
  date: string
  type: string
  doctor: string
  summary: string
  documents: string[]
}

type Treatment = {
  name: string
  dosage: string
  frequency: string
  prescribedBy: string
  startDate: string
}

type Vaccination = {
  name: string
  date: string
  nextDue: string
}

export default function MedicalFilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [patientInfo, setPatientInfo] = useState(defaultPatientInfo)
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryItem[]>([])
  const [currentTreatments, setCurrentTreatments] = useState<Treatment[]>([])
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])
  const [loadingFile, setLoadingFile] = useState(true)
  const [fileError, setFileError] = useState("")
  const [activeTab, setActiveTab] = useState("history")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (session?.user) {
      setPatientInfo((prev) => ({
        ...prev,
        name: session.user.name ?? prev.name,
      }))
    }
  }, [session, status, router])

  useEffect(() => {
    const fetchMedicalFile = async () => {
      setLoadingFile(true)
      setFileError("")

      try {
        const response = await fetch("/api/patient/medical-file")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Erreur lors du chargement du dossier medical")
        }

        setPatientInfo(data.patientInfo)
        setMedicalHistory(data.medicalHistory)
        setCurrentTreatments(data.currentTreatments)
        setVaccinations(data.vaccinations)
      } catch (error) {
        setFileError(error instanceof Error ? error.message : "Erreur inconnue")
      } finally {
        setLoadingFile(false)
      }
    }

    if (session?.user) {
      fetchMedicalFile()
    }

    window.addEventListener("medicalRecordUpdated", fetchMedicalFile)
    return () => {
      window.removeEventListener("medicalRecordUpdated", fetchMedicalFile)
    }
  }, [session])

  if (status === "loading" || loadingFile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-base text-muted-foreground">Chargement du dossier medical...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mon dossier medical</h1>
        <p className="text-muted-foreground">Consultez votre historique medical</p>
      </div>

      {fileError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
          {fileError}
        </div>
      ) : null}

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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Pill className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Traitements</p>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{currentTreatments.length} en cours</p>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-primary hover:text-primary hover:bg-primary/5" onClick={() => setActiveTab("treatments")}>
                    Voir
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <FileText className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Vaccinations</p>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{vaccinations.length} enregistrées</p>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-secondary hover:text-secondary hover:bg-secondary/5" onClick={() => setActiveTab("vaccinations")}>
                    Voir
                  </Button>
                </div>
              </div>
            </div>
          </div>

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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
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

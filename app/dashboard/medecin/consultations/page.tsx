"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, FileText, Download, Search, Calendar, User, Stethoscope, Save } from "lucide-react"

const recentConsultations = [
  {
    id: 1,
    patient: "Jean Dupont",
    date: "10/04/2026",
    reason: "Consultation de routine",
    diagnosis: "Bonne sante generale",
    hasPrescription: true,
  },
  {
    id: 2,
    patient: "Marie Martin",
    date: "05/04/2026",
    reason: "Douleurs dorsales",
    diagnosis: "Lombalgie - Repos recommande",
    hasPrescription: true,
  },
  {
    id: 3,
    patient: "Pierre Leroy",
    date: "01/04/2026",
    reason: "Bilan annuel",
    diagnosis: "RAS - Vaccination grippe effectuee",
    hasPrescription: false,
  },
]

const patients = [
  { id: 1, name: "Jean Dupont" },
  { id: 2, name: "Marie Martin" },
  { id: 3, name: "Pierre Leroy" },
  { id: 4, name: "Sophie Bernard" },
  { id: 5, name: "Paul Dubois" },
]

export default function DoctorConsultationsPage() {
  const [activeTab, setActiveTab] = useState("new")
  const [search, setSearch] = useState("")
  const [formData, setFormData] = useState({
    patient: "",
    reason: "",
    symptoms: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    followUp: "",
    generatePrescription: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const filteredConsultations = recentConsultations.filter((c) =>
    c.patient.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Consultations</h1>
        <p className="text-muted-foreground">Enregistrez et consultez les comptes-rendus</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle consultation
          </TabsTrigger>
          <TabsTrigger value="history">
            <FileText className="mr-2 h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Enregistrer une consultation</CardTitle>
              <CardDescription>
                Renseignez les informations de la consultation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Patient</Label>
                    <Select value={formData.patient} onValueChange={(v) => setFormData({ ...formData, patient: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner un patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((p) => (
                          <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Motif de consultation</Label>
                    <Input
                      id="reason"
                      name="reason"
                      placeholder="Ex: Douleurs abdominales"
                      value={formData.reason}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptomes observes</Label>
                  <Textarea
                    id="symptoms"
                    name="symptoms"
                    placeholder="Decrivez les symptomes du patient..."
                    value={formData.symptoms}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnostic</Label>
                  <Textarea
                    id="diagnosis"
                    name="diagnosis"
                    placeholder="Votre diagnostic..."
                    value={formData.diagnosis}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treatment">Traitement prescrit</Label>
                  <Textarea
                    id="treatment"
                    name="treatment"
                    placeholder="Medicaments, posologie, duree..."
                    value={formData.treatment}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="followUp">Suivi recommande</Label>
                    <Input
                      id="followUp"
                      name="followUp"
                      placeholder="Ex: Dans 2 semaines"
                      value={formData.followUp}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes complementaires</Label>
                    <Input
                      id="notes"
                      name="notes"
                      placeholder="Notes additionnelles..."
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button type="button" className="flex-1 sm:flex-none">
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer la consultation
                  </Button>
                  <Button type="button" variant="outline" className="flex-1 sm:flex-none">
                    <Download className="mr-2 h-4 w-4" />
                    Generer ordonnance PDF
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par patient..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredConsultations.map((consultation) => (
              <Card key={consultation.id} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Stethoscope className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{consultation.patient}</h3>
                          {consultation.hasPrescription && (
                            <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                              Ordonnance
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {consultation.date}
                        </div>
                        <p className="mt-2 text-sm text-foreground">{consultation.reason}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{consultation.diagnosis}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Voir
                      </Button>
                      {consultation.hasPrescription && (
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          PDF
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

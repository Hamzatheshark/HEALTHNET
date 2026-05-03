"use client"

import { useState, useEffect } from "react"
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
import { Plus, FileText, Download, Search, Calendar, User, Stethoscope, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function DoctorConsultationsPage() {
  const [activeTab, setActiveTab] = useState("new")
  const [search, setSearch] = useState("")
  const [patients, setPatients] = useState<any[]>([])
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [recentConsultations, setRecentConsultations] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    patientId: "",
    reason: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    recommendations: "",
  })

  useEffect(() => {
    fetchPatients()
    fetchHistory()
  }, [])

  const fetchPatients = async () => {
    setLoadingPatients(true)
    try {
      const response = await fetch("/api/patients")
      const data = await response.json()
      if (response.ok) setPatients(data)
    } catch (error) {
      console.error("Error fetching patients:", error)
    } finally {
      setLoadingPatients(false)
    }
  }

  const fetchHistory = async () => {
    setLoadingHistory(true)
    try {
      const response = await fetch("/api/medecin/consultations")
      const data = await response.json()
      if (response.ok) setRecentConsultations(data)
    } catch (error) {
      console.error("Error fetching history:", error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.patientId) {
      toast.error("Veuillez selectionner un patient")
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/medecin/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        toast.success("Consultation enregistree avec succes")
        setFormData({
          patientId: "",
          reason: "",
          diagnosis: "",
          treatment: "",
          notes: "",
          recommendations: "",
        })
        fetchHistory()
        setActiveTab("history")
      } else {
        toast.error("Erreur lors de l'enregistrement")
      }
    } catch (error) {
      toast.error("Erreur reseau")
    } finally {
      setSaving(false)
    }
  }

  const filteredConsultations = recentConsultations.filter((c) =>
    `${c.patient.firstName} ${c.patient.lastName}`.toLowerCase().includes(search.toLowerCase())
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient</Label>
                    <Select 
                      value={formData.patientId} 
                      onValueChange={(v) => setFormData({ ...formData, patientId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loadingPatients ? "Chargement..." : "Selectionner un patient"} />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.firstName} {p.lastName}
                          </SelectItem>
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
                      required
                    />
                  </div>
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
                    <Label htmlFor="recommendations">Recommandations</Label>
                    <Input
                      id="recommendations"
                      name="recommendations"
                      placeholder="Ex: Repos, hydratation..."
                      value={formData.recommendations}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes privees</Label>
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
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer la consultation
                      </>
                    )}
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
            {loadingHistory ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredConsultations.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Stethoscope className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">Aucune consultation trouvee</p>
                </CardContent>
              </Card>
            ) : (
              filteredConsultations.map((consultation) => (
                <Card key={consultation.id} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Stethoscope className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">
                              {consultation.patient.firstName} {consultation.patient.lastName}
                            </h3>
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(consultation.createdAt).toLocaleDateString()}
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

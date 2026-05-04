"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Plus, Trash2 } from "lucide-react"

interface MedicalRecordFormProps {
  patientId: string
  initialData?: any
  onSuccess?: () => void
  readOnly?: boolean
}

export function MedicalRecordForm({ patientId, initialData, onSuccess, readOnly = false }: MedicalRecordFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    birthDate: initialData?.birthDate || "",
    cin: initialData?.cin || "",
    bloodType: initialData?.bloodType || "",
    height: initialData?.height || "",
    weight: initialData?.weight || "",
    allergies: initialData?.allergies || "",
    chronicDiseases: initialData?.chronicDiseases || "",
    medicalHistory: initialData?.medicalHistory || "",
  })

  const [treatments, setTreatments] = useState<any[]>(initialData?.treatments || [])
  const [vaccinations, setVaccinations] = useState<any[]>(initialData?.vaccinations || [])

  useEffect(() => {
    if (initialData) {
      setFormData({
        birthDate: initialData.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : "",
        cin: initialData.cin || "",
        bloodType: initialData.bloodType || "",
        height: initialData.height || "",
        weight: initialData.weight || "",
        allergies: initialData.allergies || "",
        chronicDiseases: initialData.chronicDiseases || "",
        medicalHistory: initialData.medicalHistory || "",
      })
      setTreatments(initialData.treatments || [])
      setVaccinations(initialData.vaccinations || [])
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addTreatment = () => {
    setTreatments([...treatments, { name: "", dosage: "", frequency: "", prescribedBy: "", startDate: new Date().toISOString().split('T')[0] }])
  }

  const removeTreatment = (index: number) => {
    setTreatments(treatments.filter((_, i) => i !== index))
  }

  const handleTreatmentChange = (index: number, field: string, value: string) => {
    const newTreatments = [...treatments]
    newTreatments[index][field] = value
    setTreatments(newTreatments)
  }

  const addVaccination = () => {
    setVaccinations([...vaccinations, { name: "", date: new Date().toISOString().split('T')[0], nextDue: "" }])
  }

  const removeVaccination = (index: number) => {
    setVaccinations(vaccinations.filter((_, i) => i !== index))
  }

  const handleVaccinationChange = (index: number, field: string, value: string) => {
    const newVaccinations = [...vaccinations]
    newVaccinations[index][field] = value
    setVaccinations(newVaccinations)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (readOnly || loading) return
    
    if (!patientId) {
      toast.error("ID du patient manquant")
      return
    }

    setLoading(true)
    const payload = {
      ...formData,
      treatments,
      vaccinations
    }
    console.log("Submitting medical record for:", patientId, payload)

    try {
      const response = await fetch(`/api/patients/${patientId}/medical-record`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log("API response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise a jour")
      }

      toast.success("Dossier medical mis a jour avec succes")
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la mise a jour")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Informations Personnelles</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="birthDate">Date de naissance</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              disabled={readOnly}
              className={readOnly ? "bg-muted/50 border-transparent cursor-default" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cin">Carte d'Identite (CIN)</Label>
            <Input
              id="cin"
              name="cin"
              value={formData.cin}
              onChange={handleChange}
              disabled={readOnly}
              placeholder="Ex: AB123456"
              className={readOnly ? "bg-muted/50 border-transparent cursor-default" : ""}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Informations Physiques</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="bloodType">Groupe Sanguin</Label>
            <Input
              id="bloodType"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              disabled={readOnly}
              placeholder="Ex: A+"
              className={readOnly ? "bg-muted/50 border-transparent cursor-default" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Taille (cm)</Label>
            <Input
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              disabled={readOnly}
              placeholder="Ex: 175"
              className={readOnly ? "bg-muted/50 border-transparent cursor-default" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Poids (kg)</Label>
            <Input
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              disabled={readOnly}
              placeholder="Ex: 70"
              className={readOnly ? "bg-muted/50 border-transparent cursor-default" : ""}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Donnees Medicales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              disabled={readOnly}
              placeholder="Ex: Penicilline, Pollen"
              className={readOnly ? "bg-muted/50 border-transparent cursor-default resize-none" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="chronicDiseases">Maladies Chroniques</Label>
            <Textarea
              id="chronicDiseases"
              name="chronicDiseases"
              value={formData.chronicDiseases}
              onChange={handleChange}
              disabled={readOnly}
              placeholder="Ex: Diabete, Hypertension"
              className={readOnly ? "bg-muted/50 border-transparent cursor-default resize-none" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medicalHistory">Antecedents Medicaux</Label>
            <Textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              disabled={readOnly}
              placeholder="Operations passees, etc."
              className={readOnly ? "bg-muted/50 border-transparent cursor-default resize-none" : ""}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">Traitements en cours</CardTitle>
          {!readOnly && (
            <Button type="button" variant="outline" size="sm" onClick={addTreatment}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {treatments.map((t, i) => (
            <div key={i} className="relative grid gap-3 p-4 rounded-lg border border-border bg-muted/20 sm:grid-cols-2">
              {!readOnly && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => removeTreatment(i)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
              <div className="space-y-1.5">
                <Label className="text-xs">Nom du médicament</Label>
                <Input 
                  value={t.name} 
                  onChange={(e) => handleTreatmentChange(i, "name", e.target.value)}
                  disabled={readOnly}
                  placeholder="Ex: Amoxicilline"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Dosage</Label>
                <Input 
                  value={t.dosage} 
                  onChange={(e) => handleTreatmentChange(i, "dosage", e.target.value)}
                  disabled={readOnly}
                  placeholder="Ex: 500mg"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Fréquence</Label>
                <Input 
                  value={t.frequency} 
                  onChange={(e) => handleTreatmentChange(i, "frequency", e.target.value)}
                  disabled={readOnly}
                  placeholder="Ex: 3 fois par jour"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Prescrit par</Label>
                <Input 
                  value={t.prescribedBy} 
                  onChange={(e) => handleTreatmentChange(i, "prescribedBy", e.target.value)}
                  disabled={readOnly}
                  placeholder="Ex: Dr. Martin"
                  className="h-8 text-sm"
                />
              </div>
            </div>
          ))}
          {treatments.length === 0 && (
            <p className="text-sm text-muted-foreground italic text-center py-2">Aucun traitement enregistré</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">Vaccinations</CardTitle>
          {!readOnly && (
            <Button type="button" variant="outline" size="sm" onClick={addVaccination}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {vaccinations.map((v, i) => (
            <div key={i} className="relative grid gap-3 p-4 rounded-lg border border-border bg-muted/20 sm:grid-cols-3">
              {!readOnly && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => removeVaccination(i)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
              <div className="space-y-1.5">
                <Label className="text-xs">Vaccin</Label>
                <Input 
                  value={v.name} 
                  onChange={(e) => handleVaccinationChange(i, "name", e.target.value)}
                  disabled={readOnly}
                  placeholder="Ex: Grippe"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Date</Label>
                <Input 
                  type="date"
                  value={v.date ? new Date(v.date).toISOString().split('T')[0] : ""} 
                  onChange={(e) => handleVaccinationChange(i, "date", e.target.value)}
                  disabled={readOnly}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Prochain rappel</Label>
                <Input 
                  type="date"
                  value={v.nextDue ? new Date(v.nextDue).toISOString().split('T')[0] : ""} 
                  onChange={(e) => handleVaccinationChange(i, "nextDue", e.target.value)}
                  disabled={readOnly}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          ))}
          {vaccinations.length === 0 && (
            <p className="text-sm text-muted-foreground italic text-center py-2">Aucune vaccination enregistrée</p>
          )}
        </CardContent>
      </Card>

      {!readOnly && (
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...</>
          ) : (
            "Enregistrer le dossier"
          )}
        </Button>
      )}
    </form>
  )
}

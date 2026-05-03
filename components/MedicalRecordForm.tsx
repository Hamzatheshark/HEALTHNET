"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface MedicalRecordFormProps {
  patientId: string
  initialData?: any
  onSuccess?: () => void
  readOnly?: boolean
}

export function MedicalRecordForm({ patientId, initialData, onSuccess, readOnly = false }: MedicalRecordFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    bloodType: initialData?.bloodType || "",
    height: initialData?.height || "",
    weight: initialData?.weight || "",
    allergies: initialData?.allergies || "",
    chronicDiseases: initialData?.chronicDiseases || "",
    medicalHistory: initialData?.medicalHistory || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (readOnly || loading) return
    
    if (!patientId) {
      toast.error("ID du patient manquant")
      return
    }

    setLoading(true)
    console.log("Submitting medical record for:", patientId)

    try {
      const response = await fetch(`/api/patients/${patientId}/medical-record`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise a jour")
      }

      toast.success("Dossier medical mis a jour avec succes")
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la mise a jour")
      console.error("Submit error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <CardHeader>
          <CardTitle className="text-lg">Traitements & Vaccinations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Traitements en cours</Label>
            <div className="rounded-md border p-3 bg-muted/30">
              {initialData?.treatments?.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {initialData.treatments.map((t: any, i: number) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium">{t.name}</span> - {t.dosage} ({t.frequency})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">Aucun traitement enregistre</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Vaccinations</Label>
            <div className="rounded-md border p-3 bg-muted/30">
              {initialData?.vaccinations?.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {initialData.vaccinations.map((v: any, i: number) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium">{v.name}</span> - {new Date(v.date).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">Aucune vaccination enregistree</p>
              )}
            </div>
          </div>
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

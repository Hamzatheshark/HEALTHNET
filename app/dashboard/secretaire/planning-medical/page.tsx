"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, User } from "lucide-react"
import { DoctorAgenda } from "@/components/DoctorAgenda"

export default function SecretaryPlanningPage() {
  const [managedDoctors, setManagedDoctors] = useState<any[]>([])
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchManaged = async () => {
      try {
        const response = await fetch("/api/secretaire/managed-doctors")
        const data = await response.json()
        if (response.ok && data.length > 0) {
          setManagedDoctors(data)
          setSelectedDoctorId(data[0].id)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchManaged()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  if (managedDoctors.length === 0) {
    return (
      <Card className="border-border/50 text-center py-20">
        <CardContent>
          <p className="text-muted-foreground">Vous ne travaillez avec aucun medecin. Allez dans "Collaborations" pour en ajouter un.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Planning medical</h1>
          <p className="text-muted-foreground">Gerez les creneaux et disponibilites des medecins</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Medecin :</span>
          <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Choisir un medecin" />
            </SelectTrigger>
            <SelectContent>
              {managedDoctors.map((doc) => (
                <SelectItem key={doc.id} value={doc.id}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Dr. {doc.firstName} {doc.lastName}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DoctorAgenda doctorId={selectedDoctorId} isSecretary={true} />
    </div>
  )
}

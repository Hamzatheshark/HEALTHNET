"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Users, Loader2, Check } from "lucide-react"
import { toast } from "sonner"

export default function SecretaryCollaborationsPage() {
  const [search, setSearch] = useState("")
  const [doctors, setDoctors] = useState<any[]>([])
  const [managedDoctors, setManagedDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingManaged, setFetchingManaged] = useState(true)
  const [sentRequests, setSentRequests] = useState<string[]>([])

  const fetchManagedDoctors = async () => {
    try {
      const response = await fetch("/api/secretaire/managed-doctors")
      const data = await response.json()
      if (response.ok) setManagedDoctors(data)
    } catch (error) {
      console.error(error)
    } finally {
      setFetchingManaged(false)
    }
  }

  const searchDoctors = async () => {
    if (!search) return
    setLoading(true)
    try {
      const response = await fetch(`/api/secretaire/doctors?q=${search}`)
      const data = await response.json()
      if (response.ok) setDoctors(data)
    } catch (error) {
      toast.error("Erreur de recherche")
    } finally {
      setLoading(false)
    }
  }

  const sendRequest = async (doctorId: string) => {
    try {
      const response = await fetch("/api/secretaire/collaborations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId })
      })
      const data = await response.json()
      if (response.ok) {
        toast.success("Demande envoyee avec succes")
        setSentRequests([...sentRequests, doctorId])
      } else {
        toast.error(data.error || "Erreur")
      }
    } catch (error) {
      toast.error("Erreur")
    }
  }

  useEffect(() => {
    fetchManagedDoctors()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Collaborations</h1>
        <p className="text-muted-foreground">Gerez vos relations de travail avec les medecins</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Search & New Collab */}
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Trouver un medecin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input 
                  placeholder="Nom ou specialite..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchDoctors()}
                />
                <Button onClick={searchDoctors} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              <div className="mt-6 space-y-3">
                {doctors.map((doctor) => {
                  const isAlreadyManaged = managedDoctors.some(d => d.id === doctor.id)
                  const isRequestSent = sentRequests.includes(doctor.id)
                  return (
                    <div key={doctor.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30">
                      <div>
                        <p className="font-medium">Dr. {doctor.firstName} {doctor.lastName}</p>
                        <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant={isAlreadyManaged || isRequestSent ? "ghost" : "outline"}
                        disabled={isAlreadyManaged || isRequestSent}
                        onClick={() => sendRequest(doctor.id)}
                      >
                        {isAlreadyManaged ? <Check className="h-4 w-4 text-secondary" /> : 
                         isRequestSent ? <span className="text-[10px] text-primary">Envoye</span> :
                         <UserPlus className="h-4 w-4" />}
                      </Button>
                    </div>
                  )
                })}
                {doctors.length === 0 && search && !loading && (
                  <p className="text-sm text-center text-muted-foreground">Aucun medecin trouve</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Current Collaborations */}
        <div className="space-y-4">
          <Card className="border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Vos medecins ({managedDoctors.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fetchingManaged ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
              ) : managedDoctors.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-8">Vous ne travaillez avec aucun medecin pour le moment</p>
              ) : (
                <div className="space-y-3">
                  {managedDoctors.map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-4 rounded-lg border border-primary/20 bg-primary/5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {doctor.firstName[0]}{doctor.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold">Dr. {doctor.firstName} {doctor.lastName}</p>
                          <Badge variant="outline" className="text-[10px] uppercase">{doctor.specialty}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Users, Loader2, Check, Clock, X } from "lucide-react"
import { toast } from "sonner"

export default function SecretaryCollaborationsPage() {
  const [search, setSearch] = useState("")
  const [doctors, setDoctors] = useState<any[]>([])
  const [managedDoctors, setManagedDoctors] = useState<any[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingManaged, setFetchingManaged] = useState(true)

  const fetchData = async () => {
    setFetchingManaged(true)
    try {
      const [managedRes, pendingRes] = await Promise.all([
        fetch("/api/secretaire/managed-doctors"),
        fetch("/api/secretaire/collaborations")
      ])
      const managed = await managedRes.json()
      const pending = await pendingRes.json()
      if (managedRes.ok) setManagedDoctors(managed)
      if (pendingRes.ok) setPendingRequests(pending)
    } catch (error) {
      console.error(error)
    } finally {
      setFetchingManaged(false)
    }
  }

  const searchDoctors = async () => {
    if (!search.trim()) return
    setLoading(true)
    try {
      const response = await fetch(`/api/secretaire/doctors?q=${encodeURIComponent(search)}`)
      const data = await response.json()
      if (response.ok) setDoctors(data)
      else toast.error("Erreur de recherche")
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
        fetchData() // refresh to show pending status
      } else {
        toast.error(data.error || "Erreur")
      }
    } catch (error) {
      toast.error("Erreur")
    }
  }

  const cancelRequest = async (doctorId: string) => {
    try {
      const response = await fetch(`/api/secretaire/collaborations?doctorId=${doctorId}`, {
        method: "DELETE"
      })
      if (response.ok) {
        toast.success("Demande annulee")
        fetchData()
      } else {
        toast.error("Erreur lors de l'annulation")
      }
    } catch (error) {
      toast.error("Erreur")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const pendingDoctorIds = Array.isArray(pendingRequests) ? pendingRequests.map(r => r.doctorId) : []
  const managedDoctorIds = managedDoctors.map(d => d.id)

  const getDoctorStatus = (doctorId: string) => {
    if (managedDoctorIds.includes(doctorId)) return "managed"
    if (pendingDoctorIds.includes(doctorId)) return "pending"
    return "none"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Collaborations</h1>
          <p className="text-muted-foreground">Gerez vos relations de travail avec les medecins</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Search & Status section */}
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
                  const status = getDoctorStatus(doctor.id)
                  return (
                    <div key={doctor.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30">
                      <div>
                        <p className="font-medium">Dr. {doctor.firstName} {doctor.lastName}</p>
                        <p className="text-xs text-muted-foreground">{doctor.specialty || "Medecin"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {status === "managed" && (
                          <Badge variant="secondary" className="gap-1 bg-secondary/20 text-secondary border-secondary/30">
                            <Check className="h-3 w-3" /> Collaborateur
                          </Badge>
                        )}
                        {status === "pending" && (
                          <>
                            <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300">
                              <Clock className="h-3 w-3" /> En attente
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => cancelRequest(doctor.id)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                        {status === "none" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendRequest(doctor.id)}
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
                {doctors.length === 0 && search && !loading && (
                  <p className="text-sm text-center text-muted-foreground py-4">Aucun medecin trouve</p>
                )}
                {doctors.length === 0 && !search && (
                  <p className="text-sm text-center text-muted-foreground py-4">Recherchez un medecin pour collaborer</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending section if any */}
          {Array.isArray(pendingRequests) && pendingRequests.length > 0 && (
            <Card className="border-amber-200/50 bg-amber-50/5">
              <CardHeader className="py-4">
                <CardTitle className="text-md flex items-center gap-2 text-amber-600">
                  <Clock className="h-4 w-4" /> Demandes en attente ({pendingRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                {pendingRequests.map((req) => (
                  <div key={req.doctorId} className="flex items-center justify-between p-2 rounded-lg border border-amber-200/30 bg-amber-50/10 text-sm">
                    <span className="font-medium">Dr. {req.doctor?.lastName}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => cancelRequest(req.doctorId)}
                    >
                      Annuler
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Managed section */}
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
                <p className="text-sm text-center text-muted-foreground py-8">
                  Vous ne travaillez avec aucun medecin pour le moment
                </p>
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
                          <Badge variant="outline" className="text-[10px] uppercase">{doctor.specialty || "Generaliste"}</Badge>
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

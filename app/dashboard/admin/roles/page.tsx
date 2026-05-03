"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Stethoscope, Calendar, Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Stats = {
  PATIENT: number
  MEDECIN: number
  SECRETAIRE: number
  ADMIN: number
}

type RoleKey = "PATIENT" | "MEDECIN" | "SECRETAIRE" | "ADMIN"

const roleConfig = [
  {
    id: "patient",
    name: "Patient",
    description: "Accès aux rendez-vous, dossier médical et consultations",
    roleKey: "PATIENT" as RoleKey,
    icon: Users,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "medecin",
    name: "Médecin",
    description: "Gestion des patients, consultations et agenda médical",
    roleKey: "MEDECIN" as RoleKey,
    icon: Stethoscope,
    color: "bg-green-100 text-green-800",
  },
  {
    id: "secretaire",
    name: "Secrétaire",
    description: "Gestion des rendez-vous et planning médical",
    roleKey: "SECRETAIRE" as RoleKey,
    icon: Calendar,
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "admin",
    name: "Administrateur",
    description: "Administration complète de la plateforme",
    roleKey: "ADMIN" as RoleKey,
    icon: Shield,
    color: "bg-red-100 text-red-800",
  },
]

const availablePermissions = [
  "Voir ses rendez-vous",
  "Consulter son dossier médical",
  "Prendre rendez-vous",
  "Voir ses consultations",
  "Gérer ses patients",
  "Créer des consultations",
  "Accéder à l'agenda",
  "Voir les dossiers médicaux",
  "Prescrire des traitements",
  "Gérer l'agenda global",
  "Planifier les rendez-vous",
  "Gérer les patients",
  "Voir les plannings médicaux",
  "Gérer tous les utilisateurs",
  "Créer des comptes",
  "Modifier les rôles",
  "Accès aux statistiques",
  "Configuration système",
]

export default function RolesPage() {
  const [stats, setStats] = useState<Stats>({
    PATIENT: 0,
    MEDECIN: 0,
    SECRETAIRE: 0,
    ADMIN: 0,
  })
  const [loading, setLoading] = useState(true)
  const [rolesPermissions, setRolesPermissions] = useState<Record<RoleKey, string[]>>({
    PATIENT: [
      "Voir ses rendez-vous",
      "Consulter son dossier médical",
      "Prendre rendez-vous",
      "Voir ses consultations",
    ],
    MEDECIN: [
      "Gérer ses patients",
      "Créer des consultations",
      "Accéder à l'agenda",
      "Voir les dossiers médicaux",
      "Prescrire des traitements",
    ],
    SECRETAIRE: [
      "Gérer l'agenda global",
      "Planifier les rendez-vous",
      "Gérer les patients",
      "Voir les plannings médicaux",
    ],
    ADMIN: [
      "Gérer tous les utilisateurs",
      "Créer des comptes",
      "Modifier les rôles",
      "Accès aux statistiques",
      "Configuration système",
    ],
  })
  const [editingRole, setEditingRole] = useState<RoleKey | null>(null)
  const [editingPermissions, setEditingPermissions] = useState<string[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats", {
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch stats")
      }

      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditPermissions = (roleKey: RoleKey) => {
    setEditingRole(roleKey)
    setEditingPermissions([...rolesPermissions[roleKey]])
    setIsEditDialogOpen(true)
  }

  const togglePermission = (permission: string) => {
    setEditingPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    )
  }

  const handleSavePermissions = async () => {
    if (!editingRole) return

    setIsSaving(true)

    try {
      const permissionsToSend = {
        role: editingRole,
        permissions: editingPermissions,
      }

      console.log("Sending permissions:", permissionsToSend)

      const response = await fetch("/api/admin/permissions", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(permissionsToSend),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || "Erreur lors de la sauvegarde"
        throw new Error(errorMessage)
      }

      setRolesPermissions((prev) => ({
        ...prev,
        [editingRole]: editingPermissions,
      }))

      setIsEditDialogOpen(false)
      setEditingRole(null)
      setEditingPermissions([])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
      console.error("Error saving permissions:", errorMessage)
      alert(`Erreur : ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des Rôles</h1>
        <p className="text-muted-foreground">
          Gérez les rôles et permissions des utilisateurs
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {roleConfig.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${role.color}`}>
                    <role.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
                <Badge variant="secondary">{stats[role.roleKey]} utilisateurs</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Permissions :</h4>
                  <ul className="space-y-1">
                    {rolesPermissions[role.roleKey].map((permission, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>

                <Dialog open={isEditDialogOpen && editingRole === role.roleKey} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleEditPermissions(role.roleKey)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier les permissions
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Modifier les permissions - {role.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-3">Permissions disponibles :</h4>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {availablePermissions.map((permission) => (
                            <div key={permission} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={permission}
                                checked={editingPermissions.includes(permission)}
                                onChange={() => togglePermission(permission)}
                                className="w-4 h-4 rounded border-gray-300"
                              />
                              <label
                                htmlFor={permission}
                                className="text-sm cursor-pointer flex-1"
                              >
                                {permission}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleSavePermissions}
                          disabled={isSaving}
                          className="flex-1"
                        >
                          {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditDialogOpen(false)
                            setEditingRole(null)
                          }}
                          className="flex-1"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Résumé des rôles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {roleConfig.map((role) => (
              <div key={role.id} className="text-center">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${role.color} mb-2`}>
                  <role.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">{stats[role.roleKey]}</div>
                <div className="text-sm text-muted-foreground">{role.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, User, Mail, Shield, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SPECIALITES } from "@/lib/constants"

type UserType = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  specialty?: string
  createdAt: string
}

const roleLabels = {
  PATIENT: "Patient",
  MEDECIN: "Médecin",
  SECRETAIRE: "Secrétaire",
  ADMIN: "Administrateur",
}

const roleColors = {
  PATIENT: "bg-blue-100 text-blue-800",
  MEDECIN: "bg-green-100 text-green-800",
  SECRETAIRE: "bg-purple-100 text-purple-800",
  ADMIN: "bg-red-100 text-red-800",
}

export default function UtilisateursPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<UserType>>({})
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "PATIENT",
    specialty: "",
  })
  const [creatingUser, setCreatingUser] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement")
      }

      setUsers(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (user: UserType) => {
    setEditingUser(user)
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      specialty: user.specialty,
      role: user.role,
    })
  }

  const handleEditChange = (field: string, value: string) => {
    setEditFormData({ ...editFormData, [field]: value })
  }

  const handleSaveEdit = async () => {
    if (!editingUser) return

    setSavingEdit(true)

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la modification")
      }

      setUsers((prev) =>
        prev.map((user) => (user.id === editingUser.id ? data : user))
      )
      setEditingUser(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur inconnue")
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return
    }

    setDeletingId(userId)

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erreur lors de la suppression")
      }

      setUsers((prev) => prev.filter((user) => user.id !== userId))
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur inconnue")
    } finally {
      setDeletingId(null)
    }
  }

  const handleCreateChange = (field: string, value: string) => {
    setCreateFormData({ ...createFormData, [field]: value })
  }

  const handleCreateUser = async () => {
    if (createFormData.password !== createFormData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }

    setCreatingUser(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: createFormData.firstName,
          lastName: createFormData.lastName,
          email: createFormData.email,
          phone: createFormData.phone,
          password: createFormData.password,
          role: createFormData.role,
          specialty: createFormData.role === "MEDECIN" ? createFormData.specialty : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création")
      }

      await fetchUsers()
      setIsCreateDialogOpen(false)
      setCreateFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "PATIENT",
        specialty: "",
      })
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur inconnue")
    } finally {
      setCreatingUser(false)
    }
  }

  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez tous les utilisateurs de la plateforme
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <User className="mr-2 h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un utilisateur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input
                    value={createFormData.firstName}
                    onChange={(e) => handleCreateChange("firstName", e.target.value)}
                    placeholder="Jean"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input
                    value={createFormData.lastName}
                    onChange={(e) => handleCreateChange("lastName", e.target.value)}
                    placeholder="Dupont"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={createFormData.email}
                  onChange={(e) => handleCreateChange("email", e.target.value)}
                  placeholder="jean@example.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  value={createFormData.phone}
                  onChange={(e) => handleCreateChange("phone", e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
              <div className="space-y-2">
                <Label>Rôle</Label>
                <Select value={createFormData.role} onValueChange={(value) => handleCreateChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PATIENT">Patient</SelectItem>
                    <SelectItem value="MEDECIN">Médecin</SelectItem>
                    <SelectItem value="SECRETAIRE">Secrétaire</SelectItem>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {createFormData.role === "MEDECIN" && (
                <div className="space-y-2">
                  <Label>Spécialité</Label>
                  <Select value={createFormData.specialty} onValueChange={(value) => handleCreateChange("specialty", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une spécialité" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALITES.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <Input
                  value={createFormData.password}
                  onChange={(e) => handleCreateChange("password", e.target.value)}
                  placeholder="••••••••"
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <Label>Confirmer le mot de passe</Label>
                <Input
                  value={createFormData.confirmPassword}
                  onChange={(e) => handleCreateChange("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                  type="password"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateUser}
                  disabled={creatingUser}
                  className="flex-1"
                >
                  {creatingUser ? "Création..." : "Créer"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Rechercher des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email ou rôle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground">Chargement...</div>
          ) : error ? (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.specialty && (
                        <p className="text-xs text-primary">{user.specialty}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Badge
                      className={
                        roleColors[user.role as keyof typeof roleColors]
                      }
                    >
                      {roleLabels[user.role as keyof typeof roleLabels]}
                    </Badge>

                    <Dialog open={editingUser?.id === user.id}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Modifier l'utilisateur</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Prénom</Label>
                              <Input
                                value={editFormData.firstName || ""}
                                onChange={(e) =>
                                  handleEditChange("firstName", e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Nom</Label>
                              <Input
                                value={editFormData.lastName || ""}
                                onChange={(e) =>
                                  handleEditChange("lastName", e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                              value={editFormData.email || ""}
                              onChange={(e) =>
                                handleEditChange("email", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Téléphone</Label>
                            <Input
                              value={editFormData.phone || ""}
                              onChange={(e) =>
                                handleEditChange("phone", e.target.value)
                              }
                            />
                          </div>
                          {editFormData.role === "MEDECIN" && (
                            <div className="space-y-2">
                              <Label>Spécialité</Label>
                              <Select
                                value={editFormData.specialty || ""}
                                onValueChange={(value) =>
                                  handleEditChange("specialty", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez une spécialité" />
                                </SelectTrigger>
                                <SelectContent>
                                  {SPECIALITES.map((spec) => (
                                    <SelectItem key={spec} value={spec}>
                                      {spec}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button
                              onClick={handleSaveEdit}
                              disabled={savingEdit}
                              className="flex-1"
                            >
                              {savingEdit ? "Sauvegarde..." : "Sauvegarder"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingUser(null)}
                              className="flex-1"
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deletingId === user.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

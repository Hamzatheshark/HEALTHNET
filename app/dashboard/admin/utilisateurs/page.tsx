"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, User, Mail, Shield, Edit, Trash2 } from "lucide-react"

const users = [
  {
    id: 1,
    name: "Dr Sophie Bernard",
    email: "sophie.bernard@hopital.fr",
    role: "medecin",
    status: "active",
    createdAt: "15/01/2026",
  },
  {
    id: 2,
    name: "Jean Dupont",
    email: "jean.dupont@email.fr",
    role: "patient",
    status: "active",
    createdAt: "20/02/2026",
  },
  {
    id: 3,
    name: "Marie Secretariat",
    email: "marie@hopital.fr",
    role: "secretaire",
    status: "active",
    createdAt: "10/03/2026",
  },
  {
    id: 4,
    name: "Pierre Leroy",
    email: "pierre.leroy@email.fr",
    role: "patient",
    status: "inactive",
    createdAt: "05/04/2026",
  },
]

const roleLabels = {
  patient: "Patient",
  medecin: "Médecin",
  secretaire: "Secrétaire",
  admin: "Administrateur",
}

const roleColors = {
  patient: "bg-blue-100 text-blue-800",
  medecin: "bg-green-100 text-green-800",
  secretaire: "bg-purple-100 text-purple-800",
  admin: "bg-red-100 text-red-800",
}

export default function UtilisateursPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <Button>
          <User className="mr-2 h-4 w-4" />
          Ajouter un utilisateur
        </Button>
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
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                    {roleLabels[user.role as keyof typeof roleLabels]}
                  </Badge>

                  <Badge variant={user.status === "active" ? "default" : "secondary"}>
                    {user.status === "active" ? "Actif" : "Inactif"}
                  </Badge>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
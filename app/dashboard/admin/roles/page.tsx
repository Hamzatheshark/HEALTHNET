"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Stethoscope, Calendar, Settings, Edit } from "lucide-react"

const roles = [
  {
    id: "patient",
    name: "Patient",
    description: "Accès aux rendez-vous, dossier médical et consultations",
    users: 245,
    permissions: [
      "Voir ses rendez-vous",
      "Consulter son dossier médical",
      "Prendre rendez-vous",
      "Voir ses consultations",
    ],
    icon: Users,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "medecin",
    name: "Médecin",
    description: "Gestion des patients, consultations et agenda médical",
    users: 12,
    permissions: [
      "Gérer ses patients",
      "Créer des consultations",
      "Accéder à l'agenda",
      "Voir les dossiers médicaux",
      "Prescrire des traitements",
    ],
    icon: Stethoscope,
    color: "bg-green-100 text-green-800",
  },
  {
    id: "secretaire",
    name: "Secrétaire",
    description: "Gestion des rendez-vous et planning médical",
    users: 5,
    permissions: [
      "Gérer l'agenda global",
      "Planifier les rendez-vous",
      "Gérer les patients",
      "Voir les plannings médicaux",
    ],
    icon: Calendar,
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "admin",
    name: "Administrateur",
    description: "Administration complète de la plateforme",
    users: 2,
    permissions: [
      "Gérer tous les utilisateurs",
      "Créer des comptes",
      "Modifier les rôles",
      "Accès aux statistiques",
      "Configuration système",
    ],
    icon: Shield,
    color: "bg-red-100 text-red-800",
  },
]

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Rôles</h1>
          <p className="text-muted-foreground">
            Gérez les rôles et permissions des utilisateurs
          </p>
        </div>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Modifier les permissions
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {roles.map((role) => (
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
                <Badge variant="secondary">{role.users} utilisateurs</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Permissions :</h4>
                  <ul className="space-y-1">
                    {role.permissions.map((permission, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier les permissions
                </Button>
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
            {roles.map((role) => (
              <div key={role.id} className="text-center">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${role.color} mb-2`}>
                  <role.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">{role.users}</div>
                <div className="text-sm text-muted-foreground">{role.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
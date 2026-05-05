"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Shield, Activity, Loader2 } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats")
        const data = await res.json()
        if (res.ok) setStats(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrateur</h1>
        <p className="text-muted-foreground">
          Gérez les utilisateurs, les rôles et surveillez la plateforme HealthNet.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newUsersLast30Days || 0} les 30 derniers jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Médecins Actifs</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeDoctors || 0}</div>
            <p className="text-xs text-muted-foreground">
              Sur {stats?.totalUsers || 0} utilisateurs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPatients || 0}</div>
            <p className="text-xs text-muted-foreground">
              Gérés sur la plateforme
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Secrétaires</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSecretaries || 0}</div>
            <p className="text-xs text-muted-foreground">
              Collaborateurs administratifs
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Gérez rapidement les utilisateurs et les rôles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <a href="/dashboard/admin/creer-compte" className="flex items-center space-x-2 hover:text-primary">
              <UserPlus className="h-4 w-4" />
              <span className="text-sm">Créer un nouveau compte utilisateur</span>
            </a>
            <a href="/dashboard/admin/roles" className="flex items-center space-x-2 hover:text-primary">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Gérer les rôles et permissions</span>
            </a>
            <a href="/dashboard/admin/utilisateurs" className="flex items-center space-x-2 hover:text-primary">
              <Users className="h-4 w-4" />
              <span className="text-sm">Voir tous les utilisateurs</span>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques Récentes</CardTitle>
            <CardDescription>
              Aperçu des dernières activités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rendez-vous créés</span>
                <span className="font-medium">{stats?.totalAppointments || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Consultations terminées</span>
                <span className="font-medium">{stats?.totalConsultations || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Disponibilité Système</span>
                <span className="font-medium text-secondary">99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
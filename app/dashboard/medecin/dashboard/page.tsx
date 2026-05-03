"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Stethoscope, Clock, TrendingUp, Activity, ChevronRight, Loader2 } from "lucide-react"

const statusColors = {
  planifie: "bg-primary/10 text-primary",
  confirme: "bg-secondary/10 text-secondary",
  termine: "bg-muted text-muted-foreground",
  annule: "bg-destructive/10 text-destructive",
}

export default function DoctorDashboardPage() {
  const [period, setPeriod] = useState<"jour" | "semaine" | "mois">("semaine")
  const [stats, setStats] = useState<any[]>([])
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/medecin/stats")
        const data = await response.json()
        if (response.ok) {
          setStats(data.stats)
          setRecentActivities(data.recentActivities)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenue sur votre espace de suivi</p>
        </div>
        <div className="flex gap-2">
          {(["jour", "semaine", "mois"] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
              className="capitalize"
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.title.includes("RDV") ? Calendar : stat.title.includes("Patients") ? Users : Stethoscope
          return (
            <Card key={stat.title} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-secondary">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change} vs periode precedente
                    </p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Chart - Placeholder for now */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Activite de la semaine
            </CardTitle>
            <CardDescription>Nombre de consultations par jour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end justify-between gap-2">
              {/* This could be connected to an API as well */}
              {[
                { day: "Lun", val: 30 },
                { day: "Mar", val: 50 },
                { day: "Mer", val: 20 },
                { day: "Jeu", val: 40 },
                { day: "Ven", val: 35 },
              ].map((data) => (
                <div key={data.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-md bg-primary/10 transition-all hover:bg-primary/20" style={{ height: `${data.val}%` }}>
                    <div className="h-full w-full rounded-t-md bg-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">{data.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule Placeholder */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Agenda du jour
                </CardTitle>
                <CardDescription>Consultez vos rendez-vous</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard/medecin/agenda">
                  Voir tout
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/20" />
              <p className="mt-2 text-sm text-muted-foreground">Accedez a l&apos;agenda pour voir vos rendez-vous</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Activites recentes</CardTitle>
          <CardDescription>Historique des dernieres actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      activity.status === "confirme" || activity.status === "planifie" ? "bg-secondary" :
                      activity.status === "termine" ? "bg-muted-foreground" : "bg-destructive"
                    }`} />
                    <div>
                      <p className="font-medium text-foreground">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={statusColors[activity.status as keyof typeof statusColors] || ""}>
                    <span className="capitalize">{activity.status}</span>
                  </Badge>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">Aucune activite recente</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


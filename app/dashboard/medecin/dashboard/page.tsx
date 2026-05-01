"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Stethoscope, Clock, TrendingUp, Activity, ChevronRight } from "lucide-react"

const stats = [
  {
    title: "RDV a venir",
    value: "12",
    change: "+3",
    changeType: "positive",
    icon: Calendar,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Patients cette semaine",
    value: "28",
    change: "+5",
    changeType: "positive",
    icon: Users,
    color: "bg-secondary/10 text-secondary",
  },
  {
    title: "Consultations enregistrees",
    value: "156",
    change: "+12",
    changeType: "positive",
    icon: Stethoscope,
    color: "bg-accent/10 text-accent",
  },
]

const recentActivities = [
  {
    id: 1,
    type: "appointment",
    title: "RDV pris avec Jean Dupont",
    date: "14/04/2026 10:00",
    status: "confirme",
  },
  {
    id: 2,
    type: "consultation",
    title: "Consultation enregistree pour Marie Curie",
    date: "13/04/2026 14:30",
    status: "termine",
  },
  {
    id: 3,
    type: "cancel",
    title: "Annulation RDV - Pierre Martin",
    date: "12/04/2026 09:00",
    status: "annule",
  },
  {
    id: 4,
    type: "appointment",
    title: "Nouveau RDV - Sophie Leroy",
    date: "11/04/2026 16:00",
    status: "confirme",
  },
  {
    id: 5,
    type: "consultation",
    title: "Consultation enregistree pour Paul Bernard",
    date: "10/04/2026 11:00",
    status: "termine",
  },
]

const upcomingAppointments = [
  { time: "09:00", patient: "Jean Dupont", type: "Consultation" },
  { time: "10:30", patient: "Marie Martin", type: "Suivi" },
  { time: "11:30", patient: "Pierre Leroy", type: "Premiere consultation" },
  { time: "14:00", patient: "Sophie Bernard", type: "Teleconsultation" },
]

const weeklyData = [
  { day: "Lun", consultations: 8 },
  { day: "Mar", consultations: 12 },
  { day: "Mer", consultations: 6 },
  { day: "Jeu", consultations: 10 },
  { day: "Ven", consultations: 9 },
]

const statusColors = {
  confirme: "bg-secondary/10 text-secondary",
  termine: "bg-muted text-muted-foreground",
  annule: "bg-destructive/10 text-destructive",
}

export default function DoctorDashboardPage() {
  const [period, setPeriod] = useState<"jour" | "semaine" | "mois">("semaine")

  const maxConsultations = Math.max(...weeklyData.map(d => d.consultations))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenue, Dr. Sophie Bernard</p>
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
        {stats.map((stat) => (
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
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Chart */}
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
              {weeklyData.map((data) => (
                <div key={data.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-md bg-primary/10 transition-all hover:bg-primary/20" style={{ height: `${(data.consultations / maxConsultations) * 100}%` }}>
                    <div
                      className="h-full w-full rounded-t-md bg-primary transition-all"
                      style={{ height: `${(data.consultations / maxConsultations) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{data.day}</span>
                  <span className="text-sm font-medium text-foreground">{data.consultations}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Agenda du jour
                </CardTitle>
                <CardDescription>14 Avril 2026</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Voir tout
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((apt, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-medium text-primary">
                      {apt.time}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{apt.patient}</p>
                      <p className="text-sm text-muted-foreground">{apt.type}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Voir
                  </Button>
                </div>
              ))}
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
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.status === "confirme" ? "bg-secondary" :
                    activity.status === "termine" ? "bg-muted-foreground" : "bg-destructive"
                  }`} />
                  <div>
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
                <Badge variant="outline" className={statusColors[activity.status as keyof typeof statusColors]}>
                  {activity.status === "confirme" ? "Confirme" :
                   activity.status === "termine" ? "Termine" : "Annule"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

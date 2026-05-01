"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, FileText, AlertCircle, Check, Trash2 } from "lucide-react"

const initialNotifications = [
  {
    id: 1,
    type: "appointment",
    title: "Rappel de rendez-vous",
    message: "Votre rendez-vous avec Dr. Sophie Bernard est prevu demain a 09:30.",
    date: "Il y a 2 heures",
    read: false,
  },
  {
    id: 2,
    type: "document",
    title: "Nouveau document disponible",
    message: "Les resultats de votre analyse sanguine sont disponibles dans votre dossier medical.",
    date: "Il y a 1 jour",
    read: false,
  },
  {
    id: 3,
    type: "alert",
    title: "Rappel de vaccination",
    message: "Votre vaccin contre la grippe est recommande pour cette saison.",
    date: "Il y a 3 jours",
    read: true,
  },
  {
    id: 4,
    type: "appointment",
    title: "Rendez-vous confirme",
    message: "Votre rendez-vous du 25 Avril avec Dr. Pierre Martin a ete confirme.",
    date: "Il y a 5 jours",
    read: true,
  },
]

const typeIcons = {
  appointment: Calendar,
  document: FileText,
  alert: AlertCircle,
}

const typeColors = {
  appointment: "bg-primary/10 text-primary",
  document: "bg-secondary/10 text-secondary",
  alert: "bg-accent/10 text-accent",
}

export default function PatientNotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} nouvelle${unreadCount > 1 ? "s" : ""} notification${unreadCount > 1 ? "s" : ""}` : "Aucune nouvelle notification"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">Aucune notification</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => {
            const Icon = typeIcons[notification.type as keyof typeof typeIcons]
            return (
              <Card
                key={notification.id}
                className={`border-border/50 transition-colors ${
                  !notification.read ? "bg-primary/5 border-primary/20" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${typeColors[notification.type as keyof typeof typeColors]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">{notification.title}</h3>
                            {!notification.read && (
                              <Badge className="bg-primary text-primary-foreground">Nouveau</Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                          <p className="mt-2 text-xs text-muted-foreground">{notification.date}</p>
                        </div>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

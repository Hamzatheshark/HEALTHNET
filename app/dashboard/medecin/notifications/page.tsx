"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, User, AlertCircle, Check, Trash2, Clock } from "lucide-react"

const initialNotifications = [
  {
    id: 1,
    type: "appointment",
    title: "Nouvelle demande de RDV",
    message: "Pierre Leroy souhaite prendre rendez-vous pour une premiere consultation.",
    date: "Il y a 30 min",
    read: false,
    actionRequired: true,
  },
  {
    id: 2,
    type: "reminder",
    title: "Rappel - RDV dans 1 heure",
    message: "Consultation avec Jean Dupont a 10:00.",
    date: "Il y a 1 heure",
    read: false,
    actionRequired: false,
  },
  {
    id: 3,
    type: "cancel",
    title: "Annulation de RDV",
    message: "Marie Martin a annule son rendez-vous du 15/04/2026.",
    date: "Il y a 3 heures",
    read: true,
    actionRequired: false,
  },
  {
    id: 4,
    type: "system",
    title: "Mise a jour du systeme",
    message: "Une nouvelle fonctionnalite de teleconsultation est disponible.",
    date: "Hier",
    read: true,
    actionRequired: false,
  },
]

const typeIcons = {
  appointment: Calendar,
  reminder: Clock,
  cancel: AlertCircle,
  system: Bell,
}

const typeColors = {
  appointment: "bg-primary/10 text-primary",
  reminder: "bg-accent/10 text-accent",
  cancel: "bg-destructive/10 text-destructive",
  system: "bg-muted text-muted-foreground",
}

export default function DoctorNotificationsPage() {
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
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium text-foreground">{notification.title}</h3>
                            {!notification.read && (
                              <Badge className="bg-primary text-primary-foreground">Nouveau</Badge>
                            )}
                            {notification.actionRequired && (
                              <Badge variant="outline" className="border-accent text-accent">
                                Action requise
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                          <p className="mt-2 text-xs text-muted-foreground">{notification.date}</p>
                        </div>
                        <div className="flex gap-1">
                          {notification.actionRequired && (
                            <Button size="sm" className="h-8">
                              Repondre
                            </Button>
                          )}
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

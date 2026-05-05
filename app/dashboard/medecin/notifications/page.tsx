"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, User, AlertCircle, Check, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

const typeIcons = {
  INFO: User,
  WARNING: AlertCircle,
  SUCCESS: Check,
}

const typeColors = {
  INFO: "bg-primary/10 text-primary",
  WARNING: "bg-accent/10 text-accent",
  SUCCESS: "bg-secondary/10 text-secondary",
}

export default function DoctorNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/notifications")
      const data = await response.json()
      if (response.ok) {
        setNotifications(data)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        setNotifications(notifications.map(n => 
          n.id === id ? { ...n, status: "READ" } : n
        ))
        window.dispatchEvent(new Event("notificationsUpdated"))
      }
    } catch (error) {
      toast.error("Erreur lors de la mise a jour")
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setNotifications(notifications.filter(n => n.id !== id))
        window.dispatchEvent(new Event("notificationsUpdated"))
        toast.success("Notification supprimee")
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/mark-all", {
        method: "PUT",
      })
      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, status: "READ" })))
        window.dispatchEvent(new Event("notificationsUpdated"))
        toast.success("Toutes les notifications sont marquees comme lues")
      }
    } catch (error) {
      toast.error("Erreur")
    }
  }

  const unreadCount = notifications.filter(n => n.status === "UNREAD").length

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
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} nouvelle${unreadCount > 1 ? "s" : ""} notification${unreadCount > 1 ? "s" : ""}` : "Aucune nouvelle notification"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" size="sm">
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
            const Icon = typeIcons[notification.type as keyof typeof typeIcons] || Bell
            const isUnread = notification.status === "UNREAD"
            return (
              <Card
                key={notification.id}
                className={`border-border/50 transition-colors ${
                  isUnread ? "bg-primary/5 border-primary/20" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${typeColors[notification.type as keyof typeof typeColors] || "bg-muted text-muted-foreground"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">{notification.title}</h3>
                            {isUnread && (
                              <Badge className="bg-primary text-primary-foreground">Nouveau</Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {notification.message.replace(/\[ACCEPT_COLLAB:.+?\]/, "").trim()}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-1">
                          {notification.message.includes("[ACCEPT_COLLAB:") ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-8"
                              onClick={async () => {
                                const secretaryId = notification.message.match(/\[ACCEPT_COLLAB:(.+?)\]/)?.[1]
                                if (secretaryId) {
                                  try {
                                    const res = await fetch("/api/medecin/collaborations/accept", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ secretaryId })
                                    })
                                    if (res.ok) {
                                      toast.success("Collaboration acceptee")
                                      deleteNotification(notification.id)
                                    }
                                  } catch (e) {
                                    toast.error("Erreur")
                                  }
                                }
                              }}
                            >
                              Accepter
                            </Button>
                          ) : isUnread && (
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

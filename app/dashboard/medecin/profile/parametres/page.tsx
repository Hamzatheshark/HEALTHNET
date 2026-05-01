"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Bell, Calendar, Lock, Eye, EyeOff, Save, Clock } from "lucide-react"

export default function DoctorSettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    newPatientAlerts: true,
    teleconsultationEnabled: true,
    autoConfirmAppointments: false,
    consultationDuration: "30",
    breakBetweenAppointments: "10",
  })

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings({ ...settings, [key]: value })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Parametres</h1>
        <p className="text-muted-foreground">Configurez vos preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notifications */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Gerez vos preferences de notification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Notifications par email</p>
                <p className="text-sm text-muted-foreground">Recevoir les notifications par email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(v) => handleSettingChange("emailNotifications", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Notifications SMS</p>
                <p className="text-sm text-muted-foreground">Recevoir les alertes par SMS</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(v) => handleSettingChange("smsNotifications", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Rappels de RDV</p>
                <p className="text-sm text-muted-foreground">Rappels avant chaque consultation</p>
              </div>
              <Switch
                checked={settings.appointmentReminders}
                onCheckedChange={(v) => handleSettingChange("appointmentReminders", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Alertes nouveaux patients</p>
                <p className="text-sm text-muted-foreground">Notification lors d une nouvelle inscription</p>
              </div>
              <Switch
                checked={settings.newPatientAlerts}
                onCheckedChange={(v) => handleSettingChange("newPatientAlerts", v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Agenda Settings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Parametres agenda
            </CardTitle>
            <CardDescription>Configurez votre agenda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Teleconsultation</p>
                <p className="text-sm text-muted-foreground">Activer les consultations video</p>
              </div>
              <Switch
                checked={settings.teleconsultationEnabled}
                onCheckedChange={(v) => handleSettingChange("teleconsultationEnabled", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Confirmation automatique</p>
                <p className="text-sm text-muted-foreground">Confirmer automatiquement les RDV</p>
              </div>
              <Switch
                checked={settings.autoConfirmAppointments}
                onCheckedChange={(v) => handleSettingChange("autoConfirmAppointments", v)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consultationDuration">Duree consultation (min)</Label>
              <Input
                id="consultationDuration"
                type="number"
                value={settings.consultationDuration}
                onChange={(e) => handleSettingChange("consultationDuration", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breakBetweenAppointments">Pause entre RDV (min)</Label>
              <Input
                id="breakBetweenAppointments"
                type="number"
                value={settings.breakBetweenAppointments}
                onChange={(e) => handleSettingChange("breakBetweenAppointments", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Securite
            </CardTitle>
            <CardDescription>Modifiez votre mot de passe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="current">Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    id="current"
                    name="current"
                    type={showPassword ? "text" : "password"}
                    value={passwords.current}
                    onChange={handlePasswordChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">Nouveau mot de passe</Label>
                <Input
                  id="new"
                  name="new"
                  type={showPassword ? "text" : "password"}
                  value={passwords.new}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmer</Label>
                <Input
                  id="confirm"
                  name="confirm"
                  type={showPassword ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            <Button className="mt-4">
              <Save className="mr-2 h-4 w-4" />
              Mettre a jour le mot de passe
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

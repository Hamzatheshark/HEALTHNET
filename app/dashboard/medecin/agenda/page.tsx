"use client"

import { DoctorAgenda } from "@/components/DoctorAgenda"

export default function DoctorAgendaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
        <p className="text-muted-foreground">Gerez vos creneaux et rendez-vous</p>
      </div>
      
      <DoctorAgenda />
    </div>
  )
}

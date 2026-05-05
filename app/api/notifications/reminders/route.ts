import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { addDays, startOfDay, endOfDay } from "date-fns"

/**
 * API pour déclencher les rappels automatiques.
 * Dans une application réelle, cette route serait appelée par un Cron Job (ex: Vercel Cron).
 * Ici, elle peut être déclenchée manuellement depuis le dashboard admin.
 */
export async function POST(_request: NextRequest) {
  try {
    const now = new Date()
    const tomorrow = addDays(now, 1)
    const startOfTomorrow = startOfDay(tomorrow)
    const endOfTomorrow = endOfDay(tomorrow)

    // Trouver les rendez-vous de demain qui n'ont pas encore reçu de rappel
    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfTomorrow,
          lte: endOfTomorrow
        },
        status: "CONFIRME",
        reminderSent: false
      },
      include: {
        patient: true,
        doctor: true
      }
    })

    let remindersCreated = 0

    for (const apt of upcomingAppointments) {
      // Créer la notification de rappel pour le patient
      await prisma.notification.create({
        data: {
          userId: apt.patientId,
          title: "Rappel : Votre rendez-vous demain",
          message: `N'oubliez pas votre rendez-vous avec le Dr. ${apt.doctor.lastName} demain à ${apt.time}.`,
          type: "RAPPEL",
          status: "UNREAD"
        }
      })

      // Marquer le rappel comme envoyé
      await prisma.appointment.update({
        where: { id: apt.id },
        data: { reminderSent: true }
      })

      remindersCreated++
    }

    return NextResponse.json({
      success: true,
      remindersCreated,
      message: `${remindersCreated} rappels ont été générés pour demain.`
    })

  } catch (error) {
    console.error("Reminders API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

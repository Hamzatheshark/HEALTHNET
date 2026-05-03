import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { startOfWeek, endOfWeek } from "date-fns"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "MEDECIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const doctorId = session.user.id
    const now = new Date()
    const weekStart = startOfWeek(now)
    const weekEnd = endOfWeek(now)

    // RDV à venir
    const upcomingAppointmentsCount = await prisma.appointment.count({
      where: {
        doctorId,
        date: { gte: now },
        status: "PLANIFIE"
      }
    })

    // Patients cette semaine
    const weeklyPatientsCount = await prisma.appointment.count({
      where: {
        doctorId,
        date: {
          gte: weekStart,
          lte: weekEnd
        }
      }
    })

    // Consultations enregistrées
    const consultationsCount = await prisma.consultation.count({
      where: {
        doctorId
      }
    })

    // Activités récentes
    const recentAppointments = await prisma.appointment.findMany({
      where: { doctorId },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        patient: {
          select: { firstName: true, lastName: true }
        }
      }
    })

    const recentConsultations = await prisma.consultation.findMany({
      where: { doctorId },
      orderBy: { createdAt: "desc" },
      take: 2,
      include: {
        patient: {
          select: { firstName: true, lastName: true }
        }
      }
    })

    const recentActivities = [
      ...recentAppointments.map(a => ({
        id: `apt-${a.id}`,
        type: "appointment",
        title: `RDV ${a.status.toLowerCase()} avec ${a.patient.firstName} ${a.patient.lastName}`,
        date: a.date.toLocaleDateString(),
        status: a.status.toLowerCase()
      })),
      ...recentConsultations.map(c => ({
        id: `cons-${c.id}`,
        type: "consultation",
        title: `Consultation enregistrée pour ${c.patient.firstName} ${c.patient.lastName}`,
        date: c.date.toLocaleDateString(),
        status: "termine"
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

    return NextResponse.json({
      stats: [
        {
          title: "RDV a venir",
          value: upcomingAppointmentsCount.toString(),
          change: "+0", // Placeholder for now
          changeType: "neutral",
          color: "bg-primary/10 text-primary",
        },
        {
          title: "Patients cette semaine",
          value: weeklyPatientsCount.toString(),
          change: "+0",
          changeType: "neutral",
          color: "bg-secondary/10 text-secondary",
        },
        {
          title: "Consultations enregistrees",
          value: consultationsCount.toString(),
          change: "+0",
          changeType: "neutral",
          color: "bg-accent/10 text-accent",
        },
      ],
      recentActivities
    })

  } catch (error) {
    console.error("Get doctor stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

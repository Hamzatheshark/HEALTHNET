import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { startOfWeek, endOfWeek, startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "MEDECIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "semaine"

    const doctorId = session.user.id
    const now = new Date()
    
    let startDate: Date
    let endDate: Date
    let periodLabel: string

    if (period === "jour") {
      startDate = startOfDay(now)
      endDate = endOfDay(now)
      periodLabel = "aujourd'hui"
    } else if (period === "mois") {
      startDate = startOfMonth(now)
      endDate = endOfMonth(now)
      periodLabel = "ce mois"
    } else {
      startDate = startOfWeek(now)
      endDate = endOfWeek(now)
      periodLabel = "cette semaine"
    }

    // RDV à venir (toujours à partir de maintenant)
    const upcomingAppointmentsCount = await prisma.appointment.count({
      where: {
        doctorId,
        date: { gte: now },
        status: "PLANIFIE"
      }
    })

    // Patients sur la période sélectionnée
    const patientsCount = await prisma.appointment.count({
      where: {
        doctorId,
        date: {
          gte: startDate,
          lte: endDate
        },
        status: { not: "ANNULE" }
      }
    })

    // Consultations enregistrées sur la période sélectionnée
    const consultationsCount = await prisma.consultation.count({
      where: {
        doctorId,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    // Activités récentes
    const recentAppointments = await prisma.appointment.findMany({
      where: { doctorId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        patient: {
          select: { firstName: true, lastName: true }
        }
      }
    })

    const recentActivities = recentAppointments.map(a => {
      let title = ""
      if (a.reason === "BLOQUE") {
        title = `Creneau bloque par la secretaire ${a.patient.firstName} ${a.patient.lastName}`
      } else {
        title = `RDV ${a.status.toLowerCase()} avec ${a.patient.firstName} ${a.patient.lastName}`
      }
      
      return {
        id: `apt-${a.id}`,
        type: "appointment",
        title: title,
        date: a.date.toLocaleDateString(),
        status: a.status.toLowerCase()
      }
    })

    // Secretaires collaboratrices
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
      include: {
        managingSecretaries: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    })

    return NextResponse.json({
      stats: [
        {
          title: "RDV a venir",
          value: upcomingAppointmentsCount.toString(),
          change: "+0",
          changeType: "neutral",
          color: "bg-primary/10 text-primary",
        },
        {
          title: `Patients ${periodLabel}`,
          value: patientsCount.toString(),
          change: "+0",
          changeType: "neutral",
          color: "bg-secondary/10 text-secondary",
        },
        {
          title: "Total Consultations",
          value: consultationsCount.toString(),
          change: "+0",
          changeType: "neutral",
          color: "bg-accent/10 text-accent",
        },
      ],
      recentActivities,
      secretaries: doctor?.managingSecretaries || []
    })

  } catch (error) {
    console.error("Get doctor stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

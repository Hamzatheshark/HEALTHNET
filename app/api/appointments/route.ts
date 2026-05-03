import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const appointmentSchema = z.object({
  doctorId: z.string(),
  date: z.string(), // ISO date string
  time: z.string(), // e.g., "09:00"
  type: z.enum(["IN_PERSON", "VIDEO"]),
  reason: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { role, id } = session.user
    let appointments = []

    if (role === "PATIENT") {
      appointments = await prisma.appointment.findMany({
        where: { patientId: id },
        include: {
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialty: true,
            }
          }
        },
        orderBy: { date: "desc" }
      })
    } else if (role === "MEDECIN") {
      appointments = await prisma.appointment.findMany({
        where: { doctorId: id },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            }
          }
        },
        orderBy: { date: "desc" }
      })
    } else if (role === "SECRETAIRE" || role === "ADMIN") {
      appointments = await prisma.appointment.findMany({
        include: {
          patient: true,
          doctor: true,
        },
        orderBy: { date: "desc" }
      })
    }

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Get appointments error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { doctorId, patientId, date, time, type, reason, status } = body

    const targetDoctorId = (doctorId === "current" || !doctorId) ? session.user.id : doctorId
    const targetPatientId = patientId || session.user.id // For blocks, use self or a dummy

    // Check if the slot is already taken for this doctor
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: targetDoctorId,
        date: new Date(date),
        time: time,
        status: { not: "ANNULE" }
      }
    })

    if (existingAppointment) {
      return NextResponse.json({ error: "Ce creneau est deja occupe" }, { status: 400 })
    }

    // Check if the patient already has an appointment on the same day
    if (reason !== "BLOQUE" && targetPatientId !== targetDoctorId) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const patientExistingApt = await prisma.appointment.findFirst({
        where: {
          patientId: targetPatientId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: { not: "ANNULE" },
          reason: { not: "BLOQUE" }
        }
      })

      if (patientExistingApt) {
        return NextResponse.json({ error: "Vous avez deja un rendez-vous planifie pour cette journee" }, { status: 400 })
      }
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: targetPatientId,
        doctorId: targetDoctorId,
        date: new Date(date),
        time: time,
        type: type || "IN_PERSON",
        reason: reason,
        status: status || (reason === "BLOQUE" ? "BLOQUE" : "PLANIFIE")
      },
      include: {
        doctor: true,
        patient: true
      }
    })

    // Notify if not a block
    if (reason !== "BLOQUE") {
      const notifyUserId = session.user.role === "PATIENT" ? targetDoctorId : targetPatientId
      const title = session.user.role === "PATIENT" ? "Nouveau rendez-vous" : "Rendez-vous planifie"
      const message = session.user.role === "PATIENT" 
        ? `Un nouveau rendez-vous a ete planifie par ${session.user.name} pour le ${new Date(date).toLocaleDateString()} a ${time}.`
        : `Le Dr. ${session.user.name} a planifie un rendez-vous pour vous le ${new Date(date).toLocaleDateString()} a ${time}.`

      await prisma.notification.create({
        data: {
          userId: notifyUserId,
          title,
          message,
          type: "INFO"
        }
      })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Create appointment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["MEDECIN", "SECRETAIRE", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 })
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: { patient: true, doctor: true }
    })

    // Notify the other party
    const isDoctorAction = ["MEDECIN", "SECRETAIRE", "ADMIN"].includes(session.user.role)
    const notifyUserId = isDoctorAction ? appointment.patientId : appointment.doctorId
    const title = `Rendez-vous ${status.toLowerCase()}`
    const message = isDoctorAction
      ? `Votre rendez-vous avec le Dr. ${appointment.doctor.lastName} le ${appointment.date.toLocaleDateString()} a ${appointment.time} a ete ${status.toLowerCase()}.`
      : `Le patient ${appointment.patient.firstName} ${appointment.patient.lastName} a ${status.toLowerCase()} le rendez-vous du ${appointment.date.toLocaleDateString()} a ${appointment.time}.`

    if (appointment.reason !== "BLOQUE") {
      await prisma.notification.create({
        data: {
          userId: notifyUserId,
          title,
          message,
          type: status === "CONFIRME" ? "SUCCESS" : "WARNING"
        }
      })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Update appointment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
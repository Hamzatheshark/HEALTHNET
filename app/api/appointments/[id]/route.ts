import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const updateAppointmentSchema = z.object({
  date: z.string().optional(),
  time: z.string().optional(),
  location: z.string().optional(),
  reason: z.string().optional(),
  status: z.string().optional(),
})

export async function PATCH(
  request: NextRequest,
  context: { params: any }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await context.params
    const appointmentId = resolvedParams.id
    const body = await request.json()
    const validatedData = updateAppointmentSchema.parse(body)

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: {
        id: true,
        patientId: true,
        doctorId: true,
      },
    })

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    if (
      session.user.id !== appointment.patientId &&
      session.user.id !== appointment.doctorId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updateData: Record<string, any> = {}

    if (validatedData.date) {
      updateData.date = new Date(validatedData.date)
    }

    if (validatedData.time) {
      updateData.time = validatedData.time
    }

    if (validatedData.location !== undefined) {
      updateData.location = validatedData.location
    }

    if (validatedData.reason !== undefined) {
      updateData.reason = validatedData.reason
    }

    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
      include: {
        doctor: true,
        patient: true,
      },
    })

    // Notify on status change to ANNULE
    if (validatedData.status === "ANNULE") {
      const isPatient = session.user.id === updatedAppointment.patientId
      const isDoctor = session.user.id === updatedAppointment.doctorId
      const isSecretary = session.user.role === "SECRETAIRE"

      const dateStr = updatedAppointment.date ? new Date(updatedAppointment.date).toLocaleDateString("fr-FR") : ""
      const title = "Rendez-vous annulé"
      
      // If patient cancels, notify doctor
      if (isPatient) {
        await prisma.notification.create({
          data: {
            userId: updatedAppointment.doctorId,
            title,
            message: `Le patient ${updatedAppointment.patient.firstName} ${updatedAppointment.patient.lastName} a annulé son rendez-vous du ${dateStr} à ${updatedAppointment.time}.`,
            type: "WARNING"
          }
        })
      } 
      // If doctor cancels, notify patient
      else if (isDoctor) {
        await prisma.notification.create({
          data: {
            userId: updatedAppointment.patientId,
            title,
            message: `Le Dr. ${updatedAppointment.doctor.lastName} a annulé votre rendez-vous du ${dateStr} à ${updatedAppointment.time}.`,
            type: "WARNING"
          }
        })
      }
      // If secretary cancels, notify both
      else if (isSecretary) {
        await Promise.all([
          prisma.notification.create({
            data: {
              userId: updatedAppointment.doctorId,
              title,
              message: `Votre secrétaire a annulé le rendez-vous du patient ${updatedAppointment.patient.firstName} ${updatedAppointment.patient.lastName} le ${dateStr} à ${updatedAppointment.time}.`,
              type: "WARNING"
            }
          }),
          prisma.notification.create({
            data: {
              userId: updatedAppointment.patientId,
              title,
              message: `Le cabinet du Dr. ${updatedAppointment.doctor.lastName} a annulé votre rendez-vous du ${dateStr} à ${updatedAppointment.time}.`,
              type: "WARNING"
            }
          })
        ])
      }
    }

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Update appointment error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: any }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await context.params
    const appointmentId = resolvedParams.id

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { doctor: true, patient: true }
    })

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    if (
      session.user.id !== appointment.patientId &&
      session.user.id !== appointment.doctorId &&
      session.user.role !== "SECRETAIRE" &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const deletedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "ANNULE" },
      include: {
        doctor: true,
        patient: true,
      },
    })

    // Notify the other party
    const isPatient = session.user.id === appointment.patientId
    const isDoctor = session.user.id === appointment.doctorId
    const isSecretary = session.user.role === "SECRETAIRE"
    
    const dateStr = deletedAppointment.date ? new Date(deletedAppointment.date).toLocaleDateString("fr-FR") : ""
    const title = "Rendez-vous annulé"

    if (isPatient) {
      await prisma.notification.create({
        data: {
          userId: deletedAppointment.doctorId,
          title,
          message: `Le patient ${deletedAppointment.patient.firstName} ${deletedAppointment.patient.lastName} a annulé son rendez-vous du ${dateStr} à ${deletedAppointment.time}.`,
          type: "WARNING"
        }
      })
    } else if (isDoctor) {
      await prisma.notification.create({
        data: {
          userId: deletedAppointment.patientId,
          title,
          message: `Le Dr. ${deletedAppointment.doctor.lastName} a annulé votre rendez-vous du ${dateStr} à ${deletedAppointment.time}.`,
          type: "WARNING"
        }
      })
    } else if (isSecretary) {
      await Promise.all([
        prisma.notification.create({
          data: {
            userId: deletedAppointment.doctorId,
            title,
            message: `Votre secrétaire a annulé le rendez-vous du patient ${deletedAppointment.patient.firstName} ${deletedAppointment.patient.lastName} le ${dateStr} à ${deletedAppointment.time}.`,
            type: "WARNING"
          }
        }),
        prisma.notification.create({
          data: {
            userId: deletedAppointment.patientId,
            title,
            message: `Le cabinet du Dr. ${deletedAppointment.doctor.lastName} a annulé votre rendez-vous du ${dateStr} à ${deletedAppointment.time}.`,
            type: "WARNING"
          }
        })
      ])
    }

    return NextResponse.json(deletedAppointment)
  } catch (error) {
    console.error("Cancel appointment error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

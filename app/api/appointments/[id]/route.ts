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
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialty: true,
          },
        },
      },
    })

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

    const deletedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELLED" },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialty: true,
          },
        },
      },
    })

    return NextResponse.json(deletedAppointment)
  } catch (error) {
    console.error("Cancel appointment error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

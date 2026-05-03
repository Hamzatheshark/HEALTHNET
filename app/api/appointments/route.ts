import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const createAppointmentSchema = z.object({
  doctorId: z.string(),
  date: z.string(),
  time: z.string(),
  type: z.enum(["IN_PERSON", "TELECONSULTATION"]).default("IN_PERSON"),
  location: z.string().optional(),
  reason: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    let where: any = {}

    if (session.user.role === "PATIENT") {
      where.patientId = session.user.id
    } else if (session.user.role === "MEDECIN") {
      where.doctorId = session.user.id
    }

    if (status) {
      where.status = status
    }

    if (type) {
      where.type = type
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialty: true,
          }
        },
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: {
        date: "desc"
      }
    })

    return NextResponse.json(appointments)

  } catch (error) {
    console.error("Get appointments error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "PATIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createAppointmentSchema.parse(body)

    const appointmentDateTime = new Date(`${validatedData.date}T${validatedData.time}`)
    if (isNaN(appointmentDateTime.getTime()) || appointmentDateTime <= new Date()) {
      return NextResponse.json(
        { error: "La date et l'heure du rendez-vous doivent être dans le futur." },
        { status: 400 }
      )
    }

    // Check if doctor exists
    const doctor = await prisma.user.findUnique({
      where: { id: validatedData.doctorId, role: "MEDECIN" }
    })

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: session.user.id,
        doctorId: validatedData.doctorId,
        date: new Date(validatedData.date),
        time: validatedData.time,
        type: validatedData.type,
        location: validatedData.location,
        reason: validatedData.reason,
      },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            specialty: true,
          }
        }
      }
    })

    return NextResponse.json(appointment, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Create appointment error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
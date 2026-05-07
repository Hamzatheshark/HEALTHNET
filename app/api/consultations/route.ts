import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const createConsultationSchema = z.object({
  patientId: z.string(),
  appointmentId: z.string().optional(),
  reason: z.string(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  prescription: z.boolean().default(false),
  recommendations: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let where: any = {}

    if (session.user.role === "PATIENT") {
      where.patientId = session.user.id
    } else if (session.user.role === "MEDECIN") {
      where.doctorId = session.user.id
    }

    const consultations = await prisma.consultation.findMany({
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
        },
        appointment: {
          select: {
            id: true,
            date: true,
            time: true,
            type: true,
          }
        }
      },
      orderBy: {
        date: "desc"
      }
    })

    return NextResponse.json(consultations)

  } catch (error) {
    console.error("Get consultations error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "MEDECIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createConsultationSchema.parse(body)

    // Check if patient exists
    const patient = await prisma.user.findUnique({
      where: { id: validatedData.patientId, role: "PATIENT" }
    })

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      )
    }

    const consultation = await prisma.consultation.create({
      data: {
        patientId: validatedData.patientId,
        doctorId: session.user.id,
        date: new Date(),
        reason: validatedData.reason,
        diagnosis: validatedData.diagnosis,
        treatment: validatedData.treatment,
        prescription: validatedData.prescription,
        recommendations: validatedData.recommendations,
        notes: validatedData.notes,
        appointmentId: validatedData.appointmentId,
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    })

    return NextResponse.json(consultation, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Create consultation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
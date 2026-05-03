import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "MEDECIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const consultations = await prisma.consultation.findMany({
      where: { doctorId: session.user.id },
      include: {
        patient: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(consultations)
  } catch (error) {
    console.error("Fetch consultations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "MEDECIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { patientId, reason, diagnosis, treatment, notes, recommendations } = body

    if (!patientId || !reason) {
      return NextResponse.json({ error: "Patient and Reason are required" }, { status: 400 })
    }

    const consultation = await prisma.consultation.create({
      data: {
        doctorId: session.user.id,
        patientId,
        date: new Date(),
        reason,
        diagnosis,
        treatment,
        notes,
        recommendations
      }
    })

    // Notify patient
    await prisma.notification.create({
      data: {
        userId: patientId,
        title: "Nouvelle consultation enregistree",
        message: `Le Dr. ${session.user.name} a enregistre le compte-rendu de votre consultation.`,
        type: "INFO"
      }
    })

    return NextResponse.json(consultation)
  } catch (error) {
    console.error("Create consultation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

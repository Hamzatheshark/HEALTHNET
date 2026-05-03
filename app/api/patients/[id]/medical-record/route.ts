import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PUT(
  request: NextRequest,
  context: { params: any }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["MEDECIN", "SECRETAIRE", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Safely get patientId from params (handle both Promise and direct object)
    const params = await context.params
    const patientId = params.id

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    const body = await request.json()

    // Perform upsert
    const medicalRecord = await prisma.medicalRecord.upsert({
      where: { patientId: patientId },
      update: {
        bloodType: body.bloodType || null,
        height: body.height || null,
        weight: body.weight || null,
        allergies: body.allergies || null,
        chronicDiseases: body.chronicDiseases || null,
        medicalHistory: body.medicalHistory || null,
      },
      create: {
        patientId: patientId,
        bloodType: body.bloodType || null,
        height: body.height || null,
        weight: body.weight || null,
        allergies: body.allergies || null,
        chronicDiseases: body.chronicDiseases || null,
        medicalHistory: body.medicalHistory || null,
      }
    })

    // Create notification (non-blocking)
    prisma.notification.create({
      data: {
        userId: patientId,
        title: "Mise a jour dossier medical",
        message: `Votre dossier medical a ete mis a jour par ${session.user.name}.`,
        type: "INFO",
      }
    }).catch(err => console.error("Notification error:", err))

    return NextResponse.json(medicalRecord)

  } catch (error) {
    console.error("Update medical record error:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}

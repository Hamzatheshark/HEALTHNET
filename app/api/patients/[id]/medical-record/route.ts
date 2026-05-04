import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function PUT(
  request: NextRequest, 
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["MEDECIN", "SECRETAIRE", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Handle async params in Next.js 15
    const resolvedParams = await params
    const patientId = resolvedParams.id

    if (!patientId) {
      console.error("[API-ERROR] Missing patientId in params")
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    const body = await request.json()
    console.log(`[API-DEBUG] Updating patient: ${patientId}`)
    console.log(`[API-DEBUG] Body:`, JSON.stringify(body, null, 2))

    // Update user personal info
    try {
      if (body.birthDate || body.birthDate === "") {
        const birthDateValue = body.birthDate ? new Date(body.birthDate) : null
        console.log(`[API-DEBUG] Raw updating birthDate:`, birthDateValue)
        await prisma.$executeRaw`UPDATE users SET birthDate = ${birthDateValue} WHERE id = ${patientId}`
      }

      if (body.cin !== undefined) {
        const cinValue = body.cin || null
        console.log(`[API-DEBUG] Raw updating cin:`, cinValue)
        await prisma.$executeRaw`UPDATE users SET cin = ${cinValue} WHERE id = ${patientId}`
      }
    } catch (userUpdateError) {
      console.error("[API-ERROR] User update failed:", userUpdateError)
      // We continue to medical record update even if user update fails
    }

    // Perform upsert for the main record
    const upsertedRecord = await prisma.medicalRecord.upsert({
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

    // Sync treatments if provided
    if (body.treatments) {
      await prisma.treatment.deleteMany({
        where: { medicalRecordId: upsertedRecord.id }
      })
      
      if (body.treatments.length > 0) {
        await prisma.treatment.createMany({
          data: body.treatments.map((t: any) => ({
            medicalRecordId: upsertedRecord.id,
            name: t.name,
            dosage: t.dosage,
            frequency: t.frequency,
            prescribedBy: t.prescribedBy,
            startDate: new Date(t.startDate),
            endDate: t.endDate ? new Date(t.endDate) : null,
          }))
        })
      }
    }

    // Sync vaccinations if provided
    if (body.vaccinations) {
      await prisma.vaccination.deleteMany({
        where: { medicalRecordId: upsertedRecord.id }
      })
      
      if (body.vaccinations.length > 0) {
        await prisma.vaccination.createMany({
          data: body.vaccinations.map((v: any) => ({
            medicalRecordId: upsertedRecord.id,
            name: v.name,
            date: new Date(v.date),
            nextDue: v.nextDue ? new Date(v.nextDue) : null,
          }))
        })
      }
    }

    console.log(`[API] Medical record and related data updated successfully for: ${patientId}`)

    // Create notification
    try {
      await prisma.notification.create({
        data: {
          userId: patientId,
          title: "Mise a jour dossier medical",
          message: `Votre dossier medical a ete mis a jour par ${session.user.name}.`,
          type: "INFO",
        }
      })
    } catch (notificationError) {
      console.error("[API] Failed to create notification:", notificationError)
    }

    // Fetch the final state to confirm using raw query to bypass Client limitations
    const rawUsers = await prisma.$queryRaw<any[]>`SELECT id, birthDate, cin FROM users WHERE id = ${patientId}`
    const rawUser = rawUsers[0]
    
    // Also fetch the medical record normally
    const finalRecord = await prisma.medicalRecord.findUnique({
      where: { patientId: patientId },
      include: {
        treatments: true,
        vaccinations: true
      }
    })

    console.log(`[API-DEBUG] Raw Final state:`, JSON.stringify(rawUser, null, 2))

    return NextResponse.json({
      ...rawUser,
      medicalRecord: finalRecord
    })

  } catch (error) {
    console.error("[API-ERROR] Global error in PUT:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}

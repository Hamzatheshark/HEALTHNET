import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const patientId = session.user.id

    const user = await prisma.user.findUnique({
      where: { id: patientId },
      include: {
        medicalRecord: {
          include: {
            treatments: true,
            vaccinations: true,
          }
        },
        consultationsAsPatient: {
          orderBy: { date: "desc" },
          include: {
            doctor: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const medicalRecord = user.medicalRecord

    const medicalFile = {
      patientInfo: {
        name: `${user.firstName} ${user.lastName}`,
        birthDate: user.birthDate ? user.birthDate.toLocaleDateString() : "Non renseignee",
        bloodType: medicalRecord?.bloodType || "Non renseigne",
        height: medicalRecord?.height || "Non renseignee",
        weight: medicalRecord?.weight || "Non renseigne",
        allergies: medicalRecord?.allergies ? medicalRecord.allergies.split(",") : [],
        chronicConditions: medicalRecord?.chronicDiseases ? medicalRecord.chronicDiseases.split(",") : [],
      },
      medicalHistory: user.consultationsAsPatient.map(c => ({
        date: c.date.toLocaleDateString(),
        type: "Consultation",
        doctor: `Dr. ${c.doctor.firstName} ${c.doctor.lastName}`,
        summary: c.reason,
        documents: c.reportUrl ? ["Compte-rendu"] : [],
      })),
      currentTreatments: medicalRecord?.treatments.map(t => ({
        name: t.name,
        dosage: t.dosage,
        frequency: t.frequency,
        prescribedBy: t.prescribedBy,
        startDate: t.startDate.toLocaleDateString(),
      })) || [],
      vaccinations: medicalRecord?.vaccinations.map(v => ({
        name: v.name,
        date: v.date.toLocaleDateString(),
        nextDue: v.nextDue ? v.nextDue.toLocaleDateString() : "-",
      })) || [],
    }

    return NextResponse.json(medicalFile)
  } catch (error) {
    console.error("Get medical file error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


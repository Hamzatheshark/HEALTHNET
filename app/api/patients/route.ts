import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "MEDECIN" && session.user.role !== "SECRETAIRE" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use a raw query to fetch patients to ensure new fields are included
    // regardless of whether the Prisma Client has been regenerated.
    let patients: any[] = []
    
    if (session.user.role === "MEDECIN") {
      patients = await prisma.$queryRaw`
        SELECT u.* FROM users u
        JOIN appointments a ON a.patientId = u.id
        WHERE u.role = 'PATIENT' AND a.doctorId = ${session.user.id}
        GROUP BY u.id
        ORDER BY u.lastName ASC
      `
    } else if (session.user.role === "SECRETAIRE") {
      const secretary = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { managedDoctors: true }
      })
      const managedDoctorIds = secretary?.managedDoctors.map(d => d.id) || []
      
      patients = await prisma.$queryRaw`
        SELECT u.* FROM users u
        JOIN appointments a ON a.patientId = u.id
        WHERE u.role = 'PATIENT' AND a.doctorId IN (${managedDoctorIds.join(',')})
        GROUP BY u.id
        ORDER BY u.lastName ASC
      `
    } else {
      patients = await prisma.$queryRaw`
        SELECT * FROM users WHERE role = 'PATIENT' ORDER BY lastName ASC
      `
    }

    // Now enrich with medical records (which uses the Client safely)
    const enrichedPatients = await Promise.all(patients.map(async (patient) => {
      const medicalRecord = await prisma.medicalRecord.findUnique({
        where: { patientId: patient.id },
        include: {
          treatments: true,
          vaccinations: true
        }
      })
      return {
        ...patient,
        medicalRecord
      }
    }))

    return NextResponse.json(enrichedPatients)

  } catch (error) {
    console.error("Get patients error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

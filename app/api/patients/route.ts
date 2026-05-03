import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "MEDECIN" && session.user.role !== "SECRETAIRE" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let whereClause: any = { role: "PATIENT" }

    if (session.user.role === "MEDECIN") {
      whereClause = {
        role: "PATIENT",
        appointmentsAsPatient: {
          some: {
            doctorId: session.user.id
          }
        }
      }
    } else if (session.user.role === "SECRETAIRE") {
      const secretary = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { managedDoctors: true }
      })
      const managedDoctorIds = secretary?.managedDoctors.map(d => d.id) || []
      
      whereClause = {
        role: "PATIENT",
        appointmentsAsPatient: {
          some: {
            doctorId: { in: managedDoctorIds }
          }
        }
      }
    }

    const patients = await prisma.user.findMany({
      where: whereClause,
      include: {
        medicalRecord: true
      },
      orderBy: {
        lastName: "asc"
      }
    })

    return NextResponse.json(patients)

  } catch (error) {
    console.error("Get patients error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

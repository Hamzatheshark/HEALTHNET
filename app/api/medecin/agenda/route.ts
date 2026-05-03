import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "MEDECIN" && session.user.role !== "SECRETAIRE")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get("date")
    const requestedDoctorId = searchParams.get("doctorId")
    
    let targetDoctorId = session.user.id

    if (session.user.role === "SECRETAIRE") {
      if (!requestedDoctorId) {
        return NextResponse.json({ error: "Doctor ID is required for secretary" }, { status: 400 })
      }
      
      const isManaged = await prisma.user.findFirst({
        where: {
          id: session.user.id,
          managedDoctors: { some: { id: requestedDoctorId } }
        }
      })

      if (!isManaged) {
        return NextResponse.json({ error: "You do not manage this doctor" }, { status: 403 })
      }
      targetDoctorId = requestedDoctorId
    }

    if (!dateStr) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }

    const targetDate = new Date(dateStr)
    const startOfDay = new Date(targetDate)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(targetDate)
    endOfDay.setHours(23, 59, 59, 999)

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: targetDoctorId,
        status: { not: "ANNULE" },
        date: {
          gte: startOfDay,
          lte: endOfDay,
        }
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: {
        time: "asc"
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Fetch agenda error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

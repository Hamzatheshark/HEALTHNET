import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const totalUsers = await prisma.user.count()
    const activeDoctors = await prisma.user.count({ where: { role: "MEDECIN" } })
    const totalPatients = await prisma.user.count({ where: { role: "PATIENT" } })
    const totalSecretaries = await prisma.user.count({ where: { role: "SECRETAIRE" } })
    
    const totalAppointments = await prisma.appointment.count()
    const totalConsultations = await prisma.consultation.count()
    
    // Recent growth (placeholder logic for now, could be more complex)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const newUsersLast30Days = await prisma.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    })

    return NextResponse.json({
      totalUsers,
      activeDoctors,
      totalPatients,
      totalSecretaries,
      totalAppointments,
      totalConsultations,
      newUsersLast30Days
    })

  } catch (error) {
    console.error("Get admin stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

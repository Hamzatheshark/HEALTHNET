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

    // Get count of users by role
    const userStats = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        id: true,
      },
    })

    // Format the response
    const stats = {
      PATIENT: 0,
      MEDECIN: 0,
      SECRETAIRE: 0,
      ADMIN: 0,
    }

    userStats.forEach((stat) => {
      stats[stat.role as keyof typeof stats] = stat._count.id
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

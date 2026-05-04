import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    let allowedUserIds = [session.user.id]
    if (session.user.role === "SECRETAIRE") {
      const secretary = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { managedDoctors: { select: { id: true } } }
      })
      const managedDoctorIds = secretary?.managedDoctors.map(d => d.id) || []
      allowedUserIds = [...allowedUserIds, ...managedDoctorIds]
    }

    await prisma.notification.updateMany({
      where: {
        userId: { in: allowedUserIds },
        status: "UNREAD"
      },
      data: { status: "READ" }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Mark all as read error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

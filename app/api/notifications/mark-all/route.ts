import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        status: "UNREAD"
      },
      data: {
        status: "READ"
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Mark all as read error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

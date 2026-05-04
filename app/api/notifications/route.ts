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

    let whereClause: any = { userId: session.user.id }

    if (session.user.role === "SECRETAIRE") {
      const secretary = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { managedDoctors: true }
      })
      const managedDoctorIds = secretary?.managedDoctors.map(d => d.id) || []
      
      whereClause = {
        OR: [
          { userId: session.user.id },
          { userId: { in: managedDoctorIds } }
        ]
      }
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      include: {
        user: {
          select: { firstName: true, lastName: true, role: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(notifications)

  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await request.json()
    
    let allowedUserIds = [session.user.id]
    if (session.user.role === "SECRETAIRE") {
      const secretary = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { managedDoctors: { select: { id: true } } }
      })
      const managedDoctorIds = secretary?.managedDoctors.map(d => d.id) || []
      allowedUserIds = [...allowedUserIds, ...managedDoctorIds]
    }

    const notification = await prisma.notification.update({
      where: {
        id,
        userId: { in: allowedUserIds }
      },
      data: { status: "READ" }
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Update notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    let allowedUserIds = [session.user.id]
    if (session.user.role === "SECRETAIRE") {
      const secretary = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { managedDoctors: { select: { id: true } } }
      })
      const managedDoctorIds = secretary?.managedDoctors.map(d => d.id) || []
      allowedUserIds = [...allowedUserIds, ...managedDoctorIds]
    }

    await prisma.notification.delete({
      where: {
        id,
        userId: { in: allowedUserIds }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

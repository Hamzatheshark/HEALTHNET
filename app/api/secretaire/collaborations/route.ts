import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "SECRETAIRE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get pending requests: notifications this secretary sent to doctors
    const pendingNotifications = await prisma.notification.findMany({
      where: {
        message: { contains: `[ACCEPT_COLLAB:${session.user.id}]` }
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, specialty: true }
        }
      }
    })

    return NextResponse.json(pendingNotifications.map(n => ({
      doctorId: n.userId,
      doctor: n.user,
      notificationId: n.id
    })))

  } catch (error) {
    console.error("Pending requests error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "SECRETAIRE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { doctorId } = await request.json()

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 })
    }

    // Check if already linked
    const alreadyLinked = await prisma.user.findFirst({
      where: {
        id: session.user.id,
        managedDoctors: { some: { id: doctorId } }
      }
    })

    if (alreadyLinked) {
      return NextResponse.json({ error: "Deja en collaboration" }, { status: 400 })
    }

    // Check if a pending request already exists
    const existingRequest = await prisma.notification.findFirst({
      where: {
        userId: doctorId,
        message: { contains: `[ACCEPT_COLLAB:${session.user.id}]` }
      }
    })

    if (existingRequest) {
      return NextResponse.json({ error: "Demande deja envoyee" }, { status: 400 })
    }

    // Create notification for doctor to accept/refuse
    await prisma.notification.create({
      data: {
        userId: doctorId,
        title: "Demande de collaboration",
        message: `La secretaire ${session.user.name} souhaite collaborer avec vous. [ACCEPT_COLLAB:${session.user.id}]`,
        type: "INFO"
      }
    })

    return NextResponse.json({ success: true, message: "Demande envoyee" })

  } catch (error) {
    console.error("Collaboration request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE to cancel a pending request
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SECRETAIRE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get("doctorId")

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID required" }, { status: 400 })
    }

    // Remove the pending notification
    await prisma.notification.deleteMany({
      where: {
        userId: doctorId,
        message: { contains: `[ACCEPT_COLLAB:${session.user.id}]` }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cancel collaboration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "MEDECIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { secretaryId } = await request.json()

    if (!secretaryId) {
      return NextResponse.json({ error: "Secretary ID is required" }, { status: 400 })
    }

    // Link the secretary to the doctor
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        managingSecretaries: {
          connect: { id: secretaryId }
        }
      }
    })

    // Delete the pending collaboration request notification
    await prisma.notification.deleteMany({
      where: {
        userId: session.user.id,
        message: { contains: `[ACCEPT_COLLAB:${secretaryId}]` }
      }
    })

    // Notify the secretary
    await prisma.notification.create({
      data: {
        userId: secretaryId,
        title: "Collaboration acceptee",
        message: `Le Dr. ${session.user.name} a accepte votre demande de collaboration.`,
        type: "SUCCESS"
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Accept collaboration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

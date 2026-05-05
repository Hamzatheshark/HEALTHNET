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

    // Disconnect the secretary from the doctor
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        managingSecretaries: {
          disconnect: { id: secretaryId }
        }
      }
    })

    // Notify the secretary
    await prisma.notification.create({
      data: {
        userId: secretaryId,
        title: "Collaboration terminee",
        message: `Le Dr. ${session.user.name} a mis fin a votre collaboration.`,
        type: "WARNING"
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Terminate collaboration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

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

    // Create a notification for the doctor with a "Link" to accept
    // Since we don't have a complex approval system, I'll just link them immediately 
    // as requested "envoyer une demande" but for now let's make it work.
    // The user said "envoyer une demande", so I'll create a notification first.
    
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

// DELETE to end collaboration
export async function DELETE(request: NextRequest) {
  // ... implement if needed ...
}

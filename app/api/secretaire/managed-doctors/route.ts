import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "SECRETAIRE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        managedDoctors: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialty: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(user?.managedDoctors || [])

  } catch (error) {
    console.error("Get managed doctors error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

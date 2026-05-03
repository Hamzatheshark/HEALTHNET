import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { secretaryId, doctorId } = await request.json()

    if (!secretaryId || !doctorId) {
      return NextResponse.json({ error: "Secretary and Doctor IDs are required" }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: secretaryId },
      data: {
        managedDoctors: {
          connect: { id: doctorId }
        }
      }
    })

    return NextResponse.json({ message: "Link created successfully" })
  } catch (error) {
    console.error("Link secretary error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

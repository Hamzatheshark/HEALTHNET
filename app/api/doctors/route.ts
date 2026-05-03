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

    const doctors = await prisma.user.findMany({
      where: {
        role: "MEDECIN",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        specialty: true,
      },
      orderBy: {
        lastName: "asc",
      },
    })

    return NextResponse.json(doctors)
  } catch (error) {
    console.error("Get doctors error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

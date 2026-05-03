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

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    const doctors = await prisma.user.findMany({
      where: {
        role: "MEDECIN",
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { specialty: { contains: query } },
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        specialty: true,
        email: true,
      },
      take: 20
    })

    return NextResponse.json(doctors)

  } catch (error) {
    console.error("Search doctors error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

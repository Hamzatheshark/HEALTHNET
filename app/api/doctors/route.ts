import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: "MEDECIN" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        specialty: true,
      }
    })

    return NextResponse.json(doctors)
  } catch (error) {
    console.error("Fetch doctors error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

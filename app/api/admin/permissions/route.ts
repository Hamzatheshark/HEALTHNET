import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const rolePermissionsSchema = z.object({
  role: z.enum(["PATIENT", "MEDECIN", "SECRETAIRE", "ADMIN"]),
  permissions: z.array(z.string()).min(0),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const permissions = await prisma.rolePermission.findMany({
      orderBy: {
        role: "asc",
      },
    })

    // Parse the permissions JSON strings
    const parsedPermissions = permissions.map((p) => {
      try {
        return {
          ...p,
          permissions: JSON.parse(p.permissions || "[]"),
        }
      } catch (e) {
        return {
          ...p,
          permissions: [],
        }
      }
    })

    return NextResponse.json(parsedPermissions)
  } catch (error) {
    console.error("Get permissions error:", error)
    return NextResponse.json(
      { error: "Erreur lors du chargement des permissions" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Request body:", body)
    
    const validatedData = rolePermissionsSchema.parse(body)
    console.log("Validated data:", validatedData)

    // Find and update or create the role permissions
    const updatedPermissions = await prisma.rolePermission.upsert({
      where: { role: validatedData.role },
      update: { permissions: JSON.stringify(validatedData.permissions) },
      create: {
        role: validatedData.role,
        permissions: JSON.stringify(validatedData.permissions),
      },
    })

    console.log("Updated permissions:", updatedPermissions)

    return NextResponse.json({
      ...updatedPermissions,
      permissions: JSON.parse(updatedPermissions.permissions),
    })
  } catch (error) {
    console.error("Update permissions error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Erreur de format JSON" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de la sauvegarde" },
      { status: 500 }
    )
  }
}

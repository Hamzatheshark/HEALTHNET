"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (!session) {
      router.push("/login")
      return
    }

    // Redirect based on role
    const roleRoutes = {
      PATIENT: "/dashboard/patient/rendez-vous",
      MEDECIN: "/dashboard/medecin/dashboard",
      SECRETAIRE: "/dashboard/secretaire/agenda-global",
      ADMIN: "/dashboard/admin",
    }

    const route = roleRoutes[session.user.role as keyof typeof roleRoutes] || "/dashboard/patient/rendez-vous"
    router.push(route)
  }, [session, status, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Redirection en cours...</p>
      </div>
    </div>
  )
}
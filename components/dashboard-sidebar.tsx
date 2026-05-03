"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Heart,
  Calendar,
  Search,
  FileText,
  Stethoscope,
  Bell,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  UserPlus,
  Shield,
  Key,
  CalendarDays,
  Menu,
  X,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type UserRole = "patient" | "medecin" | "secretaire" | "admin"

interface SidebarProps {
  role: UserRole
  userName: string
}

const menuItems = {
  patient: [
    { href: "/dashboard/patient/rendez-vous", label: "Mes rendez-vous", icon: Calendar },
    { href: "/dashboard/patient/chercher-medecin", label: "Chercher medecin", icon: Search },
    { href: "/dashboard/patient/dossier-medical", label: "Mon dossier medical", icon: FileText },
    { href: "/dashboard/patient/consultations", label: "Mes consultations", icon: Stethoscope },
    { href: "/dashboard/patient/notifications", label: "Notifications", icon: Bell },
  ],
  medecin: [
    { href: "/dashboard/medecin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/medecin/agenda", label: "Agenda", icon: Calendar },
    { href: "/dashboard/medecin/patients", label: "Patients", icon: Users },
    { href: "/dashboard/medecin/consultations", label: "Consultations", icon: Stethoscope },
    { href: "/dashboard/medecin/notifications", label: "Notifications", icon: Bell },
  ],
  secretaire: [
    { href: "/dashboard/secretaire/collaborations", label: "Collaborations", icon: UserPlus },
    { href: "/dashboard/secretaire/agenda-global", label: "Agenda global", icon: CalendarDays },
    { href: "/dashboard/secretaire/gestion-patients", label: "Gestion patients", icon: Users },
    { href: "/dashboard/secretaire/planning-medical", label: "Planning medical", icon: Calendar },
    { href: "/dashboard/secretaire/notifications", label: "Notifications", icon: Bell },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/utilisateurs", label: "Utilisateurs", icon: Users },
    { href: "/dashboard/admin/creer-compte", label: "Creer un compte", icon: UserPlus },
    { href: "/dashboard/admin/roles", label: "Gestion des roles", icon: Shield },
  ],
}

const profileItems = {
  patient: [
    { href: "/dashboard/patient/profile/infos", label: "Infos personnelles", icon: User },
    { href: "/dashboard/patient/profile/changer-mdp", label: "Changer mot de passe", icon: Key },
  ],
  medecin: [
    { href: "/dashboard/medecin/profile/infos", label: "Info medecin", icon: User },
    { href: "/dashboard/medecin/profile/parametres", label: "Parametres", icon: Settings },
  ],
  secretaire: [
    { href: "/dashboard/secretaire/profile/infos", label: "Infos", icon: User },
    { href: "/dashboard/secretaire/profile/changer-mdp", label: "Changer mot de passe", icon: Key },
  ],
  admin: [],
}

export function DashboardSidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/notifications")
        const data = await response.json()
        if (response.ok) {
          const count = data.filter((n: any) => n.status === "UNREAD").length
          setUnreadCount(count)
        }
      } catch (error) {
        console.error("Error fetching notification count:", error)
      }
    }

    fetchUnreadCount()
    
    const handleUpdate = () => fetchUnreadCount()
    window.addEventListener("notificationsUpdated", handleUpdate)

    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => {
      clearInterval(interval)
      window.removeEventListener("notificationsUpdated", handleUpdate)
    }
  }, [])

  const items = menuItems[role]
  const profile = profileItems[role]
  const displayName = role === "medecin" ? `Dr ${userName}` : role === "secretaire" ? "Secretariat" : role === "admin" ? "Admin HealthNet" : userName

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo & User */}
      <div className="border-b border-sidebar-border p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">HealthNet</span>
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">{role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {items.map((item) => {
          const isActive = pathname === item.href
          const isNotifications = item.label === "Notifications"
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
              {isNotifications && unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 rounded-full text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </Link>
          )
        })}

        {/* Profile Section */}
        {profile.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent"
            >
              <span className="flex items-center gap-3">
                <User className="h-5 w-5" />
                Profil
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", profileOpen && "rotate-180")} />
            </button>
            {profileOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                {profile.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-4">
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Deconnexion
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold">HealthNet</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">
          <SidebarContent />
        </div>
      </aside>
    </>
  )
}

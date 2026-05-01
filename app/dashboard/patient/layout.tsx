import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="patient" userName="Marie Dupont" />
      <main className="flex-1 bg-background lg:ml-0">
        <div className="container mx-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

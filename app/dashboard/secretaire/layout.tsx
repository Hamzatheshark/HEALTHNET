import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function SecretaireLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="secretaire" userName="Claire Martin" />
      <main className="flex-1 bg-background lg:ml-0">
        <div className="container mx-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

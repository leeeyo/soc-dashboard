import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <main className="flex-1 w-full overflow-x-hidden">
          <div className="w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

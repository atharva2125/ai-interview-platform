import type React from "react"
import AuthCheck from "@/components/auth-check"
import DashboardNav from "./dashboard-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthCheck>
      <div className="flex min-h-screen flex-col">
        <DashboardNav />
        <div className="flex-1">{children}</div>
      </div>
    </AuthCheck>
  )
}

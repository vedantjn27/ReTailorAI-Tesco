import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeInitializer } from "@/components/theme-initializer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <ThemeInitializer />
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        <AppSidebar />
        <main className="flex-1 overflow-auto w-full">{children}</main>
      </div>
    </SidebarProvider>
  )
}

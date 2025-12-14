"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sparkles,
  Layers,
  LayoutTemplate,
  Upload,
  Settings,
  FolderKanban,
  CheckCircle2,
  Wand2,
  Share2,
  Download,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

const navigation = [
  {
    title: "Workspace",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: FolderKanban,
      },
      {
        title: "Asset Library",
        url: "/assets",
        icon: Upload,
      },
    ],
  },
  {
    title: "Create",
    items: [
      {
        title: "Canvas Editor",
        url: "/editor",
        icon: Layers,
      },
      {
        title: "Templates",
        url: "/templates",
        icon: LayoutTemplate,
      },
      {
        title: "AI Suggestions",
        url: "/ai-suggestions",
        icon: Sparkles,
      },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        title: "Smart Enhance",
        url: "/enhance",
        icon: Wand2,
      },
      {
        title: "Compliance Check",
        url: "/compliance",
        icon: CheckCircle2,
      },
      {
        title: "Batch Export",
        url: "/export",
        icon: Download,
      },
      {
        title: "Collaboration",
        url: "/collaboration",
        icon: Share2,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-6">
        <Link href="/dashboard" className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
              ReTailor AI
            </span>
            <span className="block text-xs text-muted-foreground mt-1">Creative Studio</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

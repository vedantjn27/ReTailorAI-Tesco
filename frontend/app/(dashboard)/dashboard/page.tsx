"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, TrendingUp, Image, Sparkles, Clock, FolderKanban, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface SavedProject {
  id: string
  name: string
  status: "active" | "draft" | "completed"
  createdAt: string
  thumbnail: string | null
  assetsCount: number
  progress: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function DashboardPage() {
  const [recentProjects, setRecentProjects] = useState<SavedProject[]>([])
  const [demoMode, setDemoMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("demo_mode") === "true"
    }
    return false
  })

  // Check backend connection and auto-manage demo mode
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(3000)
        })
        
        if (response.ok) {
          // Backend is connected, disable demo mode
          if (demoMode) {
            console.log('[Dashboard] Backend connected - disabling demo mode')
            setDemoMode(false)
            localStorage.setItem("demo_mode", "false")
          }
        } else {
          // Backend not reachable, enable demo mode
          if (!demoMode) {
            console.log('[Dashboard] Backend not connected - enabling demo mode')
            setDemoMode(true)
            localStorage.setItem("demo_mode", "true")
          }
        }
      } catch (error) {
        // Backend not reachable, enable demo mode
        if (!demoMode) {
          console.log('[Dashboard] Backend error - enabling demo mode')
          setDemoMode(true)
          localStorage.setItem("demo_mode", "true")
        }
      }
    }

    checkBackendConnection()
  }, [])

  useEffect(() => {
    const loadProjects = () => {
      const savedProjects = JSON.parse(localStorage.getItem("retailor_projects") || "[]")
      setRecentProjects(savedProjects.reverse().slice(0, 6))
    }
    loadProjects()

    // Refresh every 2 seconds to catch updates
    const interval = setInterval(loadProjects, 2000)
    return () => clearInterval(interval)
  }, [])

  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalAssets: 156,
    exportsThisMonth: 342,
  })

  useEffect(() => {
    setStats((prev) => ({
      ...prev,
      totalProjects: recentProjects.length,
      activeProjects: recentProjects.filter((p) => p.status === "active").length,
    }))
  }, [recentProjects])

  const quickActions = [
    {
      title: "New Project",
      description: "Start a blank canvas",
      icon: Plus,
      href: "/editor",
      gradient: "gradient-primary",
    },
    {
      title: "Use Template",
      description: "Browse pre-made designs",
      icon: Sparkles,
      href: "/templates",
      gradient: "gradient-accent",
    },
    {
      title: "Upload Assets",
      description: "Add product images",
      icon: Image,
      href: "/assets",
      gradient: "from-chart-2 to-chart-1",
    },
    {
      title: "AI Suggestions",
      description: "Get layout ideas",
      icon: TrendingUp,
      href: "/ai-suggestions",
      gradient: "gradient-warm",
    },
  ]

  const weeklyActivity = [
    { day: "Mon", exports: 12, projects: 3 },
    { day: "Tue", exports: 19, projects: 5 },
    { day: "Wed", exports: 15, projects: 4 },
    { day: "Thu", exports: 25, projects: 6 },
    { day: "Fri", exports: 22, projects: 4 },
    { day: "Sat", exports: 8, projects: 2 },
    { day: "Sun", exports: 5, projects: 1 },
  ]

  const maxExports = Math.max(...weeklyActivity.map((d) => d.exports))

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-gradient-to-r from-primary/10 via-accent/10 to-chart-3/10 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl sm:rounded-2xl gradient-primary shadow-xl">
              <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
                ReTailor AI
              </h1>
              <p className="mt-0.5 sm:mt-1 text-muted-foreground text-sm sm:text-base md:text-lg">
                Create stunning retail media in minutes
              </p>
            </div>
          </div>
          <Link href="/editor" className="w-full sm:w-auto">
            <Button size="lg" className="gap-2 gradient-primary shadow-lg w-full sm:w-auto">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
          {/* Stats Grid */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-chart-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <FolderKanban className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-success" />
                  {stats.activeProjects} active campaigns
                </p>
                <Progress
                  value={stats.totalProjects > 0 ? (stats.activeProjects / stats.totalProjects) * 100 : 0}
                  className="mt-2 h-1"
                />
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-chart-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                <Image className="h-4 w-4 text-chart-2" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAssets}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-success" />
                  +12 this week
                </p>
                <Progress value={78} className="mt-2 h-1" />
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-chart-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Exports</CardTitle>
                <TrendingUp className="h-4 w-4 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.exportsThisMonth}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-success" />
                  This month
                </p>
                <Progress value={65} className="mt-2 h-1" />
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-chart-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Generated</CardTitle>
                <Sparkles className="h-4 w-4 text-chart-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-success" />
                  Layout suggestions used
                </p>
                <Progress value={89} className="mt-2 h-1" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Weekly Activity</CardTitle>
              <CardDescription className="text-sm">Your exports and project creation this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2 h-40">
                {weeklyActivity.map((data, index) => (
                  <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex-1 w-full flex flex-col justify-end gap-1">
                      <div
                        className="w-full rounded-t-md gradient-primary transition-all hover:opacity-80"
                        style={{ height: `${(data.exports / maxExports) * 100}%` }}
                      />
                      <div
                        className="w-full rounded-t-md bg-chart-2 transition-all hover:opacity-80"
                        style={{ height: `${(data.projects / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{data.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded gradient-primary" />
                  <span className="text-sm text-muted-foreground">Exports</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-chart-2" />
                  <span className="text-sm text-muted-foreground">Projects</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div>
            <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold">Quick Actions</h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Card className="transition-all hover:scale-105 hover:shadow-lg border-transparent hover:border-primary/50">
                    <CardHeader>
                      <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-lg ${action.gradient}`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-base">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Projects & Campaigns */}
          <Tabs defaultValue="recent" className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <TabsList>
                <TabsTrigger value="recent" className="text-sm">
                  Recent Projects
                </TabsTrigger>
                <TabsTrigger value="campaigns" className="text-sm">
                  Campaigns
                </TabsTrigger>
              </TabsList>
              <Link href="/campaigns">
                <Button variant="ghost" size="sm" className="text-sm">
                  View all
                </Button>
              </Link>
            </div>

            <TabsContent value="recent" className="mt-4 sm:mt-6">
              {recentProjects.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FolderKanban className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
                    <p className="mt-2 text-center text-sm text-muted-foreground text-balance">
                      Create your first project to get started with ReTailor AI
                    </p>
                    <Link href="/editor">
                      <Button className="mt-4 gradient-primary">Create Your First Project</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recentProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/50"
                    >
                      <div className="aspect-video w-full overflow-hidden bg-muted relative group">
                        {project.thumbnail ? (
                          <img
                            src={project.thumbnail || "/placeholder.svg"}
                            alt={project.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                            <Image className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base text-balance">{project.name}</CardTitle>
                            <CardDescription className="mt-1 flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {new Date(project.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              project.status === "active"
                                ? "default"
                                : project.status === "completed"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{project.assetsCount} assets</span>
                            <span className="text-muted-foreground">{project.progress}% complete</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                          <Link href={`/editor?project=${project.id}`}>
                            <Button size="sm" variant="outline" className="w-full bg-transparent">
                              Open Project
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="campaigns" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Management</CardTitle>
                  <CardDescription>Organize your projects into campaigns for better workflow</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12">
                    <FolderKanban className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No campaigns yet</h3>
                    <p className="mt-2 text-center text-sm text-muted-foreground text-balance">
                      Create your first campaign to organize multiple projects together
                    </p>
                    <Button className="mt-4 gradient-primary">Create Campaign</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
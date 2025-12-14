"use client"

import { useState, useEffect } from "react"
import { Bell, Database, Key, Palette, Shield, User, Zap, FlaskConical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
  const [autoSave, setAutoSave] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [backendConnected, setBackendConnected] = useState(false)
  const [checkingConnection, setCheckingConnection] = useState(true)
  const [demoMode, setDemoMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("demo_mode") === "true"
    }
    return false
  })
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark"
    }
    return "dark"
  })

  // Check backend connection on mount
  useEffect(() => {
    const checkBackendConnection = async () => {
      setCheckingConnection(true)
      try {
        const response = await fetch(`${apiUrl}/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000) // 5 second timeout
        })
        
        if (response.ok) {
          setBackendConnected(true)
          console.log('[Settings] Backend connected successfully')
          // Don't automatically disable demo mode - let user control it
        } else {
          setBackendConnected(false)
          console.log('[Settings] Backend not connected - non-OK response')
          // Auto-enable demo mode if backend is not connected
          if (!demoMode) {
            handleDemoModeToggle(true)
          }
        }
      } catch (error) {
        console.log('[Settings] Backend not connected - error:', error)
        setBackendConnected(false)
        // Auto-enable demo mode if backend is not connected
        if (!demoMode) {
          handleDemoModeToggle(true)
        }
      } finally {
        setCheckingConnection(false)
      }
    }

    checkBackendConnection()
  }, [apiUrl])

  useEffect(() => {
    const root = document.documentElement

    if (theme === "light") {
      root.classList.remove("dark")
    } else if (theme === "dark") {
      root.classList.add("dark")
    } else if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.toggle("dark", systemTheme === "dark")
    }

    localStorage.setItem("theme", theme)
  }, [theme])

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    toast({
      title: "Theme updated",
      description: `Switched to ${newTheme} mode`,
    })
  }

  const handleDemoModeToggle = (enabled: boolean) => {
    setDemoMode(enabled)
    localStorage.setItem("demo_mode", enabled.toString())
    toast({
      title: enabled ? "Demo Mode Enabled" : "Demo Mode Disabled",
      description: enabled ? "All features now work offline with mock data" : "Connected back to live backend",
    })
  }

  const handleTestConnection = async () => {
    setCheckingConnection(true)
    try {
      const response = await fetch(`${apiUrl}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000)
      })
      
      if (response.ok) {
        setBackendConnected(true)
        toast({
          title: "Connection Successful",
          description: "Backend server is reachable",
        })
      } else {
        throw new Error('Backend not reachable')
      }
    } catch (error) {
      setBackendConnected(false)
      toast({
        title: "Connection Failed",
        description: "Could not reach backend server. Demo mode enabled.",
        variant: "destructive"
      })
      if (!demoMode) {
        handleDemoModeToggle(true)
      }
    } finally {
      setCheckingConnection(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-8 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="mt-1 text-muted-foreground">Manage your account and application preferences</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <CardTitle>Profile Information</CardTitle>
                  </div>
                  <CardDescription>Update your account details and profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Acme Inc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Tell us about yourself..." rows={4} />
                  </div>
                  <Button onClick={handleSave} className="gradient-primary">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-accent" />
                    <CardTitle>Notifications</CardTitle>
                  </div>
                  <CardDescription>Configure how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch id="email-notifications" checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="export-complete">Export Complete</Label>
                      <p className="text-sm text-muted-foreground">Notify when exports finish</p>
                    </div>
                    <Switch id="export-complete" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compliance-alerts">Compliance Alerts</Label>
                      <p className="text-sm text-muted-foreground">Alert on compliance violations</p>
                    </div>
                    <Switch id="compliance-alerts" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="team-activity">Team Activity</Label>
                      <p className="text-sm text-muted-foreground">Updates on team collaboration</p>
                    </div>
                    <Switch id="team-activity" />
                  </div>
                </CardContent>
              </Card>

              {/* Demo Mode Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-chart-3" />
                    <CardTitle>Demo Mode</CardTitle>
                  </div>
                  <CardDescription>Run the application offline with mock data for demonstrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="demo-mode">Enable Demo Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Works without backend server - perfect for demos and presentations
                      </p>
                    </div>
                    <Switch id="demo-mode" checked={demoMode} onCheckedChange={handleDemoModeToggle} />
                  </div>
                  {demoMode && (
                    <div className="rounded-lg border border-chart-3/50 bg-chart-3/10 p-4">
                      <p className="text-sm font-medium text-chart-3">
                        {backendConnected ? "Demo Mode Active (Manual)" : "Demo Mode Active (Auto-enabled)"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {backendConnected 
                          ? "Demo mode is manually enabled. Backend is available but not being used."
                          : "Backend server not detected. All API calls are mocked with sample data."
                        }
                      </p>
                    </div>
                  )}
                  {!backendConnected && !checkingConnection && !demoMode && (
                    <div className="rounded-lg border border-warning/50 bg-warning/10 p-4">
                      <p className="text-sm font-medium text-warning">Backend Server Disconnected</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Demo mode will be automatically enabled. Connect your backend server to use live data.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-chart-2" />
                    <CardTitle>API Configuration</CardTitle>
                  </div>
                  <CardDescription>Configure your FastAPI backend connection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-url">API Base URL</Label>
                    <Input
                      id="api-url"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="http://localhost:8000"
                    />
                    <p className="text-sm text-muted-foreground">
                      Current: {process.env.NEXT_PUBLIC_API_URL || "Not configured"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backend-status">Backend Connection Status</Label>
                    <div className="flex items-center gap-2">
                      {checkingConnection ? (
                        <>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
                          <span className="text-sm text-muted-foreground">Checking connection...</span>
                        </>
                      ) : backendConnected ? (
                        <>
                          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                          <span className="text-sm text-success">Connected to backend server</span>
                        </>
                      ) : (
                        <>
                          <div className="h-2 w-2 rounded-full bg-destructive" />
                          <span className="text-sm text-destructive">Backend server not reachable</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button onClick={handleTestConnection} variant="outline" disabled={checkingConnection}>
                    {checkingConnection ? "Testing..." : "Test Connection"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-warning" />
                    <CardTitle>API Keys</CardTitle>
                  </div>
                  <CardDescription>Manage your API keys for external integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Production API Key</Label>
                    <div className="flex gap-2">
                      <Input type="password" value="sk_live_••••••••••••••••" readOnly />
                      <Button variant="outline">Copy</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Development API Key</Label>
                    <div className="flex gap-2">
                      <Input type="password" value="sk_test_••••••••••••••••" readOnly />
                      <Button variant="outline">Copy</Button>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm">
                    Regenerate Keys
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-chart-4" />
                    <CardTitle>Appearance</CardTitle>
                  </div>
                  <CardDescription>Customize the look and feel of your workspace</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={theme} onValueChange={handleThemeChange}>
                      <SelectTrigger id="theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Current theme: {theme}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="canvas-color">Default Canvas Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" id="canvas-color" defaultValue="#FFFFFF" className="w-20 h-10 p-1" />
                      <Input type="text" defaultValue="#FFFFFF" className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-size">Default Canvas Size</Label>
                    <Select defaultValue="1080x1080">
                      <SelectTrigger id="default-size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1080x1080">1080x1080 (Square)</SelectItem>
                        <SelectItem value="1080x1350">1080x1350 (Portrait)</SelectItem>
                        <SelectItem value="1920x1080">1920x1080 (Landscape)</SelectItem>
                        <SelectItem value="2000x2000">2000x2000 (Amazon)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-chart-5" />
                    <CardTitle>Editor Settings</CardTitle>
                  </div>
                  <CardDescription>Configure editor behavior and defaults</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-save">Auto-save</Label>
                      <p className="text-sm text-muted-foreground">Automatically save changes</p>
                    </div>
                    <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-grid">Show Grid by Default</Label>
                      <p className="text-sm text-muted-foreground">Display grid on canvas</p>
                    </div>
                    <Switch id="show-grid" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="snap-to-grid">Snap to Grid</Label>
                      <p className="text-sm text-muted-foreground">Align layers to grid</p>
                    </div>
                    <Switch id="snap-to-grid" defaultChecked />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="undo-limit">Undo History Limit</Label>
                    <Select defaultValue="50">
                      <SelectTrigger id="undo-limit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25 steps</SelectItem>
                        <SelectItem value="50">50 steps</SelectItem>
                        <SelectItem value="100">100 steps</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-destructive" />
                    <CardTitle>Advanced Settings</CardTitle>
                  </div>
                  <CardDescription>Danger zone - proceed with caution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Export Quality</Label>
                    <Select defaultValue="high">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Faster)</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High (Recommended)</SelectItem>
                        <SelectItem value="ultra">Ultra (Slower)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Cache Management</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Clear Image Cache
                      </Button>
                      <Button variant="outline" size="sm">
                        Clear All Cache
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Current cache size: 124 MB</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Data Export</Label>
                    <Button variant="outline">Export All Projects</Button>
                    <p className="text-sm text-muted-foreground">Download all your projects as JSON</p>
                  </div>
                  <Separator />
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 space-y-2">
                    <Label className="text-destructive">Danger Zone</Label>
                    <p className="text-sm text-muted-foreground">These actions cannot be undone</p>
                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm">
                        Delete All Projects
                      </Button>
                      <Button variant="destructive" size="sm">
                        Delete All Assets
                      </Button>
                    </div>
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
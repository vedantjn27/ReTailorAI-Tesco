"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, AlertTriangle, XCircle, Wand2, Sparkles, RefreshCw, ShieldCheck, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Violation {
  code: string
  severity: "low" | "medium" | "high"
  message: string
  layer_id?: string
}

interface SavedProject {
  id: string
  name: string
  width: number
  height: number
  background_color: string
  layers_count: number
  created_at: string
  updated_at: string
}

interface AIAdvice {
  overall_score: number
  summary: string
  issues: Array<{ severity: string; issue: string; fix: string }>
  strengths: string[]
  recommended_next_steps: string[]
}

const RETAILERS = [
  { value: "RetailerA", label: "Retailer A — Strict (WCAG AA)" },
  { value: "RetailerB", label: "Retailer B — Standard" },
  { value: "Tesco", label: "Tesco — Retail Guidelines" },
]

const SEV_CONFIG = {
  high: { icon: XCircle, color: "text-destructive", badgeClass: "bg-destructive text-white", bg: "border-destructive/30 bg-destructive/5" },
  medium: { icon: AlertTriangle, color: "text-yellow-500", badgeClass: "bg-yellow-500 text-white", bg: "border-yellow-500/30 bg-yellow-500/5" },
  low: { icon: AlertTriangle, color: "text-blue-500", badgeClass: "bg-blue-500 text-white", bg: "border-blue-500/30 bg-blue-500/5" },
}

export default function CompliancePage() {
  const [projectId, setProjectId] = useState("")
  const [retailer, setRetailer] = useState("RetailerA")
  const [violations, setViolations] = useState<Violation[]>([])
  const [checking, setChecking] = useState(false)
  const [fixing, setFixing] = useState(false)
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE}/editor/projects`)
        if (res.ok) {
          const data = await res.json()
          setSavedProjects(data.projects || [])
        }
      } catch (err) {
        console.error("Failed to load projects:", err)
      }
    }
    fetchProjects()
  }, [])

  const handleCheck = async () => {
    if (!projectId) {
      return toast({ title: "Select a project", description: "Choose from the dropdown or paste a project ID", variant: "destructive" })
    }
    setChecking(true)
    setHasChecked(false)
    setAiAdvice(null)
    try {
      const res = await fetch(`${API_BASE}/compliance/check/${projectId}?retailer=${retailer}`)
      if (!res.ok) throw new Error((await res.json()).detail || "Check failed")
      const data = await res.json()
      setViolations(data.violations || [])
      setHasChecked(true)
      if ((data.violations || []).length === 0) {
        toast({ title: "✅ All checks passed!", description: "Your creative is fully compliant" })
      } else {
        toast({ title: `${data.violations.length} issue(s) found`, variant: "destructive" })
      }
    } catch (e: any) {
      toast({ title: "Check failed", description: e.message, variant: "destructive" })
    } finally {
      setChecking(false)
    }
  }

  const handleAutoFix = async () => {
    setFixing(true)
    try {
      const res = await fetch(`${API_BASE}/compliance/autofix/${projectId}?retailer=${retailer}&apply_changes=true`, { method: "POST" })
      if (!res.ok) throw new Error((await res.json()).detail)
      const data = await res.json()
      if (data.applied) {
        toast({ title: "Fixes Applied", description: `${data.changes.length} auto-fix(es) applied` })
        await handleCheck()
      } else {
        toast({ title: "No auto-fixes available", description: "Manual adjustments required" })
      }
    } catch (e: any) {
      toast({ title: "Auto-fix failed", description: e.message, variant: "destructive" })
    } finally {
      setFixing(false)
    }
  }

  const handleAIAdvice = async () => {
    setLoadingAI(true)
    try {
      const res = await fetch(`${API_BASE}/ai/compliance-advice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId, retailer }),
      })
      if (!res.ok) throw new Error((await res.json()).detail)
      const data = await res.json()
      setAiAdvice(data.advice)
    } catch (e: any) {
      toast({ title: "AI advice failed", description: e.message, variant: "destructive" })
    } finally {
      setLoadingAI(false)
    }
  }

  const highCount = violations.filter(v => v.severity === "high").length
  const medCount = violations.filter(v => v.severity === "medium").length
  const lowCount = violations.filter(v => v.severity === "low").length

  const totalChecks = 6
  const failedWeight = highCount * 3 + medCount * 2 + lowCount * 1
  const score = Math.max(0, Math.min(100, Math.round(100 - (failedWeight / (totalChecks * 3)) * 100)))

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-8 py-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" /> Compliance Checker
        </h1>
        <p className="mt-1 text-muted-foreground">Validate creatives against retailer and brand guidelines</p>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-5xl space-y-6">

          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>Check Creative Compliance</CardTitle>
              <CardDescription>Select a project and retailer, then run the check</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Project</label>
                  {savedProjects.length > 0 ? (
                    <Select value={projectId} onValueChange={setProjectId}>
                      <SelectTrigger><SelectValue placeholder="Select a project..." /></SelectTrigger>
                      <SelectContent>
                        {savedProjects.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            <span className="font-medium">{p.name || "Untitled Project"}</span>
                            <span className="text-xs text-muted-foreground ml-2">({p.layers_count || 0} layers)</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No projects found — create one in the Canvas Editor</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Retailer Guidelines</label>
                  <Select value={retailer} onValueChange={setRetailer}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {RETAILERS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Button onClick={handleCheck} disabled={checking || !projectId} className="gradient-primary gap-2">
                  <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
                  {checking ? "Checking…" : "Run Compliance Check"}
                </Button>
                {hasChecked && violations.length > 0 && (
                  <>
                    <Button onClick={handleAutoFix} disabled={fixing} variant="outline" className="gap-2">
                      <Wand2 className="h-4 w-4" />
                      {fixing ? "Applying fixes…" : "Auto-Fix Issues"}
                    </Button>
                    <Button onClick={handleAIAdvice} disabled={loadingAI} variant="outline" className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      {loadingAI ? "Getting AI advice…" : "Get AI Advice"}
                    </Button>
                  </>
                )}
              </div>

              {/* Score */}
              {hasChecked && (
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Compliance Score</span>
                    <span className={`text-2xl font-bold ${score >= 80 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-destructive"}`}>
                      {score}/100
                    </span>
                  </div>
                  <Progress value={score} className="h-2" />
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    {highCount > 0 && <span className="text-destructive font-medium">{highCount} Critical</span>}
                    {medCount > 0 && <span className="text-yellow-500 font-medium">{medCount} Medium</span>}
                    {lowCount > 0 && <span className="text-blue-500 font-medium">{lowCount} Low</span>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Passed */}
          {hasChecked && violations.length === 0 && (
            <Alert className="border-green-500/30 bg-green-500/5">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertTitle className="text-green-600">All checks passed!</AlertTitle>
              <AlertDescription>Your creative meets all compliance requirements for <strong>{retailer}</strong>. It's ready to publish!</AlertDescription>
            </Alert>
          )}

          {/* Violations */}
          {violations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Issues Found
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {violations.map((v, i) => {
                  const cfg = SEV_CONFIG[v.severity] || SEV_CONFIG.medium
                  const Icon = cfg.icon
                  return (
                    <div key={i} className={`flex items-start gap-3 rounded-lg border p-3 ${cfg.bg}`}>
                      <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${cfg.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`text-xs ${cfg.badgeClass}`}>{v.severity.toUpperCase()}</Badge>
                          <code className="text-xs text-muted-foreground">{v.code}</code>
                        </div>
                        <p className="text-sm mt-1">{v.message}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {/* AI Advice */}
          {aiAdvice && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> AI Compliance Advice
                </CardTitle>
                <CardDescription>{aiAdvice.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">AI Score</span>
                  <span className={`text-3xl font-bold ${aiAdvice.overall_score >= 80 ? "text-green-500" : aiAdvice.overall_score >= 50 ? "text-yellow-500" : "text-destructive"}`}>
                    {aiAdvice.overall_score}/100
                  </span>
                </div>

                {aiAdvice.issues.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Issues to Fix:</h4>
                    <div className="space-y-2">
                      {aiAdvice.issues.map((issue, i) => (
                        <div key={i} className="rounded-lg border p-3 text-sm space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs capitalize">{issue.severity}</Badge>
                            <span className="font-medium">{issue.issue}</span>
                          </div>
                          <p className="text-muted-foreground text-xs">→ {issue.fix}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {aiAdvice.strengths.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Strengths:</h4>
                    <ul className="space-y-1">
                      {aiAdvice.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-green-600">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiAdvice.recommended_next_steps.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Recommended Next Steps:</h4>
                    <ol className="space-y-1 list-decimal list-inside">
                      {aiAdvice.recommended_next_steps.map((step, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

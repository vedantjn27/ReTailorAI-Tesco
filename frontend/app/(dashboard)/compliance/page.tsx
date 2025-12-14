"use client"

import { useState } from "react"
import { CheckCircle2, AlertTriangle, XCircle, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { apiClient, type ComplianceViolation } from "@/lib/api-client"

export default function CompliancePage() {
  const [projectId, setProjectId] = useState("")
  const [retailer, setRetailer] = useState("RetailerA")
  const [violations, setViolations] = useState<ComplianceViolation[]>([])
  const [checking, setChecking] = useState(false)
  const [fixing, setFixing] = useState(false)
  const [beforeImage, setBeforeImage] = useState<string | null>(null)
  const [afterImage, setAfterImage] = useState<string | null>(null)
  const { toast } = useToast()

  const handleCheck = async () => {
    if (!projectId) {
      toast({
        title: "Project ID required",
        description: "Please enter a project ID to check",
        variant: "destructive",
      })
      return
    }

    setChecking(true)
    try {
      const beforeResult = await apiClient.renderProject(projectId)
      setBeforeImage(apiClient.getAssetUrl(beforeResult.rendered_file_id))

      const result = await apiClient.checkCompliance(projectId, retailer)
      setViolations(result.violations)

      if (result.violations.length === 0) {
        toast({
          title: "All checks passed",
          description: "Your creative is compliant with all guidelines",
        })
      } else {
        toast({
          title: "Issues found",
          description: `${result.violations.length} compliance issue(s) detected`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Check failed",
        description: "Could not check compliance",
        variant: "destructive",
      })
    } finally {
      setChecking(false)
    }
  }

  const handleAutoFix = async () => {
    if (!projectId) return

    setFixing(true)
    try {
      const result = await apiClient.autoFixCompliance(projectId, retailer, true)

      if (result.applied) {
        const afterResult = await apiClient.renderProject(projectId)
        setAfterImage(apiClient.getAssetUrl(afterResult.rendered_file_id))

        toast({
          title: "Fixes applied",
          description: `Applied ${result.changes.length} fix(es) automatically`,
        })

        // Re-check compliance
        const recheckResult = await apiClient.checkCompliance(projectId, retailer)
        setViolations(recheckResult.violations)
      } else {
        toast({
          title: "No fixes available",
          description: "Manual adjustments may be required",
        })
      }
    } catch (error) {
      toast({
        title: "Auto-fix failed",
        description: "Could not apply fixes",
        variant: "destructive",
      })
    } finally {
      setFixing(false)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <XCircle className="h-5 w-5 text-destructive" />
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "low":
        return <AlertTriangle className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Medium</Badge>
      case "low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compliance Checker</h1>
            <p className="mt-1 text-muted-foreground">Validate designs against retailer guidelines</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>Check Compliance</CardTitle>
              <CardDescription>Enter a project ID to validate against retailer guidelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="project-id" className="text-sm font-medium">
                    Project ID
                  </label>
                  <input
                    id="project-id"
                    type="text"
                    placeholder="Enter project ID..."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="retailer" className="text-sm font-medium">
                    Retailer Guidelines
                  </label>
                  <Select value={retailer} onValueChange={setRetailer}>
                    <SelectTrigger id="retailer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RetailerA">Retailer A (Strict)</SelectItem>
                      <SelectItem value="RetailerB">Retailer B (Standard)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCheck} disabled={checking || !projectId}>
                  {checking ? "Checking..." : "Run Compliance Check"}
                </Button>
                {violations.length > 0 && (
                  <Button variant="outline" onClick={handleAutoFix} disabled={fixing} className="gap-2 bg-transparent">
                    <Wand2 className="h-4 w-4" />
                    {fixing ? "Applying..." : "Auto-Fix Issues"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Guidelines Info */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Guidelines</CardTitle>
              <CardDescription>What we check for {retailer}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Resolution & Quality</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>Minimum resolution requirements</li>
                    <li>Image quality and compression</li>
                    <li>File format standards</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Typography</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>Minimum font sizes</li>
                    <li>Text contrast ratios (WCAG AA)</li>
                    <li>Text coverage limits</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Layout Rules</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>Logo safe margins</li>
                    <li>Element spacing requirements</li>
                    <li>Overlap detection</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Accessibility</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>Color contrast validation</li>
                    <li>Readability standards</li>
                    <li>Visual hierarchy checks</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Before & After Comparison */}
          {beforeImage && afterImage && (
            <Card>
              <CardHeader>
                <CardTitle>Before & After Comparison</CardTitle>
                <CardDescription>See the improvements applied by auto-fix</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Before Fix</h4>
                      <Badge variant="destructive">Issues Found</Badge>
                    </div>
                    <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                      <img
                        src={beforeImage || "/placeholder.svg"}
                        alt="Before"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">After Fix</h4>
                      <Badge className="bg-green-500">Compliant</Badge>
                    </div>
                    <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                      <img
                        src={afterImage || "/placeholder.svg"}
                        alt="After"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {violations.length === 0 && projectId && !checking ? (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>All checks passed</AlertTitle>
              <AlertDescription>Your creative meets all compliance requirements for {retailer}</AlertDescription>
            </Alert>
          ) : (
            violations.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Issues Found</CardTitle>
                      <CardDescription>{violations.length} compliance issue(s) detected</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {violations.map((violation, index) => (
                      <Alert key={index} variant={violation.severity === "high" ? "destructive" : "default"}>
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(violation.severity)}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <AlertTitle className="mb-0">{violation.code.replace(/_/g, " ")}</AlertTitle>
                              {getSeverityBadge(violation.severity)}
                            </div>
                            <AlertDescription>{violation.message}</AlertDescription>
                            {violation.layer_id && (
                              <p className="text-xs text-muted-foreground">Layer ID: {violation.layer_id}</p>
                            )}
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  )
}

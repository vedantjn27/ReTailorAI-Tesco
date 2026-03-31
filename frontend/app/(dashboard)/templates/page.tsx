"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, LayoutTemplate, Plus, RefreshCw, ChevronRight, X, Info, Layers, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface TemplateLayer {
  type: string
  text?: string
  font_size?: number
  color?: string
  x: number
  y: number
  width?: number
  height?: number
  opacity?: number
}

interface Template {
  template_id: string
  template_name: string
  category: string
  tags: string[]
  width: number
  height: number
  background_color: string
  layers_count: number
  layers: TemplateLayer[]
  description?: string
}

interface BackendProject {
  id: string
  name: string
  width: number
  height: number
  layers_count: number
  created_at: string
}

const CATEGORIES = ["All Templates", "Social Media", "Stories", "Display Ads", "E-Commerce", "In-Store", "Email", "Video"]
const categoryMap: Record<string, string> = {
  "All Templates": "",
  "Social Media": "social",
  "Stories": "story",
  "Display Ads": "display",
  "E-Commerce": "ecommerce",
  "In-Store": "instore",
  "Email": "email",
  "Video": "video",
}

// Generate a visual SVG preview for a template
function TemplateSVGPreview({ template }: { template: Template }) {
  const scale = 500 / Math.max(template.width, template.height)
  const svgW = Math.round(template.width * scale)
  const svgH = Math.round(template.height * scale)

  return (
    <svg
      viewBox={`0 0 ${template.width} ${template.height}`}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0"
    >
      {/* Background */}
      <rect width={template.width} height={template.height} fill={template.background_color} />

      {template.layers.map((layer, i) => {
        if (layer.type === "image") {
          return (
            <g key={i} opacity={layer.opacity ?? 1}>
              <rect
                x={layer.x} y={layer.y}
                width={layer.width ?? 200} height={layer.height ?? 200}
                rx={8}
                fill="rgba(255,255,255,0.12)"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={4}
                strokeDasharray="14,8"
              />
              <text
                x={(layer.x + (layer.width ?? 200) / 2)}
                y={(layer.y + (layer.height ?? 200) / 2)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={Math.max(18, (layer.width ?? 200) / 8)}
                fill="rgba(255,255,255,0.4)"
                fontFamily="sans-serif"
              >
                📷
              </text>
            </g>
          )
        }
        if (layer.type === "text") {
          const fs = Math.max(10, Math.min(layer.font_size ?? 32, 120))
          return (
            <text
              key={i}
              x={layer.x}
              y={layer.y + fs}
              fontSize={fs}
              fill={layer.color ?? "#FFFFFF"}
              fontFamily="Arial, sans-serif"
              fontWeight={fs > 60 ? "900" : fs > 40 ? "700" : "500"}
            >
              {(layer.text ?? "").slice(0, 28)}
            </text>
          )
        }
        return null
      })}

      {/* Dimension watermark */}
      <text
        x={template.width - 16}
        y={template.height - 16}
        textAnchor="end"
        fontSize={22}
        fill="rgba(255,255,255,0.45)"
        fontFamily="monospace"
      >
        {template.width}×{template.height}
      </text>
    </svg>
  )
}

export default function TemplatesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Templates")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [applyMode, setApplyMode] = useState<"new" | "existing">("new")
  const [existingProjects, setExistingProjects] = useState<BackendProject[]>([])
  const [targetProjectId, setTargetProjectId] = useState("")
  const [newProjectName, setNewProjectName] = useState("")
  const [applying, setApplying] = useState(false)
  const [activeTab, setActiveTab] = useState("browse")

  // Add Your Own Template form
  const [customName, setCustomName] = useState("")
  const [customCategory, setCustomCategory] = useState("social")
  const [customWidth, setCustomWidth] = useState("1080")
  const [customHeight, setCustomHeight] = useState("1080")
  const [customBg, setCustomBg] = useState("#1a1a2e")
  const [customDesc, setCustomDesc] = useState("")
  const [customTags, setCustomTags] = useState("")
  const [savingCustom, setSavingCustom] = useState(false)

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/templates`)
      if (res.ok) {
        const data = await res.json()
        setTemplates(data.templates || [])
      }
    } catch (err) {
      console.error("Failed to load templates", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/editor/projects`)
      if (res.ok) {
        const data = await res.json()
        setExistingProjects(data.projects || [])
      }
    } catch (_) {}
  }

  useEffect(() => {
    fetchTemplates()
    fetchProjects()
  }, [])

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = !search ||
      t.template_name.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory =
      selectedCategory === "All Templates" ||
      t.category === categoryMap[selectedCategory]
    return matchesSearch && matchesCategory
  })

  const openApplyDialog = (template: Template) => {
    setSelectedTemplate(template)
    setNewProjectName(`${template.template_name} — Copy`)
    setApplyMode("new")
    setTargetProjectId("")
    setApplyDialogOpen(true)
  }

  const handleApplyTemplate = async () => {
    if (!selectedTemplate) return
    setApplying(true)
    try {
      let projectId = targetProjectId

      if (applyMode === "new") {
        const createRes = await fetch(
          `${API_BASE}/editor/create-project?name=${encodeURIComponent(newProjectName || selectedTemplate.template_name)}&width=${selectedTemplate.width}&height=${selectedTemplate.height}&background_color=${encodeURIComponent(selectedTemplate.background_color)}`,
          { method: "POST" }
        )
        if (!createRes.ok) throw new Error("Failed to create project")
        const createData = await createRes.json()
        projectId = createData.project_id
      }

      if (!projectId) throw new Error("No project selected")

      // FIX: use .template_id securely linked to what the backend returns
      const applyRes = await fetch(
        `${API_BASE}/editor/${projectId}/apply-template/${selectedTemplate.template_id}`,
        { method: "POST" }
      )
      if (!applyRes.ok) throw new Error("Failed to apply template")

      toast({
        title: "✅ Template Applied!",
        description: applyMode === "new"
          ? `Created new project with template "${selectedTemplate.template_name}"`
          : `Applied "${selectedTemplate.template_name}" to your project`,
      })
      setApplyDialogOpen(false)
      router.push(`/editor?project=${projectId}`)
    } catch (e: any) {
      toast({ title: "Failed to apply template", description: e.message, variant: "destructive" })
    } finally {
      setApplying(false)
    }
  }

  const handleSaveCustomTemplate = async () => {
    if (!customName.trim()) {
      toast({ title: "Template name required", variant: "destructive" })
      return
    }
    setSavingCustom(true)
    try {
      const res = await fetch(`${API_BASE}/templates/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_name: customName,
          category: customCategory,
          tags: customTags.split(",").map(t => t.trim()).filter(Boolean),
          width: parseInt(customWidth) || 1080,
          height: parseInt(customHeight) || 1080,
          background_color: customBg,
          description: customDesc,
          layers: [],
        }),
      })
      if (!res.ok) throw new Error("Failed to save template")
      toast({ title: "✅ Template saved!", description: `"${customName}" added to your library.` })
      setCustomName(""); setCustomDesc(""); setCustomTags("")
      fetchTemplates()
      setActiveTab("browse")
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" })
    } finally {
      setSavingCustom(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <LayoutTemplate className="h-8 w-8 text-primary" /> Template Library
            </h1>
            <p className="mt-1 text-muted-foreground">
              {templates.length} professional designs across {new Set(templates.map(t => t.category)).size} categories — click to apply instantly
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetch(`${API_BASE}/templates/reseed`, { method: "POST" }).then(fetchTemplates)}>
            <RefreshCw className="h-4 w-4 mr-2" /> Reseed
          </Button>
        </div>
        <div className="mt-4 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates or tags..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="browse"><LayoutTemplate className="h-4 w-4 mr-2" />Browse Templates</TabsTrigger>
            <TabsTrigger value="add"><Plus className="h-4 w-4 mr-2" />Add Your Own</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="flex gap-6">
              {/* Sidebar */}
              <div className="w-48 shrink-0 space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div className="flex-1">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="aspect-square bg-muted rounded-t-xl" />
                        <CardContent className="p-3">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredTemplates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                    <LayoutTemplate className="h-16 w-16 mb-4 opacity-30" />
                    <p className="text-lg font-medium">No templates found</p>
                    <p className="text-sm mt-1">Try a different search or category</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredTemplates.map((template) => (
                      <Card
                        key={template.template_id}
                        className="overflow-hidden group cursor-pointer hover:border-primary/60 hover:shadow-xl transition-all"
                        onClick={() => openApplyDialog(template)}
                      >
                        {/* SVG Preview */}
                        <div className="relative w-full" style={{ paddingBottom: `${(template.height / template.width) * 100}%`, maxHeight: "220px", overflow: "hidden" }}>
                          <div className="absolute inset-0">
                            <TemplateSVGPreview template={template} />
                          </div>
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button size="sm" className="gap-1">
                              Use Template <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                          {/* Category badge */}
                          <div className="absolute top-2 left-2">
                            <Badge className="text-xs capitalize bg-black/60 text-white border-0 backdrop-blur-sm">
                              {template.category}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm truncate">{template.template_name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{template.width}×{template.height}px</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {template.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">{tag}</Badge>
                            ))}
                            <span className="text-xs text-muted-foreground ml-auto">{template.layers_count || template.layers.length} layers</span>
                          </div>
                          <Button
                            size="sm"
                            className="w-full mt-3 gradient-primary"
                            onClick={(e) => { e.stopPropagation(); openApplyDialog(template) }}
                          >
                            Use Template →
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="add">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Add Your Own Template</CardTitle>
                <p className="text-sm text-muted-foreground">Save a template to your library to reuse it across projects.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <Label>Template Name *</Label>
                    <Input placeholder="e.g. My Brand Story" value={customName} onChange={e => setCustomName(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select value={customCategory} onValueChange={setCustomCategory}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="story">Stories</SelectItem>
                        <SelectItem value="display">Display Ads</SelectItem>
                        <SelectItem value="ecommerce">E-Commerce</SelectItem>
                        <SelectItem value="instore">In-Store</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <input type="color" value={customBg} onChange={e => setCustomBg(e.target.value)} className="h-10 w-12 rounded border border-border cursor-pointer" />
                      <Input value={customBg} onChange={e => setCustomBg(e.target.value)} className="font-mono" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Width (px)</Label>
                    <Input type="number" value={customWidth} onChange={e => setCustomWidth(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Height (px)</Label>
                    <Input type="number" value={customHeight} onChange={e => setCustomHeight(e.target.value)} />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>Tags (comma-separated)</Label>
                    <Input placeholder="e.g. summer, sale, brand" value={customTags} onChange={e => setCustomTags(e.target.value)} />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label>Description (optional)</Label>
                    <Textarea placeholder="Describe this template..." value={customDesc} onChange={e => setCustomDesc(e.target.value)} rows={3} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleSaveCustomTemplate} disabled={savingCustom} className="gradient-primary">
                    {savingCustom ? "Saving..." : "Save Template"}
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("browse")}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Apply Template Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.template_name}</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description || "Select an action below to proceed with this layout."}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="apply">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="apply">Apply</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="apply">
              <div className="grid grid-cols-2 gap-3 my-2">
                <button
                  onClick={() => setApplyMode("new")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    applyMode === "new" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Plus className="h-8 w-8 text-primary" />
                  <span className="font-medium text-sm">New Project</span>
                  <span className="text-xs text-muted-foreground text-center">Start a fresh canvas heavily inspired by this template</span>
                </button>
                <button
                  onClick={() => setApplyMode("existing")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    applyMode === "existing" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <LayoutTemplate className="h-8 w-8 text-primary" />
                  <span className="font-medium text-sm">Existing Project</span>
                  <span className="text-xs text-muted-foreground text-center">Merge layers seamlessly into a project you already started</span>
                </button>
              </div>

              {applyMode === "new" ? (
                <div className="space-y-1.5 mt-4">
                  <Label>Project Name</Label>
                  <Input value={newProjectName} onChange={e => setNewProjectName(e.target.value)} placeholder="My New Project" />
                </div>
              ) : (
                <div className="space-y-1.5 mt-4">
                  <Label>Select Project to Merge Into</Label>
                  <Select value={targetProjectId} onValueChange={setTargetProjectId}>
                    <SelectTrigger><SelectValue placeholder="Choose a project..." /></SelectTrigger>
                    <SelectContent>
                      {existingProjects.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name || "Untitled Project"} ({p.layers_count} layers)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm font-medium text-muted-foreground gap-1"><Info className="h-3.5 w-3.5"/> Dimension Format</div>
                  <p className="font-mono text-sm">{selectedTemplate?.width} × {selectedTemplate?.height} px</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-sm font-medium text-muted-foreground gap-1"><Layers className="h-3.5 w-3.5"/> Default Background</div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: selectedTemplate?.background_color }} />
                    <span className="font-mono text-sm">{selectedTemplate?.background_color || "#FFFFFF"}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm font-medium text-muted-foreground gap-1"><Tag className="h-3.5 w-3.5"/> Associated Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTemplate?.tags.map(t => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  ))}
                  <Badge variant="outline">{selectedTemplate?.category}</Badge>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center text-sm font-medium text-muted-foreground gap-1"><Layers className="h-3.5 w-3.5"/> Layer Hierarchy</div>
                <div className="text-sm space-y-1 max-h-[140px] overflow-y-auto pr-2">
                  {selectedTemplate?.layers.map((l, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                      <span className="capitalize text-muted-foreground flex items-center gap-2">
                        {l.type === "text" ? "T" : "🖼"} {l.type}
                      </span>
                      <span className="truncate text-xs text-right max-w-[150px]">
                        {l.type === "text" ? l.text : `${l.width}x${l.height}px`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleApplyTemplate}
              disabled={applying || (applyMode === "existing" && !targetProjectId)}
              className="gradient-primary"
            >
              {applying ? "Applying..." : "Apply Template →"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
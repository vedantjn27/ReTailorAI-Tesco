"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, LayoutTemplate, Plus, Eye, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiClient, type Template } from "@/lib/api-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TemplateDetails {
  template_id: string
  template_name: string
  width: number
  height: number
  layers: Array<{
    layer_id: string
    layer_name: string
    type: string
    content: string
    x: number
    y: number
    width: number
    height: number
    visible: boolean
    locked: boolean
  }>
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isListDialogOpen, setIsListDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDetails | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    template_name: "",
    width: "",
    height: "",
    layers_count: ""
  })

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const response = await fetch(`${baseURL}/templates`)
      
      if (!response.ok) {
        throw new Error("Failed to load templates")
      }
      
      const result = await response.json()
      console.log("Loaded templates:", result.templates)
      setTemplates(result.templates || [])
    } catch (error) {
      console.error("Error loading templates:", error)
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (templateId: string) => {
    setLoadingDetails(true)
    setIsDetailsDialogOpen(true)
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const response = await fetch(`${baseURL}/templates/${templateId}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch template details")
      }

      const data = await response.json()
      setSelectedTemplate(data.template)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load template details",
        variant: "destructive",
      })
      setIsDetailsDialogOpen(false)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleUseTemplate = async (templateId: string) => {
    setLoading(true)
    try {
      // Create new project
      const projectResult = await apiClient.createProject()

      // Apply template
      await apiClient.applyTemplate(projectResult.project_id, templateId)

      toast({
        title: "Template applied",
        description: "Opening editor...",
      })

      // Navigate to editor
      router.push(`/editor?project=${projectResult.project_id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply template",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleAddTemplate = async () => {
    setIsSubmitting(true)
    try {
      // Use the same base URL pattern as your apiClient
      const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      
      // Create empty layers array based on layers_count
      const layersCount = parseInt(formData.layers_count)
      const layers = Array.from({ length: layersCount }, (_, i) => ({
        layer_id: `layer_${Date.now()}_${i}`,
        layer_name: `Layer ${i + 1}`,
        type: "text",
        content: "",
        x: 0,
        y: 0,
        width: 200,
        height: 100,
        visible: true,
        locked: false
      }))

      const response = await fetch(`${baseURL}/templates/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template_name: formData.template_name,
          width: parseInt(formData.width),
          height: parseInt(formData.height),
          layers: layers
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add template")
      }

      toast({
        title: "Success",
        description: "Template added successfully",
      })

      // Reset form
      setFormData({
        template_name: "",
        width: "",
        height: "",
        layers_count: ""
      })
      setIsAddDialogOpen(false)

      // Reload templates
      loadTemplates()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add template",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredTemplates = templates.filter((template) =>
    template.template_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Template Library</h1>
            <p className="mt-1 text-muted-foreground">Pre-designed layouts optimized for retail media</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Layers className="mr-2 h-4 w-4" />
                  View All Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>All Available Templates</DialogTitle>
                  <DialogDescription>
                    Complete list of {templates.length} template(s) in your library
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-4">
                    {templates.map((template) => (
                      <Card key={template.template_id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{template.template_name}</CardTitle>
                              <CardDescription className="mt-1">
                                Dimensions: {template.width} x {template.height}px • {template.layers_count} layers
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setIsListDialogOpen(false)
                                  handleViewDetails(template.template_id)
                                }}
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                Details
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setIsListDialogOpen(false)
                                  handleUseTemplate(template.template_id)
                                }}
                              >
                                Use
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Template
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Template</DialogTitle>
                  <DialogDescription>
                    Create a new template for your retail media designs
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="template_name">Template Name</Label>
                    <Input
                      id="template_name"
                      placeholder="e.g., Product Banner"
                      value={formData.template_name}
                      onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="width">Width (px)</Label>
                      <Input
                        id="width"
                        type="number"
                        placeholder="1200"
                        value={formData.width}
                        onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="height">Height (px)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="628"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="layers_count">Number of Layers</Label>
                    <Input
                      id="layers_count"
                      type="number"
                      placeholder="3"
                      value={formData.layers_count}
                      onChange={(e) => setFormData({ ...formData, layers_count: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddTemplate}
                    disabled={
                      isSubmitting ||
                      !formData.template_name ||
                      !formData.width ||
                      !formData.height ||
                      !formData.layers_count
                    }
                  >
                    {isSubmitting ? "Adding..." : "Add Template"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Template Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Template Details</DialogTitle>
            <DialogDescription>
              View detailed information about this template
            </DialogDescription>
          </DialogHeader>
          {loadingDetails ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="mt-4 text-sm text-muted-foreground">Loading details...</p>
              </div>
            </div>
          ) : selectedTemplate ? (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Template Name</Label>
                    <p className="text-lg font-medium">{selectedTemplate.template_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Dimensions</Label>
                    <p className="text-lg font-medium">
                      {selectedTemplate.width} x {selectedTemplate.height}px
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground mb-2 block">
                    Layers ({selectedTemplate.layers.length})
                  </Label>
                  <div className="space-y-2">
                    {selectedTemplate.layers.map((layer, index) => (
                      <Card key={layer.layer_id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-sm font-medium">
                                {layer.layer_name}
                              </CardTitle>
                              <CardDescription className="mt-1 text-xs">
                                Type: {layer.type} • Position: ({layer.x}, {layer.y}) • Size: {layer.width}x{layer.height}
                              </CardDescription>
                            </div>
                            <div className="flex gap-1">
                              <Badge variant={layer.visible ? "default" : "secondary"} className="text-xs">
                                {layer.visible ? "Visible" : "Hidden"}
                              </Badge>
                              {layer.locked && (
                                <Badge variant="outline" className="text-xs">
                                  Locked
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
            {selectedTemplate && (
              <Button onClick={() => {
                setIsDetailsDialogOpen(false)
                handleUseTemplate(selectedTemplate.template_id)
              }}>
                Use This Template
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toolbar */}
      <div className="border-b border-border bg-card px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-4 text-sm text-muted-foreground">Loading templates...</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.template_id} className="overflow-hidden transition-all hover:border-primary">
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <LayoutTemplate className="h-16 w-16 text-primary/50" />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base text-balance">{template.template_name}</CardTitle>
                      <CardDescription className="mt-1">
                        {template.width} x {template.height}px
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{template.layers_count} layers</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={() => handleUseTemplate(template.template_id)} 
                    disabled={loading}
                  >
                    Use Template
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleViewDetails(template.template_id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}

            {filteredTemplates.length === 0 && (
              <div className="col-span-full flex h-64 items-center justify-center">
                <div className="text-center">
                  <LayoutTemplate className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <p className="mt-4 text-sm text-muted-foreground">No templates found</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
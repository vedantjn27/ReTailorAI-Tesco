"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import { SelectItem } from "@/components/ui/select"
import { SelectContent } from "@/components/ui/select"
import { SelectTrigger as Trigger } from "@/components/ui/select"
import { Select, SelectGroup } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useState, useRef, useEffect } from "react"
import {
  ImageIcon,
  Type,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Undo2,
  Redo2,
  Eye,
  Copy,
  Edit3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { apiClient, type EditorProject, type Layer } from "@/lib/api-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

export default function EditorPage() {
  const [project, setProject] = useState<EditorProject | null>(null)
  const [projectName, setProjectName] = useState<string>("")
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null)
  const [loading, setLoading] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 1080, height: 1080 })
  const [zoom, setZoom] = useState(0.7)
  const [showGrid, setShowGrid] = useState(false)
  const [editingText, setEditingText] = useState<string>("")
  const { toast } = useToast()
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setShowNameDialog(true)
  }, [])

  const initializeProject = async (name: string) => {
    setLoading(true)
    try {
      const result = await apiClient.createProject(canvasSize.width, canvasSize.height)
      const projectData = await apiClient.getProject(result.project_id)
      setProject(projectData)
      setProjectName(name)

      const savedProjects = JSON.parse(localStorage.getItem("retailor_projects") || "[]")
      savedProjects.push({
        id: result.project_id,
        name: name,
        status: "active",
        createdAt: new Date().toISOString(),
        thumbnail: null,
        assetsCount: 0,
        progress: 0,
      })
      localStorage.setItem("retailor_projects", JSON.stringify(savedProjects))

      toast({
        title: "Project Created",
        description: (
          <div className="space-y-2">
            <p>Project "{name}" created successfully</p>
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <span className="text-xs font-mono">{result.project_id}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => {
                  navigator.clipboard.writeText(result.project_id)
                  toast({ title: "Copied!", description: "Project ID copied to clipboard" })
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ),
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddImage = async (file: File) => {
    if (!project) return

    setLoading(true)
    try {
      const result = await apiClient.addImageLayer(project._id, file, {
        x: 100,
        y: 100,
        width: 400,
        height: 400,
      })

      const updated = await apiClient.getProject(project._id)
      setProject(updated)

      toast({
        title: "Image Added",
        description: "Image layer added to canvas",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add image",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddText = async () => {
    if (!project) return

    setLoading(true)
    try {
      const result = await apiClient.addTextLayer(project._id, "New Text", {
        font_size: 48,
        color: "#000000",
        x: 150,
        y: 150,
      })

      const updated = await apiClient.getProject(project._id)
      setProject(updated)

      toast({
        title: "Text Added",
        description: "Text layer added to canvas",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add text",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateLayer = async (layerId: string, updates: Partial<Layer>) => {
    if (!project) return

    try {
      await apiClient.updateLayer(project._id, layerId, updates)
      const updated = await apiClient.getProject(project._id)
      setProject(updated)

      if (selectedLayer?.layer_id === layerId) {
        const updatedLayer = updated.layers.find((l) => l.layer_id === layerId)
        setSelectedLayer(updatedLayer || null)
        if (updatedLayer?.type === "text") {
          setEditingText(updatedLayer.text || "")
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update layer",
        variant: "destructive",
      })
    }
  }

  const handleExport = async () => {
    if (!project) return

    setLoading(true)
    try {
      const result = await apiClient.renderProject(project._id)
      const downloadUrl = apiClient.getAssetUrl(result.rendered_file_id)

      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `${projectName || "project"}.png`
      link.click()

      toast({
        title: "Export Complete",
        description: (
          <div className="space-y-2">
            <p>Project rendered successfully</p>
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <span className="text-xs font-mono">{result.rendered_file_id}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => {
                  navigator.clipboard.writeText(result.rendered_file_id)
                  toast({ title: "Copied!", description: "File ID copied to clipboard" })
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ),
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export project",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLayer = (layerId: string) => {
    handleUpdateLayer(layerId, { opacity: 0 })
    setSelectedLayer(null)
  }

  const handleUndo = async () => {
    if (!project) return
    try {
      const result = await apiClient.undo(project._id)
      const updated = await apiClient.getProject(project._id)
      setProject(updated)
      toast({ title: "Undo successful" })
    } catch (error) {
      toast({ title: "Nothing to undo", variant: "destructive" })
    }
  }

  const handleRedo = async () => {
    if (!project) return
    try {
      const result = await apiClient.redo(project._id)
      const updated = await apiClient.getProject(project._id)
      setProject(updated)
      toast({ title: "Redo successful" })
    } catch (error) {
      toast({ title: "Nothing to redo", variant: "destructive" })
    }
  }

  const updateProjectProgress = () => {
    if (!project) return
    const savedProjects = JSON.parse(localStorage.getItem("retailor_projects") || "[]")
    const projectIndex = savedProjects.findIndex((p: any) => p.id === project._id)
    if (projectIndex !== -1) {
      savedProjects[projectIndex].assetsCount = project.layers.length
      savedProjects[projectIndex].progress = Math.min(100, project.layers.length * 10)
      localStorage.setItem("retailor_projects", JSON.stringify(savedProjects))
    }
  }

  useEffect(() => {
    updateProjectProgress()
  }, [project?.layers])

  useEffect(() => {
    if (selectedLayer?.type === "text") {
      setEditingText(selectedLayer.text || "")
    }
  }, [selectedLayer])

  return (
    <>
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Give your project a name to get started</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="e.g., Summer Campaign 2024"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && projectName.trim()) {
                    setShowNameDialog(false)
                    initializeProject(projectName.trim())
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (projectName.trim()) {
                  setShowNameDialog(false)
                  initializeProject(projectName.trim())
                }
              }}
              disabled={!projectName.trim()}
              className="gradient-primary"
            >
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex h-full flex-col lg:flex-row overflow-hidden">
        {/* Tools Sidebar */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border bg-card p-4 space-y-4 overflow-y-auto">
          {project && (
            <Card className="p-4 space-y-3 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{projectName}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Project ID</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 shrink-0"
                  onClick={() => setShowNameDialog(true)}
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2 p-2 bg-background/50 rounded text-xs font-mono break-all">
                <span className="flex-1 truncate">{project._id}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(project._id)
                    toast({ title: "Copied!", description: "Project ID copied" })
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex gap-2 text-xs">
                <Badge variant="secondary">{project.layers.length} layers</Badge>
                <Badge variant="outline">
                  {project.width}×{project.height}
                </Badge>
              </div>
            </Card>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Add Elements</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleAddImage(e.target.files[0])
                }
              }}
            />
            <Button
              className="w-full gap-2 gradient-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={!project || loading}
            >
              <ImageIcon className="h-4 w-4" />
              Add Image
            </Button>
            <Button
              className="w-full gap-2 gradient-accent bg-transparent"
              variant="outline"
              onClick={handleAddText}
              disabled={!project || loading}
            >
              <Type className="h-4 w-4" />
              Add Text
            </Button>
          </div>

          <Separator />

          {selectedLayer && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Layer Properties</h3>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteLayer(selectedLayer.layer_id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Position X</Label>
                  <Input
                    type="number"
                    value={selectedLayer.x}
                    onChange={(e) =>
                      handleUpdateLayer(selectedLayer.layer_id, {
                        x: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Position Y</Label>
                  <Input
                    type="number"
                    value={selectedLayer.y}
                    onChange={(e) =>
                      handleUpdateLayer(selectedLayer.layer_id, {
                        y: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                {selectedLayer.type === "image" && (
                  <>
                    <div className="space-y-2">
                      <Label>Width</Label>
                      <Input
                        type="number"
                        value={selectedLayer.width}
                        onChange={(e) =>
                          handleUpdateLayer(selectedLayer.layer_id, {
                            width: Number.parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Height</Label>
                      <Input
                        type="number"
                        value={selectedLayer.height}
                        onChange={(e) =>
                          handleUpdateLayer(selectedLayer.layer_id, {
                            height: Number.parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {selectedLayer.type === "text" && (
                  <>
                    <div className="space-y-2">
                      <Label>Text</Label>
                      <Textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onBlur={() => {
                          if (editingText !== selectedLayer.text) {
                            handleUpdateLayer(selectedLayer.layer_id, { text: editingText })
                          }
                        }}
                        placeholder="Enter text..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <Input
                        type="number"
                        value={selectedLayer.font_size}
                        onChange={(e) =>
                          handleUpdateLayer(selectedLayer.layer_id, {
                            font_size: Number.parseInt(e.target.value) || 12,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={selectedLayer.color}
                          className="w-16 h-10 p-1"
                          onChange={(e) =>
                            handleUpdateLayer(selectedLayer.layer_id, {
                              color: e.target.value,
                            })
                          }
                        />
                        <Input
                          type="text"
                          value={selectedLayer.color}
                          className="flex-1"
                          onChange={(e) =>
                            handleUpdateLayer(selectedLayer.layer_id, {
                              color: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label>Rotation ({selectedLayer.rotation}°)</Label>
                  <Slider
                    value={[selectedLayer.rotation]}
                    onValueChange={([value]) =>
                      handleUpdateLayer(selectedLayer.layer_id, {
                        rotation: value,
                      })
                    }
                    min={0}
                    max={360}
                    step={1}
                  />
                </div>

                {selectedLayer.opacity !== undefined && (
                  <div className="space-y-2">
                    <Label>Opacity ({Math.round(selectedLayer.opacity * 100)}%)</Label>
                    <Slider
                      value={[selectedLayer.opacity * 100]}
                      onValueChange={([value]) =>
                        handleUpdateLayer(selectedLayer.layer_id, {
                          opacity: value / 100,
                        })
                      }
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Actions</h3>
            <Button className="w-full gap-2 bg-transparent" variant="outline" onClick={handleUndo} disabled={!project}>
              <Undo2 className="h-4 w-4" />
              Undo
            </Button>
            <Button className="w-full gap-2 bg-transparent" variant="outline" onClick={handleRedo} disabled={!project}>
              <Redo2 className="h-4 w-4" />
              Redo
            </Button>
            <Button className="w-full gap-2 gradient-primary" onClick={handleExport} disabled={!project || loading}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="border-b border-border bg-card px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUndo}
                  disabled={loading}
                  className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                >
                  <Undo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRedo}
                  disabled={loading}
                  className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                >
                  <Redo2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                <Separator orientation="vertical" className="mx-1 sm:mx-2 h-6" />
                <Select
                  value={`${canvasSize.width}x${canvasSize.height}`}
                  onValueChange={(value) => {
                    const [width, height] = value.split("x").map(Number)
                    setCanvasSize({ width, height })
                  }}
                >
                  <Trigger className="w-32 sm:w-40 h-8 sm:h-9 text-xs sm:text-sm">
                    {`${canvasSize.width}x${canvasSize.height}`}
                  </Trigger>
                  <SelectContent>
                    <div className="p-2">
                      <SelectGroup>
                        <SelectItem value="1080x1080">1080x1080</SelectItem>
                        <SelectItem value="1080x1350">1080x1350</SelectItem>
                        <SelectItem value="1920x1080">1920x1080</SelectItem>
                        <SelectItem value="2000x2000">2000x2000</SelectItem>
                      </SelectGroup>
                    </div>
                  </SelectContent>
                </Select>
                <Separator orientation="vertical" className="hidden sm:block mx-2 h-6" />
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                    className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                  >
                    <ZoomOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                  <span className="text-xs sm:text-sm text-muted-foreground w-12 sm:w-16 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                    className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                  >
                    <ZoomIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGrid(!showGrid)}
                  className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                >
                  <Grid3x3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent h-8 sm:h-9 text-xs sm:text-sm">
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Preview</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Canvas Preview</DialogTitle>
                      <DialogDescription>Full resolution preview of your creative</DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center bg-muted/30 p-8 rounded-lg">
                      <div
                        className="relative bg-white shadow-2xl"
                        style={{
                          width: `${Math.min(canvasSize.width, 600)}px`,
                          height: `${Math.min(canvasSize.height, 600)}px`,
                        }}
                      >
                        {project?.layers.map((layer) => (
                          <div
                            key={layer.layer_id}
                            className="absolute"
                            style={{
                              left: `${(layer.x / canvasSize.width) * 100}%`,
                              top: `${(layer.y / canvasSize.height) * 100}%`,
                              width: layer.width ? `${(layer.width / canvasSize.width) * 100}%` : "auto",
                              height: layer.height ? `${(layer.height / canvasSize.height) * 100}%` : "auto",
                              transform: `rotate(${layer.rotation}deg)`,
                              opacity: layer.opacity || 1,
                            }}
                          >
                            {layer.type === "image" && layer.file_id && (
                              <img
                                src={apiClient.getAssetUrl(layer.file_id) || "/placeholder.svg"}
                                alt="Layer"
                                className="h-full w-full object-cover"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                  console.error("[v0] Failed to load image:", layer.file_id)
                                  e.currentTarget.src = "/abstract-colorful-swirls.png"
                                }}
                              />
                            )}
                            {layer.type === "text" && (
                              <div
                                style={{
                                  fontSize: `${(layer.font_size || 48) * (Math.min(canvasSize.width, 600) / canvasSize.width)}px`,
                                  color: layer.color,
                                  fontWeight: "bold",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {layer.text}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  className="gap-2 gradient-primary h-8 sm:h-9 text-xs sm:text-sm"
                  onClick={handleExport}
                  disabled={loading}
                >
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{loading ? "Rendering..." : "Export"}</span>
                  <span className="sm:hidden">Export</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Actual Canvas Rendering */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 bg-muted/30">
            <div className="flex items-center justify-center min-h-full">
              <div
                className="relative shadow-2xl"
                style={{
                  width: `${canvasSize.width * zoom}px`,
                  height: `${canvasSize.height * zoom}px`,
                  backgroundColor: project?.background_color || "#FFFFFF",
                  backgroundImage: showGrid
                    ? "repeating-linear-gradient(0deg, #e5e7eb 0px, #e5e7eb 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #e5e7eb 0px, #e5e7eb 1px, transparent 1px, transparent 20px)"
                    : "none",
                  backgroundSize: showGrid ? `${20 * zoom}px ${20 * zoom}px` : "auto",
                }}
              >
                {project?.layers.map((layer) => (
                  <div
                    key={layer.layer_id}
                    className={`absolute cursor-move ${
                      selectedLayer?.layer_id === layer.layer_id ? "ring-2 ring-primary" : ""
                    }`}
                    style={{
                      left: `${layer.x * zoom}px`,
                      top: `${layer.y * zoom}px`,
                      width: layer.width ? `${layer.width * zoom}px` : "auto",
                      height: layer.height ? `${layer.height * zoom}px` : "auto",
                      transform: `rotate(${layer.rotation}deg)`,
                      opacity: layer.opacity || 1,
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedLayer(layer)
                    }}
                  >
                    {layer.type === "image" && layer.file_id && (
                      <img
                        src={apiClient.getAssetUrl(layer.file_id) || "/placeholder.svg"}
                        alt="Layer"
                        className="h-full w-full object-cover"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.log("[v0] Image load failed, using fallback")
                          e.currentTarget.src = "/abstract-colorful-swirls.png"
                        }}
                      />
                    )}
                    {layer.type === "text" && (
                      <div
                        style={{
                          fontSize: `${(layer.font_size || 48) * zoom}px`,
                          color: layer.color || "#000000",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {layer.text || "Text"}
                      </div>
                    )}
                  </div>
                ))}

                {!project && (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <p className="text-lg font-medium">Create a project to start editing</p>
                      <p className="text-sm mt-2">Click "New Project" above</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Layers Sidebar */}
          <div className="hidden lg:block lg:w-64 border-l border-border bg-card p-4 space-y-4 overflow-y-auto">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Layers</h3>
              {project?.layers.map((layer, index) => (
                <Card
                  key={layer.layer_id}
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    selectedLayer?.layer_id === layer.layer_id ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedLayer(layer)}
                >
                  <div className="p-3">
                    <div className="flex items-center gap-3">
                      {layer.type === "image" ? (
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Type className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">
                          {layer.type === "text" ? layer.text : `Image ${index + 1}`}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{layer.type} Layer</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {project?.layers.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">No layers yet</div>
              )}
            </div>
          </div>

          {/* Mobile Tools */}
          <div className="lg:hidden border-t border-border bg-card p-3">
            <div className="flex items-center justify-around gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleAddImage(e.target.files[0])
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 bg-transparent"
                onClick={() => fileInputRef.current?.click()}
                disabled={!project || loading}
              >
                <ImageIcon className="h-4 w-4" />
                Image
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 bg-transparent"
                onClick={handleAddText}
                disabled={!project || loading}
              >
                <Type className="h-4 w-4" />
                Text
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                <ImageIcon className="h-4 w-4" />
                Layers {project?.layers.length || 0}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

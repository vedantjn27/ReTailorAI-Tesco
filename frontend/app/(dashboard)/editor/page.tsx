"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  ImageIcon, Type, Download, Trash2, ZoomIn, ZoomOut,
  Grid3x3, Undo2, Redo2, Copy, Check, X, Wand2, Sparkles, SlidersHorizontal, Settings2, Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

type LayerType = "image" | "text"

interface CanvasLayer {
  layer_id: string
  type: LayerType
  x: number
  y: number
  width?: number
  height?: number
  file_id?: string
  imageUrl?: string
  text?: string
  font_size?: number
  color?: string
  rotation?: number
  opacity?: number
}

interface CanvasProject {
  project_id: string
  name: string
  width: number
  height: number
  background_color: string
  layers: CanvasLayer[]
}

type Handle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w"
const HANDLES: Handle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"]

const handleCursor: Record<Handle, string> = {
  nw: "nw-resize", n: "n-resize", ne: "ne-resize",
  e: "e-resize", se: "se-resize", s: "s-resize",
  sw: "sw-resize", w: "w-resize",
}

function getHandlePos(layer: CanvasLayer, handle: Handle, zoom: number) {
  const w = (layer.width ?? 200) * zoom
  const h = (layer.height ?? 60) * zoom
  const cx = layer.x * zoom, cy = layer.y * zoom
  switch (handle) {
    case "nw": return { left: cx - 5, top: cy - 5 }
    case "n":  return { left: cx + w / 2 - 5, top: cy - 5 }
    case "ne": return { left: cx + w - 5, top: cy - 5 }
    case "e":  return { left: cx + w - 5, top: cy + h / 2 - 5 }
    case "se": return { left: cx + w - 5, top: cy + h - 5 }
    case "s":  return { left: cx + w / 2 - 5, top: cy + h - 5 }
    case "sw": return { left: cx - 5, top: cy + h - 5 }
    case "w":  return { left: cx - 5, top: cy + h / 2 - 5 }
  }
}

export default function EditorPage() {
  const [project, setProject] = useState<CanvasProject | null>(null)
  const [projectName, setProjectName] = useState("")
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 1080, height: 1080 })
  const [zoom, setZoom] = useState(0.55)
  const [showGrid, setShowGrid] = useState(false)
  const [history, setHistory] = useState<CanvasLayer[][]>([])
  const [future, setFuture] = useState<CanvasLayer[][]>([])
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null)
  const [inlineText, setInlineText] = useState("")
  const { toast } = useToast()
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // AI Co-pilot State
  const [aiProduct, setAiProduct] = useState("")
  const [aiDesc, setAiDesc] = useState("")
  const [aiTone, setAiTone] = useState("professional")
  const [aiPlatform, setAiPlatform] = useState("instagram")
  const [aiResults, setAiResults] = useState<any>(null)
  const [aiLoading, setAiLoading] = useState(false)

  // Drag state
  const dragState = useRef<{
    active: boolean
    layerId: string
    startX: number; startY: number
    origX: number; origY: number
  } | null>(null)

  // Resize state
  const resizeState = useRef<{
    active: boolean
    layerId: string
    handle: Handle
    startX: number; startY: number
    origX: number; origY: number
    origW: number; origH: number
  } | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pid = params.get("project")
    if (pid) {
      loadExistingProject(pid)
    } else {
      setShowNameDialog(true)
    }
  }, [])

  const loadExistingProject = async (pid: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/editor/${pid}`)
      if (!res.ok) throw new Error("Project not found")
      const data = await res.json()
      setProject({
        project_id: data._id || pid,
        name: data.name || "Untitled Project",
        width: data.width,
        height: data.height,
        background_color: data.background_color,
        layers: (data.layers || []).map((l: any) => ({
          ...l,
          width: l.width ?? (l.type === "text" ? 400 : 300),
          height: l.height ?? (l.type === "text" ? 80 : 300),
        })),
      })
      setCanvasSize({ width: data.width, height: data.height })
    } catch (e: any) {
      toast({ title: "Failed to load project", description: e.message, variant: "destructive" })
      setShowNameDialog(true)
    } finally {
      setLoading(false)
    }
  }

  const initializeProject = async (name: string) => {
    setLoading(true)
    try {
      const res = await fetch(
        `${API_BASE}/editor/create-project?name=${encodeURIComponent(name)}&width=${canvasSize.width}&height=${canvasSize.height}`,
        { method: "POST" }
      )
      if (!res.ok) throw new Error("Failed to create project")
      const data = await res.json()
      setProject({ project_id: data.project_id, name, width: canvasSize.width, height: canvasSize.height, background_color: "#FFFFFF", layers: [] })
      setShowNameDialog(false)
      toast({ title: `✅ Canvas ready!`, description: `${name} — ${canvasSize.width}×${canvasSize.height}px` })
    } catch (e: any) {
      toast({ title: "Error creating project", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // Dimension Change Auto-scaling logic
  const handleResizeCanvas = (dimString: string) => {
    if (!project) return
    const [newW, newH] = dimString.split("x").map(Number)
    
    // Auto-scale ratio
    const scaleX = newW / project.width
    const scaleY = newH / project.height

    const updatedLayers = project.layers.map(l => ({
      ...l,
      x: l.x * scaleX,
      y: l.y * scaleY,
      width: l.width ? l.width * scaleX : undefined,
      height: l.height ? l.height * scaleY : undefined,
      font_size: l.type === 'text' && l.font_size ? Math.round(l.font_size * Math.min(scaleX, scaleY)) : l.font_size
    }))
    
    updateLayers(updatedLayers, true)
    setProject(prev => prev ? ({ ...prev, width: newW, height: newH, layers: updatedLayers }) : null)
    setCanvasSize({ width: newW, height: newH })
    toast({ title: `Canvas Resized & Auto-scaled to ${newW}x${newH}` })
  }

  // AI Integration function
  const generateAICopy = async () => {
    if (!aiProduct) { toast({title: "Product Name required", variant:"destructive"}); return; }
    setAiLoading(true)
    try {
      const res = await fetch(`${API_BASE}/ai/copy-suggestions`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_name: aiProduct, product_description: aiDesc, tone: aiTone, platform: aiPlatform })
      })
      if (!res.ok) throw new Error("AI generation failed")
      const data = await res.json()
      setAiResults(data.suggestions || data)
      toast({ title: "Creative ideas generated!" })
    } catch(e:any) {
      toast({ title: "Failed to connect to Mistral AI", description: e.message, variant: "destructive" })
    } finally {
      setAiLoading(false)
    }
  }

  const injectAiTextToCanvas = (textStr: string, size: number = 42, color: string = "#000000") => {
    if (!project) return
    const newLayer: CanvasLayer = {
      layer_id: `layer_${Date.now()}`,
      type: "text",
      text: textStr,
      font_size: size,
      color: color,
      x: project.width * 0.1,
      y: project.height * 0.4,
      width: Math.min(600, project.width * 0.8),
      height: size * 1.5,
      rotation: 0,
      opacity: 1,
    }
    updateLayers([...project.layers, newLayer])
    setSelectedLayerId(newLayer.layer_id)
    toast({ title: "Added to canvas!" })
  }

  // Snapshot for undo
  const pushHistory = useCallback((layers: CanvasLayer[]) => {
    setHistory(prev => [...prev.slice(-30), [...layers]])
    setFuture([])
  }, [])

  const undo = () => {
    if (!project || history.length === 0) return
    setFuture(prev => [[...project.layers], ...prev])
    const prev = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setProject(p => p ? { ...p, layers: prev } : null)
  }

  const redo = () => {
    if (!project || future.length === 0) return
    setHistory(prev => [...prev, [...project.layers]])
    const next = future[0]
    setFuture(f => f.slice(1))
    setProject(p => p ? { ...p, layers: next } : null)
  }

  const updateLayers = (layers: CanvasLayer[], snapshot = true) => {
    if (!project) return
    if (snapshot) pushHistory(project.layers)
    setProject(p => p ? { ...p, layers } : null)
  }

  const selectedLayer = project?.layers.find(l => l.layer_id === selectedLayerId) ?? null

  const onLayerMouseDown = (e: React.MouseEvent, layerId: string) => {
    e.stopPropagation()
    if (editingLayerId) return
    setSelectedLayerId(layerId)
    const layer = project!.layers.find(l => l.layer_id === layerId)!
    dragState.current = {
      active: true, layerId,
      startX: e.clientX, startY: e.clientY,
      origX: layer.x, origY: layer.y,
    }
  }

  const onHandleMouseDown = (e: React.MouseEvent, layerId: string, handle: Handle) => {
    e.stopPropagation()
    e.preventDefault()
    const layer = project!.layers.find(l => l.layer_id === layerId)!
    resizeState.current = {
      active: true, layerId, handle,
      startX: e.clientX, startY: e.clientY,
      origX: layer.x, origY: layer.y,
      origW: layer.width ?? 200,
      origH: layer.height ?? 100,
    }
    pushHistory(project!.layers)
  }

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (dragState.current?.active) {
      const { layerId, startX, startY, origX, origY } = dragState.current
      const dx = (e.clientX - startX) / zoom
      const dy = (e.clientY - startY) / zoom
      setProject(p => p ? {
        ...p,
        layers: p.layers.map(l => l.layer_id === layerId ? { ...l, x: Math.round(origX + dx), y: Math.round(origY + dy) } : l)
      } : null)
    }
    if (resizeState.current?.active) {
      const { layerId, handle, startX, startY, origX, origY, origW, origH } = resizeState.current
      const dx = (e.clientX - startX) / zoom
      const dy = (e.clientY - startY) / zoom
      let x = origX, y = origY, w = origW, h = origH
      if (handle.includes("e")) w = Math.max(40, origW + dx)
      if (handle.includes("s")) h = Math.max(20, origH + dy)
      if (handle.includes("w")) { x = origX + dx; w = Math.max(40, origW - dx) }
      if (handle.includes("n")) { y = origY + dy; h = Math.max(20, origH - dy) }
      setProject(p => p ? {
        ...p,
        layers: p.layers.map(l => l.layer_id === layerId
          ? { ...l, x: Math.round(x), y: Math.round(y), width: Math.round(w), height: Math.round(h) }
          : l)
      } : null)
    }
  }, [zoom])

  const onMouseUp = useCallback(() => {
    if (dragState.current?.active) {
      pushHistory(project?.layers.map(l => l.layer_id === dragState.current!.layerId
        ? { ...l } : l) ?? [])
      dragState.current = null
    }
    if (resizeState.current?.active) {
      resizeState.current = null
    }
  }, [project, pushHistory])

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  const handleDoubleClick = (e: React.MouseEvent, layer: CanvasLayer) => {
    e.stopPropagation()
    if (layer.type === "text") {
      setEditingLayerId(layer.layer_id)
      setInlineText(layer.text ?? "")
    }
  }

  const commitTextEdit = () => {
    if (!editingLayerId || !project) return
    const layers = project.layers.map(l =>
      l.layer_id === editingLayerId ? { ...l, text: inlineText } : l
    )
    updateLayers(layers)
    setEditingLayerId(null)
  }

  const addTextLayer = () => {
    if (!project) return
    const newLayer: CanvasLayer = {
      layer_id: `layer_${Date.now()}`,
      type: "text",
      text: "New Text",
      font_size: 48,
      color: "#FFFFFF",
      x: project.width / 2 - 100,
      y: project.height / 2,
      width: 400,
      height: 80,
      rotation: 0,
      opacity: 1,
    }
    updateLayers([...project.layers, newLayer])
    setSelectedLayerId(newLayer.layer_id)
    setEditingLayerId(newLayer.layer_id)
    setInlineText("New Text")
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !project) return
    const file = e.target.files[0]
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const uploadRes = await fetch(`${API_BASE}/upload-asset`, { method: "POST", body: formData })
      if (!uploadRes.ok) throw new Error("Upload failed")
      const uploadData = await uploadRes.json()
      const imageUrl = `${API_BASE}/asset/${uploadData.file_id}`
      const newLayer: CanvasLayer = {
        layer_id: `layer_${Date.now()}`,
        type: "image",
        file_id: uploadData.file_id,
        imageUrl,
        x: project.width > 400 ? project.width / 2 - 200 : 50, y: 50,
        width: 400, height: 400,
        rotation: 0, opacity: 1,
      }
      updateLayers([...project.layers, newLayer])
      setSelectedLayerId(newLayer.layer_id)
      toast({ title: "✅ Image added!" })
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const removeBackground = async () => {
    if (!selectedLayer || selectedLayer.type !== "image" || !selectedLayer.file_id) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/remove-bg/${selectedLayer.file_id}`)
      if (!res.ok) throw new Error("Background removal failed")
      const data = await res.json()
      const newUrl = `${API_BASE}/asset/${data.new_file_id}`
      const layers = project!.layers.map(l =>
        l.layer_id === selectedLayerId ? { ...l, file_id: data.new_file_id, imageUrl: newUrl } : l
      )
      updateLayers(layers)
      toast({ title: "✅ Background removed!" })
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const deleteLayer = () => {
    if (!selectedLayer || !project) return
    updateLayers(project.layers.filter(l => l.layer_id !== selectedLayerId))
    setSelectedLayerId(null)
  }

  const duplicateLayer = () => {
    if (!selectedLayer || !project) return
    const clone: CanvasLayer = { ...selectedLayer, layer_id: `layer_${Date.now()}`, x: selectedLayer.x + 20, y: selectedLayer.y + 20 }
    updateLayers([...project.layers, clone])
    setSelectedLayerId(clone.layer_id)
  }

  const updateSelectedLayer = (updates: Partial<CanvasLayer>) => {
    if (!selectedLayerId || !project) return
    const layers = project.layers.map(l => l.layer_id === selectedLayerId ? { ...l, ...updates } : l)
    setProject(p => p ? { ...p, layers } : null)
  }

  const saveProject = async () => {
    if (!project) return
    setLoading(true)
    try {
      // 1. First update the project dimensions
      await fetch(`${API_BASE}/editor/projects/${project.project_id}`, {
        method: "PUT",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ width: project.width, height: project.height, background_color: project.background_color })
      }).catch(e => console.warn("Project details update skipped:", e))
      
      // 2. Sync all layers safely
      const layerRes = await fetch(`${API_BASE}/editor/${project.project_id}/set-layers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layers: project.layers }),
      })
      if (!layerRes.ok) throw new Error("Layer sync failed")
      
      toast({ title: "✅ Project saved!" })
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const exportProject = async () => {
    if (!project) return
    setLoading(true)
    try {
      // FORCE SYNC DIMENSIONS & LAYERS PRIOR TO EXPORT
      await fetch(`${API_BASE}/editor/projects/${project.project_id}`, {
        method: "PUT",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ width: project.width, height: project.height, background_color: project.background_color })
      })
      await fetch(`${API_BASE}/editor/${project.project_id}/set-layers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layers: project.layers }),
      })

      const res = await fetch(`${API_BASE}/editor/${project.project_id}/render`)
      if (!res.ok) throw new Error("Render pipeline failed")
      
      // We directly read the blob from the StreamingResponse the backend provides!
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a"); a.href = url
      a.download = `${project.name || "creative"}.png`; a.click()
      URL.revokeObjectURL(url)
      
      toast({ title: "✅ Exported successfully!" })
    } catch (e: any) {
      toast({ title: "Export failed", description: e.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const canvasW = (project?.width ?? canvasSize.width) * zoom
  const canvasH = (project?.height ?? canvasSize.height) * zoom

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2 flex-wrap">
        <span className="font-semibold text-sm mr-2 truncate max-w-[140px]">{project?.name ?? "Canvas Editor"}</span>
        
        {/* Dynamic Canvas Resizer */}
        <Select
          value={`${project?.width || canvasSize.width}x${project?.height || canvasSize.height}`}
          onValueChange={handleResizeCanvas}
          disabled={!project}
        >
          <SelectTrigger className="w-[180px] h-8 bg-muted/50 border-0 text-xs font-mono"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1080x1080">Insta Square (1080×</SelectItem>
            <SelectItem value="1080x1920">Insta Story (1080×1920)</SelectItem>
            <SelectItem value="1200x628">Facebook Ad (1200×628)</SelectItem>
            <SelectItem value="1280x720">YouTube Thumbnail (1280×720)</SelectItem>
            <SelectItem value="800x1000">Product Card (800×1000)</SelectItem>
            <SelectItem value="1920x1080">Full HD Banner (1920×1080)</SelectItem>
          </SelectContent>
        </Select>

        <div className="w-px h-6 bg-border mx-1" />
        
        <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-1">
          <ImageIcon className="h-4 w-4" /> Image
        </Button>
        <Button size="sm" variant="outline" onClick={addTextLayer} className="gap-1">
          <Type className="h-4 w-4" /> Text
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        <Button size="icon" variant="ghost" onClick={undo} disabled={history.length === 0} title="Undo">
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={redo} disabled={future.length === 0} title="Redo">
          <Redo2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button size="icon" variant="ghost" onClick={() => setZoom(z => Math.min(2, z + 0.1))} title="Zoom in">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} title="Zoom out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground w-12 text-center">{Math.round(zoom * 100)}%</span>
        <Button size="icon" variant="ghost" onClick={() => setShowGrid(g => !g)} title="Toggle grid">
          <Grid3x3 className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button size="sm" variant="outline" onClick={saveProject} disabled={loading || !project}>Save</Button>
        <Button size="sm" onClick={exportProject} disabled={loading || !project} className="gap-1 shadow bg-primary hover:bg-primary/90 text-primary-foreground">
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas area */}
        <div
          className="flex-1 overflow-auto bg-[#1a1a2e] flex items-center justify-center p-8"
          onClick={() => { setSelectedLayerId(null); if (editingLayerId) commitTextEdit() }}
        >
          {!project ? (
            <div className="text-muted-foreground text-center">
              <p className="text-lg">Create or open a project to start</p>
            </div>
          ) : (
            <div
              ref={canvasRef}
              className="relative shadow-2xl bg-white transition-all overflow-hidden"
              style={{
                width: canvasW, height: canvasH,
                background: project.background_color,
                backgroundImage: showGrid
                  ? `linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)`
                  : undefined,
                backgroundSize: showGrid ? `${40 * zoom}px ${40 * zoom}px` : undefined,
              }}
            >
              {project.layers.map((layer) => {
                const isSelected = layer.layer_id === selectedLayerId
                const isEditing = layer.layer_id === editingLayerId
                const lx = layer.x * zoom, ly = layer.y * zoom
                const lw = (layer.width ?? 200) * zoom
                const lh = (layer.height ?? 60) * zoom
                const fs = (layer.font_size ?? 32) * zoom

                return (
                  <div key={layer.layer_id}>
                    {/* Layer element */}
                    <div
                      style={{
                        position: "absolute",
                        left: lx, top: ly,
                        width: lw, height: lh,
                        opacity: layer.opacity ?? 1,
                        cursor: dragState.current?.layerId === layer.layer_id ? "grabbing" : "grab",
                        outline: isSelected ? "2px solid #7c3aed" : "none",
                        outlineOffset: "1px",
                        boxSizing: "border-box",
                        userSelect: "none",
                        transform: `rotate(${layer.rotation || 0}deg)`
                      }}
                      onMouseDown={(e) => onLayerMouseDown(e, layer.layer_id)}
                      onDoubleClick={(e) => handleDoubleClick(e, layer)}
                    >
                      {layer.type === "image" && layer.imageUrl ? (
                        <img
                          src={layer.imageUrl}
                          alt=""
                          draggable={false}
                          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                        />
                      ) : layer.type === "image" ? (
                        <div className="w-full h-full flex items-center justify-center bg-white/10 border border-dashed border-white/30 rounded">
                          <ImageIcon className="text-white/40" style={{ width: lw / 4, height: lh / 4 }} />
                        </div>
                      ) : isEditing ? (
                        <textarea
                          autoFocus
                          value={inlineText}
                          onChange={e => setInlineText(e.target.value)}
                          onBlur={commitTextEdit}
                          onKeyDown={e => { if (e.key === "Escape") commitTextEdit() }}
                          style={{
                            position: "absolute", inset: 0,
                            background: "transparent",
                            border: "none", outline: "none",
                            resize: "none",
                            color: layer.color ?? "#000",
                            fontSize: fs,
                            fontFamily: "Arial, sans-serif",
                            fontWeight: "bold",
                            lineHeight: 1.2,
                            padding: 0,
                            width: "100%", height: "100%",
                          }}
                          onClick={e => e.stopPropagation()}
                        />
                      ) : (
                        <span
                          style={{
                            color: layer.color ?? "#000",
                            fontSize: fs,
                            fontFamily: "Arial, sans-serif",
                            fontWeight: "bold",
                            lineHeight: 1.2,
                            whiteSpace: "pre-wrap",
                            display: "block",
                          }}
                        >
                          {layer.text ?? ""}
                        </span>
                      )}
                    </div>

                    {/* Resize handles */}
                    {isSelected && !isEditing && HANDLES.map(handle => {
                      const pos = getHandlePos(layer, handle, zoom)
                      return (
                         <div
                          key={handle}
                          style={{
                            position: "absolute",
                            left: pos.left, top: pos.top,
                            width: 10, height: 10,
                            background: "#7c3aed",
                            border: "2px solid white",
                            borderRadius: 2,
                            cursor: handleCursor[handle],
                            zIndex: 10,
                          }}
                          onMouseDown={(e) => onHandleMouseDown(e, layer.layer_id, handle)}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Panel with Tabs for AI and Properties */}
        {project && (
          <div className="w-80 shrink-0 overflow-hidden flex flex-col border-l border-border bg-card">
            <Tabs defaultValue="properties" className="flex flex-col h-full">
              <TabsList className="grid grid-cols-2 rounded-none p-0 h-11 bg-card border-b border-border">
                <TabsTrigger value="properties" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"><Settings2 className="w-3.5 h-3.5 mr-2" /> Properties</TabsTrigger>
                <TabsTrigger value="ai" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-500 data-[state=active]:shadow-none"><Sparkles className="w-3.5 h-3.5 mr-2" /> AI Copilot</TabsTrigger>
              </TabsList>

              <TabsContent value="properties" className="flex-1 overflow-y-auto p-4 space-y-4 m-0 data-[state=inactive]:hidden">
                {selectedLayer ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm capitalize">{selectedLayer.type} Layer</h3>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={duplicateLayer} title="Duplicate">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={deleteLayer} title="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {["x", "y", "width", "height"].map(prop => (
                        <div key={prop} className="space-y-1">
                          <Label className="text-[11px] uppercase text-muted-foreground">{prop}</Label>
                          <Input
                            type="number"
                            value={Math.round((selectedLayer as any)[prop] ?? 0)}
                            onChange={e => updateSelectedLayer({ [prop]: parseInt(e.target.value) || 0 })}
                            className="h-8 text-xs font-mono"
                          />
                        </div>
                      ))}
                    </div>

                    {selectedLayer.type === "text" && (
                      <>
                        <div className="space-y-1 mt-4 border-t border-border pt-4">
                          <Label className="text-xs">Text Content</Label>
                          <Textarea
                            value={selectedLayer.text ?? ""}
                            onChange={e => updateSelectedLayer({ text: e.target.value })}
                            rows={3}
                            className="text-xs resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Font Size</Label>
                            <Input
                              type="number"
                              value={selectedLayer.font_size ?? 32}
                              onChange={e => updateSelectedLayer({ font_size: parseInt(e.target.value) || 32 })}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Text Color</Label>
                            <div className="flex gap-1">
                              <input type="color" value={selectedLayer.color ?? "#000000"} onChange={e => updateSelectedLayer({ color: e.target.value })} className="h-8 w-9 rounded-md border cursor-pointer" />
                              <Input value={selectedLayer.color ?? "#000000"} onChange={e => updateSelectedLayer({ color: e.target.value })} className="h-8 text-xs font-mono flex-1" />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedLayer.type === "image" && (
                      <div className="pt-4 border-t border-border mt-4">
                        <Button size="sm" variant="outline" className="w-full flex items-center justify-center gap-2" onClick={removeBackground} disabled={loading}>
                          <Wand2 className="w-3.5 h-3.5" /> {loading ? "Processing…" : "Auto Remove Background"}
                        </Button>
                      </div>
                    )}

                    <div className="space-y-2 pt-4 border-t border-border mt-4">
                      <Label className="text-xs flex justify-between">
                        <span>Opacity</span>
                        <span>{Math.round((selectedLayer.opacity ?? 1) * 100)}%</span>
                      </Label>
                      <Slider
                        min={0} max={1} step={0.01}
                        value={[selectedLayer.opacity ?? 1]}
                        onValueChange={([v]) => updateSelectedLayer({ opacity: v })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-sm">Canvas Setup</h3>
                    <div className="space-y-1">
                      <Label className="text-xs">Background Hex</Label>
                      <div className="flex gap-1">
                        <input
                          type="color"
                          value={project.background_color}
                          onChange={e => setProject(p => p ? { ...p, background_color: e.target.value } : null)}
                          className="h-8 w-9 rounded border cursor-pointer"
                        />
                        <Input
                          value={project.background_color}
                          onChange={e => setProject(p => p ? { ...p, background_color: e.target.value } : null)}
                          className="h-8 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-1 pt-4 border-t border-border mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-muted-foreground">LAYERS DICTIONARY ({project.layers.length})</h4>
                      </div>
                      {project.layers.length === 0 ? (
                        <p className="text-xs text-muted-foreground p-4 text-center border border-dashed rounded bg-muted/20">No active layers</p>
                      ) : (
                        <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
                          {[...project.layers].reverse().map(layer => (
                            <button
                              key={layer.layer_id}
                              onClick={() => setSelectedLayerId(layer.layer_id)}
                              className={`w-full text-left flex items-center gap-2 px-2.5 py-2 border rounded text-xs transition-colors ${
                                layer.layer_id === selectedLayerId ? "bg-primary/10 border-primary text-primary" : "border-transparent hover:bg-muted"
                              }`}
                            >
                              {layer.type === "text" ? <Type className="h-3.5 w-3.5 shrink-0" /> : <ImageIcon className="h-3.5 w-3.5 shrink-0" />}
                              <span className="truncate">{layer.text?.slice(0, 22) ?? `Image (${layer.width}×${layer.height})`}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="ai" className="flex-1 overflow-y-auto p-4 space-y-4 m-0 data-[state=inactive]:hidden bg-gradient-to-br from-indigo-50/10 to-transparent">
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-sm text-indigo-500">Magic Ad Writer</h3>
                  <p className="text-xs text-muted-foreground leading-snug">Generate headlines and catchphrases tailored to your brand directly onto the canvas.</p>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-foreground/80">Product Name</Label>
                    <Input placeholder="e.g. Vita Glow Serum" value={aiProduct} onChange={e => setAiProduct(e.target.value)} className="h-8 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-foreground/80">Key Benefit</Label>
                    <Input placeholder="e.g. 24h hydration" value={aiDesc} onChange={e => setAiDesc(e.target.value)} className="h-8 text-xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">Tone</Label>
                      <Select value={aiTone} onValueChange={setAiTone}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue/></SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="professional">Pro</SelectItem>
                          <SelectItem value="playful">Playful</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase">Format</Label>
                      <Select value={aiPlatform} onValueChange={setAiPlatform}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue/></SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="display">Display Ad</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button onClick={generateAICopy} disabled={aiLoading || !aiProduct} className="w-full h-8 text-xs gap-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    {aiLoading ? "Generating..." : "Generate AI Ideas"}
                  </Button>
                </div>

                {aiResults && (
                  <div className="pt-4 border-t border-indigo-100 flex flex-col gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-foreground/70">Top Headlines</Label>
                      {aiResults.headlines?.map((hl: string, i: number) => (
                        <div key={i} className="group relative border border-border rounded-lg p-2.5 bg-background shadow-sm hover:border-indigo-300 transition-colors">
                          <p className="text-xs font-bold leading-tight pr-6">{hl}</p>
                          <button onClick={() => injectAiTextToCanvas(hl, 64, "#111111")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-muted rounded hover:bg-indigo-100 hover:text-indigo-600 transition-colors" title="Add to Canvas">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 mt-2">
                      <Label className="text-xs font-semibold text-foreground/70">Supporting Tags</Label>
                      {aiResults.taglines?.map((tag: string, i: number) => (
                        <div key={i} className="group relative border border-border rounded-lg p-2.5 bg-background shadow-sm hover:border-indigo-300 transition-colors">
                          <p className="text-xs font-medium italic text-muted-foreground leading-tight pr-6">"{tag}"</p>
                          <button onClick={() => injectAiTextToCanvas(tag, 32, "#555555")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-muted rounded hover:bg-indigo-100 hover:text-indigo-600 transition-colors" title="Add to Canvas">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Name Dialog */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Canvas Project</DialogTitle>
            <DialogDescription>Give your project a name and choose its dimensions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Project Name</Label>
              <Input
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="e.g. Summer Campaign 2025"
                onKeyDown={e => e.key === "Enter" && projectName.trim() && initializeProject(projectName)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Initial Canvas Size</Label>
              <Select
                value={`${canvasSize.width}x${canvasSize.height}`}
                onValueChange={v => {
                  const [w, h] = v.split("x").map(Number)
                  setCanvasSize({ width: w, height: h })
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1080x1080">Instagram Post (1080×1080)</SelectItem>
                  <SelectItem value="1080x1920">Instagram Story (1080×1920)</SelectItem>
                  <SelectItem value="1200x628">Facebook Ad (1200×628)</SelectItem>
                  <SelectItem value="1280x720">YouTube Thumbnail (1280×720)</SelectItem>
                  <SelectItem value="800x1000">Product Card (800×1000)</SelectItem>
                  <SelectItem value="1920x1080">Full HD Banner (1920×1080)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => initializeProject(projectName || "Untitled Project")}
              disabled={loading}
              className="gradient-primary shadow"
            >
              {loading ? "Creating…" : "Create Canvas →"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

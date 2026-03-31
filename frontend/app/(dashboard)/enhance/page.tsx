"use client"

import { useState, useRef, useEffect } from "react"
import { Wand2, Sparkles, Crop, Download, Image as ImageIcon, UploadCloud, RotateCcw, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface CropBox {
  x: number; y: number; width: number; height: number;
}

export default function EnhancePage() {
  const [fileId, setFileId] = useState<string | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Batch State
  const [batchResults, setBatchResults] = useState<{ mode: string, key: string, url: string }[]>([])
  const [batchLoading, setBatchLoading] = useState(false)

  // Manual Adjustments
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [sharpness, setSharpness] = useState(0)
  const [isSharpnessEnabled, setIsSharpnessEnabled] = useState(false)

  // Crop State
  const [isCropping, setIsCropping] = useState(false)
  const [cropBox, setCropBox] = useState<CropBox>({ x: 10, y: 10, width: 80, height: 80 }) // stored in percentages for responsive layout
  const imgRef = useRef<HTMLImageElement>(null)
  const dragRef = useRef<{ active: boolean; handle?: string; startX: number; startY: number; startBox: CropBox } | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", e.target.files[0])
      const res = await fetch(`${API_BASE}/upload-asset`, { method: "POST", body: formData })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      
      setFileId(data.file_id)
      setOriginalUrl(`${API_BASE}/asset/${data.file_id}`)
      resetAdjustments()
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const resetAdjustments = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setSharpness(0)
    setIsSharpnessEnabled(false)
    setIsCropping(false)
    setCropBox({ x: 10, y: 10, width: 80, height: 80 })
  }

  // Handle AI Endpoints mapping cleanly
  const runAIEnhance = async () => {
    if (!fileId) return
    setProcessing(true)
    try {
      const bFactor = brightness / 100
      const cFactor = contrast / 100
      const sFactor = isSharpnessEnabled ? (1 + (sharpness / 100)) : 1.0
      const res = await fetch(`${API_BASE}/enhance/${fileId}?brightness=${bFactor}&contrast=${cFactor}&sharpness=${sFactor}`)
      if (!res.ok) throw new Error("Enhancement failed")
      const data = await res.json()
      setFileId(data.new_file_id)
      setOriginalUrl(`${API_BASE}/asset/${data.new_file_id}`)
      resetAdjustments()
      toast({ title: "✨ AI Enhancement Applied!" })
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" })
    } finally {
      setProcessing(false)
    }
  }

  const runAISmartCrop = async () => {
    if (!fileId) return
    setProcessing(true)
    try {
      // Typically square output for smart crop demo
      const res = await fetch(`${API_BASE}/smart-crop/${fileId}?width=1000&height=1000`)
      if (!res.ok) throw new Error("Smart Crop failed")
      const data = await res.json()
      setFileId(data.new_file_id)
      setOriginalUrl(`${API_BASE}/asset/${data.new_file_id}`)
      resetAdjustments()
      toast({ title: "✂️ AI Smart Crop Applied!" })
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" })
    } finally {
      setProcessing(false)
    }
  }

  const generateBatchFormats = async () => {
    if (!fileId) return
    setBatchLoading(true)
    setBatchResults([])
    try {
      const modes = [
        { key: "square", name: "Instagram (1:1)", query: "mode=square" },
        { key: "portrait", name: "Story/Reels (4:5)", query: "mode=portrait" },
        { key: "landscape", name: "Facebook Ads", query: "mode=landscape" },
        { key: "amazon", name: "E-Commerce", query: "mode=amazon" },
        { key: "youtube", name: "YT Thumbnail", query: "mode=custom&width=1280&height=720" },
        { key: "linkedin", name: "LinkedIn Post", query: "mode=custom&width=1200&height=627" },
        { key: "pinterest", name: "Pinterest Pin", query: "mode=custom&width=1000&height=1500" },
        { key: "twitter", name: "X/Twitter Card", query: "mode=custom&width=1200&height=675" }
      ]
      
      const promises = modes.map(async (m) => {
        const res = await fetch(`${API_BASE}/smart-crop/${fileId}?${m.query}`)
        if (!res.ok) throw new Error(`${m.name} failed`)
        const data = await res.json()
        return { mode: m.name, key: m.key, url: `${API_BASE}/asset/${data.new_file_id}` }
      })
      
      const results = await Promise.all(promises)
      setBatchResults(results)
      toast({ title: "✅ Batch Formats Generated!" })
      
    } catch(e: any) {
      toast({ title: "Batch failed", description: e.message, variant: "destructive" })
    } finally {
      setBatchLoading(false)
    }
  }

  // --- CROP BOX INTERACTION LOGIC (Percentage based) ---
  const startDrag = (e: React.MouseEvent, handle?: string) => {
    e.preventDefault(); e.stopPropagation()
    const rect = imgRef.current?.getBoundingClientRect()
    if (!rect) return
    dragRef.current = {
      active: true, handle,
      startX: (e.clientX - rect.left) / rect.width * 100,
      startY: (e.clientY - rect.top) / rect.height * 100,
      startBox: { ...cropBox }
    }
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!dragRef.current?.active) return
    const rect = imgRef.current?.getBoundingClientRect()
    if (!rect) return
    const { handle, startX, startY, startBox } = dragRef.current
    const cx = Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100))
    const cy = Math.max(0, Math.min(100, (e.clientY - rect.top) / rect.height * 100))
    const dx = cx - startX
    const dy = cy - startY

    setCropBox(prev => {
      let b = { ...startBox }
      if (!handle) { // move center
        b.x = Math.max(0, Math.min(100 - b.width, b.x + dx))
        b.y = Math.max(0, Math.min(100 - b.height, b.y + dy))
      } else {
        if (handle.includes("w")) { b.x = Math.min(startBox.x + startBox.width - 5, Math.max(0, startBox.x + dx)); b.width = startBox.x + startBox.width - b.x }
        if (handle.includes("n")) { b.y = Math.min(startBox.y + startBox.height - 5, Math.max(0, startBox.y + dy)); b.height = startBox.y + startBox.height - b.y }
        if (handle.includes("e")) { b.width = Math.min(100 - b.x, Math.max(5, startBox.width + dx)) }
        if (handle.includes("s")) { b.height = Math.min(100 - b.y, Math.max(5, startBox.height + dy)) }
      }
      return b
    })
  }

  const onMouseUp = () => { dragRef.current = null }

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp) }
  }, [cropBox]) // hook dependencies

  // --- RENDERING / EXPORT ---
  const applyManualEdits = async () => {
    if (!originalUrl || !imgRef.current) return
    setProcessing(true)

    try {
      // 1. Render to local canvas applying CSS filters & Crop Box
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = originalUrl
      await new Promise(r => { img.onload = r })

      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      
      // Calculate real crop pixels based on percentage box
      const sx = isCropping ? (cropBox.x / 100) * img.width : 0
      const sy = isCropping ? (cropBox.y / 100) * img.height : 0
      const sWidth = isCropping ? (cropBox.width / 100) * img.width : img.width
      const sHeight = isCropping ? (cropBox.height / 100) * img.height : img.height

      canvas.height = sHeight

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
      // Note: Sharpness is handled as a visual hint here or could be a convolution filter
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight)

      const blob = await new Promise<Blob>((r) => canvas.toBlob(b => r(b!), "image/png"))

      // 2. Upload the new manual edit as a new file_id onto the backend!
      const formData = new FormData()
      formData.append("file", blob, "manual_edit.png")
      const res = await fetch(`${API_BASE}/upload-asset`, { method: "POST", body: formData })
      if (!res.ok) throw new Error("Commit edit failed")
      const data = await res.json()
      
      setFileId(data.file_id)
      setOriginalUrl(`${API_BASE}/asset/${data.file_id}`)
      resetAdjustments()
      toast({ title: "✅ Edits Applied & Saved!" })
      
    } catch (e: any) {
      toast({ title: "Edit failed", description: e.message, variant: "destructive" })
    } finally {
      setProcessing(false)
    }
  }

  const downloadImage = () => {
    if (!originalUrl) return
    const a = document.createElement("a"); a.href = originalUrl; a.download = `enhanced_${fileId}.png`; a.click()
  }

  return (
    <div className="flex flex-col h-full bg-muted/10 p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Enhance & Edit</h1>
          <p className="text-muted-foreground mt-1 text-sm">Upload images to AI upscale, manually edit Contrast/Brightness, and crop natively.</p>
        </div>
        {!fileId ? (
          <div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            <Button onClick={() => fileInputRef.current?.click()} disabled={loading} className="gap-2">
              <UploadCloud className="h-4 w-4" /> {loading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Upload New</Button>
            <Button size="sm" onClick={downloadImage} className="gap-2 gradient-primary">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        )}
      </div>

      {!fileId ? (
        <div className="flex-1 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center bg-card shadow-sm opacity-60">
           <ImageIcon className="h-16 w-16 mb-4 text-muted-foreground" />
           <p className="font-medium text-lg">No image loaded</p>
           <p className="text-sm text-muted-foreground">Upload a file from your computer to begin editing</p>
           <Button variant="secondary" className="mt-6" onClick={() => fileInputRef.current?.click()}>Browse Files</Button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-6 overflow-hidden">
          <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
          
          <div className="flex-1 flex flex-col bg-card rounded-xl shadow-sm border border-border p-4 relative overflow-auto items-center justify-center">
             <div className="absolute top-4 left-4 font-semibold text-sm bg-background/80 px-2 py-1 rounded backdrop-blur">
               Original
             </div>
             <img src={originalUrl!} className="max-w-full max-h-full object-contain pointer-events-none select-none" alt="original backdrop" />
          </div>

          <div className="flex-1 flex flex-col bg-card rounded-xl shadow-sm border border-border p-4 relative overflow-hidden items-center justify-center">
             <div className="absolute top-4 left-4 z-20 font-semibold text-sm bg-primary/90 text-primary-foreground px-2 py-1 rounded shadow-sm backdrop-blur">
               Live Preview
             </div>
             
             <div className="relative inline-block max-w-full max-h-full aspect-auto" onMouseDown={e => { if(isCropping) startDrag(e) }}>
               <img 
                 ref={imgRef}
                 src={originalUrl!} 
                 className={`max-w-full max-h-full object-contain ${isCropping ? 'opacity-80' : 'opacity-100'} select-none`}
                 style={{ 
                   filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                   transform: sharpness > 0 ? `scale(${1 + (sharpness/2000)})` : 'none' // Visual simulation of sharpness via slight scale/contrast boost
                 }}
                 alt="preview"
                 draggable={false}
               />
               
               {/* Crop Overlay */}
               {isCropping && (
                 <div
                   style={{
                     position: "absolute",
                     left: `${cropBox.x}%`,
                     top: `${cropBox.y}%`,
                     width: `${cropBox.width}%`,
                     height: `${cropBox.height}%`,
                     border: "2px dashed #ffffff",
                     boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
                     cursor: "move",
                   }}
                 >
                   {/* Grid lines inside crop box */}
                   <div className="absolute inset-0 flex flex-col justify-between border-t border-b border-white/30"><div className="w-full h-px bg-white/30 my-auto"/><div className="w-full h-px bg-white/30 my-auto"/></div>
                   <div className="absolute inset-0 flex justify-between border-l border-r border-white/30"><div className="w-px h-full bg-white/30 mx-auto"/><div className="w-px h-full bg-white/30 mx-auto"/></div>

                   {/* Corner Handles */}
                   <div style={{ position:"absolute", top:-6, left:-6, width:12, height:12, background:"white", cursor:"nw-resize" }} onMouseDown={(e) => startDrag(e, "nw")} />
                   <div style={{ position:"absolute", top:-6, right:-6, width:12, height:12, background:"white", cursor:"ne-resize" }} onMouseDown={(e) => startDrag(e, "ne")} />
                   <div style={{ position:"absolute", bottom:-6, left:-6, width:12, height:12, background:"white", cursor:"sw-resize" }} onMouseDown={(e) => startDrag(e, "sw")} />
                   <div style={{ position:"absolute", bottom:-6, right:-6, width:12, height:12, background:"white", cursor:"se-resize" }} onMouseDown={(e) => startDrag(e, "se")} />
                   
                   {/* Edge Handles */}
                   <div style={{ position:"absolute", top:-6, left:"50%", transform:"translateX(-50%)", width:12, height:12, background:"white", cursor:"n-resize" }} onMouseDown={(e) => startDrag(e, "n")} />
                   <div style={{ position:"absolute", bottom:-6, left:"50%", transform:"translateX(-50%)", width:12, height:12, background:"white", cursor:"s-resize" }} onMouseDown={(e) => startDrag(e, "s")} />
                   <div style={{ position:"absolute", left:-6, top:"50%", transform:"translateY(-50%)", width:12, height:12, background:"white", cursor:"w-resize" }} onMouseDown={(e) => startDrag(e, "w")} />
                   <div style={{ position:"absolute", right:-6, top:"50%", transform:"translateY(-50%)", width:12, height:12, background:"white", cursor:"e-resize" }} onMouseDown={(e) => startDrag(e, "e")} />
                 </div>
               )}
             </div>

             {/* UI Loader */}
             {processing && (
               <div className="absolute inset-0 bg-black/40 backdrop-blur-sm shadow z-50 flex items-center justify-center rounded-xl">
                 <div className="bg-white text-black font-semibold px-4 py-2 rounded-full flex gap-2 shadow-2xl items-center animate-pulse">
                   <Sparkles className="h-4 w-4" /> Processing...
                 </div>
               </div>
             )}
          </div>
          
          <div className="w-80 shrink-0 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
             
             <div className="p-4 border-b border-border bg-muted/10 space-y-2">
               <Label className="uppercase text-[10px] font-bold text-muted-foreground tracking-wider">Mistral AI Engine</Label>
               <div className="grid grid-cols-2 gap-2">
                 <Button size="sm" onClick={runAIEnhance} disabled={processing} className="h-20 flex-col gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 border-0 text-white shadow hover:opacity-90">
                   <Wand2 className="h-5 w-5" />
                   <span className="text-xs">Smart Enhance</span>
                 </Button>
                 <Button size="sm" onClick={runAISmartCrop} disabled={processing} className="h-20 flex-col gap-2 bg-gradient-to-br from-indigo-600 to-purple-600 border-0 text-white shadow hover:opacity-90">
                   <Sparkles className="h-5 w-5" />
                   <span className="text-xs">Layout Crop</span>
                 </Button>
               </div>
               <Button size="sm" onClick={generateBatchFormats} disabled={batchLoading || processing} className="w-full mt-2 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow">
                 <Layers className="h-4 w-4 mr-2" />
                 {batchLoading ? "Generating Batch..." : "Generate All Formats (Batch)"}
               </Button>
               <p className="text-xs text-muted-foreground pt-1 leading-snug">AI tools automatically process through the backend bypassing manual sliders.</p>
             </div>

             <div className="flex-1 p-5 overflow-y-auto space-y-6">
               <div className="space-y-4">
                 <div className="flex items-center justify-between">
                   <Label className="font-semibold flex items-center gap-2"><Crop className="h-4 w-4"/> Manual Crop</Label>
                   <Button size="sm" variant={isCropping ? "default" : "secondary"} className="h-7 text-xs" onClick={() => setIsCropping(!isCropping)}>
                     {isCropping ? "Exit Tool" : "Crop Tool"}
                   </Button>
                 </div>
               </div>

               <div className="space-y-5 pt-4 border-t border-border">
                 <Label className="font-semibold mb-2 block">Color Metrics</Label>
                 
                 <div className="space-y-2">
                   <div className="flex justify-between text-xs"><span>Brightness</span><span className="font-mono text-muted-foreground">{brightness}%</span></div>
                   <Slider min={0} max={200} step={1} value={[brightness]} onValueChange={([v]) => setBrightness(v)} />
                 </div>
                 
                 <div className="space-y-2">
                   <div className="flex justify-between text-xs"><span>Contrast</span><span className="font-mono text-muted-foreground">{contrast}%</span></div>
                   <Slider min={0} max={200} step={1} value={[contrast]} onValueChange={([v]) => setContrast(v)} />
                 </div>

                 <div className="space-y-2">
                   <div className="flex justify-between text-xs"><span>Saturation</span><span className="font-mono text-muted-foreground">{saturation}%</span></div>
                   <Slider min={0} max={200} step={1} value={[saturation]} onValueChange={([v]) => setSaturation(v)} />
                 </div>

                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                       <Label className="text-sm font-semibold">Sharpness Engine</Label>
                       <p className="text-[10px] text-muted-foreground">Toggle AI sharpening focus</p>
                     </div>
                     <Switch checked={isSharpnessEnabled} onCheckedChange={setIsSharpnessEnabled} />
                   </div>
                   
                   {isSharpnessEnabled && (
                     <div className="space-y-2 pt-1 animate-in slide-in-from-top-2 duration-300">
                       <div className="flex justify-between text-xs"><span>Intensity</span><span className="font-mono text-muted-foreground">{sharpness}%</span></div>
                       <Slider min={0} max={100} step={1} value={[sharpness]} onValueChange={([v]) => setSharpness(v)} />
                     </div>
                   )}
                 </div>
                 
                 <div className="flex justify-start pt-1">
                   <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground px-0" onClick={resetAdjustments}>
                     <RotateCcw className="h-3 w-3 mr-1" /> Reset All Metrics
                   </Button>
                 </div>
               </div>

             </div>

             <div className="p-4 border-t border-border bg-muted/20">
               <Button className="w-full font-semibold" onClick={applyManualEdits} disabled={processing || (brightness===100 && contrast===100 && saturation===100 && !isCropping)}>
                 Apply Visual Overrides
               </Button>
               <p className="text-[10px] text-center text-muted-foreground mt-2">Commits manual changes back to the database as a new file ID.</p>
             </div>

          </div>
        </div>

        {/* BATCH GENERATED GRID */}
        {batchResults.length > 0 && (
          <div className="w-full bg-card rounded-xl shadow-sm border border-border p-4 overflow-x-auto shrink-0 mb-2">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> Generated Formats Batch</h3>
            <div className="flex gap-4 min-w-max">
               {batchResults.map(r => (
                 <div key={r.key} className="space-y-2 w-[220px]">
                    <div className="bg-muted rounded p-3 flex items-center justify-center relative aspect-square border-2 border-transparent hover:border-primary/50 transition-colors">
                       <img src={r.url} className="w-full h-full object-contain" alt={r.mode} />
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-medium">{r.mode}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => { const a = document.createElement("a"); a.href=r.url; a.download=`${r.key}_export.png`; a.click() }}>
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        </div>
      )}
    </div>
  )
}

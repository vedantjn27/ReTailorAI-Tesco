"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ImagePlus, UploadCloud, RefreshCw, Download, FileText, X, PenTool } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PosterGeneratorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const clearFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleGenerate = async () => {
    if (!file && !prompt.trim()) {
      setError("Please provide either a document or a prompt describing your organization.")
      return
    }

    setError(null)
    setIsGenerating(true)
    setResultImage(null)

    try {
      const formData = new FormData()
      if (file) {
        formData.append("file", file)
      }
      if (prompt.trim()) {
        formData.append("prompt", prompt)
      }

      const res = await fetch("http://localhost:8000/generate-poster", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Generation failed")
      }

      const data = await res.json()
      if (data.status === "success" && data.image_url) {
        setResultImage(data.image_url)
      } else {
        throw new Error("Unexpected response from server")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during generation.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
      if (!resultImage) return
      
      try {
        const response = await fetch(resultImage)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'generated-poster.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (err) {
        console.error("Download failed:", err)
      }
  }

  const handleEdit = async () => {
    if (!resultImage) return
    
    try {
      setIsGenerating(true)
      // 1. Create a new Editor project
      const projRes = await fetch("http://localhost:8000/editor/create-project?name=AI Generated Poster&width=1080&height=1080", { method: "POST" })
      if (!projRes.ok) throw new Error("Failed to create project")
      const projData = await projRes.json()
      const projectId = projData.project_id

      // 2. Fetch image blob
      const response = await fetch(resultImage)
      const blob = await response.blob()
      const fileText = new File([blob], "generated-poster.png", { type: "image/png" })

      // 3. Add image layer to the new project
      const formData = new FormData()
      formData.append("file", fileText)
      
      const layerRes = await fetch(`http://localhost:8000/editor/${projectId}/add-image-layer?width=1080&height=1080&x=0&y=0`, {
          method: "POST",
          body: formData
      })
      if (!layerRes.ok) throw new Error("Failed to add image to project")

      // 4. Navigate to editor
      router.push(`/editor?project=${projectId}`)
    } catch (err) {
      console.error("Failed to push to editor:", err)
      setError("Failed to open image in editor.")
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ImagePlus className="w-8 h-8 text-primary" />
          AI Poster Generator
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Upload your organization's document or describe it to automatically create a tailored promotional banner.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Label className="text-lg font-semibold mb-4 block">1. Organization Details</Label>
              
              <div className="space-y-4">
                <div>
                  <Label>Upload Source Material (PDF, DOCX, TXT)</Label>
                  <div 
                    className={`mt-2 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${file ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {!file ? (
                      <>
                        <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium mb-1">Drag and drop your file here</p>
                        <p className="text-xs text-muted-foreground mb-4">or click to browse from your computer</p>
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                          Choose File
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center w-full">
                        <div className="flex items-center gap-3 bg-background p-3 rounded-md border w-full shrink-0">
                          <FileText className="w-6 h-6 text-primary flex-shrink-0" />
                          <div className="truncate flex-1">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={clearFile}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm">AND / OR</span>
                  <div className="flex-grow border-t border-border"></div>
                </div>

                <div>
                  <Label>Additional Context or Guidance</Label>
                  <Textarea 
                    placeholder="Enter target audience, visual style, color preferences, or key message..."
                    className="mt-2 resize-none h-32"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            size="lg" 
            className="w-full font-semibold text-lg" 
            onClick={handleGenerate}
            disabled={isGenerating || (!file && !prompt.trim())}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                Generating Poster...
              </>
            ) : (
              <>
                <ImagePlus className="mr-2 h-5 w-5" />
                Generate Poster
              </>
            )}
          </Button>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        <div className="h-full">
          <Card className="h-full flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg font-semibold">2. Live Results</Label>
                {resultImage && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleEdit} disabled={isGenerating}>
                      <PenTool className="mr-2 h-4 w-4" />
                      Edit in Studio
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload} disabled={isGenerating}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex-1 bg-muted/30 rounded-xl border border-border flex items-center justify-center overflow-hidden min-h-[400px] relative">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center animate-pulse text-muted-foreground">
                    <RefreshCw className="w-10 h-10 mb-4 animate-spin opacity-50" />
                    <p className="font-medium animate-pulse">Analyzing text and generating visuals...</p>
                  </div>
                ) : resultImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={resultImage} 
                    alt="Generated Poster" 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                  />
                ) : (
                  <div className="text-center text-muted-foreground p-6">
                    <ImagePlus className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Your generated poster will appear here.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

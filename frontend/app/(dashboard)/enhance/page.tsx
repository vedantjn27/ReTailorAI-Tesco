"use client"

import { useState } from "react"
import { Wand2, Sparkles, Crop, Grid3x3, Zap, Download, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

export default function EnhancePage() {
  const [fileId, setFileId] = useState("")
  const [processing, setProcessing] = useState(false)
  const [resultImage, setResultImage] = useState<{ fileId: string; url: string } | null>(null)
  const [resizeResults, setResizeResults] = useState<any[]>([])
  const { toast } = useToast()

  const handleSmartEnhance = async (upscale = false) => {
    if (!fileId) {
      toast({
        title: "File ID required",
        description: "Please enter a file ID to enhance",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)
    try {
      const result = await apiClient.smartEnhance(fileId, upscale)
      setResultImage({
        fileId: result.new_file_id,
        url: apiClient.getAssetUrl(result.new_file_id),
      })

      toast({
        title: "Enhancement complete",
        description: upscale ? "Image enhanced and upscaled 2x" : "Image enhanced with AI",
      })
    } catch (error) {
      toast({
        title: "Enhancement failed",
        description: "Could not enhance image",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleSmartCrop = async (mode: string) => {
    if (!fileId) {
      toast({
        title: "File ID required",
        description: "Please enter a file ID to crop",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)
    try {
      const result = await apiClient.smartCrop(fileId, mode as any)
      setResultImage({
        fileId: result.new_file_id,
        url: apiClient.getAssetUrl(result.new_file_id),
      })

      toast({
        title: "Crop complete",
        description: `Image cropped to ${mode} format`,
      })
    } catch (error) {
      toast({
        title: "Crop failed",
        description: "Could not crop image",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleAutoResize = async () => {
    if (!fileId) {
      toast({
        title: "File ID required",
        description: "Please enter a file ID to resize",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)
    try {
      const result = await apiClient.autoResize(fileId, false)
      const resultsWithUrls = result.files.map((file) => ({
        ...file,
        url: apiClient.getAssetUrl(file.file_id),
      }))
      setResizeResults(resultsWithUrls)

      toast({
        title: "Resize complete",
        description: `Generated ${result.files.length} format variants`,
      })
    } catch (error) {
      toast({
        title: "Resize failed",
        description: "Could not resize images",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-card via-accent/5 to-card px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Smart Enhancement</h1>
            <p className="mt-1 text-muted-foreground">AI-powered image optimization and multi-channel resizing</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-success/10 px-3 py-1">
              <span className="text-sm font-medium text-success">AI Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-6xl">
          <Tabs defaultValue="enhance" className="w-full">
            <TabsList className="grid w-full max-w-xl grid-cols-3">
              <TabsTrigger value="enhance" className="gap-2">
                <Wand2 className="h-4 w-4" />
                Enhance
              </TabsTrigger>
              <TabsTrigger value="crop" className="gap-2">
                <Crop className="h-4 w-4" />
                Smart Crop
              </TabsTrigger>
              <TabsTrigger value="resize" className="gap-2">
                <Zap className="h-4 w-4" />
                Multi-Channel
              </TabsTrigger>
            </TabsList>

            {/* Enhance Tab */}
            <TabsContent value="enhance" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Input</CardTitle>
                    <CardDescription>Enter file ID to enhance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="file-id-enhance" className="text-sm font-medium">
                        File ID
                      </label>
                      <input
                        id="file-id-enhance"
                        type="text"
                        placeholder="Enter file ID..."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={fileId}
                        onChange={(e) => setFileId(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full gap-2" onClick={() => handleSmartEnhance(false)} disabled={processing}>
                        <Wand2 className="h-4 w-4" />
                        {processing ? "Processing..." : "Smart Enhance"}
                      </Button>
                      <Button
                        className="w-full gap-2 bg-transparent"
                        variant="outline"
                        onClick={() => handleSmartEnhance(true)}
                        disabled={processing}
                      >
                        <Sparkles className="h-4 w-4" />
                        {processing ? "Processing..." : "Enhance + Upscale 2x"}
                      </Button>
                    </div>

                    {resultImage && (
                      <div className="space-y-3">
                        <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                          <img
                            src={resultImage.url || "/placeholder.svg"}
                            alt="Enhanced"
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">Result File ID:</p>
                              <p className="mt-1 font-mono text-xs text-muted-foreground truncate">
                                {resultImage.fileId}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  navigator.clipboard.writeText(resultImage.fileId)
                                  toast({ title: "Copied!", description: "File ID copied" })
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  const link = document.createElement("a")
                                  link.href = resultImage.url
                                  link.download = `enhanced_${resultImage.fileId}.png`
                                  link.click()
                                }}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Enhancement Features</CardTitle>
                    <CardDescription>What Smart Enhance does</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Auto White Balance</h4>
                        <p className="text-sm text-muted-foreground">
                          Corrects color temperature using gray-world algorithm
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10">
                        <Wand2 className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Shadow/Highlight Recovery</h4>
                        <p className="text-sm text-muted-foreground">Balances exposure in dark and bright areas</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-chart-2/10">
                        <Grid3x3 className="h-4 w-4 text-chart-2" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Smart Sharpening</h4>
                        <p className="text-sm text-muted-foreground">Adaptive sharpness based on blur detection</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-chart-3/10">
                        <Sparkles className="h-4 w-4 text-chart-3" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Noise Reduction</h4>
                        <p className="text-sm text-muted-foreground">Bilateral filtering preserves edges</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Crop Tab */}
            <TabsContent value="crop" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Input</CardTitle>
                    <CardDescription>Enter file ID and select crop mode</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="file-id-crop" className="text-sm font-medium">
                        File ID
                      </label>
                      <input
                        id="file-id-crop"
                        type="text"
                        placeholder="Enter file ID..."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={fileId}
                        onChange={(e) => setFileId(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 bg-transparent"
                        onClick={() => handleSmartCrop("square")}
                        disabled={processing}
                      >
                        <Crop className="h-5 w-5" />
                        <span className="text-xs">Square (1:1)</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 bg-transparent"
                        onClick={() => handleSmartCrop("portrait")}
                        disabled={processing}
                      >
                        <Crop className="h-5 w-5" />
                        <span className="text-xs">Portrait (4:5)</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 bg-transparent"
                        onClick={() => handleSmartCrop("landscape")}
                        disabled={processing}
                      >
                        <Crop className="h-5 w-5" />
                        <span className="text-xs">Landscape (16:9)</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col gap-2 bg-transparent"
                        onClick={() => handleSmartCrop("amazon")}
                        disabled={processing}
                      >
                        <Crop className="h-5 w-5" />
                        <span className="text-xs">Amazon</span>
                      </Button>
                    </div>

                    {resultImage && (
                      <div className="space-y-3">
                        <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
                          <img
                            src={resultImage.url || "/placeholder.svg"}
                            alt="Cropped"
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">Result File ID:</p>
                              <p className="mt-1 font-mono text-xs text-muted-foreground truncate">
                                {resultImage.fileId}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  navigator.clipboard.writeText(resultImage.fileId)
                                  toast({ title: "Copied!", description: "File ID copied" })
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  const link = document.createElement("a")
                                  link.href = resultImage.url
                                  link.download = `cropped_${resultImage.fileId}.png`
                                  link.click()
                                }}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Smart Crop Features</CardTitle>
                    <CardDescription>AI-powered intelligent cropping</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="rounded-lg border border-border p-3">
                      <h4 className="font-medium">Subject Detection</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Uses AI to detect the main subject and crop around it
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <h4 className="font-medium">Focal Point Preservation</h4>
                      <p className="mt-1 text-sm text-muted-foreground">Ensures important elements remain in frame</p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <h4 className="font-medium">Platform Optimization</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Pre-configured formats for major e-commerce platforms
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Resize Tab */}
            <TabsContent value="resize" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Multi-Channel Auto-Resize</CardTitle>
                  <CardDescription>Generate all platform formats in one click</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="file-id-resize" className="text-sm font-medium">
                      File ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="file-id-resize"
                        type="text"
                        placeholder="Enter file ID..."
                        className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={fileId}
                        onChange={(e) => setFileId(e.target.value)}
                      />
                      <Button onClick={handleAutoResize} disabled={processing}>
                        {processing ? "Processing..." : "Generate All Formats"}
                      </Button>
                    </div>
                  </div>

                  {resizeResults.length > 0 && (
                    <div className="mt-6">
                      <h4 className="mb-3 font-medium">Generated Formats ({resizeResults.length})</h4>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {resizeResults.map((result, index) => (
                          <Card key={index} className="overflow-hidden">
                            <div className="aspect-square overflow-hidden bg-muted">
                              <img
                                src={result.url || "/placeholder.svg"}
                                alt={result.channel}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium capitalize truncate">{result.channel.replace(/_/g, " ")}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {result.width} x {result.height}px
                                  </p>
                                  <p className="text-xs font-mono text-muted-foreground truncate mt-1">
                                    {result.file_id}
                                  </p>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0"
                                    onClick={() => {
                                      navigator.clipboard.writeText(result.file_id)
                                      toast({ title: "Copied!", description: "File ID copied" })
                                    }}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0"
                                    onClick={() => {
                                      const link = document.createElement("a")
                                      link.href = result.url
                                      link.download = `${result.channel}_${result.file_id}.png`
                                      link.click()
                                    }}
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 rounded-lg bg-muted/30 p-4">
                    <h4 className="font-medium">Supported Platforms</h4>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>Instagram Square</div>
                      <div>Instagram Portrait</div>
                      <div>Amazon Listing</div>
                      <div>Thumbnail</div>
                      <div>Website Banner</div>
                      <div>Flipkart Listing</div>
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

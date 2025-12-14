"use client"

import { useState } from "react"
import { Download, FileArchive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

export default function ExportPage() {
  const [fileIds, setFileIds] = useState("")
  const [format, setFormat] = useState<"zip" | "jpeg" | "png" | "webp">("zip")
  const [quality, setQuality] = useState(85)
  const [resizeWidth, setResizeWidth] = useState<number | undefined>()
  const [resizeHeight, setResizeHeight] = useState<number | undefined>()
  const [includeResize, setIncludeResize] = useState(false)
  const [exporting, setExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    if (!fileIds.trim()) {
      toast({
        title: "File IDs required",
        description: "Please enter at least one file ID",
        variant: "destructive",
      })
      return
    }

    const ids = fileIds
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id)

    if (ids.length === 0) {
      toast({
        title: "Invalid file IDs",
        description: "Please check your file IDs",
        variant: "destructive",
      })
      return
    }

    setExporting(true)
    try {
      const blob = await apiClient.batchExport(ids, format, {
        quality,
        resizeWidth: includeResize ? resizeWidth : undefined,
        resizeHeight: includeResize ? resizeHeight : undefined,
      })

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = format === "zip" ? "batch_export.zip" : `export.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Export complete",
        description: `Successfully exported ${ids.length} file(s)`,
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export files",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Batch Export</h1>
            <p className="mt-1 text-muted-foreground">Export multiple assets with optimization</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Export Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Export Settings</CardTitle>
                <CardDescription>Configure output format and quality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="file-ids">File IDs (comma-separated)</Label>
                  <textarea
                    id="file-ids"
                    placeholder="file_id_1, file_id_2, file_id_3..."
                    className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                    value={fileIds}
                    onChange={(e) => setFileIds(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Enter file IDs separated by commas</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format">Output Format</Label>
                  <Select value={format} onValueChange={(v: any) => setFormat(v)}>
                    <SelectTrigger id="format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zip">ZIP Archive (Multiple Files)</SelectItem>
                      <SelectItem value="png">PNG (Lossless)</SelectItem>
                      <SelectItem value="jpeg">JPEG (Compressed)</SelectItem>
                      <SelectItem value="webp">WebP (Modern)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {format !== "png" && (
                  <div className="space-y-2">
                    <Label htmlFor="quality">Quality: {quality}%</Label>
                    <Slider
                      id="quality"
                      value={[quality]}
                      onValueChange={([v]) => setQuality(v)}
                      min={1}
                      max={100}
                      step={1}
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="resize"
                      checked={includeResize}
                      onCheckedChange={(checked) => setIncludeResize(!!checked)}
                    />
                    <Label htmlFor="resize" className="font-normal">
                      Resize during export
                    </Label>
                  </div>

                  {includeResize && (
                    <div className="grid grid-cols-2 gap-4 pl-6">
                      <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input
                          id="width"
                          type="number"
                          placeholder="1920"
                          value={resizeWidth || ""}
                          onChange={(e) => setResizeWidth(Number.parseInt(e.target.value) || undefined)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="1080"
                          value={resizeHeight || ""}
                          onChange={(e) => setResizeHeight(Number.parseInt(e.target.value) || undefined)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Button className="w-full gap-2" onClick={handleExport} disabled={exporting}>
                  <Download className="h-4 w-4" />
                  {exporting ? "Exporting..." : "Export Files"}
                </Button>
              </CardContent>
            </Card>

            {/* Info Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Export Features</CardTitle>
                  <CardDescription>What you get with batch export</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <FileArchive className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Batch Processing</h4>
                      <p className="text-sm text-muted-foreground">Export multiple files at once with single click</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10">
                      <Download className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Format Conversion</h4>
                      <p className="text-sm text-muted-foreground">Convert to JPEG, PNG, or WebP on export</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-chart-2/10">
                      <Download className="h-4 w-4 text-chart-2" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Smart Optimization</h4>
                      <p className="text-sm text-muted-foreground">Automatic compression and size optimization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Format Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">PNG</span>
                    <Badge variant="secondary">Lossless, large files</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">JPEG</span>
                    <Badge variant="secondary">Best compatibility</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">WebP</span>
                    <Badge variant="secondary">Modern, efficient</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ZIP</span>
                    <Badge variant="secondary">Multiple files</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

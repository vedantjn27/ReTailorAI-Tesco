"use client"
import { useState, useCallback, useRef, useEffect } from "react"
import { Upload, Search, Filter, Wand2, Scissors, Trash2, FileImage, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

// API Client Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Demo Mode Mock Data
const generateMockAssets = (): Asset[] => [
  {
    fileId: "demo_asset_1",
    filename: "Product Photo 1.jpg",
    uploadedAt: new Date(Date.now() - 86400000 * 2),
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    type: "image",
  },
  {
    fileId: "demo_asset_2",
    filename: "Enhanced Product.jpg",
    uploadedAt: new Date(Date.now() - 86400000),
    thumbnail: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    type: "enhanced",
  },
  {
    fileId: "demo_asset_3",
    filename: "Cropped Square.jpg",
    uploadedAt: new Date(Date.now() - 3600000),
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    type: "cropped",
  },
  {
    fileId: "demo_asset_4",
    filename: "Watch Collection.jpg",
    uploadedAt: new Date(Date.now() - 7200000),
    thumbnail: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
    type: "image",
  },
  {
    fileId: "demo_asset_5",
    filename: "Headphones Pro.jpg",
    uploadedAt: new Date(Date.now() - 10800000),
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    type: "image",
  },
]

const mockApiClient = {
  uploadAsset: async (file: File): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const fileId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    return {
      file_id: fileId,
      filename: file.name,
    }
  },
  
  listAssets: async (): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return generateMockAssets()
  },
  
  removeBackground: async (fileId: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return {
      new_file_id: `demo_nobg_${Date.now()}`,
      message: "Background removed successfully",
    }
  },
  
  smartEnhance: async (fileId: string, sharpness: number, contrast: number, brightness: number): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return {
      new_file_id: `demo_enhanced_${Date.now()}`,
      message: "Image enhanced successfully",
    }
  },
  
  smartCrop: async (fileId: string, mode: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 1200))
    return {
      new_file_id: `demo_cropped_${mode}_${Date.now()}`,
      message: `Image cropped to ${mode} format`,
    }
  },
  
  deleteAsset: async (fileId: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { success: true }
  },
  
  getAssetUrl: (fileId: string): string => {
    // Return placeholder images for demo mode
    const demoUrls: { [key: string]: string } = {
      demo_asset_1: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      demo_asset_2: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
      demo_asset_3: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      demo_asset_4: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
      demo_asset_5: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    }
    return demoUrls[fileId] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
  },
}

const realApiClient = {
  uploadAsset: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    
    const response = await fetch(`${API_BASE_URL}/upload-asset`, {
      method: "POST",
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }
    
    return response.json()
  },
  
  listAssets: async () => {
    const response = await fetch(`${API_BASE_URL}/assets`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch assets: ${response.statusText}`)
    }
    
    return response.json()
  },
  
  removeBackground: async (fileId: string) => {
    const response = await fetch(`${API_BASE_URL}/remove-bg/${fileId}`)
    
    if (!response.ok) {
      throw new Error(`Remove background failed: ${response.statusText}`)
    }
    
    return response.json()
  },
  
  smartEnhance: async (fileId: string, sharpness = 1.2, contrast = 1.15, brightness = 1.1) => {
    const response = await fetch(
      `${API_BASE_URL}/enhance/${fileId}?sharpness=${sharpness}&contrast=${contrast}&brightness=${brightness}`
    )
    
    if (!response.ok) {
      throw new Error(`Enhancement failed: ${response.statusText}`)
    }
    
    return response.json()
  },
  
  smartCrop: async (fileId: string, mode: "square" | "portrait" | "landscape") => {
    const response = await fetch(`${API_BASE_URL}/crop/${fileId}?mode=${mode}`)
    
    if (!response.ok) {
      throw new Error(`Crop failed: ${response.statusText}`)
    }
    
    return response.json()
  },
  
  deleteAsset: async (fileId: string) => {
    const response = await fetch(`${API_BASE_URL}/asset/${fileId}`, {
      method: "DELETE",
    })
    
    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`)
    }
    
    return response.json()
  },
  
  getAssetUrl: (fileId: string) => {
    return `${API_BASE_URL}/asset/${fileId}`
  },
}

interface Asset {
  fileId: string
  filename: string
  uploadedAt: Date
  thumbnail?: string
  type: "image" | "enhanced" | "cropped"
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [demoMode, setDemoMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("demo_mode") === "true"
    }
    return false
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emptyStateInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Get the appropriate API client based on demo mode
  const apiClient = demoMode ? mockApiClient : realApiClient

  // Check demo mode from localStorage and update if needed
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDemoMode = localStorage.getItem("demo_mode") === "true"
      if (isDemoMode !== demoMode) {
        setDemoMode(isDemoMode)
      }
      console.log("[Assets] Demo mode initialized:", isDemoMode)
    }
  }, [])

  // Load assets on mount or when demo mode changes
  useEffect(() => {
    loadAssets()
  }, [demoMode])

  const loadAssets = async () => {
    // In demo mode, don't make the API call at all - just use mock data
    if (demoMode) {
      try {
        setLoading(true)
        const result = await mockApiClient.listAssets()
        console.log("[Assets] Demo assets loaded:", result)
        
        const loadedAssets: Asset[] = result.map((asset: any) => ({
          fileId: asset.fileId,
          filename: asset.filename,
          uploadedAt: asset.uploadedAt,
          thumbnail: asset.thumbnail,
          type: asset.type,
        }))
        
        setAssets(loadedAssets)
      } catch (error) {
        console.log("[Assets] Demo mode error (ignored):", error)
        setAssets([])
      } finally {
        setLoading(false)
      }
      return
    }

    // Real backend mode
    try {
      setLoading(true)
      const result = await realApiClient.listAssets()
      console.log("[Assets] Assets loaded:", result)
      
      // Check if result is an array or has an assets property
      let assetsData = Array.isArray(result) ? result : result.assets || []
      
      // Transform the response to match our Asset interface
      const loadedAssets: Asset[] = assetsData.map((asset: any) => ({
        fileId: asset.fileId || asset.file_id || asset._id,
        filename: asset.filename || "Unnamed Asset",
        uploadedAt: new Date(asset.uploadedAt || asset.uploaded_at || Date.now()),
        thumbnail: asset.thumbnail || realApiClient.getAssetUrl(asset.fileId || asset.file_id || asset._id),
        type: asset.type || "image",
      }))
      
      console.log("[Assets] Transformed assets:", loadedAssets)
      setAssets(loadedAssets)
    } catch (error) {
      console.error("Failed to load assets:", error)
      toast({
        title: "Failed to load assets",
        description: error instanceof Error ? error.message : "Could not load assets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      setUploading(true)
      const uploadPromises = Array.from(files).map(async (file) => {
        try {
          console.log("[Assets] Uploading file:", file.name)
          const result = await apiClient.uploadAsset(file)
          console.log("[Assets] Upload result:", result)

          // Create object URL for demo mode preview
          const previewUrl = demoMode ? URL.createObjectURL(file) : apiClient.getAssetUrl(result.file_id)

          const newAsset: Asset = {
            fileId: result.file_id,
            filename: result.filename,
            uploadedAt: new Date(),
            thumbnail: previewUrl,
            type: "image",
          }

          toast({
            title: "Upload Successful",
            description: (
              <div className="space-y-2">
                <div>{file.name} uploaded {demoMode ? "(Demo Mode)" : ""}</div>
                <div
                  className="text-xs font-mono bg-muted p-2 rounded cursor-pointer hover:bg-muted/80"
                  onClick={() => {
                    navigator.clipboard.writeText(result.file_id)
                    toast({
                      title: "Copied!",
                      description: "File ID copied to clipboard",
                    })
                  }}
                >
                  {result.file_id}
                </div>
              </div>
            ),
          })

          return newAsset
        } catch (error) {
          console.error("[Assets] Upload failed:", error)
          
          // In demo mode, still create a mock asset
          if (demoMode) {
            const mockAsset: Asset = {
              fileId: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              filename: file.name,
              uploadedAt: new Date(),
              thumbnail: URL.createObjectURL(file),
              type: "image",
            }
            
            toast({
              title: "Upload Successful (Demo)",
              description: `${file.name} uploaded in demo mode`,
            })
            
            return mockAsset
          }
          
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
            variant: "destructive",
          })
          return null
        }
      })

      const results = await Promise.all(uploadPromises)
      const successfulUploads = results.filter((asset): asset is Asset => asset !== null)
      setAssets((prev) => [...successfulUploads, ...prev])
      setUploading(false)
    },
    [toast, apiClient, demoMode]
  )

  const handleRemoveBackground = async (fileId: string) => {
    setProcessing(true)
    try {
      console.log("[Assets] Removing background for:", fileId)
      const result = await apiClient.removeBackground(fileId)
      console.log("[Assets] Remove BG result:", result)

      const newAsset: Asset = {
        fileId: result.new_file_id,
        filename: "Background Removed",
        uploadedAt: new Date(),
        thumbnail: demoMode ? "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop" : apiClient.getAssetUrl(result.new_file_id),
        type: "enhanced",
      }

      setAssets((prev) => [newAsset, ...prev])
      toast({
        title: "Background removed",
        description: `New asset created with transparent background ${demoMode ? "(Demo Mode)" : ""}`,
      })
    } catch (error) {
      if (!demoMode) {
        toast({
          title: "Processing failed",
          description: error instanceof Error ? error.message : "Could not remove background",
          variant: "destructive",
        })
      }
    } finally {
      setProcessing(false)
      setSelectedAsset(null)
    }
  }

  const handleSmartEnhance = async (fileId: string) => {
    setProcessing(true)
    try {
      const result = await apiClient.smartEnhance(fileId, 1.2, 1.15, 1.1)
      const newAsset: Asset = {
        fileId: result.new_file_id,
        filename: "Smart Enhanced",
        uploadedAt: new Date(),
        thumbnail: demoMode ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" : apiClient.getAssetUrl(result.new_file_id),
        type: "enhanced",
      }

      setAssets((prev) => [newAsset, ...prev])
      toast({
        title: "Enhancement complete",
        description: `Image enhanced with AI ${demoMode ? "(Demo Mode)" : ""}`,
      })
    } catch (error) {
      if (!demoMode) {
        toast({
          title: "Enhancement failed",
          description: error instanceof Error ? error.message : "Could not enhance image",
          variant: "destructive",
        })
      }
    } finally {
      setProcessing(false)
      setSelectedAsset(null)
    }
  }

  const handleSmartCrop = async (fileId: string, mode: "square" | "portrait" | "landscape") => {
    setProcessing(true)
    try {
      const result = await apiClient.smartCrop(fileId, mode)
      const newAsset: Asset = {
        fileId: result.new_file_id,
        filename: `Cropped (${mode})`,
        uploadedAt: new Date(),
        thumbnail: demoMode ? "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop" : apiClient.getAssetUrl(result.new_file_id),
        type: "cropped",
      }

      setAssets((prev) => [newAsset, ...prev])
      toast({
        title: "Crop complete",
        description: `Image cropped to ${mode} format ${demoMode ? "(Demo Mode)" : ""}`,
      })
    } catch (error) {
      if (!demoMode) {
        toast({
          title: "Crop failed",
          description: error instanceof Error ? error.message : "Could not crop image. This feature may not be available on your backend yet.",
          variant: "destructive",
        })
      }
    } finally {
      setProcessing(false)
      setSelectedAsset(null)
    }
  }

  const handleDelete = async (fileId: string) => {
    try {
      await apiClient.deleteAsset(fileId)
      setAssets((prev) => prev.filter((asset) => asset.fileId !== fileId))
      setSelectedAsset(null)
      toast({
        title: "Asset deleted",
        description: `Asset removed from library ${demoMode ? "(Demo Mode)" : ""}`,
      })
    } catch (error) {
      if (!demoMode) {
        toast({
          title: "Delete failed",
          description: error instanceof Error ? error.message : "Could not delete asset",
          variant: "destructive",
        })
      }
    }
  }

  const filteredAssets = assets.filter((asset) =>
    asset.filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asset Library</h1>
            <p className="text-muted-foreground">
              Manage and enhance your product images with AI
              {demoMode && <span className="ml-2 text-chart-3 font-medium"></span>}
            </p>
          </div>
          <div>
            <Button
              size="lg"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Assets"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
          </div>
        </div>

        

        {/* Toolbar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Asset Grid */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-muted-foreground">Loading assets...</div>
            </div>
          ) : assets.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <FileImage className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No assets yet</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  Upload your first product images to unlock AI-powered enhancements and smart
                  cropping
                </p>
                <Button onClick={() => emptyStateInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First Asset
                </Button>
                <input
                  ref={emptyStateInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredAssets.map((asset) => (
                <Card
                  key={asset.fileId}
                  className="group cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedAsset(asset)}
                >
                  <CardContent className="p-0">
                    <div className="aspect-square bg-muted relative overflow-hidden rounded-t-lg">
                      <img
                        src={asset.thumbnail}
                        alt={asset.filename}
                        className="w-full h-full object-cover"
                      />
                      {asset.type !== "image" && (
                        <Badge className="absolute top-2 right-2 capitalize">
                          {asset.type}
                        </Badge>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-sm truncate">{asset.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {asset.uploadedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Asset Detail Dialog */}
        <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedAsset?.filename}</DialogTitle>
              <DialogDescription>
                Uploaded {selectedAsset?.uploadedAt.toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedAsset?.thumbnail}
                  alt={selectedAsset?.filename}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">File ID</label>
                  <div
                    className="mt-1 p-2 bg-muted rounded text-xs font-mono flex items-center justify-between cursor-pointer hover:bg-muted/80"
                    onClick={() => {
                      if (selectedAsset) {
                        navigator.clipboard.writeText(selectedAsset.fileId)
                        toast({
                          title: "Copied!",
                          description: "File ID copied to clipboard",
                        })
                      }
                    }}
                  >
                    <span className="truncate">{selectedAsset?.fileId}</span>
                    <Copy className="h-3 w-3 ml-2 flex-shrink-0" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() =>
                      selectedAsset && handleRemoveBackground(selectedAsset.fileId)
                    }
                    disabled={processing}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    {processing ? "Processing..." : "Remove BG"}
                  </Button>

                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => selectedAsset && handleSmartEnhance(selectedAsset.fileId)}
                    disabled={processing}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    {processing ? "Processing..." : "Enhance"}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full justify-start" variant="outline" disabled={processing}>
                        <Scissors className="mr-2 h-4 w-4" />
                        Smart Crop
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuLabel>Crop Format</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          selectedAsset && handleSmartCrop(selectedAsset.fileId, "square")
                        }
                      >
                        Square (1:1)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          selectedAsset && handleSmartCrop(selectedAsset.fileId, "portrait")
                        }
                      >
                        Portrait (4:5)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          selectedAsset && handleSmartCrop(selectedAsset.fileId, "landscape")
                        }
                      >
                        Landscape (16:9)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => selectedAsset && handleDelete(selectedAsset.fileId)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <Button variant="outline" onClick={() => setSelectedAsset(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
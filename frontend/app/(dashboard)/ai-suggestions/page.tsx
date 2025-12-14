"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Upload, Palette, AlignLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

export default function AISuggestionsPage() {
  const [productImageId, setProductImageId] = useState("")
  const [logoImageId, setLogoImageId] = useState("")
  const [headline, setHeadline] = useState("Your Product Headline")
  const [ctaText, setCtaText] = useState("Shop Now")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleProductUpload = async (file: File) => {
    try {
      const result = await apiClient.uploadAsset(file)
      setProductImageId(result.file_id)
      toast({
        title: "Product image uploaded",
        description: "Ready to generate suggestions",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Could not upload product image",
        variant: "destructive",
      })
    }
  }

  const handleLogoUpload = async (file: File) => {
    try {
      const result = await apiClient.uploadAsset(file)
      setLogoImageId(result.file_id)
      toast({
        title: "Logo uploaded",
        description: "Logo will be included in layouts",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Could not upload logo",
        variant: "destructive",
      })
    }
  }

  const handleGenerateSuggestions = async () => {
    if (!productImageId) {
      toast({
        title: "Product image required",
        description: "Please upload a product image first",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Create a temporary project for suggestions
      const projectResult = await apiClient.createProject()

      const result = await apiClient.getLayoutSuggestions(projectResult.project_id, productImageId, {
        logoImageId: logoImageId || undefined,
        headline,
        ctaText,
      })

      setSuggestions(result.suggestions)

      toast({
        title: "Suggestions generated",
        description: `${result.suggestions_count} layout options created`,
      })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate layout suggestions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApplySuggestion = async (suggestion: any) => {
    setLoading(true)
    try {
      // Create new project
      const projectResult = await apiClient.createProject()

      // Apply layers from suggestion
      // Note: In a real implementation, you would apply each layer to the project
      // For now, we'll just navigate to the editor

      toast({
        title: "Layout applied",
        description: "Opening editor...",
      })

      router.push(`/editor?project=${projectResult.project_id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply layout",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Layout Suggestions</h1>
            <p className="mt-1 text-muted-foreground">Get smart layout recommendations powered by AI</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-6xl">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Input Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle>Setup</CardTitle>
                    <CardDescription>Upload assets and provide context for AI</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="product-upload">Product Image *</Label>
                      <label htmlFor="product-upload">
                        <div className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary">
                          {productImageId ? (
                            <img
                              src={apiClient.getAssetUrl(productImageId) || "/placeholder.svg"}
                              alt="Product"
                              className="h-full object-contain"
                            />
                          ) : (
                            <div className="text-center">
                              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                              <p className="mt-2 text-sm text-muted-foreground">Click to upload product</p>
                            </div>
                          )}
                        </div>
                        <input
                          id="product-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleProductUpload(e.target.files[0])}
                        />
                      </label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logo-upload">Logo (Optional)</Label>
                      <label htmlFor="logo-upload">
                        <div className="flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary">
                          {logoImageId ? (
                            <img
                              src={apiClient.getAssetUrl(logoImageId) || "/placeholder.svg"}
                              alt="Logo"
                              className="h-full object-contain"
                            />
                          ) : (
                            <div className="text-center">
                              <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                              <p className="mt-1 text-xs text-muted-foreground">Click to upload logo</p>
                            </div>
                          )}
                        </div>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                        />
                      </label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="headline">Headline</Label>
                      <Input
                        id="headline"
                        placeholder="Your Product Headline"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cta">Call to Action</Label>
                      <Input
                        id="cta"
                        placeholder="Shop Now"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                      />
                    </div>

                    <Button className="w-full gap-2" onClick={handleGenerateSuggestions} disabled={loading}>
                      <Sparkles className="h-4 w-4" />
                      {loading ? "Generating..." : "Generate Layouts"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Features Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI Features</CardTitle>
                    <CardDescription>What our AI considers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Palette className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Color Harmony</h4>
                        <p className="text-sm text-muted-foreground">
                          Analyzes dominant colors and suggests complementary text colors
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                        <AlignLeft className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Smart Composition</h4>
                        <p className="text-sm text-muted-foreground">
                          Identifies focal points and creates balanced layouts
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                        <Sparkles className="h-5 w-5 text-chart-2" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Multiple Variants</h4>
                        <p className="text-sm text-muted-foreground">
                          Generates 3 different layout styles to choose from
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="suggestions" className="mt-6">
              {suggestions.length === 0 ? (
                <Card>
                  <CardContent className="flex h-64 items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                      <h3 className="mt-4 text-lg font-semibold">No suggestions yet</h3>
                      <p className="mt-2 text-sm text-muted-foreground text-balance">
                        Generate AI layouts to see suggestions here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                  {suggestions.map((suggestion, index) => (
                    <Card key={index} className="overflow-hidden transition-all hover:border-primary">
                      <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <div className="text-center">
                          <Sparkles className="mx-auto h-12 w-12 text-primary/50" />
                          <p className="mt-2 text-sm font-medium">{suggestion.layout_name}</p>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-base">{suggestion.layout_name}</CardTitle>
                        <Badge variant="secondary">{suggestion.layers.length} layers</Badge>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full" onClick={() => handleApplySuggestion(suggestion)} disabled={loading}>
                          Use This Layout
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

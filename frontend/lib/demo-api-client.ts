// Demo API Client - Works offline with mock data

import type { Layer, EditorProject, Template, ComplianceViolation, Review } from "./api-client"

// Mock demo images - using placeholder images that work offline
const DEMO_IMAGES = {
  product1: "/summer-beach-day.png",
  product2: "/diverse-products-still-life.png",
  product3: "/interconnected-social-network.png",
  enhanced: "/creative-workspace.jpg",
  logo: "/abstract-colorful-swirls.png",
}

// Generate mock file IDs
function generateMockId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Store for demo data
const demoStorage = {
  projects: new Map<string, EditorProject>(),
  assets: new Map<string, { filename: string; url: string }>(),
  reviews: new Map<string, Review[]>(),
}

export class DemoApiClient {
  // Asset Management
  async uploadAsset(file: File): Promise<{ status: string; file_id: string; filename: string }> {
    await this.delay(800)
    const fileId = generateMockId()
    const url = URL.createObjectURL(file)
    demoStorage.assets.set(fileId, { filename: file.name, url })

    return {
      status: "success",
      file_id: fileId,
      filename: file.name,
    }
  }

  getAssetUrl(fileId: string): string {
    const asset = demoStorage.assets.get(fileId)
    return asset?.url || DEMO_IMAGES.product1
  }

  async deleteAsset(fileId: string): Promise<{ status: string }> {
    await this.delay(300)
    demoStorage.assets.delete(fileId)
    return { status: "success" }
  }

  async removeBackground(fileId: string): Promise<{ status: string; new_file_id: string }> {
    await this.delay(1500)
    const newFileId = generateMockId()
    demoStorage.assets.set(newFileId, {
      filename: "bg_removed.png",
      url: DEMO_IMAGES.product1,
    })
    return { status: "success", new_file_id: newFileId }
  }

  async enhanceImage(
    fileId: string,
    options?: { sharpness?: number; contrast?: number; brightness?: number },
  ): Promise<{ status: string; new_file_id: string }> {
    await this.delay(1200)
    const newFileId = generateMockId()
    demoStorage.assets.set(newFileId, {
      filename: "enhanced.png",
      url: DEMO_IMAGES.enhanced,
    })
    return { status: "success", new_file_id: newFileId }
  }

  async smartEnhance(fileId: string, upscale = false): Promise<{ status: string; new_file_id: string }> {
    await this.delay(2000)
    const newFileId = generateMockId()
    demoStorage.assets.set(newFileId, {
      filename: "smart_enhanced.png",
      url: DEMO_IMAGES.enhanced,
    })
    return { status: "success", new_file_id: newFileId }
  }

  async smartCrop(
    fileId: string,
    mode: "tight" | "square" | "portrait" | "landscape" | "amazon" | "custom",
    width?: number,
    height?: number,
  ): Promise<{ status: string; new_file_id: string; mode: string }> {
    await this.delay(1000)
    const newFileId = generateMockId()
    demoStorage.assets.set(newFileId, {
      filename: `cropped_${mode}.png`,
      url: DEMO_IMAGES.product2,
    })
    return { status: "success", new_file_id: newFileId, mode }
  }

  async autoResize(
    fileId: string,
    includeCustom = false,
    customWidth?: number,
    customHeight?: number,
  ): Promise<{ status: string; files: Array<{ channel: string; width: number; height: number; file_id: string }> }> {
    await this.delay(2500)

    const channels = [
      { channel: "instagram_square", width: 1080, height: 1080 },
      { channel: "instagram_portrait", width: 1080, height: 1350 },
      { channel: "amazon", width: 2000, height: 2000 },
      { channel: "thumbnail", width: 300, height: 300 },
      { channel: "website_banner", width: 1920, height: 1080 },
      { channel: "flipkart", width: 1600, height: 2000 },
    ]

    const files = channels.map((channel) => {
      const newFileId = generateMockId()
      demoStorage.assets.set(newFileId, {
        filename: `${channel.channel}.png`,
        url: DEMO_IMAGES.product1,
      })
      return { ...channel, file_id: newFileId }
    })

    return { status: "success", files }
  }

  // Editor Projects
  async createProject(
    width = 1080,
    height = 1080,
    backgroundColor = "#FFFFFF",
  ): Promise<{ status: string; project_id: string }> {
    await this.delay(500)
    const projectId = generateMockId()

    const project: EditorProject = {
      _id: projectId,
      width,
      height,
      background_color: backgroundColor,
      layers: [],
      history: [],
      future: [],
    }

    demoStorage.projects.set(projectId, project)
    return { status: "success", project_id: projectId }
  }

  async getProject(projectId: string): Promise<EditorProject> {
    await this.delay(300)
    const project = demoStorage.projects.get(projectId)
    if (!project) {
      throw new Error("Project not found")
    }
    return project
  }

  async addImageLayer(
    projectId: string,
    file: File,
    options: Partial<Layer> = {},
  ): Promise<{ status: string; layer: Layer }> {
    await this.delay(800)
    const project = demoStorage.projects.get(projectId)
    if (!project) throw new Error("Project not found")

    const fileId = generateMockId()
    const url = URL.createObjectURL(file)
    demoStorage.assets.set(fileId, { filename: file.name, url })

    const layer: Layer = {
      type: "image",
      layer_id: generateMockId(),
      file_id: fileId,
      x: options.x || 0,
      y: options.y || 0,
      width: options.width || 400,
      height: options.height || 400,
      rotation: options.rotation || 0,
      opacity: options.opacity || 1.0,
    }

    project.layers.push(layer)
    return { status: "success", layer }
  }

  async addTextLayer(
    projectId: string,
    text: string,
    options: Partial<Layer> = {},
  ): Promise<{ status: string; layer: Layer }> {
    await this.delay(500)
    const project = demoStorage.projects.get(projectId)
    if (!project) throw new Error("Project not found")

    const layer: Layer = {
      type: "text",
      layer_id: generateMockId(),
      text,
      font_size: options.font_size || 48,
      color: options.color || "#000000",
      x: options.x || 0,
      y: options.y || 0,
      rotation: options.rotation || 0,
    }

    project.layers.push(layer)
    return { status: "success", layer }
  }

  async updateLayer(projectId: string, layerId: string, updates: Partial<Layer>): Promise<{ status: string }> {
    await this.delay(200)
    const project = demoStorage.projects.get(projectId)
    if (!project) throw new Error("Project not found")

    const layer = project.layers.find((l) => l.layer_id === layerId)
    if (layer) {
      Object.assign(layer, updates)
    }

    return { status: "success" }
  }

  async renderProject(projectId: string): Promise<{ status: string; rendered_file_id: string }> {
    await this.delay(1500)
    const renderedId = generateMockId()
    demoStorage.assets.set(renderedId, {
      filename: "rendered_project.png",
      url: DEMO_IMAGES.product3,
    })
    return { status: "success", rendered_file_id: renderedId }
  }

  async undo(projectId: string): Promise<{ status: string; layers: Layer[] }> {
    await this.delay(300)
    const project = demoStorage.projects.get(projectId)
    if (!project || project.layers.length === 0) {
      return { status: "ok", layers: [] }
    }

    const lastLayer = project.layers.pop()
    if (lastLayer) {
      project.history.push(lastLayer)
    }

    return { status: "ok", layers: project.layers }
  }

  async redo(projectId: string): Promise<{ status: string; layers: Layer[] }> {
    await this.delay(300)
    const project = demoStorage.projects.get(projectId)
    if (!project || project.history.length === 0) {
      return { status: "ok", layers: project.layers }
    }

    const layer = project.history.pop()
    if (layer) {
      project.layers.push(layer)
    }

    return { status: "ok", layers: project.layers }
  }

  // Templates
  async listTemplates(): Promise<{ status: string; templates: Template[] }> {
    await this.delay(600)
    return {
      status: "success",
      templates: [
        {
          template_id: "demo-template-1",
          template_name: "Centered Hero",
          width: 1080,
          height: 1080,
          layers_count: 3,
        },
        {
          template_id: "demo-template-2",
          template_name: "Left Hero + Right Text",
          width: 1080,
          height: 1080,
          layers_count: 3,
        },
        {
          template_id: "demo-template-3",
          template_name: "Full Background",
          width: 1080,
          height: 1080,
          layers_count: 2,
        },
      ],
    }
  }

  async getTemplate(templateId: string): Promise<{ status: string; template: any }> {
    await this.delay(400)
    return {
      status: "success",
      template: {
        template_id: templateId,
        template_name: "Demo Template",
        width: 1080,
        height: 1080,
        layers: [],
      },
    }
  }

  async applyTemplate(projectId: string, templateId: string): Promise<{ status: string }> {
    await this.delay(800)
    return { status: "success" }
  }

  // AI Layout Suggestions
  async getLayoutSuggestions(
    projectId: string,
    productImageId: string,
    options?: {
      logoImageId?: string
      headline?: string
      ctaText?: string
    },
  ): Promise<{ status: string; suggestions: any[] }> {
    await this.delay(2000)
    return {
      status: "success",
      suggestions: [
        {
          layout_name: "Centered Hero",
          layers: [
            {
              type: "image",
              file_id: productImageId,
              x: 200,
              y: 200,
              width: 680,
              height: 680,
              rotation: 0,
              opacity: 1.0,
              layer_id: generateMockId(),
            },
            {
              type: "text",
              text: options?.headline || "Your Product Headline",
              font_size: 64,
              color: "#000000",
              x: 150,
              y: 920,
              rotation: 0,
              layer_id: generateMockId(),
            },
          ],
        },
        {
          layout_name: "Left Hero + Right Text",
          layers: [
            {
              type: "image",
              file_id: productImageId,
              x: 100,
              y: 200,
              width: 500,
              height: 500,
              rotation: 0,
              layer_id: generateMockId(),
            },
            {
              type: "text",
              text: options?.headline || "Your Product Headline",
              font_size: 60,
              color: "#000000",
              x: 650,
              y: 250,
              layer_id: generateMockId(),
            },
          ],
        },
      ],
    }
  }

  // Compliance
  async checkCompliance(
    projectId: string,
    retailer = "RetailerA",
  ): Promise<{ status: string; violations: ComplianceViolation[] }> {
    await this.delay(1500)
    return {
      status: "success",
      violations: [
        {
          code: "FONT_TOO_SMALL",
          severity: "medium",
          message: "Text layer font size 14px is smaller than required 18px",
          layer_id: "demo-layer-1",
        },
        {
          code: "LOW_CONTRAST",
          severity: "high",
          message: "Text contrast ratio 2.8 is below required 4.5",
          layer_id: "demo-layer-2",
        },
      ],
    }
  }

  async autoFixCompliance(
    projectId: string,
    retailer = "RetailerA",
    applyChanges = true,
  ): Promise<{ status: string; applied: boolean; changes: any[] }> {
    await this.delay(1200)
    return {
      status: "success",
      applied: applyChanges,
      changes: [
        {
          layer_id: "demo-layer-1",
          fix: "increase_font",
          from: 14,
          to: 18,
        },
        {
          layer_id: "demo-layer-2",
          fix: "color_contrast",
          from: "#777777",
          to: "#FFFFFF",
        },
      ],
    }
  }

  // Batch Export
  async batchExport(
    fileIds: string[],
    format: "zip" | "jpeg" | "png" | "webp" = "zip",
    options?: {
      quality?: number
      resizeWidth?: number
      resizeHeight?: number
    },
  ): Promise<Blob> {
    await this.delay(3000)
    // Create a simple mock blob
    return new Blob(["Demo export data"], { type: "application/zip" })
  }

  // Collaboration & Reviews
  async addReview(
    fileId: string,
    user: string,
    comment: string,
    annotations: Array<{ x: number; y: number; width: number; height: number }> = [],
  ): Promise<Review> {
    await this.delay(600)
    const review: Review = {
      review_id: generateMockId(),
      file_id: fileId,
      user,
      comment,
      annotations,
      version: 1,
      timestamp: new Date().toISOString(),
    }

    const reviews = demoStorage.reviews.get(fileId) || []
    reviews.push(review)
    demoStorage.reviews.set(fileId, reviews)

    return review
  }

  async getReviews(fileId: string): Promise<Review[]> {
    await this.delay(400)
    return demoStorage.reviews.get(fileId) || []
  }

  async updateReview(
    reviewId: string,
    user: string,
    comment: string,
    annotations: Array<{ x: number; y: number; width: number; height: number }> = [],
  ): Promise<Review> {
    await this.delay(500)
    // Find and update the review
    for (const [fileId, reviews] of demoStorage.reviews.entries()) {
      const review = reviews.find((r) => r.review_id === reviewId)
      if (review) {
        review.user = user
        review.comment = comment
        review.annotations = annotations
        review.timestamp = new Date().toISOString()
        return review
      }
    }
    throw new Error("Review not found")
  }

  async deleteReview(reviewId: string): Promise<{ status: string }> {
    await this.delay(300)
    for (const [fileId, reviews] of demoStorage.reviews.entries()) {
      const index = reviews.findIndex((r) => r.review_id === reviewId)
      if (index !== -1) {
        reviews.splice(index, 1)
        demoStorage.reviews.set(fileId, reviews)
        return { status: "success" }
      }
    }
    return { status: "success" }
  }

  // Helper to simulate network delay
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const demoApiClient = new DemoApiClient()

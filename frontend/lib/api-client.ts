const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

import { demoApiClient } from "./demo-api-client"

function isDemoMode(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("demo_mode") === "true"
  }
  return false
}

export interface ApiResponse<T = any> {
  status: string
  [key: string]: any
}

export interface Layer {
  type: "image" | "text"
  layer_id: string
  file_id?: string
  text?: string
  font_size?: number
  color?: string
  x: number
  y: number
  width?: number
  height?: number
  rotation: number
  opacity?: number
}

export interface EditorProject {
  _id: string
  width: number
  height: number
  background_color: string
  layers: Layer[]
  history: any[]
  future: any[]
}

export interface Template {
  template_id: string
  template_name: string
  width: number
  height: number
  layers_count: number
}

export interface ComplianceViolation {
  code: string
  severity: "low" | "medium" | "high"
  message: string
  layer_id?: string
}

export interface Review {
  review_id: string
  file_id: string
  user: string
  comment: string
  annotations: Array<{
    x: number
    y: number
    width: number
    height: number
  }>
  version: number
  timestamp: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  // Utility method for fetch
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Request failed" }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Asset Management
  async uploadAsset(file: File): Promise<{ status: string; file_id: string; filename: string }> {
    const demo = this.getDemoClient()
    if (demo) return demo.uploadAsset(file)

    const formData = new FormData()
    formData.append("file", file)

    return this.fetchApi("/upload-asset", {
      method: "POST",
      body: formData,
    })
  }

  getAssetUrl(fileId: string): string {
    const demo = this.getDemoClient()
    if (demo) return demo.getAssetUrl(fileId)

    return `${this.baseUrl}/asset/${fileId}`
  }

  async deleteAsset(fileId: string): Promise<{ status: string }> {
    const demo = this.getDemoClient()
    if (demo) return demo.deleteAsset(fileId)

    return this.fetchApi(`/asset/${fileId}`, { method: "DELETE" })
  }

  async removeBackground(fileId: string): Promise<{ status: string; new_file_id: string }> {
    const demo = this.getDemoClient()
    if (demo) return demo.removeBackground(fileId)

    return this.fetchApi(`/remove-bg/${fileId}`)
  }

  async enhanceImage(
    fileId: string,
    options?: { sharpness?: number; contrast?: number; brightness?: number },
  ): Promise<{ status: string; new_file_id: string }> {
    const demo = this.getDemoClient()
    if (demo) return demo.enhanceImage(fileId, options)

    const params = new URLSearchParams(options as any)
    return this.fetchApi(`/enhance/${fileId}?${params}`)
  }

  async smartEnhance(fileId: string, upscale = false): Promise<{ status: string; new_file_id: string }> {
    const demo = this.getDemoClient()
    if (demo) return demo.smartEnhance(fileId, upscale)

    return this.fetchApi(`/smart-enhance/${fileId}?upscale=${upscale}`)
  }

  async smartCrop(
    fileId: string,
    mode: "tight" | "square" | "portrait" | "landscape" | "amazon" | "custom",
    width?: number,
    height?: number,
  ): Promise<{ status: string; new_file_id: string }> {
    const demo = this.getDemoClient()
    if (demo) return demo.smartCrop(fileId, mode, width, height)

    const params = new URLSearchParams({ mode })
    if (width) params.append("width", width.toString())
    if (height) params.append("height", height.toString())
    return this.fetchApi(`/smart-crop/${fileId}?${params}`)
  }

  async autoResize(
    fileId: string,
    includeCustom = false,
    customWidth?: number,
    customHeight?: number,
  ): Promise<{ status: string; files: Array<{ channel: string; width: number; height: number; file_id: string }> }> {
    const demo = this.getDemoClient()
    if (demo) return demo.autoResize(fileId, includeCustom, customWidth, customHeight)

    const params = new URLSearchParams({ include_custom: includeCustom.toString() })
    if (customWidth) params.append("custom_width", customWidth.toString())
    if (customHeight) params.append("custom_height", customHeight.toString())
    return this.fetchApi(`/auto-resize/${fileId}?${params}`)
  }

  // Editor Projects
  async createProject(
    width = 1080,
    height = 1080,
    backgroundColor = "#FFFFFF",
  ): Promise<{ status: string; project_id: string }> {
    const demo = this.getDemoClient()
    if (demo) return demo.createProject(width, height, backgroundColor)

    const params = new URLSearchParams({
      width: width.toString(),
      height: height.toString(),
      background_color: backgroundColor,
    })
    return this.fetchApi(`/editor/create-project?${params}`, { method: "POST" })
  }

  async getProject(projectId: string): Promise<EditorProject> {
    const demo = this.getDemoClient()
    if (demo) return demo.getProject(projectId)

    return this.fetchApi(`/editor/${projectId}`)
  }

  async addImageLayer(
    projectId: string,
    file: File,
    options: Partial<Layer> = {},
  ): Promise<{ status: string; layer: Layer }> {
    const demo = this.getDemoClient()
    if (demo) return demo.addImageLayer(projectId, file, options)

    const formData = new FormData()
    formData.append("file", file)
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value.toString())
    })

    return this.fetchApi(`/editor/${projectId}/add-image-layer`, {
      method: "POST",
      body: formData,
    })
  }

  async addTextLayer(
    projectId: string,
    text: string,
    options: Partial<Layer> = {},
  ): Promise<{ status: string; layer: Layer }> {
    const demo = this.getDemoClient()
    if (demo) return demo.addTextLayer(projectId, text, options)

    const params = new URLSearchParams({
      text,
      ...Object.fromEntries(Object.entries(options).map(([k, v]) => [k, String(v)])),
    })
    return this.fetchApi(`/editor/${projectId}/add-text-layer?${params}`, {
      method: "POST",
    })
  }

  async updateLayer(projectId: string, layerId: string, updates: Partial<Layer>): Promise<{ status: string }> {
    const demo = this.getDemoClient()
    if (demo) return demo.updateLayer(projectId, layerId, updates)

    return this.fetchApi(`/editor/${projectId}/update-layer/${layerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
  }

  async renderProject(projectId: string): Promise<{ status: string; rendered_file_id: string }> {
    const demo = this.getDemoClient()
    if (demo) return demo.renderProject(projectId)

    return this.fetchApi(`/editor/${projectId}/render`)
  }

  async undo(projectId: string): Promise<{ status: string; layers: Layer[] }> {
    const demo = this.getDemoClient()
    if (demo) return demo.undo(projectId)

    return this.fetchApi(`/editor/${projectId}/undo`, { method: "POST" })
  }

  async redo(projectId: string): Promise<{ status: string; layers: Layer[] }> {
    const demo = this.getDemoClient()
    if (demo) return demo.redo(projectId)

    return this.fetchApi(`/editor/${projectId}/redo`, { method: "POST" })
  }

  // Templates
  async listTemplates(): Promise<{ status: string; templates: Template[] }> {
    const demo = this.getDemoClient()
    if (demo) return demo.listTemplates()

    return this.fetchApi("/templates")
  }

  async getTemplate(templateId: string): Promise<{ status: string; template: any }> {
    const demo = this.getDemoClient()
    if (demo) return demo.getTemplate(templateId)

    return this.fetchApi(`/templates/${templateId}`)
  }

  async applyTemplate(projectId: string, templateId: string): Promise<{ status: string }> {
    const demo = this.getDemoClient()
    if (demo) return demo.applyTemplate(projectId, templateId)

    return this.fetchApi(`/editor/${projectId}/apply-template/${templateId}`, {
      method: "POST",
    })
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
    const demo = this.getDemoClient()
    if (demo) return demo.getLayoutSuggestions(projectId, productImageId, options)

    const params = new URLSearchParams({
      project_id: projectId,
      product_image_id: productImageId,
      ...(options?.logoImageId && { logo_image_id: options.logoImageId }),
      ...(options?.headline && { headline: options.headline }),
      ...(options?.ctaText && { cta_text: options.ctaText }),
    })
    return this.fetchApi(`/ai/layout-suggestions?${params}`, { method: "POST" })
  }

  // Compliance
  async checkCompliance(
    projectId: string,
    retailer = "RetailerA",
  ): Promise<{ status: string; violations: ComplianceViolation[] }> {
    const demo = this.getDemoClient()
    if (demo) return demo.checkCompliance(projectId, retailer)

    return this.fetchApi(`/compliance/check/${projectId}?retailer=${retailer}`)
  }

  async autoFixCompliance(
    projectId: string,
    retailer = "RetailerA",
    applyChanges = true,
  ): Promise<{ status: string; applied: boolean; changes: any[] }> {
    const demo = this.getDemoClient()
    if (demo) return demo.autoFixCompliance(projectId, retailer, applyChanges)

    return this.fetchApi(`/compliance/autofix/${projectId}?retailer=${retailer}&apply_changes=${applyChanges}`, {
      method: "POST",
    })
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
    const demo = this.getDemoClient()
    if (demo) return demo.batchExport(fileIds, format, options)

    const response = await fetch(`${this.baseUrl}/batch-export`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file_ids: fileIds,
        format,
        quality: options?.quality || 85,
        resize_width: options?.resizeWidth,
        resize_height: options?.resizeHeight,
      }),
    })

    if (!response.ok) {
      throw new Error("Batch export failed")
    }

    return response.blob()
  }

  // Collaboration & Reviews
  async addReview(
    fileId: string,
    user: string,
    comment: string,
    annotations: Array<{ x: number; y: number; width: number; height: number }> = [],
  ): Promise<Review> {
    const demo = this.getDemoClient()
    if (demo) return demo.addReview(fileId, user, comment, annotations)

    return this.fetchApi("/review/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file_id: fileId,
        user,
        comment,
        annotations,
      }),
    })
  }

  async getReviews(fileId: string): Promise<Review[]> {
    const demo = this.getDemoClient()
    if (demo) return demo.getReviews(fileId)

    return this.fetchApi(`/review/${fileId}`)
  }

  async updateReview(
    reviewId: string,
    user: string,
    comment: string,
    annotations: Array<{ x: number; y: number; width: number; height: number }> = [],
  ): Promise<Review> {
    const demo = this.getDemoClient()
    if (demo) return demo.updateReview(reviewId, user, comment, annotations)

    return this.fetchApi(`/review/update/${reviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file_id: "", // Will be ignored by backend
        user,
        comment,
        annotations,
      }),
    })
  }

  async deleteReview(reviewId: string): Promise<{ status: string }> {
    const demo = this.getDemoClient()
    if (demo) return demo.deleteReview(reviewId)

    return this.fetchApi(`/review/delete/${reviewId}`, { method: "DELETE" })
  }

  private getDemoClient() {
    return isDemoMode() ? demoApiClient : null
  }
}

export const apiClient = new ApiClient()

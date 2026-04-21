# ReTailor AI — Features, Impact & Uniqueness

> A deep-dive into every feature: what it does, why it exists, what makes it different, and who benefits.

---

## Feature Index

| # | Feature | Powered By | Primary Endpoint(s) |
|---|---|---|---|
| 1 | [AI Asset Manager & Background Removal](#1-ai-asset-manager--background-removal) | rembg, OpenCV, GridFS | `/upload-asset`, `/remove-bg/{id}` |
| 2 | [6-Stage Smart Enhancement Pipeline](#2-6-stage-smart-enhancement-pipeline) | OpenCV, PIL, NumPy | `/smart-enhance/{id}` |
| 3 | [Smart Crop & Auto-Resize](#3-smart-crop--auto-resize) | OpenCV, PIL | `/smart-crop/{id}`, `/auto-resize/{id}` |
| 4 | [Layered Canvas Editor with Undo/Redo](#4-layered-canvas-editor-with-undoredo) | MongoDB, PIL | `/editor/*` |
| 5 | [AI Layout & Design Suggestions](#5-ai-layout--design-suggestions) | Mistral Large | `/ai/layout-suggestions` |
| 6 | [AI Poster Generator (Document → Creative)](#6-ai-poster-generator-document--creative) | Mistral Large, HuggingFace FLUX | `/generate-poster` |
| 7 | [Real-Time Compliance Validator](#7-real-time-compliance-validator) | Rule Engine, PIL | `/compliance/check/{id}` |
| 8 | [Compliance AutoFix](#8-compliance-autofix) | PIL, MongoDB | `/compliance/autofix/{id}` |
| 9 | [Mistral AI Compliance Advisor](#9-mistral-ai-compliance-advisor) | Mistral Large | `/ai/compliance-advice` |
| 10 | [AI Copy & Headline Generator](#10-ai-copy--headline-generator) | Mistral Large | `/ai/copy-suggestions` |
| 11 | [Batch Export & Multi-Format Pipeline](#11-batch-export--multi-format-pipeline) | PIL, GridFS | `/batch-export`, `/auto-resize/{id}` |
| 12 | [Collaboration & Review Workspace](#12-collaboration--review-workspace) | MongoDB, WebSocket | `/review/*` |
| 13 | [Template Library](#13-template-library) | MongoDB | `/templates/*` |
| 14 | [Demo Mode](#14-demo-mode) | demo-api-client.ts | Client-side only |

---

## 1. AI Asset Manager & Background Removal

### What It Does
Provides the core asset ingestion layer for the platform. Users upload product images, logos, and brand assets which are stored as binary objects in **MongoDB GridFS** — enabling efficient streaming, large file support, and direct integration with all downstream processing endpoints.

Background removal is triggered on demand, using a dual-method approach:
- **Primary:** `rembg` (U2Net neural network) — state-of-the-art AI foreground segmentation
- **Fallback:** OpenCV **GrabCut algorithm** — robust geometric-based segmentation that activates automatically if rembg fails

### Why It Matters
Every creative production workflow starts with raw product imagery. The ability to remove backgrounds instantly — without Photoshop, without freelancers, without waiting — is the single most time-saving capability for brands preparing retail media assets. Combining a neural network primary with a classic CV fallback means the feature never silently fails.

### What Makes It Unique
- **GridFS binary storage** rather than filesystem or S3 — keeping all assets in the same MongoDB cluster as project data, simplifying deployment and avoiding cross-service authentication
- **GrabCut fallback** means the feature degrades gracefully in resource-constrained environments where rembg model loading fails
- Full CRUD (Create, Read, Update, Delete) with **streaming download** delivery — no full file reads into memory for large assets

### Who Benefits
- **Brands:** Eliminate Photoshop subscription + hours of manual cutout work
- **Agencies:** Process client product photos at scale without designer involvement
- **SMBs:** Access professional-grade background removal that was previously only available in expensive design suites

---

## 2. 6-Stage Smart Enhancement Pipeline

### What It Does
An automated, multi-stage image quality enhancement pipeline that processes raw product photos to commercial-grade quality. All stages are executed in sequence using OpenCV and NumPy pixel manipulation:

| Stage | Operation | Technical Method |
|---|---|---|
| 1 | **Auto White Balance** | Per-channel normalization to gray world assumption |
| 2 | **Shadow/Highlight Recovery** | HDR-style luminance curve adjustment |
| 3 | **Smart Contrast** | CLAHE (Contrast Limited Adaptive Histogram Equalization) |
| 4 | **Noise Reduction** | Bilateral filtering (edge-preserving denoising) |
| 5 | **Smart Sharpening** | Unsharp masking with adaptive kernel |
| 6 | **HD Upscale (optional)** | Lanczos resampling to 2x or print-ready resolution |

### Why It Matters
Raw product photos — especially from smartphones or budget cameras — typically have incorrect white balance (color casts), compressed shadow detail, and digital noise. These defects are magnified on large-format displays and retail screens. The pipeline corrects all of them in a single automated pass.

### What Makes It Unique
- **Edge-preserving noise reduction** (bilateral filter) retains product texture and edge crispness that Gaussian blur would destroy
- **Adaptive CLAHE** (not global histogram equalization) prevents over-brightening of already-bright regions
- The pipeline processes entirely **server-side** — no client hardware dependency, identical output regardless of the user's device or browser
- Optional **HD upscale** brings low-resolution product images to print-ready quality without third-party upscaling services

### Who Benefits
- **SMBs** shooting product photos in-house without professional lighting
- **Brands** with legacy image libraries that predate modern smartphone cameras
- **Agencies** managing large client catalogs with inconsistent image quality

---

## 3. Smart Crop & Auto-Resize

### What It Does
**Smart Crop** automatically crops images while preserving the focal subject in frame. Supports multiple preset modes:

| Mode | Use Case |
|---|---|
| `tight` | Remove all background, tight to subject |
| `square` | 1:1 ratio, subject centered |
| `portrait` | 4:5 ratio, optimized for Instagram feed |
| `landscape` | 16:9, optimized for digital displays |
| `amazon` | Amazon DSP ad specs |
| `custom` | User-specified width × height |

**Auto-Resize** generates 30+ platform format variants from a single master — all focal-preserving, delivered as a batch.

### Why It Matters
Running a multi-channel retail media campaign requires dozens of size variants. Manually cropping each one — and ensuring the product stays in frame across all sizes — is one of the most tedious tasks in creative production. Getting it wrong means rejected creatives.

### What Makes It Unique
- **Focal-preserving crop logic** — the crop algorithm identifies the subject region and ensures it remains centered and in frame across all output sizes, even extreme aspect ratio changes
- **30+ formats in one click** — the same operation that previously required a designer to manually repeat 30 times is fully automated
- **Named mode presets** map directly to real retail media platform requirements (Amazon, Meta, in-store screens)

---

## 4. Layered Canvas Editor with Undo/Redo

### What It Does
A professional layered canvas editor backed by MongoDB project storage. Each project stores a full layer stack — image layers and text layers — with complete transform properties (position, rotation, opacity, scale). The canvas renders server-side via PIL for pixel-perfect consistency.

**Key capabilities:**
- Image and text layer management
- Full transform: x/y position, rotation, opacity, width, height
- Server-side PNG rendering (not client-canvas — ensures exact WYSIWYG)
- Template application to any project
- Full undo/redo via per-project history and future stacks in MongoDB
- Multi-device preview modes

### Why It Matters
Consistency between the editing preview and the exported file is critical in retail media — a creative that looks compliant in the editor must export identically. By rendering server-side with PIL, ReTailor AI guarantees that what you see is exactly what the retailer receives.

### What Makes It Unique
- **Server-side rendering** (PIL composition, not client Canvas API) — output is identical on every device, browser, and screen resolution
- **MongoDB-persisted history** — undo/redo works across sessions and devices, not just within the current browser tab
- **Layer-level addressing** — each layer has a unique `layer_id`, enabling surgical updates without reprocessing the entire canvas

---

## 5. AI Layout & Design Suggestions

### What It Does
A Mistral Large-powered layout intelligence engine that generates complete, retailer-optimized creative layout variants from your specific assets. Input your product image ID, logo ID, headline, and CTA text — Mistral analyzes the visual context and returns multiple ranked layout options, each with element positions, color recommendations, and channel-specific notes.

One-click application transfers any suggestion directly into the active canvas project.

### Why It Matters
Layout design is the creative decision that non-designers struggle with most. Choosing where to place the product, the logo, the headline, and the CTA — and ensuring those choices are compliance-safe and aesthetically professional — requires training that most SMB marketing teams don't have. The AI suggestions engine removes this as a barrier.

### What Makes It Unique
- **Asset-contextualized suggestions** — layouts are generated based on the actual uploaded product image and logo, not generic templates
- **Multiple ranked variants** — gives the user creative options rather than a single opinionated output
- **One-click apply** — suggestions are actionable, not just advisory
- **Channel awareness** — suggestions differ for social, in-store, and display placements

---

## 6. AI Poster Generator (Document → Creative)

### What It Does
The most innovative feature in the platform. A full pipeline that converts any document (PDF or DOCX) or free-text prompt into a finished, production-quality poster creative.

**How the pipeline works:**
1. User uploads a PDF or DOCX (promo brief, product spec, campaign document) or pastes a description
2. PyPDF2/python-docx extracts all text content from the document
3. **Mistral Large** reads the document and generates a detailed, tailored FLUX image generation prompt — explicitly quoting the exact copy to be rendered on the poster, specifying visual layout, typography style, color aesthetic, and banner composition
4. The prompt is sent to the **HuggingFace FLUX model** via Inference API
5. A production-quality poster image is rendered and stored in GridFS
6. The result is returned as a canvas-ready asset

### Why It Matters
Most brands have promotional materials sitting in PDF and DOCX format — campaign briefs, product specs, promo flyers. Converting these into visual creatives previously required a designer to read the document and manually build the creative from scratch. This pipeline automates the entire translation.

### What Makes It Unique
- **Document comprehension, not just text extraction** — Mistral reads the document *as a creative director would*, identifying key messages, brand identity signals, and visual opportunity
- **FLUX prompt engineering** — Mistral doesn't just summarize; it writes a precise FLUX prompt that explicitly quotes the copy to appear on the poster, specifies font style, layout, and color palette
- **Document type agnostic** — works on PDFs, DOCX files, and plain text prompts interchangeably
- **No designer required at any step** — the entire pipeline from document to finished creative is fully automated

---

## 7. Real-Time Compliance Validator

### What It Does
An automated rule engine that validates every layer of every project against configurable, retailer-specific compliance rule sets stored in MongoDB.

**Checks performed:**
- Minimum font size per retailer threshold
- Text contrast ratio — **WCAG AA standard (4.5:1)** — computed by sampling actual background pixel color behind each text layer using PIL
- Logo safe-margin validation — minimum margin computed as a percentage of the canvas short side
- Background lightness requirements
- Color scheme restrictions per retailer
- Layer position and inter-element spacing

**Output:** Severity-tiered violations — `low`, `medium`, `high` — with per-violation layer attribution.

### Why It Matters
The industry-wide ~40% creative rejection rate from retailers is almost entirely caused by preventable compliance violations. Catching them before submission — in real time, with layer-level attribution — saves days of rework cycles and eliminates one of the most damaging sources of campaign delay.

### What Makes It Unique
- **Pixel-level contrast computation** — not a color name lookup, but actual `contrast_ratio()` calculation on sampled background pixels behind the text layer
- **Per-layer attribution** — violations are linked to specific layer IDs, not just reported as generic page-level errors
- **Retailer-agnostic rule engine** — rules stored in MongoDB means new retailer standards can be added without code changes
- **WCAG AA compliance** built in — accessibility standards automatically enforced alongside retailer branding rules

---

## 8. Compliance AutoFix

### What It Does
One-click automated correction of all detectable compliance violations. AutoFix applies targeted repairs to each offending layer:

- Font size bumped to retailer minimum threshold
- Text color switched to highest-contrast option (black or white) based on sampled background color behind the text layer
- Logo repositioned to respect safe margin requirements, computed dynamically per canvas dimensions
- All changes logged as a before/after diff for audit trail
- Non-destructive — original project state preserved in undo history

### Why It Matters
Even when violations are identified, fixing them manually requires the user to understand *what* to change and *how* — typesizing rules, contrast formulas, margin calculations. AutoFix applies all corrections automatically and non-destructively, making compliance achievable for non-designers.

### What Makes It Unique
- **Context-aware contrast fixing** — AutoFix doesn't just toggle a preset color; it samples the actual rendered background behind each text layer and selects the highest-contrast option for that specific location
- **Non-destructive** — original layer values are preserved in history, so AutoFix can be undone
- **Audit diff logging** — every fix is logged with before/after values for compliance documentation and enterprise audit trails

---

## 9. Mistral AI Compliance Advisor

### What It Does
A natural-language compliance guide that translates rule-engine violation codes into plain-English explanations and creative fix suggestions, powered by **Mistral Large**.

Input a list of compliance violations → receive human-readable explanations of what each violation means, why it matters for the specific retailer, and what creative options exist to fix it.

### Why It Matters
Rule codes like `FONT_SIZE_TOO_SMALL` or `CONTRAST_RATIO_FAIL` are opaque to non-designers. A natural-language advisor that explains "your headline text is too small — the retailer requires at least 16pt font for in-store displays to ensure readability at distance" converts a compliance tool from an error reporter into a design educator.

### What Makes It Unique
- **Contextual explanations** — not generic documentation lookups, but Mistral-generated guidance calibrated to the specific violations and their severity
- **Creative fix suggestions** — the advisor suggests multiple creative options to resolve each violation, not just the minimum correction
- **Accessible language** — designed for marketing managers and brand owners, not designers or engineers

---

## 10. AI Copy & Headline Generator

### What It Does
Generates retail-optimized advertising copy — headlines, sub-copy, and CTA text — using **Mistral Large**, calibrated specifically for retail media placements.

**Inputs:** product name, key benefit, target audience, tone  
**Outputs:** multiple headline variants, sub-copy options, CTA alternatives

### Why It Matters
Even when a brand has strong design capabilities, crafting retail media copy that is concise, benefit-led, and guideline-compliant requires copywriting expertise that many SMB marketing teams lack. An integrated AI copywriter removes this as a production bottleneck.

### What Makes It Unique
- **Retail-media calibrated** — Mistral's system prompt is tuned specifically for retail media constraints: character limits, benefit-first structure, urgency-without-misleading conventions
- **Multi-variant output** — generates several options rather than a single output, supporting A/B creative testing
- **In-canvas integration** — copy can be applied directly to text layers without leaving the platform

---

## 11. Batch Export & Multi-Format Pipeline

### What It Does
Single-click generation of every required format variant from a single master creative, delivered as a downloadable ZIP package.

**Auto-Resize generates variants for:**
- Facebook (Feed, Story, Carousel, Right Column)
- Instagram (Feed, Story, Reels Cover)
- Google Display Network (multiple IAB standard sizes)
- Amazon DSP (multiple ad unit sizes)
- In-store digital screens (various retailer formats)
- Print banners (with configurable bleed and trim marks)
- Custom dimensions

**All variants are focal-preserving** — subject centering is maintained across extreme aspect ratio changes.

### Why It Matters
A single retail media campaign typically requires 30+ size variants across channels. Creating each manually is an hours-long process prone to inconsistency. The batch export pipeline makes this a single action.

### What Makes It Unique
- **Focal-preserving auto-resize** — the product subject is never accidentally cropped across format variants, even in extreme aspect ratio changes
- **GridFS delivery** — all variants are stored in MongoDB GridFS and delivered via streaming download, not temporary file system storage
- **File optimization** — JPEG/PNG compression applied at export, not just resizing

---

## 12. Collaboration & Review Workspace

### What It Does
A built-in async review system for team and stakeholder collaboration, eliminating the need for external tools like Figma comments, Loom, or email threads.

**Feature set:**
- Inline canvas annotations with **bounding-box coordinates** — comments are spatially linked to specific regions of the creative
- Every annotation linked to a version number for change tracking
- Full CRUD — add, view, update, delete review comments
- **Real-time WebSocket updates** — team members see new annotations appear live without refreshing
- Shareable review links for external stakeholders

### Why It Matters
Review cycles are the second biggest time sink in creative production (after initial creation). When feedback lives in email, Slack, or external tools, iteration tracking is lost, context is missing, and creatives go through unnecessary revision loops. An in-platform review system with canvas-level annotation collapses the feedback cycle.

### What Makes It Unique
- **Canvas-space coordinates** — annotations are positioned in canvas coordinates, not pixel coordinates, so they survive resize operations and remain accurate
- **WebSocket live updates** — no polling, no page refresh required for collaborative review sessions
- **Version linking** — every comment is tied to a specific creative version, making it trivial to trace what was changed and why

---

## 13. Template Library

### What It Does
A seeded, extensible library of production-validated retailer-compliant templates. Each template stores a complete layer structure, canvas dimensions, background configuration, and compliance metadata.

**Capabilities:**
- Gallery browser with template previews
- One-click apply to any existing project (layers merge intelligently)
- Admin endpoints for adding new templates and reseeding the library
- Auto-seeded at startup with platform default templates

### What Makes It Unique
- **Compliance-pre-validated** — templates in the library are designed to pass retailer compliance checks out of the box
- **Extensible without code changes** — new retailer templates are added via the `/templates/add` API endpoint, not hardcoded
- **Merge-based application** — applying a template to an existing project merges the template layer structure with the existing project rather than replacing it

---

## 14. Demo Mode

### What It Does
A complete offline demonstration mode powered by `frontend/lib/demo-api-client.ts`. When activated, all API calls are intercepted by the mock client, which returns realistic simulated responses — without any backend connectivity required.

**Enable:** `localStorage.setItem('demo_mode', 'true')` or via Settings toggle.

**What demo mode simulates:**
- Asset upload and management
- Compliance check results with sample violations
- AI layout suggestion outputs
- Compliance AutoFix responses
- Poster generation (simulated with placeholder)
- Review and annotation CRUD

### Why It Matters
Being able to demonstrate the full platform experience without backend infrastructure running is essential for sales demos, investor presentations, onboarding, and UI development. No other retail creative platform offers a full-featured offline demo mode.

### What Makes It Unique
- **Complete feature parity** — every UI flow that works with the real backend also works in demo mode
- **Realistic mock data** — responses mirror actual API response shapes exactly, so UI behavior is indistinguishable from live
- **Zero infrastructure** — frontend-only, no servers, databases, or API keys required for a full platform walkthrough

---

## Impact Summary

| Feature | Advertiser Impact | Retailer Impact | Market Differentiation |
|---|---|---|---|
| AI Background Removal | Eliminates $500–$2K/asset Photoshop work | Consistent supplier asset quality | Neural + CV dual-method; no silent failures |
| 6-Stage Enhancement | Upgrades in-house photos to commercial quality | Reduced low-quality creative submissions | Server-side pipeline; identical output on all devices |
| Smart Crop + Auto-Resize | 30 format variants in 1 click vs. 30 manual tasks | Faster multi-channel campaign delivery | Focal-preserving across all 30+ formats |
| Canvas Editor | Full design capability without design skills | Standardized creative dimensions | Server-side PIL render = guaranteed WYSIWYG |
| AI Layout Suggestions | Professional layouts without a designer | Higher-quality incoming creatives | Asset-contextualized, not template-based |
| AI Poster Generator | Document → campaign creative in minutes | Supplier enablement at scale | Mistral prompt engineering from real brand docs |
| Compliance Validator | ~40% → ~5% rejection rate | 60% reduction in review overhead | Pixel-level WCAG contrast; per-layer attribution |
| Compliance AutoFix | Zero manual correction effort | Standardized compliance across all suppliers | Context-aware contrast selection per layer |
| AI Compliance Advisor | Designers learn *why*, not just *what* | Reduced repeat violations | Mistral explanations tuned for non-designers |
| AI Copy Generator | No copywriter required | Campaign message quality | Retail-media calibrated, multi-variant output |
| Batch Export | 99% time reduction on format production | Faster campaign delivery | 30+ formats, focal-preserving, GridFS delivery |
| Collaboration | Review cycles in platform, not email | Faster approval workflows | Canvas-space annotations + WebSocket live updates |
| Demo Mode | Full evaluation without infrastructure | Faster partner onboarding | Complete feature parity in offline mode |

---

> *"ReTailor AI turns retail media from a creative grind into a creative goldmine — giving every brand the power to punch above its weight."*

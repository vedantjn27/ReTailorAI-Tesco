# ReTailor AI — Folder Structure

> An annotated map of every file and directory in the ReTailor AI repository.

---

```
retailor-ai/                                         ← Project root
│
├── README.md                                        ← Main project documentation (start here)
├── SETUP_GUIDE.md                                   ← Installation, env setup, cloud deployment
├── FOLDER_STRUCTURE.md                              ← This file
├── FEATURES_AND_IMPACT.md                           ← Deep-dive on every feature's uniqueness
├── requirements.txt                                 ← Consolidated Python backend dependencies
├── .env.example                                     ← Environment variable template
├── .gitattributes                                   ← Git line ending / LFS configuration
│
├── backend/                                         ← FastAPI Python backend
│   ├── main.py                                      ← ★ Core application (all 40+ endpoints)
│   │                                                ←   Includes: asset manager, editor engine,
│   │                                                ←   AI suggestions, compliance validator,
│   │                                                ←   autofix, export pipeline, review CRUD,
│   │                                                ←   template library, poster generator
│   ├── .env                                         ← Local environment config (not committed)
│   └── .python-version                              ← Python 3.12 version pin
│
├── Sample Documents For Poster/                     ← Test assets for poster generator feature
│   ├── sample_promo.pdf                             ← Sample promotional PDF
│   ├── sample_promo.docx                            ← Sample promotional DOCX
│   └── generate_test_docs.py                        ← Script to generate more test documents
│
└── frontend/                                        ← Next.js 16 frontend application
    │
    ├── BACKEND_INTEGRATION_STATUS.md                ← Live integration status per endpoint/feature
    ├── next.config.mjs                              ← Next.js config (image domains, rewrites)
    ├── package.json                                 ← Node.js dependencies and scripts
    ├── components.json                              ← shadcn/ui registry configuration
    │
    ├── app/                                         ← Next.js App Router
    │   ├── layout.tsx                               ← Root layout: fonts, ThemeProvider
    │   ├── globals.css                              ← Global styles, CSS variables, grid patterns
    │   ├── page.tsx                                 ← Public landing page
    │   │                                            ←   Sections: Hero, Stats, Features, CTA
    │   │
    │   └── (dashboard)/                             ← Protected route group (dashboard)
    │       ├── layout.tsx                           ← Dashboard shell + AppSidebar
    │       │
    │       ├── dashboard/
    │       │   └── page.tsx                         ← Campaign dashboard
    │       │                                        ←   Displays: recent projects, creative stats,
    │       │                                        ←   quick action shortcuts, metric cards
    │       │
    │       ├── editor/
    │       │   └── page.tsx                         ← ★ Canvas editor (primary workspace)
    │       │                                        ←   Features: layer management, drag controls,
    │       │                                        ←   image/text layers, template apply,
    │       │                                        ←   undo/redo, canvas preview, render
    │       │                                        ←   APIs: /editor/create-project,
    │       │                                        ←         /editor/{id}/add-image-layer,
    │       │                                        ←         /editor/{id}/add-text-layer,
    │       │                                        ←         /editor/{id}/update-layer/{lid},
    │       │                                        ←         /editor/{id}/render,
    │       │                                        ←         /editor/{id}/undo, /redo
    │       │
    │       ├── assets/
    │       │   ├── page.tsx                         ← Asset manager dashboard
    │       │   │                                    ←   Features: upload, preview gallery,
    │       │   │                                    ←   background removal, enhance, crop,
    │       │   │                                    ←   delete, asset search
    │       │   │                                    ←   APIs: /upload-asset, /assets,
    │       │   │                                    ←         /remove-bg/{id}, /enhance/{id},
    │       │   │                                    ←         /smart-enhance/{id},
    │       │   │                                    ←         /smart-crop/{id}, /asset/{id}
    │       │   └── loading.tsx                      ← Assets page loading skeleton
    │       │
    │       ├── ai-suggestions/
    │       │   └── page.tsx                         ← AI layout & copy suggestions
    │       │                                        ←   Features: upload product + logo,
    │       │                                        ←   enter headline + CTA, generate multiple
    │       │                                        ←   layout variants, one-click apply
    │       │                                        ←   APIs: /ai/layout-suggestions,
    │       │                                        ←         /ai/copy-suggestions
    │       │
    │       ├── compliance/
    │       │   └── page.tsx                         ← Compliance checker & AutoFix studio
    │       │                                        ←   Features: select retailer rule set,
    │       │                                        ←   run check, severity-tiered results,
    │       │                                        ←   one-click AutoFix, AI compliance advice
    │       │                                        ←   APIs: /compliance/check/{id},
    │       │                                        ←         /compliance/autofix/{id},
    │       │                                        ←         /ai/compliance-advice
    │       │
    │       ├── enhance/
    │       │   └── page.tsx                         ← Smart enhancement studio
    │       │                                        ←   Features: select asset, choose enhancement
    │       │                                        ←   mode, before/after preview, apply
    │       │                                        ←   APIs: /smart-enhance/{id},
    │       │                                        ←         /enhance/{id}, /crop/{id}
    │       │
    │       ├── export/
    │       │   └── page.tsx                         ← Multi-format export & batch pipeline
    │       │                                        ←   Features: select project, choose formats,
    │       │                                        ←   auto-resize preview, batch ZIP download
    │       │                                        ←   APIs: /auto-resize/{id},
    │       │                                        ←         /batch-export
    │       │
    │       ├── poster-generator/
    │       │   └── page.tsx                         ← ★ Document-to-poster AI pipeline
    │       │                                        ←   Features: PDF/DOCX upload or text prompt,
    │       │                                        ←   Mistral prompt engineering, FLUX rendering,
    │       │                                        ←   result preview, open in editor
    │       │                                        ←   API: POST /generate-poster
    │       │
    │       ├── templates/
    │       │   ├── page.tsx                         ← Template library browser
    │       │   │                                    ←   Features: gallery view, template preview,
    │       │   │                                    ←   apply to project, filter by platform
    │       │   │                                    ←   APIs: /templates/list,
    │       │   │                                    ←         /templates/{id},
    │       │   │                                    ←         /editor/{id}/apply-template/{tid}
    │       │   └── loading.tsx                      ← Templates page loading skeleton
    │       │
    │       ├── collaboration/
    │       │   └── page.tsx                         ← Team review & annotation workspace
    │       │                                        ←   Features: inline canvas annotations,
    │       │                                        ←   bounding box coordinates, version linking,
    │       │                                        ←   comment CRUD, real-time WebSocket updates
    │       │                                        ←   APIs: /review/add, /review/{file_id},
    │       │                                        ←         /review/update/{id},
    │       │                                        ←         /review/delete/{id}
    │       │
    │       └── settings/
    │           └── page.tsx                         ← Platform settings
    │                                                ←   Features: dark/light theme, API key config,
    │                                                ←   demo mode toggle, user preferences
    │
    ├── components/                                  ← Shared application components
    │   ├── app-sidebar.tsx                          ← Navigation sidebar with all route links
    │   │                                            ←   Links: Dashboard, Editor, Assets,
    │   │                                            ←          AI Suggestions, Compliance,
    │   │                                            ←          Enhance, Export, Poster Generator,
    │   │                                            ←          Templates, Collaboration, Settings
    │   ├── theme-provider.tsx                       ← next-themes dark/light mode context wrapper
    │   ├── theme-initializer.tsx                    ← SSR-safe theme class bootstrap (no flash)
    │   └── ui/                                      ← shadcn/ui component library (50+ components)
    │       ├── button.tsx                           ← Button variants (default, outline, ghost, etc.)
    │       ├── button-group.tsx                     ← Grouped button component
    │       ├── card.tsx                             ← Content card container
    │       ├── input.tsx                            ← Text input field
    │       ├── input-group.tsx                      ← Input with prefix/suffix adornments
    │       ├── textarea.tsx                         ← Multi-line text input
    │       ├── label.tsx                            ← Form field label
    │       ├── form.tsx                             ← React Hook Form integration layer
    │       ├── field.tsx                            ← Form field wrapper with label + error
    │       ├── badge.tsx                            ← Status and classification badges
    │       ├── progress.tsx                         ← Progress bar component
    │       ├── slider.tsx                           ← Range slider input
    │       ├── switch.tsx                           ← Toggle switch
    │       ├── checkbox.tsx                         ← Checkbox input
    │       ├── radio-group.tsx                      ← Radio button group
    │       ├── select.tsx                           ← Dropdown select
    │       ├── tabs.tsx                             ← Tab navigation component
    │       ├── accordion.tsx                        ← Expandable accordion sections
    │       ├── dialog.tsx                           ← Modal dialog
    │       ├── alert-dialog.tsx                     ← Confirmation dialog
    │       ├── drawer.tsx                           ← Mobile-friendly bottom drawer
    │       ├── sheet.tsx                            ← Slide-in side panel
    │       ├── popover.tsx                          ← Floating popover panel
    │       ├── hover-card.tsx                       ← Hover preview card
    │       ├── tooltip.tsx                          ← Hover tooltip
    │       ├── toast.tsx                            ← Toast notification component
    │       ├── toaster.tsx                          ← Toast container/renderer
    │       ├── sonner.tsx                           ← Sonner toast integration
    │       ├── table.tsx                            ← Data table component
    │       ├── chart.tsx                            ← Recharts wrapper with theming
    │       ├── avatar.tsx                           ← User avatar component
    │       ├── separator.tsx                        ← Visual divider
    │       ├── scroll-area.tsx                      ← Custom-styled scroll container
    │       ├── skeleton.tsx                         ← Loading skeleton placeholder
    │       ├── spinner.tsx                          ← Loading spinner
    │       ├── empty.tsx                            ← Empty state placeholder
    │       ├── item.tsx                             ← List/menu item component
    │       ├── kbd.tsx                              ← Keyboard shortcut badge
    │       ├── sidebar.tsx                          ← Sidebar layout primitives
    │       ├── navigation-menu.tsx                  ← Nav menu with dropdowns
    │       ├── dropdown-menu.tsx                    ← Dropdown menu
    │       ├── menubar.tsx                          ← Horizontal menu bar
    │       ├── context-menu.tsx                     ← Right-click context menu
    │       ├── command.tsx                          ← Command palette / search
    │       ├── calendar.tsx                         ← Date picker calendar
    │       ├── carousel.tsx                         ← Image/content carousel
    │       ├── collapsible.tsx                      ← Collapsible section
    │       ├── resizable.tsx                        ← Resizable panel layout
    │       ├── toggle.tsx                           ← Toggle button
    │       ├── toggle-group.tsx                     ← Grouped toggle buttons
    │       ├── breadcrumb.tsx                       ← Breadcrumb navigation
    │       ├── pagination.tsx                       ← Page navigation controls
    │       ├── aspect-ratio.tsx                     ← Aspect ratio container
    │       ├── input-otp.tsx                        ← OTP input component
    │       ├── use-mobile.tsx                       ← Mobile breakpoint hook
    │       └── use-toast.ts                         ← Toast state management hook
    │
    ├── lib/                                         ← Client-side utilities
    │   ├── api-client.ts                            ← ★ Full typed API client
    │   │                                            ←   Covers all backend endpoints with
    │   │                                            ←   TypeScript interfaces and error handling
    │   │                                            ←   Auto-switches to demo client in demo mode
    │   ├── demo-api-client.ts                       ← Mock API client (no backend needed)
    │   │                                            ←   Full mock responses for all features
    │   │                                            ←   Used when localStorage.demo_mode = "true"
    │   └── utils.ts                                 ← `cn()` Tailwind class merge utility
    │
    └── hooks/                                       ← Custom React hooks
        ├── use-mobile.ts                            ← Returns true if viewport < 768px
        └── use-toast.ts                             ← Toast notification state and dispatch
```

---

## Backend Module Map (`backend/main.py`)

All backend logic is in a single `main.py`. Here is the logical module breakdown:

| Approx Line Range | Module | What It Does |
|---|---|---|
| 1–80 | **Setup & Clients** | Imports, FastAPI init, CORS, MongoDB/GridFS, Mistral client init |
| 80–120 | **Utilities** | `pil_to_bytes`, `smart_remove_background`, helper functions |
| 120–290 | **Asset Manager** | Upload, remove-bg, enhance, asset CRUD, crop, list assets |
| 295–560 | **Canvas Editor** | Create project, add layers, update layers, set layers, render, undo/redo, download |
| 562–725 | **AI Layout Suggestions** | Mistral-powered layout generation endpoint |
| 726–784 | **Template Library** | Add template, list templates, get by ID, apply to project |
| 785–958 | **Startup & Seeding** | Auto-seed retailer guidelines and templates on app boot |
| 959–1087 | **Compliance Validator** | Per-layer rule checking, severity tiering, WCAG contrast |
| 1088–1257 | **Compliance AutoFix** | Automated fix application with audit diff logging |
| 1258–1385 | **Smart Enhancement** | 6-stage enhancement pipeline (white balance → sharpening) |
| 1386–1465 | **Smart Crop** | Focal-preserving multi-mode crop |
| 1466–1586 | **Batch Export & Auto-Resize** | 30+ format generation, ZIP packaging, file optimization |
| 1587–1661 | **Review & Collaboration** | Annotation CRUD (add/get/update/delete reviews) |
| 1663–1677 | **Health & Status** | Root health endpoint |
| 1673–1732 | **AI Compliance Advisor** | Mistral natural-language violation explanations |
| 1733–1778 | **AI Copy Generator** | Mistral headline/copy/CTA generation |
| 1779–1850 | **Poster Generator** | Document parsing → Mistral prompt → HuggingFace FLUX render |

---

## Key File Quick Reference

| Task | File to modify |
|---|---|
| Add new API endpoint | `backend/main.py` → add `@app.get/post(...)` |
| Add new dashboard page | `frontend/app/(dashboard)/[name]/page.tsx` |
| Add new sidebar link | `frontend/components/app-sidebar.tsx` |
| Add new API call in frontend | `frontend/lib/api-client.ts` + `demo-api-client.ts` |
| Add new mock demo data | `frontend/lib/demo-api-client.ts` |
| Change platform colors/theme | `frontend/app/globals.css` (CSS custom properties) |
| Add new UI component | `frontend/components/ui/` (shadcn/ui generator) |
| Add new retailer rule set | `backend/main.py` → startup seeding section |
| Add new template | `backend/main.py` → `/templates/add` endpoint or seeding |
| Change AI model | `backend/main.py` → `mistral-large-latest` string |

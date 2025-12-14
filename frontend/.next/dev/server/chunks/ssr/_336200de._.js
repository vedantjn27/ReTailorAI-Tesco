module.exports = [
"[project]/components/ui/card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('leading-none font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('px-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex items-center px-6 [.border-t]:pt-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/ui/badge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])('inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden', {
    variants: {
        variant: {
            default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
            secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
            destructive: 'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});
function Badge({ className, variant, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : 'span';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "badge",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/badge.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/lib/demo-api-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Demo API Client - Works offline with mock data
__turbopack_context__.s([
    "DemoApiClient",
    ()=>DemoApiClient,
    "demoApiClient",
    ()=>demoApiClient
]);
// Mock demo images - using placeholder images that work offline
const DEMO_IMAGES = {
    product1: "/summer-beach-day.png",
    product2: "/diverse-products-still-life.png",
    product3: "/interconnected-social-network.png",
    enhanced: "/creative-workspace.jpg",
    logo: "/abstract-colorful-swirls.png"
};
// Generate mock file IDs
function generateMockId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
// Store for demo data
const demoStorage = {
    projects: new Map(),
    assets: new Map(),
    reviews: new Map()
};
class DemoApiClient {
    // Asset Management
    async uploadAsset(file) {
        await this.delay(800);
        const fileId = generateMockId();
        const url = URL.createObjectURL(file);
        demoStorage.assets.set(fileId, {
            filename: file.name,
            url
        });
        return {
            status: "success",
            file_id: fileId,
            filename: file.name
        };
    }
    getAssetUrl(fileId) {
        const asset = demoStorage.assets.get(fileId);
        return asset?.url || DEMO_IMAGES.product1;
    }
    async deleteAsset(fileId) {
        await this.delay(300);
        demoStorage.assets.delete(fileId);
        return {
            status: "success"
        };
    }
    async removeBackground(fileId) {
        await this.delay(1500);
        const newFileId = generateMockId();
        demoStorage.assets.set(newFileId, {
            filename: "bg_removed.png",
            url: DEMO_IMAGES.product1
        });
        return {
            status: "success",
            new_file_id: newFileId
        };
    }
    async enhanceImage(fileId, options) {
        await this.delay(1200);
        const newFileId = generateMockId();
        demoStorage.assets.set(newFileId, {
            filename: "enhanced.png",
            url: DEMO_IMAGES.enhanced
        });
        return {
            status: "success",
            new_file_id: newFileId
        };
    }
    async smartEnhance(fileId, upscale = false) {
        await this.delay(2000);
        const newFileId = generateMockId();
        demoStorage.assets.set(newFileId, {
            filename: "smart_enhanced.png",
            url: DEMO_IMAGES.enhanced
        });
        return {
            status: "success",
            new_file_id: newFileId
        };
    }
    async smartCrop(fileId, mode, width, height) {
        await this.delay(1000);
        const newFileId = generateMockId();
        demoStorage.assets.set(newFileId, {
            filename: `cropped_${mode}.png`,
            url: DEMO_IMAGES.product2
        });
        return {
            status: "success",
            new_file_id: newFileId,
            mode
        };
    }
    async autoResize(fileId, includeCustom = false, customWidth, customHeight) {
        await this.delay(2500);
        const channels = [
            {
                channel: "instagram_square",
                width: 1080,
                height: 1080
            },
            {
                channel: "instagram_portrait",
                width: 1080,
                height: 1350
            },
            {
                channel: "amazon",
                width: 2000,
                height: 2000
            },
            {
                channel: "thumbnail",
                width: 300,
                height: 300
            },
            {
                channel: "website_banner",
                width: 1920,
                height: 1080
            },
            {
                channel: "flipkart",
                width: 1600,
                height: 2000
            }
        ];
        const files = channels.map((channel)=>{
            const newFileId = generateMockId();
            demoStorage.assets.set(newFileId, {
                filename: `${channel.channel}.png`,
                url: DEMO_IMAGES.product1
            });
            return {
                ...channel,
                file_id: newFileId
            };
        });
        return {
            status: "success",
            files
        };
    }
    // Editor Projects
    async createProject(width = 1080, height = 1080, backgroundColor = "#FFFFFF") {
        await this.delay(500);
        const projectId = generateMockId();
        const project = {
            _id: projectId,
            width,
            height,
            background_color: backgroundColor,
            layers: [],
            history: [],
            future: []
        };
        demoStorage.projects.set(projectId, project);
        return {
            status: "success",
            project_id: projectId
        };
    }
    async getProject(projectId) {
        await this.delay(300);
        const project = demoStorage.projects.get(projectId);
        if (!project) {
            throw new Error("Project not found");
        }
        return project;
    }
    async addImageLayer(projectId, file, options = {}) {
        await this.delay(800);
        const project = demoStorage.projects.get(projectId);
        if (!project) throw new Error("Project not found");
        const fileId = generateMockId();
        const url = URL.createObjectURL(file);
        demoStorage.assets.set(fileId, {
            filename: file.name,
            url
        });
        const layer = {
            type: "image",
            layer_id: generateMockId(),
            file_id: fileId,
            x: options.x || 0,
            y: options.y || 0,
            width: options.width || 400,
            height: options.height || 400,
            rotation: options.rotation || 0,
            opacity: options.opacity || 1.0
        };
        project.layers.push(layer);
        return {
            status: "success",
            layer
        };
    }
    async addTextLayer(projectId, text, options = {}) {
        await this.delay(500);
        const project = demoStorage.projects.get(projectId);
        if (!project) throw new Error("Project not found");
        const layer = {
            type: "text",
            layer_id: generateMockId(),
            text,
            font_size: options.font_size || 48,
            color: options.color || "#000000",
            x: options.x || 0,
            y: options.y || 0,
            rotation: options.rotation || 0
        };
        project.layers.push(layer);
        return {
            status: "success",
            layer
        };
    }
    async updateLayer(projectId, layerId, updates) {
        await this.delay(200);
        const project = demoStorage.projects.get(projectId);
        if (!project) throw new Error("Project not found");
        const layer = project.layers.find((l)=>l.layer_id === layerId);
        if (layer) {
            Object.assign(layer, updates);
        }
        return {
            status: "success"
        };
    }
    async renderProject(projectId) {
        await this.delay(1500);
        const renderedId = generateMockId();
        demoStorage.assets.set(renderedId, {
            filename: "rendered_project.png",
            url: DEMO_IMAGES.product3
        });
        return {
            status: "success",
            rendered_file_id: renderedId
        };
    }
    async undo(projectId) {
        await this.delay(300);
        const project = demoStorage.projects.get(projectId);
        if (!project || project.layers.length === 0) {
            return {
                status: "ok",
                layers: []
            };
        }
        const lastLayer = project.layers.pop();
        if (lastLayer) {
            project.history.push(lastLayer);
        }
        return {
            status: "ok",
            layers: project.layers
        };
    }
    async redo(projectId) {
        await this.delay(300);
        const project = demoStorage.projects.get(projectId);
        if (!project || project.history.length === 0) {
            return {
                status: "ok",
                layers: project.layers
            };
        }
        const layer = project.history.pop();
        if (layer) {
            project.layers.push(layer);
        }
        return {
            status: "ok",
            layers: project.layers
        };
    }
    // Templates
    async listTemplates() {
        await this.delay(600);
        return {
            status: "success",
            templates: [
                {
                    template_id: "demo-template-1",
                    template_name: "Centered Hero",
                    width: 1080,
                    height: 1080,
                    layers_count: 3
                },
                {
                    template_id: "demo-template-2",
                    template_name: "Left Hero + Right Text",
                    width: 1080,
                    height: 1080,
                    layers_count: 3
                },
                {
                    template_id: "demo-template-3",
                    template_name: "Full Background",
                    width: 1080,
                    height: 1080,
                    layers_count: 2
                }
            ]
        };
    }
    async getTemplate(templateId) {
        await this.delay(400);
        return {
            status: "success",
            template: {
                template_id: templateId,
                template_name: "Demo Template",
                width: 1080,
                height: 1080,
                layers: []
            }
        };
    }
    async applyTemplate(projectId, templateId) {
        await this.delay(800);
        return {
            status: "success"
        };
    }
    // AI Layout Suggestions
    async getLayoutSuggestions(projectId, productImageId, options) {
        await this.delay(2000);
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
                            layer_id: generateMockId()
                        },
                        {
                            type: "text",
                            text: options?.headline || "Your Product Headline",
                            font_size: 64,
                            color: "#000000",
                            x: 150,
                            y: 920,
                            rotation: 0,
                            layer_id: generateMockId()
                        }
                    ]
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
                            layer_id: generateMockId()
                        },
                        {
                            type: "text",
                            text: options?.headline || "Your Product Headline",
                            font_size: 60,
                            color: "#000000",
                            x: 650,
                            y: 250,
                            layer_id: generateMockId()
                        }
                    ]
                }
            ]
        };
    }
    // Compliance
    async checkCompliance(projectId, retailer = "RetailerA") {
        await this.delay(1500);
        return {
            status: "success",
            violations: [
                {
                    code: "FONT_TOO_SMALL",
                    severity: "medium",
                    message: "Text layer font size 14px is smaller than required 18px",
                    layer_id: "demo-layer-1"
                },
                {
                    code: "LOW_CONTRAST",
                    severity: "high",
                    message: "Text contrast ratio 2.8 is below required 4.5",
                    layer_id: "demo-layer-2"
                }
            ]
        };
    }
    async autoFixCompliance(projectId, retailer = "RetailerA", applyChanges = true) {
        await this.delay(1200);
        return {
            status: "success",
            applied: applyChanges,
            changes: [
                {
                    layer_id: "demo-layer-1",
                    fix: "increase_font",
                    from: 14,
                    to: 18
                },
                {
                    layer_id: "demo-layer-2",
                    fix: "color_contrast",
                    from: "#777777",
                    to: "#FFFFFF"
                }
            ]
        };
    }
    // Batch Export
    async batchExport(fileIds, format = "zip", options) {
        await this.delay(3000);
        // Create a simple mock blob
        return new Blob([
            "Demo export data"
        ], {
            type: "application/zip"
        });
    }
    // Collaboration & Reviews
    async addReview(fileId, user, comment, annotations = []) {
        await this.delay(600);
        const review = {
            review_id: generateMockId(),
            file_id: fileId,
            user,
            comment,
            annotations,
            version: 1,
            timestamp: new Date().toISOString()
        };
        const reviews = demoStorage.reviews.get(fileId) || [];
        reviews.push(review);
        demoStorage.reviews.set(fileId, reviews);
        return review;
    }
    async getReviews(fileId) {
        await this.delay(400);
        return demoStorage.reviews.get(fileId) || [];
    }
    async updateReview(reviewId, user, comment, annotations = []) {
        await this.delay(500);
        // Find and update the review
        for (const [fileId, reviews] of demoStorage.reviews.entries()){
            const review = reviews.find((r)=>r.review_id === reviewId);
            if (review) {
                review.user = user;
                review.comment = comment;
                review.annotations = annotations;
                review.timestamp = new Date().toISOString();
                return review;
            }
        }
        throw new Error("Review not found");
    }
    async deleteReview(reviewId) {
        await this.delay(300);
        for (const [fileId, reviews] of demoStorage.reviews.entries()){
            const index = reviews.findIndex((r)=>r.review_id === reviewId);
            if (index !== -1) {
                reviews.splice(index, 1);
                demoStorage.reviews.set(fileId, reviews);
                return {
                    status: "success"
                };
            }
        }
        return {
            status: "success"
        };
    }
    // Helper to simulate network delay
    delay(ms) {
        return new Promise((resolve)=>setTimeout(resolve, ms));
    }
}
const demoApiClient = new DemoApiClient();
}),
"[project]/lib/api-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiClient",
    ()=>apiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demo$2d$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/demo-api-client.ts [app-ssr] (ecmascript)");
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
;
function isDemoMode() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return false;
}
class ApiClient {
    baseUrl;
    constructor(baseUrl = API_BASE_URL){
        this.baseUrl = baseUrl;
    }
    // Utility method for fetch
    async fetchApi(endpoint, options) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                ...options?.headers
            }
        });
        if (!response.ok) {
            const error = await response.json().catch(()=>({
                    detail: "Request failed"
                }));
            throw new Error(error.detail || `HTTP ${response.status}`);
        }
        return response.json();
    }
    // Asset Management
    async uploadAsset(file) {
        const demo = this.getDemoClient();
        if (demo) return demo.uploadAsset(file);
        const formData = new FormData();
        formData.append("file", file);
        return this.fetchApi("/upload-asset", {
            method: "POST",
            body: formData
        });
    }
    getAssetUrl(fileId) {
        const demo = this.getDemoClient();
        if (demo) return demo.getAssetUrl(fileId);
        return `${this.baseUrl}/asset/${fileId}`;
    }
    async deleteAsset(fileId) {
        const demo = this.getDemoClient();
        if (demo) return demo.deleteAsset(fileId);
        return this.fetchApi(`/asset/${fileId}`, {
            method: "DELETE"
        });
    }
    async removeBackground(fileId) {
        const demo = this.getDemoClient();
        if (demo) return demo.removeBackground(fileId);
        return this.fetchApi(`/remove-bg/${fileId}`);
    }
    async enhanceImage(fileId, options) {
        const demo = this.getDemoClient();
        if (demo) return demo.enhanceImage(fileId, options);
        const params = new URLSearchParams(options);
        return this.fetchApi(`/enhance/${fileId}?${params}`);
    }
    async smartEnhance(fileId, upscale = false) {
        const demo = this.getDemoClient();
        if (demo) return demo.smartEnhance(fileId, upscale);
        return this.fetchApi(`/smart-enhance/${fileId}?upscale=${upscale}`);
    }
    async smartCrop(fileId, mode, width, height) {
        const demo = this.getDemoClient();
        if (demo) return demo.smartCrop(fileId, mode, width, height);
        const params = new URLSearchParams({
            mode
        });
        if (width) params.append("width", width.toString());
        if (height) params.append("height", height.toString());
        return this.fetchApi(`/smart-crop/${fileId}?${params}`);
    }
    async autoResize(fileId, includeCustom = false, customWidth, customHeight) {
        const demo = this.getDemoClient();
        if (demo) return demo.autoResize(fileId, includeCustom, customWidth, customHeight);
        const params = new URLSearchParams({
            include_custom: includeCustom.toString()
        });
        if (customWidth) params.append("custom_width", customWidth.toString());
        if (customHeight) params.append("custom_height", customHeight.toString());
        return this.fetchApi(`/auto-resize/${fileId}?${params}`);
    }
    // Editor Projects
    async createProject(width = 1080, height = 1080, backgroundColor = "#FFFFFF") {
        const demo = this.getDemoClient();
        if (demo) return demo.createProject(width, height, backgroundColor);
        const params = new URLSearchParams({
            width: width.toString(),
            height: height.toString(),
            background_color: backgroundColor
        });
        return this.fetchApi(`/editor/create-project?${params}`, {
            method: "POST"
        });
    }
    async getProject(projectId) {
        const demo = this.getDemoClient();
        if (demo) return demo.getProject(projectId);
        return this.fetchApi(`/editor/${projectId}`);
    }
    async addImageLayer(projectId, file, options = {}) {
        const demo = this.getDemoClient();
        if (demo) return demo.addImageLayer(projectId, file, options);
        const formData = new FormData();
        formData.append("file", file);
        Object.entries(options).forEach(([key, value])=>{
            if (value !== undefined) formData.append(key, value.toString());
        });
        return this.fetchApi(`/editor/${projectId}/add-image-layer`, {
            method: "POST",
            body: formData
        });
    }
    async addTextLayer(projectId, text, options = {}) {
        const demo = this.getDemoClient();
        if (demo) return demo.addTextLayer(projectId, text, options);
        const params = new URLSearchParams({
            text,
            ...Object.fromEntries(Object.entries(options).map(([k, v])=>[
                    k,
                    String(v)
                ]))
        });
        return this.fetchApi(`/editor/${projectId}/add-text-layer?${params}`, {
            method: "POST"
        });
    }
    async updateLayer(projectId, layerId, updates) {
        const demo = this.getDemoClient();
        if (demo) return demo.updateLayer(projectId, layerId, updates);
        return this.fetchApi(`/editor/${projectId}/update-layer/${layerId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updates)
        });
    }
    async renderProject(projectId) {
        const demo = this.getDemoClient();
        if (demo) return demo.renderProject(projectId);
        return this.fetchApi(`/editor/${projectId}/render`);
    }
    async undo(projectId) {
        const demo = this.getDemoClient();
        if (demo) return demo.undo(projectId);
        return this.fetchApi(`/editor/${projectId}/undo`, {
            method: "POST"
        });
    }
    async redo(projectId) {
        const demo = this.getDemoClient();
        if (demo) return demo.redo(projectId);
        return this.fetchApi(`/editor/${projectId}/redo`, {
            method: "POST"
        });
    }
    // Templates
    async listTemplates() {
        const demo = this.getDemoClient();
        if (demo) return demo.listTemplates();
        return this.fetchApi("/templates");
    }
    async getTemplate(templateId) {
        const demo = this.getDemoClient();
        if (demo) return demo.getTemplate(templateId);
        return this.fetchApi(`/templates/${templateId}`);
    }
    async applyTemplate(projectId, templateId) {
        const demo = this.getDemoClient();
        if (demo) return demo.applyTemplate(projectId, templateId);
        return this.fetchApi(`/editor/${projectId}/apply-template/${templateId}`, {
            method: "POST"
        });
    }
    // AI Layout Suggestions
    async getLayoutSuggestions(projectId, productImageId, options) {
        const demo = this.getDemoClient();
        if (demo) return demo.getLayoutSuggestions(projectId, productImageId, options);
        const params = new URLSearchParams({
            project_id: projectId,
            product_image_id: productImageId,
            ...options?.logoImageId && {
                logo_image_id: options.logoImageId
            },
            ...options?.headline && {
                headline: options.headline
            },
            ...options?.ctaText && {
                cta_text: options.ctaText
            }
        });
        return this.fetchApi(`/ai/layout-suggestions?${params}`, {
            method: "POST"
        });
    }
    // Compliance
    async checkCompliance(projectId, retailer = "RetailerA") {
        const demo = this.getDemoClient();
        if (demo) return demo.checkCompliance(projectId, retailer);
        return this.fetchApi(`/compliance/check/${projectId}?retailer=${retailer}`);
    }
    async autoFixCompliance(projectId, retailer = "RetailerA", applyChanges = true) {
        const demo = this.getDemoClient();
        if (demo) return demo.autoFixCompliance(projectId, retailer, applyChanges);
        return this.fetchApi(`/compliance/autofix/${projectId}?retailer=${retailer}&apply_changes=${applyChanges}`, {
            method: "POST"
        });
    }
    // Batch Export
    async batchExport(fileIds, format = "zip", options) {
        const demo = this.getDemoClient();
        if (demo) return demo.batchExport(fileIds, format, options);
        const response = await fetch(`${this.baseUrl}/batch-export`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                file_ids: fileIds,
                format,
                quality: options?.quality || 85,
                resize_width: options?.resizeWidth,
                resize_height: options?.resizeHeight
            })
        });
        if (!response.ok) {
            throw new Error("Batch export failed");
        }
        return response.blob();
    }
    // Collaboration & Reviews
    async addReview(fileId, user, comment, annotations = []) {
        const demo = this.getDemoClient();
        if (demo) return demo.addReview(fileId, user, comment, annotations);
        return this.fetchApi("/review/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                file_id: fileId,
                user,
                comment,
                annotations
            })
        });
    }
    async getReviews(fileId) {
        const demo = this.getDemoClient();
        if (demo) return demo.getReviews(fileId);
        return this.fetchApi(`/review/${fileId}`);
    }
    async updateReview(reviewId, user, comment, annotations = []) {
        const demo = this.getDemoClient();
        if (demo) return demo.updateReview(reviewId, user, comment, annotations);
        return this.fetchApi(`/review/update/${reviewId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                file_id: "",
                user,
                comment,
                annotations
            })
        });
    }
    async deleteReview(reviewId) {
        const demo = this.getDemoClient();
        if (demo) return demo.deleteReview(reviewId);
        return this.fetchApi(`/review/delete/${reviewId}`, {
            method: "DELETE"
        });
    }
    getDemoClient() {
        return isDemoMode() ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demo$2d$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["demoApiClient"] : null;
    }
}
const apiClient = new ApiClient();
}),
"[project]/app/(dashboard)/templates/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TemplatesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$template$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutTemplate$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-template.js [app-ssr] (ecmascript) <export default as LayoutTemplate>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-toast.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
function TemplatesPage() {
    const [templates, setTemplates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadTemplates();
    }, []);
    const loadTemplates = async ()=>{
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].listTemplates();
            setTemplates(result.templates);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load templates",
                variant: "destructive"
            });
        } finally{
            setLoading(false);
        }
    };
    const handleUseTemplate = async (templateId)=>{
        setLoading(true);
        try {
            // Create new project
            const projectResult = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].createProject();
            // Apply template
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].applyTemplate(projectResult.project_id, templateId);
            toast({
                title: "Template applied",
                description: "Opening editor..."
            });
            // Navigate to editor
            router.push(`/editor?project=${projectResult.project_id}`);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to apply template",
                variant: "destructive"
            });
            setLoading(false);
        }
    };
    const filteredTemplates = templates.filter((template)=>template.template_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-border bg-card px-8 py-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold tracking-tight",
                                children: "Template Library"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-muted-foreground",
                                children: "Pre-designed layouts optimized for retail media"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                lineNumber: 76,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/templates/page.tsx",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/templates/page.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/templates/page.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-border bg-card px-8 py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex-1 max-w-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                lineNumber: 85,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                placeholder: "Search templates...",
                                className: "pl-9",
                                value: searchQuery,
                                onChange: (e)=>setSearchQuery(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/templates/page.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/templates/page.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/templates/page.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-auto p-8",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-full items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                lineNumber: 101,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 text-sm text-muted-foreground",
                                children: "Loading templates..."
                            }, void 0, false, {
                                fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                lineNumber: 102,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(dashboard)/templates/page.tsx",
                        lineNumber: 100,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(dashboard)/templates/page.tsx",
                    lineNumber: 99,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
                    children: [
                        filteredTemplates.map((template)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                className: "overflow-hidden transition-all hover:border-primary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$template$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutTemplate$3e$__["LayoutTemplate"], {
                                            className: "h-16 w-16 text-primary/50"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                            lineNumber: 110,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                        lineNumber: 109,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                            className: "text-base text-balance",
                                                            children: template.template_name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                                            lineNumber: 115,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                            className: "mt-1",
                                                            children: [
                                                                template.width,
                                                                " x ",
                                                                template.height,
                                                                "px"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                                            lineNumber: 116,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                                    lineNumber: 114,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "secondary",
                                                    children: [
                                                        template.layers_count,
                                                        " layers"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                            lineNumber: 113,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                        lineNumber: 112,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            className: "w-full",
                                            onClick: ()=>handleUseTemplate(template.template_id),
                                            disabled: loading,
                                            children: "Use Template"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                            lineNumber: 124,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                        lineNumber: 123,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, template.template_id, true, {
                                fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                lineNumber: 108,
                                columnNumber: 15
                            }, this)),
                        filteredTemplates.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-full flex h-64 items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$template$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutTemplate$3e$__["LayoutTemplate"], {
                                        className: "mx-auto h-12 w-12 text-muted-foreground opacity-20"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                        lineNumber: 134,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-4 text-sm text-muted-foreground",
                                        children: "No templates found"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                        lineNumber: 135,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(dashboard)/templates/page.tsx",
                                lineNumber: 133,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(dashboard)/templates/page.tsx",
                            lineNumber: 132,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(dashboard)/templates/page.tsx",
                    lineNumber: 106,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(dashboard)/templates/page.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(dashboard)/templates/page.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Search
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const Search = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("Search", [
    [
        "circle",
        {
            cx: "11",
            cy: "11",
            r: "8",
            key: "4ej97u"
        }
    ],
    [
        "path",
        {
            d: "m21 21-4.3-4.3",
            key: "1qie3q"
        }
    ]
]);
;
 //# sourceMappingURL=search.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Search",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=_336200de._.js.map
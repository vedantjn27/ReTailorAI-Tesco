import os
import io
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pymongo import MongoClient
from bson import ObjectId
import gridfs
from PIL import Image, ImageEnhance
from rembg import remove
from bson import ObjectId
from bson.errors import InvalidId
from PIL import ImageDraw, ImageFont, ImageStat, ImageOps
import numpy as np
from pydantic import BaseModel
from typing import List, Optional, Union, Dict
import math
import cv2
import zipfile
from datetime import datetime

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "RetailorAI")

# Initialize FastAPI
app = FastAPI(title="ReTailor AI Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB + GridFS
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
fs = gridfs.GridFS(db)

# Create folders
os.makedirs("tmp", exist_ok=True)
os.makedirs("processed", exist_ok=True)

# Utility
def pil_to_bytes(img: Image.Image):
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf

#AI Creative Builder Endpoints
# 1. UPLOAD ASSET (store in GridFS + save to /tmp)
@app.post("/upload-asset")
async def upload_asset(file: UploadFile = File(...)):
    try:
        file_data = await file.read()
        file_id = fs.put(file_data, filename=file.filename, content_type=file.content_type)

        # save copy locally
        tmp_path = f"tmp/{file_id}.png"
        with open(tmp_path, "wb") as f:
            f.write(file_data)

        return {
            "status": "success",
            "file_id": str(file_id),
            "filename": file.filename,
            "tmp_path": tmp_path
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# 2. REMOVE BACKGROUND — using EXISTING UPLOADED FILE (file_id)
@app.get("/remove-bg/{file_id}")
def remove_background_by_id(file_id: str):
    try:
        file_obj = fs.get(ObjectId(file_id))
        image = Image.open(io.BytesIO(file_obj.read())).convert("RGBA")

        output = remove(image)

        # save processed image to bytes
        buffer = pil_to_bytes(output)
        new_file_id = fs.put(buffer.getvalue(), filename=f"{file_id}_bg_removed.png", content_type="image/png")

        # also save file locally
        processed_path = f"processed/{new_file_id}.png"
        output.save(processed_path)

        return {
            "status": "success",
            "operation": "background_removed",
            "new_file_id": str(new_file_id)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Background removal failed: {str(e)}")

# 3. ENHANCE IMAGE — using EXISTING UPLOADED FILE (file_id)
@app.get("/enhance/{file_id}")
def enhance_image_by_id(
    file_id: str,
    sharpness: float = 1.2,
    contrast: float = 1.15,
    brightness: float = 1.1
):
    try:
        file_obj = fs.get(ObjectId(file_id))
        img = Image.open(io.BytesIO(file_obj.read()))

        # apply enhancements
        img = ImageEnhance.Sharpness(img).enhance(sharpness)
        img = ImageEnhance.Contrast(img).enhance(contrast)
        img = ImageEnhance.Brightness(img).enhance(brightness)

        buffer = pil_to_bytes(img)
        new_file_id = fs.put(buffer.getvalue(), filename=f"{file_id}_enhanced.png", content_type="image/png")

        # save locally
        processed_path = f"processed/{new_file_id}.png"
        img.save(processed_path)

        return {
            "status": "success",
            "operation": "enhanced",
            "new_file_id": str(new_file_id)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Enhancement failed: {str(e)}")

# 4. FETCH ASSET
@app.get("/asset/{file_id}")
def get_asset(file_id: str):
    try:
        file = fs.get(ObjectId(file_id))
        return StreamingResponse(io.BytesIO(file.read()), media_type=file.content_type)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found")

# 5. DELETE ASSET
@app.delete("/asset/{file_id}")
def delete_asset(file_id: str):
    try:
        fs.delete(ObjectId(file_id))
        return {"status": "deleted", "file_id": file_id}
    except Exception:
        raise HTTPException(status_code=404, detail="Cannot delete file")
    
# 6. Crop Asset
@app.get("/crop/{file_id}")
def crop_image(file_id: str, mode: str = "square"):
    try:
        file_obj = fs.get(ObjectId(file_id))
        img = Image.open(io.BytesIO(file_obj.read()))
        
        # Crop logic based on mode
        width, height = img.size
        if mode == "square":
            size = min(width, height)
            img = ImageOps.fit(img, (size, size), Image.LANCZOS)
        elif mode == "portrait":
            # 4:5 ratio
            target_width = int(height * 4 / 5)
            img = ImageOps.fit(img, (target_width, height), Image.LANCZOS)
        elif mode == "landscape":
            # 16:9 ratio
            target_height = int(width * 9 / 16)
            img = ImageOps.fit(img, (width, target_height), Image.LANCZOS)
        
        buffer = pil_to_bytes(img)
        new_file_id = fs.put(buffer.getvalue(), filename=f"{file_id}_cropped_{mode}.png", content_type="image/png")
        
        return {
            "status": "success",
            "operation": f"cropped_{mode}",
            "new_file_id": str(new_file_id)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crop failed: {str(e)}")
    
# 7. Get A list of all assets   
@app.get("/assets")
def list_all_assets():
    try:
        assets = []
        # Get all files from GridFS
        for grid_file in fs.find():
            assets.append({
                "file_id": str(grid_file._id),
                "filename": grid_file.filename,
                "uploaded_at": grid_file.upload_date.isoformat() if grid_file.upload_date else datetime.now().isoformat(),
                "content_type": grid_file.content_type if hasattr(grid_file, 'content_type') else 'image/png',
                # Determine type based on filename
                "type": "enhanced" if "enhanced" in grid_file.filename.lower() 
                       else "cropped" if "cropped" in grid_file.filename.lower() 
                       else "image"
            })
        
        # Sort by upload date (newest first)
        assets.sort(key=lambda x: x["uploaded_at"], reverse=True)
        
        return {
            "status": "success",
            "count": len(assets),
            "assets": assets
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list assets: {str(e)}")
    
#  DRAG-AND-DROP EDITOR 
def snapshot_project(project_id):
    project = db.editor_projects.find_one({"_id": ObjectId(project_id)})
    if not project:
        return

    # remove _id so MongoDB does not complain when restoring
    project_copy = {k: v for k, v in project.items() if k != "_id"}

    db.editor_projects.update_one(
        {"_id": ObjectId(project_id)},
        {
            "$push": {"history": project_copy},
            "$set": {"future": []}  # clear redo stack
        }
    )
    
# 1) CREATE A NEW PROJECT / CANVAS
@app.post("/editor/create-project")
def create_project(
    width: int = 1080,
    height: int = 1080,
    background_color: str = "#FFFFFF"
):
    project = {
        "width": width,
        "height": height,
        "background_color": background_color,
        "layers": [],
        "history": [],   # <-- REQUIRED
        "future": []     # <-- REQUIRED
    }

    result = db.editor_projects.insert_one(project)

    return {"status": "success", "project_id": str(result.inserted_id)}

# 2) ADD IMAGE LAYER
@app.post("/editor/{project_id}/add-image-layer")
async def add_image_layer(
    project_id: str,
    file: UploadFile = File(...),
    x: int = 0,
    y: int = 0,
    width: int = 400,
    height: int = 400,
    rotation: float = 0.0,
    opacity: float = 1.0
):

    # Take snapshot BEFORE applying changes
    snapshot_project(project_id)

    # Save file in GridFS
    file_data = await file.read()
    file_id = fs.put(file_data, filename=file.filename, content_type=file.content_type)

    layer = {
        "type": "image",
        "file_id": str(file_id),
        "x": x,
        "y": y,
        "width": width,
        "height": height,
        "rotation": rotation,
        "opacity": opacity,
        "layer_id": str(ObjectId())
    }

    # Save layer in DB
    db.editor_projects.update_one(
        {"_id": ObjectId(project_id)},
        {"$push": {"layers": layer}}
    )

    return {
        "status": "success",
        "layer": layer
    }

# 3) ADD TEXT LAYER
@app.post("/editor/{project_id}/add-text-layer")
def add_text_layer(
    project_id: str,
    text: str,
    font_size: int = 48,
    color: str = "#000000",
    x: int = 0,
    y: int = 0,
    rotation: float = 0.0
):

    # Take snapshot BEFORE applying changes
    snapshot_project(project_id)

    layer = {
        "type": "text",
        "text": text,
        "font_size": font_size,
        "color": color,
        "x": x,
        "y": y,
        "rotation": rotation,
        "layer_id": str(ObjectId())
    }

    db.editor_projects.update_one(
        {"_id": ObjectId(project_id)},
        {"$push": {"layers": layer}}
    )

    return {
        "status": "success",
        "layer": layer
    }

# 4) UPDATE A LAYER (position, size, text, etc.)
@app.put("/editor/{project_id}/update-layer/{layer_id}")
def update_layer(project_id: str, layer_id: str, updates: dict):

    snapshot_project(project_id)  # <-- NEW

    db.editor_projects.update_one(
        {"_id": ObjectId(project_id), "layers.layer_id": layer_id},
        {"$set": {f"layers.$.{k}": v for k, v in updates.items()}}
    )
    return {"status": "success", "updated": updates}

# 5) GET FULL PROJECT (all layers)
@app.get("/editor/{project_id}")
def get_editor_project(project_id: str):
    project = db.editor_projects.find_one({"_id": ObjectId(project_id)})

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project["_id"] = str(project["_id"])
    return project

# 6) RENDER FINAL CREATIVE (MERGE ALL LAYERS)
@app.get("/editor/{project_id}/render")
def render_project(project_id: str):
    project = db.editor_projects.find_one({"_id": ObjectId(project_id)})

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Base canvas
    canvas = Image.new("RGBA", (project["width"], project["height"]), project["background_color"])

    for layer in project["layers"]:
        if layer["type"] == "image":
            try:
                file_obj = fs.get(ObjectId(layer["file_id"]))
            except (InvalidId, Exception):
                print("Skipping invalid image layer:", layer["file_id"])
            continue
            img = Image.open(io.BytesIO(file_obj.read())).convert("RGBA")

            img = img.resize((layer["width"], layer["height"]))

            if layer["rotation"] != 0:
                img = img.rotate(layer["rotation"], expand=True)

            # Apply opacity
            if layer["opacity"] < 1.0:
                alpha = img.split()[3]
                alpha = alpha.point(lambda p: p * layer["opacity"])
                img.putalpha(alpha)

            canvas.paste(img, (layer["x"], layer["y"]), img)

        elif layer["type"] == "text":
            from PIL import ImageDraw, ImageFont

            draw = ImageDraw.Draw(canvas)

            try:
                font = ImageFont.truetype("arial.ttf", layer["font_size"])
            except:
                font = ImageFont.load_default()

            draw.text((layer["x"], layer["y"]), layer["text"], fill=layer["color"], font=font)

    # save to GridFS
    buffer = io.BytesIO()
    canvas.save(buffer, format="PNG")
    buffer.seek(0)

    new_file_id = fs.put(buffer.getvalue(), filename=f"{project_id}_final.png", content_type="image/png")

    return {
        "status": "success",
        "rendered_file_id": str(new_file_id)
    }

#download rendered image
@app.get("/editor/rendered/{file_id}/download")
def download_rendered_image(file_id: str):
    try:
        file = fs.get(ObjectId(file_id))
        return StreamingResponse(
            io.BytesIO(file.read()),
            media_type="image/png",
            headers={"Content-Disposition": "attachment; filename=creative.png"}
        )
    except:
        raise HTTPException(404, "Rendered file not found")

# 7) UNDO
@app.post("/editor/{project_id}/undo")
def undo(project_id: str):
    project = db.editor_projects.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(404, "Project not found")

    history = project.get("history", [])
    future = project.get("future", [])

    if not history:
        raise HTTPException(400, "Nothing to undo")

    last_state = history.pop()

    db.editor_projects.update_one(
        {"_id": ObjectId(project_id)},
        {
            "$set": {
                "layers": last_state,
                "history": history,   # write full arrays to avoid conflicts
                "future": future + [project["layers"]],
            }
        }
    )
    return {"status": "ok", "layers": last_state}

# 8) REDO
@app.post("/editor/{project_id}/redo")
def redo(project_id: str):
    project = db.editor_projects.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(404, "Project not found")

    future = project.get("future", [])
    history = project.get("history", [])

    if not future:
        raise HTTPException(400, "Nothing to redo")

    next_state = future.pop()

    db.editor_projects.update_one(
        {"_id": ObjectId(project_id)},
        {
            "$set": {
                "layers": next_state,
                "future": future,    # no $push (avoid conflict)
                "history": history + [project["layers"]],
            }
        }
    )
    return {"status": "ok", "layers": next_state}

#   AI LAYOUT SUGGESTION ENGINE
def get_image_focal_point(img: Image.Image):
    # simple heuristic for focal point: find brightest cluster
    small = img.convert("L").resize((32, 32))
    arr = np.array(small)
    y, x = np.unravel_index(np.argmax(arr), arr.shape)
    
    return int(x * (img.width / 32)), int(y * (img.height / 32))

def get_dominant_color(img: Image.Image):
    img = img.resize((50, 50))
    pixels = np.array(img).reshape(-1, 3)
    avg = np.mean(pixels, axis=0)
    return tuple(avg.astype(int))

def suggest_text_color(bg_color):
    r, g, b = bg_color
    brightness = (r*299 + g*587 + b*114) / 1000
    return "#000000" if brightness > 130 else "#FFFFFF"

@app.post("/ai/layout-suggestions")
async def ai_layout_suggestions(
    project_id: str,
    product_image_id: str,
    logo_image_id: str = None,
    headline: str = "Your Product Headline",
    cta_text: str = "Shop Now"
):
    # Load product image
    img_file = fs.get(ObjectId(product_image_id))
    product_img = Image.open(io.BytesIO(img_file.read())).convert("RGB")

    focal_x, focal_y = get_image_focal_point(product_img)
    dominant_color = get_dominant_color(product_img)
    text_color = suggest_text_color(dominant_color)

    suggestions = []

    # LAYOUT 1: Centered Product, Bottom Text
    suggestions.append({
        "layout_name": "Centered Hero",
        "layers": [
            {
                "type": "image",
                "file_id": product_image_id,
                "x": 200,
                "y": 200,
                "width": 680,
                "height": 680,
                "rotation": 0,
                "opacity": 1.0,
                "layer_id": str(ObjectId())
            },
            {
                "type": "text",
                "text": headline,
                "font_size": 64,
                "color": text_color,
                "x": 150,
                "y": 920,
                "rotation": 0,
                "layer_id": str(ObjectId())
            },
            {
                "type": "text",
                "text": cta_text,
                "font_size": 48,
                "color": text_color,
                "x": 380,
                "y": 1000,
                "rotation": 0,
                "layer_id": str(ObjectId())
            }
        ]
    })

    # LAYOUT 2: Left Product, Right Text
    suggestions.append({
        "layout_name": "Left Hero + Right Text",
        "layers": [
            {
                "type": "image",
                "file_id": product_image_id,
                "x": 100,
                "y": 200,
                "width": 500,
                "height": 500,
                "rotation": 0,
                "layer_id": str(ObjectId())
            },
            {
                "type": "text",
                "text": headline,
                "font_size": 60,
                "color": text_color,
                "x": 650,
                "y": 250,
                "layer_id": str(ObjectId())
            },
            {
                "type": "text",
                "text": cta_text,
                "font_size": 46,
                "color": text_color,
                "x": 650,
                "y": 350,
                "layer_id": str(ObjectId())
            }
        ]
    })

    # LAYOUT 3: Full Background + Floating Product
    suggestions.append({
        "layout_name": "Full Background",
        "layers": [
            {
                "type": "image",
                "file_id": product_image_id,
                "x": focal_x - 300,
                "y": focal_y - 300,
                "width": 600,
                "height": 600,
                "rotation": 0,
                "opacity": 1.0,
                "layer_id": str(ObjectId())
            },
            {
                "type": "text",
                "text": headline,
                "font_size": 62,
                "color": text_color,
                "x": 100,
                "y": 900,
                "layer_id": str(ObjectId())
            }
        ]
    })

    # OPTIONAL LOGO SUPPORT
    if logo_image_id:
        for s in suggestions:
            s["layers"].append({
                "type": "image",
                "file_id": logo_image_id,
                "x": 850,
                "y": 50,
                "width": 180,
                "height": 180,
                "rotation": 0,
                "opacity": 1.0,
                "layer_id": str(ObjectId())
            })

    return {
        "status": "success",
        "suggestions_count": len(suggestions),
        "suggestions": suggestions
    }

#   TEMPLATE LIBRARY ENDPOINTS
class Layer(BaseModel):
    type: str
    file_id: Optional[str] = None
    text: Optional[str] = None
    font_size: Optional[int] = None
    color: Optional[str] = None
    x: int = 0
    y: int = 0
    width: Optional[int] = None
    height: Optional[int] = None
    rotation: float = 0.0
    opacity: float = 1.0

class TemplateCreate(BaseModel):
    template_name: str
    width: int = 1080
    height: int = 1080
    background_color: str = "#FFFFFF"
    layers: List[Layer] = []

# 1) ADD NEW TEMPLATE
@app.post("/templates/add")
async def add_template(template: TemplateCreate):
    template_dict = template.dict()
    result = db.editor_templates.insert_one(template_dict)
    return {"status": "success", "template_id": str(result.inserted_id)}

# 2) LIST ALL TEMPLATES
@app.get("/templates")
def list_templates():
    templates = []
    for t in db.editor_templates.find():
        templates.append({
            "template_id": str(t["_id"]),
            "template_name": t["template_name"],
            "width": t["width"],
            "height": t["height"],
            "layers_count": len(t["layers"])
        })
    return {"status": "success", "templates": templates}

# 3) GET TEMPLATE DETAILS
@app.get("/templates/{template_id}")
def get_template(template_id: str):
    template = db.editor_templates.find_one({"_id": ObjectId(template_id)})
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    template["_id"] = str(template["_id"])
    return {"status": "success", "template": template}

# 4) APPLY TEMPLATE TO PROJECT
@app.post("/editor/{project_id}/apply-template/{template_id}")
def apply_template_to_project(project_id: str, template_id: str):
    template = db.editor_templates.find_one({"_id": ObjectId(template_id)})
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    # copy layers into project
    new_layers = []
    for layer in template["layers"]:
        new_layer = layer.copy()
        new_layer["layer_id"] = str(ObjectId())  # unique id for project layer
        new_layers.append(new_layer)

    db.editor_projects.update_one(
        {"_id": ObjectId(project_id)},
        {"$push": {"layers": {"$each": new_layers}}}
    )

    return {"status": "success", "added_layers": len(new_layers)}

#   PRE-POPULATE TEMPLATES
@app.on_event("startup")
def create_default_templates():
    existing = db.editor_templates.count_documents({})
    if existing > 0:
        print(f"Templates already exist: {existing}")
        return

    templates = []

    # 1) Centered Hero
    templates.append({
        "template_name": "Centered Hero",
        "width": 1080,
        "height": 1080,
        "background_color": "#FFFFFF",
        "layers": [
            {"type": "image", "file_id": "", "x": 200, "y": 200, "width": 680, "height": 680, "rotation": 0, "opacity": 1.0, "layer_id": str(ObjectId())},
            {"type": "text", "text": "Your Headline Here", "font_size": 64, "color": "#000000", "x": 150, "y": 920, "rotation": 0, "layer_id": str(ObjectId())},
            {"type": "text", "text": "Shop Now", "font_size": 48, "color": "#000000", "x": 380, "y": 1000, "rotation": 0, "layer_id": str(ObjectId())}
        ]
    })

    # 2) Left Hero + Right Text
    templates.append({
        "template_name": "Left Hero + Right Text",
        "width": 1080,
        "height": 1080,
        "background_color": "#FFFFFF",
        "layers": [
            {"type": "image", "file_id": "", "x": 100, "y": 200, "width": 500, "height": 500, "rotation": 0, "layer_id": str(ObjectId())},
            {"type": "text", "text": "Your Headline Here", "font_size": 60, "color": "#000000", "x": 650, "y": 250, "rotation": 0, "layer_id": str(ObjectId())},
            {"type": "text", "text": "Shop Now", "font_size": 46, "color": "#000000", "x": 650, "y": 350, "rotation": 0, "layer_id": str(ObjectId())}
        ]
    })

    # 3) Full Background + Floating Product
    templates.append({
        "template_name": "Full Background",
        "width": 1080,
        "height": 1080,
        "background_color": "#FFFFFF",
        "layers": [
            {"type": "image", "file_id": "", "x": 240, "y": 240, "width": 600, "height": 600, "rotation": 0, "opacity": 1.0, "layer_id": str(ObjectId())},
            {"type": "text", "text": "Your Headline Here", "font_size": 62, "color": "#000000", "x": 100, "y": 900, "rotation": 0, "layer_id": str(ObjectId())}
        ]
    })

    db.editor_templates.insert_many(templates)
    print("Default templates inserted successfully!")

#   REAL-TIME COMPLIANCE ENGINE
# --- Helper utilities -----------------------------------------------------
def relative_luminance(rgb):
    # rgb: (r,g,b) 0-255
    def channel(c):
        c = c / 255.0
        return c/12.92 if c <= 0.03928 else ((c + 0.055)/1.055) ** 2.4
    r, g, b = rgb
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

def contrast_ratio(rgb1, rgb2):
    L1 = relative_luminance(rgb1)
    L2 = relative_luminance(rgb2)
    lighter = max(L1, L2)
    darker = min(L1, L2)
    return (lighter + 0.05) / (darker + 0.05)

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def sample_canvas_region(img: Image.Image, bbox):
    # bbox = (x,y,w,h)
    x,y,w,h = bbox
    x = max(0, int(x)); y = max(0, int(y))
    w = max(1, int(w)); h = max(1, int(h))
    crop = img.crop((x, y, min(img.width, x+w), min(img.height, y+h)))
    if crop.width == 0 or crop.height == 0:
        return (255,255,255)
    stat = ImageStat.Stat(crop)
    return tuple(int(v) for v in stat.mean[:3])

# --- Retailer guideline templates (insert if not present) -----------------
@app.on_event("startup")
def ensure_default_retailer_guidelines():
    existing = db.retailer_guidelines.count_documents({})
    if existing > 0:
        return
    guidelines = [
        {
            "retailer": "RetailerA",
            "rules": {
                "min_font_size": 18,               # px
                "min_contrast_ratio": 4.5,         # WCAG AA for normal text
                "logo_safe_margin_pct": 0.05,      # % of shorter side as margin
                "max_text_coverage_pct": 0.25,     # text should not cover >25% of canvas
                "required_file_resolution": [800, 800], # min width,height
                "forbidden_areas": []              # list of bbox to avoid
            }
        },
        {
            "retailer": "RetailerB",
            "rules": {
                "min_font_size": 14,
                "min_contrast_ratio": 3.0,
                "logo_safe_margin_pct": 0.03,
                "max_text_coverage_pct": 0.30,
                "required_file_resolution": [600, 600],
                "forbidden_areas": []
            }
        }
    ]
    db.retailer_guidelines.insert_many(guidelines)
    print("Inserted default retailer guidelines")

# --- Render helper (re-use existing render logic) -------------------------
def render_project_image(project_id: str) -> Image.Image:
    proj = db.editor_projects.find_one({"_id": ObjectId(project_id)})
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    canvas = Image.new("RGBA", (proj["width"], proj["height"]), proj.get("background_color", "#FFFFFF"))
    for layer in proj.get("layers", []):
        if layer.get("type") == "image":
            try:
                file_obj = fs.get(ObjectId(layer["file_id"]))
            except Exception:
                continue
            img = Image.open(io.BytesIO(file_obj.read())).convert("RGBA")
            img = img.resize((int(layer.get("width", img.width)), int(layer.get("height", img.height))))
            if layer.get("rotation", 0):
                img = img.rotate(layer.get("rotation", 0), expand=True)
            if layer.get("opacity", 1.0) < 1.0:
                alpha = img.split()[3].point(lambda p: int(p * layer.get("opacity", 1.0)))
                img.putalpha(alpha)
            canvas.paste(img, (int(layer.get("x", 0)), int(layer.get("y", 0))), img)
        elif layer.get("type") == "text":
            draw = ImageDraw.Draw(canvas)
            try:
                font = ImageFont.truetype("arial.ttf", int(layer.get("font_size", 24)))
            except Exception:
                font = ImageFont.load_default()
            draw.text((int(layer.get("x", 0)), int(layer.get("y", 0))), layer.get("text", ""),
                      fill=layer.get("color", "#000000"), font=font)
    return canvas.convert("RGB")

# --- Compliance check core -----------------------------------------------
@app.get("/compliance/check/{project_id}")
def compliance_check(project_id: str, retailer: str = "RetailerA"):
    # load guidelines
    guideline = db.retailer_guidelines.find_one({"retailer": retailer})
    if not guideline:
        raise HTTPException(status_code=404, detail="Retailer guideline not found")

    rules = guideline["rules"]
    proj = db.editor_projects.find_one({"_id": ObjectId(project_id)})
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    canvas_img = render_project_image(project_id)
    violations = []

    # 1) resolution check
    min_w, min_h = rules.get("required_file_resolution", [0, 0])
    if proj["width"] < min_w or proj["height"] < min_h:
        violations.append({
            "code": "RESOLUTION_LOW",
            "severity": "high",
            "message": f"Canvas resolution {proj['width']}x{proj['height']} is below required {min_w}x{min_h}"
        })

    # 2) text size + contrast + text coverage
    total_text_pixels = 0
    for layer in proj.get("layers", []):
        if layer.get("type") == "text":
            font_size = int(layer.get("font_size", 16))
            if font_size < rules.get("min_font_size", 12):
                violations.append({
                    "code": "FONT_TOO_SMALL",
                    "severity": "medium",
                    "layer_id": layer.get("layer_id"),
                    "message": f"Text layer font size {font_size}px is smaller than required {rules.get('min_font_size')}px"
                })

            # approximate text bounding box by rendering text to temp image
            try:
                tmp = Image.new("RGB", (proj["width"], proj["height"]), (255,255,255))
                draw = ImageDraw.Draw(tmp)
                try:
                    font = ImageFont.truetype("arial.ttf", font_size)
                except Exception:
                    font = ImageFont.load_default()
                bbox = draw.textbbox((layer.get("x",0), layer.get("y",0)), layer.get("text",""), font=font)
                x0,y0,x1,y1 = bbox
                w = x1 - x0; h = y1 - y0
                total_text_pixels += w*h

                # sample background color under text region
                sampled = sample_canvas_region(canvas_img, (x0,y0,w,h))
                text_rgb = hex_to_rgb(layer.get("color","#000000"))
                cr = contrast_ratio(text_rgb, sampled)
                if cr < rules.get("min_contrast_ratio", 4.5):
                    violations.append({
                        "code": "LOW_CONTRAST",
                        "severity": "high" if cr < 3 else "medium",
                        "layer_id": layer.get("layer_id"),
                        "message": f"Text contrast ratio {cr:.2f} is below required {rules.get('min_contrast_ratio')}"
                    })
            except Exception:
                # best-effort — if bbox measurement fails, skip
                pass

    text_coverage = total_text_pixels / (proj["width"] * proj["height"])
    if text_coverage > rules.get("max_text_coverage_pct", 0.3):
        violations.append({
            "code": "TEXT_TOO_MUCH",
            "severity": "medium",
            "message": f"Text covers {text_coverage*100:.1f}% of canvas which exceeds allowed {rules.get('max_text_coverage_pct')*100:.0f}%"
        })

    # 3) logo placement / safe margins
    # find layers of type image named 'logo' by convention (you may add layer.meta)
    short_side = min(proj["width"], proj["height"])
    min_logo_margin = int(short_side * rules.get("logo_safe_margin_pct", 0.05))

    for layer in proj.get("layers", []):
        if layer.get("type") == "image" and layer.get("meta", {}).get("role") == "logo":
            lx, ly, lw, lh = int(layer.get("x",0)), int(layer.get("y",0)), int(layer.get("width",0)), int(layer.get("height",0))
            # if logo too close to edges
            if lx < min_logo_margin or ly < min_logo_margin or (proj["width"] - (lx+lw)) < min_logo_margin or (proj["height"] - (ly+lh)) < min_logo_margin:
                violations.append({
                    "code": "LOGO_MARGIN_VIOLATION",
                    "severity": "low",
                    "layer_id": layer.get("layer_id"),
                    "message": f"Logo is closer than {min_logo_margin}px to canvas edge; move inward to meet safe margin"
                })

    # 4) overlapping important elements - naive check: image-image overlap > threshold
    img_layers = [l for l in proj.get("layers", []) if l.get("type")=="image"]
    for i in range(len(img_layers)):
        for j in range(i+1, len(img_layers)):
            a = img_layers[i]; b = img_layers[j]
            ax,ay,aw,ah = a.get("x",0), a.get("y",0), a.get("width",0), a.get("height",0)
            bx,by,bw,bh = b.get("x",0), b.get("y",0), b.get("width",0), b.get("height",0)
            # compute overlap area
            ix = max(ax, bx)
            iy = max(ay, by)
            ix2 = min(ax+aw, bx+bw)
            iy2 = min(ay+ah, by+bh)
            if ix2 > ix and iy2 > iy:
                overlap = (ix2-ix)*(iy2-iy)
                smaller = min(aw*ah, bw*bh)
                if overlap / smaller > 0.4:  # >40% overlap of smaller image
                    violations.append({
                        "code": "IMAGE_OVERLAP",
                        "severity": "medium",
                        "message": f"Images {a.get('layer_id')} and {b.get('layer_id')} overlap significantly"
                    })

    return {"status": "success", "violations": violations}

# --- Auto-fix suggestion / apply fixes ------------------------------------
@app.post("/compliance/autofix/{project_id}")
def compliance_autofix(project_id: str, retailer: str = "RetailerA", apply_changes: bool = True):
    guideline = db.retailer_guidelines.find_one({"retailer": retailer})
    if not guideline:
        raise HTTPException(status_code=404, detail="Retailer guideline not found")
    rules = guideline["rules"]

    proj = db.editor_projects.find_one({"_id": ObjectId(project_id)})
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    changes = []
    updated = False

    # load image of canvas for sampling
    canvas_img = render_project_image(project_id)

    short_side = min(proj["width"], proj["height"])
    min_logo_margin = int(short_side * rules.get("logo_safe_margin_pct", 0.05))

    new_layers = proj.get("layers", [])

    for idx, layer in enumerate(new_layers):
        if layer.get("type") == "text":
            font_size = int(layer.get("font_size", 16))
            if font_size < rules.get("min_font_size", 16):
                changes.append({"layer_id": layer.get("layer_id"), "fix": "increase_font", "from": font_size, "to": rules.get("min_font_size")})
                layer["font_size"] = rules.get("min_font_size")
                updated = True

            # fix contrast by switching text color to black/white based on sampled bg
            try:
                tmp = Image.new("RGB", (proj["width"], proj["height"]), (255,255,255))
                draw = ImageDraw.Draw(tmp)
                try:
                    font = ImageFont.truetype("arial.ttf", layer.get("font_size",16))
                except Exception:
                    font = ImageFont.load_default()
                bbox = draw.textbbox((layer.get("x",0), layer.get("y",0)), layer.get("text",""), font=font)
                x0,y0,x1,y1 = bbox
                sampled = sample_canvas_region(canvas_img, (x0,y0,x1-x0,y1-y0))
                black_cr = contrast_ratio((0,0,0), sampled)
                white_cr = contrast_ratio((255,255,255), sampled)
                preferred = "#000000" if black_cr >= white_cr else "#FFFFFF"
                current = layer.get("color", "#000000")
                if contrast_ratio(hex_to_rgb(current), sampled) < rules.get("min_contrast_ratio", 4.5):
                    changes.append({"layer_id": layer.get("layer_id"), "fix": "color_contrast", "from": current, "to": preferred})
                    layer["color"] = preferred
                    updated = True
            except Exception:
                pass

        if layer.get("type") == "image" and layer.get("meta", {}).get("role") == "logo":
            lx, ly, lw, lh = int(layer.get("x",0)), int(layer.get("y",0)), int(layer.get("width",0)), int(layer.get("height",0))
            # move logo inside safe margin if too close
            move_x = max(min_logo_margin, lx)
            move_y = max(min_logo_margin, ly)
            if lx < min_logo_margin or ly < min_logo_margin or (proj["width"] - (lx+lw)) < min_logo_margin or (proj["height"] - (ly+lh)) < min_logo_margin:
                changes.append({"layer_id": layer.get("layer_id"), "fix": "move_logo_inside_margin", "from": (lx,ly), "to": (move_x, move_y)})
                layer["x"] = move_x
                layer["y"] = move_y
                updated = True

    # apply to DB if requested
    if updated and apply_changes:
        db.editor_projects.update_one({"_id": ObjectId(project_id)}, {"$set": {"layers": new_layers}})
    return {"status": "success", "applied": updated, "changes": changes}

#SMART IMAGE ENHANCEMENT v2 (Advanced AI)
def pil_to_cv(img: Image.Image):
    return cv2.cvtColor(np.array(img), cv2.COLOR_RGBA2BGRA if img.mode == "RGBA" else cv2.COLOR_RGB2BGR)

def cv_to_pil(img_cv):
    img_rgb = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)
    return Image.fromarray(img_rgb)

def auto_white_balance(img):
    """ Gray-world AWB """
    result = img.copy().astype(np.float32)
    avg_b, avg_g, avg_r = np.mean(result[:,:,0]), np.mean(result[:,:,1]), np.mean(result[:,:,2])
    avg_gray = (avg_b + avg_g + avg_r) / 3

    result[:,:,0] = np.clip(result[:,:,0] * (avg_gray / avg_b), 0, 255)
    result[:,:,1] = np.clip(result[:,:,1] * (avg_gray / avg_g), 0, 255)
    result[:,:,2] = np.clip(result[:,:,2] * (avg_gray / avg_r), 0, 255)

    return result.astype(np.uint8)

def enhance_shadows_highlights(img):
    """ Shadow/Highlight Recovery """
    img_float = img.astype(np.float32) / 255.0
    shadows = cv2.pow(img_float, 0.8)
    highlights = cv2.pow(img_float, 1.2)
    blended = cv2.addWeighted(shadows, 0.6, highlights, 0.4, 0)
    return (blended * 255).astype(np.uint8)

def auto_contrast(img):
    """ Contrast stretching (Histogram Stretch) """
    ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
    y = ycrcb[:, :, 0]
    y = cv2.equalizeHist(y)
    ycrcb[:, :, 0] = y
    return cv2.cvtColor(ycrcb, cv2.COLOR_YCrCb2BGR)

def blur_level(img):
    """ Returns blur level using Laplacian variance """
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return cv2.Laplacian(gray, cv2.CV_64F).var()

def smart_sharpen(img):
    b = blur_level(img)
    if b < 20:
        amount = 1.8
    elif b < 50:
        amount = 1.4
    else:
        amount = 1.1
    return cv2.addWeighted(img, 1 + amount, img, -amount, 0)

def noise_reduction(img):
    """ Bilateral filter preserving edges """
    return cv2.bilateralFilter(img, d=7, sigmaColor=40, sigmaSpace=40)

def upscale_hd(img):
    """ 2x upscale (safe SR) """
    h, w = img.shape[:2]
    return cv2.resize(img, (w*2, h*2), interpolation=cv2.INTER_CUBIC)

def _resize_with_aspect_and_pad(img: Image.Image, target_ratio: float):
    w, h = img.size
    current_ratio = w / h

    # Adjust based on aspect ratio
    if current_ratio > target_ratio:
        # too wide → fix width, extend height
        new_w = w
        new_h = int(w / target_ratio)
    else:
        new_h = h
        new_w = int(h * target_ratio)

    # Create padded image
    final_img = Image.new("RGBA", (new_w, new_h), (255, 255, 255, 0))
    final_img.paste(img, ((new_w - w) // 2, (new_h - h) // 2))
    return final_img

def _amazon_crop(img: Image.Image):
    # Amazon requires:
    # - white background
    # - product centered
    # - product must fill ~85% of frame

    w, h = img.size
    scale_factor = 1 / 0.85  # for 85% coverage

    canvas_w = int(w * scale_factor)
    canvas_h = int(h * scale_factor)

    # White background
    canvas = Image.new("RGB", (canvas_w, canvas_h), (255, 255, 255))
    
    # Center product
    offset = (
        (canvas_w - w) // 2,
        (canvas_h - h) // 2
    )
    canvas.paste(img.convert("RGB"), offset)

    return canvas

@app.get("/smart-enhance/{file_id}")
def smart_enhance(file_id: str, upscale: bool = False):
    try:
        file_obj = fs.get(ObjectId(file_id))
        pil_img = Image.open(io.BytesIO(file_obj.read())).convert("RGB")

        img = pil_to_cv(pil_img)

        # ----- Step 1: White Balance -----
        img = auto_white_balance(img)

        # ----- Step 2: Shadow/Highlight Recovery -----
        img = enhance_shadows_highlights(img)

        # ----- Step 3: Smart Contrast -----
        img = auto_contrast(img)

        # ----- Step 4: Noise Reduction -----
        img = noise_reduction(img)

        # ----- Step 5: Smart Sharpen -----
        img = smart_sharpen(img)

        # ----- Step 6: Optional HD Upscale -----
        if upscale:
            img = upscale_hd(img)

        out_pil = cv_to_pil(img)
        buffer = pil_to_bytes(out_pil)

        new_file_id = fs.put(buffer.getvalue(), filename=f"{file_id}_smart_v2.png", content_type="image/png")

        processed_path = f"processed/{new_file_id}.png"
        out_pil.save(processed_path)

        return {
            "status": "success",
            "operation": "smart_enhancement_v2",
            "new_file_id": str(new_file_id)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Smart Enhancement V2 failed: {str(e)}")

@app.get("/smart-crop/{file_id}")
def smart_crop(
    file_id: str,
    mode: str = "tight",   # tight, square, portrait, landscape, amazon, custom
    width: int = None,
    height: int = None
):
    try:
        # Fetch original
        file_obj = fs.get(ObjectId(file_id))
        image = Image.open(io.BytesIO(file_obj.read())).convert("RGBA")

        # Step 1: Subject detection using rembg
        removed = remove(image)
        alpha = removed.getchannel("A")
        bbox = alpha.getbbox()
        if not bbox:
            raise HTTPException(status_code=400, detail="Subject not found")

        # Tight crop
        cropped = image.crop(bbox)

        # MODE HANDLING
        # 1. TIGHT (default)
        if mode == "tight":
            final_img = cropped

        # 2. SQUARE
        elif mode == "square":
            max_dim = max(cropped.size)
            final_img = Image.new("RGBA", (max_dim, max_dim), (255, 255, 255, 0))
            final_img.paste(
                cropped,
                ((max_dim - cropped.width) // 2,
                 (max_dim - cropped.height) // 2)
            )

        # 3. PORTRAIT (4:5)
        elif mode == "portrait":
            target_ratio = 4 / 5
            final_img = _resize_with_aspect_and_pad(cropped, target_ratio)

        # 4. LANDSCAPE (16:9)
        elif mode == "landscape":
            target_ratio = 16 / 9
            final_img = _resize_with_aspect_and_pad(cropped, target_ratio)

        # 5. AMAZON MODE
        elif mode == "amazon":
            # Amazon Standard: White BG, 85% product coverage centered
            final_img = _amazon_crop(cropped)

        # 6. CUSTOM SIZE
        elif mode == "custom":
            if not width or not height:
                raise HTTPException(status_code=400, detail="Width & height required")
            final_img = cropped.resize((width, height))

        else:
            raise HTTPException(status_code=400, detail="Invalid crop mode")

        # Save to GridFS
        buffer = pil_to_bytes(final_img)
        new_file_id = fs.put(
            buffer.getvalue(),
            filename=f"{file_id}_smartcrop_{mode}.png",
            content_type="image/png"
        )

        # Save locally
        final_img.save(f"processed/{new_file_id}.png")

        return {
            "status": "success",
            "operation": "smart_crop",
            "mode": mode,
            "new_file_id": str(new_file_id),
            "bbox_used": bbox
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Smart crop failed: {str(e)}")

# Multi Channel Auto Resize
@app.get("/auto-resize/{file_id}")
def auto_resize(
    file_id: str,
    include_custom: bool = False,
    custom_width: int = None,
    custom_height: int = None
):
    try:
        # Load original from GridFS
        file_obj = fs.get(ObjectId(file_id))
        image = Image.open(io.BytesIO(file_obj.read())).convert("RGBA")

        # Resize presets
        presets = {
            "instagram_square": (1080, 1080),
            "instagram_portrait": (1080, 1350),
            "amazon": (2000, 2000),
            "thumbnail": (300, 300),
            "website_banner": (1920, 1080),
            "flipkart": (1600, 2000)
        }

        # Add custom if requested
        if include_custom and custom_width and custom_height:
            presets["custom"] = (custom_width, custom_height)

        response_list = []

        # Process all preset sizes
        for name, (w, h) in presets.items():

            # For Amazon — white background
            if name == "amazon":
                bg = Image.new("RGB", (w, h), (255, 255, 255))
                resized = image.resize((int(w*0.85), int(h*0.85)))
                bg.paste(
                    resized.convert("RGB"),
                    ((w - resized.width) // 2, (h - resized.height) // 2)
                )
                final_img = bg
            else:
                # Normal aspect fill resize
                final_img = image.resize((w, h))

            # Save each output
            buffer = pil_to_bytes(final_img)
            new_file_id = fs.put(
                buffer.getvalue(),
                filename=f"{file_id}_{name}.png",
                content_type="image/png"
            )

            final_img.save(f"processed/{new_file_id}.png")

            response_list.append({
                "channel": name,
                "width": w,
                "height": h,
                "file_id": str(new_file_id)
            })

        return {
            "status": "success",
            "operation": "auto_resize",
            "total_generated": len(response_list),
            "files": response_list
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Auto resize failed: {str(e)}")

# Batch Export + AI Optimisation
# --- Request model for batch export ---
class BatchExportRequest(BaseModel):
    file_ids: list[str]
    format: str = "zip"        # zip / png / jpeg / webp
    quality: int = 85          # for jpeg/webp
    resize_width: int | None = None
    resize_height: int | None = None

@app.post("/batch-export")
async def batch_export(req: BatchExportRequest):
    """
    Batch export & optimization engine.
    - Accepts list of file_ids
    - Optional: resize during export
    - Supports: ZIP, JPEG, PNG, WebP optimization
    - Returns new file_ids and downloadable zip
    """
    file_ids = req.file_ids
    format = req.format
    quality = req.quality
    resize_width = req.resize_width
    resize_height = req.resize_height

    try:
        # Validate format
        valid_formats = ["zip", "jpeg", "png", "webp"]
        if format not in valid_formats:
            raise HTTPException(400, f"Invalid format. Use {valid_formats}")

        export_files = []
        zip_buffer = io.BytesIO()

        if format == "zip":
            zip_file = zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED)

        response_list = []

        for fid in file_ids:
            try:
                file_obj = fs.get(ObjectId(fid))
                img = Image.open(io.BytesIO(file_obj.read())).convert("RGBA")
            except:
                continue

            # ---- Optional Resize ----
            if resize_width and resize_height:
                img = img.resize((resize_width, resize_height))

            # ---- Compression / Export ----
            buffer = io.BytesIO()

            if format == "jpeg":
                rgb_img = img.convert("RGB")
                rgb_img.save(buffer, format="JPEG", quality=quality, optimize=True)
            elif format == "png":
                img.save(buffer, format="PNG", optimize=True)
            elif format == "webp":
                img.save(buffer, format="WEBP", quality=quality, method=6)
            elif format == "zip":
                temp_buffer = io.BytesIO()
                img.save(temp_buffer, format="PNG")
                zip_file.writestr(f"{fid}.png", temp_buffer.getvalue())
                continue

            buffer.seek(0)

            # ---- Store optimized version in GridFS ----
            new_file_id = fs.put(
                buffer.getvalue(),
                filename=f"{fid}_optimized.{format}",
                content_type=f"image/{format}"
            )

            # Save locally too (optional)
            out_path = f"processed/{new_file_id}.{format}"
            with open(out_path, "wb") as f:
                f.write(buffer.getvalue())

            response_list.append({
                "original_file_id": fid,
                "optimized_file_id": str(new_file_id),
                "format": format,
                "resize": (resize_width, resize_height) if resize_width else None
            })

        # ---- Final ZIP Response ----
        if format == "zip":
            zip_file.close()
            zip_buffer.seek(0)
            return StreamingResponse(
                zip_buffer,
                media_type="application/zip",
                headers={"Content-Disposition": "attachment; filename=batch_export.zip"}
            )

        return {
            "status": "success",
            "operation": "batch_export",
            "output_format": format,
            "quality": quality,
            "total_processed": len(response_list),
            "files": response_list
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch export failed: {str(e)}")
    
#collaboration And Review
class Annotation(BaseModel):
    x: int
    y: int
    width: int
    height: int

class ReviewCreate(BaseModel):
    file_id: str
    user: str
    comment: str
    annotations: Optional[List[Annotation]] = []

class ReviewResponse(BaseModel):
    review_id: str
    file_id: str
    user: str
    comment: str
    annotations: List[Dict]
    version: int
    timestamp: datetime

@app.post("/review/add", response_model=ReviewResponse)
def add_review(review: ReviewCreate):
    try:
        # Count existing reviews for versioning
        version = db.reviews.count_documents({"file_id": ObjectId(review.file_id)}) + 1

        review_doc = {
            "file_id": ObjectId(review.file_id),
            "user": review.user,
            "comment": review.comment,
            "annotations": [a.dict() for a in review.annotations],
            "version": version,
            "timestamp": datetime.utcnow()
        }

        result = db.reviews.insert_one(review_doc)
        review_doc["review_id"] = str(result.inserted_id)
        review_doc["file_id"] = str(review_doc["file_id"])

        return review_doc

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Add review failed: {str(e)}")

@app.get("/review/{file_id}", response_model=List[ReviewResponse])
def get_reviews(file_id: str):
    try:
        reviews_cursor = db.reviews.find({"file_id": ObjectId(file_id)}).sort("version", 1)
        reviews_list = []
        for r in reviews_cursor:
            reviews_list.append({
                "review_id": str(r["_id"]),
                "file_id": str(r["file_id"]),
                "user": r["user"],
                "comment": r["comment"],
                "annotations": r.get("annotations", []),
                "version": r.get("version", 1),
                "timestamp": r.get("timestamp")
            })
        return reviews_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fetch reviews failed: {str(e)}")

@app.put("/review/update/{review_id}", response_model=ReviewResponse)
def update_review(review_id: str, review: ReviewCreate):
    try:
        update_doc = {
            "user": review.user,
            "comment": review.comment,
            "annotations": [a.dict() for a in review.annotations],
            "timestamp": datetime.utcnow()
        }
        result = db.reviews.update_one({"_id": ObjectId(review_id)}, {"$set": update_doc})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Review not found")

        updated_review = db.reviews.find_one({"_id": ObjectId(review_id)})
        updated_review["review_id"] = str(updated_review["_id"])
        updated_review["file_id"] = str(updated_review["file_id"])

        return updated_review

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Update review failed: {str(e)}")

@app.delete("/review/delete/{review_id}")
def delete_review(review_id: str):
    try:
        result = db.reviews.delete_one({"_id": ObjectId(review_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Review not found")
        return {"status": "deleted", "review_id": review_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete review failed: {str(e)}")

# HEALTH CHECK
@app.get("/")
def health():
    return {"message": "ReTailor AI Backend Running", "status": "OK"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
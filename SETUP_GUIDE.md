# ReTailor AI — Complete Setup Guide

> From zero to running creative studio in under 10 minutes.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Clone the Repository](#2-clone-the-repository)
3. [Environment Configuration](#3-environment-configuration)
4. [Backend Setup (FastAPI / Python)](#4-backend-setup)
5. [Frontend Setup (Next.js)](#5-frontend-setup)
6. [Running the Full Stack](#6-running-the-full-stack)
7. [API Keys — Where to Get Them](#7-api-keys)
8. [MongoDB Atlas Setup](#8-mongodb-atlas-setup)
9. [Docker Setup (Optional)](#9-docker-setup-optional)
10. [Cloud Deployment](#10-cloud-deployment)
11. [Demo Mode (No Backend Required)](#11-demo-mode)
12. [Testing the Installation](#12-testing-the-installation)
13. [Common Issues & Fixes](#13-common-issues--fixes)

---

## 1. Prerequisites

| Tool | Minimum Version | Check |
|---|---|---|
| **Python** | 3.12+ | `python --version` |
| **Node.js** | 18.0+ | `node --version` |
| **npm** | 9.0+ | `npm --version` |
| **Git** | 2.x | `git --version` |
| **Docker** (optional) | 24.x | `docker --version` |

---

## 2. Clone the Repository

```bash
git clone https://github.com/your-org/retailor-ai.git
cd retailor-ai
```

Expected structure:
```
retailor-ai/
├── backend/
├── frontend/
├── .env.example
├── requirements.txt
└── README.md
```

---

## 3. Environment Configuration

```bash
cp .env.example backend/.env
```

Open `backend/.env` and fill in:

```env
# ─── DATABASE ─────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority
DB_NAME=RetailorAI

# ─── AI SERVICES ──────────────────────────────────────────
MISTRAL_API_KEY=your_mistral_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# ─── APP SETTINGS ─────────────────────────────────────────
ENV=development
```

See [Section 7](#7-api-keys) for how to obtain each key.

---

## 4. Backend Setup

### Step 1: Navigate to backend
```bash
cd backend
```

### Step 2: Create virtual environment
```bash
# macOS / Linux
python3 -m venv venv
source venv/bin/activate

# Windows (Command Prompt)
python -m venv venv
venv\Scripts\activate

# Windows (PowerShell)
python -m venv venv
venv\Scripts\Activate.ps1
```

You should see `(venv)` in your terminal prompt.

### Step 3: Install dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

> **Note on rembg (Linux/Ubuntu):**
> ```bash
> sudo apt-get install libgl1-mesa-glx libglib2.0-0
> ```

> **Note on OpenCV (macOS):**
> ```bash
> brew install opencv
> pip install opencv-python
> ```

### Step 4: Create required directories
FastAPI creates these automatically on startup, but you can pre-create:
```bash
mkdir -p tmp processed
```

### Step 5: Start the backend
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
[Env] Loaded from /path/to/backend/.env
[Mistral] Client initialized OK (API Key: xxxx...xxxx)
INFO:     Started server process [...]
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 6: Verify
- **Health:** http://localhost:8000/
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 5. Frontend Setup

Open a **new terminal** (keep backend running).

### Step 1: Navigate to frontend
```bash
cd frontend
```

### Step 2: Install dependencies
```bash
npm install
# or: pnpm install
```

### Step 3: Configure backend URL (optional)
For a custom backend URL, create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Default is `http://localhost:8000` if not set.

### Step 4: Start the dev server
```bash
npm run dev
```

Expected output:
```
▲ Next.js 16.0.10
- Local: http://localhost:3000
- Ready in 2.3s
```

### Step 5: Open the app
Navigate to **http://localhost:3000**

---

## 6. Running the Full Stack

**Terminal 1 — Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Access at **http://localhost:3000**

---

## 7. API Keys

### Mistral AI (required for AI features)
1. Visit https://console.mistral.ai
2. Create a free account
3. Navigate to **API Keys** → Generate new key
4. Free tier is sufficient for development
5. The platform uses `mistral-large-latest` model

### HuggingFace (required for poster generation)
1. Visit https://huggingface.co/join
2. Create a free account
3. Go to **Settings → Access Tokens** → New token (read access)
4. Free tier supports the FLUX inference API
5. The platform calls the FLUX model via the Inference API

### MongoDB Atlas (required for all data)
See [Section 8](#8-mongodb-atlas-setup) for full MongoDB setup.

---

## 8. MongoDB Atlas Setup

### Step 1: Create cluster
1. Visit https://cloud.mongodb.com
2. Create a free account → New Project → Build a Database → **Free (M0)** cluster
3. Choose a cloud provider and region close to your users

### Step 2: Create database user
1. **Database Access** → Add New Database User
2. Create username + strong password
3. Grant **Read and Write to any database** privilege

### Step 3: Whitelist IP
1. **Network Access** → Add IP Address
2. For development: **Allow Access from Anywhere** (0.0.0.0/0)
3. For production: use specific IP ranges

### Step 4: Get connection string
1. **Clusters** → Connect → Connect your application
2. Copy the connection string
3. Replace `<password>` and `<username>` with your database user credentials
4. Paste into `MONGODB_URI` in your `.env`

### Step 5: Database initialization
The backend auto-creates collections and seeds retailer guidelines on first startup. You should see in the logs:
```
[Startup] Seeding retailer guidelines...
[Startup] Seeding templates...
[Startup] Startup complete.
```

---

## 9. Docker Setup (Optional)

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    volumes:
      - ./backend:/app
      - ./backend/tmp:/app/tmp
      - ./backend/processed:/app/processed

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
```

`backend/Dockerfile`:
```dockerfile
FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx libglib2.0-0 libsm6 libxext6 libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN mkdir -p tmp processed

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

`frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker-compose up --build
```

---

## 10. Cloud Deployment

### Backend → Render

1. Push your repo to GitHub
2. Visit https://render.com → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from your `.env`
6. Note your Render service URL (e.g., `https://retailor-ai.onrender.com`)

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
```

Or connect GitHub repo at https://vercel.com → New Project → set `frontend` as root directory.

Add environment variable:
```
NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com
```

> **Note:** Render free tier spins down after inactivity. Use a paid tier or keep-alive ping for production.

---

## 11. Demo Mode

ReTailor AI includes a **full offline demo mode** powered by `frontend/lib/demo-api-client.ts`.

**Enable demo mode:**
```javascript
// In browser console
localStorage.setItem('demo_mode', 'true')
```

Or navigate to Settings → Toggle Demo Mode.

**What demo mode provides:**
- Mock responses for all API calls
- Sample asset IDs, project data, compliance results
- Full UI walkthrough without backend dependency
- Perfect for presentations, onboarding, and UI development

**Disable:**
```javascript
localStorage.removeItem('demo_mode')
```

---

## 12. Testing the Installation

### Backend endpoint tests
```bash
# Health
curl http://localhost:8000/

# Upload a test asset
curl -X POST http://localhost:8000/upload-asset \
  -F "file=@/path/to/test-image.png"

# List all assets
curl http://localhost:8000/assets

# Check API docs
open http://localhost:8000/docs
```

### Frontend smoke test
1. Navigate to http://localhost:3000
2. Click **Get Started Free** → lands on dashboard
3. Navigate to **Assets** → upload a test image
4. Navigate to **AI Suggestions** → verify AI tab loads
5. Navigate to **Compliance** → verify checker loads

---

## 13. Common Issues & Fixes

### `ModuleNotFoundError: No module named 'cv2'`
```bash
pip install opencv-python-headless
# On servers without a display, use headless variant
```

### `rembg` fails / very slow on first run
rembg downloads the U2Net model (~170MB) on first use. Wait for the download to complete. Subsequent calls are fast.

### `Mistral API key not configured` warning
Ensure `MISTRAL_API_KEY` is in `backend/.env` and the `.env` file is in the `backend/` directory (not project root) when running uvicorn from inside `backend/`.

### `HuggingFace API error 503`
HuggingFace Inference API can be slow on free tier — the model may need to warm up. Retry after 30 seconds. Upgrade to a paid HuggingFace plan for production SLAs.

### `Invalid BSON ObjectId` errors
This happens when using test IDs in the format `123` instead of valid MongoDB ObjectIds. Use the file IDs returned from the `/upload-asset` endpoint (24-character hex strings).

### Frontend can't reach backend (CORS error)
Ensure the backend is running on port 8000 and CORS is configured. The backend allows all origins by default (`allow_origins=["*"]`). If deploying to production, restrict this to your Vercel domain.

### MongoDB connection timeout
- Check your IP is whitelisted in MongoDB Atlas Network Access
- Verify the `MONGODB_URI` has the correct username, password, and cluster URL
- Ensure the database user has read/write permissions

### `npm install` peer dependency conflict
```bash
npm install --legacy-peer-deps
```

### Next.js build TypeScript error
```bash
npm run build -- --no-lint
# Or fix the specific error shown in build output
```

---

> For feature documentation, see [`FEATURES_AND_IMPACT.md`](FEATURES_AND_IMPACT.md)  
> For a full repository map, see [`FOLDER_STRUCTURE.md`](FOLDER_STRUCTURE.md)

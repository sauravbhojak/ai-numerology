# 🔮 AI Numerology Web Application

A full-stack, stateless AI-powered numerology app built with **FastAPI** + **React + Vite + Tailwind CSS**.

No database. No login. Instant mystical readings powered by **Groq AI**.

---

## Project Structure

```
numerology-app/
├── backend/          # FastAPI + Groq AI + ReportLab PDF
└── frontend/         # React + Vite + Tailwind + Framer Motion
```

---

## Setup

### 1. Clone and enter the project

```bash
cd Num
```

### 2. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
uvicorn main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at: **http://localhost:5173**

---

## Environment Variables

Edit `backend/.env`:

| Variable        | Description                              |
|-----------------|------------------------------------------|
| `GROQ_API_KEY`  | Your Groq API key (get it at groq.com)   |
| `GROQ_MODEL`    | Model name (default: `llama3-70b-8192`)  |
| `CORS_ORIGINS`  | Frontend URL (default: localhost:5173)   |

---

## API Endpoints

| Method | Endpoint            | Description                        |
|--------|---------------------|------------------------------------|
| POST   | `/api/v1/generate-report` | Calculate numbers + get AI reading |
| POST   | `/api/v1/download-pdf`    | Generate and download PDF report   |
| GET    | `/api/v1/health`          | Health check                       |
| GET    | `/docs`                   | Swagger API docs                   |

---

## Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Create a free account
3. Generate an API key
4. Paste it into `backend/.env` as `GROQ_API_KEY=gsk_...`

---

## Features

- ✅ Life Path, Destiny, Soul Urge, Personality, Birthday, Personal Year, Expression numbers
- ✅ Lucky Numbers, Lucky Colors, Lucky Days
- ✅ AI-powered interpretation via Groq (llama3-70b)
- ✅ Beautiful PDF download (ReportLab)
- ✅ Dark cosmic theme with glassmorphism
- ✅ Animated star field background
- ✅ Sacred geometry loading screen
- ✅ Framer Motion animations throughout
- ✅ Fully responsive
- ✅ No database required — completely stateless

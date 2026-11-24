# ✈️ PlanAI — Multi-Agent AI Travel Planner

<p align="center">
  <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80" alt="PlanAI Banner" width="100%" style="border-radius: 12px;" />
</p>

<p align="center">
  <strong>An autonomous multi-agent travel intelligence system powered by LangChain, LangGraph, Groq LPU fast inference, FastAPI, and a modern React 19 UI.</strong>
</p>

<p align="center">
  <a href="#-architecture"><img src="https://img.shields.io/badge/Architecture-SubAgents_Pattern-blue?style=flat-square" alt="Architecture" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi" alt="FastAPI" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Frontend-React_19-61DAFB?style=flat-square&logo=react" alt="React 19" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Inference-Groq_LPU-F55036?style=flat-square" alt="Groq" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License" /></a>
</p>

---

## 📖 Overview

**PlanAI** transforms travel planning from hours of tedious tab-switching into an autonomous, real-time collaborative experience. 

Users enter their destination, departure city, travel dates, travelers count, budget, and travel interests. A team of specialized autonomous agents collaborates in real time to assemble:
- **Flight Recommendations**: Airline routing, schedule comparisons, layover details, and airfares.
- **Accommodations**: Neighborhood-matched boutique, luxury, or family stays.
- **Attractions & Cultural Sights**: Curated day-by-day sightseeing experiences.
- **Dining & Food Guides**: Local street markets, authentic regional eateries, and fine dining.
- **Financial Feasibility & Budget Tracking**: Category itemization (flights, stays, food, transit, buffer) with Recharts visualizations.
- **Day-by-Day Itineraries**: Geographically optimized schedules balancing morning, afternoon, and evening activities.
- **Conversational AI Assistant**: LangGraph memory checkpointing (`thread_id`) allowing users to ask follow-up questions and customize their plans iteratively.

---

## 🏗️ Architecture

PlanAI is built on **LangChain's SubAgents pattern** orchestrated with **LangGraph**:

```
                                      User / React UI
                                            │
                                            ▼
                                FastAPI Server (main.py)
                        ┌───────────────────┴───────────────────┐
                 REST Endpoints                          SSE Real-Time Stream
            (/api/plan, /api/chat, etc.)                 (/api/plan/stream)
                        │                                       │
                        └───────────────────┬───────────────────┘
                                            ▼
                                SUPERVISOR AGENT (👑)
                           (LangGraph with InMemorySaver)
                                            │
        ┌──────────────┬────────────────────┼──────────────┬──────────────┬──────────────┐
        ▼              ▼                    ▼              ▼              ▼              ▼
   Flight Agent   Hotel Agent        Activity Agent   Food Agent    Budget Agent   Itinerary Agent
      (✈️)           (🏨)                 (🎯)           (🍜)           (💰)            (🗓️)
   • search       • search             • search       • search      • estimate     • daily schedule
     flights        hotels               activities     dining        budget       • optimize route
   • compare      • get                • get          • foodie      • feasibility  • trip summary
     prices         recommend            tours          guide         breakdown
```

### Why the SubAgents Pattern?
- **Context Isolation**: Each specialist agent (flights, lodging, culinary, finance) operates in an isolated prompt context, preventing hallucination and prompt bloat.
- **Centralized Synthesis**: The Supervisor Agent evaluates constraints, coordinates tools, and synthesizes results into a cohesive personal advisor narrative.
- **Conversational Memory**: The `InMemorySaver` checkpointer retains state across multiple turns, enabling seamless modifications in chat.

---

## ✨ Features

- 🌐 **Modern, Clean SaaS UI**: Inspired by world-class travel products (Airbnb / Google Travel) with a clean white/slate design, zero neon clutter, and responsive layout for mobile, tablet, and desktop.
- ⚡ **Real-Time SSE Streaming**: Watch specialist agents think, call tools, and assemble your plan in real time via Server-Sent Events (`/api/plan/stream`).
- 🗓️ **Day-by-Day Schedule**: Organized morning, afternoon, and evening slots designed with logical geographic routing to prevent cross-city travel fatigue.
- ✈️ **Flight & Hotel Cards**: Visual cards with departure/arrival times, stops, durations, prices, star ratings, and neighborhood tags.
- 📊 **Interactive Budget Dashboard**: Interactive Donut and Bar charts powered by **Recharts** comparing Target Budget vs. Actual spend with itemized expense splits.
- 💬 **Interactive AI Chat**: Ask follow-up questions (*"Can we add a day trip to Mount Fuji?"*, *"Suggest authentic ramen spots near Shinjuku"*) with conversational memory.
- 🚀 **1-Click Launchers**: Windows `.bat` and PowerShell `.ps1` scripts to launch both backend and frontend concurrently.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Visualizations**: Recharts (Pie & Bar charts)
- **Effects**: Canvas Confetti

### Backend
- **Framework**: FastAPI + Uvicorn
- **Agent Orchestration**: LangChain + LangGraph
- **LLM Inference**: Groq LPUs (`openai/gpt-oss-120b` / `llama3-70b`)
- **State Management**: LangGraph `InMemorySaver` Checkpointer
- **Streaming**: Server-Sent Events (`sse-starlette`)
- **Validation**: Pydantic v2

---

## 📁 Repository Structure

```
plan_ai/
├── multi-agent-travel_planner/         # FastAPI Backend & Agents
│   ├── main.py                         # FastAPI application entrypoint (app = FastAPI)
│   ├── routes/                         # Modular route handlers
│   │   ├── destinations.py             # Destinations & search endpoints
│   │   ├── plan.py                     # Plan generation & SSE streaming
│   │   └── chat.py                     # Conversational assistant with memory
│   ├── models/                         # Pydantic schemas
│   │   └── schemas.py                  # TripPlanRequest, ChatMessageRequest
│   ├── supervisor.py                   # Supervisor Agent with 6 specialist tools
│   ├── subagents/                      # Domain-specific specialist agents
│   │   ├── flights.py                  # Flight Agent
│   │   ├── hotels.py                   # Hotel Agent
│   │   ├── activities.py               # Activity Agent
│   │   ├── food.py                     # Food Agent
│   │   ├── budget.py                   # Budget Agent
│   │   └── itinerary.py                # Itinerary Agent
│   ├── tools/                          # Data tools & mock database
│   │   └── mock_data.py                # Flights, hotels, activities & dining data
│   ├── requirements.txt                # Python dependencies
│   └── .env.example                    # Backend environment template
├── frontend/                           # React + Vite Frontend
│   ├── src/
│   │   ├── components/                 # UI components
│   │   │   ├── Navbar.jsx              # Clean responsive navbar
│   │   │   ├── HeroSection.jsx         # Search card & hero
│   │   │   ├── PopularDestinations.jsx # Destination cards
│   │   │   ├── FeaturesSection.jsx     # Value proposition cards
│   │   │   ├── TripPlannerView.jsx     # Configuration form & presets
│   │   │   ├── AgentDashboard.jsx      # Agent status & execution checklist
│   │   │   ├── TravelResultsView.jsx   # Itinerary, flights, stays, dining tabs
│   │   │   ├── BudgetDashboardView.jsx # Recharts charts & expense table
│   │   │   ├── ChatDrawer.jsx          # Slide-over memory-backed chat
│   │   │   └── Footer.jsx              # Clean footer
│   │   ├── context/
│   │   │   └── TravelContext.jsx       # Global state & SSE streaming client
│   │   ├── services/
│   │   │   └── api.js                  # API service layer
│   │   ├── App.jsx                     # View router & layout
│   │   └── index.css                   # Tailwind v4 styles
│   ├── package.json                    # Frontend dependencies
│   ├── vite.config.js                  # Vite configuration with API proxy
│   └── .env.example                    # Frontend environment template
├── start_all.bat                       # 1-Click Windows batch launcher
├── start_all.ps1                       # 1-Click PowerShell launcher
├── .gitignore                          # Git ignore rules
└── README.md                           # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Python**: Version 3.10+ (Tested on Python 3.14)
- **Node.js**: Version 18+ (Tested on Node 20 / 22)
- **Groq API Key**: Free API key from [Groq Console](https://console.groq.com/keys)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/alokmehata0403/plan_ai.git
cd plan_ai
```

---

### Step 2: Configure Environment Variables

#### Backend `.env`:
Create `multi-agent-travel_planner/.env`:
```bash
cp multi-agent-travel_planner/.env.example multi-agent-travel_planner/.env
```
Add your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
```

#### Frontend `.env`:
Create `frontend/.env`:
```bash
cp frontend/.env.example frontend/.env
```
Default configuration:
```env
VITE_API_URL=http://127.0.0.1:8000
```

---

### Step 3: Backend Setup
```bash
# Navigate to backend directory
cd multi-agent-travel_planner

# Create virtual environment (optional if using global Python)
python -m venv ../venv
# Activate venv on Windows:
..\venv\Scripts\activate
# Activate venv on macOS/Linux:
# source ../venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python main.py
```
> The API will be available at **http://127.0.0.1:8000**  
> Swagger Documentation: **http://127.0.0.1:8000/docs**

---

### Step 4: Frontend Setup
In a new terminal:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
> Open your browser at **http://localhost:5173**

---

### ⚡ One-Click Startup (Windows)
Double-click either:
- **`start_all.bat`** (Windows Command Prompt)
- **`start_all.ps1`** (Windows PowerShell)

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check and list of active agents |
| `GET` | `/api/destinations` | List featured destinations with estimates & imagery |
| `GET` | `/api/flights?destination={city}` | Search flight options for destination |
| `GET` | `/api/hotels?destination={city}` | Search accommodations for destination |
| `GET` | `/api/activities?destination={city}` | Search activities & cultural sights |
| `GET` | `/api/restaurants?destination={city}` | Search authentic dining options |
| `POST` | `/api/plan` | Full structured multi-agent itinerary synthesis |
| `POST` | `/api/plan/stream` | Server-Sent Events (SSE) real-time agent execution stream |
| `POST` | `/api/chat` | Conversational travel assistant with checkpoint memory |

---

## 💻 CLI Terminal Mode

For developers who want to run the multi-agent travel planner directly inside the terminal:
```bash
cd multi-agent-travel_planner
python main.py --cli
```

---

## 🔒 Security & Privacy

- All sensitive keys (`GROQ_API_KEY`, etc.) are managed exclusively via `.env` files and `.gitignore`.
- No credentials or access tokens are ever committed to the repository.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).

---

## 🤝 Acknowledgements

- [LangChain](https://github.com/langchain-ai/langchain) & [LangGraph](https://github.com/langchain-ai/langgraph) for multi-agent primitives
- [Groq](https://groq.com) for ultra-fast LPU inference
- [FastAPI](https://fastapi.tiangolo.com/) for high-performance Python web APIs
- [Tailwind CSS](https://tailwindcss.com/) & [Lucide](https://lucide.dev/) for icons and styling

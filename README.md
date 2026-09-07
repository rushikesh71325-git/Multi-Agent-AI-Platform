# ⚡ Yug AI — Production Multi-Agent AI Platform

A production-ready, enterprise-grade **Multi-Agent AI Platform** built with a resilient microservices architecture, LangGraph multi-agent state machines, Groq high-speed LLM acceleration, RAG vector retrieval, PowerPoint presentation compilation, real-time image synthesis, and an interactive **Live Artifact Preview** side panel.

---

## 🌟 Key Capabilities & Agents

| Agent | Technology | Capabilities |
| :--- | :--- | :--- |
| **⚡ Auto Router** | LangGraph + Groq LLM | Analyzes incoming user requests and automatically dispatches to the optimal specialized agent. |
| **💬 Chat Agent** | Groq (`openai/gpt-oss-120b`) | Conversational memory, nuanced responses, and formatted Markdown rendering. |
| **💻 Coding Agent** | Regex Extractor + Sandboxed Runner | Generates code and automatically extracts web applications into interactive **Live Artifacts** (HTML/CSS/JS). |
| **🎨 Image Studio** | Pollinations + Prompt Engineering | Expands concepts into photorealistic Midjourney-style prompts and generates 1024×1024 visuals with lightbox zoom and download. |
| **📊 PPT Generator** | `pptxgenjs` + Outline Synthesizer | Generates executive 5-slide PowerPoint decks (`.pptx`) with multi-pillar cards, `.pptx` file downloads, and an interactive 16:9 Slide Viewer. |
| **📄 PDF & RAG** | Qdrant + Embeddings + `pdf-parse` | Ingests PDF documents, chunks text, computes 384-dim embeddings, performs cosine retrieval, and answers queries with citations. |
| **🌐 Web Search** | Tavily Search Engine | Fetches current events, real-time news tables, and relevant images from the live web. |

---

## 🎛️ Interactive Artifact Side Panel

- **Sandboxed Live Preview (`<iframe>`)**: Runs interactive applications (counters, stopwatches, calculators, landing pages) in real time with isolated execution.
- **Interactive Slide Deck Viewer**: Navigates generated PowerPoint presentations slide-by-slide in 16:9 HD with card pillars and takeaway callouts.
- **Code Viewer**: Syntax-highlighted code editor with Prism (`vscDarkPlus`), line numbers, and 1-click copy.
- **Direct Downloads**: Download `.pptx` presentations, `.jpg` artworks, or code files (`.html`, `.py`, `.js`).

---

## 🏗️ System Architecture

```
                                  ┌────────────────────────┐
                                  │   React Vite Frontend  │
                                  │     (Port 5173)        │
                                  └───────────┬────────────┘
                                              │ HTTP / SSE
                                              ▼
                                  ┌────────────────────────┐
                                  │   API Gateway Proxy    │
                                  │     (Port 8000)        │
                                  └─────┬────────────┬─────┘
                     ┌──────────────────┘            └──────────────────┐
                     ▼                                                  ▼
          ┌─────────────────────┐                            ┌─────────────────────┐
          │     Auth Service    │                            │     Chat Service    │
          │     (Port 8001)     │                            │     (Port 8002)     │
          │  Google OAuth/Redis │                            │  MongoDB Persistence│
          └─────────────────────┘                            └─────────────────────┘
                                              ▲
                                              │ Messages / Memory
                                              ▼
                                  ┌────────────────────────┐
                                  │     Agent Service      │
                                  │     (Port 8003)        │
                                  │   LangGraph Router     │
                                  └─────┬────────────┬─────┘
                     ┌──────────────────┘            └──────────────────┐
                     ▼                                                  ▼
          ┌─────────────────────┐                            ┌─────────────────────┐
          │   Qdrant / Memory   │                            │    External APIs    │
          │    Vector Store     │                            │  Groq, Tavily, FLUX │
          └─────────────────────┘                            └─────────────────────┘
```

---

## 📂 Project Structure

```
saksham-ai/
├── backend/
│   ├── gateway/                  # API Gateway & Reverse Proxy (Port 8000)
│   │   ├── index.js
│   │   └── middlewares/auth.js
│   ├── shared/                   # Shared Redis client
│   └── services/
│       ├── auth/                 # Authentication Service (Port 8001)
│       ├── chat/                 # Chat History & Persistence (Port 8002)
│       └── agent/                # Multi-Agent LangGraph Service (Port 8003)
│           ├── agents/           # Specialized agent implementations
│           │   ├── chat.agent.js
│           │   ├── coding.agent.js
│           │   ├── imageGen.agent.js
│           │   ├── pdf.agent.js
│           │   ├── ppt.agent.js
│           │   └── search.agent.js
│           ├── config/           # Qdrant, Groq, Tavily, Memory configs
│           ├── graph/            # LangGraph StateGraph workflow & router
│           ├── routes/           # /chat, /stream, /upload-pdf, /download-ppt
│           └── utils/            # Embeddings, PDF parser, chunking
└── frontend/                     # React + Vite + TailwindCSS UI (Port 5173)
    ├── src/
    │   ├── components/
    │   │   ├── Artifact.jsx      # Live Runner & Slide Viewer side panel
    │   │   ├── ChatArea.jsx      # Main conversation area
    │   │   ├── ChatInput.jsx     # Multi-agent selector chips & PDF upload
    │   │   ├── MessageBubble.jsx # Markdown, macOS code window, image cards
    │   │   ├── MessageList.jsx   # Ambient AI hero & starter prompt cards
    │   │   ├── Nav.jsx           # Glassmorphic top bar with artifact toggle
    │   │   └── SideBar.jsx       # Conversation drawer & user profile
    │   └── Redux/                # conversationSlice, messageSlice, artifactSlice
```

---

## ⚙️ Environment Configuration

Create `.env` files in each service directory according to the templates below:

### 1. Gateway (`backend/gateway/.env`)
```env
PORT=8000
FRONTEND_URL=http://localhost:5173
AUTH_SERVICE=http://localhost:8001
CHAT_SERVICE=http://localhost:8002
AGENT_SERVICE=http://localhost:8003
```

### 2. Auth Service (`backend/services/auth/.env`)
```env
PORT=8001
MONGODB_URI=your_mongodb_auth_uri
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Chat Service (`backend/services/chat/.env`)
```env
PORT=8002
MONGODB_URI=your_mongodb_chat_uri
```

### 4. Agent Service (`backend/services/agent/.env`)
```env
PORT=8003
MONGODB_URI=your_mongodb_agent_uri
CHAT_SERVICE=http://localhost:8002
GATEWAY_URL=http://localhost:8000
REDIS_URL=redis://localhost:6379
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
TAVILY_API_KEY=your_tavily_api_key
QDRANT_URL=http://localhost:6333
```

### 5. Frontend (`frontend/.env`)
```env
VITE_SERVER_URL=http://localhost:8000
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0 or higher
- **Redis**: Running locally or via Docker (`redis://localhost:6379`)
- **MongoDB**: Atlas or local instance
- **Qdrant** *(optional)*: Docker container on port `6333` (in-memory vector fallback activates automatically if unavailable)

### 2. Installation
Install dependencies across all services:

```bash
# Gateway
cd backend/gateway && npm install

# Auth Service
cd ../services/auth && npm install

# Chat Service
cd ../chat && npm install

# Agent Service
cd ../agent && npm install

# Frontend
cd ../../../frontend && npm install
```

### 3. Starting the Services

Open terminal tabs for each service:

```bash
# Terminal 1: Gateway (Port 8000)
cd backend/gateway && npm run dev

# Terminal 2: Auth Service (Port 8001)
cd backend/services/auth && npm run dev

# Terminal 3: Chat Service (Port 8002)
cd backend/services/chat && npm run dev

# Terminal 4: Agent Service (Port 8003)
cd backend/services/agent && npm run dev

# Terminal 5: Frontend (Port 5173)
cd frontend && npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Testing the Agents

You can run the comprehensive automated test suite across all agents:

```bash
cd backend/services/agent
node test_agents.js
```

All 7 pathways (`chat`, `search`, `coding`, `imageGen`, `ppt`, `pdf`, and `auto`) are verified with automated assertions.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

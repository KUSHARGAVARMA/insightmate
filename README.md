# 🧠 InsightMate – Smart Feedback Analyzer

InsightMate is an intelligent feedback analysis tool designed to help teams extract value from user input. Built with modern AI and frontend technologies, it aims to work locally and privately, going beyond API-wrapping to real AI engineering.

---

## ✅ Current Features

### 1. ✍️ Feedback Submission UI
Users can enter feedback through a clean interface built using **Next.js (App Router)** and **TypeScript**.

### 2. 🧠 Feedback Analyzer (MVP v1)
- Uses **OpenAI GPT-4** to:
  - Summarize user feedback
  - Extract action items
  - Analyze sentiment and tone
- Displays results in a structured format
- Works via a backend route: `POST /api/analyze-feedback`

### 3. 🔐 Secure OpenAI API Integration
- API key stored in `.env.local`
- Calls handled server-side to keep keys private

### 4. ⚙️ Modern Stack
- **Next.js (App Router)**
- **TypeScript**
- **Clean modular codebase** with `app/`, `api/`, and `components/` folders

---

## 🚧 Next Steps (In Progress)

### Phase 2 – Semantic Embeddings & Vector Search
- Generate embeddings (using OpenAI or MiniLM)
- Store feedback vectors in a local DB (e.g., **ChromaDB**)
- Add “Find Similar Feedback” feature using **cosine similarity**

### Phase 3 – Smart Summarization (RAG)
- Retrieve top-k similar feedbacks
- Use them to summarize insights or show trends
- Optimize API usage by reducing redundant GPT calls

---

## 📦 Setup

```bash
git clone <your-repo-url>
cd insightmate
npm install
cp .env.local.example .env.local
# Add your OpenAI API key in .env.local
npm run dev

# ✨ InsightMate

InsightMate is an AI-powered feedback analysis tool that uses OpenAI and Pinecone to turn raw customer feedback into structured insights.

🎯 **Key Features**
- Summarize and categorize customer feedback
- Store embeddings for semantic search
- Retrieve insights via RAG (retrieval-augmented generation)
- Lightweight API that can be used by any frontend

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/insightmate.git
cd insightmate
```

---

### 2️⃣ Install dependencies
```bash
npm install
```

---

### 3️⃣ Configure environment variables

Create a `.env.local` file in the project root:

```
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_env
PINECONE_INDEX=your_pinecone_index
```

*(Never commit this file)*

---

### 4️⃣ Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🌐 API Usage

You can POST feedback and retrieve insights via REST endpoints.

---

### 📝 Analyze Feedback
**POST** `/api/analyze-feedback`

**Request Body:**
```json
{
  "text": "I love the app but the login is slow."
}
```

**Response:**
```json
{
  "summary": "...",
  "category": "...",
  "improvement": "..."
}
```

---

### 🔍 Semantic Search
**POST** `/api/semantic-search`

**Request Body:**
```json
{
  "query": "login issues"
}
```

**Response:**
Returns similar feedback entries with scores.

---

### 💡 RAG Insights
**POST** `/api/rag-insights`

**Request Body:**
```json
{
  "question": "What are the top issues users reported?"
}
```

**Response:**
Generates a concise answer referencing stored feedback.

---

## 🛡️ CORS and Usage
This API is intended to be deployed as a standalone service.
- You can enable CORS so other frontends can call it.
- To protect your OpenAI usage, consider adding API keys or authentication.

---

## 🌱 Future Improvements
- CSV importer
- User authentication (NextAuth)
- API key auth and rate limiting
- Usage dashboards
- Role-based prompt customization

---

## 🧑‍💻 Contributing
Pull requests are welcome! Please open issues for bugs or suggestions.

---

## 📄 License
MIT

---

**Enjoy building with InsightMate!**

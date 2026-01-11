# Deliverable #1: System Architecture & Design Overview

---

## 1. High-Level System Architecture

```mermaid
graph TD
  subgraph Frontend
    ReactApp[React Application]
    ReactApp -->|Modes: School, College, Lawyer| LAWGENModes
  end

  subgraph Backend
    NodeExpress["Node.js / Express Backend"]
    FastAPI["Python / FastAPI Backend (Lawgen-python)"]
  end

  subgraph RAG_Pipeline
    Chunker["Chunking Service"]
    Embedder["Embedding Service"]
    VectorDB["Vector Database (pgvector / Pinecone)"]
    Retriever["Retriever Service"]
    ReRanker["Re-Ranker"]
    LLM["Large Language Model (Claude / OpenAI)"]
  end

  subgraph Relational_DB
    Postgres["PostgreSQL via Prisma ORM"]
  end

  subgraph Storage
    ObjectStorage["Object / File Storage"]
  end

  subgraph Authentication
    JWT["JWT / Session Auth"]
  end

  subgraph Monitoring
    Logging["Logging & Metrics"]
  end

  subgraph External_Models
    Claude["Claude API"]
    OpenAI["OpenAI API"]
  end

  ReactApp -->|REST/gRPC| NodeExpress
  ReactApp -->|REST/gRPC| FastAPI
  NodeExpress --> RAG_Pipeline
  FastAPI --> RAG_Pipeline
  Chunker --> Embedder
  Embedder --> VectorDB
  Retriever --> ReRanker
  ReRanker --> LLM
  LLM --> ReactApp
  VectorDB --> Retriever
  NodeExpress -->|Database Requests| Postgres
  FastAPI -->|Database Requests| Postgres
  NodeExpress -->|Object Storage Requests| ObjectStorage
  FastAPI -->|Object Storage Requests| ObjectStorage
  NodeExpress --> Authentication
  FastAPI --> Authentication
  NodeExpress --> Monitoring
  FastAPI --> Monitoring
  LLM --> External_Models
```

---

## 2. Data Flow Diagrams

### 2.1 Ingestion Pipeline

```mermaid
flowchart LR
  RawText["Raw Judgments / Ebooks / Content"]
  Clean["Clean & Normalize Text"]
  Chunk["Chunking Service"]
  Embed["Embedding Service (Batching, Retry, Rate-limit)"]
  VectorDB["Vector Database (pgvector/Chroma/Pinecone/FAISS)"]

  RawText --> Clean --> Chunk --> Embed --> VectorDB
```

### 2.2 Retrieval Pipeline

```mermaid
flowchart LR
  UserQuery["User Query"]
  Retriever["Vector Retriever"]
  ReRanker["Re-Ranker"]
  PromptBuilder["Prompt Constructor"]
  LLM["Large Language Model"]
  UserResponse["LLM Response"]

  UserQuery --> Retriever --> ReRanker --> PromptBuilder --> LLM --> UserResponse
```

### 2.3 Frontend-Backend-RAG Message Flow

```mermaid
sequenceDiagram
  participant FE as Frontend
  participant BE as Backend
  participant RAG as RAG Pipeline (Retriever + LLM)

  FE->>BE: Send user input/query
  BE->>RAG: Retrieve relevant chunks & generate response
  RAG-->>BE: Return generated response
  BE-->>FE: Send response to frontend
```

---

## 3. Entity Relationship Diagram (ERD)

### Key Models

- User (id, email, role, profile info, progress, chatMessages, etc.)
- LegalCase (caseNumber, court, parties, facts, decision, embeddings)
- SchoolContent (ebooks, quizzes, content metadata)
- CollegeContent (3D models, subject content)
- Quiz, QuizAttempt
- ChatMessage
- Collaboration
- MockCourtSession
- LawyerProgress

```mermaid
erDiagram
  USER ||--o{ CHAT_MESSAGE : "sends"
  USER ||--o{ QUIZ_ATTEMPT : "takes"
  USER ||--o{ MOCK_COURT_SESSION : "participates in"
  USER ||--o{ DOCUMENT : "owns"
  USER ||--o{ COLLABORATION : "creates"
  USER ||--o{ SCHOOL_PROGRESS : "has"
  USER ||--o{ COLLEGE_PROGRESS : "has"
  USER ||--o{ LAWYER_PROGRESS : "has"

  LEGAL_CASE ||--o{ MOCK_COURT_SESSION : "used in"
  SCHOOL_CONTENT ||--o{ QUIZ : "contains"
  QUIZ ||--o{ QUIZ_ATTEMPT : "attempted by"
  SCHOOL_CONTENT ||--o{ SCHOOL_PROGRESS : "tracked by"
  COLLEGE_CONTENT ||--o{ COLLEGE_PROGRESS : "tracked by"
  LAWYER_PROGRESS }o--|| LEGAL_CASE : "relates to"
```

---

## 4. API Surface Overview

| Endpoint                  | Method | Description                              | Input Example                   | Output Example                  |
|---------------------------|--------|--------------------------------------|--------------------------------|--------------------------------|
| /api/chat/send            | POST   | Send message to chat AI                | { userId, message, mode }       | { reply, messageId, timestamp }|
| /api/chat/history         | GET    | Get last 50 messages for user          | ?userId=123                    | { messages: [ ... ] }           |
| /api/rag/query            | POST   | Retrieve RAG responses (planned)       | { query, mode }                | { results, sourceDocs }         |
| /api/video/progress       | POST   | Track user's video progress             | { userId, videoId, progress } | { success: true }               |
| /api/quiz/*               | Various | Quiz related endpoints (create, submit)| ...                          | ...                            |
| /api/cases/search         | GET    | Search legal cases (planned)            | ?query=xyz                     | { cases: [...]}                 |
| /api/cases/:id            | GET    | Fetch case details by ID (planned)      |                                | { caseDetails }                 |
| /api/cases/compare        | POST   | Compare two or more cases (planned)     | { caseIds: [...] }             | { comparisonResults }           |

- Error states: 400 for bad requests, 404 for not found, 500 for internal errors, with JSON error messages.

---

## 5. Scaling & Availability Notes

- **Horizontal scaling:** Backend and RAG pipeline components deployed in Docker containers or managed services with autoscaling.
- **Embedding batching:** Embedding requests batched for efficiency with retry and rate-limit handling.
- **Ingestion parallelism:** Multiple workers chunk and embed documents asynchronously.
- **Caching strategy:** Vector DB and query caches to reduce latency, CDN for frontend assets.
- **Rate limits:** API gateways throttle requests per user/session.
- **Object storage:** S3 or compatible storage for raw documents, media, and backups.
- **Connection pooling:** Database and vector DB connection pools managed for concurrency.
- **Index optimization:** Vector DB indexes fine-tuned for fast retrieval.
- **Cost management:** Monitor embedding API token usage and cloud resource consumption.
- **Monitoring & logging:** Centralized logging (e.g., ELK stack) and metrics dashboards (e.g., Prometheus/Grafana).

---

Deliverable #1 document complete with architecture, data flow, ERD, API surface, and scaling notes.

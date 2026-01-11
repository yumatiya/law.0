# Deliverable #1: System Architecture & Design Overview

---

## 1. High-Level System Architecture

```mermaid
graph TD
  subgraph Frontend
    ReactApp[Next.js / React Application]
    ReactApp -->|Modes: School, College, Lawyer| LAWGENModes
  end

  subgraph Backend
    NodeExpress["Node.js / Express Backend + Next API Routes"]
    FastAPI["Python / FastAPI Backend (Lawgen-python)"]
  end

  subgraph RAG_Pipeline
    Chunker["Chunking Service"]
    Embedder["Embedding Service"]
    VectorDB["Vector Database (Pinecone / Qdrant / Weaviate / PGVector)"]
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
    AuthLayer["JWT / Session Authentication"]
  end

  subgraph Monitoring
    Logging["Logging & Metrics"]
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
  NodeExpress --> AuthLayer
  FastAPI --> AuthLayer
  NodeExpress --> Logging
  FastAPI --> Logging
  LLM -->|External Calls| Claude
  LLM -->|External Calls| OpenAI
```

---

## 2. Data Flow Diagrams

### 2.1 Case Ingestion Pipeline

```mermaid
flowchart LR
  RawText["Raw Judgments / Ebooks / Content"]
  Clean["Clean & Normalize Text"]
  Chunk["Chunking Service"]
  Embed["Embedding Service (Batching, Retry, Rate-limit Handling)"]
  VectorDB["Vector DB (Pinecone/Qdrant/Weaviate/PGVector)"]

  RawText --> Clean --> Chunk --> Embed --> VectorDB
```

### 2.2 Query Retrieval Pipeline

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

### 2.3 Frontend → Backend → RAG → Backend → Frontend Message Flow

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

### 2.4 Multimedia Mapping (MBBS Mode)

- Video, 3D model, and interactive content are mapped and tracked alongside textual content ingestion for a complete educational experience.

---

## 3. Entity Relationship Diagram (ERD)

Based on the Prisma schema, key models and relationships include:

```mermaid
erDiagram
  USER ||--o{ CHAT_MESSAGE : sends
  USER ||--o{ QUIZ_ATTEMPT : takes
  USER ||--o{ MOCK_COURT_SESSION : participates_in
  USER ||--o{ DOCUMENT : owns
  USER ||--o{ COLLABORATION : creates
  USER ||--o{ SCHOOL_PROGRESS : has
  USER ||--o{ COLLEGE_PROGRESS : has
  USER ||--o{ LAWYER_PROGRESS : has

  LEGAL_CASE ||--o{ MOCK_COURT_SESSION : used_in
  SCHOOL_CONTENT ||--o{ QUIZ : contains
  QUIZ ||--o{ QUIZ_ATTEMPT : attempted_by
  SCHOOL_CONTENT ||--o{ SCHOOL_PROGRESS : tracked_by
  COLLEGE_CONTENT ||--o{ COLLEGE_PROGRESS : tracked_by
  LAWYER_PROGRESS }o--|| LEGAL_CASE : relates_to
```

### Additional Entities

- Profile (within User context)  
- VideoProgress (SchoolProgress, CollegeProgress tables)  
- Bookmarks and CaseChunks are planned extensions based on schema references.

---

## 4. Backend API Surface Overview

| Endpoint               | Method | Description                              | Input Example                           | Output Example                   |
|------------------------|--------|----------------------------------------|----------------------------------------|---------------------------------|
| /api/chat/send         | POST   | Send user message to AI chat            | { userId, message, mode }               | { reply, messageId, timestamp } |
| /api/chat/history      | GET    | Retrieve last 50 messages for user      | ?userId=123                            | { messages: [ ... ] }            |
| /api/rag/query         | POST   | Retrieve RAG query responses (planned)  | { query, mode }                        | { results, sourceDocs }          |
| /api/video/progress    | POST   | Save/update user's video progress        | { userId, videoId, progress, duration, completed } | { success: true }        |
| /api/video/progress    | GET    | Get user video progress                  | ?userId=...&videoId=...                | { userId, videoId, progress,...} |
| /api/quiz/*            | Various| Quiz management endpoints (create, submit, etc.) | Various                         | Various                         |
| /api/cases/search      | GET    | Search legal cases (planned)             | ?query=xyz                            | { cases: [...]}                 |
| /api/cases/:id         | GET    | Get detailed info for case by ID (planned) |                                    | { caseDetails }                 |
| /api/cases/compare     | POST   | Compare cases (planned)                   | { caseIds: [...] }                    | { comparisonResults }           |

### Error Handling

- 400: Bad request (missing or invalid params)  
- 404: Not found (e.g., video progress not found)  
- 500: Internal server errors  

Errors return JSON with an error message field.

---

## 5. Scaling & Availability Notes

- **Horizontal Scaling:** Backends and pipeline services run in scalable Docker containers or managed cloud services with auto-scaling.  
- **Embedding Batching:** Embedding requests are batched to optimize throughput and handle rate limits with retries.  
- **Ingestion Parallelism:** Document chunking and embedding run in parallel/asynchronously to speed processing.  
- **Caching Strategy:** Caches at vector DB and API layers reduce query latency; CDN serves frontend assets.  
- **Rate Limits:** API gateway and auth layers enforce per-user rate limits.  
- **Storage:** S3 or compatible object store holds raw documents, media, and backups.  
- **Connection Pooling:** Managed for Postgres and vector DB to maintain performance under load.  
- **Index Optimization:** Vector search indexes tuned for fast similarity queries.  
- **Cost Management:** Monitored embedding API token usage and cloud deploy resource consumption.  
- **Monitoring & Logging:** Centralized logging (e.g., ELK) and metrics dashboards (e.g., Prometheus/Grafana) track system health and usage.

---

## 6. Vector Database Optimization

Vector database optimization focuses on maximizing efficiency and speed of similarity queries and retrieval from high-dimensional vector embeddings generated from documents or queries.

Key techniques include:

- **Indexing Strategy:** Use of specialized indexes like HNSW (Hierarchical Navigable Small World) graph indexes or IVF (Inverted File) for approximate nearest neighbor (ANN) search, which significantly reduce search time for large vector collections.

- **Similarity Search Optimization:** Optimizing distance calculation algorithms (cosine similarity, Euclidean distance) and leveraging hardware acceleration (e.g., GPUs) for faster query processing.

- **Caching:** Caching frequent query embeddings and results both at application layer and within vector DB to avoid repeated computation and network calls.

- **Batching:** Grouping embedding generation and vector DB queries into batches to reduce overhead, improve throughput, and handle API rate limits gracefully.

- **Embedding Chunking:** Splitting large documents into smaller chunks to create more granular embeddings, improving recall and precision in retrieval.

These optimizations together enable scalable, low-latency semantic search capabilities crucial for delivering real-time responses in RAG pipelines.

---

This completes Deliverable #1 - System Architecture and Design Overview document.

# Qdrant Integration for RAG System

## Overview
Integrate Qdrant vector database for enhanced retrieval-augmented generation (RAG) in the chat system.

## Tasks
- [x] Add Qdrant client to requirements.txt
- [x] Update rag.py to implement vector search with Qdrant
- [x] Create vector database initialization script
- [x] Update chat endpoint in main.py to use RAG
- [x] Add document ingestion functionality
- [ ] Test the integration

## Files to Modify
- lawgen-python/backend/requirements.txt
- lawgen-python/backend/app/rag.py
- lawgen-python/backend/app/main.py
- lawgen-python/backend/app/__init__.py (if needed)

## Dependencies
- qdrant-client
- sentence-transformers (for embeddings)

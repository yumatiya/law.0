from qdrant_client import QdrantClient
from qdrant_client.http import models
from sentence_transformers import SentenceTransformer
import os

# Initialize Qdrant client
qdrant_client = QdrantClient(url="http://localhost:6333")  # Assuming Qdrant is running locally
collection_name = "legal_documents"

# Initialize sentence transformer for embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

def initialize_collection():
    """Initialize Qdrant collection if it doesn't exist"""
    try:
        qdrant_client.get_collection(collection_name)
    except:
        qdrant_client.create_collection(
            collection_name=collection_name,
            vectors_config=models.VectorParams(
                size=384,  # Dimension for all-MiniLM-L6-v2
                distance=models.Distance.COSINE
            )
        )

def add_document(text: str, metadata: dict = None):
    """Add a document to the vector database"""
    if metadata is None:
        metadata = {}

    # Generate embedding
    embedding = model.encode(text).tolist()

    # Generate a simple ID (in production, use UUID)
    import uuid
    doc_id = str(uuid.uuid4())

    # Add to Qdrant
    point = models.PointStruct(
        id=doc_id,
        vector=embedding,
        payload={"text": text, **metadata}
    )

    qdrant_client.upsert(collection_name=collection_name, points=[point])

def retrieve_documents(query: str, limit: int = 5):
    """Retrieve relevant documents for a query"""
    # Generate query embedding
    query_embedding = model.encode(query).tolist()

    # Search in Qdrant
    search_result = qdrant_client.search(
        collection_name=collection_name,
        query_vector=query_embedding,
        limit=limit
    )

    # Extract document texts
    documents = [hit.payload["text"] for hit in search_result]
    return documents

def generate_answer(documents, question):
    """Generate answer based on retrieved documents and question"""
    # This is a simple implementation - in a real system, you'd use an LLM here
    context = "\n".join(documents)
    answer = f"Based on the retrieved documents:\n{context}\n\nAnswer to '{question}': This is a placeholder answer. In a real implementation, this would use an LLM to generate a response."
    return answer

# Initialize collection on import
initialize_collection()

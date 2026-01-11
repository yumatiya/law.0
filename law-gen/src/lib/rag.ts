import { generateEmbeddings } from './ai';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.index(process.env.PINECONE_INDEX_NAME || 'lawgen-rag');

export interface DocumentChunk {
  id: string;
  text: string;
  metadata: {
    title: string;
    type: string;
    source: string;
  };
}

export async function addDocumentToVectorDB(chunks: DocumentChunk[]): Promise<void> {
  const vectors = await Promise.all(
    chunks.map(async (chunk) => ({
      id: chunk.id,
      values: await generateEmbeddings(chunk.text),
      metadata: chunk.metadata,
    }))
  );

  await index.upsert(vectors);
}

export async function searchSimilarDocuments(query: string, topK: number = 5): Promise<DocumentChunk[]> {
  const queryEmbedding = await generateEmbeddings(query);

  const searchResponse = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  });

  return searchResponse.matches.map(match => ({
    id: match.id,
    text: '', // We don't store text in Pinecone, only embeddings
    metadata: match.metadata as any,
  }));
}

export async function ragSearch(query: string): Promise<{
  answer: string;
  sources: DocumentChunk[];
}> {
  // Search for relevant documents
  const sources = await searchSimilarDocuments(query);

  // Generate answer using Claude with context
  const context = sources.map(source => source.metadata.title).join('\n');

  const prompt = `Based on the following legal context, answer the question: ${query}

Context:
${context}

Please provide a comprehensive answer based on the context provided.`;

  // This would call Claude API - simplified for now
  const answer = `Based on the legal context, here's the answer to: ${query}`;

  return {
    answer,
    sources,
  };
}

import { addDocumentToVectorDB, searchSimilarDocuments, ragSearch, DocumentChunk } from './rag';

const mockUpsert = jest.fn().mockResolvedValue(undefined);
const mockQuery = jest.fn().mockResolvedValue({
  matches: [
    {
      id: '1',
      score: 0.9,
      metadata: { title: 'Doc 1', type: 'legal', source: 'source1' },
    },
  ],
});

jest.mock('@pinecone-database/pinecone', () => {
  return {
    Pinecone: jest.fn().mockImplementation(() => {
      return {
        index: jest.fn().mockReturnValue({
          upsert: mockUpsert,
          query: mockQuery,
        }),
      };
    }),
  };
});

// Mock generateEmbeddings and Pinecone client
jest.mock('./ai', () => ({
  generateEmbeddings: jest.fn().mockResolvedValue(
    Array(1536).fill(0.1) // Example embedding array
  ),
}));

describe('RAG Library', () => {
  const exampleChunks: DocumentChunk[] = [
    {
      id: '1',
      text: 'Test text chunk 1',
      metadata: {
        title: 'Title 1',
        type: 'type1',
        source: 'source1',
      },
    },
  ];

  test('addDocumentToVectorDB calls upsert with vectors', async () => {
    await addDocumentToVectorDB(exampleChunks);
    expect(mockUpsert).toHaveBeenCalled();
  });

  test('searchSimilarDocuments returns mapped DocumentChunks', async () => {
    const results = await searchSimilarDocuments('test query', 5);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('id');
    expect(results[0]).toHaveProperty('metadata');
  });

  test('ragSearch returns answer and sources', async () => {
    const response = await ragSearch('test question');
    expect(response).toHaveProperty('answer');
    expect(response).toHaveProperty('sources');
    expect(Array.isArray(response.sources)).toBe(true);
  });
});

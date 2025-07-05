// lib/vector.ts
import { pinecone } from './pinecone';
import { openai } from './openai';

const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

// Upsert one document with embedding
export async function upsertDocument(id: string, text: string, metadata = {}) {
  const embedding = await getEmbedding(text);
  await index.upsert([
    {
      id,
      values: embedding,
      metadata: { text, ...metadata },
    },
  ]);
}

// Search Pinecone with query embedding
export async function searchSimilarDocuments(query: string, topK = 3) {
  const embedding = await getEmbedding(query);

  const results = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  });

  return results.matches?.map((match) => ({
    id: match.id,
    score: match.score,
    ...match.metadata,
  })) || [];
}

// Helper to get embedding from OpenAI
async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0].embedding;
}

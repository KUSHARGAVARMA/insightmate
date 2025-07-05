// src/app/api/seed-pinecone/route.ts

import { NextResponse } from 'next/server';
import { openai } from '../../../../lib/openai';
import { pinecone} from '../../../../lib/pinecone';

const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

// Sample feedback documents
const sampleDocuments = [
  {
    id: '1',
    text: 'I love how intuitive the dashboard is. Makes data analysis easier.',
    metadata: { category: 'UI', sentiment: 'positive' },
  },
  {
    id: '2',
    text: 'The performance could be improved on mobile devices.',
    metadata: { category: 'Performance', sentiment: 'negative' },
  },
  {
    id: '3',
    text: 'Customer support was very helpful in resolving my issue.',
    metadata: { category: 'Support', sentiment: 'positive' },
  },
];

export async function POST() {
  try {
    // Embed and upsert all documents
    const vectors = await Promise.all(
      sampleDocuments.map(async (doc) => {
        const embeddingRes = await openai.embeddings.create({
          model: 'text-embedding-3-large',
          input: doc.text,
        });

        return {
          id: doc.id,
          values: embeddingRes.data[0].embedding,
          metadata: {
            text: doc.text,
            ...doc.metadata,
          },
        };
      })
    );

    // Upsert to Pinecone
    await index.upsert(vectors);

    return NextResponse.json({ message: 'Documents upserted successfully.' });
  } catch (error) {
    console.error('Error seeding Pinecone:', error);
    return NextResponse.json({ error: 'Failed to seed Pinecone' }, { status: 500 });
  }
}

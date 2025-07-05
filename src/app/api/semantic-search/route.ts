
// // src/app/api/semantic-search/route.ts

// import { NextResponse } from 'next/server';
// import { cosineSimilarity } from '../../../../lib/utils';
// import { documents } from '../../../../lib/db'; 
// import { getEmbedding } from '../../../../lib/openai'; // Ensure you have OpenAI client set up
// import { openai } from '../../../../lib/openai'; // Ensure you have OpenAI client set up
// import { log } from 'console';

// export async function POST(req: Request) {
//   try {
//     const { query } = await req.json();

//     if (!query || typeof query !== 'string') {
//       return NextResponse.json({ error: 'Query is required' }, { status: 400 });
//     }

//     // Get the embedding for the user query
//     const queryEmbedding = await getEmbedding(query);

//     // Compare the query embedding with all document embeddings
//     const results = documents
//       .map((doc) => ({
//         ...doc,
//         similarity: cosineSimilarity(queryEmbedding, doc.embedding),
//       }))
//       .sort((a, b) => b.similarity - a.similarity)
//       .slice(0, 3); // Return top 3 results

//     return NextResponse.json({ results });
//   } catch (error) {
//     console.error('Error in semantic search route:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }
// src/app/api/semantic-search/route.ts

import { NextResponse } from 'next/server';
import { searchSimilarDocuments } from '../../../../lib/vector';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Perform real semantic search using Pinecone
    const results = await searchSimilarDocuments(query, 3);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in semantic search route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

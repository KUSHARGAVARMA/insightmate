import { NextResponse } from 'next/server';
import { getEmbedding } from '../../../../lib/openai' // You already have this
import { pinecone } from '../../../../lib/pinecone'; // Your initialized client
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const embedding = await getEmbedding(query);

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
    const vectorQuery = await index.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true,
    });

    const contextDocs = vectorQuery.matches
      ?.map((match) => match?.metadata?.text)
      .filter(Boolean)
      .slice(0, 5);

    if (!contextDocs || contextDocs.length === 0) {
      return NextResponse.json({ answer: 'No relevant context found.' });
    }

    const prompt = `
You are an AI assistant that answers specific business or product-related questions using ONLY the context provided below.

Focus on giving a short, clear, and actionable answer. Do not summarize all feedback. Do not add unrelated information.

If the context is not relevant, say: "Not enough context to answer."

Question: "${query}"

Context:
${contextDocs.map((doc, i) => `${i + 1}. ${doc}`).join('\n')}

Answer (max 3 bullet points):
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI assistant that gives clear and concise product insights based on feedback context only.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 300,
    });

    const answer = completion.choices[0].message?.content;

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('RAG error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

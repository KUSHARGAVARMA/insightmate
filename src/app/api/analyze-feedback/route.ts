import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import {pinecone} from '../../../../lib/pinecone';
const openAiApiKey = process.env.OPENAI_API_KEY;
const pineconeIndexName = process.env.PINECONE_INDEX_NAME;

if (!openAiApiKey) throw new Error('Missing OPENAI_API_KEY in env variables');
if (!pineconeIndexName) throw new Error('Missing PINECONE_INDEX_NAME in env variables');

const openai = new OpenAI({ apiKey: openAiApiKey });

interface AnalyzeFeedbackRequest {
  message: string;
}

export async function POST(request: Request) {
  try {
    const body: AnalyzeFeedbackRequest = await request.json();
    const userMessage = body.message?.trim();

    if (!userMessage) {
      return NextResponse.json(
        { error: 'No input message provided' },
        { status: 400 }
      );
    }

    // 1. Analyze feedback with GPT chat completion
    const prompt = `
Please analyze this customer feedback and provide a JSON object with the following fields:
- summary: a short summary of the feedback
- category: one of [positive, negative, bug report, feature request]
- improvement: one actionable idea to improve based on the feedback

Feedback: "${userMessage}"

Respond only with a valid JSON object.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant that extracts insights from user feedback.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const responseText = completion.choices[0].message?.content;

    if (!responseText) {
      return NextResponse.json(
        { error: 'OpenAI returned empty response' },
        { status: 500 }
      );
    }
    function sanitizeJSONResponse(raw: string): string {
      return raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
    }
    

    // 2. Parse JSON response safely
    let jsonResponse;
try {
  // Try parsing directly first
  jsonResponse = JSON.parse(responseText);
} catch (parseError1) {
  // If it fails, sanitize and retry
  try {
    const sanitized = sanitizeJSONResponse(responseText);
    jsonResponse = JSON.parse(sanitized);
  } catch (parseError2) {
    // If it still fails, return error
    return NextResponse.json(
      {
        error: "Failed to parse OpenAI response as JSON",
        rawResponse: responseText,
      },
      { status: 500 }
    );
  }
}


    // 3. Generate embedding for the user message
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: userMessage,
    });

    const embedding = embeddingResponse.data[0].embedding;

    // 4. Upsert embedding + metadata into Pinecone
    const pineconeIndexName = process.env.PINECONE_INDEX_NAME;
    if (!pineconeIndexName) {
      throw new Error('Missing PINECONE_INDEX_NAME in environment variables');
    }
    
    const index = pinecone.Index(pineconeIndexName);
    
    // Generate a unique ID for this feedback (timestamp-based)
    const feedbackId = `feedback-${Date.now()}`;

    await index.upsert([
        {
          id: feedbackId,
          values: embedding,
          metadata: {
            text: userMessage,
            summary: jsonResponse.summary,
            category: jsonResponse.category,
            improvement: jsonResponse.improvement,
          },
        },
      ],
    );

    // 5. Return the analyzed feedback JSON
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
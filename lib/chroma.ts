// lib/chroma.ts
import { ChromaClient } from 'chromadb';

const client = new ChromaClient(); // Defaults to localhost:8000

export async function listAllCollections() {
  try {
    const collections = await client.listCollections();
    console.log('Available Chroma collections:', collections);
    return collections;
  } catch (error) {
    console.error('Error listing Chroma collections:', error);
    throw error;
  }
}

// lib/db.ts
import { getEmbedding } from './openai';

// Define the type for a document
export type Document = {
  id: string;
  title: string;
  content: string;
  embedding: number[]; // semantic vector
};

// Mock documents – update or replace with real data later
export const documents: Document[] = [
  {
    id: '1',
    title: 'Getting Started with InsightMate',
    content: 'InsightMate helps you analyze user feedback intelligently.',
    embedding: await getEmbedding('InsightMate helps you analyze user feedback intelligently.'),
  },
  {
    id: '2',
    title: 'Changelog - May Release',
    content: 'We have added semantic search support to enhance results.',
    embedding: await getEmbedding('We have added semantic search support to enhance results.'),
  },
  {
    id: '3',
    title: 'User Onboarding Guide',
    content: 'Learn how to onboard users effectively with tips and templates.',
    embedding: await getEmbedding('Learn how to onboard users effectively with tips and templates.'),
  },
];

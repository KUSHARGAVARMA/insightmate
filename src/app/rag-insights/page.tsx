'use client';

import { useState } from 'react';

export default function RAGInsightsPage() {
  const [query, setQuery] = useState('');
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchInsight = async () => {
    setLoading(true);
    setInsight('');
    setError('');

    try {
      const res = await fetch('/api/rag-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setInsight(data.answer);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">RAG Insights Generator</h1>

      <div>
        <label className="block mb-2 font-medium">Ask a question based on feedback data:</label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={4}
          placeholder="e.g., What do users think about the review system?"
          className="w-full p-3 text-black border rounded-md"
        />
      </div>

      <button
        onClick={handleFetchInsight}
        disabled={loading || !query.trim()}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Insight'}
      </button>

      {error && <p className="text-red-500">Error: {error}</p>}

      {insight && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold text-black mb-2">Insight:</h2>
          <p className="whitespace-pre-wrap text-gray-800">{insight}</p>
        </div>
      )}
    </div>
  );
}

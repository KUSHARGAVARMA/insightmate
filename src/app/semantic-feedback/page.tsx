'use client';

import { useState } from 'react';

// Define the expected shape of one search result
type SearchResult = {
  text: string;
  summary: string;
  category: string;
  improvement: string;
  score: number;
};

export default function SemanticSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setResults([]);
    setError(null);

    try {
      const response = await fetch('/api/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data: { results: SearchResult[] } = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Semantic Search</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search your feedback semantically..."
          className="flex-1 text-black p-2 border rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading || !query.trim()}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      <div className="mt-6">
        {results.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold mb-2">Results:</h2>
            <ul className="space-y-2">
              {results.map((item, index) => (
                <li
                  key={index}
                  className="border p-3 rounded shadow-sm bg-white text-black"
                >
                  <p><strong>Feedback:</strong> {item.text || 'N/A'}</p>
                  <p><strong>Summary:</strong> {item.summary || 'N/A'}</p>
                  <p><strong>Category:</strong> {item.category || 'N/A'}</p>
                  <p><strong>Improvement:</strong> {item.improvement || 'N/A'}</p>
                  <p><strong>Score:</strong> {item.score?.toFixed(2) ?? 'N/A'}</p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          query &&
          !loading &&
          !error && <p className="text-gray-500 mt-4">No matching results found.</p>
        )}
      </div>
    </main>
  );
}

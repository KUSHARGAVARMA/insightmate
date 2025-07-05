'use client';

import { useState } from 'react';

export default function SemanticSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setResults([]);

    try {
      const response = await fetch('/api/semantic-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Error during semantic search:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Semantic Search</h1>

      <input
        type="text"
        placeholder="Search your feedback semantically..."
        className="w-full text-black p-2 border rounded mb-4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading || !query}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      <div className="mt-6">
        {results.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold mb-2">Results:</h2>
            <ul className="space-y-2">
              {results.map((item, index) => (
                <li key={index} className="border p-3 rounded shadow-sm">
                  <strong>Feedback:</strong> {item.text || 'N/A'} <br />
                <strong>Summary:</strong> {item.summary || 'N/A'} <br />
                <strong>Category:</strong> {item.category || 'N/A'} <br />
                <strong>Improvement:</strong> {item.improvement || 'N/A'} <br />
                <strong>Score:</strong> {item.score?.toFixed(2) || 'N/A'}
                </li>
              ))}
            </ul>
          </>
        ) : (
          query && !loading && <p className="text-gray-500 mt-4">No matching results found.</p>
        )}
      </div>
    </main>
  );
}

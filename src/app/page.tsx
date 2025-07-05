"use client";

import Card from '@/components/Card';
import Button from '@/components/Button';
import { useState } from 'react';

export default function Home() {
  type Message = {
    type: 'user' | 'ai';
    text: string;
  };

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async () => {
    const trimmedInput = inputText.trim();
    if (!trimmedInput) return;

    setMessages((prev) => [...prev, { type: 'user', text: trimmedInput }]);
    setInputText('');

    try {
      const response = await fetch('/api/analyze-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedInput }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      const aiResponse = [
        `📝 Summary: ${result.summary || 'N/A'}`,
        `🏷️ Category: ${result.category || 'N/A'}`,
        `💡 Improvement Idea: ${result.improvement || 'N/A'}`
      ].join('\n');

      setMessages((prev) => [...prev, { type: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error('API call failed:', error);
      setMessages((prev) => [
        ...prev,
        { type: 'ai', text: '⚠️ Something went wrong. Please try again later.' }
      ]);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 space-y-6">
      <h1 className="text-3xl font-bold">Welcome to InsightMate!</h1>

      <div className="w-full max-w-md mt-8 flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 text-gray-800 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Write your feedback..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>

      <div className="mt-6 space-y-4 w-full max-w-md">
        {messages.map((msg, index) => (
          <Card
            key={index}
            title={msg.type === 'user' ? 'You' : 'InsightMate'}
            description={msg.text}
            className={msg.type === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'}
          />
        ))}
      </div>
    </main>
  );
}

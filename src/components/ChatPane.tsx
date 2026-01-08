'use client';

import { useState } from 'react';

interface ChatPaneProps {
  className?: string;
}

export default function ChatPane({ className }: ChatPaneProps) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    setResponse(data.answer);
  };

  return (
    <div className={`${className} bg-gray-50 p-4 flex flex-col`}>
      <h2 className="text-lg font-bold mb-4">Assistant</h2>
      <div className="flex-1 overflow-y-auto mb-4">
        {response && <p>{response}</p>}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Ask a question..."
        />
        <button type="submit" className="mt-2 w-full bg-blue-500 text-white p-2 rounded">Ask</button>
      </form>
    </div>
  );
}
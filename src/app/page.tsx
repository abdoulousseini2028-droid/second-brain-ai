'use client';

import { useState } from 'react';
import { Document } from '@/types';
import SourcesPane from '@/components/SourcesPane';
import PreviewPane from '@/components/PreviewPane';
import ChatPane from '@/components/ChatPane';

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<Document | null>(null);

  const handleIngest = async () => {
    await fetch('/api/ingest', { method: 'POST' });
    window.location.reload(); // simple reload to refresh data
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Personal AI Knowledge Assistant</h1>
        <button onClick={handleIngest} className="ml-4 px-4 py-2 bg-blue-500 rounded">Use Sample Data</button>
      </header>
      <div className="flex flex-1">
        <SourcesPane onSelect={setSelectedItem} className="w-1/4" />
        <PreviewPane item={selectedItem} className="w-1/2" />
        <ChatPane className="w-1/4" />
      </div>
    </div>
  );
}

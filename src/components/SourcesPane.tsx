'use client';

import { useEffect, useState } from 'react';
import { Document } from '@/types';

interface SourcesPaneProps {
  onSelect: (item: Document) => void;
  className?: string;
}

export default function SourcesPane({ onSelect, className }: SourcesPaneProps) {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    fetch('/api/documents').then(res => res.json()).then(setDocuments);
  }, []);

  return (
    <div className={`${className} bg-gray-100 p-4`}>
      <h2 className="text-lg font-bold mb-4">Sources</h2>
      <ul>
        {documents.map(doc => (
          <li key={doc.id} className="mb-2 cursor-pointer" onClick={() => onSelect(doc)}>
            {doc.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
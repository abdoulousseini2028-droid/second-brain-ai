'use client';

import { Document } from '@/types';

interface PreviewPaneProps {
  item: Document | null;
  className?: string;
}

export default function PreviewPane({ item, className }: PreviewPaneProps) {
  if (!item) return <div className={`${className} bg-white p-4`}>Select an item</div>;

  return (
    <div className={`${className} bg-white p-4`}>
      <h2 className="text-lg font-bold mb-4">{item.title}</h2>
      <pre className="whitespace-pre-wrap">{item.content}</pre>
    </div>
  );
}
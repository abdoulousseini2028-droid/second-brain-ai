import { Document, Chunk } from '@/types';
import { generateEmbedding } from './embeddings';
import { addDocument, addChunk } from '@/lib/storage';
import crypto from 'crypto';

export async function ingestDocument(doc: Document) {
  addDocument(doc);
  const chunks = chunkText(doc.content, 600, 100);
  for (const chunkText of chunks) {
    const hash = crypto.createHash('md5').update(chunkText).digest('hex');
    // Check if exists, but for simplicity, skip dedup
    const embedding = await generateEmbedding(chunkText);
    const chunk: Chunk = {
      id: crypto.randomUUID(),
      documentId: doc.id,
      text: chunkText,
      embedding,
      metadata: doc.metadata,
      hash
    };
    addChunk(chunk);
  }
}

function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  return chunks;
}
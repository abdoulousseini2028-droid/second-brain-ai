import { Document, Chunk, Clip } from '@/types';

let documents: Document[] = [];
let chunks: Chunk[] = [];
let clips: Clip[] = [];

export function addDocument(doc: Document) {
  documents.push(doc);
}

export function addChunk(chunk: Chunk) {
  chunks.push(chunk);
}

export function addClip(clip: Clip) {
  clips.push(clip);
}

export function getDocuments(): Document[] {
  return documents;
}

export function getChunks(): Chunk[] {
  return chunks;
}

export function getClips(): Clip[] {
  return clips;
}

export function searchChunks(queryEmbedding: number[], topK: number = 5): Chunk[] {
  const similarities = chunks.map(chunk => ({
    chunk,
    similarity: cosineSimilarity(queryEmbedding, chunk.embedding)
  }));
  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities.slice(0, topK).map(s => s.chunk);
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}
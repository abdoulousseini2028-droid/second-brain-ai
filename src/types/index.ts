export interface Document {
  id: string;
  title: string;
  sourceType: 'email' | 'note' | 'book' | 'pdf' | 'clip';
  url?: string;
  content: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface Chunk {
  id: string;
  documentId: string;
  text: string;
  embedding: number[];
  metadata: Record<string, any>;
  hash: string;
}

export interface Clip {
  id: string;
  text: string;
  tags: string[];
  notes?: string;
  sourceId: string;
  createdAt: Date;
}

export interface Provenance {
  id: string;
  title: string;
  sourceType: string;
  url?: string;
  snippet: string;
  similarity_score: number;
}

export interface QueryResult {
  answer: string;
  provenance: Provenance[];
}
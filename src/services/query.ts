import { QueryResult, Provenance } from '@/types';
import { generateEmbedding } from './embeddings';
import { searchChunks, getDocuments } from '@/lib/storage';
import { streamQueryLLM } from './llm';
import { SYSTEM_PROMPT } from './defaultPrompts';

export async function queryKnowledge(query: string): Promise<QueryResult> {
  const queryEmbedding = await generateEmbedding(query);
  const topChunks = searchChunks(queryEmbedding, 5);
  const context = topChunks.map(chunk => chunk.text);
  const documents = getDocuments();

  let answer = '';
  for await (const chunk of streamQueryLLM(`${SYSTEM_PROMPT}\n\nQuery: ${query}`, context)) {
    answer += chunk;
  }

  const provenance: Provenance[] = topChunks.map((chunk, index) => {
    const doc = documents.find(d => d.id === chunk.documentId)!;
    return {
      id: chunk.id,
      title: doc.title,
      sourceType: doc.sourceType,
      url: doc.url,
      snippet: chunk.text,
      similarity_score: 0 // placeholder
    };
  });

  return { answer, provenance };
}
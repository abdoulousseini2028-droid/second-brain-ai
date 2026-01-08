import { Document } from '@/types';
import { ingestDocument } from './ingestion';
import fs from 'fs';
import path from 'path';

export async function loadSampleData() {
  // Load emails
  const emailData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'sample-data/email-inbox.json'), 'utf-8'));
  for (const email of emailData) {
    const doc: Document = {
      id: email.id,
      title: email.subject,
      sourceType: 'email',
      content: email.thread.map((m: any) => m.body).join('\n\n'),
      metadata: { from: email.from, date: email.date },
      createdAt: new Date(email.date)
    };
    await ingestDocument(doc);
  }

  // Load highlights
  const highlightData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'sample-data/reading-highlights.json'), 'utf-8'));
  for (const highlight of highlightData) {
    const doc: Document = {
      id: highlight.id,
      title: highlight.book,
      sourceType: 'book',
      content: highlight.text,
      metadata: { page: highlight.page },
      createdAt: new Date()
    };
    await ingestDocument(doc);
  }

  // Load files
  const files = ['System Design — Chat Service.md', 'Book Notes — Building Systems.md'];
  for (const file of files) {
    const content = fs.readFileSync(path.join(process.cwd(), 'sample-data', file), 'utf-8');
    const doc: Document = {
      id: file,
      title: file.replace('.md', ''),
      sourceType: 'note',
      content,
      metadata: {},
      createdAt: new Date()
    };
    await ingestDocument(doc);
  }
}
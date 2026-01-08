import { NextRequest, NextResponse } from 'next/server';
import { loadSampleData } from '@/services/connectors';

export async function POST(request: NextRequest) {
  try {
    await loadSampleData();
    return NextResponse.json({ message: 'Ingestion started' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to ingest' }, { status: 500 });
  }
}
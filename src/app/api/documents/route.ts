import { NextResponse } from 'next/server';
import { getDocuments } from '@/lib/storage';

export async function GET() {
  const documents = getDocuments();
  return NextResponse.json(documents);
}
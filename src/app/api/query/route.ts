import { NextRequest, NextResponse } from 'next/server';
import { queryKnowledge } from '@/services/query';

export async function POST(request: NextRequest) {
  const { query } = await request.json();
  try {
    const result = await queryKnowledge(query);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Query failed' }, { status: 500 });
  }
}
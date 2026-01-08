# Personal AI Knowledge Assistant (PAKA)

A personal knowledge workspace that ingests your emails, notes, and reading materials to provide conversational retrieval.

## Setup

1. Install dependencies: `npm install`
2. Set up environment: Create `.env.local` with `GOOGLE_API_KEY=your_key`
3. Run the app: `npm run dev`

## Features

- Ingest sample data via API `/api/ingest`
- Query knowledge via `/api/query`
- File-manager UI with sources, preview, and chat

## Trade-offs

- Uses in-memory storage instead of Supabase for demo
- Simple chunking without advanced deduplication
- No real PDF parsing, uses text files

# App Vision — Personal AI Knowledge Assistant (Personal learning, file-manager + multi-source)

Name
- Personal AI Knowledge Assistant (PAKA)

Users
- Individuals (developers, researchers, students, lifelong learners) who want to retireve knowledge they've already created or consumed — emails, personal notes, book highlights, course materials — without doing extra manual organizing.
- The app is explicitly NOT a recruiter demo. It's a personal knowledge workspace to make your past learning frictionless and actionable.

Core idea (aligned to the YouTube script)
- The app automatically ingests and indexes the signals you already produce and receive (emails, notes, book highlights, learning materials). Instead of building more surface-level projects or repeatedly re-reading material, PAKA lets you ask natural-language questions and retrieves answers synthesized from your personal knowledge with clear citations, so you can "retire" knowledge into an accessible conversational interface with minimal ongoing effort.

Value proposition
- Minimal-effort knowledge capture: connect your email and notes, import your reading highlights and PDFs, and let the app keep them searchable and conversational.
- Retrieval-first UX: ask questions and get concise, evidence-backed answers with provenance (so you can verify and re-open the original context).
- Designed for personal learning and long-term knowledge reuse rather than demonstration to third-parties.

MVP Key features
- Low-friction connectors:
  - Email: Gmail/Outlook (or sample inbox JSON for demo)
  - Notes: Markdown/Notion exports, local note folders
  - Learning materials & books: PDFs, ebook highlights exports (e-reader or manual notes)
- File-manager style UI:
  - Left pane: sources + folders (Inbox, Notes, Books, Clips, Tags)
  - Center pane: preview viewer (PDF renderer, Markdown viewer, email thread reader, highlight viewer)
  - Right pane: assistant chat with provenance (collapsible)
  - Support selection/highlight -> "Clip" to save snippet + tags/notes
- Automatic ingestion & background indexing:
  - When a connector is added, the app syncs new items in the background and creates embeddings without manual upload steps.
  - Provide a simulated connector for demo that requires no credentials.
- RAG-powered conversational retrieval:
  - Use Gemini 2.5 for LLM queries. Use Gemini embeddings if available (or documented fallback).
  - Query flow: query embedding -> vector search -> re-rank -> compose prompt -> call Gemini 2.5 -> return answer + numbered citations mapping to specific snippets.
  - If insufficient evidence exists, respond with "I don't know" and suggest related searches or keywords.
- Provenance & verification:
  - Each assistant answer includes a provenance array: [{ id, title, sourceType, url, snippet, similarity_score }]
  - Answers include inline citation markers [1], [2] that map to the provenance list.
  - Clicking a citation scrolls/opens the preview and highlights the corresponding snippet.
- Clips & Collections:
  - Create clips from selections; clips are searchable and embedded so they contribute to future answers.
  - Allow tagging and short notes when creating a clip.

User flows (examples)
- Quick retrieval flow:
  1. User installs app and connects (or loads sample demo data).
  2. The app automatically ingests recent emails, notes, and reading highlights (simulated in demo).
  3. User asks: "What were the key takeaways from the system design article and my email thread about tradeoffs?"
  4. Assistant returns a short list of tradeoffs with citations [1],[2]. The provenance panel shows both a PDF and an email message.
  5. User clicks [2] to open the email in the preview; the exact sentence is highlighted.
- Passive capture flow:
  - After connecting, new emails and notes are ingested automatically in the background; the app optionally emails a weekly "knowledge snapshot" of top clips and suggested flashcards.
- Clip & review flow:
  - User highlights a paragraph in a PDF, clicks "Clip", tags it "concurrency", and later asks "What did I save under concurrency?" Assistant returns clips and their contexts.

Data & sample content (demo)
- Provide seeded demo content so no real accounts are needed:
  - PDF: "System Design — Chat Service.pdf"
  - Markdown notes: "Book Notes — Building Systems.md"
  - Email thread sample inbox JSON with 2–3 threads
  - Reading highlights JSON (ebook excerpts)
  - Pre-created clips to illustrate workflow

UI details
- Top bar: App name, "Use sample data", "Connect" (simulated connectors), Settings
- Left pane: collapsible source categories, search, tag filter
- Center: preview viewer supporting text selection + clip action
- Right: streaming chat (Gemini 2.5) with small system prompt indicator and provenance list under each final answer
- Mobile: stacked panes with simple navigation (Sources -> Preview -> Chat)

Ingestion & chunking rules (practical)
- Long docs: chunk size ~600 tokens ±100; overlap 100–150 tokens; store heading context in metadata.
- Short items (emails, notes, highlights): preserve message/paragraph boundaries as single chunks where possible; include thread context (previous 1–2 messages) in metadata.
- Deduplicate using chunk text hash across sources to avoid duplicate citations.
- Keep token counts and origin metadata for every chunk.

Privacy, consent & safety
- Clear consent UI before beginning any connector sync. Describe which folders/labels will be read and what will be stored.
- Provide a "Delete my data" flow that deletes stored docs, chunks, clips, and connector tokens.
- Never expose raw connector tokens to the client. Store keys encrypted server-side.
- For demo mode use only simulated connectors and sample data.

Gemini 2.5 specifics (implementation notes)
- Use Gemini 2.5 (server-side) for all natural language synthesis and streaming responses.
- Use a cost-optimized Gemini embedding model for vectorization if available; otherwise document and implement a fallback.
- Design prompts to ask Gemini 2.5 to produce concise, evidence-backed answers and to include citation markers. Example system instruction (store in `/docs/prompts.md` and `/src/services/defaultPrompts.ts`):
  - "You are a personal knowledge assistant that answers strictly from the provided evidence. Always cite sources inline with numbered markers like [1]. If evidence is missing or insufficient, say 'I don't know' instead of guessing. Keep answers concise (3–6 bullets for lists)."
- Stream partial tokens to the client and attach citations in the finalization step.

Acceptance criteria (MVP)
- Connectors: demo supports at least one non-file source (sample email thread JSON or reading-highlights JSON) alongside files.
- Ingestion: background or on-demand ingestion creates chunk records and embeddings for files + emails + highlights.
- Query: ask a question and receive an answer with at least one clickable citation linking to an ingested item.
- Preview: clicking a citation opens the item and highlights the snippet.
- Clips: create a clip from a selection and find it via search.
- Deployable by following README only (simulated connectors require no keys).

Developer notes
- Implement ingestion as an API route that returns an ingest job id and status endpoint. Connectors normalize items into the same ingestion pipeline.
- Keep LLM and embedding code in `/src/services/llm.ts` and `/src/services/embeddings.ts`. Prompt templates live in `/docs/prompts.md`.
- Provide a simulated connector that loads `sample-data/email-inbox.json` and `sample-data/reading-highlights.json` for local demos and CI smoke tests.

Non-functional goals
- Latency goal: fast retrieval (<300ms for vector search); LLM latency depends on model and streaming behavior.
- Cost controls: use batching, conservative default context window, and offer a low-cost mode for demos.
- Documented trade-offs: list where prototype shortcuts are taken and how to productionize (auth hardening, encryption, indexing, multi-tenant isolation).

Next steps
- Implement a vertical slice: simulated connectors -> ingestion -> vector storage -> query -> file-manager UI with preview + streaming chat (Gemini 2.5).
- Add integration smoke tests that ingest sample files, sample emails, and reading highlights and assert that queries return expected citations.
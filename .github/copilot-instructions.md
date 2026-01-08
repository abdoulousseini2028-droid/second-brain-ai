# Repository-level Copilot instructions

These instructions are included automatically by GitHub Copilot in Agent/Chat prompts. They are written to produce consistent, production-minded, prototype-friendly code for the "Personal AI Knowledge Assistant" project. This version is focused on a personal learning knowledge workspace (not a recruiter demo) that helps users retireve their emails, notes, and learning materials with minimal effort. Use Gemini 2.5 (server-side) for LLM calls.

General
- Use TypeScript for all new code (frontend and backend).
- Use React 19 with React Compiler enabled where applicable.
- Prefer Next.js (app router) for the fullstack scaffold (frontend + serverless API routes). If you produce a Vite + React scaffold, put API code in a `backend/` folder and include a Dockerfile.
- Use functional components and React hooks for state and lifecycle. Do not use `React.FC`.
- Use arrow functions for component definitions and helper functions where appropriate.
- Export components and helpers as named exports (no default exports for major modules).
- Keep implementation simple and idiomatic; prefer clarity over cleverness.
- Put network, database, and LLM calls in separate service modules under `/src/services` or `/backend/services`. The UI must never call third-party LLMs directly.
- Use async/await and always use try/catch around async calls; return typed errors upward.
- Do not commit secrets. Use environment variables and document required vars in `.env.example`.
- Add small, well-named TODOs for future hardening; prototypes may omit heavy infra but mark where to improve.

Code style
- Use Prettier formatting and ESLint rules. Indent using Prettier defaults.
- Use semicolons at the end of each statement.
- Use single quotes for strings.
- Prefer `const` and `let` (never use `var`).
- Import functions and types explicitly by name.
- Keep line length readable; prefer 100 chars.
- Add JSDoc comments for exported functions and complex types.

Type safety
- Use strict TypeScript settings (tsconfig: strict true).
- Define shared types in `/src/types` and use Zod for runtime validation of external inputs (file uploads, webhook payloads).
- Validate and sanitize all user input on the server side.

Folder structure (recommended)
- /src
  - /app or /pages (Next.js app or pages)
  - /components
  - /styles
  - /services (API, llm, embeddings, vector store, storage)
  - /connectors (Gmail, Outlook, Notion, local-notes adapters — server-side only)
  - /lib (small helpers)
  - /types
  - /hooks
  - /tests
- /backend (if using separate Python or Node backend)
- /scripts (ingest helpers and cli)
- /docs (app-vision.md, prompts.md, privacy.md)
- /migrations (Supabase SQL or other DB migrations)
- .github/workflows (CI/CD)

Styling & UI
- Use Tailwind CSS v4 for styling. Prefer utility classes; for complex components create small, documented component wrappers.
- Build a responsive experience prioritizing mobile-first.
- App should feel like a personal knowledge workspace / file-manager:
  - Left pane: hierarchical sources list (Inbox, Notes, Books, Clips, Tags)
  - Center pane: preview viewer for selected item (PDF, ebook highlights, Markdown, email thread)
  - Right pane: assistant chat and provenance panel (collapsible)
  - Support multi-select, tag, pin/clip, and create collections from selections
- Accessibility: semantic HTML, keyboard nav, ARIA attributes, alt text.

AI & LLM usage patterns (Gemini 2.5)
- Use Gemini 2.5 for all completion and reasoning calls (server-side only). For embeddings, use Gemini embeddings if available (prefer the latest low-cost/low-latency Gemini embeddings model); if unavailable, use a documented fallback (OpenAI embeddings).
- Centralize all LLM and embedding calls in `/src/services/llm.ts` and `/src/services/embeddings.ts`.
- Client must never hold LLM or embedding keys. All model calls from the server only.
- Batch embedding requests for performance & cost control. Provide a batched helper function.
- Implement RAG (retrieval-augmented generation) with: query embedding -> vector search -> re-rank -> composition prompt -> Gemini 2.5 call.
- Provide structured provenance: every answer returned by the API must include an array of sources with { id, title, url, snippet, similarity_score }.
- The assistant must prefer "I don't know" when the evidence is insufficient.
- Produce outputs that include explicit citation markers (e.g., [1], [2]) that map to the provenance objects.
- Include a versioned prompt template file under `/docs/prompts.md` and a `defaultSystemPrompt` in code. Keep system messages concise and deterministic.
- Support streaming responses (Gemini streaming APIs) so the UI can render partial tokens and then finalize with citations.

Vector store & data handling
- For MVP use Supabase (pgvector) or Pinecone. The service module must be swappable via a small IVectorStore interface.
- Use chunking with overlap for long documents. Default chunk size: ~600 tokens ±100; overlap: ~100–150 tokens.
- For short-form content (email messages, Slack/notes), prefer message-preserving chunks (single messages or small thread windows) and include full thread context in metadata.
- Store token counts and origin metadata (source, author, timestamp, threadId, filePath) with each chunk.
- Store original documents/messages in storage (Supabase storage) and only store necessary metadata and chunk text in DB.
- Include deduplication: compute a hash of chunk text and skip duplicates on ingest.
- Index vector column with an appropriate index type (ivfflat/HNSW) when supported.

Connectors (email, notes, learning materials)
- Place connector adapters in `/src/connectors` and implement a small interface: fetchNewItems(user, cursor) -> normalized items[].
- Normalized item fields: { id, source, sourceType: 'file'|'email'|'note'|'book', title, text, html, author, channel, threadId, timestamp, url, extraMetadata }.
- Support these source types for MVP:
  - Email: Gmail/Outlook connectors or sample inbox JSON (for demo). Preserved fields: sender, recipients, subject, thread id, timestamps.
  - Notes: Markdown notes, exported Notion pages, or plain text notes — preserve headings and timestamps.
  - Learning materials: PDFs, ebooks export (highlights), and book notes (allow import of reading highlights).
- For the public/demo: include a simulated connector that returns sample emails/notes/ebook highlights so users can try without connecting real accounts.
- Respect least-privilege OAuth scopes, incremental sync (cursor-based), and token revocation UI.

File-manager UX / knowledge retirement patterns
- The app should emphasize low-effort knowledge capture and retrieval:
  - Automatic or scheduled sync from connectors (user opt-in).
  - Lightweight onboarding that explains what will be ingested and retention policy.
  - Preview center that supports text selection; the user can clip highlights or let the assistant summarize across sources without manual clip creation.
  - "Answer from my knowledge" button that runs a targeted RAG query across all synced sources.
  - Auto-generated short "takeaways" for newly ingested materials (optional, background job).
- Clips & Collections:
  - Clips are created from selections and stored as first-class searchable objects with tags and optional notes.
  - Clips are embedded and searchable like other chunks.

Security & privacy
- Use server-side token rotation where possible and avoid long-lived service_role keys in the browser.
- Provide endpoints and UI to delete user data (documents + chunks + connectors tokens).
- Sanitize document text to avoid accidental secrets ingestion; warn users when they upload sensitive content.
- Store connector tokens encrypted at rest; only use them server-side. Provide an explicit UI to revoke connector access.
- For demo, use simulated connectors and sample data; clearly state that no external accounts are required.

Testing
- Use Vitest for unit tests. Use React Testing Library for UI tests.
- Put test files next to the component (e.g., `Component.test.tsx`).
- Use `vi.mock()` to mock network, database, connector, and LLM modules.
- Provide one integration smoke test that ingests a small sample dataset (files + sample email + sample reading highlights) and runs a query; assert the presence of expected citation IDs.
- Add connector adapter tests that validate normalized item shape and incremental sync behavior.

CI / CD and DevOps
- Add GitHub Actions workflows:
  - `ci.yml`: lint, typecheck, unit tests, vitest coverage
  - `deploy.yml`: builds and deploys to Vercel (or to chosen host) on `main`
  - `migrations.yml`: optional migration runner for Supabase
- Use environment secrets in GitHub Actions and reference them in the workflow.
- Provide a `deploy.md` in `/docs` describing manual deploy steps.

Documentation & developer experience
- Add `/docs/app-vision.md` describing the personal learning flows, sample data, and UX scenarios. Keep it authoritative for Agent mode.
- Add `/docs/prompts.md` with prompt templates and instructions used to evaluate and tune Gemini 2.5 responses.
- Add `/docs/connectors.md` describing required OAuth scopes, webhooks, and best-practices for Gmail/Outlook/Notion adapters.
- Add `/docs/privacy.md` documenting data retention, deletion, and user consent flows.
- Add `README.md` with 1-minute demo, setup steps, env var list, resume bullets (if desired), and how to run tests.
- Include `sample-data/` with:
  - small PDFs and Markdown files
  - sample email thread JSON (Gmail-like)
  - sample reading-highlights JSON (ebook/book notes)
  - small seeds for demo connector

Prototyping mindset
- Remember this is a personal-knowledge prototype: prioritize quick sync, easy demo flows, and clear user value (retrieve knowledge without extra effort).
- For production-ready features (auth hardening, encryption, multi-tenant isolation, rate limits), add TODOs and document trade-offs.
- Keep each PR focused and small; include short demo GIF or screenshots in PR descriptions.

Performance & cost controls
- Default to a cost/latency-optimized Gemini 2.5 configuration for interactive queries and a separate higher-quality setting for deep synthesis (documented in `/docs/prompts.md`).
- Implement rate-limiting or request quotas for demo deployments if cost is a concern.

Deliverables for each feature PR
- Code implementing the feature
- Unit tests and at least one integration/SMOKE test where appropriate
- Updated docs: README or docs/app-vision.md
- One paragraph in PR description describing how this improves the user experience and any cost/security trade-offs

When implementing the app
- Read `/docs/app-vision.md` first. Use it as the source of truth for UI & UX behavior.
- Implement small vertical slices: connector -> ingestion -> embeddings -> vector store -> query -> UI.
- After each vertical slice, add an integration smoke test and a demo page.

Agent prompt (short)
- "Implement the app described in /docs/app-vision.md using Gemini 2.5 for LLM calls and Gemini embeddings (or documented fallback). Start by scaffolding the project, adding Supabase SQL migrations for `documents`, `chunks`, and `clips`, and implementing a minimal synchronous ingestion API that accepts PDF/MD uploads, sample email thread JSON, and reading-highlights JSON (or simulated connectors). Create a file-manager UI with preview, selection/clip actions, and a chat panel that shows provenance and supports streaming Gemini 2.5 responses."

Be conservative with negative prompts; prefer explicit positive instructions for what to do.

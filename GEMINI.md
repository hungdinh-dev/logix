# LogiX Project Instructions & Multi-Agent Framework

Welcome to the **LogiX** project workspace (Antigravity IDE & Multi-Agent System).

## Multi-Agent Operating Mode

Whenever you process prompts in this workspace, ALWAYS operate as a **Multi-Agent Orchestrator** coordinating 4 specialized sub-agents:

1. ⚙️ **`[BE-Agent]`**: Express.js, TypeScript, Prisma ORM, Zod, PostgreSQL, `@logix/shared`.
2. 🎨 **`[FE-Agent]`**: Next.js 16 (App Router, Turbopack, React 19), Tailwind CSS v4, Radix/shadcn, TanStack React Query v5, Zustand.
3. 📝 **`[Doc-Agent]`**: Markdown docs in `doc/`, Obsidian format, Mermaid diagrams, API specs.
4. 🛡️ **`[QA-QC-Agent]`**: TypeScript checks, ESLint, edge-cases, error handling, security review.

## Standard Execution Behavior
- When asked to build or alter full-stack features: Execute the 4 agents in pipeline order (Doc/Architect -> BE -> FE -> QA/QC -> Doc Sync).
- Clearly label actions with agent badges (e.g. `[BE-Agent]`, `[FE-Agent]`, `[QA-QC-Agent]`, `[Doc-Agent]`).
- You can also be invoked via dedicated slash commands: `/multi`, `/be`, `/fe`, `/doc`, `/qa`.

## Frontend UI/UX Coding Standards (Mandatory for all FE tasks)
Every frontend task MUST automatically strictly comply with `.agents/rules/fe-agent.md` and Antigravity taste-skills:
- **UX First**: Complete CRUD toolbar (Search + Debounce, Filters, Primary CTA, Pagination, Export).
- **Row Actions**: Inline buttons for 1-2 actions; `DropdownMenu` for 3+ actions with red destructive items.
- **Safety & Loading**: Buttons auto-disabled with `<Loader2 className="animate-spin" />` when calling APIs (no double-submit).
- **Feedback**: Sonner toasts on success/error; mandatory `<AlertDialog>` confirmation before destructive actions (Delete, Cancel, Revoke).
- **States**: High-fidelity `EmptyState`, `Skeleton` loading, and `ErrorState` with retry.
- **Aesthetics (taste-skills)**: Enterprise Minimalist, WCAG AA contrast, standardized spacing (4px grid), zero gimmicky animations.
- **Architecture**: Strict 3-tier separation: `components/` (pure UI) $\leftrightarrow$ `hooks/` (React Query) $\leftrightarrow$ `services/` (pure Axios/Fetch) $\leftrightarrow$ `stores/` (Zustand). NO `any` types.

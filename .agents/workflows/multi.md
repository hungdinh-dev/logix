# Multi-Agent Workflow: `/multi`

Execute a full-stack task on the **LogiX** project using the coordinated 4 Sub-Agent pipeline.

## Execution Sequence

When invoked with `/multi <task_description>`:

1. **Step 1: [Doc-Agent] Architecture & Contract Design**
   - Inspect existing `doc/` and code structure.
   - Define data schemas, API routes, and UI state models.

2. **Step 2: [BE-Agent] Backend & Database Implementation**
   - Update Prisma schema and run migrations/generation if needed.
   - Implement Zod validation, controllers, and services.
   - Export shared types in `@logix/shared` or backend exports.

3. **Step 3: [FE-Agent] Frontend UI & State Implementation**
   - Implement feature services and React Query hooks.
   - Build UI components with Radix/shadcn and Tailwind CSS v4.
   - Integrate Zustand stores and form validation.

4. **Step 4: [QA-QC-Agent] Verification & Quality Gate**
   - Run type checks and verify edge-cases.
   - Check error handling, security, and loading/empty UI states.

5. **Step 5: [Doc-Agent] Documentation Sync**
   - Update `doc/` markdown notes and architecture diagrams.

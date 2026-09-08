# Frontend Agent Workflow: `/fe`

Focus execution exclusively with the **[FE-Agent]** for frontend-related tasks in LogiX.

## Execution Sequence

When invoked with `/fe <task_description>`:

1. Analyze existing UI components, routes (`frontend/src/app/`), and feature modules (`frontend/src/features/`).
2. Implement modern, responsive UI using Next.js 16, React 19, Tailwind CSS v4, and Radix/shadcn components.
3. Wire up React Query hooks for API mutations/queries and Zustand stores for client state.
4. Ensure clean error toasts, loading skeletons, and strict TypeScript types.

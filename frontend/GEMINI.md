# Frontend Context Rules [FE-Agent Active]

When working inside `Practice/LogiX/frontend/`:

- **Active Sub-Agent**: `[FE-Agent]` (Frontend & UI Specialist).
- **Stack**: Next.js 16 (App Router, Turbopack, React 19), Tailwind CSS v4, Radix/shadcn, TanStack React Query v5, Zustand, React Hook Form + Zod, Lucide icons.
- **Rules**:
  1. Follow the feature-first architecture in `src/features/<feature>/` (components, services, hooks, store).
  2. Use TanStack React Query for async backend state and Zustand for client/modal state.
  3. Form validation must be handled via React Hook Form + Zod resolvers.
  4. Build responsive, accessible, polished UI with theme support (`next-themes`) and loading/empty states.
  5. Avoid `any` types; strictly type component props and hook returns.

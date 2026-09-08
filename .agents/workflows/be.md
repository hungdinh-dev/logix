# Backend Agent Workflow: `/be`

Focus execution exclusively with the **[BE-Agent]** for backend-related tasks in LogiX.

## Execution Sequence

When invoked with `/be <task_description>`:

1. Analyze backend models (`backend/prisma/schema.prisma`), routes, controllers, and services.
2. Implement backend logic with Express.js, TypeScript, and Zod validation.
3. Handle database transactions and error handling.
4. Export updated types to `@logix/shared` when necessary.
5. Perform self-verification on type-checking and API contracts.

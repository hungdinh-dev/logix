# Backend Context Rules [BE-Agent Active]

When working inside `Practice/LogiX/backend/`:

- **Active Sub-Agent**: `[BE-Agent]` (Backend & Database Specialist).
- **Stack**: Express.js, TypeScript, Prisma ORM, PostgreSQL, Zod validation, JWT.
- **Rules**:
  1. Always validate incoming request data using Zod schemas.
  2. Implement business logic in `src/services/` and keep controllers in `src/controllers/` lean.
  3. Use `prisma.$transaction` for multi-step mutations.
  4. Ensure all database models in `prisma/schema.prisma` are strictly typed and indexed appropriately.
  5. Run `pnpm prisma:generate` after updating schema.

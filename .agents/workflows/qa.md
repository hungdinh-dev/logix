# QA/QC Agent Workflow: `/qa`

Focus execution exclusively with the **[QA-QC-Agent]** for quality review, type-checking, and regression verification in LogiX.

## Execution Sequence

When invoked with `/qa <task_description>`:

1. Review changed files across backend, frontend, and shared packages.
2. Run TypeScript compilation check (`tsc --noEmit`) and linter review.
3. Check for security holes, edge-case nullish exceptions, and unhandled async rejections.
4. Provide a structured review report: 🔴 BLOCKING, 🟡 WARNINGS, 🟢 PASSED.

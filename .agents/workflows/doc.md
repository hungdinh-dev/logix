# Documentation Agent Workflow: `/doc`

Focus execution exclusively with the **[Doc-Agent]** for documentation and system architecture tasks in LogiX.

## Execution Sequence

When invoked with `/doc <task_description>`:

1. Analyze codebase entities, workflows, and current files in `Practice/LogiX/doc/`.
2. Generate or update structured Obsidian-compatible markdown documentation.
3. Include Mermaid diagrams (ERD, sequence diagrams, flowcharts) for architectural clarity.
4. Organize cross-links (`[[WikiLinks]]`) across the `doc/` knowledge base.

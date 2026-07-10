---
name: project-analysis
description: Analyze project structure and generate comprehensive QWEN.md documentation for future agent context
source: auto-skill
extracted_at: '2026-07-10T04:12:05.562Z'
---

## Procedure

When asked to analyze a project and create QWEN.md documentation:

### Step 1: Explore Directory Structure
- Use `list_directory` to map the project layout
- Identify core directories (core/, modules/, router/, components/, etc.)
- Note key configuration files (package.json, vite.config.ts, tsconfig.json)

### Step 2: Read Key Configuration Files
- `package.json` - Dependencies, scripts, project metadata
- `vite.config.ts` - Build tool configuration, aliases, plugins
- `tsconfig.json` - TypeScript settings, path aliases
- `tailwind.config.ts` - Styling configuration
- `plan.md` - Implementation status and goals

### Step 3: Examine Core Architecture
- **Core components**: AppShell, Sidebar, Header, reusable UI components
- **Stores**: Pinia stores (auth, theme, etc.)
- **Composables**: useAuth, useTheme, useToast, etc.
- **Types**: TypeScript interfaces in core/types/
- **Router**: Main router with guards and lazy loading

### Step 4: Analyze Feature Modules
- List all modules in `src/modules/`
- Examine representative module structure
- Note shared patterns and conventions

### Step 5: Review Reference Materials
- Check for reference HTML/design files
- Review implementation plans (plan.md)
- Note design goals and conventions

### Step 6: Synthesize QWEN.md
Create a comprehensive documentation file with sections:
- **Project Overview** - What the project is and its target
- **Tech Stack** - Table of technologies with versions
- **Architecture** - Directory structure, core components, stores, composables
- **TypeScript Types** - Key interfaces and their purposes
- **Styling System** - CSS variables, theming approach (OKLCH, Tailwind)
- **Routing** - Route structure, guards, lazy loading
- **State Management** - Pinia stores vs composables
- **Feature Modules** - List and patterns
- **Component Patterns** - Usage examples
- **Testing Setup** - Vitest, Playwright configuration
- **Development Commands** - All pnpm scripts
- **Key Files Reference** - Table mapping files to purposes
- **Design Goals** - What the project aims to achieve
- **Conventions** - Naming, props/emits, state management, styling
- **Notes for New Developers** - Practical checklist

### Step 7: Write File
- Use `write_file` to create/update QWEN.md in project root
- Ensure the file is comprehensive but concise (~100-150 lines ideal)
- Include code snippets for key patterns
- Reference other important files in the project

### Best Practices
- Always check existing QWEN.md before overwriting
- Include file paths as absolute paths in references
- Use code blocks for TypeScript interfaces and component patterns
- Keep the documentation actionable for future agents
- Note any design references (e.g., reference HTML files)

## When to Use
- Project initialization
- Before major refactoring
- When onboarding new agents to the codebase
- When documenting project structure changes

## Output Format
A single QWEN.md file in project root with:
- Clear section headings
- Code blocks for technical details
- Tables for quick reference
- Actionable conventions checklist
- References to key files and patterns

# Project Context: Simple PBX

## Architecture
- **Monorepo**: Managed by `npm` workspaces.
- **Packages**:
  - `packages/simple-pbx-agi`: Node.js AGI server for Asterisk.
  - `packages/web`: React application built with React Router and Vite.
- **Database**: MariaDB managed by Prisma. Schema is in `prisma/schema.prisma`.
- **Infrastructure**: Orchestrated by Docker Compose for both development (Devcontainer) and production.

## Key Workflows
- **Setup**: `npm run setup` handles initial environment configuration and database setup.
- **Development**: `npm run dev` starts both the AGI and Web servers concurrently.
- **Devcontainer**: Recommended for local development to ensure a consistent environment with all dependencies (Node, MariaDB, Asterisk).

## Conventions
- **Formatting**: Standard Prettier/ESLint. Typo in `.prittierrc` was fixed to `.prettierrc`.
- **Environment**: Use `.env.example` as the source of truth for required variables.
- **Agents**: See `AGENTS.md` for detailed coding standards and agent-specific instructions.

## Troubleshooting
- **Database**: If migrations fail, ensure MariaDB is running (check Docker containers).
- **Asterisk**: AGI server listens on port 4573. Ensure Asterisk is configured to reach it.

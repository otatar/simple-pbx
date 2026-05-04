# AGENTS.md - Simple PBX Development Guide

This document contains essential information for AI agents working on the Simple PBX project.

## Project Overview

Simple PBX is a monorepo with two main packages:

- `packages/simple-pbx-agi`: AGI server for Asterisk call handling
- `packages/web`: React web application with React Router

## Build, Test, and Lint Commands

### Root Workspace Commands

```bash
# Development
npm run dev:agi              # Start AGI server
npm run dev:web              # Start web development server
npm run start:web            # Start production web server

# Build
npm run build:web            # Build web application

# Type Checking
npm run typecheck:web        # Type check web application

# Database
npm run db:migrate           # Run Prisma migrations
npm run db:migrate:deploy    # Deploy Prisma migrations
npm run db:studio            # Open Prisma Studio
npm run db:seed              # Seed database

# Testing
npm run test:web             # Run web tests
npm run test:agi             # Run AGI tests
```

### Package-Specific Commands

```bash
# In packages/web directory
npm run dev                  # Start dev server (port 5173)
npm run build                # Build for production
npm run start                # Start production server
npm run prod                 # Alternative production start
npm run typecheck            # Type check with React Router typegen

# In packages/simple-pbx-agi directory
# No specific commands beyond workspace ones
```

### Running Single Tests

```bash
# Using vitest (test runner for both packages)
cd packages/web
npx vitest run path/to/test-file.test.ts

cd packages/simple-pbx-agi
npx vitest run path/to/test-file.test.ts
```

## Code Style Guidelines

### General Rules

- **TypeScript Strict**: Use strict TypeScript typing throughout
- **ES Modules**: Use ES modules (`import/export`) not CommonJS
- **Error Handling**: Use try/catch for async operations, avoid swallowing errors
- **Logging**: Use `tslog` for server-side logging, console for client-side debugging

### Formatting

- **Semicolons**: Always use semicolons
- **Quotes**: Double quotes for strings
- **Trailing Commas**: Use trailing commas in objects and arrays
- **Indentation**: 2 spaces (no tabs)
- **Line Length**: Aim for 80-100 characters

Configured via `.prettierrc` and ESLint.

### Import Order

1. External modules (from `node_modules`)
2. Internal modules (absolute imports with `~/` alias)
3. Relative imports
4. Type imports (use `import type` for types)

Example:

```typescript
import { Logger } from "tslog";
import type { ClassOfService } from "~/prisma/client";
import db from "./libs/db";
```

### Naming Conventions

- **Variables/Constants**: `camelCase`
- **Classes**: `PascalCase`
- **Interfaces/Types**: `PascalCase`
- **Files/Directories**: `kebab-case` for files, `kebab-case` for directories
- **Test Files**: `*.test.ts` or `*.spec.ts`
- **Server Files**: `*.server.ts` for server-only code
- **Client Files**: `*.client.ts` for client-only code

### TypeScript Guidelines

- **Explicit Types**: Provide explicit return types for functions
- **Avoid `any`**: Use `unknown` or proper typing instead of `any`
- **Utility Types**: Use TypeScript utility types (`Partial`, `Pick`, `Omit`, etc.)
- **Prisma Integration**: Import types from `~/prisma/client` for database models

Example:

```typescript
// Good
async function getUser(id: number): Promise<User | null> {
  return db.user.findUnique({ where: { id } });
}

// Bad
async function getUser(id) {
  return db.user.findUnique({ where: { id } });
}
```

### React/React Router Guidelines

- **Components**: Use functional components with hooks
- **File Structure**: Follow React Router conventions
- **Route Files**: Use `route.tsx` for route definitions
- **Server/Client Separation**: Clearly separate server and client code
- **Tailwind CSS**: Use for styling with `cn()` utility from `lib/utils.ts`

Example component structure:

```typescript
// packages/web/app/components/example.tsx
import { cn } from "~/lib/utils";

interface ExampleProps {
  className?: string;
  children: React.ReactNode;
}

export function Example({ className, children }: ExampleProps) {
  return (
    <div className={cn("container mx-auto p-4", className)}>
      {children}
    </div>
  );
}
```

### Error Handling Patterns

- **Server-side**: Log errors with context, return appropriate HTTP status
- **Client-side**: Display user-friendly error messages
- **Database**: Handle Prisma errors gracefully
- **AGI Server**: Log call failures with relevant call data

Example:

```typescript
try {
  await db.operation();
} catch (error) {
  log.error("Operation failed", { error, context: "specific operation" });
  throw new Error("Failed to complete operation");
}
```

### Testing Guidelines

- **Test Files**: Co-located with source files or in `__tests__` directories
- **Framework**: Vitest with `vitest-mock-extended` for mocking
- **Mocking**: Mock external dependencies (database, APIs)
- **Naming**: Descriptive test names explaining behavior

Example test structure:

```typescript
describe("ClassName", () => {
  describe("methodName", () => {
    it("should do something when condition", () => {
      // Arrange
      const instance = new Class();

      // Act
      const result = instance.method();

      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

## Project Structure

```
simple-pbx/
├── packages/
│   ├── simple-pbx-agi/
│   │   ├── agi-server.ts          # Main AGI server
│   │   ├── simple-call.ts         # Call handling logic
│   │   ├── simple-call.test.ts    # Tests
│   │   ├── libs/                  # Utilities and database
│   │   └── agi-lib/               # AGI library
│   └── web/
│       ├── app/
│       │   ├── routes/            # React Router routes
│       │   ├── components/        # React components
│       │   ├── models/            # Data models (server)
│       │   └── utils/             # Utilities
│       └── prisma/                # Database schema
├── prisma/                        # Root Prisma config
└── package.json                   # Workspace config
```

## Environment Variables

Required environment variables are in `.env` files:

- Root `.env`: Database and shared configuration
- `packages/web/.env.development`: Web development config
- `packages/web/.env.production`: Web production config

## Database

- **ORM**: Prisma with MariaDB adapter
- **Migrations**: Use Prisma migrations
- **Seeding**: Custom seed script available
- **Studio**: Prisma Studio for database inspection

## Tools and Configuration

- **Package Manager**: npm with workspaces
- **Bundler**: Vite for web package
- **Linter**: ESLint with TypeScript and Prettier
- **Formatter**: Prettier
- **Testing**: Vitest
- **Type Checking**: TypeScript with strict mode

## Agent Notes

- Always run lint and type checks after making changes
- Follow existing patterns and conventions
- Test changes in both development and production builds
- Consider both AGI server and web application impacts
- Document significant changes in commit messages

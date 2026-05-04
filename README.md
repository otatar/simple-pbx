# Simple PBX

A modern PBX (Private Branch Exchange) system built with Asterisk AGI and React web interface.

## Overview

Simple PBX is a monorepo project that combines:

- **AGI Server**: An Asterisk Gateway Interface server for handling phone calls
- **Web Interface**: A React application for managing the PBX system

## Project Structure

```
simple-pbx/
├── packages/
│   ├── simple-pbx-agi/     # AGI server for Asterisk call handling
│   └── web/                # React web application
├── prisma/                 # Database schema and migrations
└── README.md              # This file
```

## Features

- Call routing and handling through Asterisk
- Web-based management interface
- Database integration with Prisma and MariaDB
- Real-time call processing
- Extension and trunk management
- Call detail records (CDR) tracking

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Asterisk server
- MariaDB or compatible database

## Quick Start

The fastest way to get started is using the provided **VS Code Devcontainer**. 

1. Open the project in VS Code
2. Click "Reopen in Container" when prompted (or use the Command Palette)
3. Once the container is ready, run:
```bash
npm run dev
```

### Manual Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd simple-pbx
```

2. Run the setup script (installs dependencies, sets up .env, and migrates DB):
```bash
npm run setup
```

## Development

Start both the AGI server and web interface:
```bash
npm run dev
```

Or start them separately:
```bash
# AGI server only
npm run dev:agi

# Web interface only
npm run dev:web
```

## Production

### Using Docker (Recommended)

The project includes Dockerfiles for all components and a docker-compose.yaml for orchestrating the entire system.

1. Configure environment variables in the `.env` file
2. Run the entire system with docker-compose:
```bash
docker-compose up -d
```

This will start:
- Web interface (React application)
- AGI server (Node.js application)
- MariaDB database
- Asterisk server
- Nginx proxy manager

### Manual Production Deployment

Build the web application:
```bash
npm run build:web
```

Start the production web server:
```bash
npm run start:web
```

## Database

Manage the database with these commands:

- Run migrations: `npm run db:migrate`
- Deploy migrations: `npm run db:migrate:deploy`
- Open Prisma Studio: `npm run db:studio`
- Seed database: `npm run db:seed`

## Testing

Run tests for the web application:
```bash
npm run test:web
```

Run tests for the AGI server:
```bash
npm run test:agi
```

## Documentation

- [AGENTS.md](AGENTS.md) - Development guide for AI agents
- [React Router docs](https://reactrouter.com/)

---
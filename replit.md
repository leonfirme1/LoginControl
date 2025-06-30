# Controle de Horas - Sistema de Autenticação e Dashboard

## Overview

This is a full-stack time tracking application ("Controle de Horas" in Portuguese) built with a modern React frontend and Express backend. The application provides user authentication functionality with a clean, responsive dashboard interface. It uses PostgreSQL for data persistence and includes comprehensive UI components from shadcn/ui.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy and session-based auth
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

### Database Architecture
- **Primary Database**: PostgreSQL (configured for Neon serverless or AWS RDS)
- **Schema Management**: Drizzle Kit for migrations
- **Connection Pooling**: Neon serverless connection pooling

## Key Components

### Authentication System
- **Strategy**: Local username/password authentication
- **Session Management**: Secure HTTP sessions with PostgreSQL storage
- **Password Security**: Scrypt-based password hashing with salt
- **Legacy Support**: Backward compatibility with plain text passwords

### Frontend Components
- **Protected Routes**: Route-level authentication guards
- **Auth Context**: React context for authentication state
- **Form Validation**: Zod schemas with React Hook Form integration
- **UI Library**: Complete shadcn/ui component collection

### Backend Services
- **User Management**: CRUD operations for consultant/user accounts
- **Session Handling**: Express session middleware with PostgreSQL store
- **Database Layer**: Drizzle ORM abstractions for type-safe queries

## Data Flow

### Authentication Flow
1. User submits credentials via React form
2. Frontend sends POST request to `/api/login`
3. Backend validates credentials using Passport.js
4. Session created and stored in PostgreSQL
5. User object cached in React Query
6. Protected routes become accessible

### Database Schema
```typescript
// Consultants/Users table
{
  id: serial (primary key)
  name: text (unique, not null)
  password: text (not null)
}
```

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Framework**: Radix UI components, Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query for server state
- **Validation**: Zod for schema validation
- **Routing**: Wouter for client-side routing
- **Icons**: Lucide React for consistent iconography

### Backend Dependencies
- **Core**: Express.js, TypeScript, tsx for development
- **Authentication**: Passport.js with local strategy
- **Database**: Drizzle ORM, @neondatabase/serverless, pg
- **Session**: express-session, connect-pg-simple
- **Security**: Built-in crypto module for password hashing

### Development Tools
- **Build**: Vite, esbuild for production builds
- **Database**: Drizzle Kit for schema management
- **Replit Integration**: Cartographer and runtime error overlay

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to `dist/public`
2. **Backend Build**: esbuild bundles server to `dist/index.js`
3. **Database Migration**: Drizzle Kit pushes schema changes

### Environment Configuration
- **Development**: tsx runs server with hot reload
- **Production**: Compiled Node.js server serves static frontend
- **Database**: Flexible connection supporting Neon, AWS RDS, or standard PostgreSQL

### Required Environment Variables
```
DATABASE_URL=postgresql://... (or individual PGHOST, PGUSER, etc.)
SESSION_SECRET=your-secret-key
NODE_ENV=production|development
```

## Recent Changes
- **June 30, 2025**: Sistema de login configurado para AWS RDS PostgreSQL
  - Conexão com banco controlehoras-db.c8pqeqc0u2u5.us-east-1.rds.amazonaws.com
  - Tabela "consultants" com campos "name" e "password"
  - Configuração para deploy no Railway com porta dinâmica
  - Health check endpoint melhorado: `/health` (simples) e `/health/detailed` (com teste de banco)
  - Configuração SSL otimizada para produção (rejectUnauthorized: false)
  - Timeout do Railway ajustado para 120s com verificações a cada 10s
  - Suporte a senhas em texto plano (compatibilidade com dados existentes)
  - Login funcionando corretamente via API e interface web
  - Porta configurada dinamicamente para Railway (process.env.PORT)

## Deployment Configuration
- **Target Platform**: Railway
- **Database**: AWS RDS PostgreSQL
- **Port Configuration**: Dinâmica via `process.env.PORT` (Railway define automaticamente)
- **Environment Variables Required**:
  - PGUSER: Usuário do banco de dados
  - PGPASSWORD: Senha do banco de dados
  - SESSION_SECRET: Chave secreta para sessões (opcional, usa default)
  - NODE_ENV: production (configurado automaticamente no railway.toml)
- **Health Check**: `/health` endpoint para monitoramento
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

## User Preferences

Preferred communication style: Simple, everyday language (Portuguese).
Deployment preference: Railway platform.
# Coromon Team Display - OBS Browser Source

## Overview

A specialized streaming tool designed for Coromon content creators to display and manage their team compositions in OBS. The application features a dual-interface design: a full-featured editor for managing team data and a streamlined OBS-optimized display view with transparent backgrounds and customizable layouts. Users can manage up to 6 Coromon slots with support for all potency levels (Standard, Potent, Perfect) and special skins (Crimsonite, Retro, etc.).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, using Vite as the build tool and development server.

**UI Component System**: Built on shadcn/ui (Radix UI primitives) configured with the "new-york" style variant. The component library provides accessible, customizable UI primitives with extensive use of Radix UI headless components for dropdowns, popovers, dialogs, and form controls.

**Styling Approach**: TailwindCSS with custom design tokens following a hybrid gaming-utility aesthetic. The design system supports both a database-tool feel (editor side) and game-inspired visuals (display side) through CSS variables and HSL color definitions. Custom color palette includes dark mode optimizations for editors and transparent/semi-transparent backgrounds for OBS compatibility.

**State Management**: Local-first architecture using React hooks and localStorage for persistence. Team data is stored client-side with no server-side session requirements. Uses @tanstack/react-query for any future API data fetching needs.

**Routing**: Wouter for lightweight client-side routing with two main routes: `/` (Team Manager) and `/sprites` (Sprite Manager).

**Key Design Decisions**:
- Separate editor and display views to optimize for both database management and OBS streaming workflows
- Client-side data persistence eliminates need for authentication/backend storage
- Transparent background support with configurable opacity for chroma-key flexibility
- Multiple layout options (row, grid, stack) to accommodate different stream layouts

### Backend Architecture

**Server Framework**: Express.js with TypeScript running in ESM mode.

**Development Setup**: Vite middleware integration for HMR (Hot Module Replacement) in development. Production builds serve static files from `dist/public`.

**File Upload System**: Multer-based sprite upload handling with validation for GIF files only. Sprites are stored in `public/sprites` directory and served statically.

**Database Layer**: Drizzle ORM configured for PostgreSQL (via @neondatabase/serverless driver). Currently implements minimal schema (users table) but structured for expansion to store team configurations, sprite metadata, or user preferences.

**API Structure**: RESTful endpoints under `/api` namespace:
- `/api/sprites/upload` - POST endpoint for GIF sprite uploads
- `/api/sprites/list` - GET endpoint to retrieve available sprites

**Key Design Decisions**:
- In-memory storage fallback (`MemStorage`) for development/testing without database
- Sprite uploads use original filenames to maintain naming conventions
- Server-side logging middleware for API requests with response data capture
- Express error handling middleware with standardized JSON error responses

### Data Storage Solutions

**Primary Storage**: PostgreSQL database accessed via Drizzle ORM with Neon serverless driver for scalability.

**Schema Design**: Minimal initial schema with users table (id, username, password). Schema is defined in `shared/schema.ts` for type sharing between client and server.

**Client-Side Storage**: localStorage for team configuration persistence using the key `coromon-team`. Stores serialized JSON of team slots including Coromon name, potency level, and special skin data.

**File Storage**: Local filesystem in `public/sprites` directory for uploaded GIF files. No CDN or cloud storage integration (files served directly by Express static middleware).

**Migration Strategy**: Drizzle Kit configured with migrations output to `./migrations` directory. Database schema changes managed through `npm run db:push` command.

**Key Design Decisions**:
- Hybrid storage model: critical team data in localStorage for offline access, optional database for multi-device sync
- Sprite files remain on local filesystem for simplicity (suitable for single-instance deployments)
- No authentication layer for initial implementation (users table prepared for future auth integration)

### External Dependencies

**UI Component Libraries**:
- Radix UI primitives (@radix-ui/*) - 20+ headless component packages for accessibility
- shadcn/ui configuration with TailwindCSS integration
- Lucide React for iconography

**Form Handling**:
- React Hook Form for form state management
- @hookform/resolvers for validation schema integration
- Zod for runtime type validation and drizzle-zod for schema-to-validator conversion

**Database & ORM**:
- Drizzle ORM (drizzle-orm) for type-safe database queries
- @neondatabase/serverless for PostgreSQL connection
- Drizzle Kit for schema migrations

**File Upload**:
- Multer for multipart/form-data handling
- react-dropzone for drag-and-drop upload UI

**Build & Development Tools**:
- Vite with @vitejs/plugin-react for fast development and optimized production builds
- Replit-specific plugins (@replit/vite-plugin-*) for development experience enhancements
- PostCSS with Autoprefixer for CSS processing

**Styling**:
- TailwindCSS for utility-first CSS
- class-variance-authority (cva) for component variant management
- clsx and tailwind-merge for conditional class composition

**Fonts**: Google Fonts integration for Inter (UI), Poppins (headers), and JetBrains Mono (technical text).

**Key Integration Points**:
- Sprite upload flow: Client dropzone → Multer middleware → Filesystem storage → Static file serving
- Team data flow: Client form → localStorage → React state → OBS display component
- Type sharing: Shared schema definitions in `/shared` directory consumed by both client and server
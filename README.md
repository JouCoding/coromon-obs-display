# Coromon Team Display - OBS Browser Source

A specialized streaming tool designed for Coromon content creators to display and manage their team compositions in OBS. Features a dual-interface design with a full-featured editor for managing team data and a streamlined OBS-optimized display view with transparent backgrounds and customizable layouts.

## Features

- **Team Management**: Manage up to 6 Coromon slots with support for all potency levels (Standard/A, Potent/B, Perfect/C)
- **Special Skins Support**: Full support for special skins (Crimsonite, Retro, seasonal variants, etc.)
- **Sprite Management**: Upload and manage custom Coromon sprites with automatic scanning
- **OBS Integration**: Transparent backgrounds and multiple layout options (row, grid, stack)
- **Multi-Profile Support**: Save and switch between different team profiles
- **Auto-Save**: Automatic saving of team configurations to prevent data loss
- **Dark Mode**: Built-in dark mode support optimized for streaming

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: TailwindCSS with custom gaming-utility aesthetic
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: Wouter for lightweight client-side routing

## Prerequisites

- Node.js 20.x or higher
- PostgreSQL database
- npm or pnpm package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/coromon-obs-display.git
cd coromon-obs-display
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
DATABASE_URL=your_postgresql_connection_string
PORT=5000
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage

### Team Manager

1. Navigate to the home page to access the Team Manager
2. Click on each slot to select a Coromon, potency level, and special skin
3. Use the profile selector to switch between different team configurations
4. Teams auto-save to the current profile

### Sprite Manager

1. Navigate to `/sprites` to access the Sprite Manager
2. Upload custom Coromon sprites (GIF format only)
3. Use the "Scan Sprites" button to automatically detect and catalog all sprites
4. Sprites are analyzed for naming patterns to extract Coromon names, potency levels, and special skins

### OBS Integration

1. Add a Browser Source in OBS
2. Set the URL to: `http://localhost:5000/?obs=true&layout=row`
3. Set width and height according to your desired layout
4. Check "Shutdown source when not visible" for performance
5. Customize the layout parameter:
   - `layout=row` - Horizontal single row
   - `layout=grid-2x3` - 2 rows × 3 columns
   - `layout=grid-3x2` - 3 rows × 2 columns
   - `layout=stack` - Vertical stack

## Sprite Naming Conventions

The application automatically detects sprites based on these naming patterns:

- **Standard**: `CoromonName_[A/B/C].gif` (e.g., `Cubzero_A.gif`)
- **Special Skin**: `CoromonName_SkinName_[A/B/C].gif` (e.g., `Arcta_Crimsonite_A.gif`)
- **Front Variant**: `CoromonName_SkinName_front.gif` (e.g., `Arcta_star_front.gif`)
- **Potent + Skin + Front**: `CoromonName_[A/B/C]_SkinName_front.gif`

## Building for Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Development

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## Project Structure

```
├── client/              # Frontend React application
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       └── lib/         # Utilities and configurations
├── server/              # Backend Express server
│   ├── db.ts           # Database configuration
│   ├── storage.ts      # Data storage layer
│   └── routes.ts       # API routes
├── shared/              # Shared types and schemas
│   ├── schema.ts       # Database schema
│   └── coromon-data.ts # Coromon data and utilities
└── public/
    └── sprites/        # Uploaded sprite files

```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

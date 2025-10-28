# Coromon Team Display - OBS Browser Source
(this project was AI vibe-coded using multiple replit free accounts so if there's a chance something doesn't work or looks weird)

A specialized streaming tool designed for Coromon content creators to display and manage their team compositions in OBS. Features a dual-interface design with a full-featured editor for managing team data and a streamlined OBS-optimized display view with transparent backgrounds and customizable layouts.

## Features

- **Team Management**: Manage up to 6 Coromon slots with support for all potency levels (Standard/A, Potent/B, Perfect/C)
- **Special Skins Support**: Full support for special skins (Crimsonite, Retro, seasonal variants, etc.)
- **Sprite Management**: Upload and manage custom Coromon sprites with automatic scanning
- **OBS Integration**: Transparent backgrounds and multiple layout options (row, grid, stack)
- **Multi-Profile Support**: Save and switch between different team profiles
- **Auto-Save**: Automatic saving of team configurations to prevent data loss
- **Dark Mode**: Built-in dark mode support optimized for streaming

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
2. Set the URL to: `temp`
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


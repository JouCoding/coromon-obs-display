# Design Guidelines: Coromon Team Display & Database for OBS

## Design Approach

**Hybrid Gaming-Utility Interface**
This project combines game-inspired aesthetics with functional streaming tool design. Drawing inspiration from:
- **Primary**: Pokemon/Coromon UI patterns (card-based layouts, colorful accents, sprite showcases)
- **Secondary**: StreamerBot/OBS overlay tools (clean, transparent backgrounds, high contrast)
- **Tertiary**: Notion-style databases (searchable dropdowns, organized data display)

**Core Principle**: Create a split-personality design where the editor side feels like a robust database tool while the display side matches Coromon's game aesthetic for seamless OBS integration.

---

## Color Palette

### Editor Side (Dark Mode)
- **Background**: 220 15% 12% (deep slate)
- **Surface/Cards**: 220 15% 18% (elevated slate)
- **Border**: 220 10% 25% (subtle dividers)
- **Text Primary**: 220 10% 95% (crisp white)
- **Text Secondary**: 220 5% 65% (muted gray)

### Display Side (OBS-Optimized)
- **Background**: Transparent OR 240 20% 8% with 90% opacity (for chroma key flexibility)
- **Sprite Containers**: 240 15% 15% with 80% opacity (semi-transparent cards)
- **Accent Glow**: 160 60% 50% (Coromon-inspired teal/green)

### Interactive Elements
- **Primary Action**: 160 55% 45% (vibrant teal - matches Coromon branding)
- **Hover State**: 160 60% 55% (lighter teal)
- **Selected/Active**: 280 45% 55% (purple - potency indicator)
- **Warning/Special**: 25 85% 55% (orange - for special skins)

---

## Typography

**Font Stack**: 
- Primary: 'Inter', system-ui, sans-serif (clean, modern readability)
- Display/Headers: 'Poppins', sans-serif (rounded, game-friendly)
- Monospace: 'JetBrains Mono' (for sprite filenames, technical info)

**Type Scale**:
- Hero/Section Headers: text-3xl font-bold (Poppins)
- Coromon Names: text-lg font-semibold (Inter)
- Body/Labels: text-sm font-medium (Inter)
- Technical Info: text-xs font-mono (JetBrains Mono)

---

## Layout System

**Tailwind Spacing Primitives**: Consistent use of 2, 4, 6, 8, 12, 16 units
- Micro spacing: p-2, gap-2 (tight elements)
- Standard spacing: p-4, gap-4, m-6 (cards, form fields)
- Section spacing: p-8, py-12 (major layout areas)
- Large breathing room: p-16 (between editor/display sections)

**Grid Structure**:
```
Desktop: Two-column split
- Editor Panel: 60% width (left) - max-w-4xl
- Display Preview: 40% width (right) - max-w-2xl

Mobile/Tablet: Stack vertically
- Editor panel: full width
- Display preview: full width below
```

---

## Component Library

### A. Editor Panel Components

**1. Coromon Search/Select Dropdown**
- Searchable combobox with autocomplete
- Each option shows: Sprite thumbnail (32x32) + Coromon name + type badge
- Grouped by evolutionary stage or alphabetically
- Filtered search highlights matching characters
- Design: White background dropdown with hover state (bg-slate-100)

**2. Team Slot Cards** (6 slots)
- Card design: Rounded corners (rounded-xl), elevated shadow (shadow-lg)
- Layout per slot:
  - Top: Slot number badge (1-6) in corner
  - Center: Large sprite preview (128x128)
  - Bottom: Coromon name + selector row
- Selector row includes:
  - Potent Level: Radio buttons or segmented control (A/B/C)
  - Special Skin: Dropdown (None, Crimsonite, Retro, Dino, Chunky, etc.)
- Empty state: Dashed border, "Add Coromon" placeholder with + icon

**3. Database Browser** (optional collapsed section)
- Masonry grid of all 106 Coromon
- Each card: Sprite + name, click to add to team
- Filter bar: Type filter, search, skin availability

### B. Display Panel (OBS View)

**Party Display Layouts** (user can toggle between):

**Option 1: Horizontal Row**
- 6 sprites in single row (96x96 each)
- Names below each sprite (optional toggle)
- Semi-transparent background panel

**Option 2: 3x2 Grid**
- Two rows of 3 Coromon
- Larger sprites (128x128)
- Name labels integrated into card

**Option 3: Vertical Stack** (for side overlay)
- 6 sprites stacked vertically
- Compact name tags on right
- Minimal width for side panel streaming

**Display Styling**:
- Sprite containers: Glass-morphism effect (backdrop-blur-md, border with glow)
- Potent indicators: Subtle sparkle animation for B/C tier
- Special skin badge: Small icon/text indicator if special skin active
- Smooth transitions when team changes (fade in/out)

### C. Control Bar

**Positioned at top of editor panel**:
- Save/Load Team buttons (primary teal)
- Clear Team button (outline, destructive red on hover)
- Export Config button (generate shareable code)
- Display Layout Selector (segmented control for 3 layout options)
- OBS Settings toggle (transparency, scaling options)

---

## Animations & Interactions

**Minimal, Purposeful Motion**:
- Sprite loading: Fade-in (duration-300)
- Card hover: Subtle lift (translate-y-[-2px]) + shadow expansion
- Dropdown open/close: Slide down animation (duration-200)
- Team slot update: Cross-fade sprites (duration-400)
- NO continuous animations on OBS display (performance)
- Potent sparkle: CSS keyframe shimmer (only on hover in editor)

---

## Special Considerations for OBS

**Transparency Support**:
- Provide toggle for transparent background vs solid
- CSS: `background: transparent` or `background: rgba(0,0,0,0.9)`
- Chroma key option: Pure green (#00FF00) background mode

**Performance Optimizations**:
- Lazy load sprites (only load visible ones)
- Use sprite sheets if possible for faster loading
- Minimize DOM updates in display panel
- CSS transforms for animations (GPU-accelerated)

**Scaling & Responsiveness**:
- Display panel uses rem-based sizing for easy OBS scaling
- Provide zoom presets (50%, 75%, 100%, 125%)
- Maintain aspect ratios for clean OBS crops

---

## Data Structure & State

**Local Storage Schema**:
```
{
  team: [
    { 
      slot: 1,
      coromon: "Ucaclaw",
      potent: "C", // A, B, or C
      specialSkin: "Crimsonite", // or null
      spritePath: "Ucaclaw_Crimsonite_C.gif"
    },
    // ... 5 more slots
  ],
  displayLayout: "grid", // "row", "grid", "stack"
  obsSettings: {
    transparent: true,
    scale: 100,
    showNames: true
  }
}
```

---

## Accessibility

- High contrast text on all backgrounds (WCAG AA minimum)
- Keyboard navigation for all dropdowns and selectors
- Screen reader labels for slot numbers and sprite images
- Focus indicators on all interactive elements (ring-2 ring-teal-400)
- Clear visual feedback for selected/active states

---

## Technical Notes

**Sprite Asset Management**:
- Sprites loaded from external CDN or local /sprites/ folder
- Naming convention: `{CoromonName}_{SpecialSkin}_{PotentLevel}.gif`
- Fallback sprite for missing assets (placeholder image)
- Support both GIF animations and static PNG

**File Structure Suggestion**:
```
/sprites/
  /standard/
    Nibblegar_A.gif, Nibblegar_B.gif, Nibblegar_C.gif
  /crimsonite/
    Ucaclaw_Crimsonite_A.gif
  /special/
    WATER_SHARK_3_A_chunk.gif (Megalobite chunky)
```

This design creates a professional streaming tool that honors Coromon's playful aesthetic while maintaining the utility and performance needed for OBS integration.
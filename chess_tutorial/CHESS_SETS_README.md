# Chess Sets Guide

This document explains how to add and manage custom chess piece sets in the Chess Tutorial application.

## 🎨 Current Chess Sets

The application currently includes:

1. **Classic Unicode** - Traditional chess symbols (default)
2. **Unicode Outlined** - Alternative Unicode symbols
3. **Staunton Classic** - Traditional tournament pieces (requires images)
4. **Modern Minimal** - Contemporary design (requires images)
5. **Cartoon Kingdom** - Kid-friendly pieces (requires images)
6. **Medieval Knights** - Medieval fantasy cartoon pieces with blue theme (ready for images)

## 🏰 Adding Images for Medieval Knights Set

The Medieval Knights set is already configured but needs actual image files. To add them:

### Step 1: Prepare Your Images

You'll need 12 images total (6 white pieces + 6 black pieces):

- White pieces: king, queen, rook, bishop, knight, pawn
- Black pieces: king, queen, rook, bishop, knight, pawn

### Step 2: Add Image Files

Place your images in these exact locations:

```
src/assets/chess-sets/medieval-knights/
├── white/
│   ├── king.png
│   ├── queen.png
│   ├── rook.png
│   ├── bishop.png
│   ├── knight.png
│   └── pawn.png
└── black/
    ├── king.png
    ├── queen.png
    ├── rook.png
    ├── bishop.png
    ├── knight.png
    └── pawn.png
```

### Step 3: Update Configuration

In `src/config/chessSets.ts`, uncomment the import statements at the top:

```typescript
// Uncomment these lines:
import medievalWhiteKing from "../assets/chess-sets/medieval-knights/white/king.png";
import medievalWhiteQueen from "../assets/chess-sets/medieval-knights/white/queen.png";
// ... (uncomment all 12 import statements)
```

Then update the `medievalKnightsSet` configuration to use the actual images:

```typescript
const medievalKnightsSet: ChessSet = {
  id: "medieval-knights",
  name: "Medieval Knights",
  description:
    "Brave knights and castle defenders in cartoon style with blue medieval theme",
  category: "fun",
  preview: medievalWhiteKing, // Use actual king image as preview
  white: {
    king: medievalWhiteKing,
    queen: medievalWhiteQueen,
    rook: medievalWhiteRook,
    bishop: medievalWhiteBishop,
    knight: medievalWhiteKnight,
    pawn: medievalWhitePawn,
  },
  black: {
    king: medievalBlackKing,
    queen: medievalBlackQueen,
    rook: medievalBlackRook,
    bishop: medievalBlackBishop,
    knight: medievalBlackKnight,
    pawn: medievalBlackPawn,
  },
};
```

## 📁 File Structure

Chess piece images should be organized as follows:

```
src/assets/chess-sets/
├── classic/
│   ├── preview.png           # Preview image for set selector
│   ├── white/
│   │   ├── king.svg
│   │   ├── queen.svg
│   │   ├── rook.svg
│   │   ├── bishop.svg
│   │   ├── knight.svg
│   │   └── pawn.svg
│   └── black/
│       ├── king.svg
│       ├── queen.svg
│       ├── rook.svg
│       ├── bishop.svg
│       ├── knight.svg
│       └── pawn.svg
├── medieval-knights/         # New medieval set
│   └── [same structure as classic]
├── modern/
│   └── [same structure as classic]
└── cartoon/
    └── [same structure as classic]
```

## 🖼️ Image Requirements

### **File Format**

- **Preferred**: PNG with transparent background (for cartoon-style pieces)
- **Alternative**: SVG (scalable, crisp at any size)
- **Size**: 128x128px recommended for PNG, any size for SVG

### **Design Guidelines for Medieval Knights**

- **Medieval fantasy theme** with cartoon styling
- **Blue and navy color scheme** (as shown in reference image)
- **High contrast** for easy visibility on chess board
- **Simple, clear silhouettes** that are recognizable
- **Consistent art style** across all 12 pieces
- **Child-friendly** cartoon aesthetic
- **Transparent background** so pieces work on any board color

## ➕ Adding a New Chess Set

### Step 1: Create Directory Structure

```bash
mkdir -p src/assets/chess-sets/my-new-set/white
mkdir -p src/assets/chess-sets/my-new-set/black
```

### Step 2: Add Chess Piece Images

Place your 12 piece images in the appropriate directories:

- `white/` folder: king.png, queen.png, rook.png, bishop.png, knight.png, pawn.png
- `black/` folder: king.png, queen.png, rook.png, bishop.png, knight.png, pawn.png

### Step 3: Create Preview Image

Add a `preview.png` in the main set directory showing a sample of your pieces.

### Step 4: Update Configuration

Edit `src/config/chessSets.ts` and add your new set:

```typescript
const myNewSet: ChessSet = {
  id: "my-new-set",
  name: "My New Set",
  description: "Description of your chess set",
  category: "classic", // or 'modern', 'fun', 'unicode'
  preview: "/src/assets/chess-sets/my-new-set/preview.png",
  white: {
    king: "/src/assets/chess-sets/my-new-set/white/king.png",
    queen: "/src/assets/chess-sets/my-new-set/white/queen.png",
    rook: "/src/assets/chess-sets/my-new-set/white/rook.png",
    bishop: "/src/assets/chess-sets/my-new-set/white/bishop.png",
    knight: "/src/assets/chess-sets/my-new-set/white/knight.png",
    pawn: "/src/assets/chess-sets/my-new-set/white/pawn.png",
  },
  black: {
    king: "/src/assets/chess-sets/my-new-set/black/king.png",
    queen: "/src/assets/chess-sets/my-new-set/black/queen.png",
    rook: "/src/assets/chess-sets/my-new-set/black/rook.png",
    bishop: "/src/assets/chess-sets/my-new-set/black/bishop.png",
    knight: "/src/assets/chess-sets/my-new-set/black/knight.png",
    pawn: "/src/assets/chess-sets/my-new-set/black/pawn.png",
  },
};

// Add to the chessSets array
export const chessSets: ChessSet[] = [
  unicodeSet,
  classicSet,
  modernSet,
  cartoonSet,
  medievalKnightsSet,
  myNewSet, // Add your new set here
];
```

## 🎯 Categories

### **Classic**

- Traditional tournament-style pieces
- Staunton design or variations
- Professional appearance

### **Modern**

- Contemporary, minimalist designs
- Clean lines and simple shapes
- Suitable for digital interfaces

### **Fun**

- Kid-friendly, colorful pieces
- Cartoon or themed designs (like Medieval Knights)
- Educational and engaging
- Perfect for young learners

### **Unicode**

- Text-based chess symbols
- Always available as fallback
- Fast loading, no images required

## 🔧 Technical Notes

### **Unicode Sets**

For Unicode sets, set `isUnicode: true` and use Unicode characters directly:

```typescript
const myUnicodeSet: ChessSet = {
  id: "my-unicode-set",
  name: "My Unicode Set",
  // ... other properties
  isUnicode: true,
  white: {
    king: "♔",
    queen: "♕",
    // ... etc
  },
};
```

### **Image Loading**

- Images are loaded on-demand when a set is selected
- PNG format works well for cartoon-style pieces
- SVG format provides the best scalability
- All files should have transparent backgrounds
- Consider file size for performance

### **Fallback Behavior**

- If an image fails to load, the app falls back to Unicode symbols
- The Medieval Knights set currently uses Unicode fallback until images are added
- Always test your chess sets before deployment
- Provide clear, high-contrast pieces for accessibility

## 🎮 User Interface

### **Chess Set Selector**

- Opens via the "Chess Set" button in the header
- Shows preview of each set with category badges
- **Fun category** pieces (including Medieval Knights) show with a pink smile icon
- Persists user selection in localStorage
- Auto-closes after selection

### **Categories Display**

- **Classic**: Crown icon, yellow theme
- **Modern**: Smartphone icon, blue theme
- **Fun**: Smile icon, pink theme (Medieval Knights goes here)
- **Unicode**: Type icon, gray theme

## 🚀 Deployment

When deploying your app:

1. Ensure all image files are included in the build
2. Verify image paths are correct for your hosting environment
3. Test all chess sets work properly
4. Consider optimizing images for web delivery

## 💡 Tips

- **Start with Unicode sets** for immediate functionality
- **Use PNG with transparency** for cartoon-style sets like Medieval Knights
- **Test on different screen sizes** to ensure pieces are visible
- **Consider accessibility** with high contrast designs
- **Keep file sizes reasonable** for performance
- **Maintain consistent art style** within each set
- **The Medieval Knights set is ready** - just add your images and update the config!

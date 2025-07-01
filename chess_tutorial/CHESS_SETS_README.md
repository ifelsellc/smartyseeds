# Chess Sets Guide

This document explains how to add and manage custom chess piece sets in the Chess Tutorial application.

## 🎨 Current Chess Sets

The application currently includes:

1. **Classic Unicode** - Traditional chess symbols (default)
2. **Unicode Outlined** - Alternative Unicode symbols
3. **Staunton Classic** - Traditional tournament pieces (requires images)
4. **Modern Minimal** - Contemporary design (requires images)
5. **Cartoon Kingdom** - Kid-friendly pieces (requires images)

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
├── modern/
│   └── [same structure as classic]
└── cartoon/
    └── [same structure as classic]
```

## 🖼️ Image Requirements

### **File Format**

- **Preferred**: SVG (scalable, crisp at any size)
- **Alternative**: PNG with transparent background
- **Size**: 64x64px minimum, 128x128px recommended

### **Design Guidelines**

- **High contrast** for easy visibility
- **Simple, clear silhouettes**
- **Consistent style** across all pieces
- **Child-friendly** design (for educational app)
- **Transparent background**

## ➕ Adding a New Chess Set

### Step 1: Create Directory Structure

```bash
mkdir -p src/assets/chess-sets/my-new-set/white
mkdir -p src/assets/chess-sets/my-new-set/black
```

### Step 2: Add Chess Piece Images

Place your 12 piece images in the appropriate directories:

- `white/` folder: king.svg, queen.svg, rook.svg, bishop.svg, knight.svg, pawn.svg
- `black/` folder: king.svg, queen.svg, rook.svg, bishop.svg, knight.svg, pawn.svg

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
    king: "/src/assets/chess-sets/my-new-set/white/king.svg",
    queen: "/src/assets/chess-sets/my-new-set/white/queen.svg",
    rook: "/src/assets/chess-sets/my-new-set/white/rook.svg",
    bishop: "/src/assets/chess-sets/my-new-set/white/bishop.svg",
    knight: "/src/assets/chess-sets/my-new-set/white/knight.svg",
    pawn: "/src/assets/chess-sets/my-new-set/white/pawn.svg",
  },
  black: {
    king: "/src/assets/chess-sets/my-new-set/black/king.svg",
    queen: "/src/assets/chess-sets/my-new-set/black/queen.svg",
    rook: "/src/assets/chess-sets/my-new-set/black/rook.svg",
    bishop: "/src/assets/chess-sets/my-new-set/black/bishop.svg",
    knight: "/src/assets/chess-sets/my-new-set/black/knight.svg",
    pawn: "/src/assets/chess-sets/my-new-set/black/pawn.svg",
  },
};

// Add to the chessSets array
export const chessSets: ChessSet[] = [
  unicodeSet,
  classicSet,
  modernSet,
  cartoonSet,
  unicodeAlternative,
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
- Cartoon or themed designs
- Educational and engaging

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
- SVG format provides the best scalability
- PNG files should have transparent backgrounds
- Consider file size for performance

### **Fallback Behavior**

- If an image fails to load, the app falls back to Unicode symbols
- Always test your chess sets before deployment
- Provide clear, high-contrast pieces for accessibility

## 🎮 User Interface

### **Chess Set Selector**

- Opens via the "Chess Set" button in the header
- Shows preview of each set with category badges
- Persists user selection in localStorage
- Auto-closes after selection

### **Categories Display**

- **Classic**: Crown icon, yellow theme
- **Modern**: Smartphone icon, blue theme
- **Fun**: Smile icon, pink theme
- **Unicode**: Type icon, gray theme

## 🚀 Deployment

When deploying your app:

1. Ensure all image files are included in the build
2. Verify image paths are correct for your hosting environment
3. Test all chess sets work properly
4. Consider optimizing images for web delivery

## 💡 Tips

- **Start with Unicode sets** for immediate functionality
- **Use SVG format** for the best scalability
- **Test on different screen sizes** to ensure pieces are visible
- **Consider accessibility** with high contrast designs
- **Keep file sizes reasonable** for performance

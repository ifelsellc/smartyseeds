import { ChessSet } from '../types/chessTypes'

// Import cartoon chess pieces
import cartoonWhiteKing from '../assets/chess-sets/cartoon/white/king.png'
import cartoonWhiteQueen from '../assets/chess-sets/cartoon/white/queen.png'
import cartoonWhiteRook from '../assets/chess-sets/cartoon/white/rook.png'
import cartoonWhiteBishop from '../assets/chess-sets/cartoon/white/bishop.png'
import cartoonWhiteKnight from '../assets/chess-sets/cartoon/white/knight.png'
import cartoonWhitePawn from '../assets/chess-sets/cartoon/white/pawn.png'

import cartoonBlackKing from '../assets/chess-sets/cartoon/black/king.png'
import cartoonBlackQueen from '../assets/chess-sets/cartoon/black/queen.png'
import cartoonBlackRook from '../assets/chess-sets/cartoon/black/rook.png'
import cartoonBlackBishop from '../assets/chess-sets/cartoon/black/bishop.png'
import cartoonBlackKnight from '../assets/chess-sets/cartoon/black/knight.png'
import cartoonBlackPawn from '../assets/chess-sets/cartoon/black/pawn.png'

// Import classic chess piece images
import classicWhiteKing from '../assets/chess-sets/classic/white/king.png'
import classicWhiteQueen from '../assets/chess-sets/classic/white/queen.png'
import classicWhiteRook from '../assets/chess-sets/classic/white/rook.png'
import classicWhiteBishop from '../assets/chess-sets/classic/white/bishop.png'
import classicWhiteKnight from '../assets/chess-sets/classic/white/knight.png'
import classicWhitePawn from '../assets/chess-sets/classic/white/pawn.png'

import classicBlackKing from '../assets/chess-sets/classic/black/king.png'
import classicBlackQueen from '../assets/chess-sets/classic/black/queen.png'
import classicBlackRook from '../assets/chess-sets/classic/black/rook.png'
import classicBlackBishop from '../assets/chess-sets/classic/black/bishop.png'
import classicBlackKnight from '../assets/chess-sets/classic/black/knight.png'
import classicBlackPawn from '../assets/chess-sets/classic/black/pawn.png'

// Unicode chess set (current implementation)
const unicodeSet: ChessSet = {
  id: 'unicode-classic',
  name: 'Classic Unicode',
  description: 'Traditional chess symbols - fast loading and always available',
  category: 'unicode',
  preview: '♔♕♖♗♘♙',
  isUnicode: true,
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
  }

// Classic Staunton-style set
const classicSet: ChessSet = {
  id: 'staunton-classic',
  name: 'Staunton Classic',
  description: 'Traditional Staunton tournament pieces',
  category: 'classic',
  preview: classicWhiteKing, // Using white king as preview
  white: {
    king: classicWhiteKing,
    queen: classicWhiteQueen,
    rook: classicWhiteRook,
    bishop: classicWhiteBishop,
    knight: classicWhiteKnight,
    pawn: classicWhitePawn
  },
  black: {
    king: classicBlackKing,
    queen: classicBlackQueen,
    rook: classicBlackRook,
    bishop: classicBlackBishop,
    knight: classicBlackKnight,
    pawn: classicBlackPawn
  }
}

// Modern minimalist set - TODO: Add actual assets
// const modernSet: ChessSet = {
//   id: 'modern-minimal',
//   name: 'Modern Minimal',
//   description: 'Clean, contemporary design for modern players',
//   category: 'modern',
//   preview: '/src/assets/chess-sets/modern/preview.png',
//   white: {
//     king: '/src/assets/chess-sets/modern/white/king.svg',
//     queen: '/src/assets/chess-sets/modern/white/queen.svg',
//     rook: '/src/assets/chess-sets/modern/white/rook.svg',
//     bishop: '/src/assets/chess-sets/modern/white/bishop.svg',
//     knight: '/src/assets/chess-sets/modern/white/knight.svg',
//     pawn: '/src/assets/chess-sets/modern/white/pawn.svg'
//   },
//   black: {
//     king: '/src/assets/chess-sets/modern/black/king.svg',
//     queen: '/src/assets/chess-sets/modern/black/queen.svg',
//     rook: '/src/assets/chess-sets/modern/black/rook.svg',
//     bishop: '/src/assets/chess-sets/modern/black/bishop.svg',
//     knight: '/src/assets/chess-sets/modern/black/knight.svg',
//     pawn: '/src/assets/chess-sets/modern/black/pawn.svg'
//   }
// }

// Kid-friendly cartoon set
const cartoonSet: ChessSet = {
  id: 'cartoon-fun',
  name: 'Cartoon Kingdom',
  description: 'Fun, colorful pieces perfect for young learners',
  category: 'fun',
  preview: cartoonWhiteKing, // Using white king as preview for now
  white: {
    king: cartoonWhiteKing,
    queen: cartoonWhiteQueen,
    rook: cartoonWhiteRook,
    bishop: cartoonWhiteBishop,
    knight: cartoonWhiteKnight,
    pawn: cartoonWhitePawn
  },
  black: {
    king: cartoonBlackKing,
    queen: cartoonBlackQueen,
    rook: cartoonBlackRook,
    bishop: cartoonBlackBishop,
    knight: cartoonBlackKnight,
    pawn: cartoonBlackPawn
  }
}

// Alternative Unicode set with different symbols
const unicodeAlternative: ChessSet = {
  id: 'unicode-outlined',
  name: 'Unicode Outlined',
  description: 'Alternative Unicode symbols with outlined style',
  category: 'unicode',
  preview: '♔♕♖♗♘♙',
  isUnicode: true,
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
}

// Export all chess sets
export const chessSets: ChessSet[] = [
  unicodeSet,      // Default - always works
  classicSet,      // Traditional tournament style
  // modernSet,    // Contemporary design - TODO: Add assets
  cartoonSet,      // Kid-friendly
  unicodeAlternative // Alternative Unicode
]

export const defaultChessSetId = 'unicode-classic'

// Helper functions
export const getChessSetById = (id: string): ChessSet | undefined => {
  return chessSets.find(set => set.id === id)
}

export const getChessSetsByCategory = (category: ChessSet['category']): ChessSet[] => {
  return chessSets.filter(set => set.category === category)
} 
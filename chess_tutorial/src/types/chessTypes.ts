export interface ChessPieceImages {
  king: string
  queen: string
  rook: string
  bishop: string
  knight: string
  pawn: string
}

export interface ChessSet {
  id: string
  name: string
  description: string
  category: 'classic' | 'modern' | 'fun' | 'unicode'
  preview: string // Preview image for the set selector
  white: ChessPieceImages
  black: ChessPieceImages
  isUnicode?: boolean // Special flag for Unicode sets
}

export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'
export type PieceColor = 'white' | 'black' 
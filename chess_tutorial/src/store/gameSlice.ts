import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Chess } from 'chess.js'

export interface GameMove {
  move: string
  fen: string
  san: string
  timestamp: number
}

export interface SavedPosition {
  id: string
  name: string
  fen: string
  moveIndex: number
  description?: string
  createdAt: number
  gameHistory: GameMove[] // Store the history up to this point
}

export interface PositionBrowser {
  isOpen: boolean
  selectedPositionId: string | null
  previewMoveIndex: number
  isPreviewMode: boolean
}

export interface GameState {
  chessGame: Chess
  gameHistory: GameMove[]
  currentMoveIndex: number
  status: 'idle' | 'playing' | 'paused' | 'finished'
  result: string | null
  isPlayerTurn: boolean
  selectedSquare: string | null
  possibleMoves: string[]
  lastMove: { from: string; to: string } | null
  isInCheck: boolean
  checkSquare: string | null
  capturedPieces: {
    white: string[]
    black: string[]
  }
  hints: {
    enabled: boolean
    candidateMoves: string[]
    currentHint: string | null
  }
  patterns: {
    fork: string[]
    pin: string[]
    discoveredAttack: string[]
  }
  aiMoveAnimation: {
    isAnimating: boolean
    from: string | null
    to: string | null
  }
  showResultModal: boolean
  savedPositions: SavedPosition[]
  positionBrowser: PositionBrowser
}

// Load saved positions from localStorage
const loadSavedPositions = (): SavedPosition[] => {
  try {
    const saved = localStorage.getItem('chess-saved-positions')
    if (saved) {
      const positions = JSON.parse(saved)
      if (positions.length > 0) {
        return positions
      }
    }
  } catch (error) {
    console.warn('Failed to load saved positions from localStorage:', error)
  }
  
  // If no saved positions exist, create some demo positions
  const demoPositions: SavedPosition[] = [
    {
      id: 'demo_opening_1',
      name: 'Italian Game Opening',
      description: 'Classic opening position after 1.e4 e5 2.Nf3 Nc6 3.Bc4',
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
      moveIndex: 5,
      createdAt: Date.now() - 86400000, // 1 day ago
      gameHistory: [
        { move: 'e2-e4', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', san: 'e4', timestamp: Date.now() - 86400000 },
        { move: 'e7-e5', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2', san: 'e5', timestamp: Date.now() - 86400000 },
        { move: 'g1-f3', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2', san: 'Nf3', timestamp: Date.now() - 86400000 },
        { move: 'b8-c6', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', san: 'Nc6', timestamp: Date.now() - 86400000 },
        { move: 'f1-c4', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3', san: 'Bc4', timestamp: Date.now() - 86400000 }
      ]
    },
    {
      id: 'demo_middlegame_1',
      name: 'Tactical Position',
      description: 'Interesting middlegame position with tactical opportunities',
      fen: 'r2qkb1r/ppp2ppp/2n1bn2/3pp3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 6',
      moveIndex: 10,
      createdAt: Date.now() - 3600000, // 1 hour ago
      gameHistory: []
    }
  ]
  
  // Save demo positions to localStorage
  try {
    localStorage.setItem('chess-saved-positions', JSON.stringify(demoPositions))
  } catch (error) {
    console.warn('Failed to save demo positions to localStorage:', error)
  }
  
  return demoPositions
}

const initialState: GameState = {
  chessGame: new Chess(),
  gameHistory: [],
  currentMoveIndex: -1,
  status: 'idle',
  result: null,
  isPlayerTurn: true,
  selectedSquare: null,
  possibleMoves: [],
  lastMove: null,
  isInCheck: false,
  checkSquare: null,
  capturedPieces: {
    white: [],
    black: []
  },
  hints: {
    enabled: false,
    candidateMoves: [],
    currentHint: null
  },
  patterns: {
    fork: [],
    pin: [],
    discoveredAttack: []
  },
  aiMoveAnimation: {
    isAnimating: false,
    from: null,
    to: null
  },
  showResultModal: false,
  savedPositions: loadSavedPositions(),
  positionBrowser: {
    isOpen: false,
    selectedPositionId: null,
    previewMoveIndex: -1,
    isPreviewMode: false
  }
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startNewGame: (state) => {
      state.chessGame = new Chess()
      state.gameHistory = []
      state.currentMoveIndex = -1
      state.status = 'playing'
      state.result = null
      state.isPlayerTurn = true
      state.selectedSquare = null
      state.possibleMoves = []
      state.lastMove = null
      state.isInCheck = false
      state.checkSquare = null
      state.capturedPieces = { white: [], black: [] }
      state.patterns = { fork: [], pin: [], discoveredAttack: [] }
      state.aiMoveAnimation = { isAnimating: false, from: null, to: null }
      state.showResultModal = false
    },

    makeMove: (state, action: PayloadAction<{ from: string; to: string; promotion?: string }>) => {
      const { from, to, promotion } = action.payload
      
      try {
        const move = state.chessGame.move({ from, to, promotion })
        if (move) {
          // Add to history
          const gameMove: GameMove = {
            move: `${from}-${to}`,
            fen: state.chessGame.fen(),
            san: move.san,
            timestamp: Date.now()
          }
          
          // Remove any moves after current position if we were viewing history
          state.gameHistory = state.gameHistory.slice(0, state.currentMoveIndex + 1)
          state.gameHistory.push(gameMove)
          state.currentMoveIndex = state.gameHistory.length - 1
          
          // Update game state
          state.lastMove = { from, to }
          state.isPlayerTurn = !state.isPlayerTurn
          state.selectedSquare = null
          state.possibleMoves = []
          
          // Handle captured pieces
          if (move.captured) {
            const capturedPiece = move.captured
            if (move.color === 'w') {
              state.capturedPieces.black.push(capturedPiece)
            } else {
              state.capturedPieces.white.push(capturedPiece)
            }
          }
          
          // Check for check/checkmate
          if (state.chessGame.inCheck()) {
            state.isInCheck = true
            state.checkSquare = state.chessGame.turn() === 'w' ? 
              findKingSquare(state.chessGame, 'w') : 
              findKingSquare(state.chessGame, 'b')
          } else {
            state.isInCheck = false
            state.checkSquare = null
          }
          
          // Check for game end
          if (state.chessGame.isGameOver()) {
            state.status = 'finished'
            state.showResultModal = true
            if (state.chessGame.isCheckmate()) {
              state.result = `Checkmate! ${state.chessGame.turn() === 'w' ? 'Black' : 'White'} wins!`
            } else if (state.chessGame.isDraw()) {
              state.result = 'Draw!'
            } else if (state.chessGame.isStalemate()) {
              state.result = 'Stalemate!'
            }
          }
        }
      } catch (error) {
        console.error('Invalid move:', error)
      }
    },

    selectSquare: (state, action: PayloadAction<string>) => {
      const square = action.payload
      
      if (state.selectedSquare === square) {
        // Deselect if clicking same square
        state.selectedSquare = null
        state.possibleMoves = []
      } else {
        state.selectedSquare = square
        // Get possible moves for this square
        const moves = state.chessGame.moves({ square: square as any, verbose: true })
        state.possibleMoves = moves.map((move: any) => move.to)
      }
    },

    undoMove: (state) => {
      if (state.currentMoveIndex >= 0) {
        // Auto-pause when undoing moves to prevent accidental moves
        if (state.status === 'playing') {
          state.status = 'paused'
        }
        
        state.currentMoveIndex--
        if (state.currentMoveIndex >= 0) {
          // Load the game state at this point
          const targetMove = state.gameHistory[state.currentMoveIndex]
          state.chessGame.load(targetMove.fen)
        } else {
          // Go back to starting position
          state.chessGame.reset()
        }
        
        state.isPlayerTurn = !state.isPlayerTurn
        state.selectedSquare = null
        state.possibleMoves = []
        state.lastMove = null
        
        // Update check status
        if (state.chessGame.inCheck()) {
          state.isInCheck = true
          state.checkSquare = state.chessGame.turn() === 'w' ? 
            findKingSquare(state.chessGame, 'w') : 
            findKingSquare(state.chessGame, 'b')
        } else {
          state.isInCheck = false
          state.checkSquare = null
        }
      }
    },

    jumpToMove: (state, action: PayloadAction<number>) => {
      const moveIndex = action.payload
      
      if (moveIndex >= -1 && moveIndex < state.gameHistory.length) {
        // Auto-pause if navigating to a position that's not the latest move
        // This prevents accidental moves while browsing history
        if (moveIndex < state.gameHistory.length - 1 && state.status === 'playing') {
          state.status = 'paused'
        }
        
        state.currentMoveIndex = moveIndex
        
        if (moveIndex >= 0) {
          const targetMove = state.gameHistory[moveIndex]
          state.chessGame.load(targetMove.fen)
        } else {
          state.chessGame.reset()
        }
        
        state.selectedSquare = null
        state.possibleMoves = []
        
        // Update game state based on position
        state.isPlayerTurn = state.chessGame.turn() === 'w'
        
        if (state.chessGame.inCheck()) {
          state.isInCheck = true
          state.checkSquare = state.chessGame.turn() === 'w' ? 
            findKingSquare(state.chessGame, 'w') : 
            findKingSquare(state.chessGame, 'b')
        } else {
          state.isInCheck = false
          state.checkSquare = null
        }
      }
    },

    pauseGame: (state) => {
      if (state.status === 'playing') {
        state.status = 'paused'
      }
    },

    resumeGame: (state) => {
      if (state.status === 'paused') {
        state.status = 'playing'
      }
    },

    enableHints: (state) => {
      state.hints.enabled = true
    },

    disableHints: (state) => {
      state.hints.enabled = false
      state.hints.candidateMoves = []
      state.hints.currentHint = null
    },

    setHints: (state, action: PayloadAction<string[]>) => {
      state.hints.candidateMoves = action.payload
    },

    setCurrentHint: (state, action: PayloadAction<string | null>) => {
      state.hints.currentHint = action.payload
    },

    setPatterns: (state, action: PayloadAction<{
      fork?: string[]
      pin?: string[]
      discoveredAttack?: string[]
    }>) => {
      if (action.payload.fork) state.patterns.fork = action.payload.fork
      if (action.payload.pin) state.patterns.pin = action.payload.pin
      if (action.payload.discoveredAttack) state.patterns.discoveredAttack = action.payload.discoveredAttack
    },

    startAIMoveAnimation: (state, action: PayloadAction<{ from: string; to: string }>) => {
      state.aiMoveAnimation.isAnimating = true
      state.aiMoveAnimation.from = action.payload.from
      state.aiMoveAnimation.to = action.payload.to
    },

    endAIMoveAnimation: (state) => {
      state.aiMoveAnimation.isAnimating = false
      state.aiMoveAnimation.from = null
      state.aiMoveAnimation.to = null
    },

    dismissResultModal: (state) => {
      state.showResultModal = false
    },

    continueFromPosition: (state, action: PayloadAction<number>) => {
      const moveIndex = action.payload
      
      if (moveIndex >= -1 && moveIndex < state.gameHistory.length) {
        // Set the game to the specified position
        state.currentMoveIndex = moveIndex
        
        if (moveIndex >= 0) {
          const targetMove = state.gameHistory[moveIndex]
          state.chessGame.load(targetMove.fen)
        } else {
          state.chessGame.reset()
        }
        
        // Truncate game history after this point to allow new moves
        state.gameHistory = state.gameHistory.slice(0, moveIndex + 1)
        
        // Reset game state for continued play
        state.status = 'playing'
        state.result = null
        state.showResultModal = false
        state.selectedSquare = null
        state.possibleMoves = []
        state.lastMove = null
        
        // Update game state based on position
        state.isPlayerTurn = state.chessGame.turn() === 'w'
        
        // Update check status
        if (state.chessGame.inCheck()) {
          state.isInCheck = true
          state.checkSquare = state.chessGame.turn() === 'w' ? 
            findKingSquare(state.chessGame, 'w') : 
            findKingSquare(state.chessGame, 'b')
        } else {
          state.isInCheck = false
          state.checkSquare = null
        }

        // Reset captured pieces - will be recalculated as new moves are made
        state.capturedPieces = { white: [], black: [] }

        // Clear patterns and hints
        state.patterns = { fork: [], pin: [], discoveredAttack: [] }
        state.hints = { enabled: false, candidateMoves: [], currentHint: null }
        state.aiMoveAnimation = { isAnimating: false, from: null, to: null }
      }
    },

    // Position Browser Actions
    openPositionBrowser: (state) => {
      state.positionBrowser.isOpen = true
      state.positionBrowser.isPreviewMode = false
      state.positionBrowser.selectedPositionId = null
      state.positionBrowser.previewMoveIndex = state.currentMoveIndex
    },

    closePositionBrowser: (state) => {
      state.positionBrowser.isOpen = false
      state.positionBrowser.isPreviewMode = false
      state.positionBrowser.selectedPositionId = null
      // Return to original position if we were previewing
      if (state.positionBrowser.isPreviewMode) {
        if (state.positionBrowser.previewMoveIndex >= 0) {
          const targetMove = state.gameHistory[state.positionBrowser.previewMoveIndex]
          state.chessGame.load(targetMove.fen)
        } else {
          state.chessGame.reset()
        }
        state.currentMoveIndex = state.positionBrowser.previewMoveIndex
      }
    },

    previewPosition: (state, action: PayloadAction<{ moveIndex: number; positionId?: string }>) => {
      const { moveIndex, positionId } = action.payload
      
      // Enter preview mode
      state.positionBrowser.isPreviewMode = true
      state.positionBrowser.selectedPositionId = positionId || null
      
      // Load the position
      if (moveIndex >= 0 && moveIndex < state.gameHistory.length) {
        const targetMove = state.gameHistory[moveIndex]
        state.chessGame.load(targetMove.fen)
        state.currentMoveIndex = moveIndex
      } else if (moveIndex === -1) {
        state.chessGame.reset()
        state.currentMoveIndex = -1
      }
      
      // Update game state for preview
      state.isPlayerTurn = state.chessGame.turn() === 'w'
      state.selectedSquare = null
      state.possibleMoves = []
      
      if (state.chessGame.inCheck()) {
        state.isInCheck = true
        state.checkSquare = state.chessGame.turn() === 'w' ? 
          findKingSquare(state.chessGame, 'w') : 
          findKingSquare(state.chessGame, 'b')
      } else {
        state.isInCheck = false
        state.checkSquare = null
      }
    },

    confirmContinueFromPreview: (state) => {
      if (state.positionBrowser.isPreviewMode) {
        const moveIndex = state.currentMoveIndex
        
        // Truncate game history after this point to allow new moves
        state.gameHistory = state.gameHistory.slice(0, moveIndex + 1)
        
        // Reset game state for continued play
        state.status = 'playing'
        state.result = null
        state.showResultModal = false
        state.selectedSquare = null
        state.possibleMoves = []
        state.lastMove = null
        
        // Reset captured pieces - will be recalculated as new moves are made
        state.capturedPieces = { white: [], black: [] }

        // Clear patterns and hints
        state.patterns = { fork: [], pin: [], discoveredAttack: [] }
        state.hints = { enabled: false, candidateMoves: [], currentHint: null }
        state.aiMoveAnimation = { isAnimating: false, from: null, to: null }
        
        // Close position browser
        state.positionBrowser.isOpen = false
        state.positionBrowser.isPreviewMode = false
        state.positionBrowser.selectedPositionId = null
      }
    },

    // Saved Positions Actions
    saveCurrentPosition: (state, action: PayloadAction<{ name: string; description?: string }>) => {
      const { name, description } = action.payload
      
      const savedPosition: SavedPosition = {
        id: `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        description,
        fen: state.chessGame.fen(),
        moveIndex: state.currentMoveIndex,
        createdAt: Date.now(),
        gameHistory: [...state.gameHistory.slice(0, state.currentMoveIndex + 1)]
      }
      
      state.savedPositions.push(savedPosition)
      
      // Save to localStorage
      try {
        localStorage.setItem('chess-saved-positions', JSON.stringify(state.savedPositions))
      } catch (error) {
        console.warn('Failed to save positions to localStorage:', error)
      }
    },

    loadSavedPosition: (state, action: PayloadAction<string>) => {
      const positionId = action.payload
      const savedPosition = state.savedPositions.find(pos => pos.id === positionId)
      
      if (savedPosition) {
        // Load the saved game state
        state.gameHistory = [...savedPosition.gameHistory]
        state.currentMoveIndex = savedPosition.moveIndex
        state.chessGame.load(savedPosition.fen)
        
        // Update game state
        state.isPlayerTurn = state.chessGame.turn() === 'w'
        state.selectedSquare = null
        state.possibleMoves = []
        state.lastMove = null
        
        if (state.chessGame.inCheck()) {
          state.isInCheck = true
          state.checkSquare = state.chessGame.turn() === 'w' ? 
            findKingSquare(state.chessGame, 'w') : 
            findKingSquare(state.chessGame, 'b')
        } else {
          state.isInCheck = false
          state.checkSquare = null
        }
      }
    },

    deleteSavedPosition: (state, action: PayloadAction<string>) => {
      const positionId = action.payload
      state.savedPositions = state.savedPositions.filter(pos => pos.id !== positionId)
      
      // Update localStorage
      try {
        localStorage.setItem('chess-saved-positions', JSON.stringify(state.savedPositions))
      } catch (error) {
        console.warn('Failed to update saved positions in localStorage:', error)
      }
    },

    renameSavedPosition: (state, action: PayloadAction<{ id: string; name: string; description?: string }>) => {
      const { id, name, description } = action.payload
      const position = state.savedPositions.find(pos => pos.id === id)
      
      if (position) {
        position.name = name
        if (description !== undefined) {
          position.description = description
        }
        
        // Update localStorage
        try {
          localStorage.setItem('chess-saved-positions', JSON.stringify(state.savedPositions))
        } catch (error) {
          console.warn('Failed to update saved positions in localStorage:', error)
        }
      }
    },

    refreshSavedPositions: (state) => {
      try {
        const saved = localStorage.getItem('chess-saved-positions')
        if (saved) {
          state.savedPositions = JSON.parse(saved)
        }
      } catch (error) {
        console.warn('Failed to load saved positions from localStorage:', error)
        state.savedPositions = []
      }
    }
  }
})

// Helper function to find king square
function findKingSquare(game: any, color: 'w' | 'b'): string {
  const board = game.board()
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file]
      if (piece && piece.type === 'k' && piece.color === color) {
        const files = 'abcdefgh'
        return files[file] + (8 - rank)
      }
    }
  }
  return ''
}

export const {
  startNewGame,
  makeMove,
  selectSquare,
  undoMove,
  jumpToMove,
  pauseGame,
  resumeGame,
  enableHints,
  disableHints,
  setHints,
  setCurrentHint,
  setPatterns,
  startAIMoveAnimation,
  endAIMoveAnimation,
  dismissResultModal,
  continueFromPosition,
  openPositionBrowser,
  closePositionBrowser,
  previewPosition,
  confirmContinueFromPreview,
  saveCurrentPosition,
  loadSavedPosition,
  deleteSavedPosition,
  renameSavedPosition,
  refreshSavedPositions
} = gameSlice.actions

export default gameSlice.reducer 
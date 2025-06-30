import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Chess } from 'chess.js'

export interface GameMove {
  move: string
  fen: string
  san: string
  timestamp: number
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
        const moves = state.chessGame.moves({ square, verbose: true })
        state.possibleMoves = moves.map(move => move.to)
      }
    },

    undoMove: (state) => {
      if (state.currentMoveIndex >= 0) {
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
    }
  }
})

// Helper function to find king square
function findKingSquare(game: Chess, color: 'w' | 'b'): string {
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
  endAIMoveAnimation
} = gameSlice.actions

export default gameSlice.reducer 
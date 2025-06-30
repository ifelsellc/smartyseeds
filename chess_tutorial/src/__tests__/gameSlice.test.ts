import { describe, it, expect, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import gameReducer, { 
  startNewGame, 
  makeMove, 
  selectSquare, 
  undoMove,
  enableHints,
  disableHints
} from '../store/gameSlice'
import { Chess } from 'chess.js'

describe('Game Slice', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: { game: gameReducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['game/startNewGame', 'game/makeMove'],
            ignoredPaths: ['game.chessGame'],
          },
        }),
    })
  })

  describe('startNewGame', () => {
    it('should initialize a new game', () => {
      store.dispatch(startNewGame())
      const state = store.getState().game

      expect(state.status).toBe('playing')
      expect(state.gameHistory).toHaveLength(0)
      expect(state.currentMoveIndex).toBe(-1)
      expect(state.isPlayerTurn).toBe(true)
      expect(state.result).toBe(null)
    })

    it('should reset the chess board to starting position', () => {
      store.dispatch(startNewGame())
      const state = store.getState().game

      expect(state.chessGame.fen()).toBe(new Chess().fen())
    })
  })

  describe('selectSquare', () => {
    beforeEach(() => {
      store.dispatch(startNewGame())
    })

    it('should select a square with possible moves', () => {
      store.dispatch(selectSquare('e2'))
      const state = store.getState().game

      expect(state.selectedSquare).toBe('e2')
      expect(state.possibleMoves).toContain('e3')
      expect(state.possibleMoves).toContain('e4')
    })

    it('should deselect when clicking the same square', () => {
      store.dispatch(selectSquare('e2'))
      store.dispatch(selectSquare('e2'))
      const state = store.getState().game

      expect(state.selectedSquare).toBe(null)
      expect(state.possibleMoves).toHaveLength(0)
    })

    it('should not show moves for empty squares', () => {
      store.dispatch(selectSquare('e5'))
      const state = store.getState().game

      expect(state.selectedSquare).toBe('e5')
      expect(state.possibleMoves).toHaveLength(0)
    })
  })

  describe('makeMove', () => {
    beforeEach(() => {
      store.dispatch(startNewGame())
    })

    it('should make a valid move', () => {
      store.dispatch(makeMove({ from: 'e2', to: 'e4' }))
      const state = store.getState().game

      expect(state.gameHistory).toHaveLength(1)
      expect(state.currentMoveIndex).toBe(0)
      expect(state.isPlayerTurn).toBe(false)
      expect(state.gameHistory[0].san).toBe('e4')
    })

    it('should not make an invalid move', () => {
      const initialState = store.getState().game
      store.dispatch(makeMove({ from: 'e2', to: 'e5' }))
      const state = store.getState().game

      expect(state.gameHistory).toHaveLength(0)
      expect(state.currentMoveIndex).toBe(-1)
      expect(state.chessGame.fen()).toBe(initialState.chessGame.fen())
    })

    it('should update last move information', () => {
      store.dispatch(makeMove({ from: 'e2', to: 'e4' }))
      const state = store.getState().game

      expect(state.lastMove).toEqual({ from: 'e2', to: 'e4' })
    })

    it('should clear selected square after move', () => {
      store.dispatch(selectSquare('e2'))
      store.dispatch(makeMove({ from: 'e2', to: 'e4' }))
      const state = store.getState().game

      expect(state.selectedSquare).toBe(null)
      expect(state.possibleMoves).toHaveLength(0)
    })
  })

  describe('undoMove', () => {
    beforeEach(() => {
      store.dispatch(startNewGame())
      store.dispatch(makeMove({ from: 'e2', to: 'e4' }))
      store.dispatch(makeMove({ from: 'e7', to: 'e5' }))
    })

    it('should undo the last move', () => {
      store.dispatch(undoMove())
      const state = store.getState().game

      expect(state.currentMoveIndex).toBe(0)
      expect(state.isPlayerTurn).toBe(false)
    })

    it('should not undo beyond the beginning', () => {
      store.dispatch(undoMove())
      store.dispatch(undoMove())
      store.dispatch(undoMove()) // This should not change anything
      const state = store.getState().game

      expect(state.currentMoveIndex).toBe(-1)
      expect(state.chessGame.fen()).toBe(new Chess().fen())
    })
  })

  describe('hints functionality', () => {
    beforeEach(() => {
      store.dispatch(startNewGame())
    })

    it('should enable hints', () => {
      store.dispatch(enableHints())
      const state = store.getState().game

      expect(state.hints.enabled).toBe(true)
    })

    it('should disable hints and clear hint data', () => {
      store.dispatch(enableHints())
      store.dispatch(disableHints())
      const state = store.getState().game

      expect(state.hints.enabled).toBe(false)
      expect(state.hints.candidateMoves).toHaveLength(0)
      expect(state.hints.currentHint).toBe(null)
    })
  })

  describe('game state management', () => {
    beforeEach(() => {
      store.dispatch(startNewGame())
    })

    it('should track captured pieces', () => {
      // Set up a position where we can capture
      store.dispatch(makeMove({ from: 'e2', to: 'e4' }))
      store.dispatch(makeMove({ from: 'd7', to: 'd5' }))
      store.dispatch(makeMove({ from: 'e4', to: 'd5' })) // Capture pawn
      
      const state = store.getState().game
      expect(state.capturedPieces.black).toContain('p')
    })

    it('should detect check status', () => {
      // This would require setting up a specific position
      // For now, we'll just test that the check properties exist
      const state = store.getState().game
      expect(typeof state.isInCheck).toBe('boolean')
      expect(state.checkSquare).toBe(null)
    })
  })
}) 
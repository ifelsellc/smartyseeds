import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { getChessSetById, defaultChessSetId } from '../config/chessSets'
import { setSelectedChessSet } from '../store/preferencesSlice'
import { PieceType, PieceColor } from '../types/chessTypes'

export const useChessPieces = () => {
  const dispatch = useDispatch()
  const { selectedChessSetId } = useSelector((state: RootState) => state.preferences)
  const selectedSet = getChessSetById(selectedChessSetId)

  const getPieceRepresentation = (pieceType: PieceType, color: PieceColor): string => {
    if (!selectedSet) {
      // Fallback to Unicode if set not found
      const fallbackPieces = {
        white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
        black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
      }
      return fallbackPieces[color][pieceType]
    }

    return selectedSet[color][pieceType]
  }

  const isUnicodeSet = (): boolean => {
    return selectedSet?.isUnicode || false
  }

  const getSetName = (): string => {
    return selectedSet?.name || 'Unknown'
  }

  const getSetCategory = (): string => {
    return selectedSet?.category || 'unknown'
  }

  // Function to switch to Unicode fallback if images fail
  const switchToUnicodeFallback = () => {
    console.warn('Chess piece images failed to load, switching to Unicode fallback')
    dispatch(setSelectedChessSet(defaultChessSetId))
  }

  return {
    getPieceRepresentation,
    isUnicodeSet,
    getSetName,
    getSetCategory,
    selectedSet,
    switchToUnicodeFallback
  }
} 
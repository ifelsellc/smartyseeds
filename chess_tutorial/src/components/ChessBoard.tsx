import React, { useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { selectSquare, makeMove } from '../store/gameSlice'
import { motion } from 'framer-motion'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useAI } from '../hooks/useAI'

// Chess piece Unicode symbols
const PIECES = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
}

// Promotion dialog component
const PromotionDialog: React.FC<{
  isOpen: boolean
  onSelect: (piece: string) => void
  onCancel: () => void
  color: 'w' | 'b'
}> = ({ isOpen, onSelect, onCancel, color }) => {
  if (!isOpen) return null

  const pieces = [
    { symbol: color === 'w' ? '♕' : '♛', value: 'q', name: 'Queen' },
    { symbol: color === 'w' ? '♖' : '♜', value: 'r', name: 'Rook' },
    { symbol: color === 'w' ? '♗' : '♝', value: 'b', name: 'Bishop' },
    { symbol: color === 'w' ? '♘' : '♞', value: 'n', name: 'Knight' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Choose promotion piece:
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {pieces.map((piece) => (
            <button
              key={piece.value}
              onClick={() => onSelect(piece.value)}
              className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <span className="text-4xl mb-2">{piece.symbol}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {piece.name}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

const ChessBoard: React.FC = () => {
  const dispatch = useDispatch()
  const { playMove, playCapture, playCheck } = useSoundEffects()
  const { isAIThinking } = useAI()
  
  // Promotion dialog state
  const [promotionDialog, setPromotionDialog] = useState<{
    isOpen: boolean
    from: string
    to: string
    color: 'w' | 'b'
  }>({
    isOpen: false,
    from: '',
    to: '',
    color: 'w'
  })
  
  const {
    chessGame,
    selectedSquare,
    possibleMoves,
    lastMove,
    isInCheck,
    checkSquare,
    hints,
    patterns,
    status,
    aiMoveAnimation
  } = useSelector((state: RootState) => state.game)

  const { thinking } = useSelector((state: RootState) => state.ai)

  // Convert chess.js board to our format
  const board = chessGame.board()

  const handlePromotion = (promotionPiece: string) => {
    dispatch(makeMove({
      from: promotionDialog.from,
      to: promotionDialog.to,
      promotion: promotionPiece
    }))
    
    setPromotionDialog({ isOpen: false, from: '', to: '', color: 'w' })
    
    // Play sound effect
    playMove()
    
    // Check for check after move
    setTimeout(() => {
      if (chessGame.inCheck()) {
        playCheck()
      }
    }, 100)
  }

  const handlePromotionCancel = () => {
    setPromotionDialog({ isOpen: false, from: '', to: '', color: 'w' })
  }

  const isPromotionMove = (from: string, to: string): boolean => {
    const piece = chessGame.get(from as any)
    if (!piece || piece.type !== 'p') return false
    
    const toRank = parseInt(to[1])
    return (piece.color === 'w' && toRank === 8) || (piece.color === 'b' && toRank === 1)
  }

  const handleSquareClick = useCallback((square: string) => {
    if (status !== 'playing' || thinking) return

    // If a square is selected and we click on a possible move
    if (selectedSquare && possibleMoves.includes(square)) {
      // Check if this is a promotion move
      if (isPromotionMove(selectedSquare, square)) {
        const piece = chessGame.get(selectedSquare as any)
        setPromotionDialog({
          isOpen: true,
          from: selectedSquare,
          to: square,
          color: piece?.color || 'w'
        })
        return
      }

      // Regular move (non-promotion)
      const moves = chessGame.moves({ square: selectedSquare as any, verbose: true }) as any[]
      const move = moves.find((m: any) => m.to === square)
      
      if (move) {
        // Play sound effect
        if (move.captured) {
          playCapture()
        } else {
          playMove()
        }
        
        dispatch(makeMove({ 
          from: selectedSquare, 
          to: square, 
          promotion: move.promotion || 'q' // Default to queen for promotion
        }))
        
        // Check for check after move
        setTimeout(() => {
          if (chessGame.inCheck()) {
            playCheck()
          }
        }, 100)
      }
    } else {
      // Select the square
      dispatch(selectSquare(square))
    }
  }, [selectedSquare, possibleMoves, chessGame, dispatch, status, thinking, playMove, playCapture, playCheck])

  const getSquareColor = (file: number, rank: number): string => {
    const square = String.fromCharCode(97 + file) + (8 - rank)
    const isLight = (file + rank) % 2 === 0
    
    let classes = 'chess-square '
    
    // Base color
    classes += isLight ? 'light ' : 'dark '
    
    // AI move animation highlight (takes priority)
    if (aiMoveAnimation.isAnimating && 
        (aiMoveAnimation.from === square || aiMoveAnimation.to === square)) {
      classes += 'ai-move-highlight '
    }
    // Selected square
    else if (selectedSquare === square) {
      classes += 'highlighted '
    }
    // Possible moves
    else if (possibleMoves.includes(square)) {
      classes += 'possible-move '
    }
    // Last move
    else if (lastMove && (lastMove.from === square || lastMove.to === square)) {
      classes += 'bg-opacity-70 '
    }
    
    // Check
    if (isInCheck && checkSquare === square) {
      classes += 'in-check '
    }
    
    return classes
  }

  const getPieceSymbol = (piece: any): string => {
    if (!piece) return ''
    const key = piece.color === 'w' ? piece.type.toUpperCase() : piece.type
    return PIECES[key as keyof typeof PIECES] || ''
  }

  const isHintSquare = (square: string): boolean => {
    return hints.enabled && hints.candidateMoves.includes(square)
  }

  const getPatternType = (square: string): string | null => {
    if (patterns.fork.includes(square)) return 'fork'
    if (patterns.pin.includes(square)) return 'pin'
    if (patterns.discoveredAttack.includes(square)) return 'discovered-attack'
    return null
  }

  return (
    <div className="relative">
      <div className={`game-board ${thinking ? 'pointer-events-none opacity-75' : ''}`}>
        {board.map((rank, rankIndex) =>
          rank.map((piece, fileIndex) => {
            const square = String.fromCharCode(97 + fileIndex) + (8 - rankIndex)
            const pieceSymbol = getPieceSymbol(piece)
            const isHint = isHintSquare(square)
            const patternType = getPatternType(square)

            return (
              <motion.div
                key={square}
                className={getSquareColor(fileIndex, rankIndex)}
                onClick={() => handleSquareClick(square)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Coordinate labels */}
                {fileIndex === 0 && (
                  <div className="absolute top-1 left-1 text-xs font-bold opacity-60">
                    {8 - rankIndex}
                  </div>
                )}
                {rankIndex === 7 && (
                  <div className="absolute bottom-1 right-1 text-xs font-bold opacity-60">
                    {String.fromCharCode(97 + fileIndex)}
                  </div>
                )}

                {/* Hint overlay */}
                {isHint && <div className="hint-overlay" />}
                
                {/* Pattern overlay */}
                {patternType && (
                  <div className={`pattern-overlay ${patternType}`} />
                )}

                {/* Chess piece */}
                {pieceSymbol && (
                  <motion.div
                    className={`chess-piece ${selectedSquare === square ? 'moving' : ''}`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {pieceSymbol}
                  </motion.div>
                )}

                {/* Possible move indicator */}
                {possibleMoves.includes(square) && !pieceSymbol && (
                  <div className="w-4 h-4 bg-gray-600 rounded-full opacity-50" />
                )}
              </motion.div>
            )
          })
        )}
      </div>

      {/* Promotion Dialog */}
      <PromotionDialog
        isOpen={promotionDialog.isOpen}
        onSelect={handlePromotion}
        onCancel={handlePromotionCancel}
        color={promotionDialog.color}
      />

      {/* AI move animation overlay */}
      {aiMoveAnimation.isAnimating && aiMoveAnimation.from && aiMoveAnimation.to && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-lg shadow-lg animate-bounce">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                AI moves: {aiMoveAnimation.from} → {aiMoveAnimation.to}
              </span>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default ChessBoard 
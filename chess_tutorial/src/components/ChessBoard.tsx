import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { selectSquare, makeMove, startAIMoveAnimation, endAIMoveAnimation } from '../store/gameSlice'
import { setThinking } from '../store/aiSlice'
import { motion } from 'framer-motion'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { useAI } from '../hooks/useAI'
import { useChessPieces } from '../hooks/useChessPieces'
import { PieceType, PieceColor } from '../types/chessTypes'

// Promotion dialog component
const PromotionDialog: React.FC<{
  isOpen: boolean
  onSelect: (piece: string) => void
  onCancel: () => void
  color: 'w' | 'b'
}> = ({ isOpen, onSelect, onCancel, color }) => {
  const { getPieceRepresentation, isUnicodeSet } = useChessPieces()
  
  if (!isOpen) return null

  const pieceColor: PieceColor = color === 'w' ? 'white' : 'black'
  const pieces = [
    { symbol: getPieceRepresentation('queen', pieceColor), value: 'q', name: 'Queen' },
    { symbol: getPieceRepresentation('rook', pieceColor), value: 'r', name: 'Rook' },
    { symbol: getPieceRepresentation('bishop', pieceColor), value: 'b', name: 'Bishop' },
    { symbol: getPieceRepresentation('knight', pieceColor), value: 'n', name: 'Knight' },
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
              className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <div className="text-6xl mb-2 w-16 h-16 flex items-center justify-center">
                {isUnicodeSet() ? (
                  <span>{piece.symbol}</span>
                ) : (
                  <img 
                    src={piece.symbol} 
                    alt={`${piece.name} piece`} 
                    className="w-full h-full object-contain"
                    draggable={false}
                    onError={(e) => {
                      // Fallback to Unicode if image fails to load
                      const target = e.target as HTMLImageElement;
                      const unicodeFallback = {
                        white: { queen: '♕', rook: '♖', bishop: '♗', knight: '♘' },
                        black: { queen: '♛', rook: '♜', bishop: '♝', knight: '♞' }
                      };
                      const fallbackSpan = document.createElement('span');
                      fallbackSpan.textContent = unicodeFallback[pieceColor][piece.value === 'q' ? 'queen' : piece.value === 'r' ? 'rook' : piece.value === 'b' ? 'bishop' : 'knight'];
                      fallbackSpan.className = 'text-6xl';
                      target.parentNode?.replaceChild(fallbackSpan, target);
                    }}
                  />
                )}
              </div>
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
  const { getBestMove, isThinking: aiIsThinking, isReady: aiIsReady } = useAI()
  const { getPieceRepresentation, isUnicodeSet } = useChessPieces()
  
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
    isPlayerTurn,
    aiMoveAnimation
  } = useSelector((state: RootState) => state.game)

  const { thinking } = useSelector((state: RootState) => state.ai)

  // AI Move Logic - Trigger AI moves when it's AI's turn
  useEffect(() => {
    const makeAIMove = async () => {
      if (status !== 'playing' || isPlayerTurn || thinking || !aiIsReady || chessGame.isGameOver()) {
        return
      }

      dispatch(setThinking(true))

      try {
        const currentFen = chessGame.fen()
        const aiMove = await getBestMove(currentFen)
        
        if (aiMove && status === 'playing' && !isPlayerTurn) {
          
          // Parse the move (e.g., "e2e4" -> from: "e2", to: "e4")
          const from = aiMove.substring(0, 2)
          const to = aiMove.substring(2, 4)
          const promotion = aiMove.length > 4 ? aiMove.substring(4) : undefined
          
          // Start animation
          dispatch(startAIMoveAnimation({ from, to }))
          
          // Wait a moment to show the animation
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Make the move
          dispatch(makeMove({ from, to, promotion }))
          
          // Play sound effect
          const move = chessGame.moves({ verbose: true }).find((m: any) => 
            m.from === from && m.to === to
          )
          if (move?.captured) {
            playCapture()
          } else {
            playMove()
          }
          
          // Check for check after move
          setTimeout(() => {
            if (chessGame.inCheck()) {
              playCheck()
            }
          }, 100)
          
          // End animation
          setTimeout(() => {
            dispatch(endAIMoveAnimation())
          }, 1000)
        }
      } catch (error) {
        console.error('❌ AI move error:', error)
      } finally {
        dispatch(setThinking(false))
      }
    }

    makeAIMove()
  }, [status, isPlayerTurn, thinking, aiIsReady, chessGame, getBestMove, dispatch, playMove, playCapture, playCheck])

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
    
    const pieceColor: PieceColor = piece.color === 'w' ? 'white' : 'black'
    const pieceType: PieceType = piece.type === 'p' ? 'pawn' : 
                                 piece.type === 'r' ? 'rook' :
                                 piece.type === 'n' ? 'knight' :
                                 piece.type === 'b' ? 'bishop' :
                                 piece.type === 'q' ? 'queen' :
                                 piece.type === 'k' ? 'king' : 'pawn'
    
    return getPieceRepresentation(pieceType, pieceColor)
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
                    {isUnicodeSet() ? (
                      <span>{pieceSymbol}</span>
                    ) : (
                      <img 
                        src={pieceSymbol} 
                        alt="Chess piece" 
                        className="w-full h-full object-contain"
                        draggable={false}
                        onError={(e) => {
                          // Fallback to Unicode if image fails to load
                          const target = e.target as HTMLImageElement;
                          const piece = board[rankIndex][fileIndex];
                          if (piece) {
                            const unicodeFallback = {
                              white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
                              black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
                            };
                            const pieceColor = piece.color === 'w' ? 'white' : 'black';
                            const pieceType = piece.type === 'p' ? 'pawn' : 
                                           piece.type === 'r' ? 'rook' :
                                           piece.type === 'n' ? 'knight' :
                                           piece.type === 'b' ? 'bishop' :
                                           piece.type === 'q' ? 'queen' :
                                           piece.type === 'k' ? 'king' : 'pawn';
                            const fallbackSpan = document.createElement('span');
                            fallbackSpan.textContent = unicodeFallback[pieceColor][pieceType];
                            fallbackSpan.className = 'text-4xl';
                            target.parentNode?.replaceChild(fallbackSpan, target);
                          }
                        }}
                      />
                    )}
                  </motion.div>
                )}

                {/* Possible move indicator */}
                {possibleMoves.includes(square) && !pieceSymbol && (
                  <div className="w-6 h-6 bg-gray-600 rounded-full opacity-50" />
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
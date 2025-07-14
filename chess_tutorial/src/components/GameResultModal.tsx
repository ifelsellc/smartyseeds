import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { startNewGame, dismissResultModal, continueFromPosition, openPositionBrowser } from '../store/gameSlice'
import { resetAI } from '../store/aiSlice'
import { Trophy, Medal, Users, RotateCcw, Eye, Crown, Zap, X, Repeat } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSoundEffects } from '../hooks/useSoundEffects'

const GameResultModal: React.FC = () => {
  const dispatch = useDispatch()
  const { status, result, gameHistory, showResultModal } = useSelector((state: RootState) => state.game)
  const { playGameEnd } = useSoundEffects()

  const handleNewGame = () => {
    dispatch(startNewGame())
    dispatch(resetAI())
  }

  const handleContinueFromPosition = (moveIndex: number) => {
    dispatch(continueFromPosition(moveIndex))
    dispatch(resetAI())
  }

  const handleOpenPositionBrowser = () => {
    dispatch(openPositionBrowser())
  }

  const handleClose = () => {
    dispatch(dismissResultModal())
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const getResultIcon = (result: string) => {
    if (result.includes('Checkmate')) {
      if (result.includes('White wins')) {
        return <Crown className="w-16 h-16 text-yellow-500" />
      } else {
        return <Crown className="w-16 h-16 text-gray-700" />
      }
    } else if (result.includes('Draw') || result.includes('Stalemate')) {
      return <Users className="w-16 h-16 text-blue-500" />
    }
    return <Trophy className="w-16 h-16 text-purple-500" />
  }

  const getResultColor = (result: string) => {
    if (result.includes('Checkmate')) {
      if (result.includes('White wins')) {
        return 'from-yellow-400 to-yellow-600'
      } else {
        return 'from-gray-500 to-gray-700'
      }
    } else if (result.includes('Draw') || result.includes('Stalemate')) {
      return 'from-blue-400 to-blue-600'
    }
    return 'from-purple-400 to-purple-600'
  }

  const getResultMessage = (result: string) => {
    if (result.includes('Checkmate')) {
      if (result.includes('White wins')) {
        return {
          title: 'Victory!',
          subtitle: 'You won by checkmate!',
          emoji: '🎉',
          explanation: 'Checkmate occurs when the king is in check and has no legal moves to escape capture.'
        }
      } else {
        return {
          title: 'Defeat',
          subtitle: 'AI won by checkmate',
          emoji: '🤖',
          explanation: 'Checkmate occurs when the king is in check and has no legal moves to escape capture.'
        }
      }
    } else if (result.includes('Stalemate')) {
      return {
        title: 'Stalemate Draw',
        subtitle: 'No legal moves available',
        emoji: '🤝',
        explanation: 'Stalemate happens when a player has no legal moves but their king is not in check. This automatically results in a draw, not a loss!'
      }
    } else if (result.includes('insufficient material')) {
      return {
        title: 'Draw by Insufficient Material',
        subtitle: 'Not enough pieces to checkmate',
        emoji: '🤝',
        explanation: 'Neither player has enough pieces left to deliver checkmate. Examples: King vs King, King + Bishop vs King, King + Knight vs King.'
      }
    } else if (result.includes('threefold repetition')) {
      return {
        title: 'Draw by Repetition',
        subtitle: 'Same position occurred 3 times',
        emoji: '🤝',
        explanation: 'When the exact same position occurs three times in a game, it automatically results in a draw. This prevents endless repetition.'
      }
    } else if (result.includes('Draw')) {
      return {
        title: 'Draw',
        subtitle: 'Game ended in a draw',
        emoji: '🤝',
        explanation: 'The game ended in a draw due to chess rules. This could be the 50-move rule (50 moves without a pawn move or capture) or other draw conditions.'
      }
    }
    return {
      title: 'Game Over',
      subtitle: result,
      emoji: '🏁',
      explanation: 'The game has ended.'
    }
  }

  const resultInfo = result ? getResultMessage(result) : null

  // Play sound effect when game ends
  useEffect(() => {
    if (status === 'finished' && result) {
      setTimeout(() => {
        playGameEnd()
      }, 500) // Delay to let move sound finish
    }
  }, [status, result, playGameEnd])

  if (!showResultModal || status !== 'finished' || !result || !resultInfo) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${getResultColor(result)} rounded-xl p-6 mb-6 text-white text-center`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
              className="flex justify-center mb-4"
            >
              {getResultIcon(result)}
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-2"
            >
              {resultInfo.title} {resultInfo.emoji}
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg opacity-90"
            >
              {resultInfo.subtitle}
            </motion.p>
          </div>

          {/* Rule Explanation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800"
          >
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
              <Trophy className="w-4 h-4 mr-2" />
              Rule Explanation
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
              {resultInfo.explanation}
            </p>
          </motion.div>

          {/* Game Statistics */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6"
          >
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Game Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {gameHistory.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Total Moves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.floor(gameHistory.length / 2) + 1}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Move Number</div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Review Game
              </button>
              
              <button
                onClick={handleNewGame}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                New Game
              </button>
            </div>

            {/* Position Management */}
            {gameHistory.length > 0 && (
              <div className="border-t pt-3">
                <p className="text-sm text-gray-600 mb-2">Position Management:</p>
                
                {/* Position Browser */}
                <button
                  onClick={handleOpenPositionBrowser}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm mb-2"
                >
                  <Eye className="w-3 h-3" />
                  Browse & Select Position
                </button>
                
                {/* Quick Continue Options */}
                <p className="text-xs text-gray-500 mb-2">Quick continue options:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleContinueFromPosition(-1)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <Repeat className="w-3 h-3" />
                    From Start
                  </button>
                  
                  {gameHistory.length > 5 && (
                    <button
                      onClick={() => handleContinueFromPosition(Math.floor(gameHistory.length / 2))}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <Repeat className="w-3 h-3" />
                      From Middle
                    </button>
                  )}
                  
                  {gameHistory.length > 2 && (
                    <button
                      onClick={() => handleContinueFromPosition(gameHistory.length - 3)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <Repeat className="w-3 h-3" />
                      From End
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Celebration particles for wins */}
          {result.includes('White wins') && (
            <motion.div 
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{ 
                    x: '50%', 
                    y: '50%', 
                    scale: 0 
                  }}
                  animate={{ 
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    scale: [0, 1, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default GameResultModal 
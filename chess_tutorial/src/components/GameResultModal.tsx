import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { startNewGame } from '../store/gameSlice'
import { resetAI } from '../store/aiSlice'
import { Trophy, Medal, Users, RotateCcw, Eye, Crown, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSoundEffects } from '../hooks/useSoundEffects'

const GameResultModal: React.FC = () => {
  const dispatch = useDispatch()
  const { status, result, gameHistory } = useSelector((state: RootState) => state.game)
  const { playGameEnd } = useSoundEffects()

  const handleNewGame = () => {
    dispatch(startNewGame())
    dispatch(resetAI())
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
          emoji: '🎉'
        }
      } else {
        return {
          title: 'Defeat',
          subtitle: 'AI won by checkmate',
          emoji: '🤖'
        }
      }
    } else if (result.includes('Stalemate')) {
      return {
        title: 'Stalemate',
        subtitle: 'No legal moves available',
        emoji: '🤝'
      }
    } else if (result.includes('Draw')) {
      return {
        title: 'Draw',
        subtitle: 'Game ended in a draw',
        emoji: '🤝'
      }
    }
    return {
      title: 'Game Over',
      subtitle: result,
      emoji: '🏁'
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

  if (status !== 'finished' || !result || !resultInfo) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
        >
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

          {/* Game Statistics */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
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
            className="flex gap-3"
          >
            <button
              onClick={handleNewGame}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              New Game
            </button>
            
            <button
              onClick={() => {/* Could implement game analysis */}}
              className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Eye className="w-4 h-4" />
            </button>
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
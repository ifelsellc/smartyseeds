import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import ChessBoard from './components/ChessBoard'
import GameControls from './components/GameControls'
import MoveList from './components/MoveList'
import DifficultySelector from './components/DifficultySelector'
import ThemeToggle from './components/ThemeToggle'
import HintPanel from './components/HintPanel'
import GameStatus from './components/GameStatus'
import GameResultModal from './components/GameResultModal'
import ChessSetSelector from './components/ChessSetSelector'
import ChessSetButton from './components/ChessSetButton'
import PuzzleMode from './components/PuzzleMode'
import { ThemeProvider } from './contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Gamepad2, Users, BookOpen } from 'lucide-react'

type AppMode = 'menu' | 'game' | 'puzzle'

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('menu')
  const gameStatus = useSelector((state: RootState) => state.game.status)
  
  const MainMenu = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Header */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mb-12"
        >
          <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            🏰 Chess Tutorial 🏰
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Learn chess step by step - Perfect for beginners!
          </p>
          <div className="flex justify-center items-center gap-3">
            <ChessSetButton />
            <ThemeToggle />
          </div>
        </motion.div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentMode('game')}
            className="cursor-pointer bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Play Game</h2>
            <p className="text-blue-100 mb-4">
              Play against AI with different difficulty levels. Perfect for practicing your skills!
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-blue-100">
              <Users className="w-4 h-4" />
              <span>AI Opponents</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentMode('puzzle')}
            className="cursor-pointer bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Solve Puzzles</h2>
            <p className="text-purple-100 mb-4">
              Train your tactical skills with chess puzzles. Learn patterns and improve your game!
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-purple-100">
              <BookOpen className="w-4 h-4" />
              <span>15 Puzzles Available</span>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="mt-16 text-gray-600 dark:text-gray-400"
        >
          <h3 className="text-lg font-semibold mb-4">What you'll learn:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>✓ Basic chess rules and moves</div>
            <div>✓ Tactical patterns (forks, pins, skewers)</div>
            <div>✓ Strategic thinking</div>
            <div>✓ Endgame techniques</div>
            <div>✓ Opening principles</div>
            <div>✓ Pattern recognition</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )

  const GameMode = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen p-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentMode('menu')}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                ← Back to Menu
              </motion.button>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  🏰 Chess Game 🏰
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Play against AI - Choose your difficulty level
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ChessSetButton />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Game Status & Difficulty */}
          <div className="lg:col-span-1 space-y-4">
            <GameStatus />
            <DifficultySelector />
            <HintPanel />
          </div>

          {/* Center - Chess Board */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="w-fit">
              <ChessBoard />
              <GameControls />
            </div>
          </div>

          {/* Right Panel - Move History */}
          <div className="lg:col-span-1">
            <MoveList />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400">
          <p>Made with ❤️ for young chess masters</p>
        </footer>
      </div>
      
      {/* Game Result Modal */}
      <GameResultModal />
    </motion.div>
  )
  
  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <AnimatePresence mode="wait">
          {currentMode === 'menu' && <MainMenu key="menu" />}
          {currentMode === 'game' && <GameMode key="game" />}
          {currentMode === 'puzzle' && (
            <PuzzleMode key="puzzle" onBack={() => setCurrentMode('menu')} />
          )}
        </AnimatePresence>
        
        {/* Chess Set Selector Modal - Available in all modes */}
        <ChessSetSelector />
      </div>
    </ThemeProvider>
  )
}

export default App 
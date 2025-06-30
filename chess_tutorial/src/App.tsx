import React from 'react'
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
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const gameStatus = useSelector((state: RootState) => state.game.status)
  
  return (
    <ThemeProvider>
      <div className="min-h-screen p-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              🏰 Chess Tutorial 🏰
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Learn chess step by step - Perfect for beginners!
            </p>
            <div className="flex justify-center mt-4">
              <ThemeToggle />
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
              <div className="w-full max-w-lg">
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
      </div>
    </ThemeProvider>
  )
}

export default App 
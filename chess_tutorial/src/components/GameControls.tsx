import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { startNewGame, undoMove, pauseGame, resumeGame, jumpToMove, replayFromPosition, openPositionBrowser } from '../store/gameSlice'
import { resetAI } from '../store/aiSlice'
import { Play, Pause, RotateCcw, RefreshCw, SkipBack, SkipForward, Repeat } from 'lucide-react'

const GameControls: React.FC = () => {
  const dispatch = useDispatch()
  const [isReplaying, setIsReplaying] = useState(false)
  const [replaySpeed, setReplaySpeed] = useState(1000) // milliseconds between moves
  
  const { status, gameHistory, currentMoveIndex } = useSelector((state: RootState) => state.game)
  const { thinking } = useSelector((state: RootState) => state.ai)

  const handleNewGame = () => {
    dispatch(startNewGame())
    dispatch(resetAI())
    setIsReplaying(false)
  }

  const handlePauseResume = () => {
    if (status === 'playing') {
      dispatch(pauseGame())
    } else if (status === 'paused') {
      dispatch(resumeGame())
    }
  }

  const handleUndo = () => {
    if (currentMoveIndex >= 0) {
      // Auto-pause the game before undoing
      if (status === 'playing') {
        dispatch(pauseGame())
      }
      dispatch(undoMove())
    }
  }

  const handleReplay = async () => {
    if (gameHistory.length === 0) return
    
    setIsReplaying(true)
    
    // Start from the beginning
    dispatch(jumpToMove(-1))
    
    // Replay each move with delay
    for (let i = 0; i < gameHistory.length; i++) {
      await new Promise(resolve => setTimeout(resolve, replaySpeed))
      if (!isReplaying) break // Allow cancellation
      dispatch(jumpToMove(i))
    }
    
    setIsReplaying(false)
  }

  const stopReplay = () => {
    setIsReplaying(false)
  }

  const handleStepBack = () => {
    if (currentMoveIndex > -1) {
      // Auto-pause the game before stepping back
      if (status === 'playing') {
        dispatch(pauseGame())
      }
      dispatch(jumpToMove(currentMoveIndex - 1))
    }
  }

  const handleStepForward = () => {
    if (currentMoveIndex < gameHistory.length - 1) {
      dispatch(jumpToMove(currentMoveIndex + 1))
    }
  }

  const handleReplayFromHere = () => {
    dispatch(replayFromPosition(currentMoveIndex))
    dispatch(resetAI())
  }

  const handleOpenPositionBrowser = () => {
    dispatch(openPositionBrowser())
  }

  const canUndo = currentMoveIndex >= 0 && status !== 'finished' && !thinking
  const canStepBack = currentMoveIndex > -1
  const canStepForward = currentMoveIndex < gameHistory.length - 1

  return (
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Game Controls
      </h3>
      
      {/* Main Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handleNewGame}
          className="control-button"
          disabled={thinking}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          New Game
        </button>
        
        <button
          onClick={handlePauseResume}
          className="control-button"
          disabled={status === 'idle' || status === 'finished' || thinking}
        >
          {status === 'playing' ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Resume
            </>
          )}
        </button>
        
        <button
          onClick={handleUndo}
          className="control-button"
          disabled={!canUndo}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Undo
        </button>
      </div>

      {/* Move Navigation */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleStepBack}
          className="control-button"
          disabled={!canStepBack || thinking}
        >
          <SkipBack className="w-4 h-4 mr-2" />
          Step Back
        </button>
        
        <button
          onClick={handleStepForward}
          className="control-button"
          disabled={!canStepForward || thinking}
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Step Forward
        </button>
      </div>

      {/* Position Browser & Replay */}
      {gameHistory.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Position Management
          </h4>
          <div className="space-y-2">
            <button
              onClick={handleOpenPositionBrowser}
              className="control-button bg-blue-600 hover:bg-blue-700 w-full"
              disabled={thinking}
            >
              <Repeat className="w-4 h-4 mr-2" />
              Browse & Replay Positions
            </button>
            
            {(status === 'finished' || status === 'paused') && (
              <button
                onClick={handleReplayFromHere}
                className="control-button bg-purple-600 hover:bg-purple-700 w-full"
                disabled={thinking}
              >
                <Repeat className="w-4 h-4 mr-2" />
                Quick Replay from Move {currentMoveIndex + 1}
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Browse positions, save scenarios, and practice different moves
          </p>
        </div>
      )}

      {/* Replay Controls */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Replay Game
        </h4>
        
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Speed:
          </label>
          <select
            value={replaySpeed}
            onChange={(e) => setReplaySpeed(Number(e.target.value))}
            className="px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value={500}>Fast (0.5s)</option>
            <option value={1000}>Normal (1s)</option>
            <option value={2000}>Slow (2s)</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          {!isReplaying ? (
            <button
              onClick={handleReplay}
              className="control-button text-sm"
              disabled={gameHistory.length === 0 || thinking}
            >
              <Play className="w-3 h-3 mr-1" />
              Replay
            </button>
          ) : (
            <button
              onClick={stopReplay}
              className="control-button bg-red-600 hover:bg-red-700 text-sm"
            >
              <Pause className="w-3 h-3 mr-1" />
              Stop Replay
            </button>
          )}
        </div>
      </div>
      
      {/* Game Status */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Move: {currentMoveIndex + 1} / {gameHistory.length}
        {status === 'paused' && <span className="ml-2 text-yellow-600">⏸ Paused</span>}
        {thinking && <span className="ml-2 text-blue-600">🤔 AI Thinking</span>}
      </div>
    </div>
  )
}

export default GameControls 
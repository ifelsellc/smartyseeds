import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { jumpToMove, replayFromPosition, openPositionBrowser, previewPosition } from '../store/gameSlice'
import { resetAI } from '../store/aiSlice'

const MoveList: React.FC = () => {
  const dispatch = useDispatch()
  const { gameHistory, currentMoveIndex, status } = useSelector((state: RootState) => state.game)

  const handleMoveClick = (moveIndex: number) => {
    dispatch(jumpToMove(moveIndex))
  }

  const handleReplayFromMove = (moveIndex: number) => {
    dispatch(replayFromPosition(moveIndex))
    dispatch(resetAI())
  }

  const handleOpenPositionBrowser = () => {
    dispatch(openPositionBrowser())
  }

  const formatMoveNumber = (index: number): string => {
    return Math.floor(index / 2) + 1 + '.'
  }

  const isWhiteMove = (index: number): boolean => {
    return index % 2 === 0
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-fit">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Move History
        </h3>
        {gameHistory.length > 0 && (
          <button
            onClick={handleOpenPositionBrowser}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
          >
            Browse
          </button>
        )}
      </div>
      
      {gameHistory.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No moves yet. Start playing!
        </p>
      ) : (
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {/* Starting position */}
          <div
            className={`flex items-center px-2 py-1 rounded cursor-pointer text-sm ${
              currentMoveIndex === -1 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleMoveClick(-1)}
          >
            <span className="text-gray-600 dark:text-gray-400 flex-1">Start</span>
            {(status === 'finished' || status === 'paused') && currentMoveIndex === -1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleReplayFromMove(-1)
                }}
                className="ml-2 bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 rounded transition-colors"
              >
                Replay
              </button>
            )}
          </div>
          
          {/* Move pairs */}
          {Array.from({ length: Math.ceil(gameHistory.length / 2) }).map((_, pairIndex) => {
            const whiteIndex = pairIndex * 2
            const blackIndex = pairIndex * 2 + 1
            const whiteMove = gameHistory[whiteIndex]
            const blackMove = gameHistory[blackIndex]

            return (
              <div key={pairIndex} className="flex items-center gap-1 text-sm">
                {/* Move number */}
                <span className="text-gray-500 dark:text-gray-400 w-8 text-right font-mono">
                  {pairIndex + 1}.
                </span>
                
                {/* White move */}
                <button
                  className={`px-2 py-1 rounded cursor-pointer flex-1 text-left ${
                    currentMoveIndex === whiteIndex
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => handleMoveClick(whiteIndex)}
                >
                  {whiteMove.san}
                </button>
                
                {/* Black move */}
                {blackMove && (
                  <button
                    className={`px-2 py-1 rounded cursor-pointer flex-1 text-left ${
                      currentMoveIndex === blackIndex
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                    onClick={() => handleMoveClick(blackIndex)}
                  >
                    {blackMove.san}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
      
      {/* Move details for current position */}
      {currentMoveIndex >= 0 && gameHistory[currentMoveIndex] && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Move Details
          </h4>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div>
              <span className="font-medium">Move:</span> {gameHistory[currentMoveIndex].san}
            </div>
            <div>
              <span className="font-medium">Turn:</span> {currentMoveIndex + 1}
            </div>
            <div>
              <span className="font-medium">Time:</span>{' '}
              {new Date(gameHistory[currentMoveIndex].timestamp).toLocaleTimeString()}
            </div>
          </div>
          
          {/* Replay from this position button */}
          {(status === 'finished' || status === 'paused') && (
            <button
              onClick={() => handleReplayFromMove(currentMoveIndex)}
              className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Replay from Move {currentMoveIndex + 1}
            </button>
          )}
        </div>
      )}
      
      {/* Statistics */}
      {gameHistory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Game Stats
          </h4>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div>Total moves: {gameHistory.length}</div>
            <div>
              Viewing: Move {currentMoveIndex + 1} of {gameHistory.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MoveList 
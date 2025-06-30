import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { jumpToMove } from '../store/gameSlice'

const MoveList: React.FC = () => {
  const dispatch = useDispatch()
  const { gameHistory, currentMoveIndex } = useSelector((state: RootState) => state.game)

  const handleMoveClick = (moveIndex: number) => {
    dispatch(jumpToMove(moveIndex))
  }

  const formatMoveNumber = (index: number): string => {
    return Math.floor(index / 2) + 1 + '.'
  }

  const isWhiteMove = (index: number): boolean => {
    return index % 2 === 0
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-fit">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Move History
      </h3>
      
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
            <span className="text-gray-600 dark:text-gray-400">Start</span>
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
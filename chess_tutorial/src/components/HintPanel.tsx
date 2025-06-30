import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { enableHints, disableHints, setCurrentHint } from '../store/gameSlice'
import { Lightbulb, Eye, EyeOff, Target, AlertCircle } from 'lucide-react'

const HintPanel: React.FC = () => {
  const dispatch = useDispatch()
  const { hints, status, isPlayerTurn } = useSelector((state: RootState) => state.game)
  const { difficulty } = useSelector((state: RootState) => state.ai)

  const handleToggleHints = () => {
    if (hints.enabled) {
      dispatch(disableHints())
    } else {
      dispatch(enableHints())
    }
  }

  const getDifficultyBasedTips = (): string[] => {
    const basicTips = [
      "Control the center with your pawns and pieces",
      "Develop your knights before bishops",
      "Castle early to keep your king safe",
      "Don't move the same piece twice in the opening"
    ]

    const intermediateTips = [
      "Look for tactical patterns like forks and pins",
      "Consider your opponent's threats before making your move",
      "Trade pieces when you're ahead in material",
      "Activate your rooks by placing them on open files"
    ]

    const advancedTips = [
      "Think about pawn structure and long-term plans",
      "Consider sacrifices for positional advantage",
      "Use your pieces to support each other",
      "Control key squares in the position"
    ]

    switch (difficulty) {
      case 'beginner':
      case 'novice':
        return basicTips
      case 'intermediate':
        return [...basicTips, ...intermediateTips].slice(0, 6)
      case 'advanced':
      case 'expert':
        return [...basicTips, ...intermediateTips, ...advancedTips].slice(0, 8)
      default:
        return basicTips
    }
  }

  const getPatternExplanation = (patternType: string): string => {
    const explanations = {
      fork: "A fork attacks two pieces at once, forcing your opponent to lose material!",
      pin: "A pin prevents a piece from moving because it would expose a more valuable piece behind it.",
      'discovered-attack': "A discovered attack happens when moving one piece reveals an attack from another piece."
    }
    return explanations[patternType as keyof typeof explanations] || ""
  }

  const hasActivePatterns = hints.enabled && (
    hints.candidateMoves.length > 0 || 
    Object.values(useSelector((state: RootState) => state.game.patterns)).some(pattern => pattern.length > 0)
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Learning Assistant
        </h3>
        
        <button
          onClick={handleToggleHints}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            hints.enabled 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}
          disabled={status !== 'playing' || !isPlayerTurn}
        >
          {hints.enabled ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Hints Status */}
      <div className="mb-4">
        {hints.enabled ? (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <Lightbulb className="w-4 h-4 mr-2" />
            <span className="text-sm">Hints are enabled</span>
          </div>
        ) : (
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Lightbulb className="w-4 h-4 mr-2 opacity-50" />
            <span className="text-sm">Click the eye to enable hints</span>
          </div>
        )}
      </div>

      {/* Current Hint */}
      {hints.enabled && hints.currentHint && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start">
            <Target className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {hints.currentHint}
            </p>
          </div>
        </div>
      )}

      {/* Candidate Moves */}
      {hints.enabled && hints.candidateMoves.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Good Move Options
          </h4>
          <div className="space-y-1">
            {hints.candidateMoves.slice(0, 3).map((move, index) => (
              <div 
                key={move}
                className="text-xs bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-2 py-1 rounded"
              >
                {index + 1}. Consider moves around {move}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pattern Recognition */}
      {hints.enabled && hasActivePatterns && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            Tactical Patterns
          </h4>
          
          {Object.entries(useSelector((state: RootState) => state.game.patterns)).map(([pattern, squares]) => (
            squares.length > 0 && (
              <div key={pattern} className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-400">
                <div className="text-xs font-medium text-red-800 dark:text-red-200 capitalize mb-1">
                  {pattern.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-xs text-red-600 dark:text-red-300">
                  {getPatternExplanation(pattern)}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* General Tips */}
      <div>
        <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Chess Tips for {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
        </h4>
        
        <div className="space-y-2">
          {getDifficultyBasedTips().slice(0, 4).map((tip, index) => (
            <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 mt-1.5 flex-shrink-0" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hint Controls */}
      {hints.enabled && status === 'playing' && isPlayerTurn && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={() => dispatch(setCurrentHint("Think about what your opponent is threatening and how to improve your position."))}
            className="w-full text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            💡 Get a General Hint
          </button>
        </div>
      )}

      {/* Disabled State Message */}
      {(!hints.enabled || status !== 'playing') && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          {status !== 'playing' 
            ? "Start a game to use learning features" 
            : "Enable hints to see move suggestions and tips"
          }
        </div>
      )}
    </div>
  )
}

export default HintPanel 
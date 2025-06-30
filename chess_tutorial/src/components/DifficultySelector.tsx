import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { setDifficulty, DifficultyLevel } from '../store/aiSlice'
import { startNewGame } from '../store/gameSlice'
import { Brain, Zap, Star, Crown, Trophy } from 'lucide-react'

const DIFFICULTY_ICONS = {
  beginner: Brain,
  novice: Zap,
  intermediate: Star,
  advanced: Crown,
  expert: Trophy
}

const DIFFICULTY_COLORS = {
  beginner: 'text-green-600',
  novice: 'text-blue-600',
  intermediate: 'text-yellow-600',
  advanced: 'text-orange-600',
  expert: 'text-red-600'
}

const DifficultySelector: React.FC = () => {
  const dispatch = useDispatch()
  const { difficulty, settings, isEnabled } = useSelector((state: RootState) => state.ai)
  const { status } = useSelector((state: RootState) => state.game)

  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    dispatch(setDifficulty(newDifficulty))
    
    // Start a new game with the new difficulty if currently playing
    if (status === 'playing') {
      dispatch(startNewGame())
    }
  }

  const getDifficultyStars = (level: DifficultyLevel): number => {
    const starCount = {
      beginner: 1,
      novice: 2,
      intermediate: 3,
      advanced: 4,
      expert: 5
    }
    return starCount[level] || 1
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        AI Difficulty
      </h3>
      
      <div className="space-y-2">
        {Object.entries(settings).map(([level, config]) => {
          const difficultyLevel = level as DifficultyLevel
          const IconComponent = DIFFICULTY_ICONS[difficultyLevel]
          const isSelected = difficulty === difficultyLevel
          const stars = getDifficultyStars(difficultyLevel)
          
          return (
            <button
              key={level}
              onClick={() => handleDifficultyChange(difficultyLevel)}
              disabled={!isEnabled || status === 'playing'}
              className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${
                !isEnabled || status === 'playing' 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <IconComponent 
                    className={`w-5 h-5 mr-2 ${DIFFICULTY_COLORS[difficultyLevel]}`} 
                  />
                  <span className="font-medium capitalize">
                    {level}
                  </span>
                </div>
                
                {/* Difficulty stars */}
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`w-3 h-3 ${
                        index < stars 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {config.description}
              </p>
              
              <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                <div>Search Depth: {config.depth}</div>
                <div>Think Time: {config.moveTime / 1000}s</div>
                <div>Skill Level: {config.skillLevel}/20</div>
              </div>
            </button>
          )
        })}
      </div>
      
      {/* Current difficulty info */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center mb-2">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isEnabled ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Current: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>
        
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {settings[difficulty].description}
        </p>
        
        {status === 'playing' && (
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
            💡 Start a new game to change difficulty
          </p>
        )}
      </div>
    </div>
  )
}

export default DifficultySelector 
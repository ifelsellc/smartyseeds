import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { 
  requestHint, 
  showSolution, 
  nextPuzzle, 
  resetPuzzle, 
  showPuzzleSelector,
  clearProgress 
} from '../store/puzzleSlice';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Eye, 
  RotateCcw, 
  SkipForward, 
  Target, 
  Trash2,
  Trophy,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';

const PuzzleControls: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    currentPuzzle, 
    status, 
    hintsUsed, 
    attempts,
    totalSolved,
    currentStreak,
    bestStreak,
    startTime
  } = useSelector((state: RootState) => state.puzzle);

  const handleHint = () => {
    dispatch(requestHint());
  };

  const handleShowSolution = () => {
    dispatch(showSolution());
  };

  const handleReset = () => {
    dispatch(resetPuzzle());
  };

  const handleNextPuzzle = () => {
    dispatch(nextPuzzle());
  };

  const handleShowSelector = () => {
    dispatch(showPuzzleSelector());
  };

  const handleClearProgress = () => {
    if (window.confirm('Are you sure you want to clear all puzzle progress? This cannot be undone.')) {
      dispatch(clearProgress());
    }
  };

  const getElapsedTime = (): string => {
    if (!startTime) return '0s';
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    if (elapsed < 60) return `${elapsed}s`;
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (status) {
      case 'solved': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'hint': return 'text-blue-600';
      case 'solution-shown': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  if (!currentPuzzle) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="text-center">
          <Target className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 mb-4">No puzzle loaded</p>
          <button
            onClick={handleShowSelector}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Select Puzzle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Puzzle Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Puzzle Status
        </h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">Time:</span>
            <span className={`ml-2 font-medium ${getStatusColor()}`}>
              {getElapsedTime()}
            </span>
          </div>
          
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">Attempts:</span>
            <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
              {attempts.length}
            </span>
          </div>
          
          <div className="flex items-center">
            <Lightbulb className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">Hints:</span>
            <span className="ml-2 font-medium text-yellow-600">
              {hintsUsed}
            </span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              status === 'solved' ? 'bg-green-500' :
              status === 'failed' ? 'bg-red-500' :
              status === 'solving' ? 'bg-blue-500' :
              status === 'solution-shown' ? 'bg-purple-500' :
              'bg-gray-400'
            }`} />
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className={`ml-2 font-medium capitalize ${getStatusColor()}`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Puzzle Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Controls
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleHint}
            disabled={status !== 'solving'}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            <span className="hidden sm:inline">Hint</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShowSolution}
            disabled={status === 'solved' || status === 'solution-shown'}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Solution</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNextPuzzle}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
            <span className="hidden sm:inline">Next</span>
          </motion.button>
        </div>

        <div className="mt-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShowSelector}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Target className="w-4 h-4" />
            Browse Puzzles
          </motion.button>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Statistics
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-400">Solved:</span>
            </div>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {totalSolved}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-orange-500" />
              <span className="text-gray-600 dark:text-gray-400">Current Streak:</span>
            </div>
            <span className="font-medium text-orange-600">
              {currentStreak}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400">Best Streak:</span>
            </div>
            <span className="font-medium text-green-600">
              {bestStreak}
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Advanced
        </h3>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClearProgress}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear All Progress
        </motion.button>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          This will reset all puzzle statistics and progress
        </p>
      </div>
    </div>
  );
};

export default PuzzleControls; 
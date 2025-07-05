import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { loadRandomPuzzle } from '../store/puzzleSlice';
import PuzzleBoard from './PuzzleBoard';
import PuzzleControls from './PuzzleControls';
import PuzzleSelector from './PuzzleSelector';
import { motion } from 'framer-motion';
import { Target, ArrowLeft } from 'lucide-react';

interface PuzzleModeProps {
  onBack?: () => void;
}

const PuzzleMode: React.FC<PuzzleModeProps> = ({ onBack }) => {
  const dispatch = useDispatch();
  const { currentPuzzle } = useSelector((state: RootState) => state.puzzle);

  // Load a random puzzle when component mounts if none is loaded
  useEffect(() => {
    if (!currentPuzzle) {
      dispatch(loadRandomPuzzle());
    }
  }, [currentPuzzle, dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            {onBack && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
            )}
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  Chess Puzzle Training
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Sharpen your tactical skills with interactive puzzles
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Puzzle Board - Takes up 3 columns on large screens */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
            >
              <PuzzleBoard size={Math.min(640, window.innerWidth - 100)} />
            </motion.div>
          </div>

          {/* Controls Panel - Takes up 1 column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <PuzzleControls />
            </motion.div>
          </div>
        </div>

        {/* Instructions for beginners */}
        {currentPuzzle && currentPuzzle.difficulty === 'beginner' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              💡 How to Solve Puzzles
            </h3>
            <div className="text-blue-700 dark:text-blue-300 space-y-2 text-sm">
              <p>• <strong>Read the description:</strong> It gives you a hint about what to look for</p>
              <p>• <strong>Click to move:</strong> Select a piece, then click where you want to move it</p>
              <p>• <strong>Use hints sparingly:</strong> Try to solve it yourself first for better learning</p>
              <p>• <strong>Study solutions:</strong> When you see the solution, understand why each move works</p>
              <p>• <strong>Practice regularly:</strong> Solving puzzles daily improves your pattern recognition</p>
            </div>
          </motion.div>
        )}

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>
            Keep solving puzzles to improve your chess tactics and pattern recognition!
          </p>
        </motion.div>
      </div>

      {/* Puzzle Selector Modal */}
      <PuzzleSelector />
    </motion.div>
  );
};

export default PuzzleMode; 
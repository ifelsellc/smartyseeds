import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { 
  loadPuzzle, 
  loadRandomPuzzle, 
  setDifficultyFilter, 
  setCategoryFilter, 
  hidePuzzleSelector,
  toggleRandomMode 
} from '../store/puzzleSlice';
import { chessPuzzles, getPuzzlesByDifficulty, getPuzzlesByCategory, ChessPuzzle } from '../data/puzzles';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Target, 
  Trophy, 
  Zap, 
  Crown, 
  Shuffle, 
  List,
  CheckCircle,
  Clock,
  Star,
  Sword,
  Shield,
  Eye,
  Brain,
  BookOpen,
  Crosshair
} from 'lucide-react';

const DIFFICULTY_ICONS = {
  beginner: Target,
  intermediate: Zap,
  advanced: Crown,
  expert: Trophy
};

const DIFFICULTY_COLORS = {
  beginner: 'text-green-600 bg-green-50 border-green-200',
  intermediate: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  advanced: 'text-orange-600 bg-orange-50 border-orange-200',
  expert: 'text-red-600 bg-red-50 border-red-200'
};

const CATEGORY_ICONS = {
  checkmate: Trophy,
  tactics: Sword,
  endgame: Crown,
  opening: BookOpen,
  fork: Crosshair,
  pin: Target,
  skewer: Eye,
  discovery: Brain
};

const CATEGORY_COLORS = {
  checkmate: 'text-purple-600 bg-purple-50 border-purple-200',
  tactics: 'text-red-600 bg-red-50 border-red-200',
  endgame: 'text-blue-600 bg-blue-50 border-blue-200',
  opening: 'text-green-600 bg-green-50 border-green-200',
  fork: 'text-orange-600 bg-orange-50 border-orange-200',
  pin: 'text-pink-600 bg-pink-50 border-pink-200',
  skewer: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  discovery: 'text-teal-600 bg-teal-50 border-teal-200'
};

const PuzzleSelector: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    showPuzzleSelector, 
    selectedDifficulty, 
    selectedCategory,
    isRandomMode,
    solvedPuzzles,
    puzzleProgress
  } = useSelector((state: RootState) => state.puzzle);

  const handleClose = () => {
    dispatch(hidePuzzleSelector());
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handlePuzzleSelect = (puzzleId: number) => {
    dispatch(loadPuzzle(puzzleId));
    handleClose();
  };

  const handleRandomPuzzle = () => {
    const difficulty = selectedDifficulty === 'all' ? undefined : selectedDifficulty;
    dispatch(loadRandomPuzzle(difficulty));
    handleClose();
  };

  const handleDifficultyFilter = (difficulty: ChessPuzzle['difficulty'] | 'all') => {
    dispatch(setDifficultyFilter(difficulty));
  };

  const handleCategoryFilter = (category: ChessPuzzle['category'] | 'all') => {
    dispatch(setCategoryFilter(category));
  };

  const getFilteredPuzzles = (): ChessPuzzle[] => {
    let filtered = chessPuzzles;

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(p => p.difficulty === selectedDifficulty);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    return filtered.sort((a, b) => a.rating - b.rating);
  };

  const PuzzleCard: React.FC<{ puzzle: ChessPuzzle }> = ({ puzzle }) => {
    const isSolved = solvedPuzzles.includes(puzzle.id);
    const progress = puzzleProgress[puzzle.id];

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          cursor-pointer rounded-lg border p-4 transition-all duration-200
          ${isSolved 
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
          }
        `}
        onClick={() => handlePuzzleSelect(puzzle.id)}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${DIFFICULTY_COLORS[puzzle.difficulty]}`}>
              {React.createElement(DIFFICULTY_ICONS[puzzle.difficulty], { className: 'w-3 h-3' })}
              {puzzle.difficulty.charAt(0).toUpperCase() + puzzle.difficulty.slice(1)}
            </div>
            {isSolved && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </div>
          <div className="text-xs text-gray-500">#{puzzle.id}</div>
        </div>

        {/* Title and Category */}
        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
          {puzzle.title}
        </h3>

        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border mb-2 ${CATEGORY_COLORS[puzzle.category]}`}>
          {React.createElement(CATEGORY_ICONS[puzzle.category], { className: 'w-3 h-3' })}
          {puzzle.category.charAt(0).toUpperCase() + puzzle.category.slice(1)}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {puzzle.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Star className="w-3 h-3 mr-1" />
              {puzzle.rating}
            </div>
            <div className="flex items-center">
              <Target className="w-3 h-3 mr-1" />
              {puzzle.moves} move{puzzle.moves > 1 ? 's' : ''}
            </div>
          </div>
          
          {progress && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {Math.round(progress.timeSpent / 1000)}s
              </div>
              {progress.hintsUsed > 0 && (
                <div className="text-yellow-600">
                  {progress.hintsUsed} hint{progress.hintsUsed > 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  if (!showPuzzleSelector) {
    return null;
  }

  const filteredPuzzles = getFilteredPuzzles();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-6xl w-full max-h-[80vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Chess Puzzles
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredPuzzles.length} puzzle{filteredPuzzles.length !== 1 ? 's' : ''} found • {solvedPuzzles.length} solved
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={handleRandomPuzzle}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              Random Puzzle
            </button>
            
            <button
              onClick={() => dispatch(toggleRandomMode())}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isRandomMode 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {isRandomMode ? <Shuffle className="w-4 h-4" /> : <List className="w-4 h-4" />}
              {isRandomMode ? 'Random Mode' : 'Sequential Mode'}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Difficulty Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => handleDifficultyFilter(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <option value="all">All</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <option value="all">All</option>
                <option value="checkmate">Checkmate</option>
                <option value="tactics">Tactics</option>
                <option value="fork">Fork</option>
                <option value="pin">Pin</option>
                <option value="skewer">Skewer</option>
                <option value="discovery">Discovery</option>
                <option value="endgame">Endgame</option>
                <option value="opening">Opening</option>
              </select>
            </div>
          </div>

          {/* Puzzles Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPuzzles.map((puzzle) => (
                <PuzzleCard key={puzzle.id} puzzle={puzzle} />
              ))}
            </div>

            {filteredPuzzles.length === 0 && (
              <div className="flex items-center justify-center h-40">
                <div className="text-center text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No puzzles found matching your filters</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PuzzleSelector; 
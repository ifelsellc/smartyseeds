import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChessPuzzle, chessPuzzles, getPuzzleById, getRandomPuzzle } from '../data/puzzles';

export type PuzzleStatus = 'loading' | 'solving' | 'solved' | 'failed' | 'hint';

export interface PuzzleAttempt {
  move: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface PuzzleProgress {
  puzzleId: number;
  attempts: number;
  solved: boolean;
  timeSpent: number; // in milliseconds
  hintsUsed: number;
  rating: number;
  completedAt?: number;
}

export interface PuzzleState {
  // Current puzzle state
  currentPuzzle: ChessPuzzle | null;
  currentMoveIndex: number; // Track progress in multi-move puzzles
  status: PuzzleStatus;
  
  // User progress
  attempts: PuzzleAttempt[];
  hintsUsed: number;
  startTime: number | null;
  
  // Feedback
  feedback: string | null;
  showSolution: boolean;
  
  // Filters and selection
  selectedDifficulty: ChessPuzzle['difficulty'] | 'all';
  selectedCategory: ChessPuzzle['category'] | 'all';
  
  // Progress tracking
  solvedPuzzles: number[];
  puzzleProgress: Record<number, PuzzleProgress>;
  
  // Statistics
  totalAttempts: number;
  totalSolved: number;
  currentStreak: number;
  bestStreak: number;
  
  // UI state
  showPuzzleSelector: boolean;
  isRandomMode: boolean;
}

const loadPuzzleProgress = (): Record<number, PuzzleProgress> => {
  try {
    const saved = localStorage.getItem('chess-puzzle-progress');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const savePuzzleProgress = (progress: Record<number, PuzzleProgress>) => {
  try {
    localStorage.setItem('chess-puzzle-progress', JSON.stringify(progress));
  } catch (error) {
    console.warn('Failed to save puzzle progress:', error);
  }
};

const loadPuzzleStats = () => {
  try {
    const saved = localStorage.getItem('chess-puzzle-stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        totalAttempts: parsed.totalAttempts || 0,
        totalSolved: parsed.totalSolved || 0,
        currentStreak: parsed.currentStreak || 0,
        bestStreak: parsed.bestStreak || 0,
        solvedPuzzles: parsed.solvedPuzzles || []
      };
    }
  } catch {
    // Fall through to defaults
  }
  
  return {
    totalAttempts: 0,
    totalSolved: 0,
    currentStreak: 0,
    bestStreak: 0,
    solvedPuzzles: []
  };
};

const savedStats = loadPuzzleStats();

const initialState: PuzzleState = {
  currentPuzzle: null,
  currentMoveIndex: 0,
  status: 'loading',
  
  attempts: [],
  hintsUsed: 0,
  startTime: null,
  
  feedback: null,
  showSolution: false,
  
  selectedDifficulty: 'all',
  selectedCategory: 'all',
  
  solvedPuzzles: savedStats.solvedPuzzles,
  puzzleProgress: loadPuzzleProgress(),
  
  totalAttempts: savedStats.totalAttempts,
  totalSolved: savedStats.totalSolved,
  currentStreak: savedStats.currentStreak,
  bestStreak: savedStats.bestStreak,
  
  showPuzzleSelector: false,
  isRandomMode: true
};

const puzzleSlice = createSlice({
  name: 'puzzle',
  initialState,
  reducers: {
    // Puzzle selection and loading
    loadPuzzle: (state, action: PayloadAction<number>) => {
      const puzzle = getPuzzleById(action.payload);
      if (puzzle) {
        state.currentPuzzle = puzzle;
        state.currentMoveIndex = 0;
        state.status = 'solving';
        state.attempts = [];
        state.hintsUsed = 0;
        state.startTime = Date.now();
        state.feedback = null;
        state.showSolution = false;
      }
    },

    loadRandomPuzzle: (state, action: PayloadAction<ChessPuzzle['difficulty'] | undefined>) => {
      const puzzle = getRandomPuzzle(action.payload);
      state.currentPuzzle = puzzle;
      state.currentMoveIndex = 0;
      state.status = 'solving';
      state.attempts = [];
      state.hintsUsed = 0;
      state.startTime = Date.now();
      state.feedback = null;
      state.showSolution = false;
    },

    // Move validation
    attemptMove: (state, action: PayloadAction<{ move: string; moveNotation: string }>) => {
      if (!state.currentPuzzle || state.status !== 'solving') return;

      const { move, moveNotation } = action.payload;
      const expectedMove = state.currentPuzzle.solution[state.currentMoveIndex];
      const isCorrect = move === expectedMove;

      // Record the attempt
      const attempt: PuzzleAttempt = {
        move: moveNotation,
        isCorrect,
        timestamp: Date.now()
      };
      state.attempts.push(attempt);
      state.totalAttempts++;

      if (isCorrect) {
        state.currentMoveIndex++;
        
        // Check if puzzle is complete
        if (state.currentMoveIndex >= state.currentPuzzle.solution.length) {
          state.status = 'solved';
          state.feedback = 'Excellent! Puzzle solved!';
          
          // Update statistics
          if (!state.solvedPuzzles.includes(state.currentPuzzle.id)) {
            state.solvedPuzzles.push(state.currentPuzzle.id);
            state.totalSolved++;
            state.currentStreak++;
            state.bestStreak = Math.max(state.bestStreak, state.currentStreak);
          }

          // Record progress
          const timeSpent = state.startTime ? Date.now() - state.startTime : 0;
          state.puzzleProgress[state.currentPuzzle.id] = {
            puzzleId: state.currentPuzzle.id,
            attempts: state.attempts.length,
            solved: true,
            timeSpent,
            hintsUsed: state.hintsUsed,
            rating: state.currentPuzzle.rating,
            completedAt: Date.now()
          };

          // Save progress
          savePuzzleProgress(state.puzzleProgress);
        } else {
          state.feedback = `Correct! ${state.currentPuzzle.solution.length - state.currentMoveIndex} more move${state.currentPuzzle.solution.length - state.currentMoveIndex > 1 ? 's' : ''} to go.`;
        }
      } else {
        state.feedback = 'Not quite right. Try again!';
        state.currentStreak = 0; // Reset streak on wrong move
        
        // Auto-fail after 3 wrong attempts
        const wrongAttempts = state.attempts.filter(a => !a.isCorrect).length;
        if (wrongAttempts >= 3) {
          state.status = 'failed';
          state.feedback = 'Puzzle failed. The solution has been revealed.';
          state.showSolution = true;
        }
      }

      // Save stats
      try {
        localStorage.setItem('chess-puzzle-stats', JSON.stringify({
          totalAttempts: state.totalAttempts,
          totalSolved: state.totalSolved,
          currentStreak: state.currentStreak,
          bestStreak: state.bestStreak,
          solvedPuzzles: state.solvedPuzzles
        }));
      } catch (error) {
        console.warn('Failed to save puzzle stats:', error);
      }
    },

    // Hints and help
    requestHint: (state) => {
      if (!state.currentPuzzle || state.status !== 'solving') return;
      
      state.hintsUsed++;
      state.status = 'hint';
      
      const nextMove = state.currentPuzzle.solutionSAN[state.currentMoveIndex];
      state.feedback = `Hint: Try ${nextMove}`;
      
      // Auto-return to solving after showing hint
      setTimeout(() => {
        if (state.status === 'hint') {
          state.status = 'solving';
        }
      }, 3000);
    },

    showSolution: (state) => {
      state.showSolution = true;
      state.status = 'failed';
      state.feedback = 'Solution revealed. Study the moves to learn!';
    },

    // Navigation
    nextPuzzle: (state) => {
      if (state.isRandomMode) {
        const puzzle = getRandomPuzzle(
          state.selectedDifficulty === 'all' ? undefined : state.selectedDifficulty
        );
        state.currentPuzzle = puzzle;
      } else {
        // Sequential mode - find next unsolved puzzle
        const currentId = state.currentPuzzle?.id || 0;
        const nextPuzzle = chessPuzzles.find(p => 
          p.id > currentId && 
          !state.solvedPuzzles.includes(p.id) &&
          (state.selectedDifficulty === 'all' || p.difficulty === state.selectedDifficulty)
        );
        
        if (nextPuzzle) {
          state.currentPuzzle = nextPuzzle;
        } else {
          // If no next puzzle, get a random one
          const puzzle = getRandomPuzzle(
            state.selectedDifficulty === 'all' ? undefined : state.selectedDifficulty
          );
          state.currentPuzzle = puzzle;
        }
      }
      
      // Reset puzzle state
      state.currentMoveIndex = 0;
      state.status = 'solving';
      state.attempts = [];
      state.hintsUsed = 0;
      state.startTime = Date.now();
      state.feedback = null;
      state.showSolution = false;
    },

    // Filters and preferences
    setDifficultyFilter: (state, action: PayloadAction<ChessPuzzle['difficulty'] | 'all'>) => {
      state.selectedDifficulty = action.payload;
    },

    setCategoryFilter: (state, action: PayloadAction<ChessPuzzle['category'] | 'all'>) => {
      state.selectedCategory = action.payload;
    },

    toggleRandomMode: (state) => {
      state.isRandomMode = !state.isRandomMode;
    },

    // UI state
    showPuzzleSelector: (state) => {
      state.showPuzzleSelector = true;
    },

    hidePuzzleSelector: (state) => {
      state.showPuzzleSelector = false;
    },

    // Reset and clear
    resetPuzzle: (state) => {
      if (state.currentPuzzle) {
        state.currentMoveIndex = 0;
        state.status = 'solving';
        state.attempts = [];
        state.hintsUsed = 0;
        state.startTime = Date.now();
        state.feedback = null;
        state.showSolution = false;
      }
    },

    clearProgress: (state) => {
      state.solvedPuzzles = [];
      state.puzzleProgress = {};
      state.totalAttempts = 0;
      state.totalSolved = 0;
      state.currentStreak = 0;
      state.bestStreak = 0;
      
      // Clear localStorage
      try {
        localStorage.removeItem('chess-puzzle-progress');
        localStorage.removeItem('chess-puzzle-stats');
      } catch (error) {
        console.warn('Failed to clear puzzle data:', error);
      }
    },

    // Feedback management
    clearFeedback: (state) => {
      state.feedback = null;
    }
  }
});

export const {
  loadPuzzle,
  loadRandomPuzzle,
  attemptMove,
  requestHint,
  showSolution,
  nextPuzzle,
  setDifficultyFilter,
  setCategoryFilter,
  toggleRandomMode,
  showPuzzleSelector,
  hidePuzzleSelector,
  resetPuzzle,
  clearProgress,
  clearFeedback
} = puzzleSlice.actions;

export default puzzleSlice.reducer; 
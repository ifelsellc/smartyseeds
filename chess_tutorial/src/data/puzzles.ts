export interface ChessPuzzle {
  id: number;
  fen: string;
  solution: string[]; // Array of moves in UCI format (e.g., ['e2e4', 'e7e5'])
  solutionSAN: string[]; // Human-readable notation (e.g., ['e4', 'e5'])
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'checkmate' | 'tactics' | 'endgame' | 'opening' | 'fork' | 'pin' | 'skewer' | 'discovery';
  rating: number; // Puzzle rating (800-2500)
  moves: number; // Number of moves to solve
}

export const chessPuzzles: ChessPuzzle[] = [
  // Beginner Checkmate Puzzles
  {
    id: 1,
    fen: '6k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1',
    solution: ['g2g3'],
    solutionSAN: ['g3'],
    title: 'Back Rank Safety',
    description: 'Create an escape square for your king to avoid back rank mate!',
    difficulty: 'beginner',
    category: 'checkmate',
    rating: 800,
    moves: 1
  },
  {
    id: 2,
    fen: '8/8/8/8/8/2K5/5Q2/6k1 w - - 0 1',
    solution: ['f2g1'],
    solutionSAN: ['Qg1#'],
    title: 'Queen Checkmate',
    description: 'Use your queen to deliver checkmate!',
    difficulty: 'beginner',
    category: 'checkmate',
    rating: 850,
    moves: 1
  },
  {
    id: 3,
    fen: '6k1/6pp/8/8/8/8/6PP/5RK1 w - - 0 1',
    solution: ['f1f8'],
    solutionSAN: ['Rf8#'],
    title: 'Back Rank Mate',
    description: 'The enemy king is trapped on the back rank - deliver mate!',
    difficulty: 'beginner',
    category: 'checkmate',
    rating: 900,
    moves: 1
  },

  // Tactical Puzzles - Forks
  {
    id: 4,
    fen: '8/3r4/6k1/4N3/8/8/8/6K1 w - - 0 1',
    solution: ['e5d7'],
    solutionSAN: ['Nxd7'],
    title: 'Knight Fork',
    description: 'The knight can fork the king and rook!',
    difficulty: 'beginner',
    category: 'fork',
    rating: 950,
    moves: 1
  },
  {
    id: 5,
    fen: 'r3k2r/8/8/8/3Q4/8/8/4K3 w - - 0 1',
    solution: ['d4d8'],
    solutionSAN: ['Qd8+'],
    title: 'Queen Fork',
    description: 'Check the king and win a rook with a fork!',
    difficulty: 'intermediate',
    category: 'fork',
    rating: 1200,
    moves: 1
  },

  // Pin Tactics
  {
    id: 6,
    fen: '4k3/8/8/8/8/3R4/8/3QK3 w - - 0 1',
    solution: ['d1d8'],
    solutionSAN: ['Qd8#'],
    title: 'Pin and Mate',
    description: 'The rook pins the king - deliver checkmate!',
    difficulty: 'intermediate',
    category: 'pin',
    rating: 1300,
    moves: 1
  },

  // Discovery Attacks
  {
    id: 7,
    fen: '6k1/8/8/8/8/3B4/3N4/6K1 w - - 0 1',
    solution: ['d2e4'],
    solutionSAN: ['Ne4'],
    title: 'Discovered Attack',
    description: 'Move the knight to discover an attack from the bishop!',
    difficulty: 'intermediate',
    category: 'discovery',
    rating: 1400,
    moves: 1
  },

  // Multi-move Puzzles
  {
    id: 8,
    fen: '6k1/pp4pp/8/8/8/8/PP2Q1PP/6K1 w - - 0 1',
    solution: ['e2e8', 'g8h7', 'e8e7'],
    solutionSAN: ['Qe8+', 'Kh7', 'Qe7+'],
    title: 'Queen Hunt',
    description: 'Use checks to hunt down the enemy king!',
    difficulty: 'intermediate',
    category: 'tactics',
    rating: 1500,
    moves: 3
  },

  // Advanced Endgame
  {
    id: 9,
    fen: '8/8/8/8/8/8/1k6/K1R5 w - - 0 1',
    solution: ['c1c2', 'b2b3', 'c2c3'],
    solutionSAN: ['Rc2+', 'Kb3', 'Rc3+'],
    title: 'Rook Endgame',
    description: 'Cut off the enemy king and promote your advantage!',
    difficulty: 'advanced',
    category: 'endgame',
    rating: 1800,
    moves: 3
  },

  // Expert Level
  {
    id: 10,
    fen: '2r1k2r/pp2nppp/2p5/q7/3PP3/2PQ1N2/PP3PPP/R3K2R w KQkq - 0 1',
    solution: ['f3e5', 'c6c5', 'd3d5'],
    solutionSAN: ['Ne5', 'c5', 'Qd5'],
    title: 'Complex Tactics',
    description: 'Find the winning tactical sequence!',
    difficulty: 'expert',
    category: 'tactics',
    rating: 2200,
    moves: 3
  },

  // More Beginner Puzzles
  {
    id: 11,
    fen: '8/8/8/8/8/k7/8/KQ6 w - - 0 1',
    solution: ['b1b3'],
    solutionSAN: ['Qb3#'],
    title: 'Simple Queen Mate',
    description: 'Move your queen to deliver checkmate!',
    difficulty: 'beginner',
    category: 'checkmate',
    rating: 750,
    moves: 1
  },
  {
    id: 12,
    fen: 'r6k/8/8/8/8/8/8/7R w - - 0 1',
    solution: ['h1h8'],
    solutionSAN: ['Rxh8#'],
    title: 'Rook Takes Rook',
    description: 'Capture the rook and deliver checkmate!',
    difficulty: 'beginner',
    category: 'checkmate',
    rating: 800,
    moves: 1
  },

  // Skewer Tactics
  {
    id: 13,
    fen: '6k1/8/6K1/8/8/8/8/6R1 w - - 0 1',
    solution: ['g1g8'],
    solutionSAN: ['Rg8+'],
    title: 'Skewer Attack',
    description: 'Use a skewer to win material!',
    difficulty: 'intermediate',
    category: 'skewer',
    rating: 1350,
    moves: 1
  },

  // Opening Traps
  {
    id: 14,
    fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 0 1',
    solution: ['c4f7'],
    solutionSAN: ['Bxf7+'],
    title: 'Scholar\'s Mate Setup',
    description: 'Exploit the weak f7 square!',
    difficulty: 'beginner',
    category: 'opening',
    rating: 900,
    moves: 1
  },

  // More Advanced Tactics
  {
    id: 15,
    fen: '2r3k1/pp3ppp/8/8/8/2Q5/PP3PPP/6K1 w - - 0 1',
    solution: ['c3c8', 'g8h7', 'c8c7'],
    solutionSAN: ['Qc8+', 'Kh7', 'Qxc7'],
    title: 'Queen Hunt Redux',
    description: 'Force the king to move and win the rook!',
    difficulty: 'advanced',
    category: 'tactics',
    rating: 1900,
    moves: 3
  }
];

// Helper functions for puzzle management
export const getPuzzleById = (id: number): ChessPuzzle | undefined => {
  return chessPuzzles.find(puzzle => puzzle.id === id);
};

export const getPuzzlesByDifficulty = (difficulty: ChessPuzzle['difficulty']): ChessPuzzle[] => {
  return chessPuzzles.filter(puzzle => puzzle.difficulty === difficulty);
};

export const getPuzzlesByCategory = (category: ChessPuzzle['category']): ChessPuzzle[] => {
  return chessPuzzles.filter(puzzle => puzzle.category === category);
};

export const getPuzzlesByRatingRange = (minRating: number, maxRating: number): ChessPuzzle[] => {
  return chessPuzzles.filter(puzzle => puzzle.rating >= minRating && puzzle.rating <= maxRating);
};

export const getRandomPuzzle = (difficulty?: ChessPuzzle['difficulty']): ChessPuzzle => {
  const availablePuzzles = difficulty ? getPuzzlesByDifficulty(difficulty) : chessPuzzles;
  const randomIndex = Math.floor(Math.random() * availablePuzzles.length);
  return availablePuzzles[randomIndex];
};

export const getTotalPuzzleCount = (): number => {
  return chessPuzzles.length;
};

export const getPuzzleStats = () => {
  const stats = {
    total: chessPuzzles.length,
    byDifficulty: {
      beginner: getPuzzlesByDifficulty('beginner').length,
      intermediate: getPuzzlesByDifficulty('intermediate').length,
      advanced: getPuzzlesByDifficulty('advanced').length,
      expert: getPuzzlesByDifficulty('expert').length,
    },
    byCategory: {
      checkmate: getPuzzlesByCategory('checkmate').length,
      tactics: getPuzzlesByCategory('tactics').length,
      endgame: getPuzzlesByCategory('endgame').length,
      opening: getPuzzlesByCategory('opening').length,
      fork: getPuzzlesByCategory('fork').length,
      pin: getPuzzlesByCategory('pin').length,
      skewer: getPuzzlesByCategory('skewer').length,
      discovery: getPuzzlesByCategory('discovery').length,
    }
  };
  return stats;
}; 
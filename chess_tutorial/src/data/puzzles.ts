export interface ChessPuzzle {
  id: number;
  fen: string;
  solution: string[];
  solutionSAN: string[];
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  rating: number;
  moves: number;
}

export const chessPuzzles: ChessPuzzle[] = [
  // Arabian Mate - Rook and Knight coordination
  {
    id: 1,
    fen: '7k/6R1/5N2/8/8/8/8/7K w - - 0 1',
    solution: ['g7g8'],
    solutionSAN: ['Rg8#'],
    title: 'Arabian Mate',
    description: 'Use the unique coordination of rook and knight to deliver checkmate.',
    difficulty: 'intermediate',
    category: 'checkmate',
    rating: 950,
    moves: 1
  },
  // Anastasia's Mate - King trapped on side
  {
    id: 2,
    fen: '2k5/2p5/2K5/8/8/8/8/7R w - - 0 1',
    solution: ['h1h8'],
    solutionSAN: ['Rh8#'],
    title: "Anastasia's Mate",
    description: 'Use your rook to trap the enemy king on the side of the board.',
    difficulty: 'intermediate',
    category: 'checkmate',
    rating: 1100,
    moves: 1
  },
  // Back Rank Mate with capture
  {
    id: 3,
    fen: 'r5k1/5ppp/8/8/8/8/8/R6K w - - 0 1',
    solution: ['a1a8'],
    solutionSAN: ['Rxa8#'],
    title: 'Back Rank Mate with Capture',
    description: 'The enemy king is trapped on the back rank by its own pawns. Capture and deliver checkmate!',
    difficulty: 'beginner',
    category: 'checkmate',
    rating: 800,
    moves: 1
  },
  // Scholar's Mate Pattern
  {
    id: 4,
    fen: 'rnbqkbnr/pppp1ppp/8/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
    solution: ['f3f7'],
    solutionSAN: ['Qxf7#'],
    title: "Scholar's Mate",
    description: 'Attack the weak f7 square with your queen and bishop coordination.',
    difficulty: 'beginner',
    category: 'checkmate',
    rating: 750,
    moves: 1
  },
  // Discovered Attack Mate
  {
    id: 5,
    fen: '7k/6pp/8/8/8/8/5Q2/4R2K w - - 0 1',
    solution: ['e1e8'],
    solutionSAN: ['Re8#'],
    title: 'Discovered Attack Mate',
    description: 'Move one piece to unleash a devastating discovered attack!',
    difficulty: 'advanced',
    category: 'checkmate',
    rating: 1200,
    moves: 1
  },
  // Classic Back Rank Mate
  {
    id: 6,
    fen: '6k1/5ppp/8/8/8/8/8/R6K w - - 0 1',
    solution: ['a1a8'],
    solutionSAN: ['Ra8#'],
    title: 'Back Rank Mate',
    description: 'The enemy king is trapped on the back rank by its own pawns. Deliver checkmate!',
    difficulty: 'beginner',
    category: 'checkmate',
    rating: 800,
    moves: 1
  },
  // Another Anastasia's Mate variation
  {
    id: 7,
    fen: '1k6/1p6/1K6/8/8/8/8/7R w - - 0 1',
    solution: ['h1h8'],
    solutionSAN: ['Rh8#'],
    title: "Anastasia's Mate Variation",
    description: 'Use your rook to trap the enemy king on the side of the board.',
    difficulty: 'intermediate',
    category: 'checkmate',
    rating: 1100,
    moves: 1
  },
  // Queen Back Rank Mate
  {
    id: 8,
    fen: '6k1/5ppp/8/8/8/8/8/Q6K w - - 0 1',
    solution: ['a1a8'],
    solutionSAN: ['Qa8#'],
    title: 'Queen Back Rank Mate',
    description: 'The enemy king is trapped on the back rank by its own pawns. Use your queen to deliver checkmate!',
    difficulty: 'beginner',
    category: 'checkmate',
    rating: 800,
    moves: 1
  },
];

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
    },
    byCategory: {
      checkmate: getPuzzlesByCategory('checkmate').length,
    }
  };
  return stats;
}; 
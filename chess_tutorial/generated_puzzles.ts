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
  {
    "id": 5,
    "fen": "7k/6R1/5N2/8/8/8/8/7K w - - 0 1",
    "solution": [
      "g7g8"
    ],
    "solutionSAN": [
      "Rg8#"
    ],
    "title": "Arabian Mate #5",
    "description": "Use the unique coordination of rook and knight to deliver checkmate.",
    "difficulty": "intermediate",
    "category": "checkmate",
    "rating": 950,
    "moves": 1
  },
  {
    "id": 7,
    "fen": "2k5/2p5/2K5/8/8/8/8/7R w - - 0 1",
    "solution": [
      "h1h8"
    ],
    "solutionSAN": [
      "Rh8#"
    ],
    "title": "Anastasia's Mate #7",
    "description": "Use your rook and knight to trap the enemy king on the side of the board.",
    "difficulty": "intermediate",
    "category": "checkmate",
    "rating": 1100,
    "moves": 1
  },
  {
    "id": 2,
    "fen": "r5k1/5ppp/8/8/8/8/8/R6K w - - 0 1",
    "solution": [
      "a1a8"
    ],
    "solutionSAN": [
      "Rxa8#"
    ],
    "title": "Back Rank Mate #2",
    "description": "The enemy king is trapped on the back rank by its own pawns. Deliver checkmate!",
    "difficulty": "beginner",
    "category": "checkmate",
    "rating": 800,
    "moves": 1
  },
  {
    "id": 4,
    "fen": "rnbqkbnr/pppp1ppp/8/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
    "solution": [
      "f3f7"
    ],
    "solutionSAN": [
      "Qxf7#"
    ],
    "title": "Scholar's Mate Pattern #4",
    "description": "Attack the weak f7 square with your queen and bishop coordination.",
    "difficulty": "beginner",
    "category": "checkmate",
    "rating": 750,
    "moves": 1
  },
  {
    "id": 9,
    "fen": "7k/6pp/8/8/8/8/5Q2/4R2K w - - 0 1",
    "solution": [
      "e1e8"
    ],
    "solutionSAN": [
      "Re8#"
    ],
    "title": "Discovered Attack Mate #9",
    "description": "Move one piece to unleash a devastating discovered attack!",
    "difficulty": "advanced",
    "category": "checkmate",
    "rating": 1200,
    "moves": 1
  },
  {
    "id": 1,
    "fen": "6k1/5ppp/8/8/8/8/8/R6K w - - 0 1",
    "solution": [
      "a1a8"
    ],
    "solutionSAN": [
      "Ra8#"
    ],
    "title": "Back Rank Mate #1",
    "description": "The enemy king is trapped on the back rank by its own pawns. Deliver checkmate!",
    "difficulty": "beginner",
    "category": "checkmate",
    "rating": 800,
    "moves": 1
  },
  {
    "id": 6,
    "fen": "1k6/1p6/1K6/8/8/8/8/7R w - - 0 1",
    "solution": [
      "h1h8"
    ],
    "solutionSAN": [
      "Rh8#"
    ],
    "title": "Anastasia's Mate #6",
    "description": "Use your rook and knight to trap the enemy king on the side of the board.",
    "difficulty": "intermediate",
    "category": "checkmate",
    "rating": 1100,
    "moves": 1
  },
  {
    "id": 3,
    "fen": "6k1/5ppp/8/8/8/8/8/Q6K w - - 0 1",
    "solution": [
      "a1a8"
    ],
    "solutionSAN": [
      "Qa8#"
    ],
    "title": "Back Rank Mate #3",
    "description": "The enemy king is trapped on the back rank by its own pawns. Deliver checkmate!",
    "difficulty": "beginner",
    "category": "checkmate",
    "rating": 800,
    "moves": 1
  }
];
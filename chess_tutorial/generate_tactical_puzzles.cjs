const { Chess } = require("chess.js");
const fs = require("fs");

// Known tactical patterns and positions that lead to mate-in-1
const tacticalPatterns = [
  // Back rank mates
  {
    name: "Back Rank Mate",
    positions: [
      {
        fen: "6k1/5ppp/8/8/8/8/8/R6K w - - 0 1",
        solution: "a1a8",
        solutionSAN: "Ra8#",
      },
      {
        fen: "r5k1/5ppp/8/8/8/8/8/R6K w - - 0 1",
        solution: "a1a8",
        solutionSAN: "Rxa8#",
      },
      {
        fen: "6k1/5ppp/8/8/8/8/8/Q6K w - - 0 1",
        solution: "a1a8",
        solutionSAN: "Qa8#",
      },
      {
        fen: "1k6/1ppp4/8/8/8/8/8/6KR w - - 0 1",
        solution: "h1h8",
        solutionSAN: "Rh8#",
      },
      {
        fen: "5k2/5ppp/8/8/8/8/8/Q6K w - - 0 1",
        solution: "a1a8",
        solutionSAN: "Qa8#",
      },
    ],
  },

  // Scholar's mate and f7 attacks
  {
    name: "Scholar's Mate Pattern",
    positions: [
      {
        fen: "rnbqkbnr/pppp1ppp/8/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
        solution: "f3f7",
        solutionSAN: "Qxf7#",
      },
      {
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1Q2/PPP2PPP/RNB1K1NR w KQkq - 0 1",
        solution: "f3f7",
        solutionSAN: "Qxf7#",
      },
    ],
  },

  // Smothered mates
  {
    name: "Smothered Mate",
    positions: [
      {
        fen: "6rk/6pp/8/8/8/8/5N2/7K w - - 0 1",
        solution: "f2g4",
        solutionSAN: "Ng4#",
      },
      {
        fen: "5rkr/5ppp/8/8/8/8/5N2/7K w - - 0 1",
        solution: "f2e4",
        solutionSAN: "Ne4#",
      },
      {
        fen: "6rk/5ppp/8/8/8/8/6N1/7K w - - 0 1",
        solution: "g2f4",
        solutionSAN: "Nf4#",
      },
    ],
  },

  // Arabian mate (rook + knight)
  {
    name: "Arabian Mate",
    positions: [
      {
        fen: "6k1/7R/6N1/8/8/8/8/7K w - - 0 1",
        solution: "h7h8",
        solutionSAN: "Rh8#",
      },
      {
        fen: "7k/6R1/5N2/8/8/8/8/7K w - - 0 1",
        solution: "g7g8",
        solutionSAN: "Rg8#",
      },
    ],
  },

  // Corner mates
  {
    name: "Corner Mate",
    positions: [
      {
        fen: "7k/6pR/6N1/8/8/8/8/7K w - - 0 1",
        solution: "g6f8",
        solutionSAN: "Nf8#",
      },
      {
        fen: "7k/5ppR/7N/8/8/8/8/7K w - - 0 1",
        solution: "h6f7",
        solutionSAN: "Nf7#",
      },
    ],
  },

  // Queen and bishop coordination
  {
    name: "Queen and Bishop Mate",
    positions: [
      {
        fen: "7k/6pQ/6B1/8/8/8/8/7K w - - 0 1",
        solution: "h7h8",
        solutionSAN: "Qh8#",
      },
      {
        fen: "6k1/5ppp/8/8/8/8/5QB1/7K w - - 0 1",
        solution: "f2f8",
        solutionSAN: "Qf8#",
      },
    ],
  },

  // Anastasia's mate (rook + knight)
  {
    name: "Anastasia's Mate",
    positions: [
      {
        fen: "1k6/1p6/1K6/8/8/8/8/7R w - - 0 1",
        solution: "h1h8",
        solutionSAN: "Rh8#",
      },
      {
        fen: "2k5/2p5/2K5/8/8/8/8/7R w - - 0 1",
        solution: "h1h8",
        solutionSAN: "Rh8#",
      },
    ],
  },

  // Discovered attacks leading to mate
  {
    name: "Discovered Attack Mate",
    positions: [
      {
        fen: "6k1/5ppp/8/8/8/8/5B2/4R2K w - - 0 1",
        solution: "e1e8",
        solutionSAN: "Re8#",
      },
      {
        fen: "7k/6pp/8/8/8/8/5Q2/4R2K w - - 0 1",
        solution: "e1e8",
        solutionSAN: "Re8#",
      },
    ],
  },

  // Pawn promotion mates
  {
    name: "Promotion Mate",
    positions: [
      {
        fen: "6k1/5pPp/8/8/8/8/8/7K w - - 0 1",
        solution: "g7g8q",
        solutionSAN: "g8=Q#",
      },
      {
        fen: "5k2/4pP1p/8/8/8/8/8/7K w - - 0 1",
        solution: "f7f8q",
        solutionSAN: "f8=Q#",
      },
    ],
  },
];

class TacticalPuzzleGenerator {
  constructor() {
    this.generatedPuzzles = [];
  }

  validatePosition(fen, solution, solutionSAN) {
    try {
      const chess = new Chess(fen);

      // Check if position is legal
      if (!chess.isGameOver() && !chess.inCheck()) {
        // Try to make the solution move
        const move = chess.move(solution);
        if (move && chess.isCheckmate()) {
          return {
            valid: true,
            actualSAN: move.san,
          };
        }
      }
      return { valid: false, reason: "Not checkmate" };
    } catch (error) {
      return { valid: false, reason: error.message };
    }
  }

  generatePuzzlesFromPatterns() {
    let puzzleId = 1;

    for (const pattern of tacticalPatterns) {
      console.log(`\n=== Processing ${pattern.name} ===`);

      for (const position of pattern.positions) {
        const validation = this.validatePosition(
          position.fen,
          position.solution,
          position.solutionSAN
        );

        if (validation.valid) {
          const puzzle = {
            id: puzzleId++,
            fen: position.fen,
            solution: [position.solution],
            solutionSAN: [validation.actualSAN],
            title: `${pattern.name} #${puzzleId - 1}`,
            description: this.getDescription(pattern.name),
            difficulty: this.getDifficulty(pattern.name),
            category: "checkmate",
            rating: this.getRating(pattern.name),
            moves: 1,
          };

          this.generatedPuzzles.push(puzzle);
          console.log(`✅ Added: ${puzzle.title} - ${validation.actualSAN}`);
        } else {
          console.log(`❌ Invalid: ${position.fen} - ${validation.reason}`);
        }
      }
    }

    return this.generatedPuzzles;
  }

  getDescription(patternName) {
    const descriptions = {
      "Back Rank Mate":
        "The enemy king is trapped on the back rank by its own pawns. Deliver checkmate!",
      "Scholar's Mate Pattern":
        "Attack the weak f7 square with your queen and bishop coordination.",
      "Smothered Mate":
        "The enemy king is surrounded by its own pieces. Only a knight can deliver mate!",
      "Arabian Mate":
        "Use the unique coordination of rook and knight to deliver checkmate.",
      "Corner Mate":
        "The enemy king is trapped in the corner. Find the winning move!",
      "Queen and Bishop Mate":
        "Coordinate your queen and bishop to deliver a powerful checkmate.",
      "Anastasia's Mate":
        "Use your rook and knight to trap the enemy king on the side of the board.",
      "Discovered Attack Mate":
        "Move one piece to unleash a devastating discovered attack!",
      "Promotion Mate": "Promote your pawn to deliver immediate checkmate!",
    };
    return descriptions[patternName] || "Find the checkmate in one move!";
  }

  getDifficulty(patternName) {
    const difficulties = {
      "Back Rank Mate": "beginner",
      "Scholar's Mate Pattern": "beginner",
      "Smothered Mate": "intermediate",
      "Arabian Mate": "intermediate",
      "Corner Mate": "beginner",
      "Queen and Bishop Mate": "beginner",
      "Anastasia's Mate": "intermediate",
      "Discovered Attack Mate": "advanced",
      "Promotion Mate": "intermediate",
    };
    return difficulties[patternName] || "intermediate";
  }

  getRating(patternName) {
    const ratings = {
      "Back Rank Mate": 800,
      "Scholar's Mate Pattern": 750,
      "Smothered Mate": 1000,
      "Arabian Mate": 950,
      "Corner Mate": 850,
      "Queen and Bishop Mate": 800,
      "Anastasia's Mate": 1100,
      "Discovered Attack Mate": 1200,
      "Promotion Mate": 1000,
    };
    return ratings[patternName] || 900;
  }

  shuffleAndLimit(puzzles, maxCount = 10) {
    // Shuffle array
    for (let i = puzzles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [puzzles[i], puzzles[j]] = [puzzles[j], puzzles[i]];
    }

    // Take only maxCount puzzles
    return puzzles.slice(0, maxCount);
  }

  writePuzzlesToFile(puzzles, filename = "generated_puzzles.ts") {
    const puzzleCode = `export interface ChessPuzzle {
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

export const chessPuzzles: ChessPuzzle[] = ${JSON.stringify(
      puzzles,
      null,
      2
    )};`;

    fs.writeFileSync(filename, puzzleCode);
    console.log(`\nPuzzles written to ${filename}`);
  }
}

async function main() {
  console.log("🎯 Generating tactical puzzles from known patterns...");

  const generator = new TacticalPuzzleGenerator();
  const allPuzzles = generator.generatePuzzlesFromPatterns();

  console.log(`\n📊 Generated ${allPuzzles.length} valid puzzles`);

  // Shuffle and limit to 8 diverse puzzles
  const finalPuzzles = generator.shuffleAndLimit(allPuzzles, 8);

  console.log(`\n🎲 Selected ${finalPuzzles.length} puzzles for final set:`);
  finalPuzzles.forEach((puzzle, index) => {
    console.log(
      `${index + 1}. ${puzzle.title} (${puzzle.difficulty}) - ${
        puzzle.solutionSAN[0]
      }`
    );
  });

  // Write to file
  generator.writePuzzlesToFile(finalPuzzles);

  // Validate all generated puzzles
  console.log("\n🔍 Final validation:");
  for (const puzzle of finalPuzzles) {
    const validation = generator.validatePosition(
      puzzle.fen,
      puzzle.solution[0],
      puzzle.solutionSAN[0]
    );
    console.log(
      `${validation.valid ? "✅" : "❌"} ${puzzle.title}: ${
        validation.valid ? "Valid" : validation.reason
      }`
    );
  }
}

if (require.main === module) {
  main();
}

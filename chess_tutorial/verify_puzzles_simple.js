import { Chess } from "chess.js";
import { readFileSync } from "fs";

// Parse puzzles from TypeScript file
function loadPuzzles() {
  const fileContent = readFileSync("./src/data/puzzles.ts", "utf8");

  // Extract the chessPuzzles array using regex
  const puzzleArrayMatch = fileContent.match(
    /export const chessPuzzles: ChessPuzzle\[\] = \[([\s\S]*?)\];/
  );
  if (!puzzleArrayMatch) {
    throw new Error("Could not find chessPuzzles array in puzzles.ts");
  }

  // Simple parsing - extract puzzle objects
  const puzzleText = puzzleArrayMatch[1];

  // Better regex to match puzzle objects, accounting for nested braces and comments
  const puzzleMatches = [];
  let braceCount = 0;
  let currentPuzzle = "";
  let inPuzzle = false;

  for (let i = 0; i < puzzleText.length; i++) {
    const char = puzzleText[i];

    if (char === "{" && !inPuzzle) {
      inPuzzle = true;
      braceCount = 1;
      currentPuzzle = char;
    } else if (inPuzzle) {
      currentPuzzle += char;
      if (char === "{") braceCount++;
      if (char === "}") braceCount--;

      if (braceCount === 0) {
        puzzleMatches.push(currentPuzzle);
        currentPuzzle = "";
        inPuzzle = false;
      }
    }
  }

  if (!puzzleMatches || puzzleMatches.length === 0) {
    throw new Error("Could not parse puzzle objects");
  }

  const puzzles = [];
  for (const puzzleMatch of puzzleMatches) {
    try {
      // Extract key fields using regex - handle both single and double quotes
      const idMatch = puzzleMatch.match(/id:\s*(\d+)/);
      const fenMatch =
        puzzleMatch.match(/fen:\s*['"](.*?)['"]/) ||
        puzzleMatch.match(/fen:\s*'([^']+)'/);
      const solutionMatch = puzzleMatch.match(/solution:\s*\[([^\]]+)\]/);
      const titleMatch =
        puzzleMatch.match(/title:\s*['"](.*?)['"]/) ||
        puzzleMatch.match(/title:\s*'([^']+)'/);

      if (idMatch && fenMatch && solutionMatch && titleMatch) {
        const solutionMoves = solutionMatch[1]
          .split(",")
          .map((move) => move.trim().replace(/['"]/g, ""));
        puzzles.push({
          id: parseInt(idMatch[1]),
          fen: fenMatch[1],
          solution: solutionMoves,
          title: titleMatch[1],
        });
      } else {
        console.warn("Failed to parse puzzle - missing required fields");
      }
    } catch (e) {
      console.warn("Failed to parse puzzle:", e.message);
    }
  }

  return puzzles;
}

async function verifyPuzzle(puzzle) {
  const { id, fen, solution } = puzzle;
  const chess = new Chess();

  // Try to load the FEN - chess.js throws an error for invalid FEN
  try {
    chess.load(fen);
  } catch (e) {
    return { id, valid: false, reason: `Illegal FEN: ${e.message}` };
  }

  if (chess.inCheck()) {
    return { id, valid: false, reason: "Side to move already in check" };
  }

  // Test each move in the solution
  for (let uci of solution) {
    const from = uci.slice(0, 2);
    const to = uci.slice(2, 4);
    const move = chess.move({ from, to, promotion: "q" });
    if (!move) {
      return { id, valid: false, reason: `Illegal move: ${uci}` };
    }
  }

  if (!chess.isCheckmate()) {
    return { id, valid: false, reason: "Does not end in mate" };
  }

  return { id, valid: true, reason: "Valid mate-in-1 puzzle!" };
}

// Main execution
(async () => {
  const chessPuzzles = loadPuzzles();
  console.log(`Loaded ${chessPuzzles.length} puzzles from puzzles.ts\n`);

  for (const puzzle of chessPuzzles) {
    try {
      console.log(`\n=== Puzzle ${puzzle.id}: ${puzzle.title} ===`);
      console.log(`FEN: "${puzzle.fen}"`);
      console.log(`Solution: [${puzzle.solution.join(", ")}]`);

      const result = await verifyPuzzle(puzzle);
      console.log(
        `Result: ${result.valid ? "✅ VALID" : "❌ INVALID"} - ${result.reason}`
      );
    } catch (e) {
      console.error(`Puzzle ${puzzle.id} error:`, e.message);
    }
  }
})();

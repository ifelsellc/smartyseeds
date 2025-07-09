import { Chess } from "chess.js";
import stockfish from "stockfish";
// Import puzzles from TypeScript file - we'll read and parse it manually
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
  const puzzleMatches = puzzleText.match(/\{[\s\S]*?\}/g);

  if (!puzzleMatches) {
    throw new Error("Could not parse puzzle objects");
  }

  const puzzles = [];
  for (const puzzleMatch of puzzleMatches) {
    try {
      // Extract key fields using regex
      const idMatch = puzzleMatch.match(/id:\s*(\d+)/);
      const fenMatch = puzzleMatch.match(/fen:\s*'([^']+)'/);
      const solutionMatch = puzzleMatch.match(/solution:\s*\[([^\]]+)\]/);
      const titleMatch = puzzleMatch.match(/title:\s*'([^']+)'/);

      if (idMatch && fenMatch && solutionMatch && titleMatch) {
        const solutionMoves = solutionMatch[1]
          .split(",")
          .map((move) => move.trim().replace(/'/g, ""));
        puzzles.push({
          id: parseInt(idMatch[1]),
          fen: fenMatch[1],
          solution: solutionMoves,
          title: titleMatch[1],
        });
      }
    } catch (e) {
      console.warn("Failed to parse puzzle:", e.message);
    }
  }

  return puzzles;
}

function runStockfish(fen, depth = 15) {
  return new Promise((resolve, reject) => {
    const engine = stockfish();
    let bestMove = null;
    let mateScore = null;

    engine.onmessage = (event) => {
      const line = typeof event === "string" ? event : event.data;

      if (line.startsWith("info") && line.includes("score mate")) {
        const match = line.match(/score mate (-?\d+)/);
        if (match) mateScore = parseInt(match[1], 10);
      }

      if (line.startsWith("bestmove")) {
        bestMove = line.split(" ")[1];
        engine.terminate && engine.terminate();
        resolve({ bestMove, mateScore });
      }
    };

    engine.postMessage("uci");
    engine.postMessage("ucinewgame");
    engine.postMessage(`position fen ${fen}`);
    engine.postMessage(`go depth ${depth}`);
  });
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

  if (chess.inCheck())
    return { id, valid: false, reason: "Side to move already in check" };

  for (let uci of solution) {
    const from = uci.slice(0, 2),
      to = uci.slice(2, 4);
    const move = chess.move({ from, to, promotion: "q" });
    if (!move) return { id, valid: false, reason: `Illegal move: ${uci}` };
  }

  if (!chess.isCheckmate())
    return { id, valid: false, reason: "Does not end in mate" };

  const { mateScore } = await runStockfish(fen, 15);
  if (!mateScore || Math.abs(mateScore) !== puzzle.solution.length) {
    return {
      id,
      valid: false,
      reason: `Stockfish does not see mate in ${
        puzzle.solution.length
      } (found mate in ${Math.abs(mateScore || 0)})`,
    };
  }
  return { id, valid: true, reason: "OK" };
}

(async () => {
  const chessPuzzles = loadPuzzles();
  console.log(`Loaded ${chessPuzzles.length} puzzles from puzzles.ts`);

  for (const puzzle of chessPuzzles) {
    try {
      console.log(`\nPuzzle ${puzzle.id} (${puzzle.title}):`);
      console.log(`  FEN: "${puzzle.fen}"`);
      console.log(`  Solution: [${puzzle.solution.join(", ")}]`);
      const result = await verifyPuzzle(puzzle);
      console.log(`  Result:`, result);
    } catch (e) {
      console.error(`Puzzle ${puzzle.id} error:`, e.message);
    }
  }
})();

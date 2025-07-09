import { Chess } from "chess.js";
import stockfish from "stockfish";
import { chessPuzzles } from "./src/data/puzzles.js";

async function runStockfish(fen, depth = 15) {
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
  if (!chess.load(fen)) return { id, valid: false, reason: "Illegal FEN" };
  if (chess.in_check())
    return { id, valid: false, reason: "Side to move already in check" };
  for (let uci of solution) {
    const from = uci.slice(0, 2),
      to = uci.slice(2, 4);
    const move = chess.move({ from, to, promotion: "q" });
    if (!move) return { id, valid: false, reason: `Illegal move: ${uci}` };
  }
  if (!chess.in_checkmate())
    return { id, valid: false, reason: "Does not end in mate" };
  const { mateScore } = await runStockfish(fen, 15);
  if (!mateScore || Math.abs(mateScore) !== puzzle.solution.length) {
    return {
      id,
      valid: false,
      reason: `Stockfish does not see mate in ${puzzle.solution.length}`,
    };
  }
  return { id, valid: true, reason: "OK" };
}

(async () => {
  for (const puzzle of chessPuzzles) {
    try {
      const result = await verifyPuzzle(puzzle);
      console.log(result);
    } catch (e) {
      console.error(`Puzzle ${puzzle.id} error:`, e.message);
    }
  }
})();

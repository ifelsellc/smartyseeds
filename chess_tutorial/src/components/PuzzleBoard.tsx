import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { attemptMove, clearFeedback } from '../store/puzzleSlice';
import { Chess } from 'chess.js';
import { motion, AnimatePresence } from 'framer-motion';
import { useChessPieces } from '../hooks/useChessPieces';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { PieceType, PieceColor } from '../types/chessTypes';

interface PuzzleBoardProps {
  size?: number;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ size = 640 }) => {
  const dispatch = useDispatch();
  const { currentPuzzle, status, showSolution, feedback, currentMoveIndex, resetKey, attempts } = useSelector((state: RootState) => state.puzzle);
  const { getPieceRepresentation, isUnicodeSet } = useChessPieces();
  const { playMove, playCapture, playCheck } = useSoundEffects();
  
  // Local state for board interaction
  const [chessGame, setChessGame] = useState<Chess>(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  // Initialize chess game from puzzle FEN
  useEffect(() => {
    if (currentPuzzle) {
      const game = new Chess(currentPuzzle.fen);
      setChessGame(game);
      setSelectedSquare(null);
      setPossibleMoves([]);
      setLastMove(null);
    }
  }, [currentPuzzle]);

  // Reset board state when puzzle is reset (triggered by resetKey change)
  useEffect(() => {
    if (currentPuzzle && resetKey > 0) {
      const game = new Chess(currentPuzzle.fen);
      setChessGame(game);
      setSelectedSquare(null);
      setPossibleMoves([]);
      setLastMove(null);
    }
  }, [currentPuzzle, resetKey]);

  // Auto-clear feedback after 3 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        dispatch(clearFeedback());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback, dispatch]);

  const squareSize = size / 8;

  const handleSquareClick = useCallback((square: string) => {
    if (!currentPuzzle || status !== 'solving') return;

    try {
      if (selectedSquare === square) {
        // Deselect if clicking the same square
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }

      if (selectedSquare && possibleMoves.includes(square)) {
        // Make the move
        const move = chessGame.move({ from: selectedSquare, to: square });
        
        if (move) {
          // Play sound effects
          if (move.captured) {
            playCapture();
          } else {
            playMove();
          }

          // Check for check
          if (chessGame.inCheck()) {
            playCheck();
          }

          setLastMove({ from: selectedSquare, to: square });
          setSelectedSquare(null);
          setPossibleMoves([]);

          // Submit move to puzzle engine
          const moveUCI = selectedSquare + square + (move.promotion || '');
          dispatch(attemptMove({ 
            move: moveUCI, 
            moveNotation: move.san 
          }));

          // Update local chess game state
          setChessGame(new Chess(chessGame.fen()));
        }
      } else {
        // Select piece and show possible moves
        const piece = chessGame.get(square as any);
        if (piece && piece.color === chessGame.turn()) {
          setSelectedSquare(square);
          const moves = chessGame.moves({ square: square as any, verbose: true });
          setPossibleMoves(moves.map(move => move.to));
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } catch (error) {
      console.error('Error handling square click:', error);
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  }, [selectedSquare, possibleMoves, chessGame, currentPuzzle, status, dispatch, playMove, playCapture, playCheck]);

  const renderPiece = (piece: any, square: string) => {
    if (!piece) return null;

    // Map chess.js piece types to our PieceType interface
    const pieceTypeMap: Record<string, PieceType> = {
      'p': 'pawn',
      'r': 'rook',
      'n': 'knight',
      'b': 'bishop',
      'q': 'queen',
      'k': 'king'
    };

    const pieceType = pieceTypeMap[piece.type] || 'pawn';
    const pieceColor = piece.color === 'w' ? 'white' : 'black';
    const pieceRepresentation = getPieceRepresentation(pieceType, pieceColor);

    const isAnimated = lastMove && (square === lastMove.to);

    // Fallback Unicode pieces in case images fail
    const unicodeFallback = {
      white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
      black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
    };

    return (
      <motion.div
        key={`${piece.color}${piece.type}-${square}`}
        className={`absolute inset-0 flex items-center justify-center cursor-pointer select-none ${
          isUnicodeSet() ? 'text-4xl' : ''
        }`}
        initial={isAnimated ? { scale: 1.2, rotate: 15 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isUnicodeSet() ? (
          <span className="drop-shadow-sm">{pieceRepresentation}</span>
        ) : (
          <img
            src={pieceRepresentation}
            alt={`${pieceColor} ${pieceType}`}
            className="w-full h-full object-contain pointer-events-none"
            draggable={false}
            onError={(e) => {
              // Fallback to Unicode if image fails to load
              const target = e.target as HTMLImageElement;
              const fallbackSpan = document.createElement('span');
              fallbackSpan.textContent = unicodeFallback[pieceColor][pieceType];
              fallbackSpan.className = 'text-4xl drop-shadow-sm';
              target.parentNode?.replaceChild(fallbackSpan, target);
            }}
          />
        )}
      </motion.div>
    );
  };

  const renderSquare = (square: string, piece: any, row: number, col: number) => {
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedSquare === square;
    const isPossibleMove = possibleMoves.includes(square);
    const isLastMove = lastMove && (square === lastMove.from || square === lastMove.to);

    return (
      <motion.div
        key={square}
        className={`relative ${
          isLight ? 'bg-yellow-100' : 'bg-yellow-600'
        } ${
          isSelected ? 'ring-4 ring-blue-500' : ''
        } ${
          isLastMove ? 'ring-2 ring-green-400' : ''
        } cursor-pointer`}
        style={{ width: squareSize, height: squareSize }}
        onClick={() => handleSquareClick(square)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Possible move indicator */}
        {isPossibleMove && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-4 h-4 rounded-full ${
              piece ? 'border-4 border-red-500' : 'bg-green-500 opacity-60'
            }`} />
          </div>
        )}

        {/* Piece */}
        {renderPiece(piece, square)}

        {/* Square coordinates (bottom-left corner only) */}
        {row === 7 && (
          <div className="absolute bottom-0 left-1 text-xs font-medium text-gray-700">
            {String.fromCharCode(97 + col)}
          </div>
        )}
        {col === 0 && (
          <div className="absolute top-1 right-1 text-xs font-medium text-gray-700">
            {8 - row}
          </div>
        )}
      </motion.div>
    );
  };

  const renderBoard = () => {
    const board = chessGame.board();
    const squares = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = String.fromCharCode(97 + col) + (8 - row);
        const piece = board[row][col];
        squares.push(renderSquare(square, piece, row, col));
      }
    }

    return squares;
  };

  if (!currentPuzzle) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">No puzzle loaded</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Puzzle Info */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            currentPuzzle.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
            currentPuzzle.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            currentPuzzle.difficulty === 'advanced' ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            {currentPuzzle.difficulty.toUpperCase()}
          </div>
          <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
            {currentPuzzle.category.toUpperCase()}
          </div>
          <div className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
            {currentPuzzle.rating}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {currentPuzzle.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {currentPuzzle.description}
        </p>
        {currentPuzzle.moves > 1 && (
          <div className="text-xs text-gray-500">
            Move {currentMoveIndex + 1} of {currentPuzzle.moves}
          </div>
        )}
      </div>

      {/* Chess Board */}
      <div 
        className="relative border-2 border-gray-800 dark:border-gray-200"
        style={{ width: size, height: size }}
      >
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
          {renderBoard()}
        </div>

        {/* Status overlay */}
        <AnimatePresence>
          {(status === 'solved' || status === 'failed') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <div className={`text-2xl font-bold ${
                status === 'solved' ? 'text-green-400' : 'text-red-400'
              }`}>
                {status === 'solved' ? '✓ SOLVED!' : '✗ FAILED'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              status === 'solved' ? 'bg-green-100 text-green-800' :
              status === 'failed' ? 'bg-red-100 text-red-800' :
              status === 'hint' ? 'bg-blue-100 text-blue-800' :
              status === 'solution-shown' ? 'bg-purple-100 text-purple-800' :
              'bg-yellow-100 text-yellow-800'
            }`}
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solution display */}
      {showSolution && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Solution:</h4>
          <div className="space-y-1">
            {currentPuzzle.solutionSAN.map((move, index) => (
              <div key={index} className={`text-sm ${
                index < currentMoveIndex ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {index + 1}. {move}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleBoard; 
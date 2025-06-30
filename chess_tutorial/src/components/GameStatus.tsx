import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { Clock, User, Bot, CheckCircle, AlertTriangle, Trophy } from 'lucide-react'

const GameStatus: React.FC = () => {
  const { 
    status, 
    result, 
    isPlayerTurn, 
    isInCheck,
    capturedPieces,
    chessGame 
  } = useSelector((state: RootState) => state.game)
  
  const { thinking, difficulty } = useSelector((state: RootState) => state.ai)

  const getStatusIcon = () => {
    switch (status) {
      case 'playing':
        return <Clock className="w-5 h-5 text-green-600" />
      case 'paused':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'finished':
        return <Trophy className="w-5 h-5 text-purple-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'playing':
        return 'Game in Progress'
      case 'paused':
        return 'Game Paused'
      case 'finished':
        return 'Game Finished'
      default:
        return 'Ready to Play'
    }
  }

  const getCurrentPlayer = () => {
    if (status !== 'playing') return null
    
    if (thinking) {
      return (
        <div className="flex items-center text-blue-600">
          <Bot className="w-4 h-4 mr-2" />
          <span>AI is thinking...</span>
          <div className="ml-2 animate-spin w-3 h-3 border border-blue-600 border-t-transparent rounded-full" />
        </div>
      )
    }
    
    return (
      <div className={`flex items-center ${isPlayerTurn ? 'text-green-600' : 'text-blue-600'}`}>
        {isPlayerTurn ? (
          <>
            <User className="w-4 h-4 mr-2" />
            <span>Your Turn</span>
          </>
        ) : (
          <>
            <Bot className="w-4 h-4 mr-2" />
            <span>AI Turn ({difficulty})</span>
          </>
        )}
      </div>
    )
  }

  const getCapturedPiecesDisplay = (pieces: string[]) => {
    const pieceCounts = pieces.reduce((acc, piece) => {
      acc[piece] = (acc[piece] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const pieceSymbols = {
      p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚'
    }

    return Object.entries(pieceCounts).map(([piece, count]) => (
      <span key={piece} className="mr-1">
        {pieceSymbols[piece as keyof typeof pieceSymbols]}
        {count > 1 && <sub className="text-xs">{count}</sub>}
      </span>
    ))
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Game Status
      </h3>
      
      {/* Current Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getStatusIcon()}
          <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
            {getStatusText()}
          </span>
        </div>
        
        {isInCheck && status === 'playing' && (
          <div className="flex items-center text-red-600">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Check!</span>
          </div>
        )}
      </div>

      {/* Current Turn */}
      {getCurrentPlayer() && (
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          {getCurrentPlayer()}
        </div>
      )}

      {/* Game Result */}
      {result && (
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center text-purple-700 dark:text-purple-300">
            <Trophy className="w-4 h-4 mr-2" />
            <span className="font-medium">{result}</span>
          </div>
        </div>
      )}

      {/* Captured Pieces */}
      {(capturedPieces.white.length > 0 || capturedPieces.black.length > 0) && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Captured Pieces
          </h4>
          
          {capturedPieces.white.length > 0 && (
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                White:
              </span>
              <div className="text-xl">
                {getCapturedPiecesDisplay(capturedPieces.white)}
              </div>
            </div>
          )}
          
          {capturedPieces.black.length > 0 && (
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                Black:
              </span>
              <div className="text-xl">
                {getCapturedPiecesDisplay(capturedPieces.black)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Position Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div>FEN: {chessGame.fen().split(' ')[0]}...</div>
        <div>Move Number: {Math.floor(chessGame.moveNumber())}</div>
        {chessGame.inCheck() && (
          <div className="text-red-500">
            {chessGame.turn() === 'w' ? 'White' : 'Black'} king is in check
          </div>
        )}
      </div>
    </div>
  )
}

export default GameStatus 
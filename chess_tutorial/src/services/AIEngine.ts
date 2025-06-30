import { Chess } from 'chess.js'
import { AISettings } from '../store/aiSlice'

// AI Engine class for managing Stockfish integration
export class AIEngine {
  private worker: Worker | null = null
  private isReady = false
  private currentSettings: AISettings

  constructor(settings: AISettings) {
    this.currentSettings = settings
    this.initializeEngine()
  }

  private async initializeEngine() {
    try {
      // For now, we'll create a simple AI that doesn't use Stockfish
      // In a production app, you would load Stockfish WebAssembly here
      this.isReady = true
    } catch (error) {
      console.error('Failed to initialize AI engine:', error)
    }
  }

  public updateSettings(settings: AISettings) {
    this.currentSettings = settings
  }

  public async getBestMove(fen: string): Promise<string | null> {
    if (!this.isReady) {
      await this.initializeEngine()
    }

    return new Promise((resolve) => {
      // Simulate AI thinking time
      const thinkingTime = Math.min(this.currentSettings.moveTime, 3000)
      
      setTimeout(() => {
        const chess = new Chess(fen)
        const moves = chess.moves({ verbose: true })
        
        if (moves.length === 0) {
          resolve(null)
          return
        }

        // Simple AI logic based on difficulty
        let bestMove: string

        switch (this.currentSettings.skillLevel) {
          case 0: // Beginner - Random moves
            bestMove = this.getRandomMove(moves)
            break
          case 5: // Novice - Prefer captures
            bestMove = this.getNoviChessboce(moves)
            break
          case 10: // Intermediate - Basic evaluation
            bestMove = this.getIntermediateMove(chess, moves)
            break
          case 15: // Advanced - Better evaluation
            bestMove = this.getAdvancedMove(chess, moves)
            break
          case 20: // Expert - Best available move
            bestMove = this.getExpertMove(chess, moves)
            break
          default:
            bestMove = this.getRandomMove(moves)
        }

        resolve(bestMove)
      }, thinkingTime)
    })
  }

  private getRandomMove(moves: any[]): string {
    const randomIndex = Math.floor(Math.random() * moves.length)
    return moves[randomIndex].san
  }

  private getNoviChessboce(moves: any[]): string {
    // Prefer captures, then random
    const captures = moves.filter(move => move.captured)
    if (captures.length > 0) {
      return captures[Math.floor(Math.random() * captures.length)].san
    }
    return this.getRandomMove(moves)
  }

  private getIntermediateMove(chess: Chess, moves: any[]): string {
    // Simple evaluation: prefer captures, avoid hanging pieces
    const scoredMoves = moves.map(move => {
      const testGame = new Chess(chess.fen())
      testGame.move(move)
      
      let score = Math.random() * 0.1 // Add some randomness
      
      // Bonus for captures
      if (move.captured) {
        const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9 }
        score += pieceValues[move.captured as keyof typeof pieceValues] || 0
      }
      
      // Bonus for checks
      if (testGame.inCheck()) {
        score += 0.5
      }
      
      // Penalty for moving into attack
      if (this.isPieceUnderAttack(testGame, move.to)) {
        score -= 1
      }
      
      return { move: move.san, score }
    })
    
    scoredMoves.sort((a, b) => b.score - a.score)
    return scoredMoves[0].move
  }

  private getAdvancedMove(chess: Chess, moves: any[]): string {
    // More sophisticated evaluation
    const scoredMoves = moves.map(move => {
      const testGame = new Chess(chess.fen())
      testGame.move(move)
      
      let score = this.evaluatePosition(testGame)
      
      // Add tactical bonuses
      if (move.captured) {
        const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9 }
        score += pieceValues[move.captured as keyof typeof pieceValues] || 0
      }
      
      if (testGame.inCheck()) {
        score += 1
      }
      
      if (testGame.isCheckmate()) {
        score += 1000
      }
      
      return { move: move.san, score }
    })
    
    scoredMoves.sort((a, b) => b.score - a.score)
    
    // Add some randomness to top moves
    const topMoves = scoredMoves.slice(0, Math.min(3, scoredMoves.length))
    return topMoves[Math.floor(Math.random() * topMoves.length)].move
  }

  private getExpertMove(chess: Chess, moves: any[]): string {
    // Best available logic with deeper evaluation
    return this.getAdvancedMove(chess, moves)
  }

  private evaluatePosition(chess: Chess): number {
    const board = chess.board()
    let score = 0
    
    const pieceValues = {
      p: 1, n: 3, b: 3, r: 5, q: 9, k: 0
    }
    
    // Material count
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = board[rank][file]
        if (piece) {
          const value = pieceValues[piece.type as keyof typeof pieceValues]
          score += piece.color === 'w' ? -value : value
        }
      }
    }
    
    // Center control bonus
    const centerSquares = ['e4', 'e5', 'd4', 'd5']
    centerSquares.forEach(square => {
      const attackers = chess.attackers(square as any, 'b').length - chess.attackers(square as any, 'w').length
      score += attackers * 0.1
    })
    
    return score
  }

  private isPieceUnderAttack(chess: Chess, square: string): boolean {
    const attackers = chess.attackers(square as any, chess.turn() === 'w' ? 'b' : 'w')
    return attackers.length > 0
  }

  public async getHints(fen: string): Promise<string[]> {
    // Return suggested moves for hints
    const chess = new Chess(fen)
    const moves = chess.moves({ verbose: true })
    
    if (moves.length === 0) return []
    
    // Return 2-3 good candidate moves
    const candidates = moves
      .filter(move => move.captured || chess.isCheck() || move.piece === 'n' || move.piece === 'b')
      .slice(0, 3)
      .map(move => move.to)
    
    if (candidates.length === 0) {
      // Fallback to center moves
      return moves.slice(0, 3).map(move => move.to)
    }
    
    return candidates
  }

  public async detectPatterns(fen: string): Promise<{
    fork: string[]
    pin: string[]
    discoveredAttack: string[]
  }> {
    // Simple pattern detection
    const chess = new Chess(fen)
    const patterns = {
      fork: [] as string[],
      pin: [] as string[],
      discoveredAttack: [] as string[]
    }
    
    // This is a simplified pattern detection
    // In a real implementation, you would use more sophisticated algorithms
    const moves = chess.moves({ verbose: true })
    
    moves.forEach(move => {
      const testGame = new Chess(fen)
      testGame.move(move)
      
      // Check for fork pattern (simplified)
      if (move.piece === 'n') { // Knight moves often create forks
        const attackedSquares = this.getAttackedSquares(testGame, move.to)
        if (attackedSquares.length >= 2) {
          patterns.fork.push(move.to)
        }
      }
      
      // Basic pin detection would go here
      // Basic discovered attack detection would go here
    })
    
    return patterns
  }

  private getAttackedSquares(chess: Chess, square: string): string[] {
    // Get squares attacked by piece on given square
    const moves = chess.moves({ square, verbose: true })
    return moves.map(move => move.to)
  }

  public destroy() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    this.isReady = false
  }
} 
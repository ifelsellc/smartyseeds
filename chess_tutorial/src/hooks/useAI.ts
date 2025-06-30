import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { setThinking, setBestMove, setEvaluation } from '../store/aiSlice'
import { makeMove, setHints, setPatterns, startAIMoveAnimation, endAIMoveAnimation } from '../store/gameSlice'
import { AIEngine } from '../services/AIEngine'

export const useAI = () => {
  const dispatch = useDispatch()
  const aiEngineRef = useRef<AIEngine | null>(null)
  
  const { 
    chessGame, 
    status, 
    isPlayerTurn, 
    hints 
  } = useSelector((state: RootState) => state.game)
  
  const { 
    difficulty, 
    settings, 
    isEnabled, 
    thinking 
  } = useSelector((state: RootState) => state.ai)

  // Initialize AI engine
  useEffect(() => {
    const currentSettings = settings[difficulty]
    aiEngineRef.current = new AIEngine(currentSettings)
    
    return () => {
      if (aiEngineRef.current) {
        aiEngineRef.current.destroy()
      }
    }
  }, [difficulty, settings])

  // Update AI settings when difficulty changes
  useEffect(() => {
    if (aiEngineRef.current) {
      aiEngineRef.current.updateSettings(settings[difficulty])
    }
  }, [difficulty, settings])

  // Handle AI moves
  useEffect(() => {
    const makeAIMove = async () => {
      if (!aiEngineRef.current || !isEnabled || thinking || status !== 'playing' || isPlayerTurn) {
        return
      }

      dispatch(setThinking(true))
      
      try {
        const currentFen = chessGame.fen()
        const bestMove = await aiEngineRef.current.getBestMove(currentFen)
        
        if (bestMove && status === 'playing') {
          // Parse the move
          const moves = chessGame.moves({ verbose: true })
          const move = moves.find(m => m.san === bestMove)
          
          if (move) {
            dispatch(setBestMove(bestMove))
            
            // Start animation to show AI move
            dispatch(startAIMoveAnimation({ from: move.from, to: move.to }))
            
            // Make the move after animation delay for better UX
            setTimeout(() => {
              dispatch(makeMove({
                from: move.from,
                to: move.to,
                promotion: move.promotion
              }))
              
              // End animation after move is made
              setTimeout(() => {
                dispatch(endAIMoveAnimation())
                dispatch(setThinking(false))
              }, 500) // Keep highlighting for 0.5s after move
            }, 1200) // 1.2s animation before move
          } else {
            dispatch(setThinking(false))
          }
        } else {
          dispatch(setThinking(false))
        }
      } catch (error) {
        console.error('AI move error:', error)
        dispatch(setThinking(false))
      }
    }

    makeAIMove()
  }, [isPlayerTurn, status, chessGame, isEnabled, thinking, dispatch])

  // Update hints when enabled
  useEffect(() => {
    const updateHints = async () => {
      if (!aiEngineRef.current || !hints.enabled || !isPlayerTurn || status !== 'playing') {
        return
      }

      try {
        const currentFen = chessGame.fen()
        const candidateMoves = await aiEngineRef.current.getHints(currentFen)
        dispatch(setHints(candidateMoves))
        
        // Also detect patterns
        const patterns = await aiEngineRef.current.detectPatterns(currentFen)
        dispatch(setPatterns(patterns))
      } catch (error) {
        console.error('Hint generation error:', error)
      }
    }

    updateHints()
  }, [hints.enabled, isPlayerTurn, chessGame, status, dispatch])

  return {
    isAIThinking: thinking,
    aiDifficulty: difficulty,
    aiEnabled: isEnabled
  }
} 
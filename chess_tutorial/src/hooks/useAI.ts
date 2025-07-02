import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { AIEngine } from '../services/AIEngine'

interface UseAIResult {
  getBestMove: (fen: string) => Promise<string | null>
  isThinking: boolean
  error: string | null
  isReady: boolean
}

export function useAI(): UseAIResult {
  const aiSettings = useSelector((state: RootState) => state.ai.settings[state.ai.difficulty])
  const engineRef = useRef<AIEngine | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Initialize AI engine when component mounts
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        console.log('🚀 Initializing AI engine...')
        setError(null)
        
        const engine = new AIEngine()
        await engine.initialize()
        
        engineRef.current = engine
        setIsReady(true)
        console.log('✅ AI engine ready!')
        
      } catch (err) {
        console.error('❌ Failed to initialize AI engine:', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize AI')
        setIsReady(false)
      }
    }

    initializeEngine()

    // Cleanup on unmount
    return () => {
      if (engineRef.current) {
        console.log('🧹 Cleaning up AI engine...')
        engineRef.current.destroy()
        engineRef.current = null
      }
    }
  }, [])

  const getBestMove = async (fen: string): Promise<string | null> => {
    if (!engineRef.current || !isReady) {
      console.warn('AI engine not ready')
      return null
    }

    try {
      setIsThinking(true)
      setError(null)
      
      console.log('🎯 Getting best move for:', fen)
      const move = await engineRef.current.getBestMove(fen, aiSettings)
      
      console.log('✅ AI recommends:', move)
      return move
      
    } catch (err) {
      console.error('❌ Error getting AI move:', err)
      setError(err instanceof Error ? err.message : 'Failed to get AI move')
      return null
      
    } finally {
      setIsThinking(false)
    }
  }

  return {
    getBestMove,
    isThinking,
    error,
    isReady
  }
} 
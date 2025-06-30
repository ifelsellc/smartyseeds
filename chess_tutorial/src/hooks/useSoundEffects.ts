import { useCallback } from 'react'

// Simple sound effect frequencies and durations
const SOUND_EFFECTS = {
  move: { frequency: 440, duration: 100 },
  capture: { frequency: 200, duration: 150 },
  check: { frequency: 800, duration: 200, pulses: 3 },
  gameEnd: { frequency: 600, duration: 300 }
}

export const useSoundEffects = () => {
  const playTone = useCallback((frequency: number, duration: number, pulses = 1) => {
    // Check if audio is supported and user hasn't disabled it
    if (typeof window === 'undefined' || !window.AudioContext) return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      const playPulse = (pulseIndex: number) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
        
        // Set volume envelope
        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration / 1000)
        
        // Schedule next pulse if needed
        if (pulseIndex < pulses - 1) {
          setTimeout(() => playPulse(pulseIndex + 1), duration + 50)
        }
      }
      
      playPulse(0)
    } catch (error) {
      // Silently fail if audio context is not available
      console.warn('Audio not available:', error)
    }
  }, [])

  const playMove = useCallback(() => {
    const { frequency, duration } = SOUND_EFFECTS.move
    playTone(frequency, duration)
  }, [playTone])

  const playCapture = useCallback(() => {
    const { frequency, duration } = SOUND_EFFECTS.capture
    playTone(frequency, duration)
  }, [playTone])

  const playCheck = useCallback(() => {
    const { frequency, duration, pulses } = SOUND_EFFECTS.check
    playTone(frequency, duration, pulses)
  }, [playTone])

  const playGameEnd = useCallback(() => {
    const { frequency, duration } = SOUND_EFFECTS.gameEnd
    playTone(frequency, duration)
  }, [playTone])

  return {
    playMove,
    playCapture,
    playCheck,
    playGameEnd
  }
} 
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type DifficultyLevel = 'beginner' | 'novice' | 'intermediate' | 'advanced' | 'expert'

export interface AISettings {
  depth: number
  moveTime: number
  skillLevel: number
  description: string
  elo?: number // Optional Elo rating for UCI_LimitStrength mode
}

export interface AIState {
  difficulty: DifficultyLevel
  isThinking: boolean
  isEnabled: boolean
  settings: Record<DifficultyLevel, AISettings>
  lastEvaluation: number | null
  bestMove: string | null
  thinking: boolean
}

const aiSettings: Record<DifficultyLevel, AISettings> = {
  beginner: {
    depth: 1,
    moveTime: 500,
    skillLevel: 0,
    elo: 800, // Use UCI_Elo for truly weak play
    description: 'Perfect for first-time players'
  },
  novice: {
    depth: 2,
    moveTime: 1000,
    skillLevel: 3, // Reduced from 5
    description: 'Great for learning basic tactics'
  },
  intermediate: {
    depth: 4, // Reduced from 5
    moveTime: 2000,
    skillLevel: 8, // Reduced from 10
    description: 'Challenges developing players'
  },
  advanced: {
    depth: 6, // Reduced from 8
    moveTime: 3000,
    skillLevel: 15,
    description: 'For experienced players'
  },
  expert: {
    depth: 10, // Reduced from 12
    moveTime: 5000,
    skillLevel: 20,
    description: 'Maximum challenge'
  }
}

const initialState: AIState = {
  difficulty: 'beginner',
  isThinking: false,
  isEnabled: true,
  settings: aiSettings,
  lastEvaluation: null,
  bestMove: null,
  thinking: false
}

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setDifficulty: (state, action: PayloadAction<DifficultyLevel>) => {
      state.difficulty = action.payload
    },

    setThinking: (state, action: PayloadAction<boolean>) => {
      state.isThinking = action.payload
      state.thinking = action.payload
    },

    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.isEnabled = action.payload
    },

    setEvaluation: (state, action: PayloadAction<number>) => {
      state.lastEvaluation = action.payload
    },

    setBestMove: (state, action: PayloadAction<string | null>) => {
      state.bestMove = action.payload
    },

    resetAI: (state) => {
      state.isThinking = false
      state.lastEvaluation = null
      state.bestMove = null
      state.thinking = false
    }
  }
})

export const {
  setDifficulty,
  setThinking,
  setEnabled,
  setEvaluation,
  setBestMove,
  resetAI
} = aiSlice.actions

export default aiSlice.reducer 
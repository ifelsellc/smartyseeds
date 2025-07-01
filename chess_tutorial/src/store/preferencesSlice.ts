import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { defaultChessSetId } from '../config/chessSets'

export interface PreferencesState {
  selectedChessSetId: string
  showChessSetSelector: boolean
}

// Load preferences from localStorage
const loadPreferencesFromStorage = (): Partial<PreferencesState> => {
  try {
    const stored = localStorage.getItem('chess-tutorial-preferences')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.warn('Failed to load preferences from localStorage:', error)
  }
  return {}
}

// Save preferences to localStorage
const savePreferencesToStorage = (state: PreferencesState) => {
  try {
    localStorage.setItem('chess-tutorial-preferences', JSON.stringify(state))
  } catch (error) {
    console.warn('Failed to save preferences to localStorage:', error)
  }
}

const storedPreferences = loadPreferencesFromStorage()

const initialState: PreferencesState = {
  selectedChessSetId: storedPreferences.selectedChessSetId || defaultChessSetId,
  showChessSetSelector: false
}

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setSelectedChessSet: (state, action: PayloadAction<string>) => {
      state.selectedChessSetId = action.payload
      savePreferencesToStorage(state)
    },

    showChessSetSelector: (state) => {
      state.showChessSetSelector = true
    },

    hideChessSetSelector: (state) => {
      state.showChessSetSelector = false
    },

    toggleChessSetSelector: (state) => {
      state.showChessSetSelector = !state.showChessSetSelector
    }
  }
})

export const {
  setSelectedChessSet,
  showChessSetSelector,
  hideChessSetSelector,
  toggleChessSetSelector
} = preferencesSlice.actions

export default preferencesSlice.reducer 
import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './gameSlice'
import aiReducer from './aiSlice'

export const store = configureStore({
  reducer: {
    game: gameReducer,
    ai: aiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for chess.js instances
        ignoredActions: ['game/setGame', 'game/makeMove'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['payload.game'],
        // Ignore these paths in the state
        ignoredPaths: ['game.chessGame'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import App from '../App'

describe('App Integration', () => {
  it('should render the main application', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    // Check for main heading
    expect(screen.getByText(/Chess Tutorial/i)).toBeInTheDocument()
    
    // Check for main sections
    expect(screen.getByText(/Game Status/i)).toBeInTheDocument()
    expect(screen.getByText(/AI Difficulty/i)).toBeInTheDocument()
    expect(screen.getByText(/Learning Assistant/i)).toBeInTheDocument()
    expect(screen.getByText(/Game Controls/i)).toBeInTheDocument()
    expect(screen.getByText(/Move History/i)).toBeInTheDocument()
  })

  it('should have theme toggle functionality', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    // Check for theme toggle button
    const themeToggle = screen.getByLabelText(/Switch to/i)
    expect(themeToggle).toBeInTheDocument()
  })

  it('should display game board', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    // Check for chess board container
    const gameBoard = document.querySelector('.game-board')
    expect(gameBoard).toBeInTheDocument()
  })
}) 
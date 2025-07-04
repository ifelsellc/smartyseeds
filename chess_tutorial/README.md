# 🏰 Chess Tutorial - Educational Chess Game for Children

A comprehensive, web-based chess application built with React and TypeScript, specifically designed for 8-year-old beginners who want to learn and improve their chess skills.

## ✨ Features

### 🎮 Core Gameplay

- **Legal Move Validation**: Powered by [chess.js](https://github.com/jhlywa/chess.js) for accurate chess rules
- **AI Opponent**: 5 difficulty levels from Beginner to Expert
- **Responsive Design**: Works perfectly on desktop and tablet devices
- **Beautiful UI**: Clean, modern interface with smooth animations

### 🎯 User Controls

- **Pause/Resume**: Freeze the game clock and board state
- **Undo/Step Back**: Navigate through move history
- **Replay System**: Watch games replay at adjustable speeds
- **Reset**: Start fresh games at any difficulty level

### 🧠 Learning Features

- **Move Hints**: Get 2-3 candidate moves suggested by the AI
- **Pattern Recognition**: Visual overlays for tactical patterns (forks, pins, discovered attacks)
- **Difficulty-Aware Tips**: Contextual chess advice based on skill level
- **Educational Tooltips**: Learn chess concepts while playing

### 🎨 User Experience

- **Sound Effects**: Audio feedback for moves, captures, and check
- **Smooth Animations**: Piece movement with visual feedback
- **Dark/Light Themes**: Toggle between themes for comfort
- **Accessibility**: Screen reader friendly with proper ARIA labels

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Chess Logic**: chess.js
- **AI Engine**: Stockfish 16 WASM with 5 difficulty levels
- **Testing**: Vitest + React Testing Library
- **Build Tool**: Vite

### Project Structure

```
src/
├── components/          # React components
│   ├── ChessBoard.tsx   # Main game board
│   ├── GameControls.tsx # Control buttons
│   ├── MoveList.tsx     # Move history
│   ├── HintPanel.tsx    # Learning assistant
│   ├── GameStatus.tsx   # Game state display
│   └── ...
├── store/               # Redux state management
│   ├── gameSlice.ts     # Game state
│   ├── aiSlice.ts       # AI settings
│   └── store.ts         # Store configuration
├── services/            # Business logic
│   └── AIEngine.ts      # AI opponent logic
├── hooks/               # Custom React hooks
│   ├── useAI.ts         # AI integration
│   └── useSoundEffects.ts # Audio effects
├── contexts/            # React contexts
│   └── ThemeContext.tsx # Theme management
└── __tests__/           # Test files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd chess-tutorial
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Individual component and slice testing
- **Integration Tests**: Feature-level testing
- **E2E Tests**: Full user journey testing (can be added)

## 🎯 AI Difficulty Levels

The chess tutorial features 5 carefully calibrated difficulty levels using advanced UCI parameters:

| Level            | Strength Control | Think Time | Description                    |
| ---------------- | ---------------- | ---------- | ------------------------------ |
| **Beginner**     | 800 Elo          | 500ms      | Perfect for first-time players |
| **Novice**       | 3/20 Skill       | 1000ms     | Great for learning tactics     |
| **Intermediate** | 8/20 Skill       | 2000ms     | Challenges developing players  |
| **Advanced**     | 15/20 Skill      | 3000ms     | For experienced players        |
| **Expert**       | 20/20 Skill      | 5000ms     | Maximum Stockfish challenge    |

> **Note**: The "Beginner" level uses UCI_LimitStrength with a target Elo of 800, making it genuinely beatable for new players. Other levels use Stockfish's skill level system for progressive difficulty scaling.

## 🎨 Customization

### Theme Configuration

Themes are managed through the `ThemeContext` and can be easily extended:

```typescript
// Add new theme colors in tailwind.config.js
colors: {
  chess: {
    light: '#f0d9b5',
    dark: '#b58863',
    // Add your custom colors
  }
}
```

### AI Difficulty Tuning

Want to adjust the AI difficulty levels? See the comprehensive **[AI Difficulty Tuning Guide](AI_DIFFICULTY_TUNING.md)** for:

- How to adjust existing difficulty levels
- Adding new difficulty levels
- Understanding UCI parameters
- Advanced tuning techniques
- Testing and troubleshooting

### Adding New Difficulty Levels

Quick example - extend the AI settings in `aiSlice.ts`:

```typescript
const aiSettings = {
  // ... existing levels
  grandmaster: {
    depth: 15,
    moveTime: 8000,
    skillLevel: 25,
    description: "Grandmaster level play",
  },
};
```

For detailed instructions, see the [AI Difficulty Tuning Guide](AI_DIFFICULTY_TUNING.md).

## 📱 Responsive Design

The application is fully responsive and works on:

- **Desktop**: Full feature set with keyboard shortcuts
- **Tablet**: Touch-optimized interface
- **Mobile**: Optimized for smaller screens (planned)

## 🔧 Development

### Code Style

- **ESLint**: Configured for React and TypeScript
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict type checking enabled

### Key Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test         # Run tests
npm run preview      # Preview production build
```

### Contributing Guidelines

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## 🎯 Future Enhancements

### Planned Features

- [x] **Stockfish Integration**: ✅ Complete - Stockfish 16 WASM integrated
- [ ] **Puzzle Mode**: Tactical puzzles for skill development
- [ ] **Opening Trainer**: Learn popular chess openings
- [ ] **Progress Tracking**: Save and track learning progress
- [ ] **Multiplayer**: Play against friends online
- [ ] **Analysis Board**: Post-game analysis with engine evaluation
- [ ] **Chess Variants**: King of the Hill, Chess960, etc.

### Educational Enhancements

- [ ] **Video Tutorials**: Integrated chess lessons
- [ ] **Achievement System**: Gamification for motivation
- [ ] **Parental Dashboard**: Progress tracking for parents
- [ ] **Adaptive Learning**: AI-powered difficulty adjustment

## 🐛 Troubleshooting

### Common Issues

**Game doesn't start**

- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

**AI not responding**

- ✅ AI now fully functional with Stockfish integration
- Verify it's the AI's turn (should move automatically)
- Check browser console for any error messages
- Ensure sufficient time for AI calculation (varies by difficulty)

**Moves not working**

- Ensure you're selecting valid pieces
- Check if the game is paused
- Verify move legality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Acknowledgments

- **chess.js** - Chess game logic library
- **React Team** - Amazing framework
- **Tailwind CSS** - Utility-first CSS framework
- **Stockfish** - Chess engine (for future integration)
- **Chess.com** - Inspiration for educational features

## 📞 Support

For questions, bug reports, or feature requests:

- Create an issue on GitHub
- Check the documentation
- Review existing issues first

---

**Made with ❤️ for young chess masters**

_This project aims to make chess learning fun, accessible, and educational for children while maintaining the depth and richness of the game._

# AI Difficulty Tuning Guide

This guide explains how to adjust, customize, and fine-tune AI difficulty levels in the Chess Tutorial application.

## 📊 Current Difficulty Levels

| Level        | Elo/Skill | Depth | Think Time | Target Audience        |
| ------------ | --------- | ----- | ---------- | ---------------------- |
| Beginner     | 800 Elo   | 1     | 500ms      | Complete beginners     |
| Novice       | Skill 3   | 2     | 1000ms     | Learning basic tactics |
| Intermediate | Skill 8   | 4     | 2000ms     | Developing players     |
| Advanced     | Skill 15  | 6     | 3000ms     | Experienced players    |
| Expert       | Skill 20  | 10    | 5000ms     | Strong players         |

## 🔧 How to Adjust Difficulty

### Method 1: Quick Adjustments (Recommended for Beginners)

Edit the settings in `src/store/aiSlice.ts`:

```typescript
const aiSettings: Record<DifficultyLevel, AISettings> = {
  beginner: {
    depth: 1,
    moveTime: 500,
    skillLevel: 0,
    elo: 800, // Lower this (600-1000) to make easier/harder
    description: "Perfect for first-time players",
  },
  novice: {
    depth: 2,
    moveTime: 1000,
    skillLevel: 5, // Increase this (3-8) to make harder
    description: "Great for learning basic tactics",
  },
  // ... other levels
};
```

### Method 2: Advanced UCI Parameter Tuning

For more precise control, you can modify the AI engine behavior in `src/services/AIEngine.ts`:

```typescript
// Add more UCI options
if (settings.elo) {
  this.sendCommand(`setoption name UCI_LimitStrength value true`);
  this.sendCommand(`setoption name UCI_Elo value ${settings.elo}`);

  // Additional UCI options for fine-tuning
  this.sendCommand(`setoption name Slow Mover value 100`); // 50-200, lower = faster
  this.sendCommand(`setoption name Nodestime value 0`); // Nodes per second limit
} else {
  this.sendCommand(`setoption name UCI_LimitStrength value false`);
  this.sendCommand(`setoption name Skill Level value ${settings.skillLevel}`);

  // Skill-based additional options
  this.sendCommand(`setoption name Contempt value 0`); // -100 to 100
  this.sendCommand(`setoption name Analysis Contempt value Both`);
}
```

## 🎯 Understanding the Parameters

### 1. **Elo Rating (Beginner Level)**

- **Range**: 600-1200 (realistic for beginners)
- **Effect**: Simulates human play at specific rating
- **Pros**: Consistent strength, human-like mistakes
- **Cons**: Limited to lower ratings

```typescript
// Ultra-beginner (very beatable)
elo: 600,

// True beginner (beatable with effort)
elo: 800,

// Strong beginner (challenge for new players)
elo: 1000,
```

### 2. **Skill Level (Other Levels)**

- **Range**: 0-20 (Stockfish scale)
- **Effect**: Controls how often engine makes mistakes
- **0**: Very weak, frequent blunders
- **20**: Maximum strength, no intentional mistakes

```typescript
// Skill level examples
skillLevel: 1,  // Very weak, many mistakes
skillLevel: 5,  // Weak, occasional blunders
skillLevel: 10, // Medium, some mistakes
skillLevel: 15, // Strong, rare mistakes
skillLevel: 20, // Maximum, no mistakes
```

### 3. **Search Depth**

- **Range**: 1-15 (practical range)
- **Effect**: How many moves ahead the AI calculates
- **1**: Only immediate moves
- **5**: Tactical combinations
- **10+**: Deep strategic planning

```typescript
// Depth examples
depth: 1,  // Instant moves, tactical blunders
depth: 3,  // Basic tactics, missed combinations
depth: 6,  // Good tactics, some strategy
depth: 10, // Strong play, deep calculations
```

### 4. **Move Time**

- **Range**: 100ms-10000ms
- **Effect**: How long AI thinks per move
- **Balance**: Longer = stronger but slower gameplay

```typescript
// Move time examples
moveTime: 250,  // Very fast, weaker play
moveTime: 1000, // Good balance
moveTime: 3000, // Strong play, slower game
moveTime: 8000, // Very strong, patience required
```

## 🎮 Adding New Difficulty Levels

### Step 1: Update Type Definition

In `src/store/aiSlice.ts`, add your new level to the type:

```typescript
export type DifficultyLevel =
  | "beginner"
  | "novice"
  | "intermediate"
  | "advanced"
  | "expert"
  | "grandmaster";
```

### Step 2: Add Settings Configuration

```typescript
const aiSettings: Record<DifficultyLevel, AISettings> = {
  // ... existing levels
  grandmaster: {
    depth: 15,
    moveTime: 8000,
    skillLevel: 20,
    description: "Grandmaster-level challenge",
  },
};
```

### Step 3: Update UI Components

In `src/components/DifficultySelector.tsx`, add the new level to the icon and color mappings:

```typescript
const DIFFICULTY_ICONS = {
  // ... existing icons
  grandmaster: Crown,
};

const DIFFICULTY_COLORS = {
  // ... existing colors
  grandmaster: "text-purple-600",
};
```

### Step 4: Update Star Rating (Optional)

```typescript
const getDifficultyStars = (level: DifficultyLevel): number => {
  const starCount = {
    // ... existing levels
    grandmaster: 5, // or 6 for max difficulty
  };
  return starCount[level] || 1;
};
```

## 🧪 Testing Your Difficulty Changes

### 1. **Quick Test Method**

```bash
# Start the development server
npm run dev

# Test each level:
# 1. Select difficulty level
# 2. Play 5-10 moves
# 3. Check if AI strength feels appropriate
# 4. Adjust parameters if needed
```

### 2. **Automated Testing**

Create a test script to validate difficulty levels:

```typescript
// test-difficulty.ts
import { AIEngine } from "./src/services/AIEngine";

const testDifficulty = async (
  settings: AISettings,
  testPositions: string[]
) => {
  const engine = new AIEngine();
  await engine.initialize();

  const results = [];

  for (const fen of testPositions) {
    const startTime = Date.now();
    const move = await engine.getBestMove(fen, settings);
    const endTime = Date.now();

    results.push({
      fen,
      move,
      thinkTime: endTime - startTime,
    });
  }

  return results;
};
```

### 3. **User Testing Guidelines**

- **Beginner**: New players should win at least 30% of games
- **Novice**: Learning players should have competitive games
- **Intermediate**: Should challenge improving players
- **Advanced**: Should be difficult for club players
- **Expert**: Should challenge strong players

## 🔍 Advanced Tuning Techniques

### 1. **Adaptive Difficulty**

Make difficulty adjust based on player performance:

```typescript
// Add to aiSlice.ts
interface AIState {
  // ... existing properties
  adaptiveDifficulty: boolean;
  playerWinRate: number;
  gamesPlayed: number;
}

// Auto-adjust based on win rate
const adjustDifficultyBasedOnPerformance = (state: AIState) => {
  if (state.adaptiveDifficulty && state.gamesPlayed >= 5) {
    if (state.playerWinRate > 0.7) {
      // Player winning too much, increase difficulty
      increaseDifficulty(state);
    } else if (state.playerWinRate < 0.3) {
      // Player losing too much, decrease difficulty
      decreaseDifficulty(state);
    }
  }
};
```

### 2. **Time-Based Difficulty**

Adjust difficulty based on game phase:

```typescript
// In AIEngine.ts
const getGamePhaseAdjustment = (fen: string, settings: AISettings) => {
  const position = new Chess(fen);
  const moveCount = position.history().length;

  if (moveCount < 10) {
    // Opening: reduce strength slightly
    return { ...settings, skillLevel: Math.max(0, settings.skillLevel - 2) };
  } else if (moveCount > 40) {
    // Endgame: increase strength slightly
    return { ...settings, skillLevel: Math.min(20, settings.skillLevel + 2) };
  }

  return settings;
};
```

### 3. **Position-Based Difficulty**

Adjust strength based on position complexity:

```typescript
const getPositionComplexity = (fen: string): number => {
  const position = new Chess(fen);
  const legalMoves = position.moves().length;

  // More legal moves = more complex position
  if (legalMoves > 35) return 1.2; // Increase difficulty
  if (legalMoves < 10) return 0.8; // Decrease difficulty
  return 1.0; // Normal difficulty
};
```

## 🛠️ Troubleshooting Common Issues

### 1. **AI Too Strong Even at Beginner Level**

```typescript
// Try lower Elo rating
elo: 600, // instead of 800
  // Or add more restrictions
  this.sendCommand(`setoption name Skill Level value 0`);
this.sendCommand(`setoption name UCI_LimitStrength value true`);
this.sendCommand(`setoption name UCI_Elo value 600`);
this.sendCommand(`setoption name Slow Mover value 200`); // Make it slower
```

### 2. **AI Too Weak at Higher Levels**

```typescript
// Increase depth and time
depth: 12, // instead of 8
moveTime: 8000, // instead of 5000

// Remove strength limitations
this.sendCommand(`setoption name UCI_LimitStrength value false`);
this.sendCommand(`setoption name Skill Level value 20`);
```

### 3. **Inconsistent AI Behavior**

```typescript
// Use Elo-based system for consistency
elo: 1200, // instead of skillLevel: 8
  // Or add contempt for more aggressive play
  this.sendCommand(`setoption name Contempt value 20`);
```

### 4. **AI Takes Too Long to Move**

```typescript
// Reduce move time
moveTime: 1000, // instead of 3000

// Or reduce depth
depth: 4, // instead of 6
```

## 📈 Performance vs. Strength Balance

### Quick Reference Table

| Goal             | Depth | Move Time | Skill/Elo | Use Case               |
| ---------------- | ----- | --------- | --------- | ---------------------- |
| Ultra-fast, weak | 1     | 250ms     | Elo 600   | Demos, very young kids |
| Fast, beginner   | 1     | 500ms     | Elo 800   | New players            |
| Balanced         | 4     | 2000ms    | Skill 8   | Most players           |
| Strong           | 8     | 4000ms    | Skill 18  | Advanced players       |
| Maximum          | 12    | 8000ms    | Skill 20  | Expert challenge       |

## 🎯 Recommended Difficulty Progressions

### For Chess Tutorial (Educational)

1. **Toddler**: Elo 500, Depth 1, 300ms
2. **Child**: Elo 700, Depth 1, 500ms
3. **Beginner**: Elo 900, Depth 2, 1000ms
4. **Learning**: Skill 5, Depth 3, 2000ms
5. **Improving**: Skill 10, Depth 5, 3000ms
6. **Advanced**: Skill 18, Depth 8, 5000ms

### For Competitive Play

1. **Beginner**: Elo 800, Depth 2, 1000ms
2. **Club Player**: Elo 1200, Depth 4, 2000ms
3. **Strong Club**: Elo 1600, Depth 6, 3000ms
4. **Expert**: Elo 2000, Depth 8, 5000ms
5. **Master**: Skill 20, Depth 12, 8000ms

## 🔧 Implementation Checklist

- [ ] Define target audience for each level
- [ ] Set appropriate Elo/skill ratings
- [ ] Balance depth vs. move time
- [ ] Test with target players
- [ ] Adjust based on feedback
- [ ] Document changes
- [ ] Update UI components
- [ ] Test performance impact

## 📝 Notes

- **Elo ratings** are more predictable than skill levels
- **Depth** has exponential impact on strength
- **Move time** affects user experience significantly
- **UCI parameters** offer fine-grained control
- **Test thoroughly** with real players
- **Consider hardware** - mobile devices may need lower settings

---

_This guide provides comprehensive control over AI difficulty. Start with small adjustments and test thoroughly with your target audience._

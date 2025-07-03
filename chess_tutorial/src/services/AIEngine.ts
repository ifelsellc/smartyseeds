export interface AISettings {
  depth: number;
  moveTime: number;
  skillLevel: number;
  elo?: number; // Optional Elo rating for UCI_LimitStrength mode
}

export class AIEngine {
  private worker: Worker | null = null;
  private isInitialized = false;
  private pendingMoveResolve: ((move: string) => void) | null = null;
  private moveTimeoutId: ReturnType<typeof setTimeout> | null = null;

  async initialize(): Promise<void> {
    if (this.worker) {
      return;
    }

    return new Promise((resolve, reject) => {
      console.log("🚀 Initializing AI Engine...");
      
      this.worker = new Worker("/stockfish-worker.js");
      
      this.worker.onmessage = (event) => {
        const { type, data } = event.data;
        
        switch (type) {
          case "ready":
            console.log("✅ AI Engine ready!");
            this.isInitialized = true;
            resolve();
            break;
            
          case "output":
            this.handleEngineOutput(data);
            break;
            
          case "error":
            console.error("❌ AI Engine error:", data);
            reject(new Error(data));
            break;
        }
      };
      
      this.worker.onerror = (error) => {
        console.error("❌ Worker error:", error);
        reject(error);
      };
    });
  }

  private handleEngineOutput(line: string): void {
    // Look for best move
    if (line.startsWith("bestmove ")) {
      const moveMatch = line.match(/bestmove ([a-h][1-8][a-h][1-8][qrbn]?)/);
      if (moveMatch && this.pendingMoveResolve) {
        const move = moveMatch[1];
        console.log("✅ AI move:", move);
        
        // Clear timeout
        if (this.moveTimeoutId) {
          clearTimeout(this.moveTimeoutId);
          this.moveTimeoutId = null;
        }
        
        // Resolve the promise
        const resolve = this.pendingMoveResolve;
        this.pendingMoveResolve = null;
        resolve(move);
      }
    }
  }

  async getBestMove(fen: string, settings: AISettings): Promise<string> {
    if (!this.isInitialized || !this.worker) {
      throw new Error("AI Engine not initialized");
    }

    return new Promise((resolve, reject) => {
      // Store resolve function
      this.pendingMoveResolve = resolve;
      
      // Set timeout
      const timeoutMs = Math.max(settings.moveTime * 2, 10000); // At least 10 seconds
      this.moveTimeoutId = setTimeout(() => {
        console.error("⏰ AI move timeout");
        this.pendingMoveResolve = null;
        reject(new Error("Move calculation timeout"));
      }, timeoutMs);
      
      // Configure engine based on whether we have an Elo target
      if (settings.elo) {
        // Use UCI_LimitStrength and UCI_Elo for precise strength control
        console.log(`🎯 Setting AI to ~${settings.elo} Elo`);
        this.sendCommand(`setoption name UCI_LimitStrength value true`);
        this.sendCommand(`setoption name UCI_Elo value ${settings.elo}`);
      } else {
        // Use traditional skill level
        this.sendCommand(`setoption name UCI_LimitStrength value false`);
        this.sendCommand(`setoption name Skill Level value ${settings.skillLevel}`);
      }
      
      // Send position and calculate
      this.sendCommand(`position fen ${fen}`);
      this.sendCommand(`go movetime ${settings.moveTime} depth ${settings.depth}`);
    });
  }

  private sendCommand(command: string): void {
    if (!this.worker) {
      console.error("❌ Cannot send command - no worker");
      return;
    }
    
    console.log("📤 Sending command:", command);
    this.worker.postMessage({ type: "command", data: command });
  }

  destroy(): void {
    console.log("🧹 Destroying AI Engine...");
    
    if (this.moveTimeoutId) {
      clearTimeout(this.moveTimeoutId);
      this.moveTimeoutId = null;
    }
    
    if (this.pendingMoveResolve) {
      this.pendingMoveResolve = null;
    }
    
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    
    this.isInitialized = false;
  }
} 
// Stockfish Web Worker - Legacy Direct Worker API
console.log("🔄 Starting Stockfish Worker...");

let isInitialized = false;
let pendingCommands = [];

// Load Stockfish script
try {
  console.log("📥 Loading Stockfish module...");
  importScripts("/stockfish.js");
  console.log("✅ Stockfish script loaded");
} catch (error) {
  console.error("❌ Failed to load Stockfish script:", error);
  self.postMessage({
    type: "error",
    data: "Failed to load Stockfish: " + error.message,
  });
}

// Store the original postMessage to communicate with main thread
const originalPostMessage = self.postMessage;

// Override postMessage to intercept engine output
self.postMessage = function (data) {
  if (typeof data === "string") {
    console.log("📡 Engine:", data);

    // Forward to main thread
    originalPostMessage.call(self, {
      type: "output",
      data: data,
    });

    // Handle UCI protocol responses
    if (data.includes("uciok")) {
      console.log("✅ UCI protocol established");
      isInitialized = true;

      // Process any pending commands
      while (pendingCommands.length > 0) {
        const cmd = pendingCommands.shift();
        console.log("📤 Sending queued command:", cmd);
        sendToEngine(cmd);
      }

      // Notify main thread we're ready
      originalPostMessage.call(self, {
        type: "ready",
        data: "Engine ready",
      });
    }
  } else {
    // Forward non-string messages to main thread
    originalPostMessage.call(self, data);
  }
};

// Store original onmessage handler from Stockfish
const stockfishOnMessage = self.onmessage;

// Set up our message handler
self.onmessage = function (event) {
  // Handle messages from main thread
  if (event.data && typeof event.data === "object") {
    const { type, data } = event.data;

    console.log("📨 Received from main thread:", type, data);

    switch (type) {
      case "command":
        if (isInitialized) {
          console.log("📤 Sending command:", data);
          sendToEngine(data);
        } else {
          console.log("⏳ Queueing command (engine not ready):", data);
          pendingCommands.push(data);
        }
        break;

      case "init":
        // Already initialized when script loads
        break;

      default:
        console.warn("❓ Unknown message type:", type);
    }
  }
  // Handle direct string messages (for UCI commands to engine)
  else if (typeof event.data === "string") {
    console.log("📤 Sending UCI command to engine:", event.data);
    // Forward to Stockfish's original handler
    if (stockfishOnMessage) {
      stockfishOnMessage.call(self, event);
    }
  }
};

// Function to send commands to the engine
const sendToEngine = (command) => {
  console.log("📤 Sending to Stockfish engine:", command);
  // For direct worker API, we send as if it came from main thread
  if (stockfishOnMessage) {
    stockfishOnMessage.call(self, { data: command });
  } else {
    console.error("❌ No way to send command to Stockfish engine");
  }
};

// Initialize UCI protocol
setTimeout(() => {
  console.log("🎯 Starting UCI protocol...");
  sendToEngine("uci");
}, 100);

console.log("✅ Stockfish Worker initialized");

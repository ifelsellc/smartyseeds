// Stockfish Web Worker - Legacy Direct Worker API
console.log("🚀 Initializing Stockfish Worker...");

let isInitialized = false;

// Load Stockfish script
try {
  importScripts("/stockfish.js");
  console.log("✅ Stockfish loaded successfully");
} catch (error) {
  console.error("❌ Failed to load Stockfish:", error);
  self.postMessage({
    type: "error",
    data: "Failed to load Stockfish: " + error.message,
  });
}

// Store the original postMessage to communicate with main thread
const originalPostMessage = self.postMessage;
// Store the original onmessage handler from Stockfish
const stockfishOnMessage = self.onmessage;

// Override postMessage to intercept engine output
self.postMessage = function (data) {
  if (typeof data === "string") {
    // This is engine output - forward to main thread
    originalPostMessage.call(self, {
      type: "output",
      data: data,
    });

    // Handle UCI protocol
    if (data.includes("uciok")) {
      console.log("✅ UCI protocol established");
      isInitialized = true;
      originalPostMessage.call(self, {
        type: "ready",
        data: "Engine ready",
      });
    }
  } else {
    // This is our message to main thread
    originalPostMessage.call(self, data);
  }
};

// Send command to engine using Stockfish's original handler
function sendCommand(command) {
  if (stockfishOnMessage) {
    stockfishOnMessage.call(self, { data: command });
  } else {
    console.error("❌ No Stockfish message handler available");
  }
}

// Initialize UCI protocol
function initializeUCI() {
  console.log("🎯 Starting UCI protocol...");
  sendCommand("uci");
}

// Handle messages from main thread
self.onmessage = function (event) {
  const { type, data } = event.data;

  switch (type) {
    case "command":
      sendCommand(data);
      break;
    default:
      console.warn("Unknown message type:", type);
  }
};

// Start UCI protocol after a short delay for WASM initialization
setTimeout(() => {
  initializeUCI();
}, 1000);

console.log("✅ Stockfish Worker initialized");

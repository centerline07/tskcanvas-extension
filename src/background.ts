/**
 * Background Service Worker
 * Handles extension lifecycle and message passing
 * 
 * Note: Clerk auth is handled in the popup via ClerkProvider and hooks
 */

// Log extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("[tskcanvas] Extension installed")
})

// Handle any background messages if needed in the future
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("[tskcanvas] Message received:", request.type)

  // Placeholder for future background tasks
  if (request.type === "ping") {
    sendResponse({ status: "pong" })
    return false
  }

  return false
})

export {}

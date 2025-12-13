/**
 * Tab capture helper functions
 */

export interface Tab {
  url: string
  title: string
  favIconUrl?: string
}

// URLs to exclude from capture (browser internal pages)
const EXCLUDED_URL_PREFIXES = [
  "chrome://",
  "chrome-extension://",
  "edge://",
  "about:",
  "moz-extension://",
  "file://",
  "devtools://"
]

/**
 * Get all tabs from the current browser window
 * Filters out internal browser pages
 */
export async function getAllTabs(): Promise<Tab[]> {
  const tabs = await chrome.tabs.query({ currentWindow: true })

  return tabs
    .filter((tab) => {
      if (!tab.url) return false
      return !EXCLUDED_URL_PREFIXES.some((prefix) => tab.url!.startsWith(prefix))
    })
    .map((tab) => ({
      url: tab.url!,
      title: tab.title || new URL(tab.url!).hostname,
      favIconUrl: tab.favIconUrl
    }))
}

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
 * Get tabs from browser windows
 * @param currentWindowOnly - If true, only get tabs from current window. Otherwise get from all windows.
 * Filters out internal browser pages and non-normal windows (popups, devtools, etc.)
 */
export async function getAllTabs(currentWindowOnly = false): Promise<Tab[]> {
  const query = currentWindowOnly 
    ? { currentWindow: true } 
    : { windowType: "normal" as const }
  const tabs = await chrome.tabs.query(query)

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

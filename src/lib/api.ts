/**
 * API functions for communicating with tskcanvas Convex backend
 */

// Convex HTTP routes URL (note: .convex.site for HTTP, not .convex.cloud)
// .convex.cloud = client API (queries, mutations)
// .convex.site = HTTP routes
const CONVEX_URL = "https://fabulous-goldfish-116.convex.site"

// Debug: Log the URL at module load
console.log("[tskcanvas] API module loaded, CONVEX_URL:", CONVEX_URL)

export interface SaveTabsResponse {
  success: boolean
  treeId: string
  url: string
}

export interface SaveTabsError {
  success: false
  error: string
}

/**
 * Save tabs to tskcanvas as a new tree
 */
export async function saveTabsToTree(
  token: string,
  treeName: string,
  tabs: Array<{ url: string; title: string; favIconUrl?: string }>
): Promise<SaveTabsResponse> {
  console.log("[tskcanvas] Saving tabs to:", `${CONVEX_URL}/api/extension/save-tabs`)
  console.log("[tskcanvas] Token:", token ? "present" : "missing")
  console.log("[tskcanvas] Tree name:", treeName)
  console.log("[tskcanvas] Tabs count:", tabs.length)

  try {
    const response = await fetch(`${CONVEX_URL}/api/extension/save-tabs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ treeName, tabs })
    })

    console.log("[tskcanvas] Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[tskcanvas] Error response:", errorText)
      throw new Error(`Failed to save tabs: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    console.log("[tskcanvas] Success:", result)
    return result
  } catch (error) {
    console.error("[tskcanvas] Fetch error:", error)
    throw error
  }
}

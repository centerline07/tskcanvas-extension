/**
 * API functions for communicating with tskcanvas Convex backend
 */

const CONVEX_URL = process.env.PLASMO_PUBLIC_CONVEX_URL!

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
  const response = await fetch(`${CONVEX_URL}/api/extension/save-tabs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ treeName, tabs })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to save tabs: ${response.status} ${errorText}`)
  }

  return response.json()
}

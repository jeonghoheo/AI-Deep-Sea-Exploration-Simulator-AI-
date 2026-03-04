import type { ExploreResponse } from './types'

function getBackendBaseUrl() {
  return import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8000'
}

export async function explore(depthM: number): Promise<ExploreResponse> {
  const res = await fetch(`${getBackendBaseUrl()}/explore`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ depth_m: Math.round(depthM) }),
  })

  if (!res.ok) {
    throw new Error(`explore_failed:${res.status}`)
  }

  return (await res.json()) as ExploreResponse
}


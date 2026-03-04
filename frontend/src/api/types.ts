export type ExploreEvent = {
  type: string
  name: string
  danger: number
  description: string
  depth_m: number
}

export type ExploreResponse = {
  ok: boolean
  event: ExploreEvent
}


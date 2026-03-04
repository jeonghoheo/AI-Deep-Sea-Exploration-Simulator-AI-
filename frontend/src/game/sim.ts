import {
  CANVAS_H,
  CANVAS_W,
  DIVER_H,
  DIVER_W,
  METERS_PER_PIXEL,
  SPEED_X,
  SPEED_Y,
} from './constants'
import type { Camera, Creature, Diver, Keys, Mouse } from './types'

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

export function createDiver(): Diver {
  return {
    pos: { x: CANVAS_W / 2 - DIVER_W / 2, y: 40 },
    vel: { x: 0, y: 0 },
    harpoonAngle: 0,
    isAiming: false,
    harpoonDist: 0,
    harpoonState: 'idle',
  }
}

export function createCamera(): Camera {
  return { y: 0 }
}

function desiredVelocity(keys: Keys) {
  const vx = (keys.right ? 1 : 0) - (keys.left ? 1 : 0)
  const vy = (keys.down ? 1 : 0) - (keys.up ? 1 : 0)
  return { x: vx * SPEED_X, y: vy * SPEED_Y }
}

export function stepDiver(
  diver: Diver,
  keys: Keys,
  mouse: Mouse,
  camera: Camera,
  dt: number,
  scale: number,
) {
  // Movement: Arrows & WASD
  const desired = desiredVelocity(keys)
  diver.vel.x = desired.x
  diver.vel.y = desired.y

  diver.pos.x += diver.vel.x * dt
  diver.pos.y += diver.vel.y * dt

  const w = DIVER_W * scale
  diver.pos.x = clamp(diver.pos.x, 8, CANVAS_W - w - 8)
  diver.pos.y = clamp(diver.pos.y, 8, 1e9)

  // Aiming logic (Mouse Left Click detection)
  const wasAiming = diver.isAiming
  diver.isAiming = mouse.leftClick

  if (diver.isAiming) {
    // Mouse aiming
    const dw = DIVER_W * scale
    const dh = DIVER_H * scale
    const dx = diver.pos.x + dw / 2
    const dy = diver.pos.y + dh / 2 - camera.y

    const targetAngle = Math.atan2(mouse.y - dy, mouse.x - dx)

    // Smoothly interpolate towards target angle
    let diff = targetAngle - diver.harpoonAngle
    while (diff > Math.PI) diff -= Math.PI * 2
    while (diff < -Math.PI) diff += Math.PI * 2

    const lerpSpeed = 15 // Faster for mouse
    diver.harpoonAngle += diff * lerpSpeed * dt
  } else if (wasAiming && diver.harpoonState === 'idle') {
    // Fired!
    diver.harpoonState = 'firing'
    diver.harpoonDist = 0
  }

  // Harpoon animation
  const maxDist = 180 * scale
  const fireSpeed = 800 * scale
  const retractSpeed = 400 * scale

  if (diver.harpoonState === 'firing') {
    diver.harpoonDist += fireSpeed * dt
    if (diver.harpoonDist >= maxDist) {
      diver.harpoonState = 'retracting'
    }
  } else if (diver.harpoonState === 'retracting') {
    diver.harpoonDist -= retractSpeed * dt
    if (diver.harpoonDist <= 0) {
      diver.harpoonDist = 0
      diver.harpoonState = 'idle'
    }
  }
}

export function checkEat(diver: Diver, creatures: Creature[], scale: number): string | null {
  const dw = DIVER_W * scale
  const dh = DIVER_H * scale
  const dx = diver.pos.x + dw / 2
  const dy = diver.pos.y + dh / 2

  // Check harpoon catch when firing
  if (diver.harpoonState === 'firing') {
    const tipX = dx + Math.cos(diver.harpoonAngle) * diver.harpoonDist
    const tipY = dy + Math.sin(diver.harpoonAngle) * diver.harpoonDist

    for (let i = 0; i < creatures.length; i++) {
      const c = creatures[i]
      const cx = c.pos.x + (c.kind === 'shark' ? 20 : 4)
      const cy = c.pos.y + (c.kind === 'shark' ? 10 : 2)
      
      const dist = Math.sqrt((tipX - cx) ** 2 + (tipY - cy) ** 2)
      if (dist < 20 * scale) {
        const kind = c.kind
        creatures.splice(i, 1)
        diver.harpoonState = 'retracting' // Immediately retract on catch
        return kind
      }
    }
  }

  // Normal body collision (Sharks still hurt)
  for (let i = 0; i < creatures.length; i++) {
    const c = creatures[i]
    if (c.kind !== 'shark') continue

    const cx = c.pos.x + 20
    const cy = c.pos.y + 10

    const dist = Math.sqrt((dx - cx) ** 2 + (dy - cy) ** 2)
    if (dist < Math.max(25, scale * 15)) {
      creatures.splice(i, 1)
      return 'shark'
    }
  }
  return null
}

export function followCamera(camera: Camera, diver: Diver, scale: number) {
  const dh = DIVER_H * scale
  const target = diver.pos.y - CANVAS_H * 0.35 + dh / 2
  camera.y = Math.max(0, target)
}

export function computeDepthM(diver: Diver) {
  return Math.max(0, Math.floor((diver.pos.y - 40) * METERS_PER_PIXEL))
}


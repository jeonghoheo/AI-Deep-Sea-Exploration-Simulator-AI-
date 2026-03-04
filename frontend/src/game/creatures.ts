import { CANVAS_H, CANVAS_W } from "./constants";
import type { Camera, Creature, CreatureKind } from "./types";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function rand01(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pickKind(depthM: number, r: number, diverScale: number): CreatureKind {
  // Shark chance increases as diver grows
  let sharkChance = 0.05; // Base 5%
  if (diverScale > 3.5) sharkChance = 0.4;
  else if (diverScale > 2.5) sharkChance = 0.25;
  else if (diverScale > 1.5) sharkChance = 0.12;

  if (r > 1 - sharkChance) return "shark";

  if (depthM < 300) {
    if (r < 0.6) return "fish";
    if (r < 0.8) return "jelly";
    return "ray";
  }
  if (depthM < 900) {
    if (r < 0.4) return "fish";
    if (r < 0.6) return "eel";
    if (r < 0.8) return "jelly";
    return "squid";
  }
  if (r < 0.3) return "eel";
  if (r < 0.6) return "angler";
  if (r < 0.8) return "squid";
  return "jelly";
}

function baseSpeed(kind: CreatureKind) {
  if (kind === "jelly") return 18;
  if (kind === "angler") return 28;
  if (kind === "eel") return 42;
  if (kind === "squid") return 65;
  if (kind === "ray") return 35;
  if (kind === "shark") return 110;
  return 55;
}

export function updateCreatures(
  creatures: Creature[],
  camera: Camera,
  depthM: number,
  dt: number,
  timeS: number,
  diverScale: number
) {
  for (const c of creatures) {
    const wobble = Math.sin(timeS * 2 + c.phase) * 10;
    c.pos.x += (c.vel.x + wobble) * dt;
    c.pos.y += c.vel.y * dt;
  }

  const minY = camera.y - 80;
  const maxY = camera.y + CANVAS_H + 80;
  for (let i = creatures.length - 1; i >= 0; i--) {
    const c = creatures[i];
    if (
      c.pos.y < minY ||
      c.pos.y > maxY ||
      c.pos.x < -120 ||
      c.pos.x > CANVAS_W + 120
    ) {
      creatures.splice(i, 1);
    }
  }

  const target = clamp(15 + Math.floor(depthM / 200), 15, 35);
  while (creatures.length < target) {
    creatures.push(spawnCreature(camera, depthM, timeS, diverScale));
  }
}

let nextId = 1;

export function spawnCreature(
  camera: Camera,
  depthM: number,
  timeS: number,
  diverScale: number
): Creature {
  const id = nextId++;
  const r1 = rand01(id * 19.31 + depthM * 0.017 + timeS * 0.11);
  const r2 = rand01(id * 91.7 + depthM * 0.013 + timeS * 0.07);
  const r3 = rand01(id * 7.77 + depthM * 0.021 + timeS * 0.05);

  const kind = pickKind(depthM, r1, diverScale);
  const fromLeft = r2 < 0.5;
  const x = fromLeft ? -30 : CANVAS_W + 30;
  const y = camera.y + r3 * CANVAS_H;

  const speed = baseSpeed(kind) * (0.75 + r3 * 0.8);
  const vx = fromLeft ? speed : -speed;
  const vy = (rand01(r2 * 999.1) - 0.5) * (kind === "jelly" ? 10 : 18);

  return {
    id,
    kind,
    pos: { x, y },
    vel: { x: vx, y: vy },
    phase: rand01(r1 * 123.4) * Math.PI * 2
  };
}

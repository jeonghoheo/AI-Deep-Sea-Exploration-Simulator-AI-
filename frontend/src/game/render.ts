import { CANVAS_H, CANVAS_W, DIVER_H, DIVER_W, TILE } from "./constants";
import type { Camera, Creature, Diver } from "./types";

function clear(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#050a14";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function drawGrid(ctx: CanvasRenderingContext2D, camera: Camera, diver: Diver, timeS: number) {
  const { y: cameraY } = camera;
  const top = Math.floor(cameraY / TILE) * TILE;

  // Background gradient based on depth
  const depthFactor = Math.min(1, cameraY / 5000);
  const r = Math.floor(5 * (1 - depthFactor));
  const g = Math.floor(10 + 20 * (1 - depthFactor));
  const b = Math.floor(20 + 40 * (1 - depthFactor));
  
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Background decorations (Rocks, Seaweed)
  const seed = Math.floor(cameraY / 200);
  for (let i = 0; i < 5; i++) {
    const rx = ((seed * 137.5 + i * 91.1) % CANVAS_W);
    const ry = ((seed * 221.3 + i * 47.7) % (CANVAS_H + 200)) - 100;
    
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = depthFactor > 0.5 ? "#222" : "#3a4a5a";
    // Simple Rock
    ctx.beginPath();
    ctx.arc(rx, ry, 20 + i * 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Seaweed
    ctx.strokeStyle = "#1a3a2a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rx + 10, ry + 20);
    for (let j = 0; j < 5; j++) {
      const sw = Math.sin(timeS * 2 + i + j) * 10;
      ctx.lineTo(rx + 10 + sw, ry + 20 - j * 10);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Floating particles (Marine snow)
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  for (let i = 0; i < 20; i++) {
    const px = (i * 123 + timeS * 10) % CANVAS_W;
    const py = (i * 456 + timeS * 15) % CANVAS_H;
    ctx.fillRect(px, py, 1, 1);
  }

  // Parallax background elements
  const offsetX = -diver.pos.x * 0.05;
  
  for (let y = top; y < cameraY + CANVAS_H + TILE; y += TILE) {
    const yy = y - cameraY;
    
    // Grid lines with parallax
    ctx.globalAlpha = 0.05 + 0.1 * (1 - depthFactor);
    ctx.strokeStyle = "#7ad9ff";
    ctx.beginPath();
    ctx.moveTo(0, yy);
    ctx.lineTo(CANVAS_W, yy);
    ctx.stroke();

    // Vertical lines with horizontal parallax
    if (y % (TILE * 4) === 0) {
      for (let x = (offsetX % (TILE * 4)); x < CANVAS_W; x += TILE * 4) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_H);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  // Deep sea "veils" or patterns
  ctx.globalAlpha = 0.1;
  const patternShift = (cameraY * 0.2) % CANVAS_H;
  const gradient = ctx.createLinearGradient(0, -patternShift, 0, CANVAS_H - patternShift);
  gradient.addColorStop(0, "transparent");
  gradient.addColorStop(0.5, `rgba(0, ${50 * (1 - depthFactor)}, ${100 * (1 - depthFactor)}, 0.3)`);
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.globalAlpha = 1;
}

function drawBubbles(ctx: CanvasRenderingContext2D, timeS: number) {
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#c8f5ff";
  for (let i = 0; i < 30; i++) {
    const x = (i * 67 + timeS * 23) % CANVAS_W;
    const y = (CANVAS_H - ((i * 91 + timeS * 38) % (CANVAS_H + 120))) | 0;
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.globalAlpha = 1;
}

function drawDiver(
  ctx: CanvasRenderingContext2D,
  diver: Diver,
  camera: Camera,
  timeS: number,
  scale: number
) {
  const x = Math.round(diver.pos.x);
  const y = Math.round(diver.pos.y - camera.y);

  // Animation factors
  const isMoving = Math.abs(diver.vel.x) > 1 || Math.abs(diver.vel.y) > 1;
  const anim = isMoving ? Math.sin(timeS * 10) : Math.sin(timeS * 2);
  const legAnim = isMoving ? Math.sin(timeS * 12) : 0;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Oxygen Tank (on back)
  ctx.fillStyle = "#333";
  ctx.fillRect(1, 4 + anim * 0.5, 3, 8);

  // Body (Yellow Wetsuit)
  ctx.fillStyle = "#ffcc00";
  ctx.fillRect(3, 5, 6, 7); // torso

  // Legs (Animated)
  ctx.fillRect(4, 12, 2, 3 + legAnim * 2); // left leg
  ctx.fillRect(7, 12, 2, 3 - legAnim * 2); // right leg

  // Arms (Animated)
  ctx.save();
  ctx.translate(2, 8);
  ctx.rotate(anim * 0.2);
  ctx.fillRect(-1, -2, 2, 4); // left arm
  ctx.restore();

  ctx.save();
  ctx.translate(10, 8);
  ctx.rotate(-anim * 0.2);
  ctx.fillRect(-1, -2, 2, 4); // right arm
  ctx.restore();

  // Face/Head
  ctx.fillStyle = "#e0ac69"; // skin tone
  ctx.fillRect(4, 1 + anim * 0.3, 5, 4);

  // Mask (Blue)
  ctx.fillStyle = "#4db8ff";
  ctx.fillRect(4, 2 + anim * 0.3, 5, 2);
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#fff";
  ctx.fillRect(7, 2 + anim * 0.3, 1, 1); // shine
  ctx.globalAlpha = 1.0;

  // Flippers (Black)
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(3, 15 + legAnim * 2, 3, 2);
  ctx.fillRect(7, 15 - legAnim * 2, 3, 2);

  // Belt/Details
  ctx.fillStyle = "#333";
  ctx.fillRect(3, 9, 6, 1);

  // Harpoon (When aiming or firing)
  if (diver.isAiming || diver.harpoonState !== "idle") {
    ctx.save();
    ctx.translate(DIVER_W / 2, DIVER_H / 2);
    ctx.rotate(diver.harpoonAngle);

    // Harpoon Line (Dash only when aiming)
    if (diver.isAiming) {
      const maxDist = 180; // Match sim.ts maxDist base
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(maxDist, 0);
      ctx.stroke();

      // Harpoon "Flash" at target (only when aiming)
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(maxDist, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Harpoon Body & Tip (Use harpoonDist if firing/retracting)
    const dist = diver.harpoonState !== "idle" ? (diver.harpoonDist / scale) : 30;

    ctx.fillStyle = "#777";
    ctx.fillRect(0, -1, dist, 2);

    ctx.fillStyle = "#ccc";
    ctx.beginPath();
    ctx.moveTo(dist, -2);
    ctx.lineTo(dist + 8, 0);
    ctx.lineTo(dist, 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function drawCreatures(
  ctx: CanvasRenderingContext2D,
  creatures: Creature[],
  camera: Camera,
  timeS: number
) {
  for (const c of creatures) {
    const x = Math.round(c.pos.x);
    const y = Math.round(c.pos.y - camera.y);
    if (y < -40 || y > CANVAS_H + 40) continue;

    // Seed-based color variation
    const seed = c.id * 137.5;
    const hue = (seed % 360).toFixed(0);
    const anim = Math.sin(timeS * 8 + c.phase);

    if (c.kind === "fish") {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(anim * 0.1);
      ctx.fillStyle = `hsl(${hue}, 70%, 75%)`;
      ctx.fillRect(0, 0, 6, 2);
      ctx.fillRect(2, -1, 2, 1);
      ctx.fillStyle = "#1b2a44";
      ctx.fillRect(4, 0, 1, 1);
      // Tail wiggle
      ctx.fillStyle = `hsl(${hue}, 70%, 75%)`;
      ctx.fillRect(-2, 0, 2, 2);
      ctx.restore();
      continue;
    }

    if (c.kind === "eel") {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `hsl(${(Number(hue) + 180) % 360}, 60%, 65%)`;
      for (let i = 0; i < 4; i++) {
        const segAnim = Math.sin(timeS * 10 + c.phase + i * 0.5);
        ctx.fillRect(i * 3, segAnim * 2, 4, 2);
      }
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#c8f5ff";
      ctx.fillRect(1, -1, 2, 1);
      ctx.globalAlpha = 1;
      ctx.restore();
      continue;
    }

    if (c.kind === "angler") {
      ctx.save();
      ctx.translate(x, y);
      // Light dangle animation
      const dangle = Math.sin(timeS * 5);
      ctx.fillStyle = "#ffd27a";
      ctx.fillRect(6 + dangle, -3, 1, 2);
      ctx.fillStyle = "#ff5a7a";
      ctx.fillRect(6 + dangle, -4, 1, 1);

      ctx.fillStyle = "#1b2a44";
      ctx.fillRect(0, 0, 10, 6);
      ctx.fillStyle = "#7ad9ff";
      ctx.fillRect(1, 1, 1, 1);
      ctx.restore();
      continue;
    }

    if (c.kind === "squid") {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
      ctx.fillRect(0, 0, 8, 4);
      // Pulsing tentacles
      const tentAnim = Math.abs(Math.sin(timeS * 6));
      ctx.fillRect(-4 - tentAnim * 2, 1, 4, 1);
      ctx.fillRect(-4 - tentAnim * 2, 2, 4, 1);
      ctx.fillStyle = "#1b2a44";
      ctx.fillRect(5, 1, 1, 1); // eye
      ctx.restore();
      continue;
    }

    if (c.kind === "ray") {
      ctx.save();
      ctx.translate(x, y);
      const flap = Math.sin(timeS * 4) * 4;
      ctx.fillStyle = `hsl(${(Number(hue) + 60) % 360}, 40%, 50%)`;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(12, -4 + flap);
      ctx.lineTo(16, 0);
      ctx.lineTo(12, 4 - flap);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(16, 0, 6, 1); // tail
      ctx.restore();
      continue;
    }

    if (c.kind === "shark") {
      ctx.fillStyle = "#788694"; // shark grey
      const dir = c.vel.x > 0 ? 1 : -1;
      const sharkAnim = Math.sin(timeS * 12);

      ctx.save();
      ctx.translate(x + (dir === -1 ? 40 : 0), y);
      ctx.scale(dir, 1);

      // Body
      ctx.beginPath();
      ctx.ellipse(20, 10, 20, 8, sharkAnim * 0.05, 0, Math.PI * 2);
      ctx.fill();

      // Tail (Animated)
      ctx.save();
      ctx.translate(5, 10);
      ctx.rotate(sharkAnim * 0.2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-10, -8);
      ctx.lineTo(-10, 8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Fin (Top)
      ctx.beginPath();
      ctx.moveTo(15, 2);
      ctx.lineTo(10, -6);
      ctx.lineTo(25, 2);
      ctx.closePath();
      ctx.fill();

      // Eye
      ctx.fillStyle = "#fff";
      ctx.fillRect(32, 7, 2, 2);
      ctx.fillStyle = "#000";
      ctx.fillRect(33, 7, 1, 1);

      // Gills
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.moveTo(12, 6);
      ctx.lineTo(12, 14);
      ctx.moveTo(15, 6);
      ctx.lineTo(15, 14);
      ctx.stroke();

      ctx.restore();
      continue;
    }

    // Jellyfish
    ctx.save();
    ctx.translate(x, y);
    const jellyAnim = Math.sin(timeS * 3) * 2;
    ctx.fillStyle = "#c8f5ff";
    ctx.globalAlpha = 0.22;
    ctx.fillRect(0, jellyAnim, 8, 4);
    ctx.fillRect(1, 4 + jellyAnim, 1, 4 + Math.sin(timeS * 5) * 2);
    ctx.fillRect(3, 4 + jellyAnim, 1, 5 + Math.cos(timeS * 4) * 2);
    ctx.fillRect(6, 4 + jellyAnim, 1, 4 + Math.sin(timeS * 6) * 2);
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  diver: Diver,
  camera: Camera,
  creatures: Creature[],
  timeS: number,
  scale: number,
  effects: { hitFlash: number; shake: number }
) {
  ctx.save();
  if (effects.shake > 0) {
    const sx = (Math.random() - 0.5) * effects.shake * 10;
    const sy = (Math.random() - 0.5) * effects.shake * 10;
    ctx.translate(sx, sy);
  }

  clear(ctx);
  drawGrid(ctx, camera, diver, timeS);
  drawBubbles(ctx, timeS);
  drawCreatures(ctx, creatures, camera, timeS);
  drawDiver(ctx, diver, camera, timeS, scale);

  if (effects.hitFlash > 0) {
    ctx.globalAlpha = effects.hitFlash * 0.4;
    ctx.fillStyle = "#ff5a7a";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.globalAlpha = 1.0;
  }

  ctx.restore();
}

import type { Keys } from "./types";

export function createKeys(): Keys {
  return { left: false, right: false, up: false, down: false };
}

function setKey(keys: Keys, e: KeyboardEvent, down: boolean) {
  const k = e.key.toLowerCase();
  const code = e.code;

  // Movement (Arrows: e.key / WASD: e.code for layout independence)
  if (k === "arrowleft" || code === "KeyA") keys.left = down;
  if (k === "arrowright" || code === "KeyD") keys.right = down;
  if (k === "arrowup" || code === "KeyW") keys.up = down;
  if (k === "arrowdown" || code === "KeyS") keys.down = down;
}

export function bindKeyboard(keys: Keys) {
  const onDown = (e: KeyboardEvent) => setKey(keys, e, true);
  const onUp = (e: KeyboardEvent) => setKey(keys, e, false);
  window.addEventListener("keydown", onDown);
  window.addEventListener("keyup", onUp);

  return () => {
    window.removeEventListener("keydown", onDown);
    window.removeEventListener("keyup", onUp);
  };
}

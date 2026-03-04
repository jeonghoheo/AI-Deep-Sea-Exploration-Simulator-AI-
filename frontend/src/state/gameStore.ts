import { create } from "zustand";
import type { Language } from "../game/i18n";

type GameStatus = "ready" | "running" | "paused" | "game_over";

type GameState = {
  oxygen: number;
  depthM: number;
  inventory: string[];
  status: GameStatus;
  diverScale: number;
  language: Language;
};

type GameActions = {
  setDepthM: (depthM: number) => void;
  consumeOxygen: (amount: number) => void;
  addInventory: (item: string) => void;
  setStatus: (status: GameStatus) => void;
  setLanguage: (lang: Language) => void;
  gameOver: () => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  eat: (kind: string) => void;
  shrink: () => void;
};

const initialState: GameState = {
  oxygen: 100,
  depthM: 0,
  inventory: [],
  status: "ready",
  diverScale: 1.0,
  language: "KO"
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,
  setDepthM: (depthM) => set({ depthM }),
  consumeOxygen: (amount) => {
    if (get().status !== "running") return;
    const next = Math.max(0, get().oxygen - amount);
    set({ oxygen: next });
    if (next <= 0) set({ status: "game_over" });
  },
  addInventory: (item) =>
    set((s) => ({ inventory: [...s.inventory, item].slice(0, 12) })),
  setStatus: (status) => set({ status }),
  setLanguage: (language) => set({ language }),
  gameOver: () => set({ status: "game_over", oxygen: 0 }),
  start: () => set({ status: "running" }),
  pause: () =>
    set((s) => ({ status: s.status === "running" ? "paused" : s.status })),
  resume: () =>
    set((s) => ({ status: s.status === "paused" ? "running" : s.status })),
  reset: () => set({ ...initialState, language: get().language }),
  eat: (kind) => {
    let growth = 0.02;
    if (kind === "jelly") growth = 0.03;
    if (kind === "eel") growth = 0.05;
    if (kind === "angler") growth = 0.08;
    if (kind === "squid") growth = 0.1;
    if (kind === "ray") growth = 0.12;

    const oldScale = get().diverScale;
    const newScale = Math.min(4.0, oldScale + growth);

    // Trigger sound
    import("../game/sound").then((m) => {
      m.playEatSound();
      m.playHarpoonSound(); // Add harpoon catch sound
      // Level up sound every 0.5 increase
      if (Math.floor(newScale * 2) > Math.floor(oldScale * 2)) {
        m.playLevelUpSound();
      }
    });

    set((s) => ({
      diverScale: newScale,
      oxygen: Math.min(100, s.oxygen + growth * 100)
    }));
  },
  shrink: () => {
    const s = get();
    if (s.status !== "running") return;

    // Shrink by 0.04 (equivalent to 2 fish)
    const newScale = Math.max(1.0, s.diverScale - 0.04);

    // Trigger hit sound (reusing eat sound or adding a new one)
    import("../game/sound").then((m) => {
      // play a lower frequency sound for hit
      m.playHitSound();
    });

    set({ diverScale: newScale });
  }
}));

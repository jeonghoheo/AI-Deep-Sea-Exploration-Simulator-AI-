export type Vec2 = { x: number; y: number };

export type Keys = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

export type Mouse = {
  x: number;
  y: number;
  leftClick: boolean;
};

export type Diver = {
  pos: Vec2;
  vel: Vec2;
  harpoonAngle: number;
  isAiming: boolean;
  harpoonDist: number;
  harpoonState: "idle" | "firing" | "retracting";
};

export type Camera = {
  y: number;
};

export type CreatureKind =
  | "fish"
  | "jelly"
  | "angler"
  | "eel"
  | "squid"
  | "ray"
  | "shark";

export type Creature = {
  id: number;
  kind: CreatureKind;
  pos: Vec2;
  vel: Vec2;
  phase: number;
};

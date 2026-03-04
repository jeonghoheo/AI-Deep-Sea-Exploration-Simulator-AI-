import { useEffect, useMemo, useRef } from "react";
import { CANVAS_H, CANVAS_W } from "../game/constants";
import { updateCreatures } from "../game/creatures";
import { bindKeyboard, createKeys } from "../game/input";
import { renderFrame } from "../game/render";
import {
  checkEat,
  computeDepthM,
  createCamera,
  createDiver,
  followCamera,
  stepDiver
} from "../game/sim";
import type { Creature } from "../game/types";

type Props = {
  paused: boolean;
  onTick: (p: { depthM: number; dt: number }) => void;
  onEat: (kind: string) => void;
  onHit: () => void;
  scale: number;
};

export function GameCanvas({ paused, onTick, onEat, onHit, scale }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const keys = useMemo(() => createKeys(), [])
  const mouseRef = useRef({ x: 0, y: 0, leftClick: false })
  const diverRef = useRef(createDiver())
  const cameraRef = useRef(createCamera())
  const creaturesRef = useRef<Creature[]>([])
  const lastMsRef = useRef<number | null>(null)
  const effectsRef = useRef({ hitFlash: 0, shake: 0 })

  useEffect(() => {
    const cleanup = bindKeyboard(keys)
    const onMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) mouseRef.current.leftClick = true
    }
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 0) mouseRef.current.leftClick = false
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      cleanup()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [keys])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let raf = 0
    const loop = (ms: number) => {
      const last = lastMsRef.current ?? ms
      lastMsRef.current = ms
      const dt = Math.min(0.05, Math.max(0, (ms - last) / 1000))

      // Update effects
      effectsRef.current.hitFlash = Math.max(0, effectsRef.current.hitFlash - dt * 2)
      effectsRef.current.shake = Math.max(0, effectsRef.current.shake - dt * 3)

      if (!paused) {
        stepDiver(
          diverRef.current,
          keys,
          mouseRef.current,
          cameraRef.current,
          dt,
          scale,
        )
        const kind = checkEat(diverRef.current, creaturesRef.current, scale)
        if (kind) {
          if (kind === 'shark') {
            effectsRef.current.hitFlash = 1.0
            effectsRef.current.shake = 1.0
            onHit()
          } else {
            onEat(kind)
          }
        }
      }
      followCamera(cameraRef.current, diverRef.current, scale)

      const depthM = computeDepthM(diverRef.current)
      if (!paused) onTick({ depthM, dt })

      if (!paused) {
        updateCreatures(
          creaturesRef.current,
          cameraRef.current,
          depthM,
          dt,
          ms / 1000,
          scale,
        )
      }

      renderFrame(
        ctx,
        diverRef.current,
        cameraRef.current,
        creaturesRef.current,
        ms / 1000,
        scale,
        effectsRef.current
      )
      raf = window.requestAnimationFrame(loop)
    }

    raf = window.requestAnimationFrame(loop)
    return () => window.cancelAnimationFrame(raf)
  }, [keys, onTick, onEat, onHit, paused, scale]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      style={{
        imageRendering: 'pixelated',
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 14px 70px rgba(0,0,0,0.55)',
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}

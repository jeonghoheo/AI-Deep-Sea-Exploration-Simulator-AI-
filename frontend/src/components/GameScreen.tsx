import { useCallback, useMemo, useState } from 'react'
import { CANVAS_H, CANVAS_W, OXYGEN_DRAIN_PER_SEC } from '../game/constants'
import { useGameStore } from '../state/gameStore'
import { GameCanvas } from './GameCanvas'
import { GameOverOverlay } from './GameOverOverlay'
import { Hud } from './Hud'
import { translations } from '../game/i18n'

export function GameScreen() {
  const status = useGameStore((s) => s.status)
  const depthM = useGameStore((s) => s.depthM)
  const diverScale = useGameStore((s) => s.diverScale)
  const setDepthM = useGameStore((s) => s.setDepthM)
  const consumeOxygen = useGameStore((s) => s.consumeOxygen)
  const reset = useGameStore((s) => s.reset)
  const start = useGameStore((s) => s.start)
  const pause = useGameStore((s) => s.pause)
  const resume = useGameStore((s) => s.resume)
  const eat = useGameStore((s) => s.eat)
  const shrink = useGameStore((s) => s.shrink)
  const language = useGameStore((s) => s.language)
  const setLanguage = useGameStore((s) => s.setLanguage)

  const t = translations[language]

  const [loading] = useState(false)

  const isPaused = status === 'paused'
  const isReady = status === 'ready'
  const isGameOver = status === 'game_over'

  const gamePaused = useMemo(() => loading || status !== 'running', [
    loading,
    status,
  ])

  const onTick = useCallback(
    ({ depthM: d, dt }: { depthM: number; dt: number }) => {
      setDepthM(d)
      consumeOxygen(OXYGEN_DRAIN_PER_SEC * dt)
    },
    [consumeOxygen, setDepthM],
  )

  const onRestart = useCallback(() => {
    reset()
  }, [reset])

  const onEat = useCallback((kind: string) => {
    eat(kind)
  }, [eat])

  const onHit = useCallback(() => {
    shrink()
  }, [shrink])

  return (
    <div
      style={{
        position: 'relative',
        width: `min(95vw, ${CANVAS_W}px)`,
        height: `min(95vh, ${CANVAS_H}px)`,
        aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
        margin: '0 auto',
        overflow: 'hidden',
        borderRadius: 10,
        background: '#000',
      }}
    >
      <GameCanvas paused={gamePaused} onTick={onTick} onEat={onEat} onHit={onHit} scale={diverScale} />
      <Hud />

      {/* 언어 선택 버튼 */}
      {isReady && (
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            zIndex: 110,
          }}
        >
          <button
            onClick={() => setLanguage('KO')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: language === 'KO' ? '#45a7ff' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              fontWeight: language === 'KO' ? 'bold' : 'normal',
              fontSize: 14,
            }}
          >
            한국어
          </button>
          <button
            onClick={() => setLanguage('RU')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: language === 'RU' ? '#45a7ff' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              fontWeight: language === 'RU' ? 'bold' : 'normal',
              fontSize: 14,
            }}
          >
            Русский
          </button>
        </div>
      )}

      {/* 일시정지 버튼 */}
      {status === 'running' && !loading && (
        <button
          onClick={pause}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            padding: '6px 12px',
            borderRadius: 8,
            background: 'rgba(6, 12, 24, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            zIndex: 120,
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          <span>⏸</span> {t.pause}
        </button>
      )}

      {/* 시작 화면 */}
      {isReady && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(5,10,20,0.8)",
            backdropFilter: "blur(4px)",
            borderRadius: 10,
            zIndex: 100
          }}
        >
          <h1
            style={{
              marginBottom: 8,
              fontSize: 32,
              fontWeight: "bold",
              color: "#ffd27a",
              textAlign: "center"
            }}
          >
            DAVE THE DIVER
          </h1>
          <h2
            style={{
              marginBottom: 24,
              fontSize: 18,
              color: "#7ad9ff",
              textAlign: "center"
            }}
          >
            {t.title}
          </h2>
          <button
            onClick={start}
            style={{
              padding: "12px 32px",
              fontSize: 20,
              fontWeight: "bold",
              background: "#45a7ff",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(69, 167, 255, 0.4)"
            }}
          >
            {t.startGame}
          </button>
        </div>
      )}

      {/* 일시정지 화면 */}
      {isPaused && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(5,10,20,0.6)",
            backdropFilter: "blur(4px)",
            borderRadius: 10,
            zIndex: 100
          }}
        >
          <h2 style={{ marginBottom: 24, fontSize: 24, color: "#fff" }}>
            {t.paused}
          </h2>
          <button
            onClick={resume}
            style={{
              padding: "12px 32px",
              fontSize: 18,
              background: "#45a7ff",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              marginBottom: 12,
              width: 200
            }}
          >
            {t.resume}
          </button>
          <button
            onClick={onRestart}
            style={{
              padding: "12px 32px",
              fontSize: 18,
              background: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8,
              cursor: "pointer",
              width: 200
            }}
          >
            {t.resetGame}
          </button>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 18,
          display: "flex",
          gap: 8,
          opacity: 0.92,
          fontSize: 12,
          pointerEvents: "none"
        }}
      >
        <span
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(6,12,24,0.65)",
            border: "1px solid rgba(255,255,255,0.12)"
          }}
        >
          {t.controls}
        </span>
      </div>

      {loading && (
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 18,
            padding: "8px 10px",
            borderRadius: 10,
            background: "rgba(6, 12, 24, 0.72)",
            border: "1px solid rgba(255,255,255,0.12)",
            fontSize: 12
          }}
        >
          심해 탐사 중...
        </div>
      )}

      {isGameOver && <GameOverOverlay depthM={depthM} onRestart={onRestart} />}
    </div>
  );
}

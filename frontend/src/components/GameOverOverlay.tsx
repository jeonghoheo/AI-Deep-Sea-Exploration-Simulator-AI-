import { useGameStore } from '../state/gameStore'
import { translations } from '../game/i18n'

type Props = {
  depthM: number
  onRestart: () => void
}

export function GameOverOverlay({ depthM, onRestart }: Props) {
  const lang = useGameStore((s) => s.language)
  const t = translations[lang]

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(0,0,0,0.72)',
      }}
    >
      <div
        style={{
          width: 420,
          maxWidth: 'calc(100% - 32px)',
          borderRadius: 14,
          padding: 16,
          background: 'rgba(12, 8, 16, 0.96)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 30px 120px rgba(0,0,0,0.75)',
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 900, color: '#ff5a7a' }}>
          {t.gameOver}
        </div>
        <div style={{ marginTop: 10, opacity: 0.92 }}>
          {t.finalDepth}: <strong>{depthM}m</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
          <button
            onClick={onRestart}
            style={{
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.16)',
              background: 'rgba(255, 90, 122, 0.20)',
              color: '#e6f0ff',
              padding: '10px 12px',
              cursor: 'pointer',
            }}
          >
            {t.restart}
          </button>
        </div>
      </div>
    </div>
  )
}


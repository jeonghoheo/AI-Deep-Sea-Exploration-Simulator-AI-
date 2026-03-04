import type { ExploreEvent } from '../api/types'

type Props = {
  event: ExploreEvent
  onClose: () => void
}

function dangerColor(d: number) {
  if (d >= 8) return '#ff5a7a'
  if (d >= 5) return '#ffd27a'
  return '#7ad9ff'
}

export function EventOverlay({ event, onClose }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(0,0,0,0.55)',
      }}
    >
      <div
        style={{
          width: 420,
          maxWidth: 'calc(100% - 32px)',
          borderRadius: 14,
          padding: 16,
          background: 'rgba(8, 14, 26, 0.95)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 30px 120px rgba(0,0,0,0.75)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <strong style={{ fontSize: 14, opacity: 0.92 }}>
            심해 사건 · {event.depth_m}m
          </strong>
          <span
            style={{
              fontSize: 12,
              padding: '2px 8px',
              borderRadius: 999,
              border: `1px solid ${dangerColor(event.danger)}`,
              color: dangerColor(event.danger),
            }}
          >
            위험도 {event.danger}/10
          </span>
        </div>

        <div style={{ marginTop: 10, fontSize: 20, fontWeight: 800 }}>
          {event.name}
        </div>
        <div style={{ marginTop: 6, opacity: 0.88, fontSize: 12 }}>
          type: <code>{event.type}</code>
        </div>

        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            lineHeight: 1.55,
            whiteSpace: 'pre-wrap',
          }}
        >
          {event.description}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
          <button
            onClick={onClose}
            style={{
              pointerEvents: 'auto',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.16)',
              background: 'rgba(69, 167, 255, 0.18)',
              color: '#e6f0ff',
              padding: '10px 12px',
              cursor: 'pointer',
            }}
          >
            계속 잠수하기
          </button>
        </div>
      </div>
    </div>
  )
}


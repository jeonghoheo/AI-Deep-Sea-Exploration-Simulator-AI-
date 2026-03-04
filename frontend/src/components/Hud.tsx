import { useGameStore } from "../state/gameStore";
import { translations } from "../game/i18n";

function pct(n: number) {
  return `${Math.max(0, Math.min(100, Math.round(n)))}%`;
}

export function Hud() {
  const oxygen = useGameStore((s) => s.oxygen);
  const depthM = useGameStore((s) => s.depthM);
  const diverScale = useGameStore((s) => s.diverScale);
  const lang = useGameStore((s) => s.language);
  const t = translations[lang];

  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
        width: '140px', // 조금 더 줄임
      }}
    >
      <div
        style={{
          padding: "8px 10px",
          borderRadius: 10,
          background: "rgba(6, 12, 24, 0.85)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(4px)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13
          }}
        >
          <strong>{t.depth}</strong>
          <span>{depthM}m</span>
        </div>
        <div style={{ marginTop: 6 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12
            }}
          >
            <strong>{t.oxygen}</strong>
            <span>{pct(oxygen)}</span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 999,
              background: "rgba(255,255,255,0.1)",
              overflow: "hidden",
              marginTop: 4
            }}
          >
            <div
              style={{
                width: pct(oxygen),
                height: "100%",
                transition: "width 0.3s ease-out",
                background:
                  oxygen <= 20
                    ? "#ff5a7a"
                    : oxygen <= 45
                      ? "#ffd27a"
                      : "#45a7ff"
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "8px 10px",
          borderRadius: 10,
          background: "rgba(6, 12, 24, 0.85)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(4px)"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13
          }}
        >
          <strong>{t.growth}</strong>
          <span style={{ color: "#ffd27a", fontWeight: "bold" }}>
            x{diverScale.toFixed(2)}
          </span>
        </div>
        <div
          style={{ marginTop: 4, fontSize: 10, opacity: 0.8, lineHeight: 1.1 }}
        >
          {diverScale >= 4.0 ? (
            <span style={{ color: "#ffd27a" }}>{t.maxGrowth}</span>
          ) : (
            <span>{t.eatToGrow}</span>
          )}
        </div>
      </div>
    </div>
  );
}

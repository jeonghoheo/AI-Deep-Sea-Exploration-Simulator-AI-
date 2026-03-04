# AI Deep Sea Exploration Simulator (AI 심해 탐사 시뮬레이터)

React와 HTML5 Canvas를 활용한 역동적인 심해 탐사 액션 게임입니다. 플레이어는 잠수부가 되어 심해를 탐험하며, 작살로 물고기를 사냥하여 몸집을 키우고 포식자들을 피해 더 깊은 곳으로 내려가야 합니다.

## 🎮 주요 게임 기능

- **성장 및 진화 시스템**: 물고기를 포획할수록 잠수부의 몸집(`Diver Scale`)이 커지며, 거대해진 몸집은 더 넓은 판정 범위와 산소 효율을 제공합니다.
- **마우스 기반 작살 사냥**: 
  - **조준**: 마우스 왼쪽 버튼을 누르고 있으면 커서 방향으로 작살 조준선이 나타납니다.
  - **발사**: 버튼을 떼는 순간 작살이 발사되어 원거리의 생물을 포획합니다.
- **동적 난이도 시스템**: 플레이어의 몸집이 커질수록 상어(포식자)가 나타날 확률이 4단계(5% -> 12% -> 25% -> 40%)로 증가하여 긴장감을 유지합니다.
- **AI 기반 심해 이벤트**: 수심 100m마다 FastAPI/LangGraph 백엔드와 통신하여 AI가 생성한 독특한 심해 사건과 선택지 오버레이가 발생합니다.
- **살아있는 심해 환경**:
  - 수심에 따라 변하는 배경색과 은은한 물결 효과.
  - 해초, 바위, 마린 스노우(심해 입자) 등 디테일한 배경 요소.
  - 패럴랙스(Parallax) 효과가 적용된 입체적인 공간감.
- **역동적인 애니메이션**: 잠수부의 팔다리 움직임과 각 해양 생물(상어, 장어, 오징어 등)의 고유한 헤엄 패턴을 픽셀 아트로 구현했습니다.
- **피격 임팩트**: 상어와 충돌 시 화면 흔들림(Camera Shake)과 붉은색 플래시 효과로 생생한 피격감을 제공합니다.

## 🕹 조작 방법

| 기능 | 키보드/마우스 |
| :--- | :--- |
| **이동** | `W`, `A`, `S`, `D` 또는 `방향키` |
| **작살 조준** | `마우스 왼쪽 버튼` (누르고 있기) |
| **작살 발사** | `마우스 왼쪽 버튼` (떼기) |
| **일시정지** | 화면 우측 상단 `Pause` 버튼 |

## 🛠 기술 스택 및 구조

### Frontend (React + Canvas + Zustand)
- **핵심 엔진**: HTML5 Canvas API를 통한 60fps 렌더링.
- **상태 관리**: `zustand`를 사용하여 산소, 깊이, 성장 등 전역 상태 관리. (`src/state/gameStore.ts`)
- **게임 로직**:
  - `src/game/sim.ts`: 물리 엔진, 작살 발사 로직, 충돌 감지.
  - `src/game/render.ts`: 배경 효과, 입자 시스템, 캐릭터 및 생물 애니메이션 렌더링.
  - `src/game/creatures.ts`: 생물별 스폰 확률 및 난이도 밸런싱 로직.
  - `src/game/input.ts`: 키보드 및 마우스 통합 입력 처리.

### Backend (FastAPI + LangGraph)
- **AI 엔진**: Anthropic Claude를 활용한 동적 이벤트 생성 (API Key 미설정 시 Mock 데이터 제공).

## 🚀 실행 방법

### 1. Backend 설치 및 실행
```bash
cd backend
python -m venv .venv
source .venv/bin/activate # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# (선택) export ANTHROPIC_API_KEY="your_key"
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend 설치 및 실행
```bash
cd frontend
npm install
npm run dev
```
브라우저에서 `http://localhost:5173` 접속 후 탐험을 시작하세요!

---
© 2026 AI Deep Sea Exploration Simulator. 모든 권리 보유.
# AI-Deep-Sea-Exploration-Simulator-AI-

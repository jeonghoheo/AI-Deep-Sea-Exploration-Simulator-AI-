from __future__ import annotations

import os
import random

from pydantic import BaseModel, Field


class EventModel(BaseModel):
    type: str
    name: str
    danger: int = Field(ge=1, le=10)
    description: str


def _seed(depth_m: int) -> int:
    return (depth_m * 2654435761) & 0xFFFFFFFF


def _mock_event(depth_m: int) -> EventModel:
    rng = random.Random(_seed(depth_m))
    pool = [
        ("fish", "심해 갈치", 5),
        ("ruins", "침몰선의 창문", 4),
        ("current", "비정상 해류 소용돌이", 7),
        ("item", "발광 해파리 샘플", 3),
        ("creature", "검은 촉수의 그림자", 8),
    ]
    t, name, danger = rng.choice(pool)
    desc = (
        f"{depth_m}m 부근. 헤드램프 빛이 닿는 순간, {name}이(가) 모습을 드러낸다.\n"
        "수압은 더 무겁고, 소리는 더 작다. 지금 선택이 생존을 좌우할지도 모른다."
    )
    return EventModel(type=t, name=name, danger=danger, description=desc)


async def generate_event(depth_m: int) -> EventModel:
    if not os.getenv("ANTHROPIC_API_KEY"):
        return _mock_event(depth_m)

    from pydantic_ai import Agent

    agent = Agent(
        "anthropic:claude-3-5-sonnet-latest",
        result_type=EventModel,
        system_prompt=(
            "너는 'AI 심해 탐사 게임'의 사건 생성기다.\n"
            "반드시 result_type 스키마를 만족하는 구조화된 값만 생성한다.\n"
            "danger는 1~10 정수.\n"
            "description은 한국어로, 도트 게임 분위기의 짧은 묘사(2~4문장)로 작성한다.\n"
        ),
    )
    result = await agent.run(f"깊이 {depth_m}m에서 발생할 사건을 생성해줘.")
    return result.data


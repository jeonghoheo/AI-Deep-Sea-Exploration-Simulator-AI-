from __future__ import annotations

from pydantic import BaseModel, Field


class ExploreRequest(BaseModel):
    depth_m: int = Field(ge=0, le=2_000_000)


class ExploreEvent(BaseModel):
    type: str
    name: str
    danger: int = Field(ge=1, le=10)
    description: str
    depth_m: int = Field(ge=0, le=2_000_000)


class ExploreResponse(BaseModel):
    ok: bool
    event: ExploreEvent


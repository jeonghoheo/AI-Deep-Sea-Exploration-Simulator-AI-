from __future__ import annotations

from typing import TypedDict

from langgraph.graph import END, StateGraph

from app.providers.event_provider import generate_event
from app.schemas import ExploreEvent


class ExploreState(TypedDict):
    depth_m: int
    event: ExploreEvent


async def _make_event(state: ExploreState) -> ExploreState:
    depth_m = state["depth_m"]
    ev = await generate_event(depth_m)
    state["event"] = ExploreEvent(
        type=ev.type,
        name=ev.name,
        danger=ev.danger,
        description=ev.description,
        depth_m=depth_m,
    )
    return state


def build_explore_graph():
    g = StateGraph(ExploreState)
    g.add_node("make_event", _make_event)
    g.set_entry_point("make_event")
    g.add_edge("make_event", END)
    return g.compile()


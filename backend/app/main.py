from __future__ import annotations

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.graph.explore_graph import build_explore_graph
from app.schemas import ExploreRequest, ExploreResponse

load_dotenv()

app = FastAPI(title="AI Deep Sea Exploration Simulator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[],
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

explore_graph = build_explore_graph()


@app.get("/health")
async def health():
    return {"ok": True}


@app.post("/explore", response_model=ExploreResponse)
async def explore(req: ExploreRequest):
    state = {"depth_m": req.depth_m}
    out = await explore_graph.ainvoke(state)
    return ExploreResponse(ok=True, event=out["event"])


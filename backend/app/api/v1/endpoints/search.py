from fastapi import APIRouter, Query

from app.api.deps import AnyAuthUser
from app.services.demo_data import global_search

router = APIRouter()


@router.get("")
async def search(_: AnyAuthUser, q: str = Query("", min_length=0, max_length=100)):
    return global_search(q)

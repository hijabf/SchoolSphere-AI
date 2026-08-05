from fastapi import APIRouter

from app.api.deps import ParentUser
from app.services.demo_data import parent_dashboard, STUDENTS

router = APIRouter()


@router.get("/dashboard")
async def dashboard(_: ParentUser, child_id: str | None = None):
    data = parent_dashboard()
    if child_id:
        child = next((s for s in STUDENTS if s["id"] == child_id), None)
        if child and child["id"] in [c["id"] for c in data["children"]]:
            data["selected_child"] = child
    return data


@router.get("/children")
async def children(_: ParentUser):
    return parent_dashboard()["children"]

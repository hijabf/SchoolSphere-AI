from fastapi import APIRouter

from app.api.deps import AdminUser
from app.services.demo_data import STUDENTS, TEACHERS, PARENTS, admin_dashboard

router = APIRouter()


@router.get("/dashboard")
async def dashboard(_: AdminUser):
    return admin_dashboard()


@router.get("/students")
async def list_students(_: AdminUser, class_name: str | None = None, risk: str | None = None, q: str | None = None):
    data = STUDENTS
    if class_name:
        data = [s for s in data if s["class_name"] == class_name]
    if risk:
        data = [s for s in data if s["risk_level"] == risk]
    if q:
        ql = q.lower()
        data = [s for s in data if ql in s["full_name"].lower()]
    return {"total": len(data), "items": data[:100]}


@router.get("/teachers")
async def list_teachers(_: AdminUser):
    return {"total": len(TEACHERS), "items": TEACHERS}


@router.get("/parents")
async def list_parents(_: AdminUser):
    return {"total": len(PARENTS), "items": PARENTS[:100]}

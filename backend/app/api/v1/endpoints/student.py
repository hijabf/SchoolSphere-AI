from fastapi import APIRouter

from app.api.deps import StudentUser
from app.services.demo_data import student_dashboard

router = APIRouter()


@router.get("/dashboard")
async def dashboard(_: StudentUser):
    return student_dashboard("stu-0001")

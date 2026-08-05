from fastapi import APIRouter
from pydantic import BaseModel

from app.api.deps import TeacherUser
from app.services.demo_data import teacher_dashboard

router = APIRouter()


class AttendanceMark(BaseModel):
    student_id: str
    status: str  # present|absent|late|excused


class AttendanceBatch(BaseModel):
    date: str
    class_name: str
    records: list[AttendanceMark]


@router.get("/dashboard")
async def dashboard(_: TeacherUser):
    return teacher_dashboard()


@router.post("/attendance")
async def take_attendance(_: TeacherUser, body: AttendanceBatch):
    return {
        "ok": True,
        "message": f"Attendance saved for {body.class_name} on {body.date}",
        "count": len(body.records),
    }


@router.get("/students")
async def my_students(_: TeacherUser):
    return teacher_dashboard()["students"]

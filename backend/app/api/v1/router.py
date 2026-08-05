from fastapi import APIRouter

from app.api.v1.endpoints import admin, ai, auth, parent, search, student, teacher

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(teacher.router, prefix="/teacher", tags=["teacher"])
api_router.include_router(parent.router, prefix="/parent", tags=["parent"])
api_router.include_router(student.router, prefix="/student", tags=["student"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(search.router, prefix="/search", tags=["search"])

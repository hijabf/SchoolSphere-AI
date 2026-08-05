"""FastAPI dependencies — auth & RBAC."""

from __future__ import annotations

from typing import Annotated, Optional
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import try_decode_supabase_or_local
from app.db.session import get_db
from app.models import User, UserRole
from app.services.demo_data import DEMO_USERS, get_demo_user

security = HTTPBearer(auto_error=False)


class CurrentUser:
    def __init__(
        self,
        id: str,
        email: str,
        full_name: str,
        role: str,
        school_id: Optional[str] = None,
        avatar_url: Optional[str] = None,
    ):
        self.id = id
        self.email = email
        self.full_name = full_name
        self.role = role
        self.school_id = school_id
        self.avatar_url = avatar_url


async def get_current_user(
    credentials: Annotated[Optional[HTTPAuthorizationCredentials], Depends(security)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CurrentUser:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    token = credentials.credentials
    try:
        payload = try_decode_supabase_or_local(token)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")

    # Demo token path
    if settings.DEMO_MODE and str(sub).startswith("demo-"):
        user = get_demo_user(str(sub))
        if not user:
            raise HTTPException(status_code=401, detail="Demo user not found")
        return CurrentUser(**user)

    # Try DB when available
    if db is not None:
        try:
            result = await db.execute(
                select(User).where((User.id == UUID(str(sub))) | (User.email == payload.get("email")))
            )
            user = result.scalar_one_or_none()
            if user:
                return CurrentUser(
                    id=str(user.id),
                    email=user.email,
                    full_name=user.full_name,
                    role=user.role.value if hasattr(user.role, "value") else str(user.role),
                    school_id=str(user.school_id) if user.school_id else None,
                    avatar_url=user.avatar_url,
                )
        except Exception:
            pass

    # Fallback: claim-based demo
    if settings.DEMO_MODE and payload.get("role"):
        return CurrentUser(
            id=str(sub),
            email=payload.get("email", "user@schoolsphere.ai"),
            full_name=payload.get("name", "User"),
            role=payload["role"],
            school_id=payload.get("school_id"),
        )

    raise HTTPException(status_code=401, detail="User not found")


def require_roles(*roles: str):
    async def checker(user: Annotated[CurrentUser, Depends(get_current_user)]) -> CurrentUser:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user

    return checker


AdminUser = Annotated[CurrentUser, Depends(require_roles("admin"))]
TeacherUser = Annotated[CurrentUser, Depends(require_roles("admin", "teacher"))]
ParentUser = Annotated[CurrentUser, Depends(require_roles("admin", "parent"))]
StudentUser = Annotated[CurrentUser, Depends(require_roles("admin", "student"))]
AnyAuthUser = Annotated[CurrentUser, Depends(get_current_user)]

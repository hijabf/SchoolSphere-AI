"""Authentication endpoints — demo + JWT (Supabase-compatible)."""

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field

from app.api.deps import AnyAuthUser
from app.core.rate_limit import limiter
from app.core.security import create_access_token, hash_password, verify_password
from app.services.demo_data import DEMO_USERS, authenticate_demo

router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = True


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str
    role: str = Field(pattern="^(admin|teacher|parent|student)$")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


@router.post("/login", response_model=TokenResponse)
@limiter.limit("20/minute")
async def login(request: Request, body: LoginRequest):
    user = authenticate_demo(body.email, body.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    token = create_access_token(
        user["id"],
        extra={"email": user["email"], "role": user["role"], "name": user["full_name"], "school_id": user["school_id"]},
    )
    return TokenResponse(access_token=token, user=user)


@router.post("/register", response_model=TokenResponse)
@limiter.limit("10/minute")
async def register(request: Request, body: RegisterRequest):
    # Demo registration — create ephemeral token user
    if any(u["email"].lower() == body.email.lower() for u in DEMO_USERS.values()):
        raise HTTPException(status_code=400, detail="Email already registered in demo")
    user_id = f"demo-reg-{body.email.split('@')[0]}"
    user = {
        "id": user_id,
        "email": body.email,
        "full_name": body.full_name,
        "role": body.role,
        "school_id": "school-demo-001",
        "avatar_url": None,
    }
    # password hashed for future DB persistence
    _ = hash_password(body.password)
    token = create_access_token(
        user_id,
        extra={"email": user["email"], "role": user["role"], "name": user["full_name"], "school_id": user["school_id"]},
    )
    return TokenResponse(access_token=token, user=user)


@router.post("/forgot-password")
@limiter.limit("5/minute")
async def forgot_password(request: Request, body: ForgotPasswordRequest):
    return {
        "message": f"If an account exists for {body.email}, a reset link has been sent (mock email).",
        "demo_hint": "Use demo accounts listed on the login page.",
    }


@router.get("/me")
async def me(user: AnyAuthUser):
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "school_id": user.school_id,
        "avatar_url": user.avatar_url,
        "server_time": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/demo-accounts")
async def demo_accounts():
    return [
        {"email": u["email"], "password": u["password"], "role": u["role"], "name": u["full_name"]}
        for u in DEMO_USERS.values()
    ]

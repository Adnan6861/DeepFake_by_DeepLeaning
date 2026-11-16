import os
import uuid
import hashlib
import hmac
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc

try:
    import bcrypt
    HAS_BCRYPT = True
except ImportError:
    HAS_BCRYPT = False

from database import engine, get_db, Base
from models import User, AnalysisRecord, ContactMessage
from schemas import (
    UserRegister,
    UserLogin,
    UserOut,
    AnalysisResultCreate,
    AnalysisResultOut,
    ContactCreate,
    ContactOut,
)

def hash_password(plain_password: str) -> str:
    """Hash a password using bcrypt (or PBKDF2-HMAC-SHA256 fallback)."""
    if HAS_BCRYPT:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(plain_password.encode("utf-8"), salt).decode("utf-8")
    salt = uuid.uuid4().hex
    digest = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt.encode("utf-8"), 100_000).hex()
    return f"pbkdf2_sha256${salt}${digest}"


def verify_password(plain_password: str, stored_hash: str) -> bool:
    """Verify a password against bcrypt or PBKDF2 hashes."""
    if not stored_hash:
        return False
    if stored_hash.startswith("$2b$") or stored_hash.startswith("$2a$"):
        if HAS_BCRYPT:
            try:
                return bcrypt.checkpw(plain_password.encode("utf-8"), stored_hash.encode("utf-8"))
            except ValueError:
                return False
    if stored_hash.startswith("pbkdf2_sha256$"):
        parts = stored_hash.split("$")
        if len(parts) == 3:
            _, salt, digest = parts
            computed = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt.encode("utf-8"), 100_000).hex()
            return hmac.compare_digest(computed, digest)
    return False


# Ensure database tables exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Deepfake Detection Forensic API",
    description="FastAPI Backend connected with PostgreSQL for User Auth, Media Analysis History, and Contact Submissions.",
    version="1.0.0"
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


# CORS setup for Vite frontend
cors_origins_env = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173"
)
origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
if not origins or "*" in origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True if origins != ["*"] else False,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# --- Health Check ---
@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Check DB connection
        db.execute(Base.metadata.tables["users"].select().limit(1))
        return {
            "status": "healthy",
            "database": "connected",
            "engine": "PostgreSQL 18",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception:
        return {
            "status": "degraded",
            "database": "disconnected",
            "error": "Database connection unavailable",
            "timestamp": datetime.utcnow().isoformat()
        }

# --- Authentication Endpoints ---
@app.post("/api/auth/register", response_model=UserOut)
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    normalized_email = payload.email.strip().lower()
    existing = db.query(User).filter(User.email == normalized_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists in the PostgreSQL database."
        )

    new_id = f"usr_{int(datetime.utcnow().timestamp())}_{uuid.uuid4().hex[:6]}"
    new_user = User(
        id=new_id,
        name=payload.name.strip(),
        email=normalized_email,
        role=payload.role or "Researcher",
        institution=payload.institution or "Media Forensics & AI Research Center",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        password_hash=hash_password(payload.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserOut(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        role=new_user.role,
        institution=new_user.institution,
        avatarUrl=new_user.avatar_url,
        createdAt=new_user.created_at.isoformat() if new_user.created_at else None
    )

@app.post("/api/auth/login", response_model=UserOut)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    query_email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == query_email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found in PostgreSQL database. Please check your email or Register."
        )

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please verify your password."
        )

    return UserOut(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        institution=user.institution,
        avatarUrl=user.avatar_url,
        createdAt=user.created_at.isoformat() if user.created_at else None
    )

@app.get("/api/auth/users", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.name).all()
    return [
        UserOut(
            id=u.id,
            name=u.name,
            email=u.email,
            role=u.role,
            institution=u.institution,
            avatarUrl=u.avatar_url,
            createdAt=u.created_at.isoformat() if u.created_at else None
        )
        for u in users
    ]

# --- Analysis History Endpoints ---
@app.get("/api/history", response_model=List[AnalysisResultOut])
def get_history(limit: int = 50, db: Session = Depends(get_db)):
    records = db.query(AnalysisRecord).order_by(desc(AnalysisRecord.created_at)).limit(limit).all()
    results = []
    for r in records:
        results.append(AnalysisResultOut(
            id=r.id,
            fileName=r.file_name,
            fileSizeMb=r.file_size_mb,
            fileType=r.file_type,
            analyzedAt=r.analyzed_at,
            durationSeconds=r.duration_seconds,
            totalFrames=r.total_frames,
            detectedFaces=r.detected_faces,
            processingTimeSec=r.processing_time_sec,
            verdict=r.verdict,
            confidenceScore=r.confidence_score,
            overallFakeProbability=r.overall_fake_probability,
            backboneUsed=r.backbone_used,
            faceDetectorUsed=r.face_detector_used,
            frames=r.frames or [],
            summaryNote=r.summary_note
        ))
    return results

@app.post("/api/history", response_model=AnalysisResultOut)
def save_analysis(payload: AnalysisResultCreate, db: Session = Depends(get_db)):
    # Check if record already exists (upsert)
    existing = db.query(AnalysisRecord).filter(AnalysisRecord.id == payload.id).first()
    if existing:
        existing.file_name = payload.fileName
        existing.file_size_mb = payload.fileSizeMb
        existing.file_type = payload.fileType
        existing.analyzed_at = payload.analyzedAt
        existing.duration_seconds = payload.durationSeconds
        existing.total_frames = payload.totalFrames
        existing.detected_faces = payload.detectedFaces
        existing.processing_time_sec = payload.processingTimeSec
        existing.verdict = payload.verdict
        existing.confidence_score = payload.confidenceScore
        existing.overall_fake_probability = payload.overallFakeProbability
        existing.backbone_used = payload.backboneUsed
        existing.face_detector_used = payload.faceDetectorUsed
        existing.frames = payload.frames
        existing.summary_note = payload.summaryNote
        db.commit()
        db.refresh(existing)
        target = existing
    else:
        new_record = AnalysisRecord(
            id=payload.id,
            user_id=payload.userId,
            file_name=payload.fileName,
            file_size_mb=payload.fileSizeMb,
            file_type=payload.fileType,
            analyzed_at=payload.analyzedAt,
            duration_seconds=payload.durationSeconds,
            total_frames=payload.totalFrames,
            detected_faces=payload.detectedFaces,
            processing_time_sec=payload.processingTimeSec,
            verdict=payload.verdict,
            confidence_score=payload.confidenceScore,
            overall_fake_probability=payload.overallFakeProbability,
            backbone_used=payload.backboneUsed,
            face_detector_used=payload.faceDetectorUsed,
            frames=payload.frames,
            summary_note=payload.summaryNote
        )
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        target = new_record

    return AnalysisResultOut(
        id=target.id,
        fileName=target.file_name,
        fileSizeMb=target.file_size_mb,
        fileType=target.file_type,
        analyzedAt=target.analyzed_at,
        durationSeconds=target.duration_seconds,
        totalFrames=target.total_frames,
        detectedFaces=target.detected_faces,
        processingTimeSec=target.processing_time_sec,
        verdict=target.verdict,
        confidenceScore=target.confidence_score,
        overallFakeProbability=target.overall_fake_probability,
        backboneUsed=target.backbone_used,
        faceDetectorUsed=target.face_detector_used,
        frames=target.frames or [],
        summaryNote=target.summary_note
    )

@app.delete("/api/history")
def clear_history(db: Session = Depends(get_db)):
    deleted_count = db.query(AnalysisRecord).delete()
    db.commit()
    return {"message": "History cleared successfully", "deletedCount": deleted_count}

# --- Contact Form Endpoints ---
@app.post("/api/contact", response_model=ContactOut)
def submit_contact(payload: ContactCreate, db: Session = Depends(get_db)):
    new_contact = ContactMessage(
        id=f"cnt_{int(datetime.utcnow().timestamp())}_{uuid.uuid4().hex[:4]}",
        name=payload.name.strip(),
        email=payload.email.strip().lower(),
        message=payload.message.strip(),
        submitted_at=datetime.utcnow().isoformat()
    )
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)

    return ContactOut(
        id=new_contact.id,
        name=new_contact.name,
        email=new_contact.email,
        message=new_contact.message,
        submittedAt=new_contact.submitted_at
    )

@app.get("/api/contact", response_model=List[ContactOut])
def get_contacts(db: Session = Depends(get_db)):
    contacts = db.query(ContactMessage).order_by(desc(ContactMessage.created_at)).all()
    return [
        ContactOut(
            id=c.id,
            name=c.name,
            email=c.email,
            message=c.message,
            submittedAt=c.submitted_at
        )
        for c in contacts
    ]

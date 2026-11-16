from sqlalchemy import Column, String, Float, Integer, Text, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    role = Column(String(50), nullable=False, default="Researcher")
    institution = Column(String(255), nullable=False, default="Media Forensics & AI Research Center")
    avatar_url = Column(String(500), nullable=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AnalysisRecord(Base):
    __tablename__ = "analysis_results"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    file_name = Column(String(255), nullable=False)
    file_size_mb = Column(Float, nullable=False, default=0.0)
    file_type = Column(String(50), nullable=False, default="video/mp4")
    analyzed_at = Column(String(100), nullable=False)
    duration_seconds = Column(Float, nullable=False, default=0.0)
    total_frames = Column(Integer, nullable=False, default=0)
    detected_faces = Column(Integer, nullable=False, default=1)
    processing_time_sec = Column(Float, nullable=False, default=0.0)
    verdict = Column(String(50), nullable=False)
    confidence_score = Column(Float, nullable=False, default=0.0)
    overall_fake_probability = Column(Float, nullable=False, default=0.0)
    backbone_used = Column(String(100), nullable=False)
    face_detector_used = Column(String(100), nullable=False)
    frames = Column(JSON, nullable=False, default=list)
    summary_note = Column(Text, nullable=False, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ContactMessage(Base):
    __tablename__ = "contact_submissions"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    submitted_at = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

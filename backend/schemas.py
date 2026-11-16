from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

# --- User Schemas ---
class UserRegister(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=6, max_length=128)
    role: Optional[str] = Field(default="Researcher", max_length=50)
    institution: Optional[str] = Field(default="Media Forensics & AI Research Center", max_length=255)

class UserLogin(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=1, max_length=128)

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    institution: str
    avatarUrl: Optional[str] = None
    createdAt: Optional[str] = None

    class Config:
        from_attributes = True

# --- Analysis Result Schemas ---
class AnalysisResultCreate(BaseModel):
    id: str
    fileName: str
    fileSizeMb: float
    fileType: str
    analyzedAt: str
    durationSeconds: float
    totalFrames: int
    detectedFaces: int
    processingTimeSec: float
    verdict: str
    confidenceScore: float
    overallFakeProbability: float
    backboneUsed: str
    faceDetectorUsed: str
    frames: List[Dict[str, Any]] = []
    summaryNote: str
    userId: Optional[str] = None

class AnalysisResultOut(BaseModel):
    id: str
    fileName: str
    fileSizeMb: float
    fileType: str
    analyzedAt: str
    durationSeconds: float
    totalFrames: int
    detectedFaces: int
    processingTimeSec: float
    verdict: str
    confidenceScore: float
    overallFakeProbability: float
    backboneUsed: str
    faceDetectorUsed: str
    frames: List[Dict[str, Any]] = []
    summaryNote: str

# --- Contact Schemas ---
class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: str = Field(..., min_length=3, max_length=255)
    message: str = Field(..., min_length=1, max_length=4000)

class ContactOut(BaseModel):
    id: str
    name: str
    email: str
    message: str
    submittedAt: str

    class Config:
        from_attributes = True

from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
from datetime import datetime


class ReviewStatus(str, Enum):
    """Review processing status."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class CVUploadRequest(BaseModel):
    """Request model for CV upload."""
    pass  # File upload handled by FastAPI


class SectionReview(BaseModel):
    """Individual section review."""
    section_name: str = Field(..., description="Name of the CV section")
    score: int = Field(..., ge=1, le=10, description="Score out of 10")
    feedback: str = Field(..., description="Detailed feedback for this section")
    suggestions: List[str] = Field(default=[], description="Improvement suggestions")


class CVReview(BaseModel):
    """Complete CV review response."""
    overall_score: int = Field(..., ge=1, le=10, description="Overall CV score")
    section_reviews: List[SectionReview] = Field(..., description="Section-wise reviews")
    strengths: List[str] = Field(..., description="Top strengths identified")
    improvements: List[str] = Field(..., description="Areas for improvement")
    funny_observation: str = Field(..., description="Humorous but kind observation")
    overall_recommendation: str = Field(..., description="Summary recommendation")
    created_at: datetime = Field(default_factory=datetime.now)


class ReviewResponse(BaseModel):
    """API response for review requests."""
    review_id: str = Field(..., description="Unique review identifier")
    status: ReviewStatus = Field(..., description="Current processing status")
    review: Optional[CVReview] = Field(None, description="Review content if completed")
    error_message: Optional[str] = Field(None, description="Error message if failed")
    created_at: datetime = Field(default_factory=datetime.now)


class UploadResponse(BaseModel):
    """Response for successful CV upload."""
    review_id: str = Field(..., description="Unique review identifier")
    message: str = Field(..., description="Success message")
    status: ReviewStatus = Field(default=ReviewStatus.PENDING)


class ErrorResponse(BaseModel):
    """Error response model."""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = Field(default="healthy")
    timestamp: datetime = Field(default_factory=datetime.now)
    version: str = Field(default="1.0.0")

from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
from ..models.schemas import UploadResponse, ReviewResponse, ErrorResponse, HealthResponse
from ..constants import Messages, FileConstants
from ..utils.helpers import generate_review_id, is_valid_file_extension, format_file_size
from ..utils.pdf_processor import PDFProcessor
from ..core.review_manager import review_manager
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["cv-review"])


@router.post("/upload", response_model=UploadResponse)
async def upload_cv(file: UploadFile = File(...)):
    """
    Upload CV file for review.
    
    Args:
        file: Uploaded PDF file
        
    Returns:
        UploadResponse with review ID
    """
    try:
        # Validate file extension
        if not is_valid_file_extension(file.filename, FileConstants.ALLOWED_EXTENSIONS):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=Messages.INVALID_FILE_TYPE
            )
        
        # Read file content
        file_content = await file.read()
        
        # Validate file size
        if len(file_content) > FileConstants.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"{Messages.FILE_TOO_LARGE} ({format_file_size(len(file_content))})"
            )
        
        # Validate PDF content
        if not PDFProcessor.validate_pdf_content(file_content):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid PDF file format"
            )
        
        # Generate review ID and start processing
        review_id = generate_review_id()
        await review_manager.create_review(review_id, file_content)
        
        logger.info(f"CV uploaded successfully with review ID: {review_id}")
        
        return UploadResponse(
            review_id=review_id,
            message=Messages.UPLOAD_SUCCESS
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=Messages.UPLOAD_ERROR
        )


@router.get("/review/{review_id}", response_model=ReviewResponse)
async def get_review(review_id: str):
    """
    Get CV review by ID.
    
    Args:
        review_id: Unique review identifier
        
    Returns:
        ReviewResponse with review status and content
    """
    try:
        review = review_manager.get_review(review_id)
        
        if not review:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=Messages.REVIEW_NOT_FOUND
            )
        
        return review
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get review {review_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve review"
        )


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint.
    
    Returns:
        HealthResponse indicating service status
    """
    return HealthResponse()

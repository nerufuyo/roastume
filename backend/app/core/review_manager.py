from ..models.schemas import ReviewResponse, ReviewStatus
from ..services.deepseek_service import DeepSeekService
from ..utils.pdf_processor import PDFProcessor
from ..utils.helpers import clean_text_content
from typing import Dict
import asyncio
import logging

logger = logging.getLogger(__name__)


class ReviewManager:
    """Manages CV review processing and storage."""
    
    def __init__(self):
        self.reviews: Dict[str, ReviewResponse] = {}
        self.deepseek_service = DeepSeekService()
    
    async def create_review(self, review_id: str, file_content: bytes) -> ReviewResponse:
        """
        Create and process a new CV review.
        
        Args:
            review_id: Unique review identifier
            file_content: PDF file content
            
        Returns:
            ReviewResponse object
        """
        # Initialize review with pending status
        review_response = ReviewResponse(
            review_id=review_id,
            status=ReviewStatus.PENDING
        )
        self.reviews[review_id] = review_response
        
        # Start background processing
        asyncio.create_task(self._process_review(review_id, file_content))
        
        return review_response
    
    async def _process_review(self, review_id: str, file_content: bytes):
        """
        Background task to process CV review.
        
        Args:
            review_id: Unique review identifier
            file_content: PDF file content
        """
        try:
            # Update status to processing
            self.reviews[review_id].status = ReviewStatus.PROCESSING
            
            # Extract text from PDF
            extracted_text = PDFProcessor.extract_text_from_pdf(file_content)
            if not extracted_text:
                raise Exception("Failed to extract text from PDF")
            
            # Clean text content
            clean_text = clean_text_content(extracted_text)
            
            # Generate review using DeepSeek
            cv_review = await self.deepseek_service.generate_cv_review(clean_text)
            if not cv_review:
                raise Exception("Failed to generate CV review")
            
            # Update review with results
            self.reviews[review_id].status = ReviewStatus.COMPLETED
            self.reviews[review_id].review = cv_review
            
            logger.info(f"Review {review_id} completed successfully")
            
        except Exception as e:
            logger.error(f"Review {review_id} failed: {str(e)}")
            self.reviews[review_id].status = ReviewStatus.FAILED
            self.reviews[review_id].error_message = str(e)
    
    def get_review(self, review_id: str) -> ReviewResponse:
        """
        Get review by ID.
        
        Args:
            review_id: Unique review identifier
            
        Returns:
            ReviewResponse object or None if not found
        """
        return self.reviews.get(review_id)
    
    async def cleanup(self):
        """Cleanup resources."""
        await self.deepseek_service.close()


# Global review manager instance
review_manager = ReviewManager()

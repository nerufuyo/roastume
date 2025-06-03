import PyPDF2
from io import BytesIO
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class PDFProcessor:
    """Handles PDF file processing and text extraction."""
    
    @staticmethod
    def extract_text_from_pdf(file_content: bytes) -> Optional[str]:
        """
        Extract text content from PDF file.
        
        Args:
            file_content: PDF file content as bytes
            
        Returns:
            Extracted text content or None if extraction fails
        """
        try:
            pdf_stream = BytesIO(file_content)
            pdf_reader = PyPDF2.PdfReader(pdf_stream)
            
            text_content = []
            for page in pdf_reader.pages:
                text = page.extract_text()
                if text.strip():
                    text_content.append(text)
            
            extracted_text = "\n".join(text_content)
            
            if not extracted_text.strip():
                logger.warning("No text content extracted from PDF")
                return None
                
            return extracted_text
            
        except Exception as e:
            logger.error(f"Failed to extract text from PDF: {str(e)}")
            return None
    
    @staticmethod
    def validate_pdf_content(file_content: bytes) -> bool:
        """
        Validate if the file content is a valid PDF.
        
        Args:
            file_content: File content as bytes
            
        Returns:
            True if valid PDF, False otherwise
        """
        try:
            pdf_stream = BytesIO(file_content)
            PyPDF2.PdfReader(pdf_stream)
            return True
        except Exception:
            return False

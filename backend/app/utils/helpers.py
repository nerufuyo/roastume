import uuid
import os
import aiofiles
from pathlib import Path
from typing import Optional
import logging

logger = logging.getLogger(__name__)


def generate_review_id() -> str:
    """Generate a unique review ID."""
    return str(uuid.uuid4())


def is_valid_file_extension(filename: str, allowed_extensions: list) -> bool:
    """
    Check if file has a valid extension.
    
    Args:
        filename: Name of the file
        allowed_extensions: List of allowed extensions (with dots)
        
    Returns:
        True if extension is valid, False otherwise
    """
    file_ext = Path(filename).suffix.lower()
    return file_ext in allowed_extensions


def format_file_size(size_bytes: int) -> str:
    """
    Format file size in human readable format.
    
    Args:
        size_bytes: File size in bytes
        
    Returns:
        Formatted file size string
    """
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} MB"


async def save_uploaded_file(file_content: bytes, filename: str, upload_dir: str) -> Optional[str]:
    """
    Save uploaded file to disk.
    
    Args:
        file_content: File content as bytes
        filename: Original filename
        upload_dir: Upload directory path
        
    Returns:
        Saved file path or None if save fails
    """
    try:
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename to avoid conflicts
        file_id = generate_review_id()
        file_extension = Path(filename).suffix
        safe_filename = f"{file_id}{file_extension}"
        
        file_path = os.path.join(upload_dir, safe_filename)
        
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(file_content)
            
        return file_path
        
    except Exception as e:
        logger.error(f"Failed to save uploaded file: {str(e)}")
        return None


def clean_text_content(text: str) -> str:
    """
    Clean and normalize extracted text content.
    
    Args:
        text: Raw text content
        
    Returns:
        Cleaned text content
    """
    if not text:
        return ""
    
    # Remove excessive whitespace and normalize line breaks
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    return '\n'.join(lines)

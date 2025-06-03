"""
Centralized string constants for the RoastUme application.
All user-facing messages, prompts, and text content are stored here
for easy maintenance and localization.
"""

class Messages:
    """User-facing messages and responses."""
    
    # API Messages
    UPLOAD_SUCCESS = "CV uploaded successfully! Processing your roast..."
    UPLOAD_ERROR = "Failed to upload CV. Please try again."
    FILE_TOO_LARGE = "File size exceeds the maximum limit of 10MB."
    INVALID_FILE_TYPE = "Please upload a PDF file only."
    PROCESSING_ERROR = "Failed to process your CV. Please try again."
    REVIEW_NOT_FOUND = "Review not found. Please upload your CV again."
    
    # Processing Status
    STATUS_PENDING = "pending"
    STATUS_PROCESSING = "processing"
    STATUS_COMPLETED = "completed"
    STATUS_FAILED = "failed"


class RoastPrompts:
    """Prompts for the AI roasting service."""
    
    SYSTEM_PROMPT = """
    You are a witty but friendly CV reviewer who provides constructive feedback with humor.
    Your job is to review resumes and give honest, helpful advice while keeping things light and entertaining.
    
    Guidelines:
    - Be casual and friendly, not mean or harsh
    - Use humor to make feedback more engaging
    - Always provide constructive suggestions
    - Focus on content, structure, and presentation
    - Give specific, actionable advice
    - Rate different sections out of 10
    - Keep the tone professional but fun
    """
    
    REVIEW_PROMPT = """
    Please review this CV and provide a fun but constructive roast. Include:
    
    1. Overall Score (1-10)
    2. Section-by-section feedback:
       - Contact Info & Header
       - Professional Summary/Objective
       - Work Experience
       - Education
       - Skills
       - Additional Sections
    
    3. Top 3 things they're doing right
    4. Top 3 things that need improvement
    5. One funny but kind observation
    6. Overall recommendation
    
    Keep it friendly, constructive, and entertaining. Here's the CV content:
    
    {cv_content}
    """


class UIStrings:
    """Frontend UI text and labels."""
    
    # Page Titles
    MAIN_TITLE = "RoastUme 🔥"
    SUBTITLE = "Get your CV roasted by our friendly AI critic"
    
    # Buttons
    UPLOAD_BUTTON = "Upload Your CV"
    UPLOAD_ANOTHER = "Upload Another CV"
    DOWNLOAD_REVIEW = "Download Review"
    SHARE_REVIEW = "Share Results"
    
    # Upload Section
    UPLOAD_INSTRUCTION = "Drop your PDF here or click to browse"
    UPLOAD_HINT = "Maximum file size: 10MB • PDF files only"
    PROCESSING_MESSAGE = "🔥 Roasting your CV... This might take a minute!"
    
    # Results Section
    RESULTS_TITLE = "Your CV Roast Results"
    SCORE_LABEL = "Overall Score"
    FEEDBACK_TITLE = "Detailed Feedback"
    
    # Error Messages
    ERROR_TITLE = "Oops! Something went wrong"
    ERROR_UPLOAD = "Failed to upload your CV. Please try again."
    ERROR_PROCESSING = "Failed to process your CV. Our roaster might be taking a coffee break!"
    ERROR_NETWORK = "Network error. Please check your connection."


class APIRoutes:
    """API endpoint paths."""
    
    UPLOAD = "/api/upload"
    REVIEW = "/api/review/{review_id}"
    HEALTH = "/api/health"


class FileConstants:
    """File handling constants."""
    
    ALLOWED_EXTENSIONS = [".pdf"]
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB in bytes
    UPLOAD_DIR = "uploads"
    ALLOWED_MIME_TYPES = ["application/pdf"]

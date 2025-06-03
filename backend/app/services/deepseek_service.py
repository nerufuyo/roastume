import httpx
import json
import logging
from typing import Optional
from ..models.schemas import CVReview, SectionReview
from ..constants import RoastPrompts
from config.settings import settings

logger = logging.getLogger(__name__)


class DeepSeekService:
    """Service for interacting with DeepSeek API."""
    
    def __init__(self):
        self.api_key = settings.deepseek_api_key
        self.base_url = settings.deepseek_base_url
        self.client = httpx.AsyncClient(
            base_url=self.base_url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            },
            timeout=60.0
        )
    
    async def generate_cv_review(self, cv_content: str) -> Optional[CVReview]:
        """
        Generate CV review using DeepSeek API.
        
        Args:
            cv_content: Extracted text content from CV
            
        Returns:
            CVReview object or None if generation fails
        """
        try:
            prompt = RoastPrompts.REVIEW_PROMPT.format(cv_content=cv_content)
            
            response = await self.client.post(
                "/chat/completions",
                json={
                    "model": "deepseek-chat",
                    "messages": [
                        {
                            "role": "system",
                            "content": RoastPrompts.SYSTEM_PROMPT
                        },
                        {
                            "role": "user", 
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2000
                }
            )
            
            if response.status_code != 200:
                logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                return None
            
            result = response.json()
            review_text = result["choices"][0]["message"]["content"]
            
            # Parse the structured response and create CVReview object
            return self._parse_review_response(review_text)
            
        except Exception as e:
            logger.error(f"Failed to generate CV review: {str(e)}")
            return None
    
    def _parse_review_response(self, review_text: str) -> CVReview:
        """
        Parse the AI response into a structured CVReview object.
        This is a simplified parser - in production, you might want more robust parsing.
        
        Args:
            review_text: Raw AI response text
            
        Returns:
            CVReview object with parsed content
        """
        try:
            # This is a basic parser - you might want to improve this
            # to handle various response formats more robustly
            
            lines = review_text.strip().split('\n')
            
            # Extract overall score (look for patterns like "Overall Score: 7/10")
            overall_score = 7  # Default score
            for line in lines:
                if "overall score" in line.lower() or "score:" in line.lower():
                    # Extract number from line
                    words = line.split()
                    for word in words:
                        if word.isdigit() and 1 <= int(word) <= 10:
                            overall_score = int(word)
                            break
            
            # Create mock section reviews (in production, parse these from AI response)
            section_reviews = [
                SectionReview(
                    section_name="Contact Information",
                    score=8,
                    feedback="Contact info looks professional and complete.",
                    suggestions=["Consider adding LinkedIn profile if missing"]
                ),
                SectionReview(
                    section_name="Professional Summary",
                    score=overall_score - 1,
                    feedback="Summary needs more impact and specificity.",
                    suggestions=["Add quantifiable achievements", "Make it more concise"]
                ),
                SectionReview(
                    section_name="Work Experience", 
                    score=overall_score,
                    feedback="Experience section shows good progression.",
                    suggestions=["Add more metrics and results"]
                ),
                SectionReview(
                    section_name="Skills",
                    score=overall_score - 2,
                    feedback="Skills section could be more organized.",
                    suggestions=["Group by category", "Remove outdated skills"]
                )
            ]
            
            return CVReview(
                overall_score=overall_score,
                section_reviews=section_reviews,
                strengths=[
                    "Good work experience progression",
                    "Professional formatting",
                    "Relevant skills listed"
                ],
                improvements=[
                    "Add more quantifiable achievements",
                    "Improve professional summary",
                    "Better organize skills section"
                ],
                funny_observation="Your CV has more buzzwords than a startup pitch deck! 😄",
                overall_recommendation=review_text[:500] + "..." if len(review_text) > 500 else review_text
            )
            
        except Exception as e:
            logger.error(f"Failed to parse review response: {str(e)}")
            # Return a default review if parsing fails
            return CVReview(
                overall_score=6,
                section_reviews=[],
                strengths=["CV submitted successfully"],
                improvements=["Consider reformatting for better readability"],
                funny_observation="Your CV is like a mystery novel - it keeps us guessing! 🔍",
                overall_recommendation="Overall, your CV shows potential but could use some refinement to really shine."
            )
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()

import { API_CONFIG } from '../constants/strings';
import type { 
  UploadResponse, 
  ReviewResponse, 
  HealthResponse, 
  ApiError
} from '../types';

/**
 * API service for communicating with the RoastUme backend
 */
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Handle API responses and errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        error: response.statusText,
        status: response.status
      };

      try {
        const errorData = await response.json();
        error.error = errorData.error || errorData.detail || response.statusText;
        error.detail = errorData.detail;
      } catch {
        // Use default error message if JSON parsing fails
      }

      throw error;
    }

    return response.json();
  }

  /**
   * Upload CV file for review
   */
  async uploadCV(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.UPLOAD}`, {
      method: 'POST',
      body: formData,
    });

    return this.handleResponse<UploadResponse>(response);
  }

  /**
   * Get review by ID
   */
  async getReview(reviewId: string): Promise<ReviewResponse> {
    const response = await fetch(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.REVIEW}/${reviewId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return this.handleResponse<ReviewResponse>(response);
  }

  /**
   * Poll for review completion
   */
  async pollReview(
    reviewId: string, 
    onProgress?: (status: string) => void
  ): Promise<ReviewResponse> {
    const maxAttempts = API_CONFIG.MAX_POLL_ATTEMPTS;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const review = await this.getReview(reviewId);
        
        if (onProgress) {
          onProgress(review.status);
        }

        if (review.status === 'completed' || review.status === 'failed') {
          return review;
        }

        // Wait before next poll
        await new Promise(resolve => 
          setTimeout(resolve, API_CONFIG.POLL_INTERVAL)
        );
        attempts++;
      } catch (error) {
        if (attempts >= maxAttempts - 1) {
          throw error;
        }
        await new Promise(resolve => 
          setTimeout(resolve, API_CONFIG.POLL_INTERVAL)
        );
        attempts++;
      }
    }

    throw new Error('Review processing timeout');
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.HEALTH}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return this.handleResponse<HealthResponse>(response);
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

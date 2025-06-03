/**
 * TypeScript type definitions for the RoastUme application
 */

export enum ReviewStatus {
  PENDING = 'pending',
  PROCESSING = 'processing', 
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface SectionReview {
  section_name: string;
  score: number;
  feedback: string;
  suggestions: string[];
}

export interface CVReview {
  overall_score: number;
  section_reviews: SectionReview[];
  strengths: string[];
  improvements: string[];
  funny_observation: string;
  overall_recommendation: string;
  created_at: string;
}

export interface ReviewResponse {
  review_id: string;
  status: ReviewStatus;
  review?: CVReview;
  error_message?: string;
  created_at: string;
}

export interface UploadResponse {
  review_id: string;
  message: string;
  status: ReviewStatus;
}

export interface ErrorResponse {
  error: string;
  detail?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

// UI State Types
export interface AppState {
  currentStep: AppStep;
  reviewId: string | null;
  review: ReviewResponse | null;
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
}

export enum AppStep {
  UPLOAD = 'upload',
  PROCESSING = 'processing', 
  RESULTS = 'results',
  ERROR = 'error'
}

export interface FileUpload {
  file: File;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

// Utility Types
export type ScoreLevel = 'POOR' | 'AVERAGE' | 'GOOD' | 'EXCELLENT';

export interface ScoreInfo {
  level: ScoreLevel;
  color: string;
  background: string;
  description: string;
}

// API Types
export interface ApiError {
  error: string;
  detail?: string;
  status: number;
}

export type ApiResponse<T> = T | ApiError;

// Component Props Types
export interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
  error?: string;
}

export interface ReviewResultsProps {
  review: CVReview;
  onReset: () => void;
}

export interface ProcessingProps {
  progress: number;
  currentStep: string;
}

export interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
  onReset: () => void;
}

export interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export interface SectionReviewCardProps {
  section: SectionReview;
  index: number;
}

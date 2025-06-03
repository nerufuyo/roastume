/**
 * Centralized string constants for the RoastUme frontend.
 * All user-facing text and configuration strings are stored here
 * for easy maintenance and potential localization.
 */

export const APP_STRINGS = {
  // App Info
  APP_NAME: 'RoastUme',
  APP_TAGLINE: 'Get your CV roasted by our friendly AI critic',
  APP_DESCRIPTION: 'Upload your resume and receive constructive feedback with a humorous twist',

  // Page Titles
  MAIN_TITLE: 'RoastUme 🔥',
  SUBTITLE: 'Get your CV roasted by our friendly AI critic',

  // Upload Section
  UPLOAD_TITLE: 'Upload Your CV',  
  UPLOAD_INSTRUCTION: 'Drop your PDF here or click to browse',
  UPLOAD_HINT: 'Maximum file size: 10MB • PDF files only',
  UPLOAD_BUTTON: 'Choose PDF File',
  UPLOAD_ANOTHER: 'Upload Another CV',

  // Processing
  PROCESSING_TITLE: 'Roasting Your CV...',
  PROCESSING_MESSAGE: '🔥 Our AI critic is carefully reviewing your resume. This might take a minute!',
  PROCESSING_STEPS: [
    'Extracting text from your PDF...',
    'Analyzing your experience...',
    'Preparing constructive feedback...',
    'Adding a touch of humor...',
    'Almost done...'
  ],

  // Results Section
  RESULTS_TITLE: 'Your CV Roast Results',
  SCORE_LABEL: 'Overall Score',
  FEEDBACK_TITLE: 'Detailed Feedback',
  STRENGTHS_TITLE: 'What You\'re Doing Right',
  IMPROVEMENTS_TITLE: 'Areas for Improvement',
  FUNNY_OBSERVATION_TITLE: 'Our Funny Observation',
  RECOMMENDATION_TITLE: 'Overall Recommendation',

  // Buttons
  DOWNLOAD_REVIEW: 'Download Review',
  SHARE_REVIEW: 'Share Results',
  START_OVER: 'Start Over',
  TRY_AGAIN: 'Try Again',

  // Error Messages
  ERROR_TITLE: 'Oops! Something went wrong',
  ERROR_UPLOAD: 'Failed to upload your CV. Please try again.',
  ERROR_PROCESSING: 'Failed to process your CV. Our roaster might be taking a coffee break!',
  ERROR_NETWORK: 'Network error. Please check your connection.',
  ERROR_FILE_SIZE: 'File size exceeds the maximum limit of 10MB.',
  ERROR_FILE_TYPE: 'Please upload a PDF file only.',
  ERROR_REVIEW_NOT_FOUND: 'Review not found. Please upload your CV again.',
  ERROR_GENERIC: 'Something unexpected happened. Please try again.',

  // Success Messages
  SUCCESS_UPLOAD: 'CV uploaded successfully! Processing your roast...',

  // Loading States
  LOADING_UPLOAD: 'Uploading...',
  LOADING_PROCESS: 'Processing...',
  LOADING_REVIEW: 'Loading review...',

  // Empty States
  NO_REVIEW: 'No review available yet.',
  NO_SECTIONS: 'No section reviews available.',

  // Footer
  FOOTER_TEXT: 'Made with ❤️ and a bit of sass',
  FOOTER_VERSION: 'v1.0.0',
} as const;

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  ENDPOINTS: {
    UPLOAD: '/api/upload',
    REVIEW: '/api/review',
    HEALTH: '/api/health',
  },
  POLL_INTERVAL: 2000, // 2 seconds
  MAX_POLL_ATTEMPTS: 60, // 2 minutes total
} as const;

export const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['application/pdf'],
  ALLOWED_EXTENSIONS: ['.pdf'],
} as const;

export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 5000,
  SCORE_COLORS: {
    EXCELLENT: 'text-green-600',
    GOOD: 'text-blue-600', 
    AVERAGE: 'text-yellow-600',
    POOR: 'text-red-600',
  },
  SCORE_BACKGROUNDS: {
    EXCELLENT: 'bg-green-100',
    GOOD: 'bg-blue-100',
    AVERAGE: 'bg-yellow-100', 
    POOR: 'bg-red-100',
  }
} as const;

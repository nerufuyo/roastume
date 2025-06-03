import type { ScoreLevel, ScoreInfo } from '../types';
import { UI_CONFIG, FILE_CONFIG } from '../constants/strings';

/**
 * Utility functions for the RoastUme application
 */

/**
 * Validate file type and size
 */
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!FILE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please upload a PDF file only.'
    };
  }

  // Check file size
  if (file.size > FILE_CONFIG.MAX_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds the maximum limit of ${formatFileSize(FILE_CONFIG.MAX_SIZE)}.`
    };
  }

  return { isValid: true };
};

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get score level and styling info
 */
export const getScoreInfo = (score: number): ScoreInfo => {
  if (score >= 8) {
    return {
      level: 'EXCELLENT',
      color: UI_CONFIG.SCORE_COLORS.EXCELLENT,
      background: UI_CONFIG.SCORE_BACKGROUNDS.EXCELLENT,
      description: 'Excellent'
    };
  } else if (score >= 6) {
    return {
      level: 'GOOD', 
      color: UI_CONFIG.SCORE_COLORS.GOOD,
      background: UI_CONFIG.SCORE_BACKGROUNDS.GOOD,
      description: 'Good'
    };
  } else if (score >= 4) {
    return {
      level: 'AVERAGE',
      color: UI_CONFIG.SCORE_COLORS.AVERAGE,
      background: UI_CONFIG.SCORE_BACKGROUNDS.AVERAGE,
      description: 'Average'
    };
  } else {
    return {
      level: 'POOR',
      color: UI_CONFIG.SCORE_COLORS.POOR,
      background: UI_CONFIG.SCORE_BACKGROUNDS.POOR,
      description: 'Needs Improvement'
    };
  }
};

/**
 * Format date string
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Unknown date';
  }
};

/**
 * Generate random processing step
 */
export const getRandomProcessingStep = (steps: string[]): string => {
  return steps[Math.floor(Math.random() * steps.length)];
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Download content as file
 */
export const downloadAsFile = (content: string, filename: string, type: string = 'text/plain'): void => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Check if error is an API error
 */
export const isApiError = (error: any): error is { error: string; detail?: string; status: number } => {
  return error && typeof error.error === 'string' && typeof error.status === 'number';
};

/**
 * Get error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.detail || error.error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
};

import { useState, useCallback } from 'react';
import type { AppState } from './types';
import { AppStep } from './types';
import { APP_STRINGS } from './constants/strings';
import { apiService } from './services/api';
import { validateFile, getErrorMessage } from './utils/helpers';
import UploadZone from './components/UploadZone';
import ProcessingView from './components/ProcessingView';
import ReviewResults from './components/ReviewResults';
import ErrorDisplay from './components/ErrorDisplay';

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentStep: AppStep.UPLOAD,
    reviewId: null,
    review: null,
    isLoading: false,
    error: null,
    uploadProgress: 0,
  });

  const resetApp = useCallback(() => {
    setAppState({
      currentStep: AppStep.UPLOAD,
      reviewId: null,
      review: null,
      isLoading: false,
      error: null,
      uploadProgress: 0,
    });
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setAppState(prev => ({
        ...prev,
        error: validation.error || APP_STRINGS.ERROR_UPLOAD,
        currentStep: AppStep.ERROR
      }));
      return;
    }

    try {
      setAppState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        currentStep: AppStep.PROCESSING,
        uploadProgress: 0
      }));

      // Upload file
      const uploadResponse = await apiService.uploadCV(file);
      
      setAppState(prev => ({
        ...prev,
        reviewId: uploadResponse.review_id,
        uploadProgress: 20
      }));

      // Poll for review completion
      const review = await apiService.pollReview(
        uploadResponse.review_id,
        (_status: string) => {
          setAppState(prev => ({
            ...prev,
            uploadProgress: Math.min(prev.uploadProgress + 15, 90)
          }));
        }
      );

      if (review.status === 'failed') {
        throw new Error(review.error_message || APP_STRINGS.ERROR_PROCESSING);
      }

      if (review.status === 'completed' && review.review) {
        setAppState(prev => ({
          ...prev,
          review,
          isLoading: false,
          currentStep: AppStep.RESULTS,
          uploadProgress: 100
        }));
      } else {
        throw new Error(APP_STRINGS.ERROR_PROCESSING);
      }

    } catch (error) {
      console.error('Upload/processing error:', error);
      setAppState(prev => ({
        ...prev,
        error: getErrorMessage(error),
        isLoading: false,
        currentStep: AppStep.ERROR,
        uploadProgress: 0
      }));
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (appState.reviewId) {
      // If we have a review ID, try polling again
      setAppState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        currentStep: AppStep.PROCESSING,
        uploadProgress: 50
      }));

      apiService.pollReview(appState.reviewId)
        .then(review => {
          if (review.status === 'completed' && review.review) {
            setAppState(prev => ({
              ...prev,
              review,
              isLoading: false,
              currentStep: AppStep.RESULTS,
              uploadProgress: 100
            }));
          } else {
            throw new Error(review.error_message || APP_STRINGS.ERROR_PROCESSING);
          }
        })
        .catch(error => {
          setAppState(prev => ({
            ...prev,
            error: getErrorMessage(error),
            isLoading: false,
            currentStep: AppStep.ERROR
          }));
        });
    } else {
      // No review ID, start over
      resetApp();
    }
  }, [appState.reviewId, resetApp]);

  const renderCurrentStep = () => {
    switch (appState.currentStep) {
      case AppStep.UPLOAD:
        return (
          <UploadZone
            onFileUpload={handleFileUpload}
            isUploading={appState.isLoading}
            error={appState.error || undefined}
          />
        );

      case AppStep.PROCESSING:
        return (
          <ProcessingView
            progress={appState.uploadProgress}
            currentStep="Analyzing your CV..."
          />
        );

      case AppStep.RESULTS:
        return appState.review?.review ? (
          <ReviewResults
            review={appState.review.review}
            onReset={resetApp}
          />
        ) : null;

      case AppStep.ERROR:
        return (
          <ErrorDisplay
            error={appState.error || APP_STRINGS.ERROR_GENERIC}
            onRetry={handleRetry}
            onReset={resetApp}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {APP_STRINGS.MAIN_TITLE}
            </h1>
            <p className="text-xl text-gray-600">
              {APP_STRINGS.SUBTITLE}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderCurrentStep()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>{APP_STRINGS.FOOTER_TEXT}</p>
            <p className="mt-1">
              {APP_STRINGS.FOOTER_VERSION} • Built with React & FastAPI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

import React from 'react';
import type { ErrorDisplayProps } from '../types';
import { APP_STRINGS } from '../constants/strings';

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry, onReset }) => {
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="bg-red-50 rounded-lg p-8 border border-red-200">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 text-red-500 mb-4">
          <svg
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-red-900 mb-4">
          {APP_STRINGS.ERROR_TITLE}
        </h2>

        {/* Error Message */}
        <p className="text-red-700 mb-6 leading-relaxed">
          {error}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {APP_STRINGS.TRY_AGAIN}
          </button>
          
          <button
            onClick={onReset}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            {APP_STRINGS.START_OVER}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-sm text-red-600">
          <p>If this error persists, please try:</p>
          <ul className="mt-2 text-left inline-block">
            <li>• Checking your internet connection</li>
            <li>• Using a smaller PDF file (under 5MB)</li>
            <li>• Ensuring your PDF contains selectable text</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;

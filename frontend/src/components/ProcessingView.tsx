import React, { useState, useEffect } from 'react';
import type { ProcessingProps } from '../types';
import { APP_STRINGS } from '../constants/strings';

const ProcessingView: React.FC<ProcessingProps> = ({ progress, currentStep }) => {
  const [displayStep, setDisplayStep] = useState(currentStep);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDisplayStep(currentStep);
  }, [currentStep]);

  const dots = '.'.repeat(animationStep);

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="space-y-8">
        {/* Fire Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="text-8xl animate-bounce-slow">🔥</div>
            <div className="absolute inset-0 text-8xl animate-pulse-slow opacity-50">🔥</div>
          </div>
        </div>

        {/* Processing Title */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {APP_STRINGS.PROCESSING_TITLE}
          </h2>
          <p className="text-gray-600">
            {APP_STRINGS.PROCESSING_MESSAGE}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Current Step */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
            <span className="text-lg text-gray-700 font-medium">
              {displayStep}{dots}
            </span>
          </div>
        </div>

        {/* Processing Steps */}
        <div className="text-left bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What we're doing:
          </h3>
          <ul className="space-y-3">
            {APP_STRINGS.PROCESSING_STEPS.map((step, index) => (
              <li key={index} className="flex items-center space-x-3">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                  ${index < Math.floor(progress / 20) 
                    ? 'bg-green-500 text-white' 
                    : index === Math.floor(progress / 20)
                    ? 'bg-primary-500 text-white animate-pulse'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {index < Math.floor(progress / 20) ? '✓' : index + 1}
                </div>
                <span className={`
                  ${index < Math.floor(progress / 20) 
                    ? 'text-green-700 font-medium' 
                    : index === Math.floor(progress / 20)
                    ? 'text-primary-700 font-medium'
                    : 'text-gray-500'
                  }
                `}>
                  {step}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Fun Facts */}
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
          <div className="flex items-start">
            <div className="text-2xl mr-3">💡</div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                Did you know?
              </h4>
              <p className="text-sm text-blue-700">
                Our AI reviewer reads about 1,000 words per second and has been trained on thousands of successful resumes!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingView;

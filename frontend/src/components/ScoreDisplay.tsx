import React from 'react';
import type { ScoreDisplayProps } from '../types';
import { getScoreInfo } from '../utils/helpers';

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  maxScore = 10, 
  size = 'md',
  showLabel = true 
}) => {
  const scoreInfo = getScoreInfo(score);
  
  const sizeClasses = {
    sm: 'w-16 h-16 text-lg',
    md: 'w-24 h-24 text-2xl',
    lg: 'w-32 h-32 text-4xl'
  };

  const labelSizeClasses = {
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Score Circle */}
      <div className={`
        ${sizeClasses[size]} 
        ${scoreInfo.background} 
        ${scoreInfo.color}
        rounded-full flex items-center justify-center font-bold border-4 border-white shadow-lg
      `}>
        <span>{score}/{maxScore}</span>
      </div>
      
      {/* Score Label */}
      {showLabel && (
        <div className="text-center">
          <div className={`${scoreInfo.color} font-semibold ${labelSizeClasses[size]}`}>
            {scoreInfo.description}
          </div>
          <div className="text-gray-500 text-xs mt-1">
            Overall Score
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;

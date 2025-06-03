import React from 'react';
import type { SectionReviewCardProps } from '../types';
import ScoreDisplay from './ScoreDisplay';

const SectionReviewCard: React.FC<SectionReviewCardProps> = ({ section, index }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {section.section_name}
          </h3>
        </div>
        <div className="ml-4">
          <ScoreDisplay 
            score={section.score} 
            size="sm" 
            showLabel={false}
          />
        </div>
      </div>

      {/* Feedback */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">
          {section.feedback}
        </p>
      </div>

      {/* Suggestions */}
      {section.suggestions && section.suggestions.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            💡 Suggestions:
          </h4>
          <ul className="space-y-1">
            {section.suggestions.map((suggestion, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SectionReviewCard;

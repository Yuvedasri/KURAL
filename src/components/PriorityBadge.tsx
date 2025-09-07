import React from 'react';
import { ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

interface PriorityBadgeProps {
  priority: 'high' | 'medium' | 'low';
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  score,
  showScore = false,
  size = 'md',
  className = ''
}) => {
  const getIcon = () => {
    switch (priority) {
      case 'high':
        return <ExclamationTriangleIcon className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />;
      case 'medium':
        return <InformationCircleIcon className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />;
      case 'low':
        return <CheckCircleIcon className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />;
    }
  };

  const getStyles = () => {
    const baseStyles = `inline-flex items-center space-x-1 font-medium rounded-full border ${
      size === 'sm' ? 'px-2 py-1 text-xs' : 
      size === 'lg' ? 'px-4 py-2 text-base' : 
      'px-3 py-1 text-sm'
    }`;

    switch (priority) {
      case 'high':
        return `${baseStyles} priority-high`;
      case 'medium':
        return `${baseStyles} priority-medium`;
      case 'low':
        return `${baseStyles} priority-low`;
    }
  };

  const getLabel = () => {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
    }
  };

  return (
    <span className={`${getStyles()} ${className}`}>
      {getIcon()}
      <span>{getLabel()}</span>
      {showScore && score !== undefined && (
        <span className="opacity-75">({score.toFixed(2)})</span>
      )}
    </span>
  );
};
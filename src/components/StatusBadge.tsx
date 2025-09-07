import React from 'react';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  PlayIcon, 
  PauseIcon,
  DocumentIcon 
} from '@heroicons/react/24/solid';

interface StatusBadgeProps {
  status: 'new' | 'accepted' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = ''
}) => {
  const getIcon = () => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    
    switch (status) {
      case 'new':
        return <DocumentIcon className={iconSize} />;
      case 'accepted':
        return <CheckCircleIcon className={iconSize} />;
      case 'in_progress':
        return <PlayIcon className={iconSize} />;
      case 'resolved':
        return <CheckCircleIcon className={iconSize} />;
      case 'closed':
        return <PauseIcon className={iconSize} />;
      case 'rejected':
        return <XCircleIcon className={iconSize} />;
    }
  };

  const getStyles = () => {
    const baseStyles = `inline-flex items-center space-x-1 font-medium rounded-full px-2 py-1 ${
      size === 'sm' ? 'text-xs' : 
      size === 'lg' ? 'text-base px-4 py-2' : 
      'text-sm px-3 py-1'
    }`;

    switch (status) {
      case 'new':
        return `${baseStyles} status-new`;
      case 'accepted':
        return `${baseStyles} status-accepted`;
      case 'in_progress':
        return `${baseStyles} status-in-progress`;
      case 'resolved':
        return `${baseStyles} status-resolved`;
      case 'closed':
        return `${baseStyles} status-closed`;
      case 'rejected':
        return `${baseStyles} status-rejected`;
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'new':
        return 'New';
      case 'accepted':
        return 'Accepted';
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      case 'closed':
        return 'Closed';
      case 'rejected':
        return 'Rejected';
    }
  };

  return (
    <span className={`${getStyles()} ${className}`}>
      {getIcon()}
      <span>{getLabel()}</span>
    </span>
  );
};
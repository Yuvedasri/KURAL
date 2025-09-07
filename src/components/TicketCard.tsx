import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MapPinIcon, PhoneIcon, GlobeAltIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import { Ticket } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { t } from '../utils/i18n';

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
  showActions?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  className?: string;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onClick,
  showActions = false,
  onAccept,
  onReject,
  className = ''
}) => {
  const getChannelIcon = () => {
    switch (ticket.channel) {
      case 'web':
        return <GlobeAltIcon className="w-4 h-4" />;
      case 'whatsapp':
        return <PhoneIcon className="w-4 h-4" />;
      case 'phone':
        return <MicrophoneIcon className="w-4 h-4" />;
    }
  };

  const getCategoryColor = () => {
    return ticket.category === 'healthcare' ? 'text-red-600' : 'text-blue-600';
  };

  return (
    <div 
      className={`card hover:shadow-md transition-shadow duration-200 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {getChannelIcon()}
            <span className="font-mono font-medium text-gray-900">#{ticket.id}</span>
          </div>
          <PriorityBadge 
            priority={ticket.priority_label} 
            score={ticket.priority_score}
            showScore 
          />
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`text-sm font-medium ${getCategoryColor()}`}>
              {ticket.category === 'healthcare' ? t('category.healthcare') : t('category.education')}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-gray-800 text-sm line-clamp-3">
            {ticket.transcript_text}
          </p>
        </div>

        {/* User Info */}
        {ticket.user_name && (
          <div className="flex items-center space-x-4 text-xs text-gray-600">
            <span>{ticket.user_name}</span>
            {ticket.user_phone && (
              <span>{ticket.user_phone}</span>
            )}
          </div>
        )}

        {/* Location */}
        {ticket.location?.landmark_text && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <MapPinIcon className="w-3 h-3" />
            <span>{ticket.location.landmark_text}</span>
          </div>
        )}

        {/* Assignment Info */}
        {ticket.assignee_name && (
          <div className="text-xs text-gray-600">
            <span className="font-medium">Assigned to:</span> {ticket.assignee_name}
            {ticket.eta_iso && (
              <span className="ml-2">
                • ETA: {new Date(ticket.eta_iso).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && ticket.status === 'new' && (
        <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAccept?.();
            }}
            className="btn-primary flex-1 text-sm py-2"
          >
            {t('admin.accept')}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject?.();
            }}
            className="btn-danger flex-1 text-sm py-2"
          >
            {t('admin.reject')}
          </button>
        </div>
      )}
    </div>
  );
};
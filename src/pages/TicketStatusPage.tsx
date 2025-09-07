import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeftIcon, MapPinIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';
import { Ticket } from '../types';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { getTicketStatus } from '../utils/api';
import { t } from '../utils/i18n';
import toast from 'react-hot-toast';

export const TicketStatusPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputTicketId, setInputTicketId] = useState(ticketId || '');

  const fetchTicketStatus = async (id: string) => {
    if (!id.trim()) {
      toast.error('Please enter a ticket ID');
      return;
    }

    setLoading(true);
    try {
      const ticketData = await getTicketStatus(id);
      setTicket(ticketData);
    } catch (error) {
      toast.error(t('error.not_found'));
      console.error('Failed to fetch ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (ticketId) {
      fetchTicketStatus(ticketId);
    }
  }, [ticketId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTicketStatus(inputTicketId);
  };

  const playAudio = () => {
    if (ticket?.raw_audio_url) {
      const audio = new Audio(ticket.raw_audio_url);
      audio.play().catch(error => {
        toast.error('Failed to play audio');
        console.error('Audio play error:', error);
      });
    }
  };

  const getStatusMessage = () => {
    if (!ticket) return '';

    switch (ticket.status) {
      case 'new':
        return 'Your complaint has been received and is being reviewed.';
      case 'accepted':
        return `Your complaint has been accepted and assigned to ${ticket.assignee_name || 'our team'}.`;
      case 'in_progress':
        return 'Work is in progress on your complaint.';
      case 'resolved':
        return 'Your complaint has been resolved. Please confirm if the issue is fixed.';
      case 'closed':
        return 'Your complaint has been closed.';
      case 'rejected':
        return 'Your complaint has been reviewed and rejected.';
      default:
        return 'Status unknown.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('status.check')}</h1>
              <p className="text-sm text-gray-600">Track your complaint status</p>
            </div>
          </div>
          <LanguageSwitch />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="ticketId" className="block text-sm font-medium text-gray-700 mb-2">
                {t('status.enter_id')}
              </label>
              <input
                type="text"
                id="ticketId"
                value={inputTicketId}
                onChange={(e) => setInputTicketId(e.target.value)}
                placeholder="Enter ticket ID (e.g., TKT123456)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('loading')}</span>
                </div>
              ) : (
                'Check Status'
              )}
            </button>
          </form>
        </div>

        {/* Ticket Details */}
        {ticket && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Ticket #{ticket.id}
                </h2>
                <div className="flex items-center space-x-3">
                  <PriorityBadge 
                    priority={ticket.priority_label} 
                    score={ticket.priority_score}
                    showScore 
                  />
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</p>
                <p className="capitalize">{ticket.category}</p>
              </div>
            </div>

            {/* Status Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800">{getStatusMessage()}</p>
            </div>

            {/* Details */}
            <div className="space-y-4">
              {/* Transcript */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Complaint Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800">{ticket.transcript_text}</p>
                  {ticket.raw_audio_url && (
                    <button
                      onClick={playAudio}
                      className="mt-3 flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm"
                    >
                      <PlayIcon className="w-4 h-4" />
                      <span>Play Audio</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Assignment Info */}
              {ticket.assignee_name && (
                <div className="flex items-center space-x-2 text-sm">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Assigned to:</span>
                  <span className="font-medium text-gray-900">{ticket.assignee_name}</span>
                </div>
              )}

              {/* ETA */}
              {ticket.eta_iso && (
                <div className="flex items-center space-x-2 text-sm">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Expected completion:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(ticket.eta_iso).toLocaleDateString()} at {new Date(ticket.eta_iso).toLocaleTimeString()}
                  </span>
                </div>
              )}

              {/* Location */}
              {ticket.location?.landmark_text && (
                <div className="flex items-center space-x-2 text-sm">
                  <MapPinIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium text-gray-900">{ticket.location.landmark_text}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                You will receive SMS/WhatsApp updates when the status changes.
                Keep this ticket ID for future reference.
              </p>
            </div>
          </div>
        )}

        {/* Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact support or submit a new complaint.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Submit New Complaint
          </button>
        </div>
      </main>
    </div>
  );
};
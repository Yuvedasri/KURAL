import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  ArrowRightIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { TicketCard } from '../../components/TicketCard';
import { PriorityBadge } from '../../components/PriorityBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { LanguageSwitch } from '../../components/LanguageSwitch';
import { Ticket, TicketStats, User } from '../../types';
import { getAdminTickets, getAdminStats, acceptTicket, rejectTicket } from '../../utils/api';
import { t } from '../../utils/i18n';
import toast from 'react-hot-toast';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filters, setFilters] = useState({
    category: 'all' as 'all' | 'healthcare' | 'education',
    status: 'all' as string,
    search: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('kural-ai-user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/admin/login');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [ticketsData, statsData] = await Promise.all([
        getAdminTickets({ sort: 'priority' }),
        getAdminStats()
      ]);
      
      setTickets(ticketsData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kural-ai-token');
    localStorage.removeItem('kural-ai-user');
    navigate('/admin/login');
  };

  const handleAcceptTicket = async (ticketId: string) => {
    try {
      await acceptTicket(ticketId, {
        assignee: user?.name || 'Admin',
        eta: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        message: 'Complaint accepted and assigned for resolution'
      });
      
      toast.success(t('message.ticket_accepted'));
      loadData();
    } catch (error) {
      toast.error('Failed to accept ticket');
      console.error('Accept ticket error:', error);
    }
  };

  const handleRejectTicket = async (ticketId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await rejectTicket(ticketId, reason);
      toast.success(t('message.ticket_rejected'));
      loadData();
    } catch (error) {
      toast.error('Failed to reject ticket');
      console.error('Reject ticket error:', error);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filters.category !== 'all' && ticket.category !== filters.category) return false;
    if (filters.status !== 'all' && ticket.status !== filters.status) return false;
    if (filters.search && !ticket.transcript_text.toLowerCase().includes(filters.search.toLowerCase())) return false;
    
    // Role-based filtering
    if (user?.role === 'admin_health' && ticket.category !== 'healthcare') return false;
    if (user?.role === 'admin_edu' && ticket.category !== 'education') return false;
    
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('admin.dashboard')}</h1>
              <p className="text-sm text-gray-600">
                Welcome, {user?.name} ({user?.role?.replace('_', ' ')})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitch />
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">{t('stats.total_open')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_open}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">{t('stats.high_priority')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.high_priority_open}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ArrowRightIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">{t('stats.in_progress')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.in_progress}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">{t('stats.resolved_today')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.resolved_today}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avg_resolution_time}h</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">{t('stats.aging')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.aging_over_48h}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">{t('admin.filters')}:</span>
            </div>

            {/* Category Filter */}
            {user?.role === 'super_admin' && (
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any }))}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                <option value="healthcare">{t('category.healthcare')}</option>
                <option value="education">{t('category.education')}</option>
              </select>
            )}

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="accepted">Accepted</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Priority Queue ({filteredTickets.length} tickets)
            </h2>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">No tickets found matching your filters.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  showActions={ticket.status === 'new'}
                  onAccept={() => handleAcceptTicket(ticket.id)}
                  onReject={() => handleRejectTicket(ticket.id)}
                  onClick={() => setSelectedTicket(ticket)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ticket #{selectedTicket.id}
                </h3>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <PriorityBadge 
                    priority={selectedTicket.priority_label} 
                    score={selectedTicket.priority_score}
                    showScore 
                  />
                  <StatusBadge status={selectedTicket.status} />
                  <span className="text-sm text-gray-500 capitalize">
                    {selectedTicket.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Transcript</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedTicket.transcript_text}
                  </p>
                </div>

                {selectedTicket.location?.landmark_text && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                    <p className="text-gray-700">{selectedTicket.location.landmark_text}</p>
                  </div>
                )}

                {selectedTicket.status === 'new' && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        handleAcceptTicket(selectedTicket.id);
                        setSelectedTicket(null);
                      }}
                      className="btn-primary flex-1"
                    >
                      {t('admin.accept')}
                    </button>
                    <button
                      onClick={() => {
                        handleRejectTicket(selectedTicket.id);
                        setSelectedTicket(null);
                      }}
                      className="btn-danger flex-1"
                    >
                      {t('admin.reject')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
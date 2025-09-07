import axios, { AxiosResponse } from 'axios';
import { Ticket, TicketStats, TimelineEvent, User } from '../types';

// Mock API base URL - in production this would be your actual API
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kural-ai-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('kural-ai-token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Public API endpoints
export const uploadAudio = async (audioBlob: Blob, location?: any, landmark?: string): Promise<Ticket> => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'complaint.webm');
  
  if (location) {
    formData.append('location', JSON.stringify(location));
  }
  
  if (landmark) {
    formData.append('landmark', landmark);
  }

  // Mock response for demo
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const mockTicket: Ticket = {
    id: `TKT${Date.now()}`,
    user_id: 'user123',
    channel: 'web',
    raw_audio_url: URL.createObjectURL(audioBlob),
    transcript_text: 'Mock transcript: Healthcare issue with ambulance delay',
    lang: 'en-IN',
    category: 'healthcare',
    priority_score: 0.75,
    priority_label: 'high',
    status: 'new',
    location: {
      lat: location?.lat,
      lng: location?.lng,
      landmark_text: landmark
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return mockTicket;
};

export const getTicketStatus = async (ticketId: string): Promise<Ticket> => {
  // Mock response
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockTicket: Ticket = {
    id: ticketId,
    user_id: 'user123',
    channel: 'web',
    transcript_text: 'Mock transcript for status check',
    lang: 'en-IN',
    category: 'healthcare',
    priority_score: 0.65,
    priority_label: 'medium',
    status: 'in_progress',
    assignee_name: 'Dr. Kumar',
    eta_iso: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    location: {
      landmark_text: 'Near Government Hospital'
    },
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return mockTicket;
};

// Admin API endpoints
export const adminLogin = async (credentials: { phone?: string; username?: string; password: string }): Promise<{ token: string; user: User }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockUser: User = {
    id: 'admin123',
    role: 'admin_health',
    name: 'Admin User',
    phone: '+919876543210',
    lang: 'en-IN',
    created_at: new Date().toISOString()
  };
  
  const token = 'mock-jwt-token';
  localStorage.setItem('kural-ai-token', token);
  
  return { token, user: mockUser };
};

export const getAdminTickets = async (filters?: {
  category?: 'healthcare' | 'education';
  status?: string;
  sort?: string;
}): Promise<Ticket[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockTickets: Ticket[] = [
    {
      id: 'TKT001',
      user_id: 'user1',
      user_name: 'Ravi Kumar',
      user_phone: '+919876543210',
      channel: 'web',
      transcript_text: 'Ambulance not available for emergency. Patient in critical condition.',
      lang: 'en-IN',
      category: 'healthcare',
      priority_score: 0.85,
      priority_label: 'high',
      status: 'new',
      location: { landmark_text: 'Near Primary Health Center, Thanjavur' },
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'TKT002',
      user_id: 'user2',
      user_name: 'Meera Devi',
      user_phone: '+919876543211',
      channel: 'whatsapp',
      transcript_text: 'School toilet is broken for 3 days. Children facing difficulty.',
      lang: 'ta-IN',
      category: 'education',
      priority_score: 0.55,
      priority_label: 'medium',
      status: 'accepted',
      assignee_name: 'Education Officer',
      eta_iso: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      location: { landmark_text: 'Government School, Kumbakonam' },
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'TKT003',
      user_id: 'user3',
      user_name: 'Suresh Babu',
      user_phone: '+919876543212',
      channel: 'phone',
      transcript_text: 'Medicine stock is low at PHC. Diabetes medicines not available.',
      lang: 'en-IN',
      category: 'healthcare',
      priority_score: 0.45,
      priority_label: 'medium',
      status: 'in_progress',
      assignee_name: 'Dr. Priya',
      location: { landmark_text: 'PHC Trichy' },
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  ];
  
  return mockTickets.filter(ticket => {
    if (filters?.category && ticket.category !== filters.category) return false;
    if (filters?.status && ticket.status !== filters.status) return false;
    return true;
  }).sort((a, b) => {
    if (filters?.sort === 'priority') {
      return b.priority_score - a.priority_score;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

export const acceptTicket = async (ticketId: string, data: { assignee: string; eta: string; message?: string }): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export const rejectTicket = async (ticketId: string, reason: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export const updateTicketStatus = async (ticketId: string, status: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export const addTicketProgress = async (ticketId: string, message: string, attachments?: string[]): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export const notifyUser = async (ticketId: string, channel: 'text' | 'voice', template: string, payload: any): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export const getTicketTimeline = async (ticketId: string): Promise<TimelineEvent[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockTimeline: TimelineEvent[] = [
    {
      id: 'evt1',
      ticket_id: ticketId,
      type: 'status_change',
      message_text: 'Ticket created',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'evt2',
      ticket_id: ticketId,
      type: 'note',
      by_user_name: 'Admin',
      message_text: 'Reviewing the complaint',
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  return mockTimeline;
};

export const getAdminStats = async (): Promise<TicketStats> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockStats: TicketStats = {
    total_open: 15,
    high_priority_open: 5,
    in_progress: 8,
    resolved_today: 12,
    avg_resolution_time: 18.5,
    aging_over_48h: 3,
    by_priority: {
      high: 5,
      medium: 7,
      low: 3
    },
    by_status: {
      new: 4,
      accepted: 3,
      in_progress: 8,
      resolved: 12,
      closed: 25,
      rejected: 2
    },
    by_category: {
      healthcare: 9,
      education: 6
    }
  };
  
  return mockStats;
};
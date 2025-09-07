export interface User {
  id: string;
  role: 'user' | 'admin_health' | 'admin_edu' | 'super_admin';
  name: string;
  phone: string;
  lang: 'ta-IN' | 'en-IN';
  created_at: string;
  last_login?: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  channel: 'web' | 'whatsapp' | 'phone';
  raw_audio_url?: string;
  transcript_text: string;
  lang: 'ta-IN' | 'en-IN';
  category: 'healthcare' | 'education';
  priority_score: number;
  priority_label: 'high' | 'medium' | 'low';
  status: 'new' | 'accepted' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
  assignee_id?: string;
  assignee_name?: string;
  eta_iso?: string;
  location: {
    lat?: number;
    lng?: number;
    landmark_text?: string;
  };
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_phone?: string;
}

export interface TimelineEvent {
  id: string;
  ticket_id: string;
  type: 'status_change' | 'note' | 'eta_update' | 'user_notified';
  by_user_id?: string;
  by_user_name?: string;
  message_text: string;
  attachments?: string[];
  created_at: string;
}

export interface Notification {
  id: string;
  ticket_id: string;
  to_phone: string;
  channel: 'sms' | 'whatsapp' | 'tts_call' | 'app';
  template_key: string;
  lang: 'ta-IN' | 'en-IN';
  payload_json: Record<string, any>;
  sent_at?: string;
  status: 'pending' | 'sent' | 'failed';
}

export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string;
  meta_json: Record<string, any>;
  created_at: string;
}

export interface PriorityAnalysis {
  semantic_severity: number;
  keyword_intent: number;
  vulnerability_boost: number;
  recency_boost: number;
  evidence_boost: number;
  matched_seeds: string[];
  matched_keywords: string[];
}

export interface TicketStats {
  total_open: number;
  high_priority_open: number;
  in_progress: number;
  resolved_today: number;
  avg_resolution_time: number;
  aging_over_48h: number;
  by_priority: {
    high: number;
    medium: number;
    low: number;
  };
  by_status: {
    new: number;
    accepted: number;
    in_progress: number;
    resolved: number;
    closed: number;
    rejected: number;
  };
  by_category: {
    healthcare: number;
    education: number;
  };
}

export interface Language {
  code: 'ta-IN' | 'en-IN';
  name: string;
  nativeName: string;
}

export interface VoiceRecording {
  blob: Blob;
  duration: number;
  url: string;
}

export interface LocationData {
  lat?: number;
  lng?: number;
  landmark?: string;
  accuracy?: number;
}
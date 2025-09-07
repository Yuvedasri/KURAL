export const LANGUAGES = {
  'en-IN': {
    code: 'en-IN' as const,
    name: 'English',
    nativeName: 'English'
  },
  'ta-IN': {
    code: 'ta-IN' as const,
    name: 'Tamil',
    nativeName: 'தமிழ்'
  }
};

export const PRIORITY_THRESHOLDS = {
  HIGH: 0.70,
  MEDIUM: 0.40
} as const;

export const PRIORITY_COLORS = {
  high: 'error',
  medium: 'warning',
  low: 'success'
} as const;

export const STATUS_COLORS = {
  new: 'blue',
  accepted: 'yellow',
  in_progress: 'purple',
  resolved: 'green',
  closed: 'gray',
  rejected: 'red'
} as const;

export const CATEGORIES = {
  healthcare: 'healthcare',
  education: 'education'
} as const;

export const CHANNELS = {
  web: 'web',
  whatsapp: 'whatsapp',
  phone: 'phone'
} as const;

export const USER_ROLES = {
  user: 'user',
  admin_health: 'admin_health',
  admin_edu: 'admin_edu',
  super_admin: 'super_admin'
} as const;

// Embedding seeds for categorization and prioritization
export const EMBEDDING_SEEDS = {
  healthcare: [
    "no doctor available",
    "medicine shortage", 
    "PHC closed",
    "ambulance delay",
    "fever outbreak",
    "contaminated water",
    "pregnancy assistance",
    "toilet broken in PHC"
  ],
  education: [
    "no teacher",
    "school closed", 
    "no lights in classroom",
    "broken benches",
    "no drinking water in school",
    "unsafe route to school",
    "toilet broken in school"
  ],
  severity: {
    high: [
      "emergency",
      "accident", 
      "bleeding",
      "snake bite",
      "child injured",
      "school building crack",
      "electrical short in classroom",
      "no mid-day meal"
    ],
    medium: [
      "intermittent service",
      "teacher absent repeatedly", 
      "PHC opens late",
      "medicine stock low"
    ],
    low: [
      "paint peeling",
      "notice board broken"
    ]
  }
};

export const PRIORITY_KEYWORDS = {
  urgent: ["urgent", "emergency", "immediately", "today", "now", "asap"],
  medical: ["hospital", "doctor", "medicine", "fever", "pain", "bleeding", "ambulance", "injury"],
  vulnerable: ["child", "children", "pregnant", "elderly", "disabled", "baby"],
  education: ["school", "teacher", "exam", "student", "classroom"],
  infrastructure: ["toilet", "water", "electricity", "building", "road"]
};

export const NOTIFICATION_TEMPLATES = {
  created: {
    'en-IN': "Your complaint (#{{ticketId}}) categorized as {{category}}, Priority: {{priority}} ({{score}}). We will update soon.",
    'ta-IN': "உங்கள் புகார் (#{{ticketId}}) {{category}} என வகைப்படுத்தப்பட்டது, முன்னுரிமை: {{priority}} ({{score}}). விரைவில் புதுப்பிப்போம்."
  },
  accepted: {
    'en-IN': "Your complaint (#{{ticketId}}) is accepted. ETA: {{eta}}. Assigned to {{assignee}}.",
    'ta-IN': "உங்கள் புகார் (#{{ticketId}}) ஏற்றுக்கொள்ளப்பட்டது. எதிர்பார்க்கப்படும் நேரம்: {{eta}}. {{assignee}} க்கு ஒதுக்கப்பட்டது."
  },
  in_progress: {
    'en-IN': "Work started: {{message}}",
    'ta-IN': "வேலை தொடங்கியது: {{message}}"
  },
  resolved: {
    'en-IN': "Issue resolved. Reply 1 if resolved, 2 if not.",
    'ta-IN': "பிரச்சினை தீர்க்கப்பட்டது. தீர்க்கப்பட்டால் 1, இல்லையென்றால் 2 என பதிலளிக்கவும்."
  }
};

export const API_ENDPOINTS = {
  // Public endpoints
  UPLOAD_AUDIO: '/api/upload/audio',
  TICKET_STATUS: '/api/tickets/:id/status',
  TICKET_QUERY: '/api/tickets/:id/query',
  
  // Webhooks
  WHATSAPP_WEBHOOK: '/webhook/whatsapp',
  VOICE_WEBHOOK: '/webhook/voice',
  SMS_DELIVERY: '/webhook/smsDelivery',
  
  // Admin endpoints
  AUTH_LOGIN: '/api/auth/login',
  ADMIN_TICKETS: '/api/admin/tickets',
  ADMIN_TICKET_ACCEPT: '/api/admin/tickets/:id/accept',
  ADMIN_TICKET_REJECT: '/api/admin/tickets/:id/reject',
  ADMIN_TICKET_PROGRESS: '/api/admin/tickets/:id/progress',
  ADMIN_TICKET_STATUS: '/api/admin/tickets/:id/status',
  ADMIN_TICKET_NOTIFY: '/api/admin/tickets/:id/notify',
  ADMIN_STATS: '/api/admin/stats'
} as const;
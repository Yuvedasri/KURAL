import { LANGUAGES } from './constants';

export type Language = keyof typeof LANGUAGES;

const translations = {
  'en-IN': {
    // Common
    'app.title': 'KuralAI',
    'app.subtitle': 'Voice-Enabled Grievance System',
    'language.switch': 'Switch Language',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'cancel': 'Cancel',
    'submit': 'Submit',
    'save': 'Save',
    'delete': 'Delete',
    'edit': 'Edit',
    'view': 'View',
    'close': 'Close',
    'back': 'Back',
    'next': 'Next',
    'previous': 'Previous',
    
    // Voice Recording
    'voice.record': 'Record Your Problem',
    'voice.recording': 'Recording...',
    'voice.stop': 'Stop Recording',
    'voice.play': 'Play Recording',
    'voice.rerecord': 'Record Again',
    'voice.submit': 'Submit Complaint',
    'voice.permission': 'Please allow microphone access to record your complaint',
    'voice.not_supported': 'Voice recording is not supported in your browser',
    
    // Location
    'location.current': 'Use Current Location',
    'location.landmark': 'Landmark (Optional)',
    'location.landmark.placeholder': 'Enter nearby landmark or address',
    'location.permission': 'Please allow location access for better service',
    
    // Ticket
    'ticket.id': 'Ticket ID',
    'ticket.category': 'Category',
    'ticket.priority': 'Priority',
    'ticket.status': 'Status',
    'ticket.created': 'Created',
    'ticket.updated': 'Updated',
    'ticket.assignee': 'Assigned To',
    'ticket.eta': 'Expected Time',
    'ticket.location': 'Location',
    'ticket.transcript': 'Transcript',
    'ticket.audio': 'Audio Recording',
    
    // Categories
    'category.healthcare': 'Healthcare',
    'category.education': 'Education',
    
    // Priority
    'priority.high': 'High',
    'priority.medium': 'Medium',
    'priority.low': 'Low',
    
    // Status
    'status.new': 'New',
    'status.accepted': 'Accepted',
    'status.in_progress': 'In Progress',
    'status.resolved': 'Resolved',
    'status.closed': 'Closed',
    'status.rejected': 'Rejected',
    
    // Admin Dashboard
    'admin.dashboard': 'Admin Dashboard',
    'admin.tickets': 'Tickets',
    'admin.stats': 'Statistics',
    'admin.accept': 'Accept',
    'admin.reject': 'Reject',
    'admin.assign': 'Assign',
    'admin.update': 'Update',
    'admin.notify': 'Notify User',
    'admin.timeline': 'Timeline',
    'admin.filters': 'Filters',
    
    // Stats
    'stats.total_open': 'Total Open',
    'stats.high_priority': 'High Priority',
    'stats.in_progress': 'In Progress',
    'stats.resolved_today': 'Resolved Today',
    'stats.avg_resolution': 'Avg Resolution Time',
    'stats.aging': 'Aging >48h',
    
    // Messages
    'message.ticket_created': 'Your complaint has been submitted successfully',
    'message.ticket_accepted': 'Complaint accepted and assigned',
    'message.ticket_rejected': 'Complaint rejected',
    'message.ticket_updated': 'Complaint updated successfully',
    'message.notification_sent': 'User notified successfully',
    
    // Errors
    'error.recording_failed': 'Failed to record audio',
    'error.upload_failed': 'Failed to upload complaint',
    'error.location_failed': 'Failed to get location',
    'error.network': 'Network error. Please try again.',
    'error.unauthorized': 'Unauthorized access',
    'error.not_found': 'Not found',
    'error.server': 'Server error. Please try again later.',
    
    // Check Status
    'status.check': 'Check Status',
    'status.enter_id': 'Enter Ticket ID',
    'status.voice_query': 'Ask by Voice',
    'status.speak_query': 'Say "What is the status of my ticket"',
  },
  
  'ta-IN': {
    // Common
    'app.title': 'குரல்AI',
    'app.subtitle': 'குரல் அடிப்படையிலான புகார் அமைப்பு',
    'language.switch': 'மொழி மாற்று',
    'loading': 'ஏற்றுகிறது...',
    'error': 'பிழை',
    'success': 'வெற்றி',
    'cancel': 'ரத்து',
    'submit': 'சமர்பிக்கவும்',
    'save': 'சேமிக்கவும்',
    'delete': 'நீக்கவும்',
    'edit': 'திருத்தவும்',
    'view': 'பார்க்கவும்',
    'close': 'மூடவும்',
    'back': 'பின்',
    'next': 'அடுத்து',
    'previous': 'முந்தைய',
    
    // Voice Recording
    'voice.record': 'உங்கள் பிரச்சினையை பதிவு செய்யுங்கள்',
    'voice.recording': 'பதிவு செய்கிறது...',
    'voice.stop': 'பதிவை நிறுத்து',
    'voice.play': 'பதிவை கேளுங்கள்',
    'voice.rerecord': 'மீண்டும் பதிவு செய்',
    'voice.submit': 'புகார் சமர்பிக்கவும்',
    'voice.permission': 'புகார் பதிவு செய்ய மைக்ரோஃபோன் அனுமதி தேவை',
    'voice.not_supported': 'உங்கள் உலாவியில் குரல் பதிவு ஆதரிக்கப்படவில்லை',
    
    // Location
    'location.current': 'தற்போதைய இடத்தை பயன்படுத்து',
    'location.landmark': 'அடையாளம் (விருப்பம்)',
    'location.landmark.placeholder': 'அருகிலுள்ள அடையாளம் அல்லது முகவரியை உள்ளிடவும்',
    'location.permission': 'சிறந்த சேவைக்காக இடம் அணுக அனுமதி தேவை',
    
    // Ticket
    'ticket.id': 'டிக்கெட் எண்',
    'ticket.category': 'வகை',
    'ticket.priority': 'முன்னுரிமை',
    'ticket.status': 'நிலை',
    'ticket.created': 'உருவாக்கப்பட்டது',
    'ticket.updated': 'புதுப்பிக்கப்பட்டது',
    'ticket.assignee': 'ஒதுக்கப்பட்டவர்',
    'ticket.eta': 'எதிர்பார்க்கப்படும் நேரம்',
    'ticket.location': 'இடம்',
    'ticket.transcript': 'எழுத்து வடிவம்',
    'ticket.audio': 'ஆடியோ பதிவு',
    
    // Categories
    'category.healthcare': 'சுகாதாரம்',
    'category.education': 'கல்வி',
    
    // Priority
    'priority.high': 'உயர்',
    'priority.medium': 'நடுத்தர',
    'priority.low': 'குறைந்த',
    
    // Status
    'status.new': 'புதிய',
    'status.accepted': 'ஏற்றுக்கொள்ளப்பட்டது',
    'status.in_progress': 'செயல்பாட்டில்',
    'status.resolved': 'தீர்க்கப்பட்டது',
    'status.closed': 'மூடப்பட்டது',
    'status.rejected': 'நிராகரிக்கப்பட்டது',
    
    // Admin Dashboard
    'admin.dashboard': 'நிர்வாக பலகை',
    'admin.tickets': 'டிக்கெட்டுகள்',
    'admin.stats': 'புள்ளிவிவரங்கள்',
    'admin.accept': 'ஏற்றுக்கொள்',
    'admin.reject': 'நிராகரி',
    'admin.assign': 'ஒதுக்கு',
    'admin.update': 'புதுப்பி',
    'admin.notify': 'பயனரை அறிவி',
    'admin.timeline': 'காலவரிசை',
    'admin.filters': 'வடிகட்டிகள்',
    
    // Stats
    'stats.total_open': 'மொத்த திறந்த',
    'stats.high_priority': 'உயர் முன்னுரிமை',
    'stats.in_progress': 'செயல்பாட்டில்',
    'stats.resolved_today': 'இன்று தீர்க்கப்பட்டது',
    'stats.avg_resolution': 'சராசரி தீர்வு நேரம்',
    'stats.aging': '48 மணி நேரத்திற்கு மேல்',
    
    // Messages
    'message.ticket_created': 'உங்கள் புகார் வெற்றிகரமாக சமர்பிக்கப்பட்டது',
    'message.ticket_accepted': 'புகார் ஏற்றுக்கொள்ளப்பட்டு ஒதுக்கப்பட்டது',
    'message.ticket_rejected': 'புகார் நிராகரிக்கப்பட்டது',
    'message.ticket_updated': 'புகார் வெற்றிகரமாக புதுப்பிக்கப்பட்டது',
    'message.notification_sent': 'பயனர் வெற்றிகரமாக அறிவிக்கப்பட்டார்',
    
    // Errors
    'error.recording_failed': 'ஆடியோ பதிவு தோல்வி',
    'error.upload_failed': 'புகார் பதிவேற்றம் தோல்வி',
    'error.location_failed': 'இடம் பெற தோல்வி',
    'error.network': 'நெட்வொர்க் பிழை. மீண்டும் முயற்சிக்கவும்.',
    'error.unauthorized': 'அங்கீகரிக்கப்படாத அணுகல்',
    'error.not_found': 'கிடைக்கவில்லை',
    'error.server': 'சர்வர் பிழை. பின்னர் முயற்சிக்கவும்.',
    
    // Check Status
    'status.check': 'நிலை சரிபார்',
    'status.enter_id': 'டிக்கெட் எண் உள்ளிடவும்',
    'status.voice_query': 'குரல் மூலம் கேளுங்கள்',
    'status.speak_query': '"என் டிக்கெட்டின் நிலை என்ன" என்று சொல்லுங்கள்',
  }
};

let currentLanguage: Language = 'en-IN';

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  localStorage.setItem('kural-ai-lang', lang);
};

export const getLanguage = (): Language => {
  const saved = localStorage.getItem('kural-ai-lang') as Language;
  return saved && saved in LANGUAGES ? saved : 'en-IN';
};

export const t = (key: string, params?: Record<string, string>): string => {
  const lang = currentLanguage;
  let text = translations[lang]?.[key as keyof typeof translations[typeof lang]] || key;
  
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(new RegExp(`{{${param}}}`, 'g'), value);
    });
  }
  
  return text;
};

export const initializeLanguage = () => {
  currentLanguage = getLanguage();
};

export const getAvailableLanguages = () => {
  return Object.values(LANGUAGES);
};
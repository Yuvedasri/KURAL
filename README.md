# KuralAI - Voice-Enabled Grievance System

A comprehensive voice-first multilingual grievance system for healthcare and education complaints, built with React, TypeScript, and modern web technologies.

## 🎯 Features

### Core Functionality
- **Voice-First Interface**: Record complaints using voice with automatic speech-to-text
- **Multi-Channel Intake**: Web app, WhatsApp bot, and phone/IVR support
- **Multilingual Support**: Tamil and English with easy extensibility
- **Smart Prioritization**: AI-powered priority scoring using word embeddings
- **Real-time Status Tracking**: Check complaint status via voice or text
- **Admin Dashboard**: Comprehensive management interface for administrators

### Technical Features
- **PWA Support**: Installable on mobile devices, works offline
- **Responsive Design**: Optimized for all screen sizes
- **Accessibility**: Screen reader support, high contrast mode
- **Role-Based Access**: Different admin roles for healthcare and education
- **Real-time Notifications**: SMS, WhatsApp, and voice updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd kural-ai
npm install
```

2. **Start development server**
```bash
npm run dev
```

3. **Access the application**
- User Interface: http://localhost:5173
- Admin Login: http://localhost:5173/admin/login

### Demo Credentials

**Admin Login:**
- Healthcare Admin: `admin_health` / `password123`
- Education Admin: `admin_edu` / `password123`  
- Super Admin: `super_admin` / `password123`

## 📱 User Journey

### For Citizens (Villagers)

1. **Submit Complaint**
   - Visit the web app or use WhatsApp/phone
   - Record voice complaint (Tamil/English)
   - Provide location (GPS + landmark)
   - Receive ticket ID and priority

2. **Track Status**
   - Enter ticket ID or use voice query
   - Get real-time status updates
   - Receive SMS/WhatsApp notifications

### For Administrators

1. **Dashboard Overview**
   - View priority-sorted complaint queue
   - See KPIs and statistics
   - Filter by category, status, priority

2. **Complaint Management**
   - Accept/reject new complaints
   - Assign to team members
   - Set ETAs and update progress
   - Send notifications to users

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **React Hot Toast** for notifications

### Key Components
- `VoiceRecorder`: Handles audio recording and playback
- `LocationInput`: GPS location and landmark capture
- `PriorityBadge`: Visual priority indicators
- `TicketCard`: Complaint display component
- `AdminDashboard`: Management interface

### Priority Scoring Algorithm

The system uses a sophisticated scoring algorithm:

```typescript
priority_score = clamp01(
  0.45 * semantic_severity_sim +
  0.25 * keyword_intent_score +
  0.15 * vulnerability_boost +
  0.10 * recency_boost +
  0.05 * evidence_boost
)
```

**Priority Mapping:**
- High: ≥ 0.70
- Medium: 0.40-0.69  
- Low: < 0.40

## 🌐 Internationalization

### Supported Languages
- **English (en-IN)**: Primary interface language
- **Tamil (ta-IN)**: Native language support with proper fonts

### Adding New Languages

1. **Add language to constants**
```typescript
// src/utils/constants.ts
export const LANGUAGES = {
  'hi-IN': { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' }
};
```

2. **Add translations**
```typescript
// src/utils/i18n.ts
const translations = {
  'hi-IN': {
    'app.title': 'कुरलAI',
    // ... other translations
  }
};
```

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_WHATSAPP_WEBHOOK_URL=https://your-domain.com/webhook/whatsapp
VITE_VOICE_WEBHOOK_URL=https://your-domain.com/webhook/voice
```

### Embedding Seeds
Customize priority detection in `src/utils/constants.ts`:

```typescript
export const EMBEDDING_SEEDS = {
  healthcare: [
    "no doctor available",
    "medicine shortage",
    // Add more healthcare-specific terms
  ],
  education: [
    "no teacher",
    "school closed",
    // Add more education-specific terms
  ]
};
```

## 📊 API Integration

### Mock API Endpoints
The current implementation uses mock APIs. For production:

1. **Replace mock functions** in `src/utils/api.ts`
2. **Implement real backend** with:
   - Speech-to-text service (Whisper/Google STT)
   - Text-to-speech for notifications
   - WhatsApp Business API integration
   - SMS gateway integration
   - Database (PostgreSQL with pgvector)

### Key API Endpoints
```typescript
// Public endpoints
POST /api/upload/audio
GET /api/tickets/:id/status
POST /api/tickets/:id/query

// Admin endpoints  
POST /api/auth/login
GET /api/admin/tickets
POST /api/admin/tickets/:id/accept
POST /api/admin/tickets/:id/reject

// Webhooks
POST /webhook/whatsapp
POST /webhook/voice
```

## 🎨 Customization

### Theming
Modify colors in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* Custom primary colors */ },
      success: { /* Custom success colors */ },
      // ... other color schemes
    }
  }
}
```

### Voice Recording Settings
Adjust audio settings in `src/utils/audio.ts`:
```typescript
const stream = await navigator.mediaDevices.getUserMedia({ 
  audio: {
    sampleRate: 16000,
    echoCancellation: true,
    noiseSuppression: true
  } 
});
```

## 🧪 Testing

### Manual Testing Scenarios

1. **Voice Recording**
   - Test microphone permissions
   - Record in different languages
   - Test audio playback

2. **Priority Classification**
   - Submit high-priority complaints (emergencies)
   - Test medium-priority issues
   - Verify low-priority categorization

3. **Admin Workflow**
   - Login with different admin roles
   - Accept/reject complaints
   - Update ticket status

### Sample Test Utterances

**Healthcare (High Priority):**
```
"Ambulance not available for emergency. Patient in critical condition."
```

**Education (Medium Priority):**
```
"School toilet is broken for 3 days. Children facing difficulty."
```

## 📱 PWA Features

### Installation
- Add to home screen on mobile devices
- Offline capability for draft complaints
- Push notifications (when implemented)

### Offline Support
- Cache shell application
- Store draft recordings locally
- Sync when connection restored

## 🔒 Security Considerations

### Data Protection
- PII redaction in transcripts
- Encrypted audio storage
- Secure token-based authentication

### Access Control
- Role-based admin permissions
- Rate limiting on public endpoints
- Input validation and sanitization

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files in `dist/` can be deployed to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

### Backend Requirements
For full functionality, deploy backend services:
- Node.js/Python API server
- PostgreSQL database with pgvector
- Redis for queues
- WhatsApp Business API
- SMS gateway integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

---

**Built with ❤️ for rural communities in Tamil Nadu**
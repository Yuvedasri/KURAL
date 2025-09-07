import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { LocationInput } from '../components/LocationInput';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { VoiceRecording, LocationData } from '../types';
import { uploadAudio } from '../utils/api';
import { t } from '../utils/i18n';
import toast from 'react-hot-toast';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [recording, setRecording] = useState<VoiceRecording | null>(null);
  const [location, setLocation] = useState<LocationData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecordingComplete = (newRecording: VoiceRecording) => {
    setRecording(newRecording);
  };

  const handleLocationChange = (newLocation: LocationData) => {
    setLocation(newLocation);
  };

  const handleSubmit = async () => {
    if (!recording) {
      toast.error('Please record your complaint first');
      return;
    }

    setIsSubmitting(true);

    try {
      const ticket = await uploadAudio(
        recording.blob,
        location.lat && location.lng ? { lat: location.lat, lng: location.lng } : undefined,
        location.landmark
      );

      toast.success(t('message.ticket_created'));
      navigate(`/ticket/${ticket.id}`);
    } catch (error) {
      toast.error(t('error.upload_failed'));
      console.error('Failed to submit complaint:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('app.title')}</h1>
            <p className="text-sm text-gray-600">{t('app.subtitle')}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/status')}
              className="btn-secondary text-sm"
            >
              {t('status.check')}
            </button>
            <LanguageSwitch />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Submit Your Complaint
            </h2>
            <p className="text-gray-600">
              Record your healthcare or education concern using your voice
            </p>
          </div>

          {/* Voice Recorder */}
          <div className="mb-8">
            <VoiceRecorder
              onRecordingComplete={handleRecordingComplete}
              disabled={isSubmitting}
            />
          </div>

          {/* Location Input */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Location Information
            </h3>
            <LocationInput
              onLocationChange={handleLocationChange}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={!recording || isSubmitting}
              className={`
                w-full py-4 px-6 text-lg font-medium rounded-lg transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-offset-2
                ${recording && !isSubmitting
                  ? 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-300'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                t('voice.submit')
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Your complaint will be automatically categorized and prioritized.
              You'll receive a ticket number and status updates.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
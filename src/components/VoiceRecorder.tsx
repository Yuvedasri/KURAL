import React, { useState, useRef, useEffect } from 'react';
import { MicrophoneIcon, StopIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { AudioRecorder, AudioPlayer, checkAudioSupport, formatDuration } from '../utils/audio';
import { VoiceRecording } from '../types';
import { t } from '../utils/i18n';
import toast from 'react-hot-toast';

interface VoiceRecorderProps {
  onRecordingComplete: (recording: VoiceRecording) => void;
  disabled?: boolean;
  className?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  disabled = false,
  className = ''
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recording, setRecording] = useState<VoiceRecording | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const recorderRef = useRef<AudioRecorder | null>(null);
  const playerRef = useRef<AudioPlayer | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!checkAudioSupport()) {
      toast.error(t('voice.not_supported'));
      return;
    }

    recorderRef.current = new AudioRecorder();
    playerRef.current = new AudioPlayer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      recorderRef.current?.cleanup();
      playerRef.current?.stop();
    };
  }, []);

  const initializeRecorder = async () => {
    if (!recorderRef.current || isInitialized) return;

    try {
      await recorderRef.current.initialize();
      setIsInitialized(true);
    } catch (error) {
      toast.error(t('voice.permission'));
      console.error('Failed to initialize recorder:', error);
    }
  };

  const startRecording = async () => {
    if (!recorderRef.current) return;

    try {
      if (!isInitialized) {
        await initializeRecorder();
      }

      recorderRef.current.startRecording();
      setIsRecording(true);
      setRecordingTime(0);
      setRecording(null);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 100);
      }, 100);

      toast.success('Recording started');
    } catch (error) {
      toast.error(t('error.recording_failed'));
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current || !isRecording) return;

    try {
      const recording = await recorderRef.current.stopRecording();
      setIsRecording(false);
      setRecording(recording);
      onRecordingComplete(recording);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      toast.success('Recording completed');
    } catch (error) {
      toast.error(t('error.recording_failed'));
      console.error('Failed to stop recording:', error);
    }
  };

  const playRecording = async () => {
    if (!recording || !playerRef.current) return;

    try {
      setIsPlaying(true);
      await playerRef.current.play(recording.url);
      setIsPlaying(false);
    } catch (error) {
      setIsPlaying(false);
      toast.error('Failed to play recording');
      console.error('Failed to play recording:', error);
    }
  };

  const stopPlaying = () => {
    if (playerRef.current) {
      playerRef.current.stop();
      setIsPlaying(false);
    }
  };

  const resetRecording = () => {
    setRecording(null);
    setRecordingTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Record Button */}
      <div className="flex flex-col items-center space-y-4">
        {!recording ? (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled}
            className={`
              relative w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-lg
              transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2
              ${isRecording 
                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300 recording-pulse' 
                : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            aria-label={isRecording ? t('voice.stop') : t('voice.record')}
          >
            {isRecording ? (
              <StopIcon className="w-8 h-8" />
            ) : (
              <MicrophoneIcon className="w-8 h-8" />
            )}
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <button
              onClick={isPlaying ? stopPlaying : playRecording}
              className="w-16 h-16 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center text-white focus:outline-none focus:ring-4 focus:ring-green-300"
              aria-label={isPlaying ? 'Stop' : t('voice.play')}
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6 ml-1" />
              )}
            </button>
            
            <button
              onClick={resetRecording}
              className="w-16 h-16 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center text-white focus:outline-none focus:ring-4 focus:ring-gray-300"
              aria-label={t('voice.rerecord')}
            >
              <MicrophoneIcon className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Status Text */}
        <div className="text-center">
          {isRecording ? (
            <div className="space-y-2">
              <p className="text-lg font-medium text-red-600">
                {t('voice.recording')}
              </p>
              <p className="text-sm text-gray-600">
                {formatDuration(recordingTime)}
              </p>
            </div>
          ) : recording ? (
            <div className="space-y-2">
              <p className="text-lg font-medium text-green-600">
                Recording Ready
              </p>
              <p className="text-sm text-gray-600">
                Duration: {formatDuration(recording.duration)}
              </p>
            </div>
          ) : (
            <p className="text-lg font-medium text-gray-700">
              {t('voice.record')}
            </p>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 max-w-md mx-auto">
        {!isRecording && !recording && (
          <p>
            Tap the microphone button and speak clearly about your healthcare or education concern.
          </p>
        )}
        {isRecording && (
          <p>
            Speak now... Tap the stop button when finished.
          </p>
        )}
        {recording && (
          <p>
            Review your recording by playing it back, or record again if needed.
          </p>
        )}
      </div>
    </div>
  );
};
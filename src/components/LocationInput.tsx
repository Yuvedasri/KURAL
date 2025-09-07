import React, { useState, useEffect } from 'react';
import { MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { getCurrentLocation, formatLocation } from '../utils/location';
import { LocationData } from '../types';
import { t } from '../utils/i18n';
import toast from 'react-hot-toast';

interface LocationInputProps {
  onLocationChange: (location: LocationData) => void;
  disabled?: boolean;
  className?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  onLocationChange,
  disabled = false,
  className = ''
}) => {
  const [location, setLocation] = useState<LocationData>({});
  const [landmark, setLandmark] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    const locationData = { ...location, landmark };
    onLocationChange(locationData);
  }, [location, landmark, onLocationChange]);

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    
    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);
      toast.success('Location obtained successfully');
    } catch (error) {
      toast.error(t('error.location_failed'));
      console.error('Failed to get location:', error);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleLandmarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLandmark(e.target.value);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleGetCurrentLocation}
          disabled={disabled || isGettingLocation}
          className={`
            flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${disabled || isGettingLocation 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-blue-700 cursor-pointer'
            }
          `}
          aria-label={t('location.current')}
        >
          {isGettingLocation ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <MapPinIcon className="w-5 h-5" />
          )}
          <span>{t('location.current')}</span>
        </button>

        {location.lat && location.lng && (
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <GlobeAltIcon className="w-4 h-4" />
            <span>Location obtained</span>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-2">
          {t('location.landmark')}
        </label>
        <input
          type="text"
          id="landmark"
          value={landmark}
          onChange={handleLandmarkChange}
          disabled={disabled}
          placeholder={t('location.landmark.placeholder')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {(location.lat || landmark) && (
        <div className="p-3 bg-gray-50 rounded-md">
          <p className="text-sm font-medium text-gray-700 mb-1">Current Location:</p>
          <p className="text-sm text-gray-600">
            {formatLocation({ ...location, landmark })}
          </p>
        </div>
      )}
    </div>
  );
};
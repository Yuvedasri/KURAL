import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { getLanguage, setLanguage, getAvailableLanguages, t } from '../utils/i18n';

interface LanguageSwitchProps {
  onLanguageChange?: (lang: 'ta-IN' | 'en-IN') => void;
}

export const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ onLanguageChange }) => {
  const [currentLang, setCurrentLang] = React.useState(getLanguage());
  const [isOpen, setIsOpen] = React.useState(false);
  const languages = getAvailableLanguages();

  const handleLanguageChange = (langCode: 'ta-IN' | 'en-IN') => {
    setLanguage(langCode);
    setCurrentLang(langCode);
    setIsOpen(false);
    onLanguageChange?.(langCode);
    window.location.reload(); // Simple reload to apply language changes
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        aria-label={t('language.switch')}
      >
        <span className="text-lg">🌐</span>
        <span>{currentLanguage?.nativeName}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  currentLang === language.code
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {language.code === 'ta-IN' ? '🇮🇳' : '🇬🇧'}
                  </span>
                  <div>
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-xs text-gray-500">{language.name}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
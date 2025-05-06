'use client';

import React from 'react';
import { useTranslation } from '@/src/i18n';

export default function LanguageSwitcher() {
  const { currentLanguage, setLanguage, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'ko' : 'en';
    setLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
      aria-label={t('switchLanguage')}
    >
      {currentLanguage === 'en' ? '한국어' : 'English'}
    </button>
  );
} 
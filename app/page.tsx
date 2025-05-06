'use client';

import React, { useState } from 'react';
import Dropzone from './components/Dropzone';
import Progress from './components/Progress';
import ManifestSettingsForm from './components/ManifestSettingsForm';
import { type ManifestSettings } from './components/ManifestSettings';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslation } from '@/src/i18n';

export default function Home() {
  const { t } = useTranslation();
  const [generating, setGenerating] = useState(false);
  const [settings, setSettings] = useState<ManifestSettings>({
    name: 'Web App',
    background_color: '#ffffff',
    theme_color: '#000000'
  });

  return (
    <main className="min-h-screen p-8">
      <LanguageSwitcher />
      
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('appTitle')}
          </h1>
          <p className="mt-2 text-gray-600">
            {t('appDescription')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <Dropzone
            onGeneratingChange={setGenerating}
            settings={settings}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('manifestSettings')}
          </h2>
          <ManifestSettingsForm
            onSettingsChange={setSettings}
            initialSettings={settings}
          />
        </div>
      </div>

      <Progress generating={generating} />
    </main>
  );
} 
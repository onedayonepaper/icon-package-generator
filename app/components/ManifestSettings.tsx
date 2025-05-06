'use client';

import React from 'react';

export interface ManifestSettings {
  name: string;
  background_color: string;
  theme_color: string;
}

interface Props {
  onSettingsChange: (settings: ManifestSettings) => void;
  initialSettings?: ManifestSettings;
}

export function ManifestSettingsComponent({ onSettingsChange, initialSettings }: Props) {
  const [settings, setSettings] = React.useState<ManifestSettings>(
    initialSettings || {
      name: 'Web App',
      background_color: '#ffffff',
      theme_color: '#000000'
    }
  );

  const handleChange = (field: keyof ManifestSettings) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSettings = {
      ...settings,
      [field]: e.target.value
    };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          App Name
        </label>
        <input
          type="text"
          id="name"
          value={settings.name}
          onChange={handleChange('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="theme_color" className="block text-sm font-medium text-gray-700">
          Theme Color
        </label>
        <input
          type="color"
          id="theme_color"
          value={settings.theme_color}
          onChange={handleChange('theme_color')}
          className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="background_color" className="block text-sm font-medium text-gray-700">
          Background Color
        </label>
        <input
          type="color"
          id="background_color"
          value={settings.background_color}
          onChange={handleChange('background_color')}
          className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
} 
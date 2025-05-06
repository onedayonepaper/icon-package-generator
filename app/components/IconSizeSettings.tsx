'use client';

import React, { useState } from 'react';
import { IconSize, defaultSizes, validateCustomSize, minSize, maxSize } from '@/src/sizes';
import { t } from '@/src/i18n';

interface Props {
  onSizesChange: (sizes: IconSize[]) => void;
  initialSizes?: IconSize[];
}

export default function IconSizeSettings({ onSizesChange, initialSizes = defaultSizes }: Props) {
  const [sizes, setSizes] = useState<IconSize[]>(initialSizes);
  const [customSize, setCustomSize] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSizeToggle = (size: IconSize) => {
    const newSizes = sizes.filter(s => s.size !== size.size);
    if (newSizes.length === 0) {
      setError(t('atLeastOneSize'));
      return;
    }
    setSizes(newSizes);
    onSizesChange(newSizes);
  };

  const handleAddCustomSize = () => {
    const size = parseInt(customSize);
    if (!validateCustomSize(size)) {
      setError(t('invalidCustomSize'));
      return;
    }
    if (sizes.some(s => s.size === size)) {
      setError(t('sizeAlreadyExists'));
      return;
    }

    const newSizes = [...sizes, { size, isCustom: true }].sort((a, b) => a.size - b.size);
    setSizes(newSizes);
    onSizesChange(newSizes);
    setCustomSize('');
    setError(null);
  };

  return (
    <div className="space-y-4" role="region" aria-label={t('iconSizeSettings')}>
      <h3 className="text-lg font-medium text-gray-900">{t('iconSizes')}</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {sizes.map((size) => (
          <button
            key={size.size}
            onClick={() => handleSizeToggle(size)}
            className={`
              px-3 py-2 rounded-md text-sm
              ${size.isCustom 
                ? 'bg-blue-100 hover:bg-blue-200 text-blue-800' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}
              transition-colors duration-200
            `}
            aria-label={t('removeSize', { size: size.size })}
          >
            {size.size}x{size.size}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={customSize}
            onChange={(e) => {
              setCustomSize(e.target.value);
              setError(null);
            }}
            min={minSize}
            max={maxSize}
            placeholder={t('enterCustomSize')}
            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            aria-label={t('customSizeInput')}
          />
          <button
            onClick={handleAddCustomSize}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            aria-label={t('addCustomSize')}
          >
            {t('add')}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          {t('sizeRange', { min: minSize, max: maxSize })}
        </p>
      </div>
    </div>
  );
} 
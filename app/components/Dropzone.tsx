'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { generateIconPackage } from '@/src/generate';
import { validateImageFile } from '@/src/validation';
import { Toast, ToastType } from './Toast';
import { type ManifestSettings } from './ManifestSettings';
import IconSizeSettings from './IconSizeSettings';
import { IconSize, defaultSizes } from '@/src/sizes';
import { t } from '@/src/i18n';

interface Props {
  onGeneratingChange: (generating: boolean) => void;
  settings: ManifestSettings;
}

interface ToastState {
  message: string;
  type: ToastType;
}

export default function Dropzone({ onGeneratingChange, settings }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewSize, setPreviewSize] = useState<number>(1024);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<IconSize[]>(defaultSizes);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setError(null);
      setIsGenerating(true);
      onGeneratingChange(true);

      // Validate file
      await validateImageFile(file);

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Generate icons
      const blob = await generateIconPackage(file, settings, selectedSizes);

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'icons.zip';
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);

      showToast(t('success'), 'success');
    } catch (error) {
      setError(error instanceof Error ? error.message : t('error'));
      showToast(t('error'), 'error');
    } finally {
      setIsGenerating(false);
      onGeneratingChange(false);
    }
  }, [onGeneratingChange, settings, selectedSizes]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png']
    },
    maxFiles: 1,
    disabled: isGenerating
  });

  // Cleanup preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handlePreviewSizeChange = (delta: number) => {
    setPreviewSize(prev => {
      const newSize = prev + delta;
      return Math.max(16, Math.min(1024, newSize));
    });
  };

  return (
    <div className="space-y-8" role="region" aria-label={t('dropzone')}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        role="button"
        tabIndex={0}
        aria-disabled={isGenerating}
        aria-label={isDragActive ? t('dropzoneActive') : t('dropzone')}
      >
        <input {...getInputProps()} aria-label={t('fileInput')} />
        <p className="text-lg text-gray-600">
          {isDragActive ? t('dropzoneActive') : t('dropzone')}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          {t('fileRequirements')}
        </p>
        <ul className="mt-2 text-sm text-gray-500 list-disc list-inside" role="list">
          <li>{t('pngOnly')}</li>
          <li>{t('dimensions')}</li>
          <li>{t('maxSize')}</li>
        </ul>
      </div>

      {preview && (
        <div className="mt-8" role="region" aria-label={t('preview')}>
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('preview')}</h3>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt={t('previewImage')}
                className="max-w-full h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '300px' }}
              />
              <div 
                className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm"
                aria-label={t('currentSize', { size: previewSize })}
              >
                {previewSize}x{previewSize}
              </div>
            </div>
            <div className="flex items-center space-x-4" role="group" aria-label={t('previewSizeControls')}>
              <button
                onClick={() => handlePreviewSizeChange(-32)}
                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                aria-label={t('decreaseSize')}
                disabled={previewSize <= 16}
              >
                -
              </button>
              <span className="text-sm text-gray-600">{t('previewSize')}</span>
              <button
                onClick={() => handlePreviewSizeChange(32)}
                className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                aria-label={t('increaseSize')}
                disabled={previewSize >= 1024}
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <IconSizeSettings
          onSizesChange={setSelectedSizes}
          initialSizes={selectedSizes}
        />
      </div>

      {error && (
        <div role="alert" aria-live="assertive">
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
} 
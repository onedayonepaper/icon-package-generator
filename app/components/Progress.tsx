'use client';

import React from 'react';

interface Props {
  generating: boolean;
}

export default function Progress({ generating }: Props) {
  if (!generating) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 space-y-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
        <p className="text-center text-gray-700">
          Generating icons...
        </p>
        <p className="text-center text-sm text-gray-500">
          This may take a few moments
        </p>
      </div>
    </div>
  );
}

const sizes = [
  16, 32, 48, 57, 60, 72, 96, 114, 120, 144, 152, 167, 180, 192, 256, 384, 512, 1024
]; 
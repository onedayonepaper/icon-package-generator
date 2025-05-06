export interface IconSize {
  size: number;
  isCustom?: boolean;
}

export const defaultSizes: IconSize[] = [
  { size: 16 },
  { size: 32 },
  { size: 48 },
  { size: 64 },
  { size: 72 },
  { size: 96 },
  { size: 120 },
  { size: 128 },
  { size: 144 },
  { size: 152 },
  { size: 180 },
  { size: 192 },
  { size: 384 },
  { size: 512 },
  { size: 1024 }
];

export const minSize = 16;
export const maxSize = 1024;

export function validateCustomSize(size: number): boolean {
  return size >= minSize && size <= maxSize && Number.isInteger(size);
} 
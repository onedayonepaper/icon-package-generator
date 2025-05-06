import JSZip from 'jszip';
import { validateImageFile } from './validation';
import { IconSize, defaultSizes } from './sizes';
import { ManifestSettings } from '@/app/components/ManifestSettings';

export interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
}

async function resizeImage(file: File, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, size, size);
      
      // Draw image maintaining aspect ratio
      const scale = Math.min(size / img.width, size / img.height);
      const x = (size - img.width * scale) / 2;
      const y = (size - img.height * scale) / 2;
      
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      
      // Convert to PNG blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/png');
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

export async function generateIconPackage(
  file: File,
  settings?: ManifestSettings,
  sizes: IconSize[] = defaultSizes
): Promise<Blob> {
  // Validate file first
  await validateImageFile(file);

  // Create a new ZIP file
  const zip = new JSZip();
  const iconsFolder = zip.folder('icons');

  if (!iconsFolder) {
    throw new Error('Failed to create icons folder in ZIP');
  }

  // Create manifest
  const manifest = {
    name: settings?.name || 'Icon Package',
    background_color: settings?.background_color || '#ffffff',
    theme_color: settings?.theme_color || '#000000',
    icons: [] as ManifestIcon[]
  };

  // Process each size
  for (const { size } of sizes) {
    const fileName = `icon-${size}x${size}.png`;
    
    try {
      // Resize image
      const resizedBlob = await resizeImage(file, size);
      const arrayBuffer = await resizedBlob.arrayBuffer();
      
      // Add resized image to ZIP
      iconsFolder.file(fileName, arrayBuffer);

      // Add to manifest
      manifest.icons.push({
        src: `/icons/${fileName}`,
        sizes: `${size}x${size}`,
        type: 'image/png'
      });
    } catch (error) {
      console.error(`Failed to process size ${size}:`, error);
      throw new Error('Failed to resize image');
    }
  }

  // Add manifest to ZIP
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // Generate ZIP file
  return zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9
    }
  });
} 
import sharp from 'sharp';

interface ProcessingOptions {
  quality?: number;
  compressionLevel?: number;
}

export async function optimizeImage(
  buffer: Buffer,
  size: number,
  options: ProcessingOptions = {}
): Promise<Buffer> {
  const {
    quality = 90,
    compressionLevel = 9,
  } = options;

  return sharp(buffer)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({
      quality,
      compressionLevel,
      palette: true,
      effort: 10
    })
    .toBuffer();
}

export async function processImagesInParallel(
  buffer: Buffer,
  sizes: number[],
  options: ProcessingOptions = {}
): Promise<Map<number, Buffer>> {
  const results = new Map<number, Buffer>();
  
  // Process images in parallel with a concurrency limit
  const concurrencyLimit = 4;
  const chunks = [];
  
  for (let i = 0; i < sizes.length; i += concurrencyLimit) {
    const chunk = sizes.slice(i, i + concurrencyLimit);
    chunks.push(chunk);
  }

  for (const chunk of chunks) {
    const promises = chunk.map(async (size) => {
      const processed = await optimizeImage(buffer, size, options);
      results.set(size, processed);
    });

    await Promise.all(promises);
  }

  return results;
}

export function estimateZipSize(images: Map<number, Buffer>): number {
  let totalSize = 0;
  for (const buffer of images.values()) {
    totalSize += buffer.length;
  }
  // Add manifest.json size (rough estimate)
  totalSize += 1024;
  return totalSize;
} 
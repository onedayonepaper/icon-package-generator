export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const REQUIRED_DIMENSIONS = 1024;

export interface ValidationError {
  code: 'SIZE' | 'FORMAT' | 'DIMENSIONS';
  message: string;
}

export async function validateImageFile(file: File): Promise<void> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }

  // Check file type
  if (file.type !== 'image/png') {
    throw new Error('Only PNG files are allowed');
  }

  // Check image dimensions
  try {
    const dimensions = await getImageDimensions(file);
    if (dimensions.width !== REQUIRED_DIMENSIONS || dimensions.height !== REQUIRED_DIMENSIONS) {
      throw new Error('Image must be 1024x1024 pixels');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to validate image dimensions');
  }
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    // Create a new image element
    const img = document.createElement('img');
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
      // Clean up the object URL
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      // Clean up the object URL
      URL.revokeObjectURL(img.src);
    };

    // Create object URL and set it as the image source
    img.src = URL.createObjectURL(file);
  });
} 
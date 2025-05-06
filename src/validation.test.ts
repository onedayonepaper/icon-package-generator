import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateImageFile } from './validation';

describe('validateImageFile', () => {
  beforeEach(() => {
    // Mock URL.createObjectURL
    global.URL = {
      createObjectURL: vi.fn(() => 'mock-url'),
      revokeObjectURL: vi.fn(),
    } as any;

    // Mock Image
    global.Image = class {
      width = 0;
      height = 0;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      src = '';

      constructor() {
        setTimeout(() => {
          if (this.src === 'mock-url') {
            this.width = 1024;
            this.height = 1024;
            this.onload?.();
          } else {
            this.onerror?.();
          }
        }, 0);
      }
    } as any;
  });

  it('should accept valid PNG file', async () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
    
    await expect(validateImageFile(file)).resolves.not.toThrow();
  });

  it('should throw error for files larger than 5MB', async () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });
    
    await expect(validateImageFile(file)).rejects.toThrow('File size exceeds 5MB limit');
  });

  it('should throw error for non-PNG files', async () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    
    await expect(validateImageFile(file)).rejects.toThrow('Only PNG files are allowed');
  });

  it('should throw error for incorrect dimensions', async () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

    // Mock incorrect dimensions
    global.Image = class {
      width = 512;
      height = 512;
      onload: (() => void) | null = null;
      src = '';

      constructor() {
        setTimeout(() => this.onload?.(), 0);
      }
    } as any;
    
    await expect(validateImageFile(file)).rejects.toThrow('Image must be 1024x1024 pixels');
  });
}); 
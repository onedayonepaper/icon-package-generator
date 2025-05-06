import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateIconPackage } from '../src/generate';

describe('generateIconPackage', () => {
  beforeEach(() => {
    // Mock URL.createObjectURL
    global.URL = {
      createObjectURL: vi.fn(() => 'mock-url'),
      revokeObjectURL: vi.fn(),
    } as any;

    // Mock Image
    global.Image = class {
      width = 1024;
      height = 1024;
      onload: (() => void) | null = null;
      src = '';

      constructor() {
        setTimeout(() => this.onload?.(), 0);
      }
    } as any;
  });

  it('should generate a ZIP file containing icons and manifest', async () => {
    const mockArrayBuffer = new ArrayBuffer(8);
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
    Object.defineProperty(file, 'arrayBuffer', {
      value: async () => mockArrayBuffer
    });
    
    const result = await generateIconPackage(file);
    
    expect(result instanceof Blob).toBe(true);
    expect(result.type).toBe('application/zip');
  });

  it('should throw error when file is invalid', async () => {
    const invalidFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    
    await expect(generateIconPackage(invalidFile)).rejects.toThrow();
  });
}); 
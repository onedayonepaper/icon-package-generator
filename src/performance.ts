interface PerformanceMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
  };
  fileSize: number;
  outputSize: number;
  compressionRatio?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];

  start(): number {
    return performance.now();
  }

  end(startTime: number, fileSize: number, outputSize: number): PerformanceMetrics {
    const endTime = performance.now();
    const duration = endTime - startTime;
    const compressionRatio = (outputSize / fileSize) * 100;
    
    const metrics: PerformanceMetrics = {
      startTime,
      endTime,
      duration,
      memoryUsage: process.memoryUsage(),
      fileSize,
      outputSize,
      compressionRatio,
    };

    this.metrics.push(metrics);
    this.logMetrics(metrics);
    
    return metrics;
  }

  private logMetrics(metrics: PerformanceMetrics) {
    console.log('Performance Metrics:', {
      duration: `${metrics.duration.toFixed(2)}ms`,
      memoryUsage: {
        heapUsed: `${(metrics.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
        heapTotal: `${(metrics.memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`,
      },
      compressionRatio: `${metrics.compressionRatio?.toFixed(2)}%`,
    });
  }

  getAverageMetrics(): Partial<PerformanceMetrics> {
    if (this.metrics.length === 0) return {};

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const totalHeapUsed = this.metrics.reduce((sum, m) => sum + m.memoryUsage.heapUsed, 0);
    const totalHeapTotal = this.metrics.reduce((sum, m) => sum + m.memoryUsage.heapTotal, 0);
    const totalCompressionRatio = this.metrics.reduce(
      (sum, m) => sum + (m.compressionRatio || 0),
      0
    );

    return {
      duration: totalDuration / this.metrics.length,
      memoryUsage: {
        heapUsed: totalHeapUsed / this.metrics.length,
        heapTotal: totalHeapTotal / this.metrics.length,
      },
      compressionRatio: totalCompressionRatio / this.metrics.length,
    };
  }
}

export const performanceMonitor = new PerformanceMonitor(); 
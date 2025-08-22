// Performance Monitoring System for CryptoBoost
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            apiCalls: new Map(),
            responseTime: new Map(),
            errors: new Map(),
            userActions: new Map(),
            resourceUsage: new Map()
        };

        this.thresholds = {
            responseTime: 500, // ms
            errorRate: 0.05,   // 5%
            cpuUsage: 0.8,     // 80%
            memoryUsage: 0.9   // 90%
        };

        this.init();
    }

    init() {
        this.setupPerformanceObserver();
        this.setupErrorTracking();
        this.setupResourceMonitoring();
        this.startPeriodicCheck();
    }

    setupPerformanceObserver() {
        this.observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.trackMetric('responseTime', entry.name, entry.duration);
            }
        });

        this.observer.observe({ entryTypes: ['resource', 'navigation', 'measure'] });
    }

    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            this.trackError('runtime', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.trackError('promise', event.reason);
        });
    }

    setupResourceMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.trackMetric('resourceUsage', 'memory', {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize
                });
            }, 10000);
        }
    }

    trackMetric(category, name, value) {
        if (!this.metrics[category]) {
            this.metrics[category] = new Map();
        }

        const metric = this.metrics[category].get(name) || {
            count: 0,
            total: 0,
            min: Infinity,
            max: -Infinity,
            last: null
        };

        metric.count++;
        metric.total += value;
        metric.min = Math.min(metric.min, value);
        metric.max = Math.max(metric.max, value);
        metric.last = value;
        metric.average = metric.total / metric.count;

        this.metrics[category].set(name, metric);
        this.checkThresholds(category, name, metric);
    }

    trackError(type, error) {
        const errorKey = `${type}:${error.message}`;
        const count = (this.metrics.errors.get(errorKey) || 0) + 1;
        this.metrics.errors.set(errorKey, count);

        if (count === 1) {
            console.error(`[PerformanceMonitor] New Error: ${error.message}`);
        }

        this.checkErrorThresholds();
    }

    trackApiCall(endpoint, duration, success) {
        const apiMetric = this.metrics.apiCalls.get(endpoint) || {
            total: 0,
            success: 0,
            failed: 0,
            avgDuration: 0
        };

        apiMetric.total++;
        success ? apiMetric.success++ : apiMetric.failed++;
        apiMetric.avgDuration = (apiMetric.avgDuration * (apiMetric.total - 1) + duration) / apiMetric.total;

        this.metrics.apiCalls.set(endpoint, apiMetric);
        this.checkApiThresholds(endpoint, apiMetric);
    }

    checkThresholds(category, name, metric) {
        switch (category) {
            case 'responseTime':
                if (metric.average > this.thresholds.responseTime) {
                    this.notifySlowResponse(name, metric.average);
                }
                break;
            case 'resourceUsage':
                if (metric.last.used / metric.last.total > this.thresholds.memoryUsage) {
                    this.notifyHighMemoryUsage(metric.last);
                }
                break;
        }
    }

    checkApiThresholds(endpoint, metric) {
        const errorRate = metric.failed / metric.total;
        if (errorRate > this.thresholds.errorRate) {
            this.notifyHighErrorRate(endpoint, errorRate);
        }
    }

    notifySlowResponse(name, duration) {
        window.ui?.showNotification(
            `Performance Alert: Slow response for ${name} (${Math.round(duration)}ms)`,
            'warning'
        );
    }

    notifyHighMemoryUsage(memory) {
        const usedMB = Math.round(memory.used / 1024 / 1024);
        const totalMB = Math.round(memory.total / 1024 / 1024);
        window.ui?.showNotification(
            `Resource Alert: High memory usage (${usedMB}MB / ${totalMB}MB)`,
            'warning'
        );
    }

    notifyHighErrorRate(endpoint, rate) {
        window.ui?.showNotification(
            `API Alert: High error rate for ${endpoint} (${Math.round(rate * 100)}%)`,
            'error'
        );
    }

    getMetricsSummary() {
        return {
            responseTime: Object.fromEntries(this.metrics.responseTime),
            errors: Object.fromEntries(this.metrics.errors),
            apiCalls: Object.fromEntries(this.metrics.apiCalls),
            resourceUsage: Object.fromEntries(this.metrics.resourceUsage)
        };
    }

    startPeriodicCheck() {
        setInterval(() => {
            const summary = this.getMetricsSummary();
            console.log('[PerformanceMonitor] Periodic Summary:', summary);
        }, 60000); // Every minute
    }
}

// Create global instance
window.performanceMonitor = new PerformanceMonitor();

// Export for module usage
export default PerformanceMonitor;

// logger 유틸리티 직접 정의
const logger = {
    info: (...args: any[]) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('[INFO]', ...args);
        }
    },
    warn: (...args: any[]) => {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[WARN]', ...args);
        }
    },
    error: (...args: any[]) => {
        if (process.env.NODE_ENV !== 'production') {
            console.error('[ERROR]', ...args);
        }
    }
};

// ... existing code ...
// 모든 console.log를 logger.info로, console.warn을 logger.warn으로, console.error를 logger.error로 변경 
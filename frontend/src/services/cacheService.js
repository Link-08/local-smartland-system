const CACHE_PREFIX = 'smartland_';
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

class CacheService {
    static set(key, data) {
        const item = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
    }

    static get(key) {
        const item = localStorage.getItem(CACHE_PREFIX + key);
        if (!item) return null;

        const { data, timestamp } = JSON.parse(item);
        if (Date.now() - timestamp > CACHE_EXPIRY) {
            localStorage.removeItem(CACHE_PREFIX + key);
            return null;
        }

        return data;
    }

    static remove(key) {
        localStorage.removeItem(CACHE_PREFIX + key);
    }

    static clear() {
        Object.keys(localStorage)
            .filter(key => key.startsWith(CACHE_PREFIX))
            .forEach(key => localStorage.removeItem(key));
    }
}

export default CacheService; 
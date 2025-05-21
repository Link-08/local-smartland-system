import { useState, useEffect, useCallback } from 'react';
import CacheService from '../services/cacheService';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const useApi = (endpoint, options = {}) => {
    const {
        method = 'GET',
        body = null,
        cacheKey = null,
        retry = true,
        dependencies = []
    } = options;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (retryCount = 0) => {
        try {
            setLoading(true);
            setError(null);

            // Check cache first if cacheKey is provided
            if (cacheKey && method === 'GET') {
                const cachedData = CacheService.get(cacheKey);
                if (cachedData) {
                    setData(cachedData);
                    setLoading(false);
                    return;
                }
            }

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : null,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setData(result);

            // Cache the result if cacheKey is provided
            if (cacheKey && method === 'GET') {
                CacheService.set(cacheKey, result);
            }

            setLoading(false);
        } catch (err) {
            console.error('API Error:', err);
            
            if (retry && retryCount < MAX_RETRIES) {
                // Exponential backoff
                const delay = RETRY_DELAY * Math.pow(2, retryCount);
                setTimeout(() => {
                    fetchData(retryCount + 1);
                }, delay);
            } else {
                setError(err);
                setLoading(false);
            }
        }
    }, [endpoint, method, body, cacheKey, retry]);

    useEffect(() => {
        fetchData();
    }, [fetchData, ...dependencies]);

    const refetch = useCallback(() => {
        if (cacheKey) {
            CacheService.remove(cacheKey);
        }
        fetchData();
    }, [fetchData, cacheKey]);

    return { data, loading, error, refetch };
}; 
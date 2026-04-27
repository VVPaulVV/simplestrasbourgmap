import { useState, useEffect } from 'react';

const API = 'https://data.strasbourg.eu/api/explore/v2.1/catalog/datasets/stations-velhop/records?limit=100';
const CACHE_KEY = 'velhop_cache';
const CACHE_TS_KEY = 'velhop_cache_ts';

export function useVelhop() {
  const [stations, setStations] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        const mapped = (data.results || [])
          .filter(r => r.lat && r.lon)
          .map(r => ({
            id: r.id,
            name: r.na,
            lat: r.lat,
            lng: r.lon,
            available: r.av ?? 0,
            free: r.fr ?? 0,
            total: r.to ?? 0,
          }));
        setStations(mapped);
        const now = new Date();
        setLastUpdated(now);
        setIsOffline(false);
        localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
        localStorage.setItem(CACHE_TS_KEY, now.toISOString());
      } catch (e) {
        const cached = localStorage.getItem(CACHE_KEY);
        const cachedTs = localStorage.getItem(CACHE_TS_KEY);
        if (cached) {
          setStations(JSON.parse(cached));
          setLastUpdated(cachedTs ? new Date(cachedTs) : null);
        }
        setIsOffline(true);
      }
    }

    fetch_();
    const interval = setInterval(fetch_, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { stations, lastUpdated, isOffline };
}

import { useState, useEffect } from 'react';

const PARKING_API = 'https://data.strasbourg.eu/api/explore/v2.1/catalog/datasets/occupation-parkings-temps-reel/records?limit=100';
const CACHE_KEY = 'parking_cache';
const CACHE_TS_KEY = 'parking_cache_ts';

export function useParking() {
  const [parkings, setParkings] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    async function fetchParking() {
      try {
        const res = await fetch(PARKING_API);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        const records = data.results || [];
        const mapped = records.map(r => ({
          id: r.idsurfs,
          name: r.nom_parking,
          total: r.total,
          free: r.libre,
          status: r.etat_descriptif,
          rate: r.taux_occup,
          lat: r.position?.lat,
          lng: r.position?.lon,
          color: r.realtimestatus, // GREEN, ORANGE, RED, BLACK, BLUE
        })).filter(p => p.lat && p.lng);

        setParkings(mapped);
        const now = new Date();
        setLastUpdated(now);
        setIsOffline(false);
        localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
        localStorage.setItem(CACHE_TS_KEY, now.toISOString());
      } catch (e) {
        // Try cache
        const cached = localStorage.getItem(CACHE_KEY);
        const cachedTs = localStorage.getItem(CACHE_TS_KEY);
        if (cached) {
          setParkings(JSON.parse(cached));
          setLastUpdated(cachedTs ? new Date(cachedTs) : null);
        }
        setIsOffline(true);
      }
    }

    fetchParking();
    // Refresh every 3 minutes (matches API refresh rate)
    const interval = setInterval(fetchParking, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { parkings, lastUpdated, isOffline };
}

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import pois from '../data/pois.json';

export default function SearchBar({ lang, onSelect }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return pois.filter(p => {
      const name = (lang === 'fr' ? p.name_fr : p.name_en) || '';
      return name.toLowerCase().includes(q) || (p.address || '').toLowerCase().includes(q);
    }).slice(0, 6);
  }, [query, lang]);

  function handleSelect(poi) {
    setQuery(lang === 'fr' ? poi.name_fr : poi.name_en);
    setFocused(false);
    onSelect(poi);
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        placeholder={t('search.placeholder')}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
      />
      {focused && results.length > 0 && (
        <ul className="search-results">
          {results.map(poi => (
            <li key={poi.id} onMouseDown={() => handleSelect(poi)}>
              <span className="search-result-name">
                {lang === 'fr' ? poi.name_fr : poi.name_en}
              </span>
              <span className="search-result-address">{poi.address}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

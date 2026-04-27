import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n/index.js';
import MapView from './components/MapView';
import LayerControl from './components/LayerControl';
import SearchBar from './components/SearchBar';
import InfoPanel from './components/InfoPanel';
import MapLegend from './components/MapLegend';
import OfflineBanner from './components/OfflineBanner';
import {
  IconMenu2,
  IconPencil,
  IconInfoCircle,
  IconWorld,
} from '@tabler/icons-react';
import './App.css';

const DEFAULT_LAYERS = {
  museum: true,
  sight: true,
  restaurant: true,
  cafe: true,
  toilets: false,
  parking: false,
  velhop: false,
};

export default function App() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language === 'fr' ? 'fr' : 'en');
  const [layers, setLayers] = useState(DEFAULT_LAYERS);
  const [drawingActive, setDrawingActive] = useState(false);
  const [flyTarget, setFlyTarget] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 641);
  const [infoOpen, setInfoOpen] = useState(false);

  function toggleLang() {
    const next = lang === 'en' ? 'fr' : 'en';
    setLang(next);
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  }

  function toggleLayer(key) {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSearchSelect(poi) {
    setFlyTarget(poi);
    setSidebarOpen(false);
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="menu-btn" onClick={() => setSidebarOpen(o => !o)} title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}>
          <IconMenu2 size={18} stroke={1.5} color="var(--text-muted)" />
        </button>

        <div className="topbar-title">
          <div className="topbar-logo" />
          Strasbourg
        </div>

        <SearchBar lang={lang} onSelect={handleSearchSelect} />

        <div className="topbar-actions">
          <button
            className={`draw-btn ${drawingActive ? 'active' : ''}`}
            onClick={() => setDrawingActive(d => !d)}
            title={drawingActive ? 'Stop drawing' : 'Draw on map'}
          >
            <IconPencil size={15} stroke={1.5} />
          </button>
          <button className="info-btn" onClick={() => setInfoOpen(o => !o)}>
            <IconInfoCircle size={15} stroke={1.5} />
            Info
          </button>
          <button className="lang-btn" onClick={toggleLang}>
            <IconWorld size={15} stroke={1.5} />
            {lang === 'en' ? 'FR' : 'EN'}
          </button>
        </div>
      </header>

      <div className="main">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <LayerControl layers={layers} onToggle={toggleLayer} />
        </aside>

        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="map-wrapper">
          <MapView
            layers={layers}
            drawingActive={drawingActive}
            lang={lang}
            flyTarget={flyTarget}
          />

          <MapLegend />
          <OfflineBanner />

          {drawingActive && (
            <div className="drawing-mode-banner">
              ✏️ Drawing mode — tap/click to draw on the map
            </div>
          )}
        </main>
      </div>
      <InfoPanel open={infoOpen} onClose={() => setInfoOpen(false)} lang={lang} />
    </div>
  );
}

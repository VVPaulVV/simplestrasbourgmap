import { useState, useEffect } from 'react';
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
  IconDownload,
} from '@tabler/icons-react';
import './App.css';

function TopbarButton({ className, onClick, children, title }) {
  const [pressing, setPressing] = useState(false);

  return (
    <button
      className={className}
      title={title}
      style={{
        transform: pressing ? 'scale(0.93)' : 'scale(1)',
        transition: pressing
          ? 'transform 0.08s ease'
          : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => { setPressing(false); onClick?.(); }}
      onMouseLeave={() => setPressing(false)}
      onTouchStart={() => setPressing(true)}
      onTouchEnd={() => { setPressing(false); onClick?.(); }}
    >
      {children}
    </button>
  );
}

function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    function handleBeforeInstall(e) {
      e.preventDefault();
      setInstallPrompt(e);
    }

    function handleAppInstalled() {
      setIsInstalled(true);
      setInstallPrompt(null);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  async function triggerInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setInstallPrompt(null);
      setIsInstalled(true);
    }
  }

  return { installPrompt, isInstalled, triggerInstall };
}

function useDelayedUnmount(active, delay = 350) {
  const [visible, setVisible] = useState(active);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      setAnimating(false);
    } else {
      setAnimating(true);
      const t = setTimeout(() => {
        setVisible(false);
        setAnimating(false);
      }, delay);
      return () => clearTimeout(t);
    }
  }, [active, delay]);

  return { visible, animating };
}

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
  const { installPrompt, isInstalled, triggerInstall } = useInstallPrompt();
  const [drawingActive, setDrawingActive] = useState(false);
  const { visible: drawingVisible, animating: drawingClosing } = useDelayedUnmount(drawingActive);
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
        <TopbarButton className="menu-btn" onClick={() => setSidebarOpen(o => !o)} title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}>
          <IconMenu2 size={18} stroke={1.5} color="var(--text-muted)" />
        </TopbarButton>

        <div className="topbar-title">
          <div className="topbar-logo" />
          Strasbourg
        </div>

        <SearchBar lang={lang} onSelect={handleSearchSelect} />

        <div className="topbar-actions">
          {installPrompt && !isInstalled && (
            <TopbarButton
              className="install-btn"
              onClick={triggerInstall}
            >
              <IconDownload size={15} stroke={1.5} />
              {lang === 'fr' ? 'Installer' : 'Install'}
            </TopbarButton>
          )}
          <TopbarButton
            className={`draw-btn ${drawingActive ? 'active' : ''}`}
            onClick={() => setDrawingActive(d => !d)}
            title={drawingActive ? 'Stop drawing' : 'Draw on map'}
          >
            <IconPencil size={15} stroke={1.5} />
          </TopbarButton>
          <TopbarButton className="info-btn" onClick={() => setInfoOpen(o => !o)}>
            <IconInfoCircle size={15} stroke={1.5} />
            Info
          </TopbarButton>
          <TopbarButton className="lang-btn" onClick={toggleLang}>
            <IconWorld size={15} stroke={1.5} />
            {lang === 'en' ? 'FR' : 'EN'}
          </TopbarButton>
        </div>
      </header>

      <div className="main">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <LayerControl layers={layers} onToggle={toggleLayer} />
        </aside>

        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="map-wrapper">
          <MapView
            layers={layers}
            drawingActive={drawingActive}
            drawingVisible={drawingVisible}
            drawingClosing={drawingClosing}
            lang={lang}
            flyTarget={flyTarget}
            sidebarOpen={sidebarOpen}
          />

          <MapLegend />
          <OfflineBanner />


        </main>
      </div>
      <InfoPanel open={infoOpen} onClose={() => setInfoOpen(false)} lang={lang} />

      {installPrompt && !isInstalled && (
        <div className="install-banner">
          <span>
            {lang === 'fr'
              ? 'Installez l\'application pour accéder aux dessins hors ligne'
              : 'Install the app to access drawings offline'}
          </span>
          <button className="install-banner-btn" onClick={triggerInstall}>
            {lang === 'fr' ? 'Installer' : 'Install'}
          </button>
        </div>
      )}
    </div>
  );
}

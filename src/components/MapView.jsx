import { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import {
  IconEraser,
  IconTrash,
  IconNavigation,
} from '@tabler/icons-react';

import pois from '../data/pois.json';
import toilets from '../data/toilets.json';
import POIPopup from './POIPopup';
import DrawingCanvas from './DrawingCanvas';
import { useParking } from '../hooks/useParking';
import { useVelhop } from '../hooks/useVelhop';

// Fix leaflet default icon issue with vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const CATEGORY_COLORS = {
  museum: '#7b2d8b',
  sight: '#1a6eb5',
  restaurant: '#c0392b',
  cafe: '#8B5E3C',
};

const CATEGORY_EMOJIS = {
  museum: '🏛️',
  sight: '👁️',
  restaurant: '🍽️',
  cafe: '☕',
};

const COLORS = ['#e63946', '#2a9d8f', '#e9c46a', '#264653', '#f4a261', '#6a0572', '#000000', '#ffffff'];
const BRUSH_SIZES = [3, 6, 14];

const CATEGORY_LETTERS = {
  museum: 'M',
  sight: 'S',
  restaurant: 'R',
  cafe: 'C',
};

function makePinIcon(category, color) {
  const letter = CATEGORY_LETTERS[category] || '?';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 24 16 24S32 27 32 16C32 7.163 24.837 0 16 0z" fill="${color}"/>
      <circle cx="16" cy="16" r="10" fill="white" opacity="0.92"/>
      <text x="16" y="21" text-anchor="middle" font-size="11" font-weight="600" fill="${color}" font-family="Open Sans, sans-serif">${letter}</text>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
}

function makeParkingIcon(color) {
  const bg = color === 'GREEN' ? '#27ae60' : color === 'ORANGE' ? '#e67e22' : color === 'RED' ? '#e74c3c' : '#95a5a6';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
      <rect width="30" height="30" rx="8" fill="${bg}"/>
      <text x="15" y="21" text-anchor="middle" font-size="14" font-weight="700" fill="white" font-family="Open Sans, sans-serif">P</text>
    </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -15] });
}

function makeToiletIcon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <rect width="28" height="28" rx="8" fill="#0369a1"/>
      <text x="14" y="20" text-anchor="middle" font-size="12" font-weight="700" fill="white" font-family="Open Sans, sans-serif">WC</text>
    </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14] });
}

function makeVelhopIcon(available) {
  const bg = available > 5 ? '#27ae60' : available > 0 ? '#e67e22' : '#e74c3c';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
      <rect width="30" height="30" rx="8" fill="${bg}"/>
      <text x="15" y="13" text-anchor="middle" font-size="9" font-weight="600" fill="white" font-family="Open Sans, sans-serif">VELO</text>
      <text x="15" y="23" text-anchor="middle" font-size="10" font-weight="700" fill="white" font-family="Open Sans, sans-serif">${available}</text>
    </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -15] });
}

// Prevents map interaction when drawing
function DrawingInteractionBlocker({ active }) {
  const map = useMap();
  useEffect(() => {
    if (active) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.touchZoom.disable();
      map.boxZoom.disable();
    } else {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.touchZoom.enable();
      map.boxZoom.enable();
    }
  }, [active, map]);
  return null;
}

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 17, { duration: 1 });
  }, [target, map]);
  return null;
}

export default function MapView({ layers, drawingActive, lang, flyTarget }) {
  const { t } = useTranslation();
  const { parkings, lastUpdated } = useParking();
  const { stations: velhopStations, lastUpdated: velhopUpdated } = useVelhop();
  
  const [color, setColor] = useState('#e63946');
  const [sizeIdx, setSizeIdx] = useState(0);
  const [erasing, setErasing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const strokesRef = useRef([]);
  const mapRef = useRef(null);

  function saveStrokes() {
    const data = strokesRef.current.map(p => ({
      latlngs: p.getLatLngs().map(ll => ({ lat: ll.lat, lng: ll.lng })),
      options: { color: p.options.color, weight: p.options.weight },
    }));
    localStorage.setItem('map_strokes', JSON.stringify(data));
  }

  function clearStrokes() {
    strokesRef.current.forEach(p => p.remove());
    strokesRef.current = [];
    localStorage.removeItem('map_strokes');
    setShowConfirm(false);
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer
        center={[48.5734, 7.7521]}
        zoom={14}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        ref={mapRef}
        whenReady={(mapInstance) => {
          const saved = localStorage.getItem('map_strokes');
          if (!saved) return;
          try {
            JSON.parse(saved).forEach(s => {
              const p = L.polyline(s.latlngs, { ...s.options, lineCap: 'round', lineJoin: 'round', interactive: false });
              p.addTo(mapInstance.target);
              strokesRef.current.push(p);
            });
          } catch(e) {
            console.error('Error loading strokes', e);
          }
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          crossOrigin="anonymous"
        />

        <DrawingInteractionBlocker active={drawingActive} />
        <FlyTo target={flyTarget} />

        {/* POI layers */}
        {['museum', 'sight', 'restaurant', 'cafe'].map(cat =>
          layers[cat] && pois
            .filter(p => p.category === cat)
            .map(poi => (
              <Marker
                key={poi.id}
                position={[poi.lat, poi.lng]}
                icon={makePinIcon(poi.category, CATEGORY_COLORS[poi.category])}
                zIndexOffset={0}
              >
                <Popup maxWidth={320} className="poi-popup-container" autoPan={true}>
                  <POIPopup poi={poi} lang={lang} />
                </Popup>
              </Marker>
            ))
        )}

        {/* Toilet layer */}
        {layers.toilets && toilets.map(toilet => (
          <Marker
            key={toilet.id}
            position={[toilet.lat, toilet.lng]}
            icon={makeToiletIcon(toilet.pmr)}
            zIndexOffset={0}
          >
            <Popup maxWidth={320} className="poi-popup-container" autoPan={true}>
              <div className="simple-popup">
                <strong>🚻 {toilet.name}</strong>
                {toilet.pmr && <div className="popup-tag accessible">{t('toilet.accessible')}</div>}
                {toilet.hours && <div className="popup-detail">{t('toilet.hours')}: {toilet.hours}</div>}
                <div className="popup-detail">{t(`toilet.type.${toilet.type}`)}</div>
                {toilet.seasonal && <div className="popup-tag seasonal">{t('toilet.seasonal')}</div>}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${toilet.lat},${toilet.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-action popup-directions-btn"
                >
                  <IconNavigation size={13} stroke={1.5} />
                  {t('poi.directions')}
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Parking layer */}
        {layers.parking && parkings.map(p => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={makeParkingIcon(p.color)}
            zIndexOffset={0}
          >
            <Popup maxWidth={320} className="poi-popup-container" autoPan={true}>
              <div className="simple-popup">
                <strong>🅿️ {p.name}</strong>
                <div className="popup-detail">
                  {p.status === 'Ouvert' || p.status === 'Open'
                    ? `${p.free} ${t('parking.free')} / ${p.total} ${t('parking.total')}`
                    : p.status === 'Fermé' ? t('parking.closed') : t('parking.unknown')
                  }
                </div>
                {lastUpdated && (
                  <div className="popup-timestamp">
                    {t('parking.lastUpdated')}: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-action popup-directions-btn"
                >
                  <IconNavigation size={13} stroke={1.5} />
                  {t('poi.directions')}
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Vélhop layer */}
        {layers.velhop && velhopStations.map(s => (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={makeVelhopIcon(s.available)}
            zIndexOffset={0}
          >
            <Popup maxWidth={320} className="poi-popup-container" autoPan={true}>
              <div className="simple-popup">
                <strong>🚲 {s.name}</strong>
                <div className="popup-detail">{s.available} {t('velhop.available')} · {s.free} {t('velhop.free')}</div>
                <div className="popup-detail">{t('velhop.total')}: {s.total}</div>
                {velhopUpdated && (
                  <div className="popup-timestamp">{t('parking.lastUpdated')}: {velhopUpdated.toLocaleTimeString()}</div>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-action popup-directions-btn"
                >
                  <IconNavigation size={13} stroke={1.5} />
                  {t('poi.directions')}
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        <DrawingCanvas
          active={drawingActive}
          color={color}
          brushSize={BRUSH_SIZES[sizeIdx]}
          erasing={erasing}
          onStrokeAdded={() => saveStrokes()}
          strokesRef={strokesRef}
        />
      </MapContainer>

      {drawingActive && (
        <div className="drawing-toolbar" style={{ zIndex: 1001 }}>
          <div className="drawing-colors">
            {COLORS.map(c => (
              <button
                key={c}
                className={`color-swatch ${color === c && !erasing ? 'active' : ''}`}
                style={{ background: c, border: c === '#ffffff' ? '2px solid #ccc' : undefined }}
                onClick={() => { setColor(c); setErasing(false); }}
              />
            ))}
          </div>
          <div className="drawing-sizes">
            {BRUSH_SIZES.map((s, i) => (
              <button
                key={s}
                className={`size-btn ${sizeIdx === i && !erasing ? 'active' : ''}`}
                onClick={() => { setSizeIdx(i); setErasing(false); }}
              >
                <span style={{ width: s * 2, height: s * 2, borderRadius: '50%', background: '#333', display: 'inline-block' }} />
              </button>
            ))}
          </div>
          <button className={`tool-btn ${erasing ? 'active' : ''}`} onClick={() => setErasing(e => !e)}>
            <IconEraser size={14} stroke={1.5} />
            Erase
          </button>
          <button className="tool-btn tool-btn-danger" onClick={() => setShowConfirm(true)}>
            <IconTrash size={14} stroke={1.5} />
            Clear
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="confirm-overlay" style={{ zIndex: 9999 }}>
          <div className="confirm-dialog">
            <p>Clear all drawings?</p>
            <div className="confirm-actions">
              <button className="btn-danger" onClick={clearStrokes}>Yes, clear</button>
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

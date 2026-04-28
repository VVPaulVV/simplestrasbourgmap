import { useRef, useState, useCallback, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTranslation } from 'react-i18next';
import {
  IconBuildingArch,
  IconEye,
  IconToolsKitchen2,
  IconCoffee,
  IconToiletPaper,
  IconParking,
  IconBike,
  IconNavigation,
  IconShare,
} from '@tabler/icons-react';
import DrawingShareModal from './DrawingShareModal';

import pois from '../data/pois.json';
import toilets from '../data/toilets.json';
import { useParking } from '../hooks/useParking';
import { useVelhop } from '../hooks/useVelhop';
import DrawingCanvas, { COLORS, BRUSH_SIZES } from './DrawingCanvas';
import POIPopup from './POIPopup';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MAPBOX_STYLE = 'mapbox://styles/spectruh/cmohqytpm001c01scbh6zgolw';

const CATEGORY_COLORS = {
  museum: '#7c3aed',
  sight: '#2563eb',
  restaurant: '#ea580c',
  cafe: '#92400e',
};

const CATEGORY_ICONS = {
  museum: IconBuildingArch,
  sight: IconEye,
  restaurant: IconToolsKitchen2,
  cafe: IconCoffee,
};

function PinMarker({ color, Icon, size = 36 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      width: size,
      height: size * 1.22,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.25))',
      transform: visible ? 'scale(1) translateY(0)' : 'scale(0.3) translateY(20px)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
      transformOrigin: 'bottom center',
    }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size * 1.22}
        viewBox="0 0 36 44"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <path
          d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.059 27.941 0 18 0z"
          fill={color}
        />
      </svg>
      <div style={{ position: 'relative', marginBottom: size * 0 }}>
        <Icon size={size * 0.5} stroke={2} color="white" />
      </div>
    </div>
  );
}

function SquareMarker({ color, Icon, label }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      width: 32, height: 32,
      background: color,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
      gap: 1,
      transform: visible ? 'scale(1) translateY(0)' : 'scale(0.3) translateY(10px)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
      transformOrigin: 'bottom center',
    }}>
      <Icon size={14} stroke={2} color="white" />
      {label !== undefined && (
        <span style={{ fontSize: 9, fontWeight: 700, color: 'white', lineHeight: 1, fontFamily: 'Open Sans, sans-serif' }}>
          {label}
        </span>
      )}
    </div>
  );
}

function ColorSwatch({ c, active, onClick }) {
  const [pressing, setPressing] = useState(false);

  return (
    <button
      className={`color-swatch ${active ? 'active' : ''}`}
      style={{
        background: c,
        transform: pressing ? 'scale(0.88)' : active ? 'scale(1.2)' : 'scale(1)',
        transition: pressing
          ? 'transform 0.08s ease'
          : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        border: c === '#ffffff' ? '1px solid #ccc' : 'none',
      }}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => { setPressing(false); onClick(c); }}
      onMouseLeave={() => setPressing(false)}
      onTouchStart={() => setPressing(true)}
      onTouchEnd={() => { setPressing(false); onClick(c); }}
    />
  );
}

function SizeButton({ s, i, active, onClick }) {
  const [pressing, setPressing] = useState(false);

  return (
    <button
      className={`size-btn ${active ? 'active' : ''}`}
      style={{
        transform: pressing ? 'scale(0.88)' : 'scale(1)',
        transition: pressing
          ? 'transform 0.08s ease'
          : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => { setPressing(false); onClick(i); }}
      onMouseLeave={() => setPressing(false)}
      onTouchStart={() => setPressing(true)}
      onTouchEnd={() => { setPressing(false); onClick(i); }}
    >
      <span style={{ width: s * 2, height: s * 2, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} />
    </button>
  );
}

function ToolButton({ className, onClick, children }) {
  const [pressing, setPressing] = useState(false);

  return (
    <button
      className={className}
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

export default function MapView({ layers, drawingActive, drawingVisible, drawingClosing, lang, flyTarget, sidebarOpen }) {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [selectedToilet, setSelectedToilet] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const [selectedVelhop, setSelectedVelhop] = useState(null);

  const [color, setColor] = useState('#e63946');
  const [sizeIdx, setSizeIdx] = useState(0);
  const [erasing, setErasing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);

  const { parkings, lastUpdated: parkingUpdated } = useParking();
  const { stations: velhopStations, lastUpdated: velhopUpdated } = useVelhop();

  useEffect(() => {
    if (!flyTarget || !mapRef.current) return;
    mapRef.current.flyTo({ center: [flyTarget.lng, flyTarget.lat], zoom: 17, duration: 1000 });
  }, [flyTarget]);

  useEffect(() => {
    if (!mapRef.current) return;
    const timeout = setTimeout(() => {
      mapRef.current.resize();
    }, 280);
    return () => clearTimeout(timeout);
  }, [sidebarOpen]);

  const parkingColor = (color) =>
    color === 'GREEN' ? '#27ae60' : color === 'ORANGE' ? '#e67e22' : color === 'RED' ? '#e74c3c' : '#95a5a6';

  const velhopColor = (available) =>
    available > 5 ? '#27ae60' : available > 0 ? '#e67e22' : '#e74c3c';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={MAPBOX_STYLE}
        initialViewState={{ longitude: 7.7521, latitude: 48.5734, zoom: 14 }}
        style={{ width: '100%', height: '100%' }}

      >
        <NavigationControl position="top-left" />

        {/* POI markers */}
        {['museum', 'sight', 'restaurant', 'cafe'].map(cat =>
          layers[cat] && pois
            .filter(p => p.category === cat)
            .map(poi => (
              <Marker
                key={poi.id}
                longitude={poi.lng}
                latitude={poi.lat}
                anchor="bottom"
                onClick={e => { e.originalEvent.stopPropagation(); setSelectedPOI(poi); setSelectedToilet(null); setSelectedParking(null); setSelectedVelhop(null); }}
              >
                <PinMarker color={CATEGORY_COLORS[cat]} Icon={CATEGORY_ICONS[cat]} />
              </Marker>
            ))
        )}

        {/* Toilet markers */}
        {layers.toilets && toilets.map(toilet => (
          <Marker
            key={toilet.id}
            longitude={toilet.lng}
            latitude={toilet.lat}
            anchor="bottom"
            onClick={e => { e.originalEvent.stopPropagation(); setSelectedToilet(toilet); setSelectedPOI(null); setSelectedParking(null); setSelectedVelhop(null); }}
          >
            <SquareMarker color="#0369a1" Icon={IconToiletPaper} />
          </Marker>
        ))}

        {/* Parking markers */}
        {layers.parking && parkings.map(p => (
          <Marker
            key={p.id}
            longitude={p.lng}
            latitude={p.lat}
            anchor="bottom"
            onClick={e => { e.originalEvent.stopPropagation(); setSelectedParking(p); setSelectedPOI(null); setSelectedToilet(null); setSelectedVelhop(null); }}
          >
            <SquareMarker color={parkingColor(p.color)} Icon={IconParking} label={p.free} />
          </Marker>
        ))}

        {/* Vélhop markers */}
        {layers.velhop && velhopStations.map(s => (
          <Marker
            key={s.id}
            longitude={s.lng}
            latitude={s.lat}
            anchor="bottom"
            onClick={e => { e.originalEvent.stopPropagation(); setSelectedVelhop(s); setSelectedPOI(null); setSelectedToilet(null); setSelectedParking(null); }}
          >
            <SquareMarker color={velhopColor(s.available)} Icon={IconBike} label={s.available} />
          </Marker>
        ))}

        {/* POI Popup */}
        {selectedPOI && (
          <Popup
            longitude={selectedPOI.lng}
            latitude={selectedPOI.lat}
            anchor="bottom"
            offset={48}
            onClose={() => setSelectedPOI(null)}
            closeButton={false}
            className="mapbox-popup"
            maxWidth="300px"
          >
            <POIPopup poi={selectedPOI} lang={lang} />
          </Popup>
        )}

        {/* Toilet Popup */}
        {selectedToilet && (
          <Popup
            longitude={selectedToilet.lng}
            latitude={selectedToilet.lat}
            anchor="bottom"
            offset={40}
            onClose={() => setSelectedToilet(null)}
            closeButton={false}
            className="mapbox-popup"
            maxWidth="240px"
          >
            <div className="simple-popup">
              <strong><IconToiletPaper size={14} stroke={1.5} style={{ marginRight: 6, verticalAlign: 'middle' }} />{selectedToilet.name}</strong>
              {selectedToilet.pmr && <div className="popup-tag accessible">{t('toilet.accessible')}</div>}
              {selectedToilet.hours && <div className="popup-detail">{t('toilet.hours')}: {selectedToilet.hours}</div>}
              <div className="popup-detail">{t(`toilet.type.${selectedToilet.type}`)}</div>
              {selectedToilet.seasonal && <div className="popup-tag seasonal">{t('toilet.seasonal')}</div>}
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedToilet.lat},${selectedToilet.lng}`} target="_blank" rel="noopener noreferrer" className="btn-action popup-directions-btn">
                <IconNavigation size={13} stroke={1.5} /> {t('poi.directions')}
              </a>
            </div>
          </Popup>
        )}

        {/* Parking Popup */}
        {selectedParking && (
          <Popup
            longitude={selectedParking.lng}
            latitude={selectedParking.lat}
            anchor="bottom"
            offset={40}
            onClose={() => setSelectedParking(null)}
            closeButton={false}
            className="mapbox-popup"
            maxWidth="240px"
          >
            <div className="simple-popup">
              <strong><IconParking size={14} stroke={1.5} style={{ marginRight: 6, verticalAlign: 'middle' }} />{selectedParking.name}</strong>
              <div className="popup-detail">
                {selectedParking.status === 'Ouvert'
                  ? `${selectedParking.free} ${t('parking.free')} / ${selectedParking.total} ${t('parking.total')}`
                  : selectedParking.status === 'Fermé' ? t('parking.closed') : t('parking.unknown')}
              </div>
              {parkingUpdated && <div className="popup-timestamp">{t('parking.lastUpdated')}: {parkingUpdated.toLocaleTimeString()}</div>}
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedParking.lat},${selectedParking.lng}`} target="_blank" rel="noopener noreferrer" className="btn-action popup-directions-btn">
                <IconNavigation size={13} stroke={1.5} /> {t('poi.directions')}
              </a>
            </div>
          </Popup>
        )}

        {/* Vélhop Popup */}
        {selectedVelhop && (
          <Popup
            longitude={selectedVelhop.lng}
            latitude={selectedVelhop.lat}
            anchor="bottom"
            offset={40}
            onClose={() => setSelectedVelhop(null)}
            closeButton={false}
            className="mapbox-popup"
            maxWidth="240px"
          >
            <div className="simple-popup">
              <strong><IconBike size={14} stroke={1.5} style={{ marginRight: 6, verticalAlign: 'middle' }} />{selectedVelhop.name}</strong>
              <div className="popup-detail">{selectedVelhop.available} {t('velhop.available')} · {selectedVelhop.free} {t('velhop.free')}</div>
              <div className="popup-detail">{t('velhop.total')}: {selectedVelhop.total}</div>
              {velhopUpdated && <div className="popup-timestamp">{t('parking.lastUpdated')}: {velhopUpdated.toLocaleTimeString()}</div>}
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedVelhop.lat},${selectedVelhop.lng}`} target="_blank" rel="noopener noreferrer" className="btn-action popup-directions-btn">
                <IconNavigation size={13} stroke={1.5} /> {t('poi.directions')}
              </a>
            </div>
          </Popup>
        )}

        <DrawingCanvas
          ref={drawingCanvasRef}
          active={drawingActive}
          color={color}
          sizeIdx={sizeIdx}
          erasing={erasing}
          clearTrigger={clearTrigger}
          lang={lang}
        />
      </Map>

      {drawingVisible && (
        <div className={`drawing-toolbar ${drawingClosing ? 'closing' : ''}`}>
          <div className="drawing-colors">
            {COLORS.map(c => (
              <ColorSwatch
                key={c}
                c={c}
                active={color === c && !erasing}
                onClick={(c) => { setColor(c); setErasing(false); }}
              />
            ))}
          </div>
          <div className="drawing-sizes">
            {BRUSH_SIZES.map((s, i) => (
              <SizeButton
                key={s}
                s={s}
                i={i}
                active={sizeIdx === i && !erasing}
                onClick={(i) => { setSizeIdx(i); setErasing(false); }}
              />
            ))}
          </div>
          <ToolButton
            className={`tool-btn ${erasing ? 'active' : ''}`}
            onClick={() => setErasing(e => !e)}
          >
            Erase
          </ToolButton>
          <ToolButton
            className="tool-btn tool-btn-danger"
            onClick={() => setShowConfirm(true)}
          >
            Clear
          </ToolButton>
          <ToolButton
            className="tool-btn"
            onClick={() => setShowShare(true)}
          >
            <IconShare size={14} stroke={1.5} />
            Share
          </ToolButton>
        </div>
      )}

      {drawingVisible && (
        <div className={`drawing-mode-banner ${drawingClosing ? 'closing' : ''}`}>
          ✏ Drawing mode
        </div>
      )}

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <p>Clear all drawings?</p>
            <div className="confirm-actions">
              <button className="btn-danger" onClick={() => { setClearTrigger(prev => prev + 1); setShowConfirm(false); }}>Yes, clear</button>
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showShare && (
        <DrawingShareModal
          onClose={() => setShowShare(false)}
          strokes={drawingCanvasRef.current?.getStrokes() || []}
          lang={lang}
        />
      )}

      {/* Legend */}
      <div className="map-legend">
        <span className="legend-title">🅿 / 🚲</span>
        <div className="legend-group">
          <div className="legend-row"><span className="legend-dot" style={{ background: '#27ae60' }} /><span>{t('legend.high')}</span></div>
          <div className="legend-row"><span className="legend-dot" style={{ background: '#e67e22' }} /><span>{t('legend.medium')}</span></div>
          <div className="legend-row"><span className="legend-dot" style={{ background: '#e74c3c' }} /><span>{t('legend.low')}</span></div>
        </div>
      </div>
    </div>
  );
}

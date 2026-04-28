import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconBuildingArch,
  IconEye,
  IconToolsKitchen2,
  IconCoffee,
  IconToiletPaper,
  IconParking,
  IconBike,
} from '@tabler/icons-react';

const LAYER_DEFS = [
  { key: 'museum', Icon: IconBuildingArch },
  { key: 'sight', Icon: IconEye },
  { key: 'restaurant', Icon: IconToolsKitchen2 },
  { key: 'cafe', Icon: IconCoffee },
  { key: 'toilets', Icon: IconToiletPaper },
  { key: 'parking', Icon: IconParking },
  { key: 'velhop', Icon: IconBike },
];

const LAYER_COLORS = {
  museum: '#7c3aed',
  sight: '#2563eb',
  restaurant: '#ea580c',
  cafe: '#92400e',
  toilets: '#0369a1',
  parking: '#16a34a',
  velhop: '#16a34a',
};

function LayerItem({ layerKey, Icon, label, active, onToggle }) {
  const [pressing, setPressing] = useState(false);

  return (
    <div
      className={`layer-item ${active ? 'active' : ''}`}
      style={{
        transform: pressing ? 'scale(0.95)' : 'scale(1)',
        transition: pressing
          ? 'transform 0.08s ease'
          : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s ease, border 0.15s ease',
      }}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => { setPressing(false); onToggle(layerKey); }}
      onMouseLeave={() => setPressing(false)}
      onTouchStart={() => setPressing(true)}
      onTouchEnd={() => { setPressing(false); onToggle(layerKey); }}
    >
      <Icon size={16} stroke={1.5} color={active ? LAYER_COLORS[layerKey] : '#9ca3af'} style={{ transition: 'color 0.2s ease' }} />
      <span className="layer-label">{label}</span>
      <div className="layer-check" />
    </div>
  );
}

export default function LayerControl({ layers, onToggle }) {
  const { t } = useTranslation();

  return (
    <div className="layer-control">
      <div className="layer-control-title">{t('layers.title')}</div>
      {LAYER_DEFS.map(({ key, Icon }) => (
        <LayerItem
          key={key}
          layerKey={key}
          Icon={Icon}
          label={t(`layers.${key}`)}
          active={layers[key]}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

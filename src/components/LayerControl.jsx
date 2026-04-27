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

export default function LayerControl({ layers, onToggle }) {
  const { t } = useTranslation();

  return (
    <div className="layer-control">
      <div className="layer-control-title">{t('layers.title')}</div>
      {LAYER_DEFS.map(({ key, Icon }) => (
        <div
          key={key}
          className={`layer-item ${layers[key] ? 'active' : ''}`}
          onClick={() => onToggle(key)}
        >
          <Icon
            size={16}
            stroke={1.5}
            color={layers[key] ? LAYER_COLORS[key] : '#9ca3af'}
          />
          <span className="layer-label">{t(`layers.${key}`)}</span>

        </div>
      ))}
    </div>
  );
}

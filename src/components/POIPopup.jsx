import { useTranslation } from 'react-i18next';
import {
  IconMapPin,
  IconClock,
  IconPhone,
  IconWorld,
  IconArrowUpRight,
  IconNavigation,
} from '@tabler/icons-react';

const CATEGORY_ICONS = {
  museum: '🏛️',
  sight: '👁️',
  restaurant: '🍽️',
  cafe: '☕',
};

export default function POIPopup({ poi, lang }) {
  const { t } = useTranslation();
  const name = lang === 'fr' ? poi.name_fr : poi.name_en;
  const description = lang === 'fr' ? poi.description_fr : poi.description_en;
  const icon = CATEGORY_ICONS[poi.category] || '📍';

  return (
    <div className="poi-popup">
      <div className="poi-popup-body">
        <div className="poi-popup-header">
          <span className="poi-category-icon">{icon}</span>
          <h3>{name}</h3>
        </div>
        <p className="poi-description">{description}</p>
        {poi.address && (
          <div className="poi-detail">
            <IconMapPin size={13} stroke={1.5} style={{ flexShrink: 0, marginTop: 1, color: 'var(--text-muted)' }} />
            <span>{poi.address}</span>
          </div>
        )}
        {(poi.opening_hours || poi.opening_hours_fr) && (
          <div className="poi-detail">
            <IconClock size={13} stroke={1.5} style={{ flexShrink: 0, marginTop: 1, color: 'var(--text-muted)' }} />
            <span>{lang === 'fr' ? (poi.opening_hours_fr || poi.opening_hours) : (poi.opening_hours || poi.opening_hours_fr)}</span>
          </div>
        )}
        {poi.phone && (
          <div className="poi-detail">
            <IconPhone size={13} stroke={1.5} style={{ flexShrink: 0, marginTop: 1, color: 'var(--text-muted)' }} />
            <a href={`tel:${poi.phone}`}>{poi.phone}</a>
          </div>
        )}
        <div className="poi-popup-actions">
          {poi.website && (
            <a href={poi.website} target="_blank" rel="noopener noreferrer" className="btn-action">
              <IconWorld size={13} stroke={1.5} />
              {t('poi.website')}
            </a>
          )}
          {poi.reserve_url && (
            <a href={poi.reserve_url} target="_blank" rel="noopener noreferrer" className="btn-action btn-action-primary">
              <IconArrowUpRight size={13} stroke={1.5} />
              {t('poi.reserve')}
            </a>
          )}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${poi.lat},${poi.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-action"
          >
            <IconNavigation size={13} stroke={1.5} />
            {t('poi.directions')}
          </a>
        </div>
      </div>
    </div>
  );
}

import { useTranslation } from 'react-i18next';

export default function MapLegend() {
  const { t } = useTranslation();

  return (
    <div className="map-legend">
      <div className="legend-group">
        <span className="legend-title">🅿️ / 🚲</span>
        <div className="legend-row"><span className="legend-dot" style={{ background: '#27ae60' }} /><span>{t('legend.high')}</span></div>
        <div className="legend-row"><span className="legend-dot" style={{ background: '#e67e22' }} /><span>{t('legend.medium')}</span></div>
        <div className="legend-row"><span className="legend-dot" style={{ background: '#e74c3c' }} /><span>{t('legend.low')}</span></div>
        <div className="legend-row"><span className="legend-dot" style={{ background: '#95a5a6' }} /><span>{t('legend.unknown')}</span></div>
      </div>
    </div>
  );
}

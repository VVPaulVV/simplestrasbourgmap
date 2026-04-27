import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconX, IconTrain, IconBike, IconPhone, IconBuildingBank } from '@tabler/icons-react';
import { INFO_TOPICS } from '../data/info.js';

const TOPIC_ICONS = {
  transport: IconTrain,
  velhop: IconBike,
  numbers: IconPhone,
  touristtax: IconBuildingBank,
};

export default function InfoPanel({ open, onClose, lang }) {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState(INFO_TOPICS[0].id);

  const topic = INFO_TOPICS.find(t => t.id === activeId);

  return (
    <>
      {open && <div className="info-overlay" onClick={onClose} />}
      <div className={`info-panel ${open ? 'open' : ''}`}>
        <div className="info-panel-header">
          <span className="info-panel-title">{lang === 'fr' ? 'Informations' : 'Information'}</span>
          <button className="info-close-btn" onClick={onClose}>
            <IconX size={16} stroke={1.5} />
          </button>
        </div>
        <div className="info-panel-body">
          <nav className="info-nav">
            {INFO_TOPICS.map(topic => {
              const Icon = TOPIC_ICONS[topic.id];
              return (
                <button
                  key={topic.id}
                  className={`info-nav-btn ${activeId === topic.id ? 'active' : ''}`}
                  onClick={() => setActiveId(topic.id)}
                >
                  {Icon && <Icon size={16} stroke={1.5} />}
                  <span>{topic.title[lang] || topic.title.en}</span>
                </button>
              );
            })}
          </nav>
          <div className="info-content">
            <h2 className="info-topic-title">
              {(() => { const Icon = TOPIC_ICONS[topic.id]; return Icon ? <Icon size={18} stroke={1.5} style={{marginRight: 8, verticalAlign: 'middle'}} /> : null; })()}
              {topic.title[lang] || topic.title.en}
            </h2>
            {topic.sections.map((section, i) => (
              <div key={i} className="info-section">
                <h3 className="info-section-heading">{section.heading[lang] || section.heading.en}</h3>

                {section.content && (
                  <p className="info-section-content">{section.content[lang] || section.content.en}</p>
                )}

                {section.table && (
                  <table className="info-table">
                    <tbody>
                      {section.table.map((row, j) => (
                        <tr key={j}>
                          <td>{row.label[lang] || row.label.en}</td>
                          <td className="info-table-price">{row.price}</td>
                          {row.note && <td className="info-table-note">{row.note[lang] || row.note.en}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {section.items && (
                  <ul className="info-list">
                    {(section.items[lang] || section.items.en).map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                )}

                {section.contacts && (
                  <div className="info-contacts">
                    {section.contacts.map((c, j) => (
                      <a key={j} href={`tel:${c.number}`} className="info-contact-row">
                        <span>{c.label[lang] || c.label.en}</span>
                        <span className="info-contact-number">{c.number}</span>
                      </a>
                    ))}
                  </div>
                )}

                {section.link && (
                  <a
                    href={section.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-action info-link-btn"
                  >
                    {section.link.label[lang] || section.link.label.en} ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

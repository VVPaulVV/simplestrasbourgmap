import { useState, useEffect, Component } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { IconX, IconCopy, IconCheck, IconLoader } from '@tabler/icons-react';
import { uploadDrawings } from '../utils/drawingShare';

class QRErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }
  componentDidCatch() { this.setState({ error: true }); }
  render() {
    if (this.state.error) return (
      <p className="share-instructions">QR code error. Use the copy link below.</p>
    );
    return this.props.children;
  }
}

export default function DrawingShareModal({ onClose, strokes, lang }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!strokes || strokes.length === 0) {
      setLoading(false);
      setError('no_drawings');
      return;
    }

    uploadDrawings(strokes)
      .then(binId => {
        const shareUrl = `${window.location.origin}${window.location.pathname}?code=${binId}`;
        setUrl(shareUrl);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError('upload_failed');
      });
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="share-overlay" onClick={onClose}>
      <div className="share-modal" onClick={e => e.stopPropagation()}>
        <div className="share-modal-header">
          <span className="share-modal-title">
            {lang === 'fr' ? 'Partager les dessins' : 'Share Drawings'}
          </span>
          <button className="info-close-btn" onClick={onClose}>
            <IconX size={16} stroke={1.5} />
          </button>
        </div>

        <div className="share-modal-body">
          {loading && (
            <div className="share-loading">
              <IconLoader size={28} stroke={1.5} className="share-spinner" />
              <p className="share-instructions">
                {lang === 'fr' ? 'Génération du QR code...' : 'Generating QR code...'}
              </p>
            </div>
          )}

          {!loading && error === 'no_drawings' && (
            <p className="share-instructions">
              {lang === 'fr' ? 'Aucun dessin à partager.' : 'No drawings to share yet.'}
            </p>
          )}

          {!loading && error === 'upload_failed' && (
            <p className="share-instructions">
              {lang === 'fr'
                ? 'Échec du partage. Vérifiez votre connexion internet.'
                : 'Share failed. Check your internet connection.'}
            </p>
          )}

          {!loading && !error && url && (
            <>
              <p className="share-instructions">
                {lang === 'fr'
                  ? 'Scannez ce QR code pour transférer les dessins.'
                  : 'Scan this QR code to transfer the drawings to another device.'}
              </p>
              <QRErrorBoundary>
                <div className="share-qr-wrapper">
                  <QRCodeSVG
                    value={url}
                    size={220}
                    bgColor="#e0e5ec"
                    fgColor="#1f2937"
                    level="M"
                  />
                </div>
              </QRErrorBoundary>
              <button className="share-copy-btn" onClick={handleCopy}>
                {copied
                  ? <><IconCheck size={14} stroke={1.5} />{lang === 'fr' ? 'Copié !' : 'Copied!'}</>
                  : <><IconCopy size={14} stroke={1.5} />{lang === 'fr' ? 'Copier le lien' : 'Copy link'}</>
                }
              </button>
              <p className="share-note">
                {lang === 'fr'
                  ? 'Le dessin sera disponible hors ligne après le premier scan.'
                  : 'Drawings will be available offline after the first scan.'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

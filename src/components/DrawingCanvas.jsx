import { useEffect, useRef, useState, useCallback } from 'react';
import { useMap } from 'react-map-gl';

const COLORS = ['#e63946', '#2a9d8f', '#e9c46a', '#264653', '#f4a261', '#6a0572', '#000000'];
const BRUSH_SIZES = [3, 6, 14];
const STORAGE_KEY = 'map_drawings_v3';

export default function DrawingCanvas({ active }) {
  const { current: map } = useMap();
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);
  const strokesRef = useRef([]); // [{color, size, points: [{lng,lat}]}]
  const currentStroke = useRef(null);

  const [color, setColor] = useState('#e63946');
  const [sizeIdx, setSizeIdx] = useState(0);
  const [erasing, setErasing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Project geographic point to canvas pixel
  const project = useCallback((lngLat) => {
    if (!map) return null;
    return map.project(lngLat);
  }, [map]);

  // Redraw all strokes onto canvas
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !map) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokesRef.current.forEach(stroke => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = 'source-over';

      const first = project(stroke.points[0]);
      if (!first) return;
      ctx.moveTo(first.x, first.y);

      for (let i = 1; i < stroke.points.length; i++) {
        const pt = project(stroke.points[i]);
        if (pt) ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    });
  }, [map, project]);

  // Resize canvas to match map container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !map) return;
    const container = map.getContainer();
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    redraw();
  }, [map, redraw]);

  // Init: resize and bind map events
  useEffect(() => {
    if (!map) return;
    resizeCanvas();
    map.on('move', redraw);
    map.on('zoom', redraw);
    map.on('resize', resizeCanvas);

    // Load saved strokes
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        strokesRef.current = JSON.parse(saved);
        redraw();
      } catch (e) {}
    }

    return () => {
      map.off('move', redraw);
      map.off('zoom', redraw);
      map.off('resize', resizeCanvas);
    };
  }, [map, redraw, resizeCanvas]);

  function saveStrokes() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(strokesRef.current));
    } catch (e) {}
  }

  function getCanvasPos(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }

  function toLngLat(x, y) {
    if (!map) return null;
    return map.unproject([x, y]);
  }

  function eraseNear(x, y) {
    const threshold = BRUSH_SIZES[sizeIdx] * 4;
    const before = strokesRef.current.length;
    strokesRef.current = strokesRef.current.filter(stroke => {
      return !stroke.points.some(pt => {
        const px = project(pt);
        if (!px) return false;
        return Math.hypot(px.x - x, px.y - y) < threshold;
      });
    });
    if (strokesRef.current.length !== before) {
      redraw();
      saveStrokes();
    }
  }

  function startDraw(e) {
    if (!active) return;
    e.preventDefault();
    drawing.current = true;
    const pos = getCanvasPos(e);

    if (erasing) {
      eraseNear(pos.x, pos.y);
      return;
    }

    const lngLat = toLngLat(pos.x, pos.y);
    if (!lngLat) return;

    currentStroke.current = {
      color,
      size: BRUSH_SIZES[sizeIdx],
      points: [{ lng: lngLat.lng, lat: lngLat.lat }],
    };
    lastPos.current = pos;
  }

  function continueDraw(e) {
    if (!active || !drawing.current) return;
    e.preventDefault();
    const pos = getCanvasPos(e);

    if (erasing) {
      eraseNear(pos.x, pos.y);
      return;
    }

    if (!currentStroke.current || !lastPos.current) return;

    const lngLat = toLngLat(pos.x, pos.y);
    if (!lngLat) return;

    currentStroke.current.points.push({ lng: lngLat.lng, lat: lngLat.lat });

    // Draw incrementally on canvas for performance
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = BRUSH_SIZES[sizeIdx];
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPos.current = pos;
  }

  function endDraw() {
    if (!drawing.current) return;
    drawing.current = false;

    if (!erasing && currentStroke.current && currentStroke.current.points.length > 1) {
      strokesRef.current.push(currentStroke.current);
      saveStrokes();
    }

    currentStroke.current = null;
    lastPos.current = null;
  }

  function clearAll() {
    strokesRef.current = [];
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem(STORAGE_KEY);
    setShowConfirm(false);
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          zIndex: 500,
          pointerEvents: active ? 'all' : 'none',
          cursor: active ? (erasing ? 'cell' : 'crosshair') : 'default',
          touchAction: 'none',
        }}
        onMouseDown={startDraw}
        onMouseMove={continueDraw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={continueDraw}
        onTouchEnd={endDraw}
      />

      {active && (
        <div className="drawing-toolbar">
          <div className="drawing-colors">
            {COLORS.map(c => (
              <button
                key={c}
                className={`color-swatch ${color === c && !erasing ? 'active' : ''}`}
                style={{ background: c }}
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
                <span style={{ width: s * 2, height: s * 2, borderRadius: '50%', background: '#6b7280', display: 'inline-block' }} />
              </button>
            ))}
          </div>
          <button className={`tool-btn ${erasing ? 'active' : ''}`} onClick={() => setErasing(e => !e)}>
            Erase
          </button>
          <button className="tool-btn tool-btn-danger" onClick={() => setShowConfirm(true)}>
            Clear
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <p>Clear all drawings?</p>
            <div className="confirm-actions">
              <button className="btn-danger" onClick={clearAll}>Yes, clear</button>
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

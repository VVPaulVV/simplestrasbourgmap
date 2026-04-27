import { useEffect, useRef } from 'react';
import { useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

function DrawingLayer({ active, color, brushSize, erasing, onStrokeAdded, strokesRef }) {
  const map = useMap();
  const drawing = useRef(false);
  const currentPoints = useRef([]);
  const currentPolyline = useRef(null);

  function eraseNear(latlng) {
    const threshold = brushSize * 5;
    const point = map.latLngToContainerPoint(latlng);
    const before = strokesRef.current.length;
    
    strokesRef.current = strokesRef.current.filter(p => {
      const latlngs = p.getLatLngs();
      const hit = latlngs.some(ll => {
        const pt = map.latLngToContainerPoint(ll);
        return Math.hypot(pt.x - point.x, pt.y - point.y) < threshold;
      });
      if (hit) {
        map.removeLayer(p);
        return false;
      }
      return true;
    });

    if (strokesRef.current.length !== before) {
      onStrokeAdded();
    }
  }

  useMapEvents({
    mousedown(e) {
      if (!active) return;
      drawing.current = true;
      if (erasing) {
        eraseNear(e.latlng);
        return;
      }
      currentPoints.current = [e.latlng];
      currentPolyline.current = L.polyline([e.latlng], {
        color,
        weight: brushSize,
        lineCap: 'round',
        lineJoin: 'round',
        interactive: false,
      }).addTo(map);
    },
    mousemove(e) {
      if (!active || !drawing.current) return;
      if (erasing) {
        eraseNear(e.latlng);
        return;
      }
      if (!currentPolyline.current) return;
      currentPoints.current.push(e.latlng);
      currentPolyline.current.setLatLngs(currentPoints.current);
    },
    mouseup() {
      if (!drawing.current) return;
      drawing.current = false;
      if (!erasing && currentPolyline.current) {
        strokesRef.current.push(currentPolyline.current);
        onStrokeAdded();
      }
      currentPolyline.current = null;
      currentPoints.current = [];
    },
  });

  // Touch support
  useEffect(() => {
    if (!active) return;

    const container = map.getContainer();

    function toLatLng(touch) {
      const rect = container.getBoundingClientRect();
      const point = L.point(touch.clientX - rect.left, touch.clientY - rect.top);
      return map.containerPointToLatLng(point);
    }

    function onTouchStart(e) {
      if (!active) return;
      e.preventDefault();
      const latlng = toLatLng(e.touches[0]);
      drawing.current = true;
      
      if (erasing) {
        eraseNear(latlng);
        return;
      }

      currentPoints.current = [latlng];
      currentPolyline.current = L.polyline([latlng], {
        color,
        weight: brushSize,
        lineCap: 'round',
        lineJoin: 'round',
        interactive: false,
      }).addTo(map);
    }

    function onTouchMove(e) {
      if (!active || !drawing.current) return;
      e.preventDefault();
      const latlng = toLatLng(e.touches[0]);
      
      if (erasing) {
        eraseNear(latlng);
        return;
      }

      if (!currentPolyline.current) return;
      currentPoints.current.push(latlng);
      currentPolyline.current.setLatLngs(currentPoints.current);
    }

    function onTouchEnd() {
      if (!drawing.current) return;
      drawing.current = false;
      
      if (!erasing && currentPolyline.current) {
        strokesRef.current.push(currentPolyline.current);
        onStrokeAdded();
      }
      
      currentPolyline.current = null;
      currentPoints.current = [];
    }

    container.addEventListener('touchstart', onTouchStart, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd);

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);
    };
  }, [active, color, brushSize, erasing, map]);

  return null;
}

export default function DrawingCanvas({ active, color, brushSize, erasing, onStrokeAdded, strokesRef }) {
  return (
    <DrawingLayer
      active={active}
      color={color}
      brushSize={brushSize}
      erasing={erasing}
      onStrokeAdded={onStrokeAdded}
      strokesRef={strokesRef}
    />
  );
}

const JSONBIN_API_KEY = '$2a$10$10nKUZGSHHsM5KXw0s//7eDoqOaH0cw7CNgnsrnzQGkbxd3MND7eC';
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b';

function compressStrokes(strokes) {
  return strokes.map(stroke => ({
    c: stroke.color,
    s: stroke.size,
    p: stroke.points
      .filter((_, i) => i === 0 || i === stroke.points.length - 1 || i % 2 === 0)
      .map(pt => [
        Math.round(pt.lng * 10000) / 10000,
        Math.round(pt.lat * 10000) / 10000,
      ]),
  }));
}

function expandStrokes(compressed) {
  return compressed.map(stroke => ({
    color: stroke.c,
    size: stroke.s,
    points: stroke.p.map(([lng, lat]) => ({ lng, lat })),
  }));
}

export async function uploadDrawings(strokes) {
  const compressed = compressStrokes(strokes);
  const res = await fetch(JSONBIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_API_KEY,
      'X-Bin-Name': `stras-drawing-${Date.now()}`,
      'X-Bin-Private': 'false',
    },
    body: JSON.stringify({ strokes: compressed }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('JSONBin error:', res.status, errorText);
    throw new Error(`Upload failed: ${res.status}`);
  }
  const data = await res.json();
  return data.metadata.id;
}

export async function downloadDrawings(binId) {
  const res = await fetch(`${JSONBIN_URL}/${binId}/latest`, {
    headers: { 'X-Master-Key': JSONBIN_API_KEY },
  });

  if (!res.ok) throw new Error('Download failed');
  const data = await res.json();
  return expandStrokes(data.record.strokes);
}

import * as THREE from 'three';

/**
 * Creates high-contrast, luminous geopolitical border overlays for Three.js
 * Draws major country borders, coastlines, and key latitude/longitude navigation rings
 */
export function createGeopoliticalOverlayTexture(): THREE.CanvasTexture {
  const width = 4096;
  const height = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, width, height);

  const toXY = (lat: number, lng: number): [number, number] => {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return [x, y];
  };

  // Subtle coordinate grid
  ctx.strokeStyle = 'rgba(223, 186, 115, 0.12)';
  ctx.lineWidth = 1;
  for (let lat = -75; lat <= 75; lat += 15) {
    const [, y] = toXY(lat, 0);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  for (let lng = -180; lng <= 180; lng += 30) {
    const [x] = toXY(0, lng);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Equator & Prime Meridian highlighted
  const [, eqY] = toXY(0, 0);
  ctx.strokeStyle = 'rgba(223, 186, 115, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, eqY);
  ctx.lineTo(width, eqY);
  ctx.stroke();

  // Key Geopolitical Boundaries (North America, Europe, Middle East, Asia, Australia)
  const BORDERS: [number, number][][] = [
    // US - Canada border (49th parallel + Great Lakes + East)
    [[49, -125], [49, -95], [48.5, -89.5], [46, -84], [43, -82], [42.3, -83.1], [43, -79], [45, -74.8], [45, -71.5], [47.4, -67.8], [45, -67]],
    // US - Mexico border
    [[32.5, -117.1], [32.5, -114.8], [31.3, -111.0], [31.3, -108.2], [31.8, -106.5], [29.8, -104.5], [29.0, -100.5], [26.0, -97.1]],
    // UK & Ireland
    [[58.6, -3.1], [55.8, -2.0], [52.8, 1.7], [50.7, 0.1], [50.1, -5.7], [52.5, -4.1], [55.0, -5.1], [58.6, -3.1]],
    [[55.2, -7.0], [53.5, -6.0], [51.5, -9.5], [54.0, -10.0], [55.2, -7.0]],
    // Germany Boundaries
    [[54.9, 8.5], [54.0, 14.2], [51.0, 15.0], [48.6, 13.8], [47.5, 13.0], [47.6, 9.6], [47.6, 7.5], [49.0, 8.2], [50.3, 6.0], [53.5, 7.0], [54.9, 8.5]],
    // France Boundaries
    [[51.1, 2.5], [49.0, 8.2], [47.6, 7.5], [46.2, 6.0], [43.6, 7.5], [42.4, 3.2], [43.4, -1.8], [48.3, -4.7], [49.7, -1.9], [51.1, 2.5]],
    // Spain & Portugal
    [[43.7, -7.8], [43.4, -1.8], [42.4, 3.2], [36.7, -2.1], [36.0, -5.6], [37.1, -8.9], [41.8, -8.9], [42.1, -6.8], [37.2, -7.4]],
    // Italy
    [[46.5, 11.5], [45.7, 13.6], [41.9, 16.0], [40.2, 18.5], [38.0, 15.5], [37.0, 15.1], [38.2, 12.5], [41.2, 13.2], [44.4, 8.9], [45.8, 7.0], [46.5, 11.5]],
    // Switzerland
    [[47.7, 8.6], [47.5, 9.8], [46.5, 10.4], [45.8, 7.0], [46.2, 6.0], [47.5, 7.5], [47.7, 8.6]],
    // Netherlands & Belgium
    [[53.5, 7.0], [53.0, 4.8], [51.4, 3.5], [50.5, 4.2], [50.8, 6.0], [52.2, 6.8], [53.5, 7.0]],
    // Iran National Border (Full Perimeter)
    [
      [39.7, 44.3], [39.0, 45.2], [38.4, 48.8], [37.5, 50.0], [36.8, 54.0], [37.5, 55.5],
      [38.0, 57.5], [37.8, 59.0], [35.5, 61.2], [34.0, 60.5], [31.5, 61.8], [29.8, 61.0],
      [27.5, 62.8], [25.2, 61.6], [25.4, 59.5], [26.5, 57.0], [27.0, 54.0], [27.5, 52.5],
      [29.0, 50.5], [30.0, 48.6], [31.5, 47.7], [33.0, 46.0], [35.5, 45.5], [37.1, 44.5],
      [39.7, 44.3]
    ],
    // UAE Border
    [[26.0, 56.0], [24.0, 56.0], [23.0, 55.0], [24.0, 52.0], [24.5, 51.6], [25.5, 53.5], [26.0, 56.0]],
    // Australia Coastlines & State Borders
    [[-12, 131], [-14, 143], [-21, 149], [-28, 153], [-37, 150], [-39, 146], [-37, 140], [-34, 122], [-35, 116], [-22, 114], [-14, 127], [-12, 131]],
    [[-26, 129], [-26, 138], [-26, 153]],
    [[-34, 141], [-37, 141], [-37, 150]],
    // Japan
    [[45.5, 141.9], [41.8, 140.7], [35.6, 140.0], [33.5, 135.0], [31.0, 130.5], [33.9, 130.9], [37.5, 137.0], [45.5, 141.9]]
  ];

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(255, 225, 130, 0.85)'; // Crisp warm golden border
  ctx.lineWidth = 2.5;

  BORDERS.forEach((line) => {
    if (line.length < 2) return;
    ctx.beginPath();
    const [x0, y0] = toXY(line[0][0], line[0][1]);
    ctx.moveTo(x0, y0);
    for (let i = 1; i < line.length; i++) {
      const [x, y] = toXY(line[i][0], line[i][1]);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  });
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

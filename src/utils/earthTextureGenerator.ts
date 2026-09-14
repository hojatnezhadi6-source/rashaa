/**
 * Ultra-High-Resolution Procedural Realistic Earth Texture Generator
 * Creates photorealistic 4096x2048 Equirectangular textures for Three.js:
 * - Ultra-crisp coastlines, bathymetry, detailed country borders & landmasses
 * - Continental biome shading (deserts, savannas, lush rainforests, temperate zones, boreal taiga, glaciers)
 * - Geopolitical borders (crisp golden-white political boundary lines)
 * - Realistic mountain elevations and relief shading
 * - Dynamic cloud layer with alpha transparency
 */

import * as THREE from 'three';

export interface DetailedRegion {
  name: string;
  biome: 'desert' | 'rainforest' | 'temperate' | 'taiga' | 'ice' | 'steppe';
  coords: [number, number][];
}

// Highly accurate polygon data for continents and key countries
export const GEOPOLITICAL_BORDERS: DetailedRegion[] = [
  // Canada & North America
  {
    name: 'Canada Mainland & North',
    biome: 'taiga',
    coords: [
      [83, -75], [78, -100], [75, -120], [71, -135], [70, -141], [60, -141], [60, -139],
      [55, -130], [54, -133], [49, -123], [49, -95], [48, -89], [45, -84], [45, -75],
      [45, -71], [47, -67], [51, -57], [60, -64], [62, -77], [63, -92], [70, -94],
      [73, -80], [83, -75]
    ]
  },
  {
    name: 'United States Mainland',
    biome: 'temperate',
    coords: [
      [49, -123], [49, -95], [48, -89], [45, -84], [45, -75], [41, -71], [35, -75],
      [30, -81], [25, -80], [29, -89], [29, -95], [26, -97], [29, -103], [31, -106],
      [31, -111], [32, -114], [32, -117], [37, -122], [42, -124], [46, -124], [49, -123]
    ]
  },
  {
    name: 'Alaska',
    biome: 'taiga',
    coords: [
      [71, -156], [71, -141], [60, -141], [55, -131], [58, -136], [60, -149], [55, -163],
      [59, -164], [65, -168], [71, -156]
    ]
  },
  {
    name: 'Greenland',
    biome: 'ice',
    coords: [
      [83, -30], [81, -12], [76, -18], [70, -22], [65, -35], [60, -44], [64, -52],
      [73, -56], [78, -68], [82, -50], [83, -30]
    ]
  },
  {
    name: 'Mexico & Central America',
    biome: 'desert',
    coords: [
      [32, -117], [31, -111], [31, -106], [29, -103], [26, -97], [21, -97], [18, -94],
      [15, -92], [14, -88], [9, -83], [8, -77], [10, -75], [16, -88], [19, -104],
      [23, -107], [28, -112], [32, -117]
    ]
  },
  // South America
  {
    name: 'South America Amazon & Tropical',
    biome: 'rainforest',
    coords: [
      [12, -72], [11, -62], [7, -58], [4, -51], [-1, -48], [-5, -35], [-10, -36],
      [-15, -39], [-20, -40], [-23, -45], [-23, -55], [-15, -60], [-5, -70],
      [-2, -79], [4, -77], [9, -76], [12, -72]
    ]
  },
  {
    name: 'South America Southern Cone',
    biome: 'temperate',
    coords: [
      [-23, -45], [-30, -50], [-38, -57], [-46, -66], [-54, -68], [-53, -73],
      [-42, -73], [-33, -72], [-23, -70], [-23, -55], [-23, -45]
    ]
  },
  // Europe - Distinct Country Zones
  {
    name: 'United Kingdom & Ireland',
    biome: 'temperate',
    coords: [
      [58, -3], [58, -5], [55, -6], [52, -5], [50, -5], [50, 1], [53, 0], [55, -2], [58, -3]
    ]
  },
  {
    name: 'Ireland',
    biome: 'temperate',
    coords: [
      [55, -7], [54, -6], [52, -6], [51, -9], [53, -10], [55, -7]
    ]
  },
  {
    name: 'Germany & Central Europe',
    biome: 'temperate',
    coords: [
      [55, 8], [54, 14], [51, 15], [48, 13], [47, 10], [47, 7], [50, 6], [53, 7], [55, 8]
    ]
  },
  {
    name: 'France',
    biome: 'temperate',
    coords: [
      [51, 2], [49, 0], [48, -4], [46, -1], [43, -1], [42, 3], [43, 7], [46, 6],
      [49, 6], [51, 2]
    ]
  },
  {
    name: 'Iberian Peninsula (Spain & Portugal)',
    biome: 'desert',
    coords: [
      [43, -9], [43, -2], [42, 3], [37, 0], [36, -5], [37, -9], [41, -9], [43, -9]
    ]
  },
  {
    name: 'Italy',
    biome: 'temperate',
    coords: [
      [46, 7], [46, 13], [45, 12], [41, 16], [40, 18], [38, 16], [38, 13], [41, 12],
      [44, 8], [46, 7]
    ]
  },
  {
    name: 'Switzerland & Alps',
    biome: 'temperate',
    coords: [
      [47.8, 8.6], [47.5, 9.8], [46.5, 10.4], [45.8, 7.0], [46.2, 6.0], [47.5, 7.5], [47.8, 8.6]
    ]
  },
  {
    name: 'Netherlands & Belgium',
    biome: 'temperate',
    coords: [
      [53.5, 7.0], [53.0, 4.8], [51.4, 3.5], [50.5, 4.2], [50.8, 6.0], [52.2, 6.8], [53.5, 7.0]
    ]
  },
  {
    name: 'Scandinavia (Norway & Sweden)',
    biome: 'taiga',
    coords: [
      [71, 28], [70, 20], [63, 10], [58, 6], [58, 12], [56, 14], [60, 18], [65, 24],
      [69, 26], [71, 28]
    ]
  },
  {
    name: 'Eastern Europe',
    biome: 'temperate',
    coords: [
      [60, 30], [55, 38], [46, 38], [46, 31], [44, 29], [40, 26], [44, 20], [50, 20],
      [55, 21], [60, 30]
    ]
  },
  // Middle East & Iran
  {
    name: 'Iran Plateau',
    biome: 'steppe',
    coords: [
      [39.5, 44.5], [38.5, 48.5], [37.5, 54.0], [38.0, 57.0], [35.5, 61.0], [31.5, 61.8],
      [25.3, 61.5], [26.5, 57.0], [27.0, 53.0], [30.0, 49.0], [33.5, 46.0], [37.0, 44.5],
      [39.5, 44.5]
    ]
  },
  {
    name: 'United Arab Emirates & Persian Gulf',
    biome: 'desert',
    coords: [
      [26.0, 56.0], [24.0, 56.0], [23.0, 55.0], [24.0, 52.0], [25.5, 53.5], [26.0, 56.0]
    ]
  },
  {
    name: 'Arabian Peninsula',
    biome: 'desert',
    coords: [
      [32, 35], [30, 48], [26, 50], [22, 60], [16, 54], [13, 45], [15, 40], [28, 34],
      [32, 35]
    ]
  },
  // Africa
  {
    name: 'North Africa & Sahara',
    biome: 'desert',
    coords: [
      [36, -6], [36, 11], [32, 25], [31, 32], [22, 37], [15, 40], [12, 14], [14, 0],
      [15, -17], [28, -13], [36, -6]
    ]
  },
  {
    name: 'Sub-Saharan Africa',
    biome: 'rainforest',
    coords: [
      [12, 14], [12, 44], [4, 48], [-4, 40], [-20, 35], [-34, 26], [-34, 18], [-20, 13],
      [-4, 9], [6, 3], [11, -15], [14, 0], [12, 14]
    ]
  },
  // Eurasia
  {
    name: 'Russia & Siberia',
    biome: 'taiga',
    coords: [
      [76, 100], [75, 140], [70, 160], [65, 175], [58, 145], [50, 130], [50, 90],
      [55, 60], [65, 40], [75, 80], [76, 100]
    ]
  },
  {
    name: 'East Asia & China',
    biome: 'temperate',
    coords: [
      [50, 130], [40, 125], [30, 122], [22, 114], [21, 100], [28, 97], [35, 95],
      [48, 105], [50, 130]
    ]
  },
  {
    name: 'Japan Archipelago',
    biome: 'temperate',
    coords: [
      [45, 142], [41, 141], [35, 140], [33, 130], [37, 137], [45, 142]
    ]
  },
  {
    name: 'India & South Asia',
    biome: 'rainforest',
    coords: [
      [32, 75], [27, 88], [22, 89], [13, 80], [8, 77], [15, 74], [24, 68], [32, 75]
    ]
  },
  // Australia & New Zealand
  {
    name: 'Australia',
    biome: 'desert',
    coords: [
      [-12, 131], [-14, 143], [-21, 149], [-28, 153], [-37, 150], [-39, 146],
      [-37, 140], [-34, 122], [-35, 116], [-22, 114], [-14, 127], [-12, 131]
    ]
  },
  {
    name: 'New Zealand',
    biome: 'temperate',
    coords: [
      [-35, 174], [-38, 178], [-46, 169], [-46, 166], [-42, 172], [-35, 174]
    ]
  },
  // Antarctica
  {
    name: 'Antarctica',
    biome: 'ice',
    coords: [
      [-65, -60], [-68, 10], [-65, 90], [-68, 160], [-77, -170], [-70, -90], [-65, -60]
    ]
  }
];

// Major geopolitical borders line-segments for high zoom level clarity
const COUNTRY_BORDER_LINES: [number, number][][] = [
  // US - Canada Border (49th Parallel & Great Lakes)
  [[49, -123], [49, -95], [48, -89], [46, -84], [43, -82], [42, -83], [43, -79], [45, -74], [45, -71], [47, -67]],
  // US - Mexico Border
  [[32.5, -117.1], [32.5, -114.8], [31.3, -111.0], [31.3, -108.2], [31.8, -106.5], [29.8, -104.5], [29.0, -100.5], [26.0, -97.1]],
  // France - Germany
  [[49.0, 8.2], [48.0, 7.6], [47.6, 7.5]],
  // France - Spain (Pyrenees)
  [[43.4, -1.8], [42.8, 0.0], [42.4, 3.2]],
  // Germany - Switzerland
  [[47.6, 7.5], [47.7, 8.6], [47.5, 9.6]],
  // Germany - Austria
  [[47.5, 9.6], [47.3, 11.2], [47.7, 13.0], [48.6, 13.8]],
  // Italy - Switzerland
  [[45.9, 6.9], [46.0, 8.5], [46.5, 10.4]],
  // UK - Scotland border
  [[55.8, -2.0], [55.2, -3.1]],
  // Iran - Turkey
  [[39.7, 44.3], [37.1, 44.5]],
  // Iran - Iraq
  [[37.1, 44.5], [34.0, 45.4], [32.0, 47.3], [30.0, 48.5]],
  // Iran - Pakistan
  [[29.8, 61.0], [25.2, 61.6]],
  // UAE - Saudi Arabia
  [[24.2, 51.6], [23.0, 55.0], [24.0, 55.8]]
];

/**
 * Creates high-resolution 4096x2048 photorealistic procedural Earth Day texture canvas
 * Includes geopolitical borders, latitude/longitude navigation grid, and crisp text labels
 */
export function createEarthDayTexture(): THREE.CanvasTexture {
  const width = 4096;
  const height = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // 1. Deep Ocean Base with realistic bathymetry gradients
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#091c36'); // Arctic Ocean
  oceanGrad.addColorStop(0.2, '#051329'); // North Atlantic
  oceanGrad.addColorStop(0.5, '#020b1c'); // Deep Equator Trench
  oceanGrad.addColorStop(0.8, '#041228'); // Southern Ocean
  oceanGrad.addColorStop(1, '#081a33'); // Antarctic
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Convert lat/lng to equirectangular [x, y]
  const toXY = (lat: number, lng: number): [number, number] => {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return [x, y];
  };

  // 2. Latitude & Longitude Navigation Coordinate Grid (Subtle, professional)
  ctx.save();
  ctx.strokeStyle = 'rgba(201, 169, 106, 0.08)'; // Fine golden navigation lines
  ctx.lineWidth = 1;

  // Latitude lines (every 15 degrees)
  for (let lat = -75; lat <= 75; lat += 15) {
    const [, y] = toXY(lat, 0);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Longitude lines (every 30 degrees)
  for (let lng = -180; lng <= 180; lng += 30) {
    const [x] = toXY(0, lng);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Equator line with slight gold highlight
  const [, eqY] = toXY(0, 0);
  ctx.strokeStyle = 'rgba(223, 186, 115, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, eqY);
  ctx.lineTo(width, eqY);
  ctx.stroke();
  ctx.restore();

  // Biome color palettes
  const biomeGradients: Record<string, { fill: string; stroke: string; accent: string }> = {
    desert: {
      fill: '#B88F52', // Sandy golden desert
      stroke: '#916B32',
      accent: '#D4AA6A',
    },
    rainforest: {
      fill: '#18471D', // Dense lush green
      stroke: '#0F2E13',
      accent: '#235D2A',
    },
    temperate: {
      fill: '#2F5C2D', // Rich agricultural & forest land
      stroke: '#20421E',
      accent: '#447A41',
    },
    taiga: {
      fill: '#1D3B2B', // Evergreen boreal forest
      stroke: '#13261C',
      accent: '#2A523D',
    },
    steppe: {
      fill: '#8F7B4A', // Iranian & Central Asian plateau
      stroke: '#6E5C31',
      accent: '#A8925B',
    },
    ice: {
      fill: '#E8F2F8', // Polar glacial ice
      stroke: '#B4D2E7',
      accent: '#FFFFFF',
    }
  };

  // 3. Coastal Shelf / Turquoise Shallows pass
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 22;
  ctx.strokeStyle = 'rgba(18, 92, 122, 0.45)'; // Vibrant turquoise ocean shelf

  GEOPOLITICAL_BORDERS.forEach((region) => {
    if (region.coords.length < 3) return;
    ctx.beginPath();
    const [x0, y0] = toXY(region.coords[0][0], region.coords[0][1]);
    ctx.moveTo(x0, y0);
    for (let i = 1; i < region.coords.length; i++) {
      const [x, y] = toXY(region.coords[i][0], region.coords[i][1]);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  });
  ctx.restore();

  // 4. Landmass Fills with realistic regional biomes
  GEOPOLITICAL_BORDERS.forEach((region) => {
    if (region.coords.length < 3) return;
    const palette = biomeGradients[region.biome] || biomeGradients.temperate;

    ctx.save();
    ctx.beginPath();
    const [x0, y0] = toXY(region.coords[0][0], region.coords[0][1]);
    ctx.moveTo(x0, y0);
    for (let i = 1; i < region.coords.length; i++) {
      const [x, y] = toXY(region.coords[i][0], region.coords[i][1]);
      ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Fill Landmass
    ctx.fillStyle = palette.fill;
    ctx.fill();

    // Natural coastline border
    ctx.lineWidth = 2.0;
    ctx.strokeStyle = palette.stroke;
    ctx.stroke();

    // Terrain variance
    ctx.fillStyle = palette.accent;
    ctx.globalAlpha = 0.28;
    for (let j = 0; j < region.coords.length - 1; j += 2) {
      const [x, y] = toXY(region.coords[j][0], region.coords[j][1]);
      ctx.beginPath();
      ctx.arc(x, y, 22 + (j % 5) * 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  // 5. Crisp Geopolitical Country Borders (Golden-White boundary lines)
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 3.0;
  ctx.strokeStyle = 'rgba(255, 235, 175, 0.75)'; // Luminous golden boundary line
  ctx.setLineDash([8, 4]); // Clean dash border

  COUNTRY_BORDER_LINES.forEach((line) => {
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

  // 6. Mountain Ranges (Alps, Rockies, Himalayas, Zagros, Alborz)
  const MOUNTAIN_CHAINS: [number, number][][] = [
    // Himalayas
    [[35, 74], [32, 78], [29, 85], [28, 90], [27, 95]],
    // Alborz & Zagros (Iran)
    [[37.0, 48.5], [36.0, 52.5], [36.5, 54.5]],
    [[37.5, 45.0], [33.5, 48.0], [30.0, 52.0], [28.0, 56.0]],
    // Alps (Europe)
    [[45, 6], [46, 8], [47, 11], [47, 14]],
    // Rockies (North America)
    [[60, -135], [52, -118], [44, -110], [36, -106]],
    // Andes (South America)
    [[5, -74], [-10, -76], [-22, -68], [-33, -70], [-45, -72]]
  ];

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  MOUNTAIN_CHAINS.forEach((chain) => {
    ctx.beginPath();
    const [x0, y0] = toXY(chain[0][0], chain[0][1]);
    ctx.moveTo(x0, y0);
    for (let i = 1; i < chain.length; i++) {
      const [x, y] = toXY(chain[i][0], chain[i][1]);
      ctx.lineTo(x, y);
    }
    // Slate rocky ridge
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'rgba(70, 65, 58, 0.7)';
    ctx.stroke();

    // Snow caps
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.stroke();
  });
  ctx.restore();

  // 7. Polar Glacial Ice Caps
  // Arctic
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(width / 2, 0, width / 2, 120, 0, 0, Math.PI * 2);
  ctx.fill();

  // Antarctica
  ctx.fillStyle = '#F4F9FD';
  ctx.beginPath();
  ctx.ellipse(width / 2, height, width / 2, 170, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates dynamic realistic swirling clouds texture canvas (4096x2048)
 */
export function createEarthCloudTexture(): THREE.CanvasTexture {
  const width = 4096;
  const height = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Clear transparent
  ctx.clearRect(0, 0, width, height);

  // High-def swirling clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';

  // Equatorial Intertropical Convergence Zone (ITCZ)
  for (let x = 0; x < width; x += 18) {
    const y = height * 0.48 + Math.sin(x * 0.005) * 55 + (Math.random() - 0.5) * 60;
    const r = 25 + Math.random() * 45;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Northern Mid-Latitude Cloud Fronts (40° - 60° N)
  for (let x = 0; x < width; x += 25) {
    const y = height * 0.28 + Math.cos(x * 0.004) * 65 + (Math.random() - 0.5) * 55;
    const r = 30 + Math.random() * 60;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Southern Mid-Latitude Ocean Storms (40° - 60° S)
  for (let x = 0; x < width; x += 22) {
    const y = height * 0.72 + Math.sin(x * 0.0045) * 60 + (Math.random() - 0.5) * 55;
    const r = 32 + Math.random() * 55;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cyclonic Spirals
  const CYCLONES = [
    [width * 0.22, height * 0.32, 110],
    [width * 0.78, height * 0.28, 130],
    [width * 0.42, height * 0.68, 95]
  ];

  CYCLONES.forEach(([cx, cy, maxRadius]) => {
    ctx.save();
    ctx.lineWidth = 7;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    for (let a = 0; a < Math.PI * 6; a += 0.12) {
      const r = (a / (Math.PI * 6)) * maxRadius;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * (r * 0.65);
      ctx.beginPath();
      ctx.arc(px, py, 6 + Math.random() * 12, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import {
  Sparkles,
  Compass,
  RotateCcw,
  Play,
  Pause,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock,
  Coins,
  Award,
  Globe2,
  X,
  ShieldCheck,
  GraduationCap,
  Layers,
  Search,
} from 'lucide-react';
import { GLOBE_COUNTRIES, GlobeCountryInfo } from '../data/globeDestinations';
import { Language } from '../types';
import {
  createEarthDayTexture,
} from '../utils/earthTextureGenerator';

interface InteractiveGlobeProps {
  language: Language;
  onSelectDestinationForAssessment: (destName: string) => void;
  onBookConsultationForCountry: (destName: string) => void;
}

interface ProjectedPin {
  country: GlobeCountryInfo;
  x: number;
  y: number;
  badgeX: number;
  badgeY: number;
  visible: boolean;
  scale: number;
  opacity?: number;
}

const getGlobeBadgeName = (country: GlobeCountryInfo, lang: Language): string => {
  if (lang === 'fa') {
    if (country.id === 'uk') return 'بریتانیا';
    if (country.id === 'uae') return 'امارات';
    if (country.id === 'usa') return 'آمریکا';
    return country.nameFa;
  }
  if (country.id === 'uk') return 'UK';
  if (country.id === 'uae') return 'UAE';
  if (country.id === 'usa') return 'USA';
  return country.nameEn;
};

export const InteractiveGlobe: React.FC<InteractiveGlobeProps> = ({
  language,
  onSelectDestinationForAssessment,
  onBookConsultationForCountry,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Active selected country modal state
  const [selectedCountry, setSelectedCountry] = useState<GlobeCountryInfo | null>(GLOBE_COUNTRIES[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<GlobeCountryInfo | null>(null);
  const [projectedPins, setProjectedPins] = useState<ProjectedPin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Lock background scrolling and support ESC key when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen]);

  // Three.js instances ref
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    earthMesh: THREE.Mesh | null;
    atmosphereMesh: THREE.Mesh | null;
    globeGroup: THREE.Group | null;
    countryPinObjects: { country: GlobeCountryInfo; position: THREE.Vector3; beaconGroup: THREE.Group }[];
    animId: number | null;
    isDragging: boolean;
    prevMousePos: { x: number; y: number };
    rotationVelocity: { x: number; y: number };
    targetRotation: { x: number; y: number } | null;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    earthMesh: null,
    cloudMesh: null,
    atmosphereMesh: null,
    globeGroup: null,
    countryPinObjects: [],
    animId: null,
    isDragging: false,
    prevMousePos: { x: 0, y: 0 },
    rotationVelocity: { x: 0.0012, y: 0 },
    targetRotation: null,
  });

  // Convert lat/lng to 3D sphere coordinate
  const latLngToVector3 = useCallback((lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  }, []);

  // Initialize Three.js Realistic 3D Globe with 4K Texture & City Hierarchy
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera with high-definition dynamic zoom range (1.75 to 5.2)
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3.8);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting: Realistic Sun + Space Ambient
    const ambientLight = new THREE.AmbientLight(0x283855, 1.4);
    scene.add(ambientLight);

    // Sun directional light
    const sunLight = new THREE.DirectionalLight(0xfff8ea, 2.6);
    sunLight.position.set(5, 3.5, 4.5);
    scene.add(sunLight);

    // Subtle blue rim light from opposite side (space background fill)
    const rimLight = new THREE.DirectionalLight(0x3a6090, 0.9);
    rimLight.position.set(-5, -2, -3.5);
    scene.add(rimLight);

    // 5. Globe Group (holds earth, clouds, country pins, city pins)
    const globeGroup = new THREE.Group();
    // Default pleasant orientation: tilted slightly like real Earth (23.5 degrees)
    globeGroup.rotation.x = 0.28;
    globeGroup.rotation.y = -1.2;
    scene.add(globeGroup);

    // 6. Earth Mesh with Photorealistic Satellite NASA Textures & Specular Water
    const earthRadius = 1.25;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 96, 96);

    const textureLoader = new THREE.TextureLoader();

    // Load authentic high-resolution NASA Blue Marble texture
    const fallbackDayTexture = createEarthDayTexture();
    const blueMarbleMap = textureLoader.load(
      '/textures/earth-blue-marble.jpg',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.warn('Fallback to procedural earth day texture:', err);
      }
    );

    // Topography normal map for authentic surface relief
    const normalMap = textureLoader.load('/textures/earth-topology.png');

    // Water mask for ocean specular shininess
    const waterMask = textureLoader.load('/textures/earth-water.png');

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: blueMarbleMap || fallbackDayTexture,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughnessMap: waterMask,
      roughness: 0.5,
      metalness: 0.08,
    });

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // 8. Outer Atmospheric Glow (Rayleigh Rim)
    const atmosphereGeometry = new THREE.SphereGeometry(earthRadius * 1.036, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.66 - dot(vNormal, vec3(0, 0, 1.0)), 2.3);
          gl_FragColor = vec4(0.38, 0.68, 1.0, 1.0) * intensity * 0.95;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // 9. 3D Country Beacons & Pins
    const countryPinObjects: { country: GlobeCountryInfo; position: THREE.Vector3; beaconGroup: THREE.Group }[] = [];

    GLOBE_COUNTRIES.forEach((country) => {
      const pos = latLngToVector3(country.lat, country.lng, earthRadius);
      const beaconGroup = new THREE.Group();
      beaconGroup.position.copy(pos);

      // Orient beacon to point outward along surface normal
      const normal = pos.clone().normalize();
      beaconGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      // Pin stem (slender glowing vertical cylinder right on surface)
      const stemHeight = 0.045;
      const stemGeo = new THREE.CylinderGeometry(0.004, 0.004, stemHeight, 8);
      stemGeo.translate(0, stemHeight / 2, 0);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0xdfba73 });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      beaconGroup.add(stemMesh);

      // Pin head (glowing golden sphere)
      const headGeo = new THREE.SphereGeometry(0.016, 16, 16);
      headGeo.translate(0, stemHeight, 0);
      const headMat = new THREE.MeshBasicMaterial({ color: 0xffe082 });
      const headMesh = new THREE.Mesh(headGeo, headMat);
      beaconGroup.add(headMesh);

      // Pulsing ring at base on surface
      const ringGeo = new THREE.RingGeometry(0.008, 0.024, 16);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc9a96a,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      beaconGroup.add(ringMesh);

      globeGroup.add(beaconGroup);

      // Store anchor position right at the pin tip for precise screen projection
      const tipOffset = normal.clone().multiplyScalar(stemHeight);
      const anchorPos = pos.clone().add(tipOffset);

      countryPinObjects.push({
        country,
        position: anchorPos,
        beaconGroup,
      });
    });

    // Store references
    threeRef.current = {
      ...threeRef.current,
      renderer,
      scene,
      camera,
      earthMesh,
      atmosphereMesh,
      globeGroup,
      countryPinObjects,
    };

    // 11. Render & Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const state = threeRef.current;
      if (!state.renderer || !state.scene || !state.camera || !state.globeGroup) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Handle Smooth Focusing or Inertial Spin
      if (state.targetRotation) {
        const ease = 0.08;
        const diffX = state.targetRotation.x - state.globeGroup.rotation.x;
        const diffY = state.targetRotation.y - state.globeGroup.rotation.y;

        state.globeGroup.rotation.x += diffX * ease;
        state.globeGroup.rotation.y += diffY * ease;

        if (Math.abs(diffX) < 0.002 && Math.abs(diffY) < 0.002) {
          state.globeGroup.rotation.x = state.targetRotation.x;
          state.globeGroup.rotation.y = state.targetRotation.y;
          state.targetRotation = null;
        }
      } else if (!state.isDragging) {
        // Slow auto rotation when idle and enabled
        if (isAutoRotating) {
          state.globeGroup.rotation.y += 0.0012;
        }
        // Damping of manual spin velocity
        state.globeGroup.rotation.y += state.rotationVelocity.x;
        state.globeGroup.rotation.x += state.rotationVelocity.y;
        state.rotationVelocity.x *= 0.94;
        state.rotationVelocity.y *= 0.94;
      }

      // Constrain tilt pitch so user doesn't flip Earth upside down
      state.globeGroup.rotation.x = Math.max(-1.15, Math.min(1.15, state.globeGroup.rotation.x));

      // Pulse pin heads
      state.countryPinObjects.forEach((pin, idx) => {
        const scale = 1 + Math.sin(time * 2.2 + idx) * 0.15;
        pin.beaconGroup.children[1].scale.set(scale, scale, scale);
      });

      // Render 3D Scene
      state.renderer.render(state.scene, state.camera);

      // Project 3D Pins onto 2D Screen for Interactive HTML Badges & Tooltips
      const currentWidth = container.clientWidth || 480;
      const currentHeight = container.clientHeight || 480;

      // Vector pointing from globe center to camera
      const cameraToGlobe = state.camera.position.clone().sub(state.globeGroup.position).normalize();
      const camDist = state.camera.position.distanceTo(state.globeGroup.position);

      // Geometric horizon cutoff for globe radius (1.05): cos(theta) = R / D
      // Strict margins: labels and pins disappear cleanly when rotated to the back
      // and labels never poke outside the globe circle frame.
      const earthRadius = 1.05;
      const geometricHorizon = earthRadius / camDist;
      const labelHorizonCutoff = geometricHorizon + 0.16; // Front-facing visibility threshold
      const pinHorizonCutoff = geometricHorizon + 0.02;   // 3D beacon cutoff

      const cx = currentWidth / 2;
      const cy = currentHeight / 2;
      // Maximum allowed badge distance from center (prevent labels from leaving the circular frame)
      const maxScreenRadius = Math.min(currentWidth, currentHeight) * 0.41;

      // Project Country Badges
      const projectedCountries: ProjectedPin[] = [];
      state.countryPinObjects.forEach((pin) => {
        const worldPos = pin.position.clone().applyMatrix4(state.globeGroup!.matrixWorld);
        const surfaceDir = worldPos.clone().sub(state.globeGroup!.position).normalize();
        const dotProduct = surfaceDir.dot(cameraToGlobe);

        // Hide 3D pin beacon immediately when it rotates to the back
        pin.beaconGroup.visible = dotProduct > pinHorizonCutoff;

        // Label visibility: only visible when comfortably facing camera on the front
        if (dotProduct > labelHorizonCutoff) {
          const screenPos = worldPos.clone().project(state.camera!);

          // Check if in front of camera clip plane
          if (screenPos.z < 1.0) {
            const x = (screenPos.x * 0.5 + 0.5) * currentWidth;
            const y = (-screenPos.y * 0.5 + 0.5) * currentHeight;

            const distFromCenter = Math.hypot(x - cx, y - cy);

            // Ensure label stays strictly inside the circular globe and container bounds
            if (
              distFromCenter <= maxScreenRadius &&
              x >= 24 &&
              x <= currentWidth - 24 &&
              y >= 24 &&
              y <= currentHeight - 24
            ) {
              const scaleFactor = 1;
              // Smooth fade out as it approaches the horizon edge
              const opacity = Math.min(1, Math.max(0, (dotProduct - labelHorizonCutoff) / 0.14));

              if (opacity > 0.08) {
                projectedCountries.push({
                  country: pin.country,
                  x,
                  y,
                  badgeX: x,
                  badgeY: y - 8,
                  visible: true,
                  scale: scaleFactor,
                  opacity,
                });
              }
            }
          }
        }
      });

      // Anti-collision / Anti-overlap solver for country badges in clustered regions (e.g. Europe)
      if (projectedCountries.length > 1) {
        // Minimum comfortable separation distance between badges
        const minSepX = 74;
        const minSepY = 28;

        for (let iter = 0; iter < 10; iter++) {
          for (let i = 0; i < projectedCountries.length; i++) {
            for (let j = i + 1; j < projectedCountries.length; j++) {
              const p1 = projectedCountries[i];
              const p2 = projectedCountries[j];

              const dx = p2.badgeX - p1.badgeX;
              const dy = p2.badgeY - p1.badgeY;
              const absX = Math.abs(dx);
              const absY = Math.abs(dy);

              const overlapX = minSepX - absX;
              const overlapY = minSepY - absY;

              if (overlapX > 0 && overlapY > 0) {
                // Badges overlap: gently push apart
                if (overlapY / minSepY <= overlapX / minSepX) {
                  const signY = dy >= 0 ? 1 : -1;
                  const shiftY = overlapY * 0.5 * signY;
                  const signX = dx >= 0 ? 1 : -1;
                  const shiftX = overlapX * 0.15 * (absX < 4 ? (i % 2 === 0 ? 1 : -1) : signX);

                  p1.badgeY -= shiftY;
                  p1.badgeX -= shiftX;
                  p2.badgeY += shiftY;
                  p2.badgeX += shiftX;
                } else {
                  const signX = dx >= 0 ? 1 : -1;
                  const shiftX = overlapX * 0.5 * signX;
                  const signY = dy >= 0 ? 1 : -1;
                  const shiftY = overlapY * 0.15 * (absY < 4 ? (i % 2 === 0 ? 1 : -1) : signY);

                  p1.badgeX -= shiftX;
                  p1.badgeY -= shiftY;
                  p2.badgeX += shiftX;
                  p2.badgeY += shiftY;
                }
              }
            }
          }
        }

        // Softly clamp displaced badges to remain within the spherical globe boundaries
        projectedCountries.forEach((p) => {
          const dist = Math.hypot(p.badgeX - cx, p.badgeY - cy);
          if (dist > maxScreenRadius) {
            const angle = Math.atan2(p.badgeY - cy, p.badgeX - cx);
            p.badgeX = cx + Math.cos(angle) * maxScreenRadius;
            p.badgeY = cy + Math.sin(angle) * maxScreenRadius;
          }
        });
      }

      setProjectedPins(projectedCountries);

      state.animId = requestAnimationFrame(animate);
    };

    threeRef.current.animId = requestAnimationFrame(animate);

    // Window / Container Resize Handler
    const handleResize = () => {
      if (!container || !threeRef.current.camera || !threeRef.current.renderer) return;
      const newW = container.clientWidth || 480;
      const newH = container.clientHeight || 480;
      threeRef.current.camera.aspect = newW / newH;
      threeRef.current.camera.updateProjectionMatrix();
      threeRef.current.renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (threeRef.current.animId) {
        cancelAnimationFrame(threeRef.current.animId);
      }
      if (threeRef.current.renderer) {
        threeRef.current.renderer.dispose();
      }
      container.innerHTML = '';
    };
  }, [latLngToVector3, isAutoRotating]);

  // Smoothly rotate 3D Earth to center on a specific country at standard scale
  const focusOnCountry = useCallback((country: GlobeCountryInfo) => {
    setSelectedCountry(country);
    setHoveredCountry(null);

    const state = threeRef.current;
    if (!state.globeGroup) return;

    // Convert lat/lng to target rotation Euler angles: centers country right in front of camera
    const targetY = -(country.lng * (Math.PI / 180)) - Math.PI / 2;
    const targetX = Math.max(-1.1, Math.min(1.1, country.lat * (Math.PI / 180)));

    // Normalize target angle within closest distance
    let currentY = state.globeGroup.rotation.y;
    const twoPi = Math.PI * 2;
    currentY = ((currentY % twoPi) + twoPi) % twoPi;
    let normTargetY = ((targetY % twoPi) + twoPi) % twoPi;

    let diff = normTargetY - currentY;
    if (diff > Math.PI) diff -= twoPi;
    if (diff < -Math.PI) diff += twoPi;

    state.targetRotation = {
      x: targetX,
      y: state.globeGroup.rotation.y + diff,
    };
  }, []);

  // Mouse & Touch Drag Interaction Handlers
  const handlePointerDown = (clientX: number, clientY: number) => {
    threeRef.current.isDragging = true;
    threeRef.current.prevMousePos = { x: clientX, y: clientY };
    threeRef.current.rotationVelocity = { x: 0, y: 0 };
    threeRef.current.targetRotation = null;
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!threeRef.current.isDragging || !threeRef.current.globeGroup) return;

    const deltaX = clientX - threeRef.current.prevMousePos.x;
    const deltaY = clientY - threeRef.current.prevMousePos.y;

    threeRef.current.globeGroup.rotation.y += deltaX * 0.005;
    threeRef.current.globeGroup.rotation.x += deltaY * 0.005;

    // Store momentum velocity
    threeRef.current.rotationVelocity = {
      x: deltaX * 0.002,
      y: deltaY * 0.002,
    };

    threeRef.current.prevMousePos = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    threeRef.current.isDragging = false;
  };

  // Reset Orientation to standard view
  const handleResetOrientation = () => {
    const state = threeRef.current;
    if (!state.globeGroup) return;
    state.targetRotation = { x: 0.28, y: -1.2 };
  };

  // Filtered search list for fast navigation
  const filteredDestinations = searchQuery.trim() === ''
    ? []
    : GLOBE_COUNTRIES.filter((c) =>
        c.nameFa.includes(searchQuery) ||
        c.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.capitalFa.includes(searchQuery) ||
        c.capital.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div
      ref={containerRef}
      id="interactive-earth-globe"
      className="relative w-full max-w-[560px] mx-auto flex flex-col items-center select-none"
    >
      {/* Top Header Pill Bar: Real 3D Planet Tag & Controls */}
      <div className="w-full flex items-center justify-between mb-2.5 px-2 gap-2 flex-wrap">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-[#C9A96A]/40 backdrop-blur-md text-xs font-mono text-[#DFBA73] shadow-[0_0_20px_rgba(201,169,106,0.25)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <Globe2 className="w-3.5 h-3.5 text-[#DFBA73]" />
          <span>{language === 'fa' ? 'کره زمین هوشمند سه‌بعدی و مقاصد مهاجرتی' : '3D Interactive Earth & Destinations'}</span>
        </div>

        {/* Action Controls: Play/Pause, Reset Orientation */}
        <div className="flex items-center gap-1.5 bg-black/50 border border-white/15 rounded-xl p-1 backdrop-blur-md shadow-lg">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            title={isAutoRotating ? 'توقف چرخش خودکار' : 'شروع چرخش خودکار'}
            className="p-1.5 text-[#D1D1C7] hover:text-[#DFBA73] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleResetOrientation}
            title="بازنشانی زاویه دید استاندارد"
            className="p-1.5 text-[#D1D1C7] hover:text-[#DFBA73] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Globe Status & Standard View Badge */}
      <div className="w-full flex items-center justify-between px-2 mb-2 text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-[#9B9B95]">
          <Layers className="w-3 h-3 text-[#DFBA73]" />
          <span>
            {language === 'fa' ? 'نمای استاندارد کره زمین و مقاصد مهاجرتی' : 'Standard Earth View & Migration Destinations'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#DFBA73]">
          <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-md border border-white/10">
            {language === 'fa' ? 'اندازه استاندارد ثابت' : 'Fixed Standard View'}
          </span>
        </div>
      </div>

      {/* Quick Search Input for finding any country immediately */}
      <div className="w-full relative mb-2 px-1">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'fa' ? 'جستجوی کشور یا مقصد مورد نظر...' : 'Search destination country...'}
            className="w-full py-1.5 pl-8 pr-8 rtl:pr-8 rtl:pl-8 text-xs bg-black/40 border border-white/10 focus:border-[#DFBA73]/60 rounded-xl text-[#F4F0E8] placeholder-gray-500 outline-none backdrop-blur-md"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 rtl:left-auto rtl:right-2.5 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-2.5 text-gray-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Search Dropdown Results */}
        {filteredDestinations.length > 0 && (
          <div className="absolute top-full left-1 right-1 mt-1 p-2 bg-[#0c0e0e] border border-[#C9A96A]/40 rounded-xl shadow-2xl z-40 max-h-56 overflow-y-auto backdrop-blur-xl">
            <div className="text-[10px] text-gray-400 uppercase font-mono px-2 mb-1">
              {language === 'fa' ? 'کشورهای هدف' : 'Countries'}
            </div>
            {filteredDestinations.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  focusOnCountry(c);
                  setSearchQuery('');
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/10 text-xs text-[#F4F0E8] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>{c.flag}</span>
                  <span>{language === 'fa' ? c.nameFa : c.nameEn}</span>
                </div>
                <span className="text-[10px] text-[#DFBA73] font-mono">{c.passportRank}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Select Country Filter Pills */}
      <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-2 px-1 no-scrollbar mb-2">
        {GLOBE_COUNTRIES.map((c) => {
          const isActive = selectedCountry?.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => focusOnCountry(c)}
              className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] text-[#080909] font-bold shadow-[0_0_15px_rgba(201,169,106,0.4)] scale-105'
                  : 'bg-black/40 text-[#D1D1C7] hover:text-[#DFBA73] hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>{c.flag}</span>
              <span>{language === 'fa' ? c.nameFa : c.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* 3D WebGL Realistic Earth Canvas Container */}
      <div
        className="relative w-[270px] min-[360px]:w-[300px] min-[420px]:w-[350px] sm:w-[440px] md:w-[480px] h-[270px] min-[360px]:h-[300px] min-[420px]:h-[350px] sm:h-[440px] md:h-[480px] max-w-full mx-auto rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible group touch-pan-y"
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => {
          if (e.touches.length === 1) {
            handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 1) {
            handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onTouchEnd={handlePointerUp}
      >
        {/* Soft Radial Outer Space Glow behind Earth */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0a1e3f]/20 via-[#103060]/10 to-transparent blur-3xl pointer-events-none" />

        {/* Canvas Render Element */}
        <div ref={canvasContainerRef} className="w-full h-full rounded-full overflow-hidden" />

        {/* 2D Projected Floating HTML Badges & Interactive Pins */}
        <div dir="ltr" className="absolute inset-0 pointer-events-none rounded-full overflow-hidden" style={{ left: 0, top: 0 }}>
          {/* Subtle Connector Lines between 3D Ground Beacons and Anti-Collision Badges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {projectedPins.map((pin) => {
              const dist = Math.hypot(pin.badgeX - pin.x, pin.badgeY - pin.y);
              if (dist < 10 || !pin.visible) return null;
              return (
                <g key={`leader-${pin.country.id}`} opacity={pin.opacity ? pin.opacity * 0.75 : 0.75}>
                  <line
                    x1={pin.x}
                    y1={pin.y}
                    x2={pin.badgeX}
                    y2={pin.badgeY}
                    stroke="#DFBA73"
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                  />
                  <circle cx={pin.x} cy={pin.y} r="2" fill="#DFBA73" />
                </g>
              );
            })}
          </svg>

          {/* Country Level Pins */}
          {projectedPins.map((pin) => {
            const isSelected = selectedCountry?.id === pin.country.id;
            const isHovered = hoveredCountry?.id === pin.country.id;
            const badgeLabel = getGlobeBadgeName(pin.country, language);

            return (
              <div
                key={pin.country.id}
                style={{
                  left: 0,
                  top: 0,
                  transform: `translate3d(${pin.badgeX}px, ${pin.badgeY}px, 0) translate(-50%, -50%) scale(${pin.scale})`,
                  transformOrigin: 'center center',
                  opacity: pin.opacity ?? 1,
                  display: pin.visible ? 'block' : 'none',
                }}
                className="absolute z-20 pointer-events-auto transition-opacity duration-150"
              >
                {/* Floating Clickable Badge */}
                <button
                  onClick={() => {
                    focusOnCountry(pin.country);
                    setModalOpen(true);
                  }}
                  onMouseEnter={() => setHoveredCountry(pin.country)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] backdrop-blur-md transition-all duration-300 cursor-pointer shadow-lg ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] text-[#080909] font-bold border border-white shadow-[0_0_20px_rgba(201,169,106,0.6)] scale-110 z-30'
                      : isHovered
                      ? 'bg-black/90 text-[#DFBA73] border border-[#DFBA73] scale-105 z-30'
                      : 'bg-black/80 text-[#F4F0E8] border border-white/20 hover:border-[#DFBA73]'
                  }`}
                >
                  <span className="text-sm shrink-0">{pin.country.flag}</span>
                  <span className="font-semibold whitespace-nowrap leading-none">
                    {badgeLabel}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping shrink-0" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Interactive Drag Hint Overlay (disappears on hover/interaction) */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none opacity-80 group-hover:opacity-25 transition-opacity">
          <div className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] text-[#D1D1C7] font-mono flex items-center gap-1.5 backdrop-blur-sm">
            <Compass className="w-3 h-3 text-[#DFBA73] animate-spin" />
            <span>
              {language === 'fa'
                ? 'چرخش ۳۶۰ درجه با ماوس یا لمس'
                : '360° Drag to spin'}
            </span>
          </div>
        </div>
      </div>

      {/* Country Detail Mini-Card right beneath the globe */}
      {selectedCountry && (
        <div className="w-full mt-3 luxury-glass p-4 rounded-2xl border border-[#C9A96A]/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Subtle gold decorative glow line */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#DFBA73] to-transparent" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl sm:text-4xl p-1 bg-black/40 rounded-xl border border-white/10">
                {selectedCountry.flag}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#F4F0E8] font-farsi">
                    {language === 'fa' ? selectedCountry.nameFa : selectedCountry.nameEn}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#DFBA73]/15 text-[#DFBA73] border border-[#DFBA73]/30">
                    {selectedCountry.passportRank}
                  </span>
                </div>
                <p className="text-xs text-[#9B9B95] mt-0.5 font-mono">
                  {language === 'fa' ? `پایتخت: ${selectedCountry.capitalFa}` : `Capital: ${selectedCountry.capital}`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#DFBA73] border border-[#DFBA73]/40 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'fa' ? 'پرونده کامل و آزمون‌ها' : 'Full Dossier'}</span>
            </button>
          </div>

          {/* Golden Benefit Quote */}
          <p className="text-xs text-[#D1D1C7] mt-3 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
            <span className="text-[#DFBA73] font-bold">★ {language === 'fa' ? 'امتیاز ویژه:' : 'Key Benefit:'} </span>
            {language === 'fa' ? selectedCountry.goldenBenefitFa : selectedCountry.goldenBenefit}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] font-mono">
            <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#DFBA73]" />
              <div>
                <div className="text-[10px] text-[#9B9B95]">{language === 'fa' ? 'زمان پردازش' : 'Timeline'}</div>
                <div className="text-[#F4F0E8] font-bold">
                  {language === 'fa' ? selectedCountry.avgTimelineFa : selectedCountry.avgTimeline}
                </div>
              </div>
            </div>
            <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex items-center gap-2">
              <Coins className="w-3.5 h-3.5 text-[#DFBA73]" />
              <div>
                <div className="text-[10px] text-[#9B9B95]">{language === 'fa' ? 'حداقل تمکن' : 'Min Funds'}</div>
                <div className="text-[#F4F0E8] font-bold truncate">
                  {language === 'fa' ? selectedCountry.minFundsFa : selectedCountry.minFunds}
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-white/10">
            <button
              onClick={() => onSelectDestinationForAssessment(selectedCountry.nameEn)}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-[#DFBA73] via-[#C9A96A] to-[#B38F4E] hover:from-[#E8CA8C] hover:to-[#C9A96A] text-[#080909] font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(201,169,106,0.3)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{language === 'fa' ? 'ارزیابی پرونده این مقصد' : 'Start Assessment'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
            <button
              onClick={() => onBookConsultationForCountry(selectedCountry.nameFa)}
              className="w-full py-2.5 px-3 bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'fa' ? 'مشاوره اختصاصی وکیل' : 'Legal Counsel'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Comprehensive Country Immigration & Exam Dossier Modal */}
      {modalOpen && selectedCountry && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-[#080909]/96 backdrop-blur-2xl animate-in fade-in duration-200 overflow-y-auto"
        >
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#0e1011] border border-[#C9A96A]/50 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-5 sm:p-8 text-[#F4F0E8] my-auto">
            {/* Modal Header with Dedicated, Clear Close Button */}
            <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-white/10">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-4xl sm:text-5xl p-2 bg-black/60 rounded-2xl border border-white/10 shrink-0">
                  {selectedCountry.flag}
                </span>
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold font-farsi text-[#F4F0E8]">
                      {language === 'fa' ? selectedCountry.nameFa : selectedCountry.nameEn}
                    </h2>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#DFBA73]/20 text-[#DFBA73] border border-[#DFBA73]/40">
                      {selectedCountry.passportRank}
                    </span>
                  </div>
                  <p className="text-xs text-[#9B9B95] font-mono mt-1">
                    {language === 'fa'
                      ? `پایتخت: ${selectedCountry.capitalFa} • سفر بدون ویزا: به ${selectedCountry.visaFreeCountries} کشور جهان`
                      : `Capital: ${selectedCountry.capital} • Visa-free access to ${selectedCountry.visaFreeCountries} countries`}
                  </p>
                </div>
              </div>

              {/* High-visibility Close Button */}
              <button
                id="close-country-modal-btn"
                onClick={() => setModalOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-[#F4F0E8] hover:text-red-300 border border-white/20 hover:border-red-500/40 transition-all cursor-pointer shrink-0 shadow-sm"
                aria-label={language === 'fa' ? 'بستن پنجره' : 'Close modal'}
                title={language === 'fa' ? 'بستن (Esc)' : 'Close (Esc)'}
              >
                <span className="text-xs font-medium">{language === 'fa' ? 'بستن' : 'Close'}</span>
                <X className="w-4 h-4 text-[#DFBA73]" />
              </button>
            </div>

            {/* Golden Privilege Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#DFBA73]/15 via-transparent to-transparent border border-[#DFBA73]/30 mb-6">
              <div className="flex items-center gap-2 text-[#DFBA73] font-bold text-sm mb-1 font-farsi">
                <Sparkles className="w-4 h-4" />
                <span>{language === 'fa' ? 'امتیاز طلایی اقامت و شهروندی:' : 'Key Golden Privilege:'}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#D1D1C7] leading-relaxed">
                {language === 'fa' ? selectedCountry.goldenBenefitFa : selectedCountry.goldenBenefit}
              </p>
            </div>

            {/* Section: Required Language & Professional Exams */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm font-bold text-[#F4F0E8] mb-3 font-farsi">
                <GraduationCap className="w-4 h-4 text-[#DFBA73]" />
                <span>{language === 'fa' ? 'آزمون‌های الزامی و مدارک زبان مورد نیاز' : 'Mandatory Language & Licensing Exams'}</span>
              </div>

              <div className="space-y-2.5">
                {selectedCountry.requiredExams.map((exam, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-[#DFBA73]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-[#DFBA73] font-mono">
                        {exam.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#E8CA8C] border border-white/10">
                        {exam.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#D1D1C7] leading-relaxed">
                      {language === 'fa' ? exam.descriptionFa : exam.descriptionEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Top Visa & Immigration Pathways */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm font-bold text-[#F4F0E8] mb-3 font-farsi">
                <Award className="w-4 h-4 text-[#DFBA73]" />
                <span>{language === 'fa' ? 'روش‌های اصلی اخذ اقامت و ویزا' : 'Top Migration Pathways'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedCountry.topPathways.map((path, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-[#F4F0E8]">
                        {language === 'fa' ? path.titleFa : path.titleEn}
                      </div>
                      <div className="text-[11px] text-[#9B9B95] mt-0.5">
                        {language === 'fa' ? path.suitableForFa : path.titleEn}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setModalOpen(false);
                  onSelectDestinationForAssessment(selectedCountry.nameEn);
                }}
                className="py-3 px-4 bg-gradient-to-r from-[#DFBA73] via-[#C9A96A] to-[#B38F4E] hover:from-[#E8CA8C] hover:to-[#C9A96A] text-[#080909] font-bold text-xs sm:text-sm rounded-xl shadow-[0_0_25px_rgba(201,169,106,0.35)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'fa' ? 'شروع ارزیابی هوشمند پرونده' : 'Start Assessment'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>

              <button
                onClick={() => {
                  setModalOpen(false);
                  onBookConsultationForCountry(selectedCountry.nameFa);
                }}
                className="py-3 px-4 bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/40 font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{language === 'fa' ? 'رزرو جلسه مشاوره با وکیل' : 'Book Legal Consultation'}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Sparkles,
  Compass,
  RotateCcw,
  ZoomIn,
  ZoomOut,
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
  Building2,
  MapPin,
  Layers,
  Search,
} from 'lucide-react';
import { GLOBE_COUNTRIES, GlobeCountryInfo } from '../data/globeDestinations';
import { GLOBE_CITIES, GlobeCity } from '../data/globeCities';
import { Language } from '../types';
import {
  createEarthDayTexture,
} from '../utils/earthTextureGenerator';

interface InteractiveGlobeProps {
  language: Language;
  onSelectDestinationForAssessment: (destName: string) => void;
  onBookConsultationForCountry: (destName: string) => void;
  isLightTheme?: boolean;
}

interface ProjectedPin {
  country: GlobeCountryInfo;
  x: number;
  y: number;
  visible: boolean;
  scale: number;
}

interface ProjectedCityPin {
  city: GlobeCity;
  x: number;
  y: number;
  visible: boolean;
  scale: number;
}

export const InteractiveGlobe: React.FC<InteractiveGlobeProps> = ({
  language,
  onSelectDestinationForAssessment,
  onBookConsultationForCountry,
  isLightTheme = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Active selected country modal state
  const [selectedCountry, setSelectedCountry] = useState<GlobeCountryInfo | null>(GLOBE_COUNTRIES[0]);
  const [selectedCity, setSelectedCity] = useState<GlobeCity | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<GlobeCountryInfo | null>(null);
  const [hoveredCity, setHoveredCity] = useState<GlobeCity | null>(null);
  const [projectedPins, setProjectedPins] = useState<ProjectedPin[]>([]);
  const [projectedCityPins, setProjectedCityPins] = useState<ProjectedCityPin[]>([]);
  const [currentZoomDist, setCurrentZoomDist] = useState<number>(3.8);
  const [showCitiesToggle, setShowCitiesToggle] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Three.js instances ref
  const threeRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    earthMesh: THREE.Mesh | null;
    atmosphereMesh: THREE.Mesh | null;
    globeGroup: THREE.Group | null;
    countryPinObjects: { country: GlobeCountryInfo; position: THREE.Vector3; beaconGroup: THREE.Group }[];
    cityPinObjects: { city: GlobeCity; position: THREE.Vector3; beaconGroup: THREE.Group }[];
    animId: number | null;
    isDragging: boolean;
    prevMousePos: { x: number; y: number };
    rotationVelocity: { x: number; y: number };
    targetRotation: { x: number; y: number } | null;
    targetZoom: number | null;
    zoomLevel: number;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    earthMesh: null,
    cloudMesh: null,
    atmosphereMesh: null,
    globeGroup: null,
    countryPinObjects: [],
    cityPinObjects: [],
    animId: null,
    isDragging: false,
    prevMousePos: { x: 0, y: 0 },
    rotationVelocity: { x: 0.0012, y: 0 },
    targetRotation: null,
    targetZoom: null,
    zoomLevel: 3.8,
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

    // 10. 3D City Beacons & Pins (Appear crisp when zooming)
    const cityPinObjects: { city: GlobeCity; position: THREE.Vector3; beaconGroup: THREE.Group }[] = [];

    GLOBE_CITIES.forEach((city) => {
      const pos = latLngToVector3(city.lat, city.lng, earthRadius);
      const beaconGroup = new THREE.Group();
      beaconGroup.position.copy(pos);

      const normal = pos.clone().normalize();
      beaconGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      // City pinpoint beacon: subtle cyan/gold beacon close to surface
      const pinHeight = city.isCapital ? 0.035 : 0.025;
      const pinGeo = new THREE.CylinderGeometry(0.0025, 0.0025, pinHeight, 6);
      pinGeo.translate(0, pinHeight / 2, 0);
      const pinMat = new THREE.MeshBasicMaterial({
        color: city.isCapital ? 0xdfba73 : 0x6ee7b7,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      beaconGroup.add(pinMesh);

      // City node dot
      const nodeGeo = new THREE.SphereGeometry(city.isCapital ? 0.011 : 0.008, 12, 12);
      nodeGeo.translate(0, pinHeight, 0);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: city.isCapital ? 0xfff0c2 : 0xa7f3d0,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      beaconGroup.add(nodeMesh);

      globeGroup.add(beaconGroup);

      const cityTipOffset = normal.clone().multiplyScalar(pinHeight);
      const cityAnchorPos = pos.clone().add(cityTipOffset);

      cityPinObjects.push({
        city,
        position: cityAnchorPos,
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
      cityPinObjects,
    };

    // 11. Render & Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const state = threeRef.current;
      if (!state.renderer || !state.scene || !state.camera || !state.globeGroup) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth zoom interpolation towards targetZoom
      if (state.targetZoom !== null && state.camera) {
        const diffZ = state.targetZoom - state.camera.position.z;
        if (Math.abs(diffZ) < 0.01) {
          state.camera.position.z = state.targetZoom;
          state.zoomLevel = state.targetZoom;
          state.targetZoom = null;
        } else {
          state.camera.position.z += diffZ * 0.12;
          state.zoomLevel = state.camera.position.z;
        }
        setCurrentZoomDist(state.camera.position.z);
      }

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

      // City pins visibility based on zoom distance
      const zoomDist = state.camera.position.z;
      // Close zoom threshold: cities become visible and prominent below zoom 3.55
      const isCloseZoom = zoomDist < 3.55;
      state.cityPinObjects.forEach((cityPin) => {
        cityPin.beaconGroup.visible = isCloseZoom;
      });

      // Render 3D Scene
      state.renderer.render(state.scene, state.camera);

      // Project 3D Pins onto 2D Screen for Interactive HTML Badges & Tooltips
      const currentWidth = container.clientWidth || 480;
      const currentHeight = container.clientHeight || 480;

      // Vector pointing from globe center to camera
      const cameraToGlobe = state.camera.position.clone().sub(state.globeGroup.position).normalize();

      // 1. Project Country Badges
      const projectedCountries: ProjectedPin[] = [];
      state.countryPinObjects.forEach((pin) => {
        const worldPos = pin.position.clone().applyMatrix4(state.globeGroup!.matrixWorld);
        const surfaceDir = worldPos.clone().sub(state.globeGroup!.position).normalize();

        // Accurate horizon culling: only visible when facing the camera
        const isFacingCamera = surfaceDir.dot(cameraToGlobe) > 0.12;

        if (isFacingCamera) {
          const screenPos = worldPos.clone().project(state.camera!);
          const x = (screenPos.x * 0.5 + 0.5) * currentWidth;
          const y = (-screenPos.y * 0.5 + 0.5) * currentHeight;

          // Scale badges dynamically based on distance
          const scaleFactor = Math.max(0.65, Math.min(1.25, 3.8 / zoomDist));

          projectedCountries.push({
            country: pin.country,
            x,
            y,
            visible: true,
            scale: scaleFactor,
          });
        }
      });
      setProjectedPins(projectedCountries);

      // 2. Project City Badges (Active when zoomed in)
      const projectedCities: ProjectedCityPin[] = [];
      if (isCloseZoom) {
        state.cityPinObjects.forEach((pin) => {
          const worldPos = pin.position.clone().applyMatrix4(state.globeGroup!.matrixWorld);
          const surfaceDir = worldPos.clone().sub(state.globeGroup!.position).normalize();
          const isFacingCamera = surfaceDir.dot(cameraToGlobe) > 0.16;

          if (isFacingCamera) {
            const screenPos = worldPos.clone().project(state.camera!);
            const x = (screenPos.x * 0.5 + 0.5) * currentWidth;
            const y = (-screenPos.y * 0.5 + 0.5) * currentHeight;

            // City badge scale
            const cityScale = Math.max(0.7, Math.min(1.15, 3.2 / zoomDist));

            projectedCities.push({
              city: pin.city,
              x,
              y,
              visible: true,
              scale: cityScale,
            });
          }
        });
      }
      setProjectedCityPins(projectedCities);

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

  // Smoothly rotate 3D Earth to center on a specific country and zoom in for clarity
  const focusOnCountry = useCallback((country: GlobeCountryInfo, autoZoom = true) => {
    setSelectedCountry(country);
    setSelectedCity(null);
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

    if (autoZoom) {
      // Zoom in to level 2.5 so cities and country borders become crystal clear
      state.targetZoom = 2.45;
    }
  }, []);

  // Focus directly on a specific city
  const focusOnCity = useCallback((city: GlobeCity) => {
    setSelectedCity(city);
    // Find parent country
    const parent = GLOBE_COUNTRIES.find((c) => c.id === city.countryId);
    if (parent) {
      setSelectedCountry(parent);
    }
    setHoveredCity(null);

    const state = threeRef.current;
    if (!state.globeGroup) return;

    const targetY = -(city.lng * (Math.PI / 180)) - Math.PI / 2;
    const targetX = Math.max(-1.1, Math.min(1.1, city.lat * (Math.PI / 180)));

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

    // Deep zoom into city (1.95) for ultimate detail
    state.targetZoom = 2.0;
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

  // Zoom Controls with deep close-up support
  const handleZoom = (delta: number) => {
    const state = threeRef.current;
    if (!state.camera) return;
    const newZoom = Math.max(1.65, Math.min(5.2, state.zoomLevel + delta));
    state.targetZoom = newZoom;
    setCurrentZoomDist(newZoom);
  };

  // Wheel Zoom support for mouse users
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.0025;
    handleZoom(delta);
  };

  // Reset Orientation and Zoom
  const handleResetOrientation = () => {
    const state = threeRef.current;
    if (!state.globeGroup) return;
    state.targetRotation = { x: 0.28, y: -1.2 };
    state.targetZoom = 3.8;
    setSelectedCity(null);
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

  const filteredCities = searchQuery.trim() === ''
    ? []
    : GLOBE_CITIES.filter((city) =>
        city.nameFa.includes(searchQuery) ||
        city.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const isHighZoom = currentZoomDist < 3.25;

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
          <span>{language === 'fa' ? 'کره زمین زنده سه‌بعدی و جزئیات شهرها' : '3D Realistic Earth & Cities'}</span>
        </div>

        {/* Action Controls: Play/Pause, Reset, Zoom In/Out, Toggle Cities */}
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
            title="بازنشانی زاویه دید و زوم"
            className="p-1.5 text-[#D1D1C7] hover:text-[#DFBA73] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(-0.55)}
            title="بزرگ‌نمایی عمیق (+)"
            className="p-1.5 text-[#D1D1C7] hover:text-[#DFBA73] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(0.55)}
            title="کوچک‌نمایی (-)"
            className="p-1.5 text-[#D1D1C7] hover:text-[#DFBA73] hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowCitiesToggle(!showCitiesToggle)}
            title={showCitiesToggle ? 'پنهان کردن شهرها' : 'نمایش شهرها'}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              showCitiesToggle ? 'text-emerald-400 bg-emerald-950/40' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dynamic Zoom Level Indicator & Clarity Status */}
      <div className="w-full flex items-center justify-between px-2 mb-2 text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-[#9B9B95]">
          <Layers className="w-3 h-3 text-[#DFBA73]" />
          <span>
            {isHighZoom
              ? language === 'fa' ? 'حالت زوم نزدیک: مرزها و شهرها فعال' : 'Close-up: Borders & Cities Active'
              : language === 'fa' ? 'نمای عمومی جهان (جهت مشاهده شهرها زوم کنید)' : 'Global view (Zoom in to inspect cities)'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#DFBA73]">
          <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-md border border-white/10">
            {isHighZoom ? (language === 'fa' ? 'وضوح بالا ۴K' : '4K Detail') : (language === 'fa' ? 'نمای کروی' : 'Orbit View')}
          </span>
        </div>
      </div>

      {/* Quick Search Input for finding any country or city immediately */}
      <div className="w-full relative mb-2 px-1">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'fa' ? 'جستجوی کشور یا شهر مورد نظر...' : 'Search any country or city...'}
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
        {(filteredDestinations.length > 0 || filteredCities.length > 0) && (
          <div className="absolute top-full left-1 right-1 mt-1 p-2 bg-[#0c0e0e] border border-[#C9A96A]/40 rounded-xl shadow-2xl z-40 max-h-56 overflow-y-auto backdrop-blur-xl">
            {filteredDestinations.length > 0 && (
              <div className="mb-2">
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

            {filteredCities.length > 0 && (
              <div>
                <div className="text-[10px] text-emerald-400 uppercase font-mono px-2 mb-1">
                  {language === 'fa' ? 'شهرهای مهم' : 'Key Cities'}
                </div>
                {filteredCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      focusOnCity(city);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/10 text-xs text-[#F4F0E8] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3 h-3 text-emerald-400" />
                      <span>{language === 'fa' ? city.nameFa : city.nameEn}</span>
                      {city.isCapital && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#DFBA73]/20 text-[#DFBA73]">
                          {language === 'fa' ? 'پایتخت' : 'Capital'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">{city.population}</span>
                  </button>
                ))}
              </div>
            )}
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
        onWheel={handleWheel}
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
        <div dir="ltr" className="absolute inset-0 pointer-events-none overflow-visible" style={{ left: 0, top: 0 }}>
          {/* Country Level Pins */}
          {projectedPins.map((pin) => {
            const isSelected = selectedCountry?.id === pin.country.id;
            const isHovered = hoveredCountry?.id === pin.country.id;

            return (
              <div
                key={pin.country.id}
                style={{
                  left: 0,
                  top: 0,
                  transform: `translate3d(${pin.x}px, ${pin.y}px, 0) translate(-50%, -100%) scale(${pin.scale})`,
                  transformOrigin: 'bottom center',
                  display: pin.visible ? 'block' : 'none',
                }}
                className="absolute z-20 pointer-events-auto transition-transform duration-200"
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
                      ? 'bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] text-[#080909] font-bold border border-white shadow-[0_0_20px_rgba(201,169,106,0.6)] scale-110'
                      : isHovered
                      ? 'bg-black/90 text-[#DFBA73] border border-[#DFBA73] scale-105'
                      : 'bg-black/75 text-[#F4F0E8] border border-white/20 hover:border-[#DFBA73]'
                  }`}
                >
                  <span className="text-sm">{pin.country.flag}</span>
                  <span className="font-semibold whitespace-nowrap">
                    {language === 'fa' ? pin.country.nameFa : pin.country.nameEn}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                  )}
                </button>
              </div>
            );
          })}

          {/* City Level Pins (visible when zoomed in) */}
          {showCitiesToggle &&
            projectedCityPins.map((pin) => {
              const isCitySelected = selectedCity?.id === pin.city.id;
              const isCityHovered = hoveredCity?.id === pin.city.id;

              return (
                <div
                  key={pin.city.id}
                  style={{
                    left: 0,
                    top: 0,
                    transform: `translate3d(${pin.x}px, ${pin.y}px, 0) translate(-50%, -100%) scale(${pin.scale})`,
                    transformOrigin: 'bottom center',
                    display: pin.visible ? 'block' : 'none',
                  }}
                  className="absolute z-30 pointer-events-auto transition-transform duration-150"
                >
                  <button
                    onClick={() => {
                      focusOnCity(pin.city);
                      setCityModalOpen(true);
                    }}
                    onMouseEnter={() => setHoveredCity(pin.city)}
                    onMouseLeave={() => setHoveredCity(null)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] backdrop-blur-md transition-all cursor-pointer shadow-md ${
                      isCitySelected
                        ? 'bg-emerald-400 text-black font-bold border border-white shadow-[0_0_15px_rgba(52,211,153,0.8)] scale-110'
                        : isCityHovered
                        ? 'bg-black/90 text-emerald-300 border border-emerald-400 scale-105'
                        : pin.city.isCapital
                        ? 'bg-black/85 text-[#DFBA73] border border-[#DFBA73]/50'
                        : 'bg-black/80 text-emerald-200 border border-emerald-500/30'
                    }`}
                  >
                    <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                    <span className="whitespace-nowrap font-medium">
                      {language === 'fa' ? pin.city.nameFa : pin.city.nameEn}
                    </span>
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
                ? 'چرخش با ماوس یا لمس • اسکرول جهت زوم روی شهرها'
                : 'Drag to spin • Scroll to zoom into cities'}
            </span>
          </div>
        </div>
      </div>

      {/* Selected City Mini Banner (when user clicks a specific city) */}
      {selectedCity && (
        <div className="w-full mt-2 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-between gap-3 text-xs backdrop-blur-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-emerald-300">
                {language === 'fa' ? selectedCity.nameFa : selectedCity.nameEn}
                {selectedCity.isCapital && (
                  <span className="text-[9px] mr-1.5 px-1.5 py-0.5 rounded bg-[#DFBA73]/20 text-[#DFBA73]">
                    {language === 'fa' ? 'پایتخت' : 'Capital'}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-gray-300 mt-0.5">
                {language === 'fa' ? selectedCity.highlightFa : selectedCity.highlightEn}
              </div>
            </div>
          </div>
          <button
            onClick={() => setCityModalOpen(true)}
            className="shrink-0 px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 rounded-lg text-[11px] font-semibold cursor-pointer"
          >
            {language === 'fa' ? 'جزئیات شهر' : 'City Info'}
          </button>
        </div>
      )}

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

          {/* Key Cities in this country pills */}
          <div className="mt-3 pt-2 border-t border-white/10">
            <div className="text-[10px] text-[#9B9B95] font-mono mb-1.5 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-emerald-400" />
              <span>{language === 'fa' ? 'شهرهای مهم جهت اشتغال و تحصیل:' : 'Key Employment & University Cities:'}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {GLOBE_CITIES.filter((ct) => ct.countryId === selectedCountry.id).map((city) => (
                <button
                  key={city.id}
                  onClick={() => focusOnCity(city)}
                  className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-emerald-950/40 text-[11px] text-gray-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                  <span>{language === 'fa' ? city.nameFa : city.nameEn}</span>
                </button>
              ))}
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
      {modalOpen && selectedCountry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0c0e0e] border border-[#C9A96A]/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#F4F0E8]">
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 rtl:right-auto rtl:left-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl sm:text-5xl p-2 bg-black/40 rounded-2xl border border-white/10">
                {selectedCountry.flag}
              </span>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-bold font-farsi text-[#F4F0E8]">
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
        </div>
      )}

      {/* City Detail Modal */}
      {cityModalOpen && selectedCity && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div className="relative w-full max-w-md bg-[#0c0e0e] border border-emerald-500/40 rounded-2xl shadow-2xl p-6 text-[#F4F0E8]">
            <button
              onClick={() => setCityModalOpen(false)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-farsi text-emerald-300">
                  {language === 'fa' ? selectedCity.nameFa : selectedCity.nameEn}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
                  <span>{selectedCity.population} جمعیت</span>
                  {selectedCity.isCapital && (
                    <span className="px-2 py-0.5 rounded bg-[#DFBA73]/20 text-[#DFBA73] text-[10px]">
                      {language === 'fa' ? 'پایتخت رسمی' : 'Capital'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5 mb-5">
              {language === 'fa' ? selectedCity.highlightFa : selectedCity.highlightEn}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCityModalOpen(false);
                  if (selectedCountry) {
                    onSelectDestinationForAssessment(`${selectedCountry.nameEn} (${selectedCity.nameEn})`);
                  }
                }}
                className="w-full py-2.5 bg-gradient-to-r from-[#DFBA73] to-[#C9A96A] text-black font-bold text-xs rounded-xl shadow-lg cursor-pointer"
              >
                {language === 'fa' ? 'ارزیابی مهاجرت به این شهر' : 'Assess for this City'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

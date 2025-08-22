// assets/js/homescreen.js

import { displayError } from './errors.js';

export async function loadHomeScreen(container) {
  try {
    // Inject CSS first to prevent FOUC (Flash of Unstyled Content)
    injectHomeCSS();

    // Add viewport meta tag to prevent zooming and manage screen size
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

    container.innerHTML = `
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>

      <div id="homescreen-background"></div>
      <div id="home-screen">
        <div id="top-header-pill">
          <div class="time-display">08:51</div>
          <div id="profile-container">
            <div id="agent-icon"></div>
            <span class="username">AgentX</span>
            <div id="clearance-tag">
              <div class="clearance-level">Level 1</div>
            </div>
          </div>
          <div id="currency-pill">
            <span class="currency">₿ 0</span>
            <span class="currency">Ξ 0</span>
          </div>
        </div>

        <div id="main-content">
          <div id="live-map-card">
            <div id="map"></div>
          </div>
          
          <div id="mission-card-section">
            <div id="mission-bg-blur"></div>
            <div id="app-cards-container">
              <div class="app-card" data-bg-image="assets/images/IMG_8857.jpeg">
                <div class="app-card-content">
                  <div class="fade-overlay"></div>
                  <div class="card-text">
                    <div class="card-title-badge">INTEL</div>
                    <div class="card-subtitle">Locate Stolen Nuke Codes</div>
                  </div>
                </div>
              </div>
              <div class="app-card" data-bg-image="assets/images/IMG_8858.jpeg">
                <div class="app-card-content">
                  <div class="fade-overlay"></div>
                  <div class="card-text">
                    <div class="card-title-badge">OP</div>
                    <div class="card-subtitle">Rogue Asset Extraction</div>
                  </div>
                </div>
              </div>
              <div class="app-card" data-bg-image="https://images.unsplash.com/photo-1603145731082-2e16b6d4a3f2?auto=format&fit=crop&w=400&q=80">
                <div class="app-card-content">
                  <div class="fade-overlay"></div>
                  <div class="card-text">
                    <div class="card-title-badge">DATA</div>
                    <div class="card-subtitle">Decrypt Encrypted Data</div>
                  </div>
                </div>
              </div>
              <div class="app-card" data-bg-image="https://images.unsplash.com/photo-1603570322020-0b16eaf89335?auto=format&fit=crop&w=400&q=80">
                <div class="app-card-content">
                  <div class="fade-overlay"></div>
                  <div class="card-text">
                    <div class="card-title-badge">INTEL</div>
                    <div class="card-subtitle">Cyber Warfare Defense</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="section-container">
            <h2>Ongoing Missions</h2>
            <div id="ongoing-missions-container">
              <div class="ongoing-mission-card">
                <div class="mission-header">
                  <h3>Operation Blacklight</h3>
                  <span class="mission-timer">02:34:12</span>
                </div>
                <div class="mission-details">
                  <span class="mission-stage">Stage 2: </span>
                  <span class="current-task">Data Exfiltration</span>
                </div>
              </div>
              <div class="ongoing-mission-card">
                <div class="mission-header">
                  <h3>Project Chimera</h3>
                  <span class="mission-timer">00:15:45</span>
                </div>
                <div class="mission-details">
                  <span class="mission-stage">Stage 1: </span>
                  <span class="current-task">Asset Recon</span>
                </div>
              </div>
              <div class="ongoing-mission-card">
                <div class="mission-header">
                  <h3>Project Nightfall</h3>
                  <span class="mission-timer">01:05:21</span>
                </div>
                <div class="mission-details">
                  <span class="mission-stage">Stage 3: </span>
                  <span class="current-task">Hostile Neutralization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div id="bottom-nav">
          <div class="nav-item active">
            <span class="nav-icon">⌂</span>
            <span class="nav-label">Home</span>
          </div>
          <div class="nav-item">
            <span class="nav-icon">⎈</span>
            <span class="nav-label">Wallet</span>
          </div>
          <div class="nav-item">
            <span class="nav-icon">⚙︎</span>
            <span class="nav-label">Settings</span>
          </div>
        </div>
      </div>
    `;

    setupLiveMap();
    setupMissionCardBackground();
    setupCarousel();
    setupCardAnimations();

    const homeScreen = container.querySelector('#home-screen');
    if (!homeScreen) throw new Error('Header or home screen element not found.');
    homeScreen.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => { homeScreen.style.opacity = '1'; }, 10);
  } catch (err) {
    displayError(`Failed to load home screen: ${err.message}`, 'HomeScreen', 'ERR_HOMESCR');
  }
}

function setupLiveMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  const map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false
  }).setView([20, 0], 2);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    minZoom: 1
  }).addTo(map);

  // Define custom icons
  const planeIcon = L.icon({
    iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f0a040"><path d="M10 2a8 8 0 018 8c0 1.25-.2 2.45-.58 3.53L22 19.14V22h-2.86l-5.61-5.61A8 8 0 1110 2zm0 2a6 6 0 100 12A6 6 0 0010 4z"/></svg>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  const satelliteIcon = L.icon({
    iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2334c759"><path d="M12 2A10 10 0 1012 22a10 10 0 000-20zm0 2a8 8 0 110 16A8 8 0 0112 4zm-1 2.5a.5.5 0 101 0v-1a.5.5 0 10-1 0v1zM11.5 7h1v1.5h-1V7zm0 2.5h1v1.5h-1V9.5zm0 2.5h1v1.5h-1v-1.5zM11.5 14h1v1.5h-1V14zm0 2.5h1v1.5h-1v-1.5zM11.5 19h1v1.5h-1V19zM11.5 2h1v1.5h-1V2zm0 2.5h1v1.5h-1V4.5z"/></svg>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
  
  // --- Start of New Code for Live Lighting ---
  
  // Define custom icon for the lighting points
  const lightIcon = L.divIcon({
    className: 'city-light-glow',
    html: '',
    iconSize: [20, 20]
  });

  // A simple, hardcoded GeoJSON object for demonstration.
  // In a real application, you would load this from an external file (e.g., world_cities.geojson).
  const cityLightsGeoJSON = {
    "type": "FeatureCollection",
    "features": [
      // Major global city clusters
      { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [-74.0060, 40.7128] } }, // NYC
      { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [-0.1278, 51.5074] } },  // London
      { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [139.6917, 35.6895] } },  // Tokyo
      { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [116.4074, 39.9042] } },  // Beijing
      { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [2.3522, 48.8566] } },   // Paris
      // More points to add a web of light
      { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [151.2093, -33.8688] } }, // Sydney
      { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [77.2090, 28.6139] } },  // New Delhi
      { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [-3.7038, 40.4168] } },  // Madrid
      { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [-99.1332, 19.4326] } }, // Mexico City
      { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [12.4964, 41.9028] } },  // Rome
      { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [37.6173, 55.7558] } },  // Moscow
      { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [31.2357, 30.0444] } },  // Cairo
    ]
  };
  
  const lightMarkers = L.geoJSON(cityLightsGeoJSON, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, { icon: lightIcon });
    }
  }).addTo(map);

  // --- End of New Code ---
  
  const generateRandomPoint = () => [
    (Math.random() - 0.5) * 180, // latitude
    (Math.random() - 0.5) * 360  // longitude
  ];

  // --- Simulated Flights ---
  const flights = [];
  const numFlights = 10;
  for (let i = 0; i < numFlights; i++) {
    const start = generateRandomPoint();
    const end = generateRandomPoint();
    const path = L.polyline([start, end], { color: 'rgba(240, 160, 64, 0.5)', weight: 1 }).addTo(map);
    const marker = L.marker(start, { icon: planeIcon }).addTo(map);
    flights.push({ path, marker, start, end, progress: 0 });
  }

  // --- Simulated Satellites ---
  const satellites = [];
  const numSatellites = 5;
  const orbitRadius = 80;
  for (let i = 0; i < numSatellites; i++) {
    const lat = Math.random() * 10 - 5;
    const marker = L.marker([lat, Math.random() * 360 - 180], { icon: satelliteIcon }).addTo(map);
    satellites.push({ marker, lat, angle: Math.random() * 360 });
  }

  // --- Data Hotspots ---
  const hotspots = [];
  const numHotspots = 10;
  for (let i = 0; i < numHotspots; i++) {
    const hotspot = L.circle(generateRandomPoint(), {
      color: '#34c759',
      fillColor: '#34c759',
      fillOpacity: 0.1,
      radius: 500000,
      weight: 1
    }).addTo(map);
    hotspots.push({ circle: hotspot, phase: Math.random() * Math.PI * 2 });
  }

  // Animation loop
  setInterval(() => {
    // --- Start of New Code for Day/Night Cycle ---
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const totalUTCMinutes = utcHours * 60 + utcMinutes;
    
    // Calculate the longitude of the sun's subsolar point (the "noon" line)
    // This is a simplified calculation.
    const sunLongitude = ((totalUTCMinutes / (24 * 60)) * 360) - 180;

    // Update the light markers' opacity based on their position relative to the sun
    lightMarkers.eachLayer(function(marker) {
      const lng = marker.getLatLng().lng;
      
      // The night side is roughly 90 degrees away from the sun's longitude
      const diff = Math.abs(lng - sunLongitude);
      
      // Normalize the difference to be between 0 and 180 degrees
      const normalizedDiff = Math.min(diff, 360 - diff);
      
      // Animate opacity based on how far into the night side the marker is
      // The farther from the "day" line, the more opaque the light
      const opacity = Math.max(0, (normalizedDiff - 90) / 90);

      marker.setOpacity(opacity * 0.8 + 0.2); // Add a small base opacity for a subtle glow
    });
    // --- End of New Code ---
    
    // Animate flights
    flights.forEach(flight => {
      flight.progress += 0.005;
      if (flight.progress > 1) {
        flight.progress = 0;
        flight.start = generateRandomPoint();
        flight.end = generateRandomPoint();
        flight.path.setLatLngs([flight.start, flight.end]);
      }
      const lat = flight.start[0] + (flight.end[0] - flight.start[0]) * flight.progress;
      const lng = flight.start[1] + (flight.end[1] - flight.start[1]) * flight.progress;
      flight.marker.setLatLng([lat, lng]);
    });

    // Animate satellites
    satellites.forEach(satellite => {
      satellite.angle += 0.5;
      const newLng = (Math.cos(satellite.angle * Math.PI / 180) * orbitRadius) + (Math.sin(satellite.angle * Math.PI / 180) * 0.1);
      const newLat = satellite.lat + Math.sin(satellite.angle * Math.PI / 180) * 10;
      satellite.marker.setLatLng([newLat, newLng]);
    });

    // Animate hotspots
    hotspots.forEach(hotspot => {
      hotspot.phase += 0.05;
      const opacity = Math.abs(Math.sin(hotspot.phase)) * 0.3 + 0.1;
      const radius = Math.abs(Math.sin(hotspot.phase)) * 200000 + 500000;
      hotspot.circle.setStyle({ fillOpacity: opacity, radius: radius });
    });
  }, 50);

  // Resize the map when the container size changes
  const resizeObserver = new ResizeObserver(() => {
    map.invalidateSize();
  });
  resizeObserver.observe(mapElement);
}

function setupMissionCardBackground() {
  const container = document.getElementById('app-cards-container');
  const bgBlur = document.getElementById('mission-bg-blur');
  const cards = container.querySelectorAll('.app-card');
  if (!container || !bgBlur || cards.length === 0) return;

  const updateBackground = () => {
    let bestMatch = null;
    let minDistance = Infinity;
    
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    cards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = card;
      }
    });

    if (bestMatch) {
      const newImage = `url('${bestMatch.dataset.bgImage}')`;
      if (bgBlur.style.backgroundImage !== newImage) {
        bgBlur.style.backgroundImage = newImage;
        bgBlur.style.opacity = 1;
      }
    }
  };

  let scrollTimeout;
  container.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateBackground, 100);
  });
  
  updateBackground();
}

function setupCarousel() {
  const container = document.getElementById('app-cards-container');
  if (!container) return;

  container.addEventListener('scroll', () => {
    const cards = container.querySelectorAll('.app-card');
    const containerWidth = container.offsetWidth;
    const scrollWidth = container.scrollWidth;
    const scrollLeft = container.scrollLeft;

    if (scrollLeft + containerWidth >= scrollWidth - 10) {
      container.scrollLeft = 0; // Loop back to start
    }
  });
}

function setupCardAnimations() {
  const container = document.getElementById('app-cards-container');
  if (!container) return;
  const cards = container.querySelectorAll('.app-card');

  const handleScroll = () => {
    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    cards.forEach(card => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = cardCenter - containerCenter;
      const maxDistance = container.offsetWidth / 2 + card.offsetWidth / 2;
      const rotation = (distance / maxDistance) * 15; // Max 15 degree rotation
      card.style.transform = `rotateY(${rotation}deg) scale(1)`;
    });
  };

  container.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial call to set correct rotation on load
}

function injectHomeCSS() {
  const styleId = 'homescreen-styles';
  if (document.getElementById(styleId)) {
    return; // CSS is already injected
  }
  
  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    /* HIDE SCROLLBARS */
    ::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
    
    :root {
      --glass-bg: rgba(255, 255, 255, 0.1);
      --glass-bg-soft: rgba(255, 255, 255, 0.05);
      --text-color: #f2f2f7;
      --secondary-text-color: #8e8e93;
      --accent-color: #34c759;
      --secondary-accent: #f0a040;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: var(--font-family);
      color: var(--text-color);
      height: 100vh;
      overflow: hidden;
      background: #000;
    }

    /* Override Leaflet styles for dark theme */
    .leaflet-container {
      background: transparent;
    }
    .leaflet-pane {
      filter: grayscale(80%) invert(100%) brightness(80%) hue-rotate(180deg);
    }

    #homescreen-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
      z-index: -2;
      animation: glow-fade 10s infinite alternate ease-in-out;
    }
    #home-screen {
      width: 100%;
      max-width: 390px;
      margin: 0 auto;
      height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    #top-header-pill {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 15px 15px 0;
      padding: 8px 15px;
      background: var(--glass-bg);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border-radius: 40px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      z-index: 1000;
    }
    .time-display {
      font-weight: bold;
      font-size: 1.1em;
      color: var(--text-color);
    }
    #profile-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #agent-icon {
      width: 25px;
      height: 25px;
      background-image: url('assets/images/placeholder.jpg');
      background-size: cover;
      background-position: center;
      border-radius: 50%;
      border: 1.5px solid var(--accent-color);
      box-shadow: 0 0 5px rgba(52, 199, 89, 0.5);
    }
    .username {
      font-weight: 600;
      font-size: 0.9em;
      color: var(--text-color);
    }
    #clearance-tag {
      font-size: 0.7em;
      color: var(--secondary-text-color);
      background: rgba(255, 255, 255, 0.1);
      padding: 2px 6px;
      border-radius: 12px;
      font-weight: 500;
    }
    #currency-pill {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 4px 10px;
      font-size: 0.8em;
      font-weight: 600;
      gap: 8px;
    }
    #main-content {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 120px;
      z-index: 1;
      padding: 0; /* Removed padding to allow map to go full width */
    }
    #live-map-card {
      width: 100vw;
      max-width: 100vw;
      height: calc(100vw / 5 * 4);
      max-height: calc(390px / 5 * 4);
      margin-top: 15px;
      position: relative;
      overflow: hidden;
      /* Full-width, fading effect */
      box-sizing: border-box;
      mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
    }
    #map {
      width: 100%;
      height: 100%;
    }
    #mission-card-section {
      position: relative;
      height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding-top: 20px;
      width: 100%;
      padding-left: 20px;
      padding-right: 20px;
      box-sizing: border-box;
    }
    #mission-bg-blur {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      filter: blur(25px);
      transform: scale(1.1);
      z-index: -1;
      transition: background-image 0.5s ease-in-out;
      mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
    }
    #app-cards-container {
      display: flex;
      overflow-x: scroll;
      scroll-snap-type: x mandatory;
      padding: 0 10px 20px 10px;
      gap: 20px;
      -webkit-overflow-scrolling: touch;
      margin: 0;
      width: 100%;
      box-sizing: border-box;
      perspective: 1000px;
    }
    .app-card {
      flex-shrink: 0;
      width: 280px;
      height: calc(280px / 5 * 4);
      scroll-snap-align: center;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.05);
      position: relative;
      transition: transform 0.3s ease;
      cursor: pointer;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: flex-end;
    }
    .app-card:hover {
        transform: scale(1.05);
    }
    .app-card[data-bg-image] {
      background-image: var(--bg-image);
    }
    .app-card-content {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .app-card img {
      display: none;
    }
    .fade-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%);
      pointer-events: none;
    }
    .card-text {
      position: relative;
      padding: 20px;
      color: #fff;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
      z-index: 1;
    }
    .card-title-badge {
      font-size: 0.8em;
      font-weight: bold;
      background: var(--secondary-accent);
      color: #000;
      padding: 6px 12px;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 8px;
    }
    .card-subtitle {
      font-size: 1.5em;
      font-weight: bold;
    }
    .section-container {
      padding: 0;
      margin-top: 20px;
    }
    h2 {
      font-size: 1.2em;
      font-weight: bold;
      margin: 0 0 10px;
      color: var(--text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding-left: 20px;
    }
    #ongoing-missions-container {
      display: flex;
      overflow-x: scroll;
      scroll-snap-type: x mandatory;
      padding: 0 10px 20px 10px;
      gap: 15px;
      -webkit-overflow-scrolling: touch;
    }
    .ongoing-mission-card {
      flex-shrink: 0;
      width: 180px;
      height: calc(180px / 4 * 5);
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2), inset 0 0 10px rgba(255, 255, 255, 0.02);
      box-sizing: border-box;
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      scroll-snap-align: center;
    }
    .ongoing-mission-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.3), inset 0 0 15px rgba(255, 255, 255, 0.05);
    }
    .mission-header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 5px;
    }
    .mission-header h3 {
      font-size: 1.1em;
      font-weight: bold;
      margin: 0;
      color: var(--text-color);
      white-space: nowrap;
    }
    .mission-timer {
      font-size: 0.9em;
      color: var(--accent-color);
      font-weight: 500;
      padding: 3px 8px;
      background: rgba(52, 199, 89, 0.2);
      border-radius: 6px;
      margin-top: 5px;
    }
    .mission-details {
      font-size: 0.9em;
      color: var(--secondary-text-color);
    }
    .current-task {
      font-weight: bold;
      color: var(--text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .mission-stage {
      color: var(--accent-color);
      font-weight: bold;
    }
    #bottom-nav {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 370px;
      display: flex;
      justify-content: space-around;
      padding: 10px 0;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border-radius: 40px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      height: 70px;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease-in-out;
      cursor: pointer;
      position: relative;
    }
    .nav-item:hover {
        transform: translateY(-5px);
        color: var(--text-color);
    }
    .nav-item.active {
      color: var(--text-color);
    }
    .nav-item.active .nav-icon {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px rgba(52, 199, 89, 0.7);
      transform: scale(1.1);
    }
    .nav-icon {
      font-size: 1.5em;
      transition: all 0.3s ease-in-out;
    }
    .nav-label {
      font-size: 0.7em;
      margin-top: 5px;
    }
    
    @keyframes glow-fade {
      0% { box-shadow: inset 0 0 15px rgba(26, 26, 26, 0.2); }
      100% { box-shadow: inset 0 0 25px rgba(15, 15, 15, 0.3); }
    }
  `;
  document.head.appendChild(styleTag);
}


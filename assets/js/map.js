// assets/js/map.js

import { displayError } from './errors.js';

export function initMap(container) {
  try {
    // Check if Leaflet is available
    if (typeof L === 'undefined') {
      throw new Error('Leaflet library not loaded.');
    }

    // Inject map HTML
    container.innerHTML = `
      <div id="live-map-card">
        <div id="map"></div>
      </div>
    `;

    // Inject map CSS
    injectMapCSS();

    const mapElement = container.querySelector('#map');
    if (!mapElement) throw new Error('Map element not found.');

    const map = L.map(mapElement, {
      zoomControl: true,
      attributionControl: false,
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      minZoom: 2,
      maxZoom: 18
    }).setView([20, 0], 2);

    // Use high-quality CartoDB dark tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      minZoom: 2,
      attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    // City lights GeoJSON
    const cityLightsGeoJSON = {
      "type": "FeatureCollection",
      "features": [
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [-74.0060, 40.7128] } }, // NYC
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [-0.1278, 51.5074] } },  // London
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [139.6917, 35.6895] } },  // Tokyo
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [116.4074, 39.9042] } },  // Beijing
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [2.3522, 48.8566] } },   // Paris
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [151.2093, -33.8688] } }, // Sydney
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [77.2090, 28.6139] } },  // New Delhi
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [-3.7038, 40.4168] } },  // Madrid
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [-99.1332, 19.4326] } }, // Mexico City
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [12.4964, 41.9028] } },  // Rome
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [37.6173, 55.7558] } },  // Moscow
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [31.2357, 30.0444] } }   // Cairo
      ]
    };

    const lightIcon = L.divIcon({
      className: 'city-light-glow',
      html: '',
      iconSize: [20, 20]
    });

    L.geoJSON(cityLightsGeoJSON, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: lightIcon });
      }
    }).addTo(map);

    // Custom icons with SVG namespace
    const planeIcon = L.icon({
      iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f0a040"><path d="M10 2a8 8 0 018 8c0 1.25-.2 2.45-.58 3.53L22 19.14V22h-2.86l-5.61-5.61A8 8 0 1110 2zm0 2a6 6 0 100 12A6 6 0 0010 4z"/></svg>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const satelliteIcon = L.icon({
      iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#34c759"><path d="M12 2A10 10 0 1012 22a10 10 0 000-20zm0 2a8 8 0 110 16A8 8 0 0112 4zm-1 2.5a.5.5 0 101 0v-1a.5.5 0 10-1 0v1zM11.5 7h1v1.5h-1V7zm0 2.5h1v1.5h-1V9.5zm0 2.5h1v1.5h-1v-1.5zM11.5 14h1v1.5h-1V14zm0 2.5h1v1.5h-1v-1.5zM11.5 19h1v1.5h-1V19zM11.5 2h1v1.5h-1V2zm0 2.5h1v1.5h-1V4.5z"/></svg>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Simulated flights
    const flights = [];
    const numFlights = 10;
    for (let i = 0; i < numFlights; i++) {
      const start = generateRandomPoint();
      const end = generateRandomPoint();
      const path = L.polyline([start, end], { color: 'rgba(240, 160, 64, 0.5)', weight: 1 }).addTo(map);
      const marker = L.marker(start, { icon: planeIcon }).addTo(map);
      flights.push({ path, marker, start, end, progress: 0 });
    }

    // Simulated satellites
    const satellites = [];
    const numSatellites = 5;
    const orbitRadius = 80;
    for (let i = 0; i < numSatellites; i++) {
      const lat = Math.random() * 10 - 5;
      const marker = L.marker([lat, Math.random() * 360 - 180], { icon: satelliteIcon }).addTo(map);
      satellites.push({ marker, lat, angle: Math.random() * 360 });
    }

    // Data hotspots
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
    function animate() {
      const now = new Date();
      const utcHours = now.getUTCHours();
      const utcMinutes = now.getUTCMinutes();
      const sunLongitude = ((utcHours * 60 + utcMinutes) / (24 * 60)) * 360 - 180;

      // Update city lights
      L.geoJSON(cityLightsGeoJSON, {
        pointToLayer: function (feature, latlng) {
          const lng = latlng.lng;
          const diff = Math.abs(lng - sunLongitude);
          const normalizedDiff = Math.min(diff, 360 - diff);
          const opacity = Math.max(0, (normalizedDiff - 90) / 90) * 0.8 + 0.2;
          return L.marker(latlng, { icon: lightIcon, opacity });
        }
      }).addTo(map);

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
        hotspot.circle.setStyle({ fillOpacity: opacity, radius });
      });

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(mapElement);
  } catch (err) {
    displayError(`Map initialization failed: ${err.message}`, 'Map', 'ERR_MAP_INIT', true);
    container.innerHTML = '<div class="map-fallback">Map unavailable</div>';
  }
}

function generateRandomPoint() {
  return [(Math.random() - 0.5) * 180, (Math.random() - 0.5) * 360];
}

function injectMapCSS() {
  const styleId = 'map-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    #live-map-card {
      width: 100%;
      height: calc(100vw * 0.8); /* 5:4 aspect ratio */
      margin: 0;
      position: relative;
      overflow: hidden;
      mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
    }
    #map {
      width: 100%;
      height: 100%;
    }
    .map-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      color: #f2f2f7;
      font-size: 1em;
      text-align: center;
    }
    .leaflet-container {
      background: transparent;
    }
    .leaflet-pane {
      filter: grayscale(80%) brightness(80%) hue-rotate(180deg);
    }
    .city-light-glow {
      background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
      border-radius: 50%;
    }
  `;
  document.head.appendChild(styleTag);
}
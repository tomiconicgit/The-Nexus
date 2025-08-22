// assets/js/map.js

import { displayError } from './errors.js';

export function initMap(container) {
  try {
    if (typeof L === 'undefined') {
      throw new Error('Leaflet library not loaded.');
    }

    container.innerHTML = `
      <div id="live-map-card">
        <div id="map"></div>
      </div>
    `;

    injectMapCSS();

    const mapElement = container.querySelector('#map');
    if (!mapElement) throw new Error('Map element not found.');

    const map = L.map(mapElement, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      minZoom: 2,
      maxZoom: 19
    }).setView([20, 0], 2);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      minZoom: 2
    }).addTo(map);

    const cityLightsGeoJSON = {
      "type": "FeatureCollection",
      "features": [
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [-74.0060, 40.7128] } },
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [-0.1278, 51.5074] } },
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [139.6917, 35.6895] } },
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [116.4074, 39.9042] } },
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [2.3522, 48.8566] } },
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [151.2093, -33.8688] } },
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [77.2090, 28.6139] } },
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [-3.7038, 40.4168] } },
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [-99.1332, 19.4326] } },
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [12.4964, 41.9028] } },
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [37.6173, 55.7558] } },
        { "type": "Feature", "properties": {}, "geometry": { "type": "Point", "coordinates": [31.2357, 30.0444] } }
      ]
    };

    const lightIcon = L.divIcon({
      className: 'city-light-glow',
      html: '',
      iconSize: [20, 20]
    });

    let cityLayer;
    function animateDayNightCycle() {
      const now = new Date();
      const utcHours = now.getUTCHours();
      const utcMinutes = now.getUTCMinutes();
      const sunLongitude = ((utcHours * 60 + utcMinutes) / (24 * 60)) * 360 - 180;

      if (cityLayer) map.removeLayer(cityLayer);
      cityLayer = L.geoJSON(cityLightsGeoJSON, {
        pointToLayer: function (feature, latlng) {
          const lng = latlng.lng;
          const diff = Math.abs(lng - sunLongitude);
          const normalizedDiff = Math.min(diff, 360 - diff);
          const opacity = Math.max(0, (normalizedDiff - 90) / 90) * 0.8 + 0.2;
          return L.marker(latlng, { icon: lightIcon, opacity });
        }
      }).addTo(map);

      const currentView = map.getCenter();
      const newLng = currentView.lng + 0.05;
      if (newLng > 180) {
        map.setView([currentView.lat, -180], 2, { animate: false });
      } else {
        map.setView([currentView.lat, newLng], 2, { animate: false });
      }

      requestAnimationFrame(animateDayNightCycle);
    }
    requestAnimationFrame(animateDayNightCycle);

    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(mapElement);
  } catch (err) {
    displayError(`Map initialization failed: ${err.message}`, 'Map', 'ERR_MAP_INIT', true);
    container.innerHTML = '<div class="map-fallback">Map unavailable</div>';
  }
}

function injectMapCSS() {
  const styleId = 'map-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    #live-map-card {
      width: 100%;
      height: calc(100vw * 0.8);
      margin: 0;
      position: relative;
      overflow: hidden;
      mask-image: linear-gradient(to bottom, #000 0%, #000 15%, black 80%, transparent 100%); /* True black top */
      -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 15%, black 80%, transparent 100%);
      z-index: 1;
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
    .city-light-glow {
      background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
      border-radius: 50%;
    }
  `;
  document.head.appendChild(styleTag);
}
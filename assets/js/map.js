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
      zoomControl: false, // Remove zoom buttons
      attributionControl: false, // Remove attribution
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      minZoom: 2,
      maxZoom: 19
    }).setView([20, 0], 2);

    // Use Esri World Imagery tiles
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      minZoom: 2
    }).addTo(map);

    // Resize observer to maintain map responsiveness
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
  `;
  document.head.appendChild(styleTag);
}
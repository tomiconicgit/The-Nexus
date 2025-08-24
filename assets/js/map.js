// assets/js/map.js
// Purpose: Manages the interactive map UI for TitanOS using OpenStreetMap, simulating a PC OS environment.
// Dependencies: ./errors.js (for error handling), Leaflet.
// Notes:
// - Implements a full-width 5:4 aspect ratio map with OpenStreetMap tiles for high-quality zooming.
// - Optimized for PWA compliance and iOS Safari, targeting ~60fps.
// - Step 29 Notes: Removed GeoJSON and OSM attribution as requested.

import { displayError } from './errors.js';
import * as L from 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

export function initMap(container) {
  try {
    if (!container) throw new Error('Map container not provided.');

    // Wait for DOM to be ready
    const checkDOM = setInterval(() => {
      const mainContent = container.querySelector('#main-content');
      if (mainContent) {
        clearInterval(checkDOM);

        // Create and insert map container
        const mapContainer = document.createElement('div');
        mapContainer.id = 'map-container';
        container.insertBefore(mapContainer, mainContent);

        // Initialize Leaflet map with OSM
        const map = L.map(mapContainer, {
          center: [51.505, -0.09], // Default to London
          zoom: 13,
          zoomSnap: 0.25,
          zoomDelta: 0.5,
          maxZoom: 19,
          minZoom: 2,
          attributionControl: false, // Removed attribution
          preferCanvas: true // Improves performance on mobile
        });

        // Add OSM tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          opacity: 0.9
        }).addTo(map);

        // Add HOT overlay for contrast
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
          maxZoom: 19,
          opacity: 0.3
        }).addTo(map);

        // Style map container
        mapContainer.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 0;
          padding-top: 80%; /* 5:4 aspect ratio (100% / 5 * 4) */
          z-index: 0;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `;

        // Adjust map on resize
        window.addEventListener('resize', () => {
          map.invalidateSize();
        });
      }
    }, 100); // Check every 100ms

  } catch (err) {
    displayError(`Failed to initialize map: ${err.message}`, 'Map', 'ERR_MAP_INIT', true);
  }
}
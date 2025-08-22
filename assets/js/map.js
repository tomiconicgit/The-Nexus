// assets/js/map.js
// ... (rest of the file)
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
      mask-image: linear-gradient(to top, transparent, black 15%, black 80%, transparent);
      -webkit-mask-image: linear-gradient(to top, transparent, black 15%, black 80%, transparent);
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

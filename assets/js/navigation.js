// assets/js/navigation.js

function displayError(message, component, code) {
  console.error(`[${component} - ${code}]: ${message}`);
}

export function initNavigation(container) {
  try {
    container.innerHTML = `
      <div id="floating-pill-container">
        <div id="bottom-header-pill"></div>
      </div>
    `;

    injectNavigationCSS();
  } catch (err) {
    displayError(`Failed to initialize navigation: ${err.message}`, 'Navigation', 'ERR_NAVIGATION_INIT');
  }
}

function injectNavigationCSS() {
  const styleId = 'navigation-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    #floating-pill-container {
      position: fixed;
      bottom: 15px;
      left: 0;
      width: 100%;
      height: 6vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 0.7) 50%,
        rgba(0, 0, 0, 0) 100%
      );
      z-index: 1000;
    }

    #bottom-header-pill {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 8px 15px;
      background: rgba(255, 255, 255, 0.05); /* Lighter base color for the pill */
      border-radius: 40px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 
        0 0 15px rgba(255, 255, 255, 0.3) inset,
        0 0 10px rgba(0, 0, 0, 0.5),
        0 4px 15px rgba(0, 0, 0, 0.3);
      transition: background 0.3s ease-in-out, border 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out;
      width: 400px;
      max-width: 90%;
      height: 5vh;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      
      /* New mask properties for the curved dark section */
      mask-image: radial-gradient(circle at 120% 50%, transparent 40px, black 41px);
      -webkit-mask-image: radial-gradient(circle at 120% 50%, transparent 40px, black 41px);
    }

    #bottom-header-pill::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 40px;
      mask-image: radial-gradient(circle at 120% 50%, transparent 40px, black 41px);
      -webkit-mask-image: radial-gradient(circle at 120% 50%, transparent 40px, black 41px);
    }
  `;
  document.head.appendChild(styleTag);
}

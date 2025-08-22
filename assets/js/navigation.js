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
      background: rgba(255, 255, 255, 0.05);
      border-radius: 40px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 
        0 0 15px rgba(255, 255, 255, 0.2) inset,
        0 0 10px rgba(0, 0, 0, 0.6),
        0 4px 15px rgba(0, 0, 0, 0.4);
      transition: background 0.3s ease-in-out, border 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out;
      width: 400px;
      max-width: 90%;
      height: 5vh;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
    }

    #bottom-header-pill::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      /* The blue-green gradient background */
      background: linear-gradient(to right, #4AF6A4, #34B9A7);
      border-radius: 40px;
      /* Mask to create the curved shape on the right */
      mask-image: radial-gradient(circle at 31% 50%, black 0%, black 30%, transparent 31%);
      -webkit-mask-image: radial-gradient(circle at 31% 50%, black 0%, black 30%, transparent 31%);
    }
  `;
  document.head.appendChild(styleTag);
}

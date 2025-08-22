// assets/js/navigation.js

function displayError(message, component, code) {
  console.error(`[${component} - ${code}]: ${message}`);
}

export function initNavigation(container) {
  try {
    container.innerHTML = `
      <div id="bottom-nav">
        <div id="taskbar"></div>
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
    #bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 120px; /* Increased to accommodate the taller taskbar and fade */
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding-top: 20px;
      z-index: 1000;
      /* This container handles the fade-to-black effect */
      background: linear-gradient(to bottom, rgba(26, 26, 26, 0.7) 0%, rgba(0, 0, 0, 1) 100%);
    }
    #taskbar {
      /* The taskbar itself is now styled exactly like the header */
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100px; /* Double the vertical size from the original 50px */
      background: rgba(26, 26, 26, 0.8);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }
  `;
  document.head.appendChild(styleTag);
}

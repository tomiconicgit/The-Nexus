// assets/js/navigation.js

function displayError(message, component, code) {
  console.error(`[${component} - ${code}]: ${message}`);
}

export function initNavigation(container) {
  try {
    container.innerHTML = `
      <div id="taskbar"></div>
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
    #taskbar {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 90px; /* 10% shorter */
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.15) 0%, /* Slightly darker transparency */
        rgba(0, 0, 0, 0.8) 100%
      );
      border-top: 1px solid rgba(255, 255, 255, 0.3); /* Slightly darker border */
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }
  `;
  document.head.appendChild(styleTag);
}

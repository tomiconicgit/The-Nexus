// assets/js/navigation.js

function displayError(message, component, code) {
  console.error(`[${component} - ${code}]: ${message}`);
}

export function initNavigation(container) {
  try {
    container.innerHTML = `
      <div id="bottom-taskbar"></div>
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
    #bottom-taskbar {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 11vh; /* This is the 10% vertical increase you asked for */
      background: rgba(255, 255, 255, 0.1);
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.2);
      z-index: 1000;
    }
  `;
  document.head.appendChild(styleTag);
}

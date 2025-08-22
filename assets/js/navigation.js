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
      height: 95px; /* Shorter taskbar */
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.18) 0%, /* Darker, less transparent */
        rgba(0, 0, 0, 1) 100% /* Fades to solid black */
      );
      border-top: 1px solid rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }
  `;
  document.head.appendChild(styleTag);
}

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
      bottom: 0;
      left: 0;
      width: 100%;
      height: 10vh; /* This is the 10% vertical height of the container */
      display: flex;
      justify-content: center;
      align-items: center; /* Centers the pill vertically within the container */
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
      justify-content: center; /* Center content horizontally if you add any */
      align-items: center; /* Center content vertically if you add any */
      padding: 8px 15px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 40px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      transition: background 0.3s ease-in-out, border 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out;
      width: 400px; /* Adjust width as needed */
      max-width: 90%;
      height: 10vh; /* Set pill height to 10% of viewport height */
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
  `;
  document.head.appendChild(styleTag);
}

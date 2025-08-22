// assets/js/navigation.js

function displayError(message, component, code) {
  console.error(`[${component} - ${code}]: ${message}`);
}

export function initNavigation(container) {
  try {
    container.innerHTML = `
      <div id="bottom-nav">
        <div id="taskbar">
          <div id="start-button">Start</div>
        </div>
      </div>
    `;

    injectNavigationCSS();

    // No event listeners needed since there are no buttons to click
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
      height: 90px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding-top: 20px;
      z-index: 1000;
      background: linear-gradient(to bottom, rgba(26, 26, 26, 0.7) 0%, rgba(0, 0, 0, 1) 100%);
    }
    #taskbar {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      height: 60px;
      max-width: none;
      background: rgba(26, 26, 26, 0.8);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.5);
      padding: 0 10px;
    }
    #start-button {
      padding: 5px 15px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
      margin-right: auto;
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      transition: background 0.2s ease-in-out;
    }
    #start-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `;
  document.head.appendChild(styleTag);
}

// assets/js/navigation.js

function displayError(message, component, code) {
  console.error(`[${component} - ${code}]: ${message}`);
}

export function initNavigation(container) {
  try {
    container.innerHTML = `
      <div id="top-header-pill-container">
        <div id="top-header-pill">
          <div class="time-display">08:51</div>
          <div id="profile-container">
            <div id="agent-icon"></div>
            <span class="username">AgentX</span>
            <div id="clearance-tag">
              <div class="clearance-level">Level 1</div>
            </div>
          </div>
          <div id="currency-pill">
            <span class="currency">₿ 0</span>
            <span class="currency">Ξ 0</span>
          </div>
        </div>
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
    #top-header-pill-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      display: flex;
      justify-content: center;
      pointer-events: none; /* Allows clicks to pass through the container */
    }
    #top-header-pill {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 15px;
      padding: 8px 15px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 40px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      transition: background 0.3s ease-in-out, border 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out;
      pointer-events: auto; /* Re-enables clicks for the pill itself */
      width: 400px; /* Optional: Constrain the width */
      max-width: 90%;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .time-display {
      font-weight: bold;
      font-size: 1.1em;
      color: #f2f2f7;
    }
    #profile-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #agent-icon {
      width: 25px;
      height: 25px;
      background-image: url('assets/images/placeholder.jpg');
      background-size: cover;
      background-position: center;
      border-radius: 50%;
      border: 1.5px solid #34c759;
      box-shadow: 0 0 5px rgba(52, 199, 89, 0.5);
    }
    .username {
      font-weight: 600;
      font-size: 0.9em;
      color: #f2f2f7;
    }
    #clearance-tag {
      font-size: 0.7em;
      color: #8e8e93;
      background: rgba(255, 255, 255, 0.1);
      padding: 2px 6px;
      border-radius: 12px;
      font-weight: 500;
    }
    #currency-pill {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 4px 10px;
      font-size: 0.8em;
      font-weight: 600;
      gap: 8px;
    }
  `;
  document.head.appendChild(styleTag);
}


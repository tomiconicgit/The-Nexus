// assets/js/header.js

function displayError(message, component, code) {
  console.error(`[${component} - ${code}]: ${message}`);
  // In a real application, you might display a user-friendly error message on the page.
}

export function initHeader(container) {
  try {
    container.innerHTML = `
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
    `;

    injectHeaderCSS();
    setupScrollListener(); // Call the new function to set up the scroll listener
  } catch (err) {
    displayError(`Failed to initialize header: ${err.message}`, 'Header', 'ERR_HEADER_INIT');
  }
}

function injectHeaderCSS() {
  const styleId = 'header-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    #top-header-pill {
      position: fixed; /* Use fixed position for the floating effect */
      top: 15px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 30px); /* Account for the margin */
      max-width: 600px; /* Optional: Set a max-width for large screens */
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0; /* Margin is handled by the top/left/transform properties */
      padding: 8px 15px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 40px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      transition: background 0.3s ease-in-out, border 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out, border-radius 0.3s ease-in-out, width 0.3s ease-in-out, transform 0.3s ease-in-out;
    }
    #top-header-pill.solid {
      background: rgba(26, 26, 26, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      width: 100%; /* Expands to full width */
      max-width: none;
      top: 0;
      left: 0;
      transform: none;
      border-radius: 0; /* Becomes a solid bar */
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5); /* A more prominent shadow */
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

function setupScrollListener() {
  const header = document.getElementById('top-header-pill');
  if (!header) return;

  const SCROLL_THRESHOLD = 50; // The number of pixels to scroll before the header changes

  window.addEventListener('scroll', () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('solid');
    } else {
      header.classList.remove('solid');
    }
  });
}

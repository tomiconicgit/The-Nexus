// assets/js/header.js

import { displayError } from './errors.js';

export function initHeader(container) {
  try {
    if (!container) throw new Error('Header container not provided.');

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
    initTimeDisplay();
  } catch (err) {
    displayError(`Failed to initialize header: ${err.message}`, 'Header', 'ERR_HEADER_INIT', true);
  }
}

function initTimeDisplay() {
  try {
    const timeDisplay = document.querySelector('.time-display');
    if (!timeDisplay) throw new Error('Time display element not found.');

    function updateTime() {
      const now = new Date();
      timeDisplay.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    updateTime();
    setInterval(updateTime, 60000);
  } catch (err) {
    displayError(`Failed to initialize time display: ${err.message}`, 'Header', 'ERR_TIME_INIT');
  }
}

function injectHeaderCSS() {
  const styleId = 'header-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    :root {
      --text-color: #f2f2f7;
      --accent-color: #34c759;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #top-header-pill {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 12px;
      background: rgba(26, 26, 26, 0); /* Transparent initially */
      border-bottom: 1px solid rgba(255, 255, 255, 0);
      box-shadow: none;
      z-index: 1000;
      box-sizing: border-box;
      transition: background 0.3s ease-in-out, border-bottom 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    }
    #top-header-pill.solid {
      background: rgba(26, 26, 26, 0.8);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    @media (max-width: 430px) {
      #top-header-pill {
        padding: 8px 10px;
      }
    }
    @supports not (backdrop-filter: blur(10px)) {
      #top-header-pill.solid {
        background: #1a1a1a; /* Fallback */
      }
    }
    .time-display {
      font-weight: bold;
      font-size: 1em;
      color: var(--text-color);
    }
    #profile-container {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    #agent-icon {
      width: 24px;
      height: 24px;
      background-image: url('/assets/images/placeholder.jpg');
      background-size: cover;
      background-position: center;
      border-radius: 50%;
      border: 1.5px solid var(--accent-color);
      box-shadow: 0 0 5px rgba(52, 199, 89, 0.5);
    }
    .username {
      font-weight: 600;
      font-size: 0.85em;
      color: var(--text-color);
    }
    #clearance-tag {
      font-size: 0.65em;
      color: #8e8e93;
      background: rgba(255, 255, 255, 0.1);
      padding: 2px 6px;
      border-radius: 10px;
      font-weight: 500;
    }
    #currency-pill {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 3px 8px;
      font-size: 0.75em;
      font-weight: 600;
      gap: 6px;
    }
  `;
  document.head.appendChild(styleTag);
}
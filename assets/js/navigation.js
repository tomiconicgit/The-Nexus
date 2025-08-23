// assets/js/navigation.js

import { displayError } from './errors.js';

export function initNavigation(container) {
  try {
    if (!container) throw new Error('Navigation container not provided.');

    container.innerHTML = `
      <div id="taskbar">
        <button id="start-button">Start</button>
        <div id="system-tray">
          <div class="tray-icon" id="network-status">
            <i class="fas fa-wifi"></i>
          </div>
          <div class="tray-icon" id="notifications">
            <i class="fas fa-bell"></i>
          </div>
          <span id="clock">09:41</span>
        </div>
      </div>

      <div id="start-menu" class="hidden">
        <div id="start-menu-top">
          <div class="user-profile">
            <i class="fas fa-user-circle"></i>
            <span class="user-name">Applications</span>
          </div>
          <div class="top-controls">
            <i class="fas fa-cog"></i>
            <i class="fas fa-power-off"></i>
          </div>
        </div>
        <div id="start-menu-app-list">
          <ul>
            <li><i class="fas fa-compass"></i> Mission Control</li>
            <li><i class="fas fa-terminal"></i> Encrypted Terminal</li>
            <li><i class="fas fa-globe-americas"></i> Global Map</li>
            <li><i class="fas fa-database"></i> Data Vault</li>
            <li><i class="fas fa-envelope"></i> Agency Mail</li>
            <li><i class="fas fa-chart-line"></i> Market Monitor</li>
            <li><i class="fas fa-shield-alt"></i> Secure Hub</li>
          </ul>
        </div>
      </div>
    `;

    injectNavigationCSS();
    initClock();
    initStartMenu();
  } catch (err) {
    displayError(`Failed to initialize navigation: ${err.message}`, 'Navigation', 'ERR_NAVIGATION_INIT', true);
  }
}

function injectNavigationCSS() {
  const styleId = 'navigation-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    :root {
      --taskbar-bg: rgba(18,18,20,0.9);
      --menu-bg: rgba(25,25,30,0.95);
      --top-section-bg: rgba(0,0,0,0.25);
      --highlight-bg: rgba(40,100,255,0.08);
      --accent-color: #2979ff;
      --text-color: #f2f2f7;
      --border-color: rgba(255,255,255,0.1);
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    /* --- General UI & Body Styles --- */
    body {
      margin: 0;
      height: 100vh;
      font-family: var(--font-family);
      background: linear-gradient(145deg, #0d0d0d, #1a1a2e);
    }

    /* --- Taskbar --- */
    #taskbar {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--taskbar-bg);
      border-top: 1px solid var(--border-color);
      box-shadow: 0 -4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
      backdrop-filter: blur(15px) saturate(180%);
      -webkit-backdrop-filter: blur(15px) saturate(180%);
      padding: 0 12px;
      z-index: 900;
    }

    /* --- Start Button --- */
    #start-button {
      height: 48px;
      min-width: 110px;
      background: linear-gradient(to bottom, #1f65ff, #0f3dff);
      border: none;
      border-radius: 10px;
      color: var(--text-color);
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 6px rgba(0,0,0,0.4);
      transition: all 0.2s ease-in-out;
    }
    #start-button:hover {
      background: linear-gradient(to bottom, #2979ff, #0f4dff);
      transform: scale(1.02);
    }
    #start-button:active {
      transform: scale(0.98);
    }
    #start-button::after {
      content: "";
      position: absolute;
      top: 0;
      left: -75%;
      width: 50%;
      height: 100%;
      background: linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent);
      transform: skewX(-20deg);
    }
    #start-button.shine::after {
      animation: shine 0.4s forwards;
    }
    @keyframes shine {
      0% { left: -75%; }
      100% { left: 125%; }
    }

    /* --- System Tray --- */
    #system-tray {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(20,20,25,0.5);
      padding: 5px 12px;
      border-radius: 16px;
      box-shadow: inset 0 1px 2px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.4);
      color: var(--text-color);
      font-size: 14px;
    }
    .tray-icon {
      font-size: 1.2em;
      transition: all 0.15s ease-in-out;
      cursor: pointer;
    }
    .tray-icon:hover {
      filter: brightness(1.3);
    }
    #clock {
      margin-left: 6px;
    }

    /* Dynamic Network Icon for file transfer */
    #network-status.transferring i {
      color: #34c759;
      animation: transferPulse 1.5s infinite;
    }
    @keyframes transferPulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }

    /* Notifications Bell */
    #notifications {
      position: relative;
    }
    #notifications.unread::before {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 8px;
      height: 8px;
      background: #ff3b30;
      border-radius: 50%;
      border: 1px solid var(--taskbar-bg);
      box-shadow: 0 0 5px #ff3b30;
    }

    /* --- Start Menu --- */
    #start-menu {
      position: fixed;
      bottom: 60px;
      left: 10px;
      width: 280px;
      background: var(--menu-bg);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
      opacity: 0;
      transform: scaleY(0.85) skewY(-1deg);
      transform-origin: bottom center;
      transition: transform 0.35s cubic-bezier(0.25,1,0.5,1), opacity 0.25s ease-in-out;
      z-index: 899;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      backdrop-filter: blur(18px) saturate(180%);
      -webkit-backdrop-filter: blur(18px) saturate(180%);
    }
    #start-menu.show {
      opacity: 1;
      transform: scaleY(1) skewY(0deg);
    }

    /* --- Menu Top Section --- */
    #start-menu-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid var(--border-color);
      background: var(--top-section-bg);
    }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-color);
      font-weight: 600;
      font-size: 16px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
    }
    .top-controls {
      display: flex;
      gap: 12px;
    }
    .top-controls i {
      color: var(--text-color);
      cursor: pointer;
      font-size: 1.1em;
      transition: color 0.2s ease;
    }
    .top-controls i:hover {
      color: var(--accent-color);
    }

    /* --- App List --- */
    #start-menu-app-list {
      padding: 8px 0;
    }
    #start-menu-app-list ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    #start-menu-app-list li {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      color: var(--text-color);
      font-size: 15px;
      cursor: pointer;
      transition: background 0.15s ease, box-shadow 0.15s ease;
    }
    #start-menu-app-list li:hover {
      background: var(--highlight-bg);
      box-shadow: inset 4px 0 0 var(--accent-color);
    }
    #start-menu-app-list li i {
      width: 20px;
      text-align: center;
    }
  `;
  document.head.appendChild(styleTag);
}

function initClock() {
  function updateClock() {
    const clock = document.getElementById("clock");
    if (!clock) return;
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
  updateClock();
  setInterval(updateClock, 60000);
}

function initStartMenu() {
  try {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    if (!startButton || !startMenu) throw new Error('Start button or menu not found.');

    startButton.addEventListener('click', () => {
      startMenu.classList.toggle('show');
      startButton.classList.add('shine');
      setTimeout(() => startButton.classList.remove('shine'), 400);

      const rect = startButton.getBoundingClientRect();
      startMenu.style.left = rect.left + 'px';
      startMenu.style.bottom = (window.innerHeight - rect.top + 5) + 'px';

      startButton.style.transition = 'transform 0.2s cubic-bezier(0.25,1,0.5,1)';
      startButton.style.transform = 'scale(1.05)';
      setTimeout(() => startButton.style.transform = 'scale(1)', 200);
    });

    document.addEventListener('click', (e) => {
      if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
        startMenu.classList.remove('show');
      }
    });
  } catch (err) {
    displayError(`Failed to initialize start menu: ${err.message}`, 'Navigation', 'ERR_STARTMENU_INIT');
  }
}

// assets/js/navigation.js

import { displayError } from './errors.js';

export function initNavigation(container) {
  try {
    if (!container) {
      throw new Error('Navigation container not provided.');
    }

    container.innerHTML = `
      <div id="taskbar">
        <button id="start-button">Start</button>
        <div id="task-icons">
          <div class="task-icon">🌐</div>
          <div class="task-icon">📂</div>
          <div class="task-icon">💻</div>
        </div>
        <div id="system-tray">
          <span id="clock">09:41</span>
        </div>
      </div>
      <div id="start-menu" class="hidden">
        <ul>
          <li>Mission Control</li>
          <li>Encrypted Terminal</li>
          <li>Global Map</li>
          <li>Data Vault</li>
          <li>Agency Mail</li>
        </ul>
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
    #taskbar {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      background: rgba(20, 20, 20, 0.9); /* Solid background, no backdrop-filter */
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
      font-family: var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
      z-index: 900; /* Below header (z-index: 1000) */
    }
    #start-button {
      height: 100%;
      width: 110px;
      margin: 0;
      padding: 0;
      background: rgba(30, 144, 255, 0.8); /* Adjusted to match --accent-color */
      border: none;
      color: var(--text-color, #f2f2f7);
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
      border-right: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px 0 0 0;
      transition: background 0.2s ease-in-out, transform 0.15s ease;
    }
    #start-button:hover {
      background: rgba(40, 160, 255, 0.9);
      transform: scale(1.02);
    }
    #start-button:active {
      transform: scale(0.98);
    }
    #task-icons {
      display: flex;
      gap: 14px;
      margin-left: 15px;
    }
    .task-icon {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease-in-out, transform 0.15s ease;
    }
    .task-icon:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }
    #system-tray {
      margin-left: auto;
      margin-right: 15px;
      color: var(--text-color, #f2f2f7);
      font-size: 14px;
    }
    #start-menu {
      position: fixed;
      bottom: 60px;
      left: 0;
      width: 260px;
      background: rgba(25, 25, 25, 0.9); /* Solid background, no backdrop-filter */
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
      z-index: 899; /* Below taskbar */
    }
    #start-menu.show {
      opacity: 1;
      transform: translateY(0);
    }
    #start-menu ul {
      list-style: none;
      margin: 0;
      padding: 10px 0;
    }
    #start-menu li {
      padding: 12px 18px;
      color: var(--text-color, #f2f2f7);
      font-size: 15px;
      cursor: pointer;
      transition: background 0.2s ease-in-out;
      border-radius: 8px;
    }
    #start-menu li:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `;
  document.head.appendChild(styleTag);
}

function initClock() {
  try {
    const clock = document.getElementById('clock');
    if (!clock) {
      throw new Error('Clock element not found.');
    }
    function updateClock() {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    updateClock();
    setInterval(updateClock, 60000);
  } catch (err) {
    displayError(`Failed to initialize clock: ${err.message}`, 'Navigation', 'ERR_CLOCK_INIT');
  }
}

function initStartMenu() {
  try {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    if (!startButton || !startMenu) {
      throw new Error('Start button or menu not found.');
    }

    startButton.addEventListener('click', () => {
      startMenu.classList.toggle('show');
      startButton.style.transition = 'transform 0.2s ease-in-out';
      startButton.style.transform = 'scale(1.05)';
      setTimeout(() => {
        startButton.style.transform = 'scale(1)';
      }, 200);
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
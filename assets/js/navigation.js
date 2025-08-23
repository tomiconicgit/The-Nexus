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
      </div>
      <div id="start-menu" class="hidden">
        <div id="start-menu-top">
          <div class="user-profile">
            <i class="fas fa-user-circle"></i>
            <span class="user-name">AgentX</span>
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
    /* General Styles for new UI */
    :root {
      --taskbar-bg: rgba(26, 26, 26, 0.8);
      --menu-bg: rgba(26, 26, 26, 0.8);
      --section-bg: rgba(60, 60, 60, 0.5);
      --blue-highlight-bg: #2979ff;
      --text-color: #f2f2f7;
      --icon-color: #fff;
      --border-color: rgba(255, 255, 255, 0.1);
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    
    #taskbar {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      background: var(--taskbar-bg);
      border-top: 1px solid var(--border-color);
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
      font-family: var(--font-family);
      z-index: 900;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    #start-button {
      height: 100%;
      width: 110px;
      background: var(--blue-highlight-bg);
      border: none;
      color: var(--text-color);
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
      border-radius: 0;
      transition: background 0.2s ease-in-out, transform 0.15s ease;
    }
    #start-button:hover {
      background: #4090ff;
    }
    #start-button:active {
      transform: scale(0.98);
    }
    
    #start-menu {
      position: fixed;
      bottom: 60px;
      left: 10px;
      width: 280px;
      background: var(--menu-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
      z-index: 899;
      padding: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    #start-menu.show {
      opacity: 1;
      transform: translateY(0);
    }
    
    #start-menu-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid var(--border-color);
    }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-color);
      font-weight: 600;
      font-size: 16px;
    }
    .top-controls {
      display: flex;
      gap: 15px;
    }
    .top-controls i {
      color: var(--text-color);
      cursor: pointer;
      font-size: 1.1em;
      transition: color 0.2s ease;
    }
    .top-controls i:hover {
      color: var(--blue-highlight-bg);
    }
    
    #start-menu-app-list {
      padding: 10px 0;
    }
    #start-menu-app-list ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    #start-menu-app-list li {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 12px 18px;
      color: var(--text-color);
      font-size: 15px;
      cursor: pointer;
      transition: background 0.2s ease-in-out;
    }
    #start-menu-app-list li:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    #start-menu-app-list li i {
      width: 20px;
      text-align: center;
    }
  `;
  document.head.appendChild(styleTag);
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

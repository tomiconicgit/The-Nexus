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
    /* New high-detail UI variables */
    :root {
      --taskbar-bg: rgba(60, 100, 200, 0.15); /* Translucent blue */
      --menu-bg: rgba(40, 70, 150, 0.2); /* Slightly darker translucent blue */
      --top-section-bg: rgba(0, 0, 0, 0.3); /* Dark opaque top */
      --highlight-bg: rgba(255, 255, 255, 0.1);
      --blue-highlight-bg: #2979ff;
      --text-color: #f2f2f7;
      --icon-color: #fff;
      --border-color: rgba(60, 100, 200, 0.4);
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
      box-shadow: 
        0 -4px 12px rgba(0, 0, 0, 0.4), 
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(15px) saturate(180%);
      -webkit-backdrop-filter: blur(15px) saturate(180%);
      z-index: 900;
    }

    #start-button {
      height: 100%;
      width: 110px;
      background: linear-gradient(to bottom, #4090ff, #2979ff);
      border: none;
      color: var(--text-color);
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
      border-radius: 10px;
      box-shadow: 
        inset 0 1px 0 rgba(255,255,255,0.2), 
        0 4px 6px rgba(0,0,0,0.4);
      position: relative;
      overflow: hidden;
      transition: all 0.2s ease-in-out;
    }
    #start-button:hover {
      background: linear-gradient(to bottom, #50a0ff, #36a4ff);
      transform: scale(1.02);
    }
    #start-button:active {
      transform: scale(0.98);
    }
    /* Shine Effect */
    #start-button::after {
      content: "";
      position: absolute;
      top: 0;
      left: -75%;
      width: 50%;
      height: 100%;
      background: linear-gradient(120deg, transparent, rgba(255,255,255,0.6), transparent);
      transform: skewX(-20deg);
    }
    #start-button.shine::after {
      animation: shine 0.4s forwards;
    }
    @keyframes shine {
      0% { left: -75%; }
      100% { left: 125%; }
    }

    #start-menu {
      position: fixed;
      bottom: 60px;
      left: 10px;
      width: 280px;
      background: var(--menu-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      box-shadow: 
        0 4px 12px rgba(0,0,0,0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      opacity: 0;
      transform: scaleY(0.8) skewY(-2deg);
      transform-origin: bottom center;
      transition: transform 0.35s cubic-bezier(0.25,1,0.5,1), opacity 0.25s ease-in-out;
      z-index: 899;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
    }
    #start-menu.show {
      opacity: 1;
      transform: scaleY(1) skewY(0deg);
    }

    /* Top section */
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
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
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
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
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
      transition: background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    #start-menu-app-list li:hover {
      background: var(--highlight-bg);
      box-shadow: inset 5px 0 0 var(--blue-highlight-bg);
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
      startButton.classList.add('shine');
      setTimeout(() => startButton.classList.remove('shine'), 400);

      // Position menu relative to button
      const rect = startButton.getBoundingClientRect();
      startMenu.style.left = rect.left + 'px';
      startMenu.style.bottom = (window.innerHeight - rect.top + 5) + 'px';

      // Bounce effect
      startButton.style.transition = 'transform 0.2s cubic-bezier(0.25,1,0.5,1)';
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

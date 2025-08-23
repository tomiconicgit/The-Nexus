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
        <div class="menu-section">
          <h3>Visible Section</h3>
          <div class="menu-items-container blue-section">
            <div class="menu-item-icon">
              <i class="fas fa-wifi"></i>
              <span class="icon-text">100%</span>
            </div>
            <div class="menu-item-icon">
              <i class="fas fa-battery-full"></i>
            </div>
            <div class="menu-item-icon">
              <i class="fas fa-user-circle"></i>
            </div>
            <span class="menu-item-text">Tue 10:36 AM</span>
          </div>
        </div>
        <div class="menu-section">
          <h3>Hidden Section</h3>
          <div class="menu-items-container">
            <div class="menu-item-icon">
              <i class="fas fa-volume-up"></i>
            </div>
            <div class="menu-item-icon">
              <i class="fas fa-moon"></i>
            </div>
            <div class="menu-item-icon">
              <i class="fas fa-thumbtack"></i>
            </div>
            <div class="menu-item-icon">
              <i class="fas fa-cloud"></i>
            </div>
            <div class="menu-item-icon">
              <i class="fas fa-keyboard"></i>
            </div>
            <div class="menu-item-icon">
              <i class="fas fa-bell"></i>
            </div>
            <div class="menu-item-icon">
              <i class="fas fa-user-circle"></i>
            </div>
          </div>
        </div>
        <div class="menu-section">
          <h3>Always-Hidden Section</h3>
          <div class="menu-items-container">
            <div class="menu-item-icon">
              <i class="fas fa-thumbtack"></i>
            </div>
            <div class="menu-item-icon">
              <i class="fas fa-lock"></i>
            </div>
            <div class="menu-item-icon">
              <i class="fas fa-moon"></i>
            </div>
            <div class="menu-item-icon">
              <i class="fas fa-search"></i>
            </div>
          </div>
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
      --taskbar-bg: rgba(30, 30, 30, 0.8);
      --menu-bg: rgba(40, 40, 40, 0.9);
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
      left: 10px; /* Adjusted position to be on the left */
      width: 380px;
      background: var(--menu-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
      z-index: 899;
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    #start-menu.show {
      opacity: 1;
      transform: translateY(0);
    }
    
    .menu-section {
      display: flex;
      flex-direction: column;
    }
    .menu-section h3 {
      font-size: 14px;
      font-weight: 500;
      color: var(--secondary-text-color, #8e8e93);
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .menu-items-container {
      background: var(--section-bg);
      border-radius: 8px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .blue-section {
      background: var(--blue-highlight-bg);
    }
    .menu-item-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--icon-color);
    }
    .menu-item-icon .icon-text {
        font-size: 12px;
        margin-left: 4px;
    }
    .menu-item-text {
      color: var(--text-color);
      font-size: 14px;
      margin-left: auto;
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

// Function calls for the clock and app icons were removed

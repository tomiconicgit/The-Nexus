// assets/js/navigation.js

import { displayError } from './errors.js';
import { navigateTo } from './router.js';

export function initNavigation(container) {
  try {
    if (!container) throw new Error('Navigation container not provided.');

    // Inject minimal taskbar HTML first
    container.innerHTML = `
      <div id="taskbar">
        <button id="start-button">Start</button>
        <div id="system-tray">
          <div class="tray-icon" id="network-status"><i class="fas fa-wifi"></i></div>
          <div class="tray-icon" id="notifications"><i class="fas fa-bell"></i></div>
          <span id="clock">09:41</span>
        </div>
      </div>
    `;

    // Defer rendering of start menu and system tray panel
    requestAnimationFrame(() => {
      const deferredContent = document.createElement('div');
      deferredContent.innerHTML = `
        <div id="system-tray-panel" class="hidden">
          <div class="widget-header">
            <h4>System Status</h4>
          </div>
          <div class="widget">
            <h5>Network Activity</h5>
            <div class="network-graph"></div>
          </div>
          <div class="widget">
            <h5>Active Transfers</h5>
            <div class="transfer-item">
              <span class="file-name">Briefing_001.zip</span>
              <div class="progress-bar-container">
                <div class="progress-bar" style="width: 75%;"></div>
              </div>
            </div>
            <div class="transfer-item">
              <span class="file-name">Intel_Report.enc</span>
              <div class="progress-bar-container">
                <div class="progress-bar" style="width: 20%;"></div>
              </div>
            </div>
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
          <div class="start-menu-content">
            <div id="start-menu-app-list">
              <ul>
                <li data-route="/mission-control"><i class="fas fa-compass"></i> Mission Control</li>
                <li data-route="/encrypted-terminal"><i class="fas fa-terminal"></i> Encrypted Terminal</li>
                <li data-route="/global-map"><i class="fas fa-globe-americas"></i> Global Map</li>
                <li data-route="/data-vault"><i class="fas fa-database"></i> Data Vault</li>
                <li data-route="/agency-mail"><i class="fas fa-envelope"></i> Agency Mail</li>
                <li data-route="/market-monitor"><i class="fas fa-chart-line"></i> Market Monitor</li>
                <li data-route="/secure-hub"><i class="fas fa-shield-alt"></i> Secure Hub</li>
              </ul>
            </div>
            <div id="start-menu-right">
              <div class="right-panel-header">
                <i class="fas fa-stream"></i>
                <span>Recent Activity</span>
              </div>
              <ul class="recent-list">
                <li><i class="far fa-file-alt"></i> Project Chimera Briefing</li>
                <li><i class="fas fa-lock"></i> Encryption Log #134</li>
                <li><i class="far fa-map"></i> Classified Sat-Image</li>
                <li><i class="far fa-envelope"></i> Re: Operation Ghost</li>
              </ul>
            </div>
          </div>
        </div>
      `;
      container.appendChild(deferredContent);
    });

    injectNavigationCSS();
    initClock();
    initStartMenu();
    initSystemTrayPanel();
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
      --taskbar-bg: rgba(18, 18, 20, 0.9);
      --menu-bg: rgba(25, 25, 30, 0.95);
      --top-section-bg: rgba(0, 0, 0, 0.25);
      --highlight-bg: rgba(40, 100, 255, 0.08);
      --accent-color: #2979ff;
      --text-color: #f2f2f7;
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
      justify-content: space-between;
      background: var(--taskbar-bg);
      border-top: 1px solid var(--border-color);
      padding: 0 12px;
      z-index: 900;
      box-sizing: border-box;
      will-change: transform; /* Optimize rendering */
    }
    #start-button {
      height: 48px;
      min-width: 110px;
      background: linear-gradient(to bottom, #2979ff, #0f3dff);
      border: none;
      border-radius: 10px;
      color: var(--text-color);
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.15s ease-in-out, transform 0.15s ease-in-out;
      will-change: background, transform;
    }
    #start-button:hover {
      background: linear-gradient(to bottom, #3b8cff, #1f4dff);
      transform: scale(1.02);
    }
    #start-button:active {
      transform: scale(0.98);
    }
    #start-button.shine {
      animation: shine 0.3s ease-in-out;
    }
    @keyframes shine {
      0% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.3); }
      50% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.5); }
      100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.3); }
    }
    #system-tray {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(20, 20, 25, 0.5);
      padding: 5px 12px;
      border-radius: 16px;
      color: var(--text-color);
      font-size: 14px;
    }
    .tray-icon, .top-controls i, #start-menu-app-list i, .recent-list i {
      font-size: 1.2em;
      transition: filter 0.15s ease-in-out;
      cursor: pointer;
      will-change: filter;
    }
    .tray-icon:hover, .top-controls i:hover {
      filter: brightness(1.3);
    }
    #clock {
      margin-left: 6px;
    }
    #network-status.transferring i {
      color: #34c759;
      animation: transferPulse 1.5s ease-in-out infinite;
    }
    @keyframes transferPulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }
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
    }
    #system-tray-panel {
      position: fixed;
      bottom: 70px;
      right: 10px;
      width: 280px;
      background: var(--menu-bg);
      border-radius: 12px;
      opacity: 0;
      transform: scale(0.95);
      transform-origin: bottom right;
      transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
      z-index: 899;
      padding: 15px;
      color: var(--text-color);
      will-change: opacity, transform;
    }
    #system-tray-panel.show {
      opacity: 1;
      transform: scale(1);
    }
    .widget-header {
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .widget {
      margin-bottom: 20px;
    }
    .widget h5 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 500;
      color: var(--accent-color);
    }
    .network-graph {
      height: 60px;
      background: linear-gradient(to right, rgba(52, 199, 89, 0.3), rgba(52, 199, 89, 0.1));
      background-size: cover;
      opacity: 0.6;
    }
    .transfer-item {
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
    }
    .file-name {
      font-size: 13px;
      margin-bottom: 4px;
    }
    .progress-bar-container {
      height: 5px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      background: var(--accent-color);
      transition: width 0.3s ease-in-out;
    }
    #start-menu {
      position: fixed;
      bottom: 60px;
      left: 10px;
      width: 380px;
      background: var(--menu-bg);
      border-radius: 12px;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
      z-index: 899;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      will-change: opacity, transform;
    }
    #start-menu.show {
      opacity: 1;
      transform: translateY(0);
    }
    .start-menu-content {
      display: flex;
      flex-grow: 1;
      padding-bottom: 10px;
    }
    #start-menu-app-list {
      flex: 1;
      padding: 8px 0;
    }
    #start-menu-right {
      flex: 1;
      border-left: 1px solid var(--border-color);
      background: var(--top-section-bg);
      padding: 10px 15px;
    }
    .right-panel-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
      color: var(--accent-color);
      font-weight: 600;
    }
    .recent-list {
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 14px;
    }
    .recent-list li {
      padding: 8px 0;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: color 0.15s ease-in-out;
    }
    .recent-list li:hover {
      color: var(--accent-color);
    }
    .recent-list li i {
      width: 18px;
      text-align: center;
    }
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
    }
    .top-controls {
      display: flex;
      gap: 12px;
    }
    .top-controls i {
      color: var(--text-color);
      cursor: pointer;
      font-size: 1.1em;
      transition: color 0.15s ease-in-out;
    }
    .top-controls i:hover {
      color: var(--accent-color);
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
      transition: background 0.15s ease-in-out;
    }
    #start-menu-app-list li:hover {
      background: var(--highlight-bg);
    }
    #start-menu-app-list li i {
      width: 20px;
      text-align: center;
    }
  `;
  document.head.appendChild(styleTag);
}

function initClock() {
  try {
    const clock = document.getElementById('clock');
    if (!clock) throw new Error('Clock element not found.');
    function updateClock() {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      requestAnimationFrame(updateClock);
    }
    requestAnimationFrame(updateClock);
  } catch (err) {
    displayError(`Failed to initialize clock: ${err.message}`, 'Navigation', 'ERR_CLOCK_INIT');
  }
}

function initStartMenu() {
  try {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    if (!startButton || !startMenu) throw new Error('Start button or menu not found.');

    startButton.addEventListener('click', (e) => {
      e.stopPropagation();
      startMenu.classList.toggle('show');
      startButton.classList.add('shine');
      setTimeout(() => startButton.classList.remove('shine'), 300);
    });

    // Event delegation for start menu items
    startMenu.addEventListener('click', (e) => {
      const menuItem = e.target.closest('#start-menu-app-list li');
      if (menuItem) {
        const path = menuItem.dataset.route;
        if (path) {
          navigateTo(path);
          startMenu.classList.remove('show');
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
        startMenu.classList.remove('show');
      }
    }, { passive: true });
  } catch (err) {
    displayError(`Failed to initialize start menu: ${err.message}`, 'Navigation', 'ERR_STARTMENU_INIT');
  }
}

function initSystemTrayPanel() {
  try {
    const systemTray = document.getElementById('system-tray');
    const trayPanel = document.getElementById('system-tray-panel');
    if (!systemTray || !trayPanel) throw new Error('System tray or panel not found.');

    systemTray.addEventListener('click', (e) => {
      const icon = e.target.closest('.tray-icon, #clock');
      if (icon) {
        e.stopPropagation();
        trayPanel.classList.toggle('show');
      }
    }, { passive: true });

    document.addEventListener('click', (e) => {
      if (!trayPanel.contains(e.target) && !e.target.closest('#system-tray')) {
        trayPanel.classList.remove('show');
      }
    }, { passive: true });
  } catch (err) {
    displayError(`Failed to initialize system tray panel: ${err.message}`, 'Navigation', 'ERR_SYSTEMTRAY_INIT');
  }
}
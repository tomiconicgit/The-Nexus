// assets/js/navigation.js
// Purpose: Manages the taskbar and navigation UI for TitanOS, including Start menu and system tray.
// Dependencies: ./errors.js (for error handling and status updates).
// Notes:
// - Handles taskbar interactions with a desktop-like experience, including Start menu and tray panel.
// - Optimized for PWA compliance and iOS Safari, targeting ~60fps.
// - Step 18 Fix Notes: Added assets/sounds/mouseclicksingle.wav for Start button and screen taps, assets/sounds/mouseclickdouble.wav for Start menu tray options, with no delay.

import { displayError } from './errors.js';

export function initNavigation(container) {
  try {
    if (!container) throw new Error('Navigation container not provided.');

    // Preload audio files
    const clickAudio = new Audio('assets/sounds/mouseclicksingle.wav');
    clickAudio.preload = 'auto';
    clickAudio.volume = 0.03; // Set the volume to 3%

    const doubleClickAudio = new Audio('assets/sounds/mouseclickdouble.wav');
    doubleClickAudio.preload = 'auto';
    doubleClickAudio.volume = 0.03; // Set the volume to 3%

    container.innerHTML = `
      <div id="taskbar">
        <button id="start-button">Start</button>
        <div id="system-tray">
          <div class="tray-icon" id="network-status"><i class="fas fa-wifi"></i></div>
          <div class="tray-icon" id="notifications"><i class="fas fa-bell"></i></div>
          <span id="clock">09:41</span>
        </div>
      </div>
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
              <li><i class="fas fa-compass"></i> Mission Control</li>
              <li><i class="fas fa-terminal"></i> Encrypted Terminal</li>
              <li><i class="fas fa-globe-americas"></i> Global Map</li>
              <li><i class="fas fa-database"></i> Data Vault</li>
              <li><i class="fas fa-envelope"></i> Agency Mail</li>
              <li><i class="fas fa-chart-line"></i> Market Monitor</li>
              <li><i class="fas fa-shield-alt"></i> Secure Hub</li>
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

    injectNavigationCSS();
    initClock();
    initStartMenu(clickAudio, doubleClickAudio); // Pass audio instances
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
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
      padding: 0 12px;
      z-index: 900;
      box-sizing: border-box;
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
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      transition: all 0.2s ease-in-out;
    }
    #start-button:hover {
      background: linear-gradient(to bottom, #3b8cff, #1f4dff);
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
      background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transform: skewX(-20deg);
    }
    #start-button.shine::after {
      animation: shine 0.4s forwards;
    }
    @keyframes shine {
      0% { left: -75%; }
      100% { left: 125%; }
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
      transition: all 0.15s ease-in-out;
      cursor: pointer;
    }
    .tray-icon:hover, .top-controls i:hover {
      filter: brightness(1.3);
    }
    #clock {
      margin-left: 6px;
    }
    #network-status.transferring i {
      color: #34c759;
      animation: transferPulse 1.5s infinite;
    }
    @keyframes transferPulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.8; }
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
      box-shadow: 0 0 5px #ff3b30;
    }
    #system-tray-panel {
      position: fixed;
      bottom: 70px;
      right: 10px;
      width: 280px;
      background: var(--menu-bg);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      opacity: 0;
      transform: scale(0.95);
      transform-origin: bottom right;
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
      z-index: 899;
      padding: 15px;
      color: var(--text-color);
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
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
      z-index: 899;
      display: flex;
      flex-direction: column;
      overflow: hidden;
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
      transition: color 0.2s ease;
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
  try {
    const clock = document.getElementById('clock');
    if (!clock) throw new Error('Clock element not found.');
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

function initStartMenu(clickAudio, doubleClickAudio) {
  try {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    const appListItems = document.querySelectorAll('#start-menu-app-list li');
    const recentItems = document.querySelectorAll('.recent-list li');
    const topControls = document.querySelectorAll('.top-controls i');
    if (!startButton || !startMenu) throw new Error('Start button or menu not found.');

    // Play single click sound on Start button press
    startButton.addEventListener('click', (e) => {
      e.stopPropagation();
      try {
        clickAudio.currentTime = 0; // Reset to start for instant playback
        clickAudio.play();
      } catch (err) {
        console.warn('Failed to play single click audio:', err);
        if (navigator.vibrate) navigator.vibrate(10);
      }
      startMenu.classList.toggle('show');
      startButton.classList.add('shine');
      setTimeout(() => startButton.classList.remove('shine'), 400);
    });

    // Play single click sound on screen tap
    document.addEventListener('click', (e) => {
      try {
        clickAudio.currentTime = 0; // Reset to start for instant playback
        clickAudio.play();
      } catch (err) {
        console.warn('Failed to play single click audio on tap:', err);
        if (navigator.vibrate) navigator.vibrate(10);
      }
      if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
        startMenu.classList.remove('show');
      }
    });

    // Play double click sound on Start menu tray options
    // Use the spread operator to correctly iterate over the NodeLists
    [...appListItems, ...recentItems, ...topControls].forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        try {
          doubleClickAudio.currentTime = 0; // Reset to start for instant playback
          doubleClickAudio.play();
        } catch (err) {
          console.warn('Failed to play double click audio:', err);
          if (navigator.vibrate) navigator.vibrate(10);
        }
      });
    });
  } catch (err) {
    displayError(`Failed to initialize start menu: ${err.message}`, 'Navigation', 'ERR_STARTMENU_INIT');
  }
}

function initSystemTrayPanel() {
  try {
    const trayIcons = document.querySelectorAll('#system-tray .tray-icon, #clock');
    const trayPanel = document.getElementById('system-tray-panel');
    if (!trayPanel || trayIcons.length === 0) throw new Error('System tray panel or icons not found.');

    trayIcons.forEach(icon => {
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        trayPanel.classList.toggle('show');
      });
    });

    document.addEventListener('click', (e) => {
      if (!trayPanel.contains(e.target) && !e.target.closest('#system-tray')) {
        trayPanel.classList.remove('show');
      }
    });
  } catch (err) {
    displayError(`Failed to initialize system tray panel: ${err.message}`, 'Navigation', 'ERR_SYSTEMTRAY_INIT');
  }
}

// assets/js/navigation.js
// Purpose: Manages the taskbar and navigation UI for TitanOS, including Start menu and system tray.
// Dependencies: ./errors.js (for error handling and status updates).
// Notes:
// - Handles taskbar interactions with a desktop-like experience, including Start menu and tray panel.
// - Optimized for PWA compliance and iOS Safari, targeting ~60fps.
// - Step 19 Fix Notes: Lowered all mouse click sounds to 3% volume.

import { displayError } from './errors.js';

export function initNavigation(container) {
  try {
    if (!container) throw new Error('Navigation container not provided.');

    // Preload audio files
    const clickAudio = new Audio('assets/sounds/mouseclicksingle.wav');
    clickAudio.preload = 'auto';
    clickAudio.volume = 0.03; // 3% volume

    const doubleClickAudio = new Audio('assets/sounds/mouseclickdouble.wav');
    doubleClickAudio.preload = 'auto';
    doubleClickAudio.volume = 0.03; // 3% volume

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
    initSystemTrayPanel(doubleClickAudio);       // Apply sound to tray items too
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
    /* (CSS unchanged from previous version) */
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

    // Start button → single click
    startButton.addEventListener('click', (e) => {
      e.stopPropagation();
      try {
        clickAudio.currentTime = 0;
        clickAudio.play();
      } catch (err) {
        console.warn('Failed to play single click audio:', err);
        if (navigator.vibrate) navigator.vibrate(10);
      }
      startMenu.classList.toggle('show');
      startButton.classList.add('shine');
      setTimeout(() => startButton.classList.remove('shine'), 400);
    });

    // Screen taps → single click
    document.addEventListener('click', (e) => {
      try {
        clickAudio.currentTime = 0;
        clickAudio.play();
      } catch (err) {
        console.warn('Failed to play single click audio on tap:', err);
        if (navigator.vibrate) navigator.vibrate(10);
      }
      if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
        startMenu.classList.remove('show');
      }
    });

    // Start menu items → double click
    [...appListItems, ...recentItems, ...topControls].forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        try {
          doubleClickAudio.currentTime = 0;
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

function initSystemTrayPanel(doubleClickAudio) {
  try {
    const trayIcons = document.querySelectorAll('#system-tray .tray-icon, #clock');
    const trayPanel = document.getElementById('system-tray-panel');
    if (!trayPanel || trayIcons.length === 0) throw new Error('System tray panel or icons not found.');

    trayIcons.forEach(icon => {
      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        try {
          doubleClickAudio.currentTime = 0;
          doubleClickAudio.play();
        } catch (err) {
          console.warn('Failed to play tray click audio:', err);
        }
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
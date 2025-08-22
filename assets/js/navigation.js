// assets/js/navigation.js

import { displayError } from './errors.js';

export function initNavigation(container) {
  try {
    // Inject navigation HTML
    container.innerHTML = `
      <div id="bottom-nav">
        <div class="nav-item active">
          <span class="nav-icon">⌂</span>
          <span class="nav-label">Home</span>
        </div>
        <div class="nav-item">
          <span class="nav-icon">⎈</span>
          <span class="nav-label">Wallet</span>
        </div>
        <div class="nav-item">
          <span class="nav-icon">⚙︎</span>
          <span class="nav-label">Settings</span>
        </div>
      </div>
    `;

    // Inject navigation CSS
    injectNavigationCSS();

    // Add navigation interactions
    setupNavigation(container);
  } catch (err) {
    displayError(`Failed to initialize navigation: ${err.message}`, 'Navigation', 'ERR_NAVIGATION_INIT');
  }
}

function setupNavigation(container) {
  try {
    const navItems = container.querySelectorAll('.nav-item');
    if (!navItems.length) {
      throw new Error('No navigation items found.');
    }

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });
  } catch (err) {
    displayError(`Navigation setup failed: ${err.message}`, 'Navigation', 'ERR_NAVIGATION_SETUP');
  }
}

function injectNavigationCSS() {
  const styleId = 'navigation-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    #bottom-nav {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 370px;
      display: flex;
      justify-content: space-around;
      padding: 10px 0;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 40px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      height: 70px;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #8e8e93;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease-in-out;
      cursor: pointer;
      position: relative;
    }
    .nav-item:hover {
      transform: translateY(-5px);
      color: #f2f2f7;
    }
    .nav-item.active {
      color: #f2f2f7;
    }
    .nav-item.active .nav-icon {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px rgba(52, 199, 89, 0.7);
      transform: scale(1.1);
    }
    .nav-icon {
      font-size: 1.5em;
      transition: all 0.3s ease-in-out;
    }
    .nav-label {
      font-size: 0.7em;
      margin-top: 5px;
    }
  `;
  document.head.appendChild(styleTag);
}
// assets/js/homescreen.js

import { displayError } from './errors.js';
import { initHeader } from './header.js';
import { initNavigation } from './navigation.js';

export async function loadHomeScreen(container) {
  try {
    injectHomeCSS();

    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

    container.innerHTML = `
      <div id="homescreen-background"></div>
      <div id="home-screen">
        <div id="header-container"></div>
        <div id="main-content">
          <div class="desktop-content">
            <div class="desktop-icon">Mission Control</div>
            <div class="desktop-icon">Encrypted Terminal</div>
            <div class="desktop-icon">Agency Mail</div>
            <div class="desktop-icon">Data Vault</div>
            <div class="desktop-icon">Market Monitor</div>
          </div>
        </div>
        <div id="navigation-container"></div>
      </div>
    `;

    initHeader(container.querySelector('#header-container'));
    initNavigation(container.querySelector('#navigation-container'));

    const mainContent = container.querySelector('#main-content');
    const headerPill = container.querySelector('#top-header-pill');
    if (mainContent && headerPill) {
      mainContent.addEventListener('scroll', () => {
        const scrollTop = mainContent.scrollTop;
        if (scrollTop > 50) {
          headerPill.classList.add('solid');
        } else {
          headerPill.classList.remove('solid');
        }
      });
    }

    const homeScreen = container.querySelector('#home-screen');
    if (!homeScreen) throw new Error('Home screen element not found.');
    homeScreen.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => { homeScreen.style.opacity = '1'; }, 10);
  } catch (err) {
    displayError(`Failed to load home screen: ${err.message}`, 'HomeScreen', 'ERR_HOMESCR', true);
  }
}

function injectHomeCSS() {
  const styleId = 'homescreen-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    :root {
      --text-color: #f2f2f7;
      --secondary-text-color: #8e8e93;
      --accent-color: #34c759;
      --secondary-accent: #f0a040;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: var(--font-family);
      color: var(--text-color);
      height: 100vh;
      overflow: hidden;
      background: linear-gradient(145deg, #0d0d0d, #1a1a2e);
    }
    #homescreen-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(145deg, #0d0d0d, #1a1a2e);
      z-index: -2;
    }
    #home-screen {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    #main-content {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 60px;
      z-index: 1;
    }
    .desktop-content {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    .desktop-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: var(--text-color);
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      transition: background 0.2s ease-in-out;
    }
    .desktop-icon:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `;
  document.head.appendChild(styleTag);
}
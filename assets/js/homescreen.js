// assets/js/homescreen.js

import { displayError } from './errors.js';
import { initMap } from './map.js';
import { initMissionCards } from './missioncards.js';
import { initActiveMissions } from './activemissions.js';
import { initHeader } from './header.js';
import { initNavigation } from './navigation.js';

export async function loadHomeScreen(container) {
  try {
    // Inject global CSS
    injectHomeCSS();

    // Set viewport meta
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

    // Set minimal HTML structure
    container.innerHTML = `
      <div id="homescreen-background"></div>
      <div id="home-screen">
        <div id="header-container"></div>
        <div id="main-content">
          <div id="map-container"></div>
          <div id="mission-cards-container"></div>
          <div class="section-container"></div>
        </div>
        <div id="navigation-container"></div>
      </div>
    `;

    // Initialize components
    initHeader(container.querySelector('#header-container'));
    initMap(container.querySelector('#map-container'));
    initMissionCards(container.querySelector('#mission-cards-container'));
    initActiveMissions(container.querySelector('.section-container'));
    initNavigation(container.querySelector('#navigation-container'));

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
      background: #000;
    }

    #homescreen-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
      z-index: -2;
      animation: glow-fade 10s infinite alternate ease-in-out;
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
      padding-bottom: 120px;
      z-index: 1;
    }
    @keyframes glow-fade {
      0% { box-shadow: inset 0 0 15px rgba(26, 26, 26, 0.2); }
      100% { box-shadow: inset 0 0 25px rgba(15, 15, 15, 0.3); }
    }
  `;
  document.head.appendChild(styleTag);
}
// assets/js/homescreen.js

import { displayError } from './errors.js';
import { initMap } from './map.js';
import { initMissionCards } from './missioncards.js';
import { initActiveMissions } from './activemissions.js';

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
        <div id="top-header-pill">
          <div class="time-display">08:51</div>
          <div id="profile-container">
            <div id="agent-icon"></div>
            <span class="username">AgentX</span>
            <div id="clearance-tag">
              <div class="clearance-level">Level 1</div>
            </div>
          </div>
          <div id="currency-pill">
            <span class="currency">₿ 0</span>
            <span class="currency">Ξ 0</span>
          </div>
        </div>
        <div id="main-content">
          <div id="map-container"></div>
          <div id="mission-cards-container"></div>
          <div class="section-container"></div>
        </div>
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
      </div>
    `;

    // Initialize components
    initMap(container.querySelector('#map-container'));
    initMissionCards(container.querySelector('#mission-cards-container'));
    initActiveMissions(container.querySelector('.section-container'));

    const homeScreen = container.querySelector('#home-screen');
    if (!homeScreen) throw new Error('Header or home screen element not found.');
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
      max-width: 390px;
      margin: 0 auto;
      height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    #top-header-pill {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 15px 15px 0;
      padding: 8px 15px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 40px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      z-index: 1000;
    }
    .time-display {
      font-weight: bold;
      font-size: 1.1em;
      color: var(--text-color);
    }
    #profile-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #agent-icon {
      width: 25px;
      height: 25px;
      background-image: url('assets/images/placeholder.jpg');
      background-size: cover;
      background-position: center;
      border-radius: 50%;
      border: 1.5px solid var(--accent-color);
      box-shadow: 0 0 5px rgba(52, 199, 89, 0.5);
    }
    .username {
      font-weight: 600;
      font-size: 0.9em;
      color: var(--text-color);
    }
    #clearance-tag {
      font-size: 0.7em;
      color: var(--secondary-text-color);
      background: rgba(255, 255, 255, 0.1);
      padding: 2px 6px;
      border-radius: 12px;
      font-weight: 500;
    }
    #currency-pill {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 4px 10px;
      font-size: 0.8em;
      font-weight: 600;
      gap: 8px;
    }
    #main-content {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 120px;
      z-index: 1;
    }
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
      color: var(--secondary-text-color);
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease-in-out;
      cursor: pointer;
      position: relative;
    }
    .nav-item:hover {
      transform: translateY(-5px);
      color: var(--text-color);
    }
    .nav-item.active {
      color: var(--text-color);
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
    @keyframes glow-fade {
      0% { box-shadow: inset 0 0 15px rgba(26, 26, 26, 0.2); }
      100% { box-shadow: inset 0 0 25px rgba(15, 15, 15, 0.3); }
    }
  `;
  document.head.appendChild(styleTag);
}
// assets/js/homescreen.js

import { displayError } from './errors.js';
import { initMap } from './map.js';
import { initMissionCards } from './missioncards.js';

export async function loadHomeScreen(container) {
  try {
    // Inject CSS first to prevent FOUC
    injectHomeCSS();

    // Set viewport meta
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
          <div id="live-map-card">
            <div id="map"></div>
          </div>
          
          <div id="mission-card-section">
            <div id="mission-bg-blur"></div>
            <div id="app-cards-container">
              <div class="app-card" data-bg-image="assets/images/IMG_8857.jpeg">
                <div class="app-card-content">
                  <div class="fade-overlay"></div>
                  <div class="card-text">
                    <div class="card-title-badge">INTEL</div>
                    <div class="card-subtitle">Locate Stolen Nuke Codes</div>
                  </div>
                </div>
              </div>
              <div class="app-card" data-bg-image="assets/images/IMG_8858.jpeg">
                <div class="app-card-content">
                  <div class="fade-overlay"></div>
                  <div class="card-text">
                    <div class="card-title-badge">OP</div>
                    <div class="card-subtitle">Rogue Asset Extraction</div>
                  </div>
                </div>
              </div>
              <div class="app-card" data-bg-image="https://images.unsplash.com/photo-1603145731082-2e16b6d4a3f2?auto=format&fit=crop&w=400&q=80">
                <div class="app-card-content">
                  <div class="fade-overlay"></div>
                  <div class="card-text">
                    <div class="card-title-badge">DATA</div>
                    <div class="card-subtitle">Decrypt Encrypted Data</div>
                  </div>
                </div>
              </div>
              <div class="app-card" data-bg-image="https://images.unsplash.com/photo-1603570322020-0b16eaf89335?auto=format&fit=crop&w=400&q=80">
                <div class="app-card-content">
                  <div class="fade-overlay"></div>
                  <div class="card-text">
                    <div class="card-title-badge">INTEL</div>
                    <div class="card-subtitle">Cyber Warfare Defense</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="section-container">
            <h2>Ongoing Missions</h2>
            <div id="ongoing-missions-container">
              <div class="ongoing-mission-card">
                <div class="mission-header">
                  <h3>Operation Blacklight</h3>
                  <span class="mission-timer">02:34:12</span>
                </div>
                <div class="mission-details">
                  <span class="mission-stage">Stage 2: </span>
                  <span class="current-task">Data Exfiltration</span>
                </div>
              </div>
              <div class="ongoing-mission-card">
                <div class="mission-header">
                  <h3>Project Chimera</h3>
                  <span class="mission-timer">00:15:45</span>
                </div>
                <div class="mission-details">
                  <span class="mission-stage">Stage 1: </span>
                  <span class="current-task">Asset Recon</span>
                </div>
              </div>
              <div class="ongoing-mission-card">
                <div class="mission-header">
                  <h3>Project Nightfall</h3>
                  <span class="mission-timer">01:05:21</span>
                </div>
                <div class="mission-details">
                  <span class="mission-stage">Stage 3: </span>
                  <span class="current-task">Hostile Neutralization</span>
                </div>
              </div>
            </div>
          </div>
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

    // Initialize map
    initMap(document.getElementById('map'));

    // Initialize mission cards
    initMissionCards(container);

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
    #live-map-card {
      width: 100%;
      height: calc(100vw * 0.8);
      margin: 0;
      position: relative;
      overflow: hidden;
      mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
    }
    #map {
      width: 100%;
      height: 100%;
    }
    .map-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      color: var(--text-color);
      font-size: 1em;
      text-align: center;
    }
    #mission-card-section {
      position: relative;
      height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding-top: 20px;
      width: 100%;
      padding-left: 20px;
      padding-right: 20px;
      box-sizing: border-box;
    }
    #mission-bg-blur {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      filter: blur(25px);
      transform: scale(1.1);
      z-index: -1;
      transition: background-image 0.5s ease-in-out;
      mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
    }
    #app-cards-container {
      display: flex;
      overflow-x: scroll;
      scroll-snap-type: x mandatory;
      padding: 0 10px 20px 10px;
      gap: 20px;
      -webkit-overflow-scrolling: touch;
      margin: 0;
      width: 100%;
      box-sizing: border-box;
      perspective: 1000px;
    }
    .app-card {
      flex-shrink: 0;
      width: 280px;
      height: calc(280px / 5 * 4);
      scroll-snap-align: center;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
      position: relative;
      transition: transform 0.3s ease;
      cursor: pointer;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: flex-end;
    }
    .app-card:hover {
      transform: scale(1.05);
    }
    .app-card[data-bg-image] {
      background-image: var(--bg-image);
    }
    .app-card-content {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .app-card img {
      display: none;
    }
    .fade-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%);
      pointer-events: none;
    }
    .card-text {
      position: relative;
      padding: 20px;
      color: #fff;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
      z-index: 1;
    }
    .card-title-badge {
      font-size: 0.8em;
      font-weight: bold;
      background: var(--secondary-accent);
      color: #000;
      padding: 6px 12px;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 8px;
    }
    .card-subtitle {
      font-size: 1.5em;
      font-weight: bold;
    }
    .section-container {
      padding: 0;
      margin-top: 20px;
    }
    h2 {
      font-size: 1.2em;
      font-weight: bold;
      margin: 0 0 10px;
      color: var(--text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding-left: 20px;
    }
    #ongoing-missions-container {
      display: flex;
      overflow-x: scroll;
      scroll-snap-type: x mandatory;
      padding: 0 10px 20px 10px;
      gap: 15px;
      -webkit-overflow-scrolling: touch;
    }
    .ongoing-mission-card {
      flex-shrink: 0;
      width: 180px;
      height: calc(180px / 4 * 5);
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      box-sizing: border-box;
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      scroll-snap-align: center;
    }
    .ongoing-mission-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    }
    .mission-header {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 5px;
    }
    .mission-header h3 {
      font-size: 1.1em;
      font-weight: bold;
      margin: 0;
      color: var(--text-color);
      white-space: nowrap;
    }
    .mission-timer {
      font-size: 0.9em;
      color: var(--accent-color);
      font-weight: 500;
      padding: 3px 8px;
      background: rgba(52, 199, 89, 0.2);
      border-radius: 6px;
      margin-top: 5px;
    }
    .mission-details {
      font-size: 0.9em;
      color: var(--secondary-text-color);
    }
    .current-task {
      font-weight: bold;
      color: var(--text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .mission-stage {
      color: var(--accent-color);
      font-weight: bold;
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
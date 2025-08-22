// assets/js/activemissions.js

import { displayError } from './errors.js';

export function initActiveMissions(container) {
  try {
    // Inject active missions HTML
    container.innerHTML = `
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
    `;

    // Inject active missions CSS
    injectActiveMissionsCSS();

    setupActiveMissions(container);
  } catch (err) {
    displayError(`Failed to initialize active missions: ${err.message}`, 'ActiveMissions', 'ERR_ACTIVEMISSIONS_INIT');
  }
}

function setupActiveMissions(container) {
  try {
    const missionsContainer = container.querySelector('#ongoing-missions-container');
    if (!missionsContainer) {
      throw new Error('Ongoing missions container not found.');
    }

    // Add scroll snap behavior
    missionsContainer.addEventListener('scroll', () => {
      const containerWidth = missionsContainer.offsetWidth;
      const scrollWidth = missionsContainer.scrollWidth;
      const scrollLeft = missionsContainer.scrollLeft;

      if (scrollLeft + containerWidth >= scrollWidth - 10) {
        missionsContainer.scrollLeft = 0; // Loop back to start
      }
    });

    // Add hover effects
    const cards = missionsContainer.querySelectorAll('.ongoing-mission-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
      });
    });
  } catch (err) {
    displayError(`Active missions setup failed: ${err.message}`, 'ActiveMissions', 'ERR_ACTIVEMISSIONS_SETUP');
  }
}

function injectActiveMissionsCSS() {
  const styleId = 'activemissions-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    .section-container {
      padding: 0;
      margin-top: 20px;
    }
    h2 {
      font-size: 1.2em;
      font-weight: bold;
      margin: 0 0 10px;
      color: #f2f2f7;
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
      color: #f2f2f7;
      white-space: nowrap;
    }
    .mission-timer {
      font-size: 0.9em;
      color: #34c759;
      font-weight: 500;
      padding: 3px 8px;
      background: rgba(52, 199, 89, 0.2);
      border-radius: 6px;
      margin-top: 5px;
    }
    .mission-details {
      font-size: 0.9em;
      color: #8e8e93;
    }
    .current-task {
      font-weight: bold;
      color: #f2f2f7;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .mission-stage {
      color: #34c759;
      font-weight: bold;
    }
  `;
  document.head.appendChild(styleTag);
}
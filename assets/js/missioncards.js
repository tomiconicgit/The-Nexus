// assets/js/missioncards.js

import { displayError } from './errors.js';

export function initMissionCards(container) {
  try {
    container.innerHTML = `
      <div id="mission-card-section">
        <div id="app-cards-container">
          <div class="app-card" data-bg-image="assets/images/IMG_8857.jpeg">
            <div class="card-bg"></div>
            <div class="app-card-content">
              <div class="card-text">
                <div class="card-title-badge">INTEL</div>
                <div class="card-subtitle">Locate Stolen Nuke Codes</div>
              </div>
            </div>
          </div>
          <div class="app-card" data-bg-image="assets/images/IMG_8858.jpeg">
            <div class="card-bg"></div>
            <div class="app-card-content">
              <div class="card-text">
                <div class="card-title-badge">OP</div>
                <div class="card-subtitle">Rogue Asset Extraction</div>
              </div>
            </div>
          </div>
          <div class="app-card" data-bg-image="https://images.unsplash.com/photo-1603145731082-2e16b6d4a3f2?auto=format&fit=crop&w=400&q=80">
            <div class="card-bg"></div>
            <div class="app-card-content">
              <div class="card-text">
                <div class="card-title-badge">DATA</div>
                <div class="card-subtitle">Decrypt Encrypted Data</div>
              </div>
            </div>
          </div>
          <div class="app-card" data-bg-image="https://images.unsplash.com/photo-1603570322020-0b16eaf89335?auto=format&fit=crop&w=400&q=80">
            <div class="card-bg"></div>
            <div class="app-card-content">
              <div class="card-text">
                <div class="card-title-badge">INTEL</div>
                <div class="card-subtitle">Cyber Warfare Defense</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    injectMissionCardsCSS();

    const cardsContainer = container.querySelector('#app-cards-container');
    if (!cardsContainer) {
      throw new Error('Mission card container not found.');
    }

    setupMissionCardBackground(cardsContainer);
    setupCarousel(cardsContainer);
    setupCardAnimations(cardsContainer);
  } catch (err) {
    displayError(`Failed to initialize mission cards: ${err.message}`, 'MissionCards', 'ERR_MISSIONCARDS_INIT', true);
  }
}

function setupMissionCardBackground(container) {
  try {
    const cards = container.querySelectorAll('.app-card');
    if (cards.length === 0) {
      throw new Error('No mission cards found.');
    }

    cards.forEach(card => {
      const bg = card.querySelector('.card-bg');
      if (bg) {
        bg.style.backgroundImage = `url('${card.dataset.bgImage}')`;
      }
    });

    const updateBackground = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(containerCenter - cardCenter);
        const maxDistance = containerRect.width / 2;
        const opacity = 1 - (distance / maxDistance);
        const cardBg = card.querySelector('.card-bg');
        if (cardBg) {
          cardBg.style.opacity = Math.max(0, Math.min(1, opacity));
        }
      });
    };

    let scrollTimeout;
    container.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateBackground, 50);
    });
    
    updateBackground();
  } catch (err) {
    displayError(`Mission card background setup failed: ${err.message}`, 'MissionCards', 'ERR_CARD_BG');
  }
}

function setupCarousel(container) {
  try {
    container.addEventListener('scroll', () => {
      const containerWidth = container.offsetWidth;
      const scrollWidth = container.scrollWidth;
      const scrollLeft = container.scrollLeft;

      if (scrollLeft + containerWidth >= scrollWidth - 10) {
        container.scrollLeft = 0;
      }
    });
  } catch (err) {
    displayError(`Carousel setup failed: ${err.message}`, 'MissionCards', 'ERR_CAROUSEL');
  }
}

function setupCardAnimations(container) {
  try {
    const cards = container.querySelectorAll('.app-card');
    if (cards.length === 0) throw new Error('No mission cards found for animation.');

    const handleScroll = () => {
      const containerCenter = container.scrollLeft + container.offsetWidth / 2;
      cards.forEach(card => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = cardCenter - containerCenter;
        const maxDistance = container.offsetWidth / 2;
        const rotationY = (distance / maxDistance) * 15;
        const scale = 1 - (Math.abs(distance) / maxDistance) * 0.15;
        
        // Add a blur effect for cards that are further away from the center
        const blurAmount = (Math.abs(distance) / maxDistance) * 5;

        card.style.transform = `scale(${scale}) rotateY(${rotationY}deg)`;
        card.style.filter = `blur(${blurAmount}px)`;
      });
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll();
  } catch (err) {
    displayError(`Card animations setup failed: ${err.message}`, 'MissionCards', 'ERR_CARD_ANIM');
  }
}

function injectMissionCardsCSS() {
  const styleId = 'missioncards-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    #mission-card-section {
      position: relative;
      height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      width: 100%;
      margin-top: -50px;
      z-index: 2;
    }
    #app-cards-container {
      display: flex;
      overflow-x: scroll;
      scroll-snap-type: x mandatory;
      padding: 0;
      gap: 15px;
      -webkit-overflow-scrolling: touch;
      width: 100%;
      box-sizing: border-box;
      perspective: 1000px;
    }
    .app-card {
      flex-shrink: 0;
      width: 280px;
      height: 224px; /* Maintain 5:4 aspect ratio (280 / 5 * 4) */
      scroll-snap-align: center;
      border-radius: 20px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
      position: relative;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      display: flex;
      align-items: flex-end;
      background: rgba(255, 255, 255, 0.05); /* Lighter, more transparent background */
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .app-card:hover {
      transform: scale(1.05);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7);
    }
    .card-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      z-index: -1;
      transition: opacity 0.5s ease-in-out;
      border-radius: 20px;
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
      background: rgba(240, 160, 64, 0.7);
      color: #000;
      padding: 6px 12px;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 8px;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .card-subtitle {
      font-size: 1.5em;
      font-weight: bold;
    }
  `;
  document.head.appendChild(styleTag);
}

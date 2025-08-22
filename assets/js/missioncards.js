// assets/js/missioncards.js

import { displayError } from './errors.js';

export function initMissionCards(container) {
  try {
    container.innerHTML = `
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
    `;

    injectMissionCardsCSS();

    const cardsContainer = container.querySelector('#app-cards-container');
    const bgBlur = container.querySelector('#mission-bg-blur');
    if (!cardsContainer || !bgBlur) {
      throw new Error('Mission card container or background element not found.');
    }

    setupMissionCardBackground(cardsContainer, bgBlur);
    setupCarousel(cardsContainer);
    setupCardAnimations(cardsContainer);
  } catch (err) {
    displayError(`Failed to initialize mission cards: ${err.message}`, 'MissionCards', 'ERR_MISSIONCARDS_INIT');
  }
}

function setupMissionCardBackground(container, bgBlur) {
  try {
    const cards = container.querySelectorAll('.app-card');
    if (cards.length === 0) {
      throw new Error('No mission cards found.');
    }

    const updateBackground = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(containerCenter - cardCenter);
        const maxDistance = containerRect.width / 2;
        const opacity = 1 - (distance / maxDistance); // Linear fade based on distance
        const cardBg = card.querySelector('.card-bg');
        if (cardBg) {
          cardBg.style.opacity = Math.max(0, Math.min(1, opacity));
        }
      });
    };

    // Add background elements to each card
    cards.forEach(card => {
      const bg = document.createElement('div');
      bg.className = 'card-bg';
      bg.style.backgroundImage = `url('${card.dataset.bgImage}')`;
      card.insertBefore(bg, card.firstChild);
    });

    let scrollTimeout;
    container.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateBackground, 100);
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
        const maxDistance = container.offsetWidth / 2 + card.offsetWidth / 2;
        const rotation = (distance / maxDistance) * 15;
        card.style.transform = `rotateY(${rotation}deg) scale(1)`;
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
      padding-top: 20px;
      width: 100%;
      margin-top: -50px; /* Overlap with map fade */
      z-index: 2;
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
      mask-image: linear-gradient(to bottom, #000 0%, black 30%, black 100%); /* Fade to black at top */
      -webkit-mask-image: linear-gradient(to bottom, #000 0%, black 30%, black 100%);
    }
    #app-cards-container {
      display: flex;
      overflow-x: scroll;
      scroll-snap-type: x mandatory;
      padding: 0;
      gap: 20px;
      -webkit-overflow-scrolling: touch;
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
      display: flex;
      align-items: flex-end;
      background: transparent; /* Remove card background */
    }
    .app-card:hover {
      transform: scale(1.05);
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
      background: #f0a040;
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
  `;
  document.head.appendChild(styleTag);
}
// assets/js/missioncards.js

import { displayError } from './errors.js';

export function initMissionCards(container) {
  try {
    container.innerHTML = `
      <div id="mission-card-section">
        <div id="mission-background"></div>
        <div id="app-cards-container">
          <div class="app-card" data-bg-image-src="assets/images/IMG_8857.jpeg">
            <div class="card-bg-image"></div>
            <div class="app-card-content">
              <div class="card-text">
                <div class="card-title-badge">INTEL</div>
                <div class="card-subtitle">Locate Stolen Nuke Codes</div>
              </div>
            </div>
          </div>
          <div class="app-card" data-bg-image-src="assets/images/IMG_8858.jpeg">
            <div class="card-bg-image"></div>
            <div class="app-card-content">
              <div class="card-text">
                <div class="card-title-badge">OP</div>
                <div class="card-subtitle">Rogue Asset Extraction</div>
              </div>
            </div>
          </div>
          <div class="app-card" data-bg-image-src="https://images.unsplash.com/photo-1603145731082-2e16b6d4a3f2?auto=format&fit=crop&w=400&q=80">
            <div class="card-bg-image"></div>
            <div class="app-card-content">
              <div class="card-text">
                <div class="card-title-badge">DATA</div>
                <div class="card-subtitle">Decrypt Encrypted Data</div>
              </div>
            </div>
          </div>
          <div class="app-card" data-bg-image-src="https://images.unsplash.com/photo-1603570322020-0b16eaf89335?auto=format&fit=crop&w=400&q=80">
            <div class="card-bg-image"></div>
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
    const missionBackground = container.querySelector('#mission-background');
    if (!cardsContainer || !missionBackground) {
      throw new Error('Mission card containers not found.');
    }

    setupParallaxBackground(cardsContainer, missionBackground);
    setupCardImages(cardsContainer);
    setupCardAnimations(cardsContainer);
  } catch (err) {
    displayError(`Failed to initialize mission cards: ${err.message}`, 'MissionCards', 'ERR_MISSIONCARDS_INIT', true);
  }
}

function setupParallaxBackground(cardsContainer, missionBackground) {
  try {
    const cards = cardsContainer.querySelectorAll('.app-card');
    const bgImages = Array.from(cards).map(card => card.dataset.bg-image-src);
    
    missionBackground.style.backgroundImage = bgImages.map(url => `url('${url}')`).join(', ');
    missionBackground.style.backgroundSize = `calc(100% / ${bgImages.length}), calc(100% / ${bgImages.length}), etc.`;
    missionBackground.style.backgroundPosition = Array.from({length: bgImages.length}, (_, i) => `${i * 100}% 50%`).join(', ');

    cardsContainer.addEventListener('scroll', () => {
      const scrollPosition = cardsContainer.scrollLeft;
      missionBackground.style.transform = `translateX(-${scrollPosition * 0.7}px)`;
    });

  } catch (err) {
    displayError(`Parallax background setup failed: ${err.message}`, 'MissionCards', 'ERR_PARALLAX');
  }
}

function setupCardImages(container) {
  const cards = container.querySelectorAll('.app-card');
  cards.forEach(card => {
    const imgDiv = card.querySelector('.card-bg-image');
    if (imgDiv) {
      imgDiv.style.backgroundImage = `url('${card.dataset.bg-image-src}')`;
    }
  });
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
        
        card.style.transform = `scale(${scale}) rotateY(${rotationY}deg)`;
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
    #mission-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      z-index: 1;
      filter: blur(10px) brightness(0.7);
      transition: transform 0.2s ease-out;
    }
    #mission-background::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 0.9) 100%);
      z-index: 2;
    }
    #app-cards-container {
      display: flex;
      overflow-x: scroll;
      padding: 0;
      gap: 15px;
      -webkit-overflow-scrolling: touch;
      width: 100%;
      box-sizing: border-box;
      perspective: 1000px;
      z-index: 3;
    }
    #app-cards-container::-webkit-scrollbar {
        display: none;
    }
    .app-card {
      flex-shrink: 0;
      width: 280px;
      height: 224px;
      border-radius: 20px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
      position: relative;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      display: flex;
      align-items: flex-end;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
    }
    .app-card:hover {
      transform: scale(1.05);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7);
    }
    .card-bg-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      filter: blur(5px) brightness(0.7);
      z-index: -1;
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

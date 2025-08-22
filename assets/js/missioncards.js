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
              <div class="fade-overlay"></div>
              <div class="card-text">
                <div class="card-title-badge">INTEL</div>
                <div class="card-subtitle">Locate Stolen Nuke Codes</div>
              </div>
            </div>
          </div>
          <div class="app-card" data-bg-image="assets/images/IMG_8858.jpeg">
            <div class="card-bg"></div>
            <div class="app-card-content">
              <div class="fade-overlay"></div>
              <div class="card-text">
                <div class="card-title-badge">OP</div>
                <div class="card-subtitle">Rogue Asset Extraction</div>
              </div>
            </div>
          </div>
          <div class="app-card" data-bg-image="https://images.unsplash.com/photo-1603145731082-2e16b6d4a3f2?auto=format&fit=crop&w=400&q=80">
            <div class="card-bg"></div>
            <div class="app-card-content">
              <div class="fade-overlay"></div>
              <div class="card-text">
                <div class="card-title-badge">DATA</div>
                <div class="card-subtitle">Decrypt Encrypted Data</div>
              </div>
            </div>
          </div>
          <div class="app-card" data-bg-image="">
            <div class="card-bg"></div>
            <div class="app-card-content">
              <div class="fade-overlay"></div>
              <div class="card-text">
                <div class="card-title-badge">LOGS</div>
                <div class="card-subtitle">Review Operation Logs</div>
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
        // Correctly set the background image for each card
        const imageUrl = card.dataset.bgImage;
        if (imageUrl) {
          bg.style.backgroundImage = `url('${imageUrl}')`;
        } else {
          // Fallback to black for cards with no image
          bg.style.backgroundImage = 'none';
          bg.style.backgroundColor = 'black';
        }
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

        // Opacity based on distance from the center, for a smooth fade
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

    // Initial call to set the backgrounds
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
      width: 100%;
      margin-top: -50px; /* Overlap with map fade */
      z-index: 2;
    }
    #app-cards-container {
      display: flex;
      overflow-x: scroll;
      scroll-snap-type: x mandatory;
      padding: 0 40px; /* Added padding to the sides */
      gap: 15px;
      -webkit-overflow-scrolling: touch;
      width: 100%;
      box-sizing: border-box;
      perspective: 1000px;
      position: relative; /* Added relative positioning */
    }
    .app-card {
      flex-shrink: 0;
      width: 280px;
      height: calc(280px / 5 * 4);
      scroll-snap-align: center;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
      position: relative; /* Changed to relative */
      transition: transform 0.3s ease;
      cursor: pointer;
      display: flex;
      align-items: flex-end;
      background: transparent;
    }
    .app-card:hover {
      transform: scale(1.05);
    }
    .card-bg {
      position: absolute; /* Reverted to absolute */
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      filter: blur(25px); /* Apply the blur here */
      transform: scale(1.1);
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
      z-index: 1;
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

---

### Summary of Changes

* **HTML Structure:** The `mission-bg` element has been removed from the `innerHTML` in `initMissionCards` as it was causing issues and is not needed for this approach.
* **JavaScript Logic:** The `setupMissionCardBackground` function has been reverted to its previous logic. It now iterates through each card, finds its `card-bg` element, and sets its `backgroundImage` directly from the `data-bg-image` attribute.
* **No Image Fallback:** The JavaScript now correctly checks if `imageUrl` exists. If not, it sets the `background-image` to `none` and explicitly sets the `background-color` to `black`, ensuring cards without an image have a solid black background.
* **CSS `position`:** This is the most critical fix.
    * `.app-card` is set to `position: relative;`. This creates a new positioning context.
    * `.card-bg` is set to `position: absolute;`. This positions the `card-bg` element relative to its parent `.app-card`, so it stays inside that card and doesn't bleed across the screen.
    * `#app-cards-container` also gets `position: relative;` to ensure the scroll container's children are positioned correctly.

This revised approach ensures that each `card-bg` is tied directly to its parent card. The `opacity` logic will then fade out the backgrounds of cards as they move away from the center, creating the desired blending and transition effect.

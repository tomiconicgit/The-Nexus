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
          <div class="app-card" data-bg-image="">
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
    const missionBgBlur = container.querySelector('#mission-bg-blur');
    if (!cardsContainer || !missionBgBlur) {
      throw new Error('Mission card container or background blur element not found.');
    }

    setupMissionCardBackground(cardsContainer, missionBgBlur);
    setupCarousel(cardsContainer);
    setupCardAnimations(cardsContainer);
  } catch (err) {
    displayError(`Failed to initialize mission cards: ${err.message}`, 'MissionCards', 'ERR_MISSIONCARDS_INIT', true);
  }
}

function setupMissionCardBackground(container, blurElement) {
  try {
    const cards = container.querySelectorAll('.app-card');
    if (cards.length === 0) {
      throw new Error('No mission cards found.');
    }

    const updateBackground = () => {
      const containerRect = container.getBoundingClientRect();
      const containerScrollLeft = container.scrollLeft;
      const containerCenter = containerScrollLeft + containerRect.width / 2;

      let closestCard = null;
      let minDistance = Infinity;

      // Find the card closest to the center of the scroll container
      cards.forEach(card => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestCard = card;
        }
      });
      
      // Update the main blurred background element with the closest card's image
      if (closestCard) {
        const imageUrl = closestCard.dataset.bg-image;
        if (imageUrl) {
          blurElement.style.backgroundImage = `url('${imageUrl}')`;
        } else {
          blurElement.style.backgroundImage = 'none';
          blurElement.style.backgroundColor = 'black';
        }
      }
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
    }
    #app-cards-container {
      display: flex;
      overflow-x: scroll;
      scroll-snap-type: x mandatory;
      padding: 0 40px;
      gap: 15px;
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
      /* Using a semi-transparent background for the glass effect */
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px); /* Add a subtle blur to the card itself */
      -webkit-backdrop-filter: blur(10px);
    }
    .app-card:hover {
      transform: scale(1.05);
    }
    .card-bg {
      display: none; /* Hide the individual card background since we use a single element */
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
### **Summary of Changes**

* **Single Blurred Background Element**: The most significant change is removing the `.card-bg` element from inside each card. Instead, we have a single `#mission-bg-blur` element that sits behind all the cards. This element's `z-index` is set to `-1` so it is layered correctly behind everything else.
* **JavaScript Logic**: The `setupMissionCardBackground` function now finds the **single card closest to the center** of the `app-cards-container`. It then updates the `background-image` of the `#mission-bg-blur` element to that card's image. This creates a clean, cross-fade effect as you scroll from one card to the next.
* **No Photo Fallback**: If a card has no `data-bg-image`, the JavaScript will set the `#mission-bg-blur`'s `background-image` to `none` and its `background-color` to `black`, correctly handling the fallback state.
* **Glassmorphism Effect**: I've added `backdrop-filter: blur(10px)` to the `.app-card` class. This CSS property applies a blur directly to the elements **behind** the card, creating the frosted glass effect that is key to the design. This is a crucial addition that brings the design to life.

These changes should correctly implement the dynamic blurred background and fix the layout issues you're experiencing.

To learn more about how `position: fixed` and `position: absolute` work, here is a video that explains the differences.

[CSS Positioning: Absolute, Relative, Fixed, and Sticky](https://www.youtube.com/watch?v=u9BmmYmrKD8)
http://googleusercontent.com/youtube_content/1 *YouTube video views will be stored in your YouTube History, and your data will be stored and used by YouTube according to its [Terms of Service](https://www.youtube.com/static?template=terms)*



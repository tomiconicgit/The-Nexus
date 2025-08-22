// assets/js/navigation.js

function displayError(message, component, code) {
  console.error(`[${component} - ${code}]: ${message}`);
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = `Error: ${message}`;
  document.body.appendChild(errorElement);
}

export function initNavigation(container) {
  try {
    container.innerHTML = `
      <div id="bottom-nav">
        <div id="active-glow"></div>
        <div class="nav-item active" data-nav-id="home">
          <svg class="nav-icon home-icon" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </div>
        <div class="nav-item" data-nav-id="mail">
          <svg class="nav-icon mail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </div>
        <div class="nav-item" data-nav-id="settings">
          <svg class="nav-icon settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l1.2 1.2a.9.9 0 0 1 0 1.27l-2.9 2.9a.9.9 0 0 1-1.27 0l-1.2-1.2a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.51-1H2a.9.9 0 0 1-.9-.9v-4a.9.9 0 0 1 .9-.9h2.07a1.65 1.65 0 0 0 .15-1 1.65 1.65 0 0 0 .33-1.82l-1.2-1.2a.9.9 0 0 1 0-1.27l2.9-2.9a.9.9 0 0 1 1.27 0l1.2 1.2a1.65 1.65 0 0 0 1.82-.33 1.65 1.65 0 0 0 1.51-1V2a.9.9 0 0 1 .9-.9h4a.9.9 0 0 1 .9.9v2.07a1.65 1.65 0 0 0 1 .15c.24.03.48.09.72.18a1.65 1.65 0 0 0 .6.39l1.2-1.2a.9.9 0 0 1 1.27 0l2.9 2.9a.9.9 0 0 1 0 1.27l-1.2 1.2a1.65 1.65 0 0 0 .33 1.82 1.65 1.65 0 0 0 1.51 1H22a.9.9 0 0 1 .9.9v4a.9.9 0 0 1-.9.9z"></path></svg>
        </div>
        <div class="nav-item" data-nav-id="tools">
          <svg class="nav-icon tools-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-5.31 5.31a1.25 1.25 0 0 1-1.85-.018l-2.9-2.9a1.25 1.25 0 0 1-.018-1.85l5.31-5.31a6 6 0 0 1 7.94-7.94l-3.77 3.77z"></path></svg>
        </div>
      </div>
    `;

    injectNavigationCSS();

    const navItems = container.querySelectorAll('.nav-item');
    const activeGlow = container.querySelector('#active-glow');
    if (!navItems.length || !activeGlow) {
      throw new Error('Navigation elements not found.');
    }

    // Set initial position of the glow
    const initialActive = container.querySelector('.nav-item.active');
    updateGlowPosition(initialActive, activeGlow);

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        updateGlowPosition(item, activeGlow);
      });
    });
  } catch (err) {
    displayError(`Failed to initialize navigation: ${err.message}`, 'Navigation', 'ERR_NAVIGATION_INIT');
  }
}

function updateGlowPosition(activeItem, activeGlow) {
  const itemRect = activeItem.getBoundingClientRect();
  const navRect = activeItem.parentElement.getBoundingClientRect();
  
  const leftPosition = itemRect.left - navRect.left;
  const topPosition = itemRect.top - navRect.top;

  activeGlow.style.width = `${itemRect.width}px`;
  activeGlow.style.height = `${itemRect.height}px`;
  activeGlow.style.transform = `translate(${leftPosition}px, ${topPosition}px)`;
}

function injectNavigationCSS() {
  const styleId = 'navigation-styles';
  if (document.getElementById(styleId)) return;
  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    #bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px 0;
      background: rgba(26, 26, 26, 0.8);
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.5);
      z-index: 1000;
      height: 70px;
      position: relative;
    }
    #active-glow {
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0 0 20px 5px rgba(240, 160, 64, 0.5);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
      z-index: 1001;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex: 1;
      position: relative;
      z-index: 1003;
      transition: all 0.3s ease;
      height: 100%;
      padding: 0 5px; /* Adjust padding to make space for the glow */
    }
    .nav-icon {
      width: 28px;
      height: 28px;
      transition: all 0.3s ease-in-out;
      color: #8e8e93;
    }
    .nav-item.active .nav-icon {
      color: #f2f2f7;
      transform: scale(1.1);
    }
    .nav-item[data-nav-id="home"] .nav-icon {
        color: #f0a040; /* Distinct orange color for the home icon */
    }
  `;
  document.head.appendChild(styleTag);
}

---

### Mission Cards Redesign (Take 3)

You preferred the previous 3D animation, so I've brought it back and completely **removed the scroll-snap effect**. This eliminates the jitter you experienced and gives you the fluid, smooth scrolling you're looking for. The cards now scale up and rotate as they slide into the center of the screen, creating a dynamic, forward-moving effect that feels more like a cinematic view than a static list.

#### **Updated `missioncards.js` Code**

This code removes the `scroll-snap` properties and reintroduces a custom `scroll` event listener to drive the card's 3D animation. The background parallax remains, creating a beautiful layered effect as you scroll.

```javascript
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
          <div class="app-card" data-bg-image-src="[https://images.unsplash.com/photo-1603145731082-2e16b6d4a3f2?auto=format&fit=crop&w=400&q=80](https://images.unsplash.com/photo-1603145731082-2e16b6d4a3f2?auto=format&fit=crop&w=400&q=80)">
            <div class="card-bg-image"></div>
            <div class="app-card-content">
              <div class="card-text">
                <div class="card-title-badge">DATA</div>
                <div class="card-subtitle">Decrypt Encrypted Data</div>
              </div>
            </div>
          </div>
          <div class="app-card" data-bg-image-src="[https://images.unsplash.com/photo-1603570322020-0b16eaf89335?auto=format&fit=crop&w=400&q=80](https://images.unsplash.com/photo-1603570322020-0b16eaf89335?auto=format&fit=crop&w=400&q=80)">
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
    const bgImages = Array.from(cards).map(card => card.dataset.bgImage-src);
    
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

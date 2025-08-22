// assets/js/missioncards.js
// ... (rest of the file)
function setupMissionCardBackground(container, bgBlur) {
  try {
    const cards = container.querySelectorAll('.app-card');
    if (cards.length === 0) {
      throw new Error('No mission cards found.');
    }

    // Set the background image on the mission-card-section instead
    // of individual cards to create the blending effect.
    const missionSection = document.getElementById('mission-card-section');
    if (missionSection) {
      missionSection.style.backgroundImage = `url('${cards[0].dataset.bgImage}')`;
      missionSection.style.backgroundAttachment = 'fixed';
    }

    // This part is no longer needed because the background is on the parent container.
    // The individual card backgrounds are now for the fade-in effect on scroll.
    cards.forEach(card => {
        const bg = document.createElement('div');
        bg.className = 'card-bg';
        bg.style.backgroundImage = `url('${card.dataset.bgImage}')`;
        card.insertBefore(bg, card.firstChild);
    });

    // You still need to manage the opacity of the card's background to create the fade effect.
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
      scrollTimeout = setTimeout(updateBackground, 100);
    });
    
    updateBackground();
  } catch (err) {
    displayError(`Mission card background setup failed: ${err.message}`, 'MissionCards', 'ERR_CARD_BG');
  }
}

// ... (rest of the file)

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
      margin-top: -50px;
      z-index: 2;
      background-size: cover; /* Add this */
      background-position: center; /* Add this */
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
      mask-image: linear-gradient(to top, transparent, black 30%, black 100%);
      -webkit-mask-image: linear-gradient(to top, transparent, black 30%, black 100%);
    }
    #app-cards-container {
      display: flex;
      overflow-x: scroll;
      scroll-snap-type: x mandatory;
      padding: 0 20px; /* Add padding to sides */
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
      background: rgba(0,0,0,0); /* Set background to transparent */
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

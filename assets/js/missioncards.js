// assets/js/missioncards.js

import { displayError } from './errors.js';

export function initMissionCards(container) {
  try {
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
      let bestMatch = null;
      let minDistance = Infinity;
      
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          bestMatch = card;
        }
      });

      if (bestMatch) {
        const newImage = `url('${bestMatch.dataset.bgImage}')`;
        if (bgBlur.style.backgroundImage !== newImage) {
          bgBlur.style.backgroundImage = newImage;
          bgBlur.style.opacity = 1;
        }
      }
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

function setupCarousel(container) {
  try {
    container.addEventListener('scroll', () => {
      const cards = container.querySelectorAll('.app-card');
      const containerWidth = container.offsetWidth;
      const scrollWidth = container.scrollWidth;
      const scrollLeft = container.scrollLeft;

      if (scrollLeft + containerWidth >= scrollWidth - 10) {
        container.scrollLeft = 0; // Loop back to start
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
        const rotation = (distance / maxDistance) * 15; // Max 15 degree rotation
        card.style.transform = `rotateY(${rotation}deg) scale(1)`;
      });
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
  } catch (err) {
    displayError(`Card animations setup failed: ${err.message}`, 'MissionCards', 'ERR_CARD_ANIM');
  }
}
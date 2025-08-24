// assets/js/homescreen.js

import { displayError } from './errors.js';
import { initHeader } from './header.js';
import { initNavigation } from './navigation.js';

/**
 * Loads the home screen UI and initializes all components,
 * including the new dynamic canvas background.
 */
export async function loadHomeScreen(container) {
  try {
    injectHomeCSS();

    // Ensure viewport meta for mobile devices
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

    // Build home screen structure
    container.innerHTML = `
      <div id="homescreen-background"></div>
      <div id="home-screen">
        <div id="header-container"></div>
        <div id="main-content">
          <div class="desktop-content">
          </div>
        </div>
        <div id="navigation-container"></div>
      </div>
    `;

    // Init header and navigation
    initHeader(container.querySelector('#header-container'));
    initNavigation(container.querySelector('#navigation-container'));

    // --- Generate and animate wallpaper via code ---
    const backgroundContainer = container.querySelector('#homescreen-background');
    if (!backgroundContainer) throw new Error('Homescreen background element not found.');

    // Call the new function to create the dynamic, animated background
    createNexusBackground(backgroundContainer);

    // Scroll header effect
    const mainContent = container.querySelector('#main-content');
    const headerPill = container.querySelector('#top-header-pill');
    if (mainContent && headerPill) {
      mainContent.addEventListener('scroll', () => {
        const scrollTop = mainContent.scrollTop;
        if (scrollTop > 50) {
          headerPill.classList.add('solid');
        } else {
          headerPill.classList.remove('solid');
        }
      }, { passive: true });
    }

    // Fade in home screen
    const homeScreen = container.querySelector('#home-screen');
    if (!homeScreen) throw new Error('Home screen element not found.');
    homeScreen.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => { homeScreen.style.opacity = '1'; }, 10);

  } catch (err) {
    displayError(`Failed to load home screen: ${err.message}`, 'HomeScreen', 'ERR_HOMESCR', true);
  }
}

/**
 * Injects core CSS styles for the home screen layout.
 */
function injectHomeCSS() {
  const styleId = 'homescreen-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    ::-webkit-scrollbar { width: 0; height: 0; }
    :root {
      --text-color: #f2f2f7;
      --secondary-text-color: #8e8e93;
      --accent-color: #34c759;
      --secondary-accent: #f0a040;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      margin: 0; padding: 0;
      font-family: var(--font-family);
      color: var(--text-color);
      height: 100vh;
      overflow: hidden;
      background: #0d0d0d;
    }
    #homescreen-background {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: -2;
      /* background-image and other static properties removed */
    }
    #homescreen-background canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
    #home-screen {
      width: 100%; height: 100vh;
      display: flex; flex-direction: column;
      position: relative;
      opacity: 0;
    }
    #main-content {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 60px;
      z-index: 1;
    }
    .desktop-content {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    .desktop-icon {
      display: flex; align-items: center; justify-content: center;
      height: 80px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      color: var(--text-color);
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      transition: background 0.2s ease-in-out, transform 0.15s ease;
      backdrop-filter: blur(6px);
    }
    .desktop-icon:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }
  `;
  document.head.appendChild(styleTag);
}

// -------------------------------------------------------------------
// NEW CODE FOR DYNAMIC BACKGROUND
// -------------------------------------------------------------------

/**
 * Creates and manages a dynamic, animated desktop background for the NEXUS game.
 * The background features a subtle particle system, connecting lines, and a pulsating logo.
 * @param {HTMLElement} container The DOM element to render the canvas into.
 */
function createNexusBackground(container) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);

  let width = container.clientWidth;
  let height = container.clientHeight;
  let particles = [];
  const particleCount = 75;
  const nexusLogo = 'NEXUS';
  const logoFontSize = Math.min(Math.max(16, width / 12), 30); // Dynamic font size

  function setSize() {
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  setSize();
  window.addEventListener('resize', setSize);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Bounce off walls
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  function drawLines() {
    ctx.beginPath();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          const opacity = 1 - (distance / 100);
          ctx.strokeStyle = `rgba(52, 199, 89, ${opacity * 0.7})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
        }
      }
    }
    ctx.stroke();
  }

  function drawLogo() {
    const time = Date.now() * 0.001;
    const pulseAlpha = Math.sin(time * 2) * 0.2 + 0.5;
    ctx.textAlign = 'center';
    ctx.font = `bold ${logoFontSize}px 'Courier New', Courier, monospace`;
    ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
    ctx.fillText(nexusLogo, width / 2, height / 2 - logoFontSize);
  }

  function animate() {
    // Clear canvas and draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0b0c10');
    gradient.addColorStop(1, '#141a2a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawLines();
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLogo();

    requestAnimationFrame(animate);
  }

  // Initial call to start the animation
  animate();
}

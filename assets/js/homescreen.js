// assets/js/homescreen.js
// Purpose: Manages the home screen UI for TitanOS, including background, header, navigation, and map integration.
// Dependencies: ./errors.js (for error handling), ./header.js, ./navigation.js, ./map.js.
// Notes:
// - Simulates a desktop-like environment with a dynamic wallpaper, responsive layout, and integrated map.
// - Optimized for PWA compliance and iOS Safari, targeting ~60fps.
// - Step 24 Notes: Added map integration above main content.

import { displayError } from './errors.js';
import { initHeader } from './header.js';
import { initNavigation } from './navigation.js';
import { initMap } from './map.js';

export async function loadHomeScreen(container) {
  try {
    injectHomeCSS();

    // Ensure viewport meta
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
        <div id="map-container"></div>
        <div id="main-content">
          <div class="desktop-content">
          </div>
        </div>
        <div id="navigation-container"></div>
      </div>
    `;

    // Init header, navigation, and map
    initHeader(container.querySelector('#header-container'));
    initNavigation(container.querySelector('#navigation-container'));
    initMap(container);

    // --- Generate enhanced wallpaper ---
    const background = container.querySelector('#homescreen-background');
    if (!background) throw new Error('Homescreen background element not found.');

    const wallpaperURL = generateAgencyWallpaper({
      width: Math.max(window.innerWidth, 1280),
      height: Math.max(window.innerHeight, 720),
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      baseColors: ['#0a0e1a', '#1a2a3d', '#2d4060', '#3a5578'],
      accent: '#34c759',
      gridType: 'hexagon',
      gridSize: 64,
      gridOpacity: 0.08,
      vignette: 0.55,
      noiseOpacity: 0.025,
      emblemOpacity: 0.12,
      emblemText: 'NEXUS',
      emblemSubtext: 'TitanOS Core',
      streakCount: 8,
      particleCount: 20
    });

    background.style.backgroundImage = `url(${wallpaperURL})`;
    background.setAttribute('loading', 'lazy');
    background.classList.add('loaded');

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
      background-size: cover;
      background-position: center;
      opacity: 0.9;
      transition: opacity .4s ease;
    }
    #homescreen-background.loaded { opacity: 1; }
    #home-screen {
      width: 100%; height: 100vh;
      display: flex; flex-direction: column;
      position: relative;
      opacity: 0;
    }
    #map-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0;
      padding-top: 80%; /* 5:4 aspect ratio */
      z-index: 0;
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    #main-content {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding-top: 80%; /* Offset for map */
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

// --- ENHANCED WALLPAPER GENERATION ---
function generateAgencyWallpaper(opts = {}) {
  const {
    width = 1920, height = 1080, dpr = 1,
    baseColors = ['#0a0e1a', '#1a2a3d', '#2d4060', '#3a5578'],
    accent = '#34c759',
    gridType = 'hexagon', gridSize = 64, gridOpacity = 0.08,
    vignette = 0.55, noiseOpacity = 0.025,
    emblemOpacity = 0.12, emblemText = 'NEXUS', emblemSubtext = 'TitanOS Core',
    streakCount = 8, particleCount = 20
  } = opts;

  const W = Math.round(width * dpr);
  const H = Math.round(height * dpr);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  // Multi-stop cosmic gradient
  const g = ctx.createLinearGradient(0, 0, W, H);
  baseColors.forEach((color, i) => g.addColorStop(i / (baseColors.length - 1), color));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // Subtle hexagonal grid
  if (gridType === 'hexagon') {
    ctx.save();
    ctx.globalAlpha = gridOpacity;
    ctx.strokeStyle = hexToRGBA('#ffffff', 0.35);
    ctx.lineWidth = Math.max(1, Math.round(dpr * 0.5));
    const hexSize = gridSize * dpr;
    for (let x = 0; x < W; x += hexSize * 1.5) {
      for (let y = 0; y < H; y += hexSize * Math.sqrt(3)) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const px = x + hexSize * Math.cos(angle);
          const py = y + hexSize * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Light streaks
  ctx.save();
  for (let i = 0; i < streakCount; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const length = Math.random() * 200 * dpr + 100 * dpr;
    const angle = Math.random() * Math.PI * 2;
    const gradient = ctx.createLinearGradient(x, y, x + length * Math.cos(angle), y + length * Math.sin(angle));
    gradient.addColorStop(0, hexToRGBA(accent, 0.15));
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.4;
    ctx.fillRect(x, y, length * Math.cos(angle), length * Math.sin(angle));
  }
  ctx.restore();

  // Particles
  ctx.save();
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = Math.random() * 2 * dpr + 1 * dpr;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = hexToRGBA(accent, Math.random() * 0.3 + 0.1);
    ctx.globalAlpha = 0.7;
    ctx.fill();
  }
  ctx.restore();

  // Emblem with subtle pulse animation
  ctx.save();
  const cx = W / 2, cy = H / 2;
  const baseR = Math.min(W, H) * 0.22;
  ctx.globalAlpha = emblemOpacity;
  const pulse = (Math.sin(Date.now() / 300) + 1) / 4 + 0.75; // Subtle pulsing
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(cx, cy, baseR * pulse + i * 26 * dpr, 0, Math.PI * 2);
    ctx.strokeStyle = hexToRGBA('#ffffff', 0.25);
    ctx.lineWidth = 2 * dpr;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(cx - baseR * pulse, cy);
  ctx.lineTo(cx + baseR * pulse, cy);
  ctx.moveTo(cx, cy - baseR * pulse);
  ctx.lineTo(cx, cy + baseR * pulse);
  ctx.stroke();

  // Emblem text
  ctx.fillStyle = hexToRGBA('#ffffff', 0.75);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${Math.round(28 * dpr)}px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif`;
  ctx.fillText(emblemText, cx, cy - 6 * dpr);
  ctx.fillStyle = hexToRGBA('#ffffff', 0.45);
  ctx.font = `${Math.round(13 * dpr)}px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif`;
  ctx.fillText(emblemSubtext, cx, cy + 16 * dpr);
  ctx.restore();

  // Enhanced vignette
  const vg = ctx.createRadialGradient(cx, cy, Math.min(W, H) * 0.1, cx, cy, Math.max(W, H) * 0.85);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, `rgba(0,0,0,${vignette})`);
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  // Fine noise
  if (noiseOpacity > 0) {
    const n = 196;
    const nc = document.createElement('canvas');
    nc.width = n; nc.height = n;
    const nctx = nc.getContext('2d');
    const nimg = nctx.createImageData(n, n);
    for (let i = 0; i < n * n * 4; i += 4) {
      const v = 200 + (Math.random() * 55) | 0;
      nimg.data[i] = v; nimg.data[i + 1] = v; nimg.data[i + 2] = v; nimg.data[i + 3] = 255;
    }
    nctx.putImageData(nimg, 0, 0);
    const pattern = ctx.createPattern(nc, 'repeat');
    ctx.save();
    ctx.globalAlpha = noiseOpacity;
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  try { return c.toDataURL('image/webp', 0.9); }
  catch { return c.toDataURL('image/png'); }

  function hexToRGBA(hex, a = 1) {
    const h = hex.replace('#', '');
    const bigint = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16);
    const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
    return `rgba(${r},${g},${b},${a})`;
  }
}
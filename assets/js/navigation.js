// assets/js/navigation.js

function displayError(message, component, code) {
  console.error(`[${component} - ${code}]: ${message}`);
}

export function initNavigation(container) {
  try {
    container.innerHTML = `
      <div id="bottom-nav">
        <div class="nav-item active" data-nav-id="home">
          <div class="app-icon-container home-app">
            <span class="app-label-text">HOME</span>
          </div>
        </div>
        <div class="nav-item" data-nav-id="tools">
          <div class="app-icon-container tools-app">
            <svg class="app-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </div>
        </div>
        <div class="nav-item" data-nav-id="mail">
          <div class="app-icon-container mail-app">
            <svg class="app-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </div>
        </div>
        <div class="nav-item" data-nav-id="settings">
          <div class="app-icon-container settings-app">
            <svg class="app-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M14.31 8a6 6 0 0 1 0 8.82m-4.64-8.82a6 6 0 0 1 0 8.82m-2.12-4.41a6 6 0 0 1 8.82 0m4.41 2.12a6 6 0 0 1-8.82 0"></path></svg>
          </div>
        </div>
      </div>
    `;

    injectNavigationCSS();

    const navItems = container.querySelectorAll('.nav-item');
    if (!navItems.length) {
      throw new Error('Navigation elements not found.');
    }

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });
  } catch (err) {
    displayError(`Failed to initialize navigation: ${err.message}`, 'Navigation', 'ERR_NAVIGATION_INIT');
  }
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
      height: 100px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0;
      background: rgba(26, 26, 26, 0.8);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      color: #f2f2f7;
      text-decoration: none;
      transition: transform 0.2s ease-in-out;
    }
    .nav-item:hover {
      transform: scale(1.05);
    }
    .app-icon-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 65px;
      height: 65px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      position: relative;
      overflow: hidden;
    }
    
    /* Global App Icon Styling */
    .app-icon-container {
        border: 2px solid rgba(255, 255, 255, 0.4);
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.01) 100%);
        backdrop-filter: blur(15px);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
    }
    .app-icon {
        width: 35px;
        height: 35px;
        fill: none;
    }
    .app-label-text {
        font-weight: bold;
        font-size: 16px;
        letter-spacing: 1px;
    }
    
    /* Specific App Styles */
    .home-app .app-label-text {
      background: linear-gradient(145deg, #f2f2f7 0%, #a0a0a0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .tools-app .app-icon {
      stroke: url(#tools-gradient);
    }

    .mail-app .app-icon {
      fill: url(#mail-gradient);
    }

    .settings-app .app-icon {
      stroke: url(#settings-gradient);
    }

    /* Gradients for SVG icons */
    .svg-gradients {
      position: absolute;
      width: 0;
      height: 0;
    }

    .nav-label {
      display: none; /* Hide the text label below the app */
    }

    /* SVG definitions (add to HTML) */
    .svg-defs {
        display: none;
    }
  `;
  document.head.appendChild(styleTag);
  
  // Create and inject SVG gradients
  const svgDefs = `
    <svg class="svg-defs">
      <defs>
        <linearGradient id="tools-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#9EF01A;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00C7BE;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="mail-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#5E5CE6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3478F6;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="settings-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8E8E93;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#6B6B6B;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>
  `;
  document.body.insertAdjacentHTML('beforeend', svgDefs);
}

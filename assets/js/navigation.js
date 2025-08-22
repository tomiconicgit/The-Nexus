// assets/js/navigation.js

function displayError(message, component, code) {
  console.error(`[${component} - ${code}]: ${message}`);
}

export function initNavigation(container) {
  try {
    container.innerHTML = `
      <div id="bottom-nav">
        <div id="nav-dock">
          <div class="nav-item active" data-nav-id="home">
            <div class="app-icon-container">
              <div class="app-content-home"></div>
            </div>
          </div>
          <div class="nav-item" data-nav-id="tools">
            <div class="app-icon-container">
              <svg class="app-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-5.31 5.31a1.25 1.25 0 0 1-1.85-.018l-2.9-2.9a1.25 1.25 0 0 1-.018-1.85l5.31-5.31a6 6 0 0 1 7.94-7.94l-3.77 3.77z"></path></svg>
            </div>
          </div>
          <div class="nav-item" data-nav-id="mail">
            <div class="app-icon-container">
              <svg class="app-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
          </div>
          <div class="nav-item" data-nav-id="settings">
            <div class="app-icon-container">
              <svg class="app-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l1.2 1.2a.9.9 0 0 1 0 1.27l-2.9 2.9a.9.9 0 0 1-1.27 0l-1.2-1.2a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.51-1H2a.9.9 0 0 1-.9-.9v-4a.9.9 0 0 1 .9-.9h2.07a1.65 1.65 0 0 0 .15-1 1.65 1.65 0 0 0 .33-1.82l-1.2-1.2a.9.9 0 0 1 0-1.27l2.9-2.9a.9.9 0 0 1 1.27 0l1.2 1.2a1.65 1.65 0 0 0 1.82-.33 1.65 1.65 0 0 0 1.51-1V2a.9.9 0 0 1 .9-.9h4a.9.9 0 0 1 .9.9v2.07a1.65 1.65 0 0 0 1 .15c.24.03.48.09.72.18a1.65 1.65 0 0 0 .6.39l1.2-1.2a.9.9 0 0 1 1.27 0l2.9 2.9a.9.9 0 0 1 0 1.27l-1.2 1.2a1.65 1.65 0 0 0 .33 1.82 1.65 1.65 0 0 0 1.51 1H22a.9.9 0 0 1 .9.9v4a.9.9 0 0 1-.9.9z"></path></svg>
            </div>
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
      bottom: 20px;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 0;
      z-index: 1000;
      pointer-events: none;
    }
    #nav-dock {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 95%;
      height: 70px;
      max-width: 350px;
      padding: 5px 0;
      background: rgba(26, 26, 26, 0.8);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
      pointer-events: auto;
    }
    .nav-item {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px;
      position: relative;
    }
    .app-icon-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 55px;
      height: 55px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      overflow: hidden;
      transition: transform 0.2s ease-in-out;
    }
    .nav-item.active .app-icon-container {
      transform: scale(1.1);
    }
    .app-icon {
        width: 30px;
        height: 30px;
        color: white;
    }
    .app-content-home {
        width: 100%;
        height: 100%;
        background-color: #555;
        background-image: linear-gradient(135deg, #f0f0f0 0%, #dcdcdc 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 10px;
        font-weight: bold;
        color: black;
    }
    .app-icon[data-nav-id="tools"] {
      color: #90ee90;
    }
    .app-icon[data-nav-id="mail"] {
      color: #4169e1;
    }
    .app-icon[data-nav-id="settings"] {
      color: #a9a9a9;
    }
  `;
  document.head.appendChild(styleTag);
}

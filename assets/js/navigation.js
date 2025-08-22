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
          <span class="nav-label">Home</span>
        </div>
        <div class="nav-item" data-nav-id="tools">
          <div class="app-icon-container tools-app">
            <svg class="app-icon" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-5.31 5.31a1.25 1.25 0 0 1-1.85-.018l-2.9-2.9a1.25 1.25 0 0 1-.018-1.85l5.31-5.31a6 6 0 0 1 7.94-7.94l-3.77 3.77z"></path></svg>
          </div>
          <span class="nav-label">Tools</span>
        </div>
        <div class="nav-item" data-nav-id="mail">
          <div class="app-icon-container mail-app">
            <svg class="app-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </div>
          <span class="nav-label">Mail</span>
        </div>
        <div class="nav-item" data-nav-id="settings">
          <div class="app-icon-container settings-app">
            <svg class="app-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l1.2 1.2a.9.9 0 0 1 0 1.27l-2.9 2.9a.9.9 0 0 1-1.27 0l-1.2-1.2a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.51-1H2a.9.9 0 0 1-.9-.9v-4a.9.9 0 0 1 .9-.9h2.07a1.65 1.65 0 0 0 .15-1 1.65 1.65 0 0 0 .33-1.82l-1.2-1.2a.9.9 0 0 1 0-1.27l2.9-2.9a.9.9 0 0 1 1.27 0l1.2 1.2a1.65 1.65 0 0 0 1.82-.33 1.65 1.65 0 0 0 1.51-1V2a.9.9 0 0 1 .9-.9h4a.9.9 0 0 1 .9.9v2.07a1.65 1.65 0 0 0 1 .15c.24.03.48.09.72.18a1.65 1.65 0 0 0 .6.39l1.2-1.2a.9.9 0 0 1 1.27 0l2.9 2.9a.9.9 0 0 1 0 1.27l-1.2 1.2a1.65 1.65 0 0 0 .33 1.82 1.65 1.65 0 0 0 1.51 1H22a.9.9 0 0 1 .9.9v4a.9.9 0 0 1-.9.9z"></path></svg>
          </div>
          <span class="nav-label">Settings</span>
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
      height: 100px; /* Increased height to expand upwards */
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
    
    /* Home App Styling */
    .home-app {
        background: linear-gradient(145deg, rgba(0, 0, 0, 0.7) 0%, rgba(20, 20, 20, 0.9) 100%);
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .app-label-text {
        color: white;
        font-weight: bold;
        font-size: 14px;
        letter-spacing: 1px;
    }

    /* Tools App Styling */
    .tools-app {
        background: linear-gradient(145deg, rgba(0, 0, 0, 0.7) 0%, rgba(20, 20, 20, 0.9) 100%);
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .tools-app .app-icon {
        color: #2EDC6F;
        filter: drop-shadow(0 0 5px #2EDC6F) brightness(1.2);
    }

    /* Mail App Styling */
    .mail-app {
        background: linear-gradient(145deg, rgba(0, 0, 0, 0.7) 0%, rgba(20, 20, 20, 0.9) 100%);
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .mail-app .app-icon {
        color: #007AFF;
        filter: drop-shadow(0 0 5px #007AFF) brightness(1.2);
    }
    
    /* Settings App Styling */
    .settings-app {
        background: linear-gradient(145deg, rgba(0, 0, 0, 0.7) 0%, rgba(20, 20, 20, 0.9) 100%);
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .settings-app .app-icon {
        color: #8E8E93;
        filter: drop-shadow(0 0 5px #8E8E93) brightness(1.2);
    }

    .app-icon {
      width: 35px;
      height: 35px;
    }
    .nav-label {
      font-size: 0.8em;
      font-weight: 500;
      color: #8e8e93;
    }
    .nav-item.active .nav-label {
      color: #f2f2f7;
    }
  `;
  document.head.appendChild(styleTag);
}

// assets/js/navigation.js

function displayError(message, component, code) {
  console.error(`[${component} - ${code}]: ${message}`);
}

export function initNavigation(container) {
  try {
    container.innerHTML = `
      <div id="bottom-nav">
        <div id="taskbar">
          <div id="start-button">Start</div>
          <div class="taskbar-app" data-nav-id="tools">
            <svg class="app-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-5.31 5.31a1.25 1.25 0 0 1-1.85-.018l-2.9-2.9a1.25 1.25 0 0 1-.018-1.85l5.31-5.31a6 6 0 0 1 7.94-7.94l-3.77 3.77z"></path></svg>
          </div>
          <div class="taskbar-app" data-nav-id="mail">
            <svg class="app-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </div>
          <div class="taskbar-app" data-nav-id="settings">
            <svg class="app-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l1.2 1.2a.9.9 0 0 1 0 1.27l-2.9 2.9a.9.9 0 0 1-1.27 0l-1.2-1.2a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.51-1H2a.9.9 0 0 1-.9-.9v-4a.9.9 0 0 1 .9-.9h2.07a1.65 1.65 0 0 0 .15-1 1.65 1.65 0 0 0 .33-1.82l-1.2-1.2a.9.9 0 0 1 0-1.27l2.9-2.9a.9.9 0 0 1 1.27 0l1.2 1.2a1.65 1.65 0 0 0 1.82-.33 1.65 1.65 0 0 0 1.51-1V2a.9.9 0 0 1 .9-.9h4a.9.9 0 0 1 .9.9v2.07a1.65 1.65 0 0 0 1 .15c.24.03.48.09.72.18a1.65 1.65 0 0 0 .6.39l1.2-1.2a.9.9 0 0 1 1.27 0l2.9 2.9a.9.9 0 0 1 0 1.27l-1.2 1.2a1.65 1.65 0 0 0 .33 1.82 1.65 1.65 0 0 0 1.51 1H22a.9.9 0 0 1 .9.9v4a.9.9 0 0 1-.9.9z"></path></svg>
          </div>
        </div>
        <div id="tray-menu" style="display: none;">
          </div>
      </div>
    `;

    injectNavigationCSS();

    const startButton = document.getElementById('start-button');
    const trayMenu = document.getElementById('tray-menu');

    startButton.addEventListener('click', () => {
      trayMenu.style.display = trayMenu.style.display === 'none' ? 'block' : 'none';
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
      z-index: 1000;
    }
    #taskbar {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 90%;
      height: 50px;
      max-width: 400px;
      background: rgba(26, 26, 26, 0.7);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
      padding: 0 10px;
    }
    #start-button {
      padding: 5px 15px;
      border-radius: 8px;
      background: rgba(100, 100, 100, 0.3);
      color: #fff;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
      margin-right: auto;
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      transition: background 0.2s ease-in-out;
    }
    #start-button:hover {
      background: rgba(100, 100, 100, 0.5);
    }
    .taskbar-app {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      width: 40px;
      margin: 0 5px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: background 0.2s ease-in-out;
    }
    .taskbar-app:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    .app-icon {
      width: 25px;
      height: 25px;
      color: #fff;
    }
    #tray-menu {
      position: absolute;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 400px;
      height: 300px;
      background: rgba(26, 26, 26, 0.9);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.6);
      padding: 10px;
      z-index: 999;
      display: none;
    }
  `;
  document.head.appendChild(styleTag);
}

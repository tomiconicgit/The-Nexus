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
        <div class="nav-item active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5L2 12h3v8h6v-6h2v6h6v-8h3L12 2.5z"/></svg>
          <span class="nav-label">Home</span>
        </div>
        <div class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M21 18V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM5 19V5h14v14H5zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
          <span class="nav-label">Wallet</span>
        </div>
        <div class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1.01c-.52-.39-1.09-.72-1.71-.99l-.37-2.65c-.06-.24-.27-.42-.5-.42h-4c-.27 0-.48.18-.54.42l-.37 2.65c-.62.27-1.2.6-1.71.99l-2.49-1.01c-.22-.08-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.39 1.09.72 1.71.99l.37 2.65c.06.24.27.42.5.42h4c.23 0 .44-.18.5-.42l.37-2.65c.62-.27 1.2-.6 1.71-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
          <span class="nav-label">Settings</span>
        </div>
      </div>
    `;

    injectNavigationCSS();
    setupNavigation(container);
  } catch (err) {
    displayError(`Failed to initialize navigation: ${err.message}`, 'Navigation', 'ERR_NAVIGATION_INIT');
  }
}

function setupNavigation(container) {
  try {
    const navItems = container.querySelectorAll('.nav-item');
    if (!navItems.length) {
      throw new Error('No navigation items found.');
    }

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });
  } catch (err) {
    displayError(`Navigation setup failed: ${err.message}`, 'Navigation', 'ERR_NAVIGATION_SETUP');
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
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 30px);
      max-width: 600px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px;
      background: rgba(26, 26, 26, 0.8);
      border-radius: 40px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
      z-index: 1000;
      transition: all 0.3s ease-in-out;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #8e8e93;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease-in-out;
      cursor: pointer;
      flex: 1;
      gap: 5px;
    }
    .nav-item.active {
      color: #f2f2f7;
    }
    .nav-item:hover {
      color: #f2f2f7;
    }
    .nav-item.active .nav-icon {
      background: rgba(52, 199, 89, 0.15);
      box-shadow: 0 0 10px rgba(52, 199, 89, 0.7), inset 0 0 5px rgba(52, 199, 89, 0.5);
      transform: scale(1.1);
      border-radius: 12px;
      padding: 10px;
    }
    .nav-icon {
      font-size: 20px;
      width: 24px;
      height: 24px;
      transition: all 0.3s ease-in-out;
    }
    .nav-label {
      font-size: 0.7em;
      opacity: 0.8;
      transition: opacity 0.3s ease-in-out;
    }
  `;
  document.head.appendChild(styleTag);
}

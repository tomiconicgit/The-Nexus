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
        <div id="nav-pill"></div>
        <div class="nav-item active">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5L2 12h3v8h6v-6h2v6h6v-8h3L12 2.5z"/></svg>
          <div class="nav-label">Home</div>
        </div>
        <div class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M21 18V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM5 19V5h14v14H5zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
          <div class="nav-label">Mail</div>
        </div>
        <div class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1.01c-.52-.39-1.09-.72-1.71-.99l-.37-2.65c-.06-.24-.27-.42-.5-.42h-4c-.27 0-.48.18-.54.42l-.37 2.65c-.62.27-1.2.6-1.71.99l-2.49-1.01c-.22-.08-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.39 1.09.72 1.71.99l.37 2.65c.06.24.27.42.5.42h4c.23 0 .44-.18.5-.42l.37-2.65c.62-.27 1.2-.6 1.71-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
          <div class="nav-label">Settings</div>
        </div>
        <div class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 19.1c-.2.2-.4.3-.7.3s-.5-.1-.7-.3l-2.5-2.5-2.5 2.5c-.2.2-.4.3-.7.3s-.5-.1-.7-.3c-.4-.4-.4-1 0-1.4l2.5-2.5-2.5-2.5c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l2.5 2.5 2.5-2.5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L19.5 15l2.5 2.5c.4.4.4 1 0 1.4zm-14-11.4c-1.5 0-2.8 1.1-3 2.6h-2.5c-.6 0-1 .4-1 1s.4 1 1 1h2.5c.2 1.5 1.5 2.6 3 2.6s2.8-1.1 3-2.6h2.5c.6 0 1-.4 1-1s-.4-1-1-1h-2.5c-.2-1.5-1.5-2.6-3-2.6zm-1.5 3c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/></svg>
          <div class="nav-label">Tools</div>
        </div>
      </div>
    `;

    injectNavigationCSS();

    const navItems = container.querySelectorAll('.nav-item');
    const navPill = container.querySelector('#nav-pill');
    if (!navItems.length || !navPill) {
      throw new Error('Navigation elements not found.');
    }

    // Set initial position of the pill on page load
    const initialActive = container.querySelector('.nav-item.active');
    updatePillPosition(initialActive, navPill);

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        updatePillPosition(item, navPill);
      });
    });
  } catch (err) {
    displayError(`Failed to initialize navigation: ${err.message}`, 'Navigation', 'ERR_NAVIGATION_INIT');
  }
}

function updatePillPosition(activeItem, navPill) {
  const itemRect = activeItem.getBoundingClientRect();
  const navRect = activeItem.parentElement.getBoundingClientRect();
  
  const leftPosition = itemRect.left - navRect.left + (itemRect.width / 2);

  navPill.style.transform = `translateX(${leftPosition}px)`;
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
    #nav-pill {
      position: absolute;
      bottom: 8px;
      height: 6px;
      width: 30px;
      background: #f2f2f7;
      border-radius: 3px;
      transform: translateX(0);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1001;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #8e8e93;
      cursor: pointer;
      flex: 1;
      padding: 10px 0;
      position: relative;
      z-index: 1002;
      transition: color 0.3s ease;
    }
    .nav-item.active {
      color: #f2f2f7;
    }
    .nav-icon {
      width: 24px;
      height: 24px;
      transition: all 0.3s ease-in-out;
    }
    .nav-label {
      font-size: 10px;
      font-weight: bold;
      margin-top: 4px;
    }
  `;
  document.head.appendChild(styleTag);
}

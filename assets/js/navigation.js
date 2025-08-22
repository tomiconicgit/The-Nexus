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
        <div id="active-pill"></div>
        <div class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5L2 12h3v8h6v-6h2v6h6v-8h3L12 2.5z"/></svg>
        </div>
        <div class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M21 18V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM5 19V5h14v14H5zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
        </div>
        <div class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1.01c-.52-.39-1.09-.72-1.71-.99l-.37-2.65c-.06-.24-.27-.42-.5-.42h-4c-.27 0-.48.18-.54.42l-.37 2.65c-.62.27-1.2.6-1.71.99l-2.49-1.01c-.22-.08-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.39 1.09.72 1.71.99l.37 2.65c.06.24.27.42.5.42h4c.23 0 .44-.18.5-.42l.37-2.65c.62-.27 1.2-.6 1.71-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
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
    const activePill = container.querySelector('#active-pill');
    if (!navItems.length || !activePill) {
      throw new Error('Navigation items or active pill not found.');
    }

    // Set initial active item
    const initialActive = navItems[1]; // Set the middle button as active by default
    initialActive.classList.add('active');
    updatePillPosition(initialActive, activePill);

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        updatePillPosition(item, activePill);
      });
    });
  } catch (err) {
    displayError(`Navigation setup failed: ${err.message}`, 'Navigation', 'ERR_NAVIGATION_SETUP');
  }
}

function updatePillPosition(activeItem, activePill) {
  const itemRect = activeItem.getBoundingClientRect();
  const navRect = activeItem.parentElement.getBoundingClientRect();
  
  const pillWidth = itemRect.width * 0.9;
  const pillHeight = itemRect.height * 0.9;

  const leftPosition = itemRect.left - navRect.left + (itemRect.width - pillWidth) / 2;
  const topPosition = (navRect.height - pillHeight) / 2;

  activePill.style.width = `${pillWidth}px`;
  activePill.style.height = `${pillHeight}px`;
  activePill.style.transform = `translate(${leftPosition}px, ${topPosition}px)`;
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
    #active-pill {
      position: absolute;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border-radius: 50px;
      box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1), 0 5px 20px rgba(0, 0, 0, 0.5);
      z-index: 1001;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
    .nav-item:hover {
      color: #f2f2f7;
    }
    .nav-icon {
      width: 24px;
      height: 24px;
      transition: all 0.3s ease-in-out;
    }
  `;
  document.head.appendChild(styleTag);
}

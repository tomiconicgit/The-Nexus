// assets/js/navigation.js

function displayError(message, component, code) {
  console.error(`[${component} - ${code}]: ${message}`);
}

export function initNavigation(container) {
  try {
    container.innerHTML = `
      <div id="bottom-nav">
        <div class="nav-item active" data-nav-id="home">
          <div class="app-icon-container">
            <img src="assets/images/home-icon.png" alt="Home" class="nav-icon">
          </div>
          <span class="nav-label">Home</span>
        </div>
        <div class="nav-item" data-nav-id="tools">
          <div class="app-icon-container">
            <img src="assets/images/tools-icon.png" alt="Tools" class="nav-icon">
          </div>
          <span class="nav-label">Tools</span>
        </div>
        <div class="nav-item" data-nav-id="mail">
          <div class="app-icon-container">
            <img src="assets/images/mail-icon.png" alt="Mail" class="nav-icon">
          </div>
          <span class="nav-label">Mail</span>
        </div>
        <div class="nav-item" data-nav-id="settings">
          <div class="app-icon-container">
            <img src="assets/images/settings-icon.png" alt="Settings" class="nav-icon">
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
      height: 60px;
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
      width: 45px;
      height: 45px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05); /* Very light, almost transparent background */
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
    }
    .nav-icon {
      width: 28px;
      height: 28px;
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

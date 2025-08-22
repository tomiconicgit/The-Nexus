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
        <div class="nav-item active" data-nav-id="home">
          <svg class="nav-icon home-icon" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </div>
        <div class="nav-item" data-nav-id="mail">
          <svg class="nav-icon mail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </div>
        <div class="nav-item" data-nav-id="settings">
          <svg class="nav-icon settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l1.2 1.2a.9.9 0 0 1 0 1.27l-2.9 2.9a.9.9 0 0 1-1.27 0l-1.2-1.2a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.51-1H2a.9.9 0 0 1-.9-.9v-4a.9.9 0 0 1 .9-.9h2.07a1.65 1.65 0 0 0 .15-1 1.65 1.65 0 0 0 .33-1.82l-1.2-1.2a.9.9 0 0 1 0-1.27l2.9-2.9a.9.9 0 0 1 1.27 0l1.2 1.2a1.65 1.65 0 0 0 1.82-.33 1.65 1.65 0 0 0 1.51-1V2a.9.9 0 0 1 .9-.9h4a.9.9 0 0 1 .9.9v2.07a1.65 1.65 0 0 0 1 .15c.24.03.48.09.72.18a1.65 1.65 0 0 0 .6.39l1.2-1.2a.9.9 0 0 1 1.27 0l2.9 2.9a.9.9 0 0 1 0 1.27l-1.2 1.2a1.65 1.65 0 0 0 .33 1.82 1.65 1.65 0 0 0 1.51 1H22a.9.9 0 0 1 .9.9v4a.9.9 0 0 1-.9.9z"></path></svg>
        </div>
        <div class="nav-item" data-nav-id="tools">
          <svg class="nav-icon tools-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-5.31 5.31a1.25 1.25 0 0 1-1.85-.018l-2.9-2.9a1.25 1.25 0 0 1-.018-1.85l5.31-5.31a6 6 0 0 1 7.94-7.94l-3.77 3.77z"></path></svg>
        </div>
      </div>
    `;

    injectNavigationCSS();

    const navItems = container.querySelectorAll('.nav-item');
    const navPill = container.querySelector('#nav-pill');
    if (!navItems.length || !navPill) {
      throw new Error('Navigation elements not found.');
    }

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
  
  const pillWidth = itemRect.width * 0.9;
  const leftPosition = itemRect.left - navRect.left + (itemRect.width - pillWidth) / 2;

  navPill.style.width = `${pillWidth}px`;
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
      top: 5px;
      bottom: 5px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border-radius: 50px;
      box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1), 0 5px 20px rgba(0, 0, 0, 0.5);
      z-index: 1002;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex: 1;
      position: relative;
      z-index: 1003;
      transition: color 0.3s ease;
      height: 100%;
    }
    .nav-icon {
      width: 28px;
      height: 28px;
      transition: all 0.3s ease-in-out;
      color: #8e8e93;
    }
    .nav-item.active .nav-icon {
      color: #f2f2f7;
    }
    .nav-item[data-nav-id="home"] .nav-icon {
        color: #f0a040; /* Distinct orange color for the home icon */
    }
    .nav-item[data-nav-id="home"].active .nav-icon {
        color: #f2f2f7; /* Keep white when active */
    }
  `;
  document.head.appendChild(styleTag);
}

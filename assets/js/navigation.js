// assets/js/navigation.js

function displayError(message, component, code) {
  console.error(`[${component} - ${code}]: ${message}`);
}

export function initNavigation(container) {
  try {
    container.innerHTML = `
      <div id="taskbar">
        <button id="start-button">Start</button>
        <div id="task-icons">
          <div class="task-icon">🌐</div>
          <div class="task-icon">📂</div>
          <div class="task-icon">💻</div>
        </div>
        <div id="system-tray">
          <span id="clock">09:41</span>
        </div>
      </div>

      <div id="start-menu" class="hidden">
        <ul>
          <li>Mission Control</li>
          <li>Encrypted Terminal</li>
          <li>Global Map</li>
          <li>Data Vault</li>
          <li>Agency Mail</li>
        </ul>
      </div>
    `;

    injectNavigationCSS();
    initClock();
    initStartMenu();
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
    /* Taskbar */
    #taskbar {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      background: rgba(15, 15, 15, 0.95);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(6px);
      font-family: monospace;
      z-index: 1000;
    }

    /* Start Button */
    #start-button {
      height: 100%;
      width: 90px;
      margin: 0;
      padding: 0;
      background: linear-gradient(145deg, #1a73e8, #185abc);
      border: none;
      color: white;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
      overflow: hidden;
      position: relative;
      border-right: 1px solid rgba(255,255,255,0.2);
      box-shadow: inset 0 0 4px rgba(255,255,255,0.15), 0 2px 6px rgba(0,0,0,0.4);
      transition: background 0.2s ease-in-out;
    }

    #start-button:hover {
      background: linear-gradient(145deg, #2a83f8, #276acc);
    }

    /* Shine Effect */
    #start-button::after {
      content: "";
      position: absolute;
      top: 0;
      left: -75%;
      width: 50%;
      height: 100%;
      background: linear-gradient(120deg, transparent, rgba(255,255,255,0.6), transparent);
      transform: skewX(-20deg);
    }

    #start-button.shine::after {
      animation: shine 0.4s forwards;
    }

    @keyframes shine {
      0% { left: -75%; }
      100% { left: 125%; }
    }

    /* Task icons */
    #task-icons {
      display: flex;
      gap: 14px;
      margin-left: 15px;
    }

    .task-icon {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s ease-in-out;
    }

    .task-icon:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    /* System Tray */
    #system-tray {
      margin-left: auto;
      margin-right: 15px;
      color: rgba(255, 255, 255, 0.85);
      font-size: 14px;
    }

    /* Start Menu */
    #start-menu {
      position: fixed;
      bottom: 55px;
      left: 0;
      width: 240px;
      background: rgba(20, 20, 20, 0.97);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 4px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.6);
      backdrop-filter: blur(8px);
      overflow: hidden;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.25s ease-in-out;
      z-index: 999;
    }

    #start-menu.show {
      transform: translateY(0);
      opacity: 1;
    }

    #start-menu ul {
      list-style: none;
      margin: 0;
      padding: 10px 0;
    }

    #start-menu li {
      padding: 10px 15px;
      color: rgba(255,255,255,0.9);
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s ease-in-out;
    }

    #start-menu li:hover {
      background: rgba(255,255,255,0.1);
    }
  `;
  document.head.appendChild(styleTag);
}

function initClock() {
  function updateClock() {
    const clock = document.getElementById("clock");
    if (!clock) return;
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
  updateClock();
  setInterval(updateClock, 60000);
}

function initStartMenu() {
  const startButton = document.getElementById("start-button");
  const startMenu = document.getElementById("start-menu");

  startButton.addEventListener("click", () => {
    // Shine animation
    startButton.classList.add("shine");
    setTimeout(() => startButton.classList.remove("shine"), 400);

    // Toggle start menu
    startMenu.classList.toggle("show");
  });

  // Optional: click outside to close
  document.addEventListener("click", (e) => {
    if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
      startMenu.classList.remove("show");
    }
  });
}
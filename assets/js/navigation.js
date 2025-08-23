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
      height: 60px;
      display: flex;
      align-items: center;
      background: rgba(20, 20, 20, 0.6);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(12px) saturate(180%);
      border-radius: 12px 12px 0 0;
      font-family: monospace;
      z-index: 1000;
    }

    /* Start Button */
    #start-button {
      height: 100%;
      width: 110px;
      margin: 0;
      padding: 0;
      background: rgba(30, 115, 230, 0.8);
      border: none;
      color: white;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
      overflow: hidden;
      position: relative;
      border-right: 1px solid rgba(255,255,255,0.2);
      box-shadow: inset 0 0 6px rgba(255,255,255,0.15), 0 2px 6px rgba(0,0,0,0.4);
      border-radius: 10px;
      transition: background 0.2s ease-in-out, transform 0.15s ease;
    }

    #start-button:hover {
      background: rgba(40, 140, 250, 0.9);
      transform: scale(1.02);
    }

    #start-button:active {
      transform: scale(0.98);
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
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease-in-out, transform 0.15s ease;
      backdrop-filter: blur(8px);
    }

    .task-icon:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: scale(1.1);
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
      width: 260px;
      background: rgba(25, 25, 25, 0.85);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.6);
      backdrop-filter: blur(14px) saturate(180%);
      overflow: hidden;
      transform: scaleY(0) skewY(-2deg);
      transform-origin: bottom center;
      transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease-in-out;
      opacity: 0;
      z-index: 999;
    }

    #start-menu.show {
      transform: scaleY(1) skewY(0deg);
      opacity: 1;
    }

    #start-menu ul {
      list-style: none;
      margin: 0;
      padding: 10px 0;
    }

    #start-menu li {
      padding: 12px 18px;
      color: rgba(255,255,255,0.9);
      font-size: 15px;
      cursor: pointer;
      transition: background 0.2s ease-in-out;
      border-radius: 8px;
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

    // Position start menu relative to the button
    const rect = startButton.getBoundingClientRect();
    startMenu.style.left = rect.left + "px";
    startMenu.style.bottom = (window.innerHeight - rect.top + 5) + "px"; // slightly above button

    // Toggle start menu with scale + skew animation
    startMenu.classList.toggle("show");

    // Small bounce effect for start button
    startButton.style.transition = "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)";
    startButton.style.transform = "scale(1.05)";
    setTimeout(() => {
      startButton.style.transform = "scale(1)";
    }, 200);
  });

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
      startMenu.classList.remove("show");
    }
  });
}
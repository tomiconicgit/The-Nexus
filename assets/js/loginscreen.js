// assets/js/loginscreen.js
// Purpose: Manages the login screen UI and animation sequence for TitanOS, simulating a secure authentication process.
// Dependencies: ./homescreen.js (for post-login transition), ./errors.js (for error handling and status updates).
// Notes: 
// - Handles user input simulation (typing animation) and a covert-themed loading sequence.
// - Integrates the Nexus seal logo (nexusseal.png) as the title, with error handling for load failures.
// - Optimized for PWA compliance and iOS Safari, targeting ~60fps.
// - Build version (0.153) is tracked for deployment consistency.
// AI Usage: This file initializes the login interface; modify CSS or animation timings if aesthetic changes are needed.

import { loadHomeScreen } from './homescreen.js'; // Imports home screen loader for post-login transition.
import { updateCheck, displayError } from './errors.js'; // Imports error handling utilities.

const BUILD_VERSION = "0.153"; // Defines the current build version for display and tracking.

export function loadLoginScreen(container) {
  // Purpose: Initializes and renders the login screen with interactive elements.
  // Parameters: container - DOM element to render the login screen into.
  // Returns: Promise resolving when the login process completes or fails.
  return new Promise((resolve) => {
    try {
      updateCheck('loginscreen', 'ok'); // Updates component status to 'ok' in errors.js.
      container.innerHTML = `
        <div id="login-background">
          <div id="top-background"></div>
          <div id="bottom-background"></div>
          <div id="particle-container"></div>
          <div id="login-content" class="stage-panel" aria-hidden="false">
            <img id="login-title" src="/assets/images/nexusseal.png" alt="Nexus Intelligence Agency Seal" loading="lazy">
            <h2 id="login-subtitle">Intelligence Network</h2>
            <div id="form-elements">
              <input type="text" id="username" placeholder="Username" autocomplete="off">
              <input type="password" id="password" placeholder="Password">
              <div id="login-buttons">
                <button class="glassy-btn primary" id="login-btn">Login</button>
                <button class="glassy-btn outline" disabled>Register</button>
              </div>
            </div>
            <div id="login-monitoring">
              <span class="nexus-powered">NEXUS</span> System Powered By 
              <span id="mini-titanos">TitanOS</span>
            </div>
          </div>
          <div id="login-sequence" class="stage-panel" aria-hidden="true">
            <div id="radar-loader"></div>
            <div id="loading-text"></div>
          </div>
          <div id="deployment">Build v${BUILD_VERSION}</div>
          <div id="login-footer">
            <div>Secure Software | All Rights Reserved</div>
            <div>&copy; 2025 | Iconic Developments OS</div>
          </div>
        </div>
      `;

      const loginBackground = container.querySelector('#login-background');
      if (!loginBackground) throw new Error('Failed to create #login-background element');

      injectLoginCSS(); // Injects custom CSS for login screen styling.
      generateParticles(); // Generates animated particles for visual effect.

      // Verifies seal logo load with error handling.
      const logoImg = new Image();
      logoImg.src = 'assets/images/nexusseal.png'; // Case-sensitive; ensure file matches (PNG vs. PNG).
      logoImg.onload = () => {
        const loginTitle = container.querySelector('#login-title');
        if (loginTitle) loginTitle.classList.add('loaded');
      };
      logoImg.onerror = () => displayError('Failed to load Nexus seal logo. Check file path or format.', 'LoginScreen', 'ERR_SEAL_LOAD', true);

      const loginBtn = container.querySelector('#login-btn');
      if (!loginBtn) {
        displayError('Login button not found. Please refresh the page.', 'LoginScreen', 'ERR_LOGIN_BTN');
        resolve();
        return;
      }

      loginBtn.addEventListener('click', async () => {
        if (navigator.vibrate) navigator.vibrate([50, 30, 50]); // Short haptic feedback on tap.
        try {
          const formContainer = container.querySelector('#login-content');
          const sequenceContainer = container.querySelector('#login-sequence');
          const bg = loginBackground;
          const loadingText = container.querySelector('#loading-text');

          if (!formContainer || !sequenceContainer || !bg || !loadingText) {
            displayError('Login sequence elements not found.', 'LoginScreen', 'ERR_LOGIN_SEQ');
            resolve();
            return;
          }

          // Optimized typing animation using requestAnimationFrame for smoothness.
          await new Promise(resolve => {
            const usernameInput = container.querySelector('#username');
            const passwordInput = container.querySelector('#password');
            const usernameText = 'AgentSmith';
            const passwordText = 'SecurePass123';
            let i = 0;
            function type() {
              if (i < usernameText.length) {
                usernameInput.value += usernameText.charAt(i);
                i++;
                requestAnimationFrame(type);
              } else if (i < usernameText.length + passwordText.length) {
                passwordInput.value += passwordText.charAt(i - usernameText.length);
                i++;
                requestAnimationFrame(type);
              } else {
                resolve();
              }
            }
            requestAnimationFrame(type);
          });

          formContainer.setAttribute('aria-hidden', 'true');
          sequenceContainer.setAttribute('aria-hidden', 'false');
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Longer vibration.

          const phrases = ["Scanning Credentials", "Decrypting Access", "Verifying Identity", "Establishing Secure Link"];
          let phraseIndex = 0;
          const updateLoadingText = () => {
            loadingText.textContent = phrases[phraseIndex];
            phraseIndex = (phraseIndex + 1) % phrases.length;
          };
          updateLoadingText();
          const textInterval = setInterval(updateLoadingText, 800);

          await new Promise(resolve => setTimeout(resolve, 4000)); // 4s loading sequence.

          clearInterval(textInterval);
          loadingText.textContent = "Access Granted";

          bg.style.transition = 'opacity 0.3s ease-in-out';
          bg.style.opacity = '0';
          await new Promise(resolve => setTimeout(resolve, 300));

          bg.remove();
          await loadHomeScreen(container);
          resolve();
        } catch (err) {
          displayError(`Login sequence failed: ${err.message}`, 'LoginScreen', 'ERR_LOGIN_FAIL');
          resolve();
        }
      });
    } catch (err) {
      updateCheck('loginscreen', 'fail');
      displayError(`Failed to load login screen: ${err.message}`, 'LoginScreen', 'ERR_LOGIN_LOAD');
      resolve();
    }
  });
}

// Purpose: Injects CSS styles specific to the login screen.
function injectLoginCSS() {
  const styleId = 'loginscreen-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    :root {
      --dark-theme-bg: #0d0d0d;
      --glass-bg: rgba(0, 0, 0, 0.3);
      --dark-glass-bg: rgba(0, 0, 0, 0.6);
      --text-color: #f2f2f7;
      --secondary-text-color: #8e8e93;
      --accent-color: #1E90FF;
      --secondary-accent: #800080;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #login-background {
      height: 100vh;
      width: 100vw;
      background: var(--dark-theme-bg);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: var(--text-color);
      font-family: var(--font-family);
      position: relative;
      overflow: hidden;
      transition: opacity 0.3s ease-in-out;
      will-change: opacity;
    }
    #top-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 50vh;
      background-image: url('/assets/images/IMG_8860.jpeg');
      background-size: cover;
      background-position: center;
      filter: brightness(0.5) contrast(1.2);
      z-index: 0;
    }
    #top-background::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50%;
      background: linear-gradient(to top, var(--dark-theme-bg) 0%, transparent 80%);
    }
    #bottom-background {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50vh;
      background: var(--dark-theme-bg);
      z-index: 1;
    }
    #particle-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }
    .particle {
      position: absolute;
      background: #1E90FF; /* Simplified for performance */
      border-radius: 50%;
      animation: float 15s infinite ease-in-out;
      will-change: transform;
    }
    @keyframes float {
      0% { transform: translateY(0) scale(0.8); }
      50% { transform: translateY(-30px) scale(1.2); }
      100% { transform: translateY(0) scale(0.8); }
    }
    #login-content {
      z-index: 2;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 15px;
      padding: 20px;
      width: 90%;
      max-width: 340px;
      transition: opacity 0.3s ease-in-out;
      will-change: opacity;
    }
    .stage-panel[aria-hidden="true"] {
      opacity: 0;
      pointer-events: none;
      display: none;
    }
    .stage-panel[aria-hidden="false"] {
      opacity: 1;
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    #form-elements {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }
    input {
      padding: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 30px;
      background: var(--glass-bg);
      color: var(--text-color);
      outline: none;
      font-size: 1.1rem;
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      will-change: border-color, box-shadow;
    }
    input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
    input:focus {
      border-color: var(--accent-color);
      box-shadow: 0 0 8px rgba(30, 144, 255, 0.4);
    }
    #login-buttons {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      width: 100%;
    }
    .glassy-btn {
      flex: 1;
      padding: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 30px;
      cursor: pointer;
      font-weight: 600;
      letter-spacing: 0.2px;
      transition: background 0.2s ease, color 0.2s ease;
      will-change: background, color;
    }
    .glassy-btn.primary {
      color: var(--text-color);
      background: var(--accent-color);
      border-color: var(--accent-color);
    }
    .glassy-btn.primary:hover {
      background: #36a4ff;
    }
    .glassy-btn.outline {
      background: var(--dark-glass-bg);
      color: rgba(255, 255, 255, 0.5);
    }
    .glassy-btn.outline:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-color);
    }
    .glassy-btn:disabled {
      opacity: 0.5;
      cursor: default;
    }
    #login-monitoring {
      margin-top: auto;
      margin-bottom: 15px;
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      text-align: center;
      z-index: 2;
    }
    .nexus-powered {
      font-weight: 700;
      font-size: 0.8rem;
      background: linear-gradient(to right, #1E90FF, #800080);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    #mini-titanos {
      font-weight: 700;
      font-size: 0.8rem;
      color: var(--text-color);
      text-shadow: 0 0 3px rgba(30, 144, 255, 0.3);
    }
    #login-title {
      max-width: 200px;
      height: auto;
      margin-bottom: 10px;
      z-index: 2;
    }
    #login-title.loaded {
      opacity: 1;
      transition: opacity 0.5s ease-in-out;
    }
    #login-subtitle {
      font-size: 1.1rem;
      color: var(--secondary-text-color);
      margin-bottom: 15px;
      z-index: 2;
    }
    #radar-loader {
      width: 60px;
      height: 60px;
      position: relative;
      z-index: 2;
    }
    #radar-loader::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border: 2px solid rgba(30, 144, 255, 0.3);
      border-radius: 50%;
      animation: radarPulse 2s infinite ease-out;
      will-change: transform, opacity;
    }
    #radar-loader::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border: 2px solid var(--accent-color);
      border-radius: 50%;
      animation: radarSpin 1.5s linear infinite;
      will-change: transform;
    }
    @keyframes radarPulse {
      0% { transform: scale(0.5); opacity: 0.5; }
      100% { transform: scale(1.5); opacity: 0; }
    }
    @keyframes radarSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    #login-sequence {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
      z-index: 2;
      transition: opacity 0.3s ease-in-out;
      will-change: opacity;
    }
    #loading-text {
      color: var(--text-color);
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.4px;
      opacity: 0;
      animation: text-fade-in 0.8s forwards;
      animation-delay: 0.3s;
    }
    @keyframes text-fade-in {
      to { opacity: 1; }
    }
    #deployment {
      position: absolute;
      bottom: 40px;
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      text-align: center;
      z-index: 2;
    }
    #login-footer {
      position: absolute;
      bottom: 10px;
      text-align: center;
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      z-index: 2;
    }
  `;
  document.head.appendChild(styleTag);
}

// Purpose: Generates animated particles for the login screen background.
function generateParticles() {
  const container = document.getElementById('particle-container');
  if (!container) {
    console.warn('Particle container not found');
    return;
  }

  const particleCount = 8; // Reduced for performance optimization.
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 2 + 1; // Smaller size for efficiency.
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 10;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.top = `${top}vh`;
    particle.style.left = `${left}vw`;
    particle.style.animationDuration = `${duration}s`;

    container.appendChild(particle);
  }
}
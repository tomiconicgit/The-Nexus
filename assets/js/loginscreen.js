// assets/js/loginscreen.js
// Purpose: Manages the login screen UI and animation sequence for TitanOS, simulating a secure authentication process.
// Dependencies: ./homescreen.js (for post-login transition), ./errors.js (for error handling and status updates).
// Notes:
// - Handles user input simulation (typing animation) and a covert-themed loading sequence.
// - Integrates the Nexus seal logo (nexusseal.PNG) as the title, with error handling for load failures.
// - Optimized for PWA compliance and iOS Safari, targeting ~60fps.
// - Build version (0.153) is tracked for deployment consistency.
// - Fix Notes: Updated to address ERR_SEAL_LOAD by using relative path (assets/images/nexusseal.PNG); added object-fit for image display.
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
          <div id="grid-overlay"></div>
          <div id="login-content" class="stage-panel" aria-hidden="false">
            <img id="login-title" src="assets/images/nexusseal.PNG" alt="Nexus Intelligence Agency Seal" loading="lazy">
            <h2 id="login-subtitle">Intelligence Network</h2>
            <div id="form-elements">
              <div class="input-group">
                <label for="username">AGENT ID</label>
                <input type="text" id="username" autocomplete="off" class="login-input">
              </div>
              <div class="input-group">
                <label for="password">PASSWORD</label>
                <input type="password" id="password" class="login-input">
              </div>
              <div id="login-buttons">
                <button class="glassy-btn primary" id="login-btn">Login</button>
                <button class="glassy-btn outline" disabled>Register</button>
              </div>
            </div>
            <div id="login-monitoring">
              <span class="nexus-powered">nexus is powered by TitanOS</span>
            </div>
          </div>
          <div id="login-sequence" class="stage-panel" aria-hidden="true">
            <div id="radar-loader"></div>
            <div id="loading-text"></div>
          </div>
          <div id="login-footer">
            You are entering a secured United States Government system, which may be used only <br>
            for authorized purposes. Modification of any information on this system is subject <br>
            to a criminal prosecution. The agency monitors all usage of this system. <br>
            All persons are hereby notified that the use of this system constitutes consent to such <br>
            monitoring and audition.
          </div>
        </div>
      `;

      const loginBackground = container.querySelector('#login-background');
      if (!loginBackground) throw new Error('Failed to create #login-background element');

      injectLoginCSS(); // Injects custom CSS for login screen styling.
      generateParticles(); // Generates animated particles for visual effect.

      // Verifies seal logo load with enhanced error logging.
      const logoImg = new Image();
      const logoUrl = 'assets/images/nexusseal.PNG';
      logoImg.src = logoUrl;
      logoImg.onload = () => {
        const loginTitle = container.querySelector('#login-title');
        if (loginTitle) loginTitle.classList.add('loaded');
      };
      logoImg.onerror = () => displayError(`Failed to load Nexus seal logo from ${logoUrl}. Check file path or format.`, 'LoginScreen', 'ERR_SEAL_LOAD', true);

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
            const usernameText = 'Agent 173';
            const passwordText = '••••••••';
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

          // Transition with minimal reflow
          formContainer.setAttribute('aria-hidden', 'true');
          sequenceContainer.setAttribute('aria-hidden', 'false');
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Longer vibration

          // Optimized loading sequence
          const phrases = [
            "Scanning Credentials",
            "Decrypting Access",
            "Verifying Identity",
            "Establishing Secure Link"
          ];
          let phraseIndex = 0;
          const updateLoadingText = () => {
            loadingText.textContent = phrases[phraseIndex];
            phraseIndex = (phraseIndex + 1) % phrases.length;
          };
          updateLoadingText();
          const textInterval = setInterval(updateLoadingText, 800);

          await new Promise(resolve => setTimeout(resolve, 4000)); // 4s sequence

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
      --dark-theme-bg: #000;
      --glass-bg: rgba(255, 255, 255, 0.1);
      --input-border-color: #555;
      --text-color: #f2f2f7;
      --secondary-text-color: #8e8e93;
      --accent-color: #1E90FF;
      --font-family: Arial, sans-serif;
    }
    #login-background {
      height: 100vh;
      width: 100vw;
      background: url('assets/images/world-map.jpg') no-repeat center center/cover;
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
    #grid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(to right, transparent, transparent 99px, rgba(255, 255, 255, 0.05) 100px), repeating-linear-gradient(to bottom, transparent, transparent 99px, rgba(255, 255, 255, 0.05) 100px);
      z-index: 1;
      pointer-events: none;
    }
    #particle-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
    }
    .particle {
      position: absolute;
      background: #1E90FF;
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
      z-index: 3;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
      padding: 20px;
      width: 90%;
      max-width: 400px;
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
      gap: 15px;
      width: 100%;
      align-items: center;
    }
    .input-group {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 300px;
      gap: 10px;
    }
    .input-group label {
      color: #fff;
      font-weight: bold;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .login-input {
      padding: 8px;
      border: 1px solid var(--input-border-color);
      background: #fff;
      color: #000;
      outline: none;
      font-size: 1rem;
      flex-grow: 1;
      box-sizing: border-box;
    }
    .login-input::placeholder {
      color: #aaa;
    }
    #login-buttons {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      width: 100%;
      max-width: 300px;
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
      margin-top: 15px;
      font-size: 0.8rem;
      color: #aaa;
      text-align: center;
      z-index: 3;
    }
    .nexus-powered {
      color: #aaa;
      font-weight: 500;
      font-size: 0.9rem;
    }
    #login-title {
      max-width: 200px;
      height: auto;
      margin-bottom: 10px;
      z-index: 3;
      object-fit: contain;
    }
    #login-subtitle {
      font-size: 1.5rem;
      color: #fff;
      margin-bottom: 25px;
      z-index: 3;
    }
    #radar-loader {
      width: 60px;
      height: 60px;
      position: relative;
      z-index: 3;
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
      z-index: 3;
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
    #login-footer {
      position: absolute;
      bottom: 20px;
      font-size: 0.8rem;
      color: #ddd;
      text-align: center;
      z-index: 3;
      line-height: 1.4;
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

  const particleCount = 8;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 2 + 1;
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

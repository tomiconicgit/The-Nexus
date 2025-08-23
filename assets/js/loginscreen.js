// assets/js/loginscreen.js
// Purpose: Manages the login screen UI and animation sequence for TitanOS, simulating a secure authentication process.
// Dependencies: ./homescreen.js (for post-login transition), ./errors.js (for error handling and status updates).
// Notes:
// - Handles user input simulation (typing animation) and a covert-themed loading sequence.
// - Integrates the Nexus seal logo (nexusseal.PNG) as the title.
// - Optimized for PWA compliance and iOS Safari, targeting ~60fps.

import { loadHomeScreen } from './homescreen.js';
import { updateCheck, displayError } from './errors.js';

const BUILD_VERSION = "0.154"; 
let usernameTyped = false;
let passwordTyped = false;

export function loadLoginScreen(container) {
  return new Promise((resolve) => {
    try {
      updateCheck('loginscreen', 'ok');
      container.innerHTML = `
        <div id="login-background">
          <div id="grid-overlay"></div>
          <div id="fade-overlay"></div>
          <div id="login-content" class="stage-panel" aria-hidden="false">
            <img id="login-title" src="assets/images/nexusseal.PNG" alt="Nexus Intelligence Agency Seal" loading="lazy">
            <h2 id="login-subtitle">Intelligence Network</h2>
            <div id="form-elements">
              <div class="input-group">
                <label for="username">OPERATIVE ID</label>
                <input type="text" id="username" autocomplete="off" class="login-input" readonly>
              </div>
              <div class="input-group">
                <label for="password">PASSWORD</label>
                <input type="password" id="password" autocomplete="off" class="login-input" readonly>
              </div>
              <div id="login-buttons">
                <button class="glassy-btn primary" id="login-btn" disabled>Login</button>
                <button class="glassy-btn outline" disabled>Register</button>
              </div>
            </div>
            <div id="login-monitoring">
              <span class="nexus-powered"><strong>NEXUS</strong> powered by TitanOS</span>
            </div>
          </div>
          <div id="login-sequence" class="stage-panel" aria-hidden="true">
            <div id="radar-loader"></div>
            <div id="loading-text"></div>
          </div>
          <div id="login-footer">
            <div>Secure Software | All Rights Reserved</div>
            <div>&copy; 2025 | Iconic Developments OS</div>
          </div>
        </div>
      `;

      const loginBackground = container.querySelector('#login-background');
      if (!loginBackground) throw new Error('Failed to create #login-background element');

      injectLoginCSS();
      generateParticles();

      // Seal logo check
      const logoImg = new Image();
      const logoUrl = 'assets/images/nexusseal.PNG';
      logoImg.src = logoUrl;
      logoImg.onload = () => {
        const loginTitle = container.querySelector('#login-title');
        if (loginTitle) loginTitle.classList.add('loaded');
      };
      logoImg.onerror = () => displayError(`Failed to load Nexus seal logo from ${logoUrl}`, 'LoginScreen', 'ERR_SEAL_LOAD', true);

      const usernameInput = container.querySelector('#username');
      const passwordInput = container.querySelector('#password');
      const loginBtn = container.querySelector('#login-btn');

      if (!usernameInput || !passwordInput || !loginBtn) {
        displayError('Login form elements not found.', 'LoginScreen', 'ERR_FORM_ELEMENTS');
        resolve();
        return;
      }

      // Username typing
      usernameInput.addEventListener('click', async () => {
        if (!usernameTyped) {
          usernameInput.value = '';
          await typeText(usernameInput, 'Agent 173');
          usernameTyped = true;
          passwordInput.removeAttribute('readonly');
          // Removed passwordInput.focus() to avoid auto keyboard popup
        }
      });

      // Password typing
      passwordInput.addEventListener('click', async () => {
        if (usernameTyped && !passwordTyped) {
          passwordInput.value = '';
          await typeText(passwordInput, '••••••••');
          passwordTyped = true;
          loginBtn.removeAttribute('disabled');
        }
      });

      // Login button
      loginBtn.addEventListener('click', async () => {
        if (passwordTyped) {
          softHaptic(); // subtle tap
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

            formContainer.setAttribute('aria-hidden', 'true');
            sequenceContainer.setAttribute('aria-hidden', 'false');
            softHaptic();

            // Loading text loop
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

            await new Promise(resolve => setTimeout(resolve, 4000));

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
        }
      });
    } catch (err) {
      updateCheck('loginscreen', 'fail');
      displayError(`Failed to load login screen: ${err.message}`, 'LoginScreen', 'ERR_LOGIN_LOAD');
      resolve();
    }
  });
}

// Typing with random speed + haptic each character
function typeText(element, text) {
  return new Promise(resolve => {
    let i = 0;
    function typeChar() {
      if (i < text.length) {
        element.value += text.charAt(i);
        softHaptic(); // subtle haptic per character
        i++;
        const randomDelay = 50 + Math.random() * 120;
        setTimeout(typeChar, randomDelay);
      } else {
        resolve();
      }
    }
    typeChar();
  });
}

// Subtle haptic feedback
function softHaptic() {
  if (navigator.vibrate) {
    navigator.vibrate(10); // very short tap feel
  }
}

// Inject CSS
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
    }
    #fade-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50%;
      background: linear-gradient(to top, black, transparent);
      z-index: 2;
      pointer-events: none;
    }
    #grid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(to right, transparent, transparent 99px, rgba(255, 255, 255, 0.05) 100px),
                  repeating-linear-gradient(to bottom, transparent, transparent 99px, rgba(255, 255, 255, 0.05) 100px);
      z-index: 1;
      pointer-events: none;
    }
    #login-content {
      z-index: 3;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 15px;
      padding: 20px;
      width: 90%;
      max-width: 320px;
    }
    .input-group {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 200px;
      gap: 10px;
    }
    .login-input {
      padding: 6px;
      border: 1px solid var(--input-border-color);
      background: #fff;
      color: #000;
      font-size: 0.9rem;
      flex-grow: 1;
      box-sizing: border-box;
    }
    #login-title {
      max-width: 200px;
      height: auto;
      margin-bottom: 2px;
      object-fit: contain;
    }
    #login-subtitle {
      font-size: 1.5rem;
      color: #fff;
      margin-bottom: 15px;
    }
    .nexus-powered {
      color: #aaa;
      font-weight: 500;
      font-size: 0.9rem;
      text-transform: none;
    }
  `;
  document.head.appendChild(styleTag);
}

// Particles
function generateParticles() {
  const container = document.getElementById('particle-container');
  if (!container) return;

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
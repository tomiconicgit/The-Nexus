// assets/js/loginscreen.js
// Purpose: Manages the login screen UI and animation sequence for TitanOS, simulating a secure authentication process.
// Dependencies: ./homescreen.js (for post-login transition), ./errors.js (for error handling and status updates).
// Notes:
// - Handles user input simulation (typing animation) and covert-style loading sequence.
// - Features A.N.N.A. assistant (Siri-like orb animation) during login.
// - Optimized for PWA compliance and iOS Safari.

import { loadHomeScreen } from './homescreen.js';
import { updateCheck, displayError } from './errors.js';

const BUILD_VERSION = "0.160"; 
let usernameTyped = false;
let passwordTyped = false;
let agentID = "Agent 173";

export function loadLoginScreen(container) {
  return new Promise((resolve) => {
    try {
      updateCheck('loginscreen', 'ok');
      container.innerHTML = `
        <div id="login-background">
          <div id="grid-overlay"></div>
          <div id="fade-overlay"></div>
          <div id="login-content" class="stage-panel" aria-hidden="false">
            <img id="login-title" src="assets/images/nexusseal.PNG" alt="Nexus Seal" loading="lazy">
            <div id="form-elements">
              <div class="input-group">
                <label for="username">ID</label>
                <input type="text" id="username" autocomplete="off" class="login-input" readonly onfocus="this.blur()">
              </div>
              <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" autocomplete="off" class="login-input" readonly onfocus="this.blur()">
              </div>
              <div id="login-buttons">
                <button class="glassy-btn primary" id="login-btn" disabled>Login</button>
                <button class="glassy-btn outline" disabled>Register</button>
              </div>
            </div>
          </div>
          <div id="anna-sequence" class="stage-panel" aria-hidden="true">
            <div id="anna-orb"></div>
            <div id="anna-text"></div>
          </div>
          <div id="login-footer">
            <div>Secure Software | All Rights Reserved</div>
            <div>&copy; 2025 | Iconic Developments OS</div>
          </div>
        </div>
      `;

      injectLoginCSS();

      const usernameInput = container.querySelector('#username');
      const passwordInput = container.querySelector('#password');
      const loginBtn = container.querySelector('#login-btn');

      if (!usernameInput || !passwordInput || !loginBtn) {
        displayError("Login form elements not found", "LoginScreen", "ERR_FORM_ELEMENTS");
        resolve();
        return;
      }

      // Username typing
      usernameInput.addEventListener('click', async () => {
        if (!usernameTyped) {
          usernameInput.value = '';
          agentID = "Agent 173"; // can be dynamic later
          await typeText(usernameInput, agentID);
          usernameTyped = true;
          passwordInput.removeAttribute('readonly');
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

      // Login button pressed
      loginBtn.addEventListener('click', async () => {
        if (passwordTyped) {
          softHaptic();
          try {
            const formContainer = container.querySelector('#form-elements');
            const annaContainer = container.querySelector('#anna-sequence');
            const annaText = container.querySelector('#anna-text');
            const bg = container.querySelector('#login-background');

            if (!formContainer || !annaContainer || !annaText || !bg) {
              displayError("ANNA sequence elements missing", "LoginScreen", "ERR_ANNA");
              resolve();
              return;
            }

            // Hide form, show ANNA
            formContainer.style.display = "none";
            annaContainer.setAttribute("aria-hidden", "false");

            // Status phrases
            const phrases = [
              "Checking Credentials",
              "Decrypting Security Keys",
              "Authorising Clearance",
              "Loading NEXUS Intelligence Software",
              "Establishing Secure Session"
            ];
            let phraseIndex = 0;

            const updateAnnaText = () => {
              annaText.textContent = phrases[phraseIndex];
              phraseIndex++;
              if (phraseIndex >= phrases.length) {
                clearInterval(textInterval);
                setTimeout(() => {
                  annaText.textContent = `Welcome, ${agentID}`;
                  setTimeout(async () => {
                    bg.style.transition = 'opacity 0.5s ease-in-out';
                    bg.style.opacity = '0';
                    await new Promise(r => setTimeout(r, 500));
                    bg.remove();
                    await loadHomeScreen(container);
                    resolve();
                  }, 2000);
                }, 1200);
              }
            };

            updateAnnaText();
            const textInterval = setInterval(updateAnnaText, 1500);

          } catch (err) {
            displayError(`ANNA failed: ${err.message}`, "LoginScreen", "ERR_LOGIN_FAIL");
            resolve();
          }
        }
      });

    } catch (err) {
      updateCheck('loginscreen', 'fail');
      displayError(`Failed to load login screen: ${err.message}`, "LoginScreen", "ERR_LOGIN_LOAD");
      resolve();
    }
  });
}

// Typing with random speed + haptic per character
function typeText(element, text) {
  return new Promise(resolve => {
    let i = 0;
    function typeChar() {
      if (i < text.length) {
        element.value += text.charAt(i);
        softHaptic();
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
  if (navigator.vibrate) navigator.vibrate(10);
}

// Inject CSS for login + ANNA
function injectLoginCSS() {
  const styleId = 'loginscreen-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    :root {
      --dark-theme-bg: #000;
      --glass-bg: rgba(255, 255, 255, 0.1);
      --input-border-color: #555;
      --text-color: #f2f2f7;
      --accent-color: #1E90FF;
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
      position: relative;
      overflow: hidden;
      transition: opacity 0.3s ease-in-out;
      touch-action: manipulation;
      -webkit-user-select: none;
    }
    #fade-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50%;
      background: linear-gradient(to top, black, transparent);
      z-index: 1;
      pointer-events: none;
    }
    #grid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(to right, transparent, transparent 99px, rgba(255,255,255,0.05) 100px),
                  repeating-linear-gradient(to bottom, transparent, transparent 99px, rgba(255,255,255,0.05) 100px);
      z-index: 0;
      pointer-events: none;
    }
    #login-content {
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 15px;
      padding: 20px;
      width: 90%;
      max-width: 350px;
    }
    .input-group {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      max-width: 300px;
      margin: 0 auto;
      gap: 10px;
    }
    .input-group label {
      color: var(--text-color);
      font-weight: bold;
      width: 70px;
      text-align: right;
      font-size: 0.9rem;
      font-family: 'Courier New', Courier, monospace;
      flex-shrink: 0;
    }
    .login-input {
      padding: 6px;
      border: 1px solid var(--input-border-color);
      background: #fff;
      color: #000;
      font-size: 0.9rem;
      width: 150px;
      box-sizing: border-box;
    }
    #login-buttons {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 15px;
      width: 100%;
      max-width: 300px;
      margin-left: auto;
      margin-right: auto;
    }
    .glassy-btn {
      font-family: 'Courier New', Courier, monospace;
      padding: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      width: 100%;
      max-width: 140px;
      transition: background 0.2s ease, color 0.2s ease;
    }
    .glassy-btn.primary {
      color: var(--text-color);
      background: var(--accent-color);
      border-color: var(--accent-color);
    }
    .glassy-btn.outline {
      background: var(--glass-bg);
      color: rgba(255,255,255,0.7);
    }
    .glassy-btn:disabled { opacity: 0.5; cursor: default; }

    #anna-sequence {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      z-index: 3;
    }
    #anna-orb {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: conic-gradient(
        from 0deg,
        #ff0057, #ff7b00, #ffe600, #00ff85, #00cfff, #7a00ff, #ff00d4, #ff0057
      );
      background-size: 400% 400%;
      animation: annaWave 4s infinite linear, annaPulse 2s infinite ease-in-out;
      box-shadow: 0 0 40px rgba(0, 180, 255, 0.7);
    }
    #anna-text {
      font-family: 'Courier New', Courier, monospace;
      font-size: 1rem;
      color: #ddd;
      text-align: center;
    }
    @keyframes annaWave {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes annaPulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(0,200,255,0.7); }
      50% { transform: scale(1.1); box-shadow: 0 0 50px rgba(0,255,200,1); }
    }
    #login-footer {
      position: absolute;
      bottom: 20px;
      font-size: 0.8rem;
      color: #ddd;
      text-align: center;
      z-index: 2;
    }
  `;
  document.head.appendChild(style);
}
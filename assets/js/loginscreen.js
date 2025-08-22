// assets/js/loginscreen.js

import { loadHomeScreen } from './homescreen.js';
import { updateCheck, displayError } from './errors.js';

const DEPLOYMENT_VERSION = "1.6.3";

export function loadLoginScreen(container) {
  return new Promise((resolve) => {
    try {
      updateCheck('loginscreen', 'ok');
      console.log('loginscreen.js: Setting container HTML');
      container.innerHTML = `
        <div id="login-background">
          <div id="top-background"></div>
          <div id="bottom-background"></div>
          <div id="particle-container"></div>
          <div id="login-content" class="stage-panel" aria-hidden="false">
            <h1 id="login-title">Nexus</h1>
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
              <span class="nexus-powered">NEXUS</span> System Is Powered By 
              <span id="mini-titanos">TitanOS</span>
            </div>
          </div>
          <div id="login-sequence" class="stage-panel" aria-hidden="true">
            <div id="sphere-loader"></div>
            <div id="loading-text">Loading Your Intelligence Data..</div>
          </div>
          <div id="deployment">Deployment v${DEPLOYMENT_VERSION}</div>
          <div id="login-footer">
            <div>Secure Software | All Rights Reserved</div>
            <div>&copy; 2025 | Iconic Developments OS</div>
          </div>
        </div>
      `;
      console.log('loginscreen.js: Container HTML set, checking #login-background');
      const loginBackground = container.querySelector('#login-background');
      if (!loginBackground) {
        throw new Error('Failed to create #login-background element');
      }
      console.log('loginscreen.js: #login-background found');

      injectLoginCSS();
      generateParticles();
      
      const loginBtn = container.querySelector('#login-btn');
      if (!loginBtn) {
        displayError('Login button not found. Please refresh the page.', 'LoginScreen');
        resolve();
        return;
      }

      loginBtn.addEventListener('click', async () => {
        try {
          const formContainer = container.querySelector('#login-content');
          const sequenceContainer = container.querySelector('#login-sequence');
          const bg = container.querySelector('#login-background');
          
          if (!formContainer || !sequenceContainer || !bg) {
            displayError('Login sequence elements not found.', 'LoginScreen');
            resolve();
            return;
          }

          // Simulate typing animation
          await new Promise(resolve => {
            const usernameInput = container.querySelector('#username');
            const passwordInput = container.querySelector('#password');
            let usernameText = 'AgentSmith';
            let passwordText = 'SecurePass123';
            let i = 0;
            const typeDelay = 100;
            const type = () => {
              if (i < usernameText.length) {
                usernameInput.value += usernameText.charAt(i);
                i++;
                setTimeout(type, typeDelay);
              } else if (i < usernameText.length + passwordText.length) {
                passwordInput.value += passwordText.charAt(i - usernameText.length);
                i++;
                setTimeout(type, typeDelay);
              } else {
                resolve();
              }
            };
            type();
          });

          // Hide form and show sequence
          formContainer.setAttribute('aria-hidden', 'true');
          sequenceContainer.setAttribute('aria-hidden', 'false');

          // Wait for loading sequence (4.5s)
          await new Promise(resolve => setTimeout(resolve, 4500));

          // Fade out login screen
          bg.style.transition = 'opacity 0.5s ease';
          bg.style.opacity = '0';
          await new Promise(resolve => setTimeout(resolve, 500));

          bg.remove();
          await loadHomeScreen(container);
          resolve();
        } catch (err) {
          displayError(`Login sequence failed: ${err.message}`, 'LoginScreen');
          resolve();
        }
      });
      resolve();
    } catch (err) {
      updateCheck('loginscreen', 'fail');
      displayError(`Failed to load login screen: ${err.message}`, 'LoginScreen');
      resolve();
    }
  });
}

function injectLoginCSS() {
  const styleId = 'loginscreen-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    :root {
      --dark-theme-bg: #0d0d0d;
      --glass-bg: rgba(255, 255, 255, 0.1);
      --dark-glass-bg: rgba(0, 0, 0, 0.4);
      --text-color: #f2f2f7;
      --secondary-text-color: #8e8e93;
      --accent-color: #1E90FF; 
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
      color: #fff;
      font-family: 'Inter', sans-serif;
      position: relative;
      overflow: hidden;
      transition: opacity 0.5s ease-in-out;
    }
    #top-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 50vh;
      background-image: url('assets/images/IMG_8860.jpeg');
      background-size: cover;
      background-position: center;
      filter: brightness(0.7);
      z-index: 0;
    }
    #top-background::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50%;
      background: linear-gradient(to top, var(--dark-theme-bg) 0%, transparent 100%);
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
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      animation: float 10s infinite ease-in-out;
    }
    @keyframes float {
      0% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-20px) scale(1.2); }
      100% { transform: translateY(0) scale(1); }
    }

    #login-content {
      z-index: 2;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
      padding: 20px;
      width: 90%;
      max-width: 340px;
      transition: all 0.5s ease;
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
      gap: 16px;
      width: 100%;
    }
    
    input {
      padding: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2); 
      border-radius: 40px;
      background: var(--glass-bg); 
      backdrop-filter: blur(10px); 
      -webkit-backdrop-filter: blur(10px);
      color: var(--text-color);
      outline: none;
      font-size: 1.2rem;
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      transition: all 0.3s ease;
    }
    input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    input:focus {
      border-color: var(--accent-color);
      box-shadow: 0 0 10px rgba(30, 144, 255, 0.5);
    }

    #login-buttons {
      display: flex;
      gap: 10px;
      margin-top: 10px;
      width: 100%;
    }
    .glassy-btn {
      flex: 1;
      padding: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 40px;
      cursor: pointer;
      font-weight: 600;
      letter-spacing: 0.3px;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .glassy-btn.primary {
      color: #fff;
      background: var(--accent-color);
      border-color: var(--accent-color);
    }
    .glassy-btn.primary:hover {
        background: #36a4ff;
    }
    .glassy-btn.outline {
      background: var(--dark-glass-bg);
      color: rgba(255, 255, 255, 0.7);
    }
    .glassy-btn.outline:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    .glassy-btn:disabled {
      opacity: 0.5;
      cursor: default;
    }

    #login-monitoring {
      margin-top: auto;
      margin-bottom: 20px;
      font-size: 0.75rem;
      color: var(--secondary-text-color);
      text-align: center;
      z-index: 2;
    }
    .nexus-powered {
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      font-size: 0.85rem;
      background: linear-gradient(to right, #1E90FF, #00CED1);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    #mini-titanos {
      font-family: 'SF Pro Display', sans-serif;
      font-weight: 700;
      font-size: 0.85rem;
      color: #fff;
      text-shadow: 0 0 4px rgba(255, 255, 255, 0.3), 0 0 8px rgba(30, 144, 255, 0.2);
      display: inline;
    }
    #login-title {
      font-size: 2.5rem;
      font-weight: bold;
      letter-spacing: 2px;
      margin-bottom: 5px;
      z-index: 2;
    }
    #login-subtitle {
        z-index: 2;
        font-size: 1.2rem;
        color: var(--secondary-text-color);
        margin-bottom: 20px;
    }

    #sphere-loader {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid var(--accent-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
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
      gap: 12px;
      z-index: 2;
    }
    
    #loading-text {
      color: #fff;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      opacity: 0;
      animation: text-fade-in 1s forwards;
      animation-delay: 0.5s;
    }
    @keyframes text-fade-in {
      to { opacity: 1; }
    }
    
    #deployment {
      position: absolute;
      bottom: 40px;
      font-size: 0.75rem;
      color: #666;
      text-align: center;
      z-index: 2;
    }
    #login-footer {
      position: absolute;
      bottom: 12px;
      text-align: center;
      font-size: 0.75rem;
      color: #555;
      z-index: 2;
    }
  `;
  document.head.appendChild(styleTag);
}

function generateParticles() {
  const container = document.getElementById('particle-container');
  if (!container) {
    console.warn('loginscreen.js: Particle container not found');
    return;
  }
  console.log('loginscreen.js: Generating particles');

  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 4 + 2;
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const duration = Math.random() * 5 + 8;
    const delay = Math.random() * 10;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.top = `${top}vh`;
    particle.style.left = `${left}vw`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    container.appendChild(particle);
  }
}
// assets/js/bootscreen.js

import { updateCheck } from './errors.js';

export function loadBootScreen(container) {
  return new Promise((resolve) => {
    container.innerHTML = `
      <div id="splash-container">
        <div id="titanos">TitanOS</div>
        <div id="developer-credit">Developed by Iconic Developments</div>
        <div id="loading-bar-container">
          <div id="loading-bar"></div>
        </div>
        <div id="spinner-container">
          <div id="spinner"></div>
        </div>
        <div id="boot-phrases"></div>
        <div id="splash-footer">
          <div>Secure Software | All Rights Reserved</div>
          <div>&copy; 2025 | Iconic Developments OS</div>
        </div>
      </div>
    `;
    injectBootCSS();

    const phrases = [
      "Initializing kernel modules...",
      "Loading device drivers...",
      "Checking memory integrity...",
      "Mounting virtual file system...",
      "Starting GPU subsystem...",
      "Loading CPU microcode updates...",
      "Finalizing boot sequence..."
    ];
    const phraseEl = container.querySelector('#boot-phrases');
    const loadingBar = container.querySelector('#loading-bar');
    let index = 0;
    const splashContainer = container.querySelector('#splash-container');
    const splashDuration = 3000; // 3 seconds

    function showNext() {
      if (index >= phrases.length) {
        phraseEl.style.opacity = 0;
        setTimeout(() => {
          phraseEl.textContent = "Boot Complete...";
          phraseEl.style.opacity = 1;
          loadingBar.style.width = '100%';
          setTimeout(() => resolve(), 1000);
        }, 150);
        return;
      }
      phraseEl.style.opacity = 0;
      setTimeout(() => {
        phraseEl.textContent = phrases[index];
        phraseEl.style.opacity = 1;
        loadingBar.style.width = `${((index + 1) / phrases.length) * 100}%`;
        index++;
        setTimeout(showNext, 500 + Math.random() * 300);
      }, 150);
    }
    showNext();

    // Start the timer to transition after the duration
    setTimeout(() => {
      splashContainer.style.opacity = '0';
      setTimeout(() => {
        resolve();
      }, 500); // 500ms for the fade-out transition
    }, splashDuration);
  });
}

function injectBootCSS() {
  const styleId = 'bootscreen-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    #splash-container { 
      height: 100vh; 
      width: 100vw; 
      display: flex; 
      flex-direction: column; 
      justify-content: center; 
      align-items: center; 
      background: #000; 
      color: #fff; 
      position: relative; 
      font-family: Inter, sans-serif; 
      overflow: hidden; 
      transition: opacity 0.5s ease-in-out; 
    }
    #titanos { 
      font-size: 3rem; 
      font-weight: 700; 
      margin-bottom: 6px; 
      animation: pulse 1.5s infinite;
    }
    #developer-credit { 
      font-size: 0.85rem; 
      color: #aaa; 
      margin-bottom: 20px; 
      text-align: center; 
    }
    #loading-bar-container { 
      width: 60%; 
      height: 8px; 
      background: rgba(255,255,255,0.1); 
      border-radius: 8px; 
      overflow: hidden; 
      margin-bottom: 18px; 
    }
    #loading-bar { 
      height: 100%; 
      width: 0; 
      background: linear-gradient(to right, rgba(255,255,255,0.9) 80%, #1E90FF 100%); 
      border-radius: 8px; 
      transition: width 0.2s linear; 
    }
    #spinner-container {
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
    }
    #spinner {
      width: 30px;
      height: 30px;
      border: 4px solid rgba(255, 255, 255, 0.2);
      border-top: 4px solid #fff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    #boot-phrases { 
      font-size: 0.9rem; 
      color: #ccc; 
      text-align: center; 
      min-height: 1.2em; 
      margin-top: 10px; 
      transition: opacity 0.15s linear; 
    }
    #splash-footer { 
      position: absolute; 
      bottom: 12px; 
      text-align: center; 
      font-size: 0.75rem; 
      color: #555; 
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(styleTag);
}
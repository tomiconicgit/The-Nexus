// assets/js/errors.js

// Status tracking for all components
const status = {
  bootscreen: 'unknown',
  loginscreen: 'unknown',
  homescreen: 'unknown',
  worldmap: 'unknown',
  missioncards: 'unknown',
  activemissioncards: 'unknown',
  newscards: 'unknown',
  useraccount: 'unknown',
  currency: 'unknown',
  router: 'unknown'
};

// Global error log to store all errors
const errorLog = [];

let errorContainer = null; // Persistent error container

export function updateCheck(component, state) {
  status[component] = state;
}

export function displayError(message, component, errorCode = 'ERR_UNK') {
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
  const errorEntry = {
    component,
    message,
    errorCode,
    timestamp,
    file: `assets/js/${component.toLowerCase()}.js`
  };
  errorLog.push(errorEntry);
  console.error(`[${timestamp}] ${component} - ${errorCode}: ${message}`);

  // Ensure error container exists and is persistent
  if (!errorContainer || !document.body.contains(errorContainer)) {
    errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      color: #fff;
      z-index: 100000;
      padding: 20px;
      font-family: 'Inter', sans-serif;
      overflow-y: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: all;
    `;
    document.body.appendChild(errorContainer);
  }

  errorContainer.innerHTML = `
    <div class="error-popup">
      <div class="error-header">
        <h3 class="error-title">System Error - ${component}</h3>
        <button class="error-close-btn">✖</button>
      </div>
      <div class="error-details">
        <p><strong>File:</strong> ${errorEntry.file}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Code:</strong> ${errorCode}</p>
        <p><strong>Time:</strong> ${timestamp}</p>
      </div>
      <div class="error-actions">
        <button class="error-copy-btn">Copy Error Details</button>
      </div>
    </div>
  `;

  // Event handlers
  const closeBtn = errorContainer.querySelector('.error-close-btn');
  closeBtn.addEventListener('click', () => {
    errorContainer.style.opacity = '0';
    setTimeout(() => {
      errorContainer.style.display = 'none';
      errorContainer.innerHTML = ''; // Clear content but keep element
    }, 300);
  });

  const copyBtn = errorContainer.querySelector('.error-copy-btn');
  copyBtn.addEventListener('click', () => {
    const copyText = `Component: ${component}\nFile: ${errorEntry.file}\nMessage: ${message}\nCode: ${errorCode}\nTime: ${timestamp}`;
    navigator.clipboard.writeText(copyText).then(() => {
      copyBtn.textContent = 'Copied!';
      copyBtn.style.backgroundColor = '#28a745';
      setTimeout(() => {
        copyBtn.textContent = 'Copy Error Details';
        copyBtn.style.backgroundColor = '#007bff';
      }, 2000);
    }).catch(() => {
      copyBtn.textContent = 'Copy Failed';
      copyBtn.style.backgroundColor = '#dc3545';
      setTimeout(() => {
        copyBtn.textContent = 'Copy Error Details';
        copyBtn.style.backgroundColor = '#007bff';
      }, 2000);
    });
  });

  errorContainer.style.display = 'block';
  errorContainer.style.opacity = '1';
}

export function initErrorSystem(container) {
  if (!container) {
    displayError('App container not found during initialization.', 'Errors', 'ERR_INIT');
    return;
  }

  // Global click handlers
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'BUTTON' && target.disabled) {
      displayError('This action is currently unavailable.', 'UserAction', 'ERR_ACTION');
      event.preventDefault();
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('.app-card') && !isUserAuthorized()) {
      displayError('Access to this mission denied.', 'MissionAccess', 'ERR_AUTH');
      event.preventDefault();
    }
  });

  // Add global error handlers
  window.addEventListener('error', (event) => {
    const error = event.error || new Error(event.message);
    displayError(error.message, 'Global', 'ERR_UNHANDLED');
  });

  window.addEventListener('unhandledrejection', (event) => {
    displayError(event.reason.message || 'Promise rejection', 'Global', 'ERR_PROMISE');
  });

  // Detect potential DOM duplication (e.g., multiple screens)
  const checkDomDuplication = () => {
    const screens = ['#home-screen', '#login-background', '#splash-container'];
    screens.forEach(screenId => {
      const elements = document.querySelectorAll(screenId);
      if (elements.length > 1) {
        displayError(`Multiple instances of ${screenId} detected, possible code duplication.`, 'DOM', 'ERR_DUP');
      }
    });
  };
  checkDomDuplication(); // Run on init
  setInterval(checkDomDuplication, 5000); // Periodic check
}

// Mock authorization check
function isUserAuthorized() {
  return false;
}

function injectErrorCSS() {
  const styleId = 'error-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    .error-popup {
      background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
      border: 1px solid #444;
      border-radius: 15px;
      padding: 20px;
      max-width: 90%;
      width: 400px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);
      color: #fff;
      font-family: 'Inter', sans-serif;
      text-align: left;
    }
    .error-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .error-title {
      font-size: 1.6rem;
      font-weight: 700;
      color: #ff4444;
      margin: 0;
    }
    .error-close-btn {
      background: none;
      border: none;
      color: #ff4444;
      font-size: 1.2rem;
      cursor: pointer;
      transition: color 0.3s;
    }
    .error-close-btn:hover {
      color: #ff6666;
    }
    .error-details {
      background: rgba(255, 255, 255, 0.05);
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    .error-details p {
      margin: 5px 0;
      font-size: 0.9rem;
    }
    .error-details strong {
      color: #00CED1;
    }
    .error-actions {
      text-align: center;
    }
    .error-copy-btn {
      padding: 10px 20px;
      background: #007bff;
      border: none;
      border-radius: 8px;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }
    .error-copy-btn:hover {
      background: #0056b3;
    }
  `;
  document.head.appendChild(styleTag);
}

injectErrorCSS();
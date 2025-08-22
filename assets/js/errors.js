// assets/js/errors.js

// Status tracking for all components (including planned modules)
const status = {
  bootscreen: 'unknown',
  loginscreen: 'unknown',
  homescreen: 'unknown',
  worldmap: 'unknown',
  missioncards: 'unknown',
  activemissions: 'unknown',
  newscards: 'unknown',
  useraccount: 'unknown',
  currency: 'unknown',
  router: 'unknown',
  map: 'unknown',
  user: 'unknown',
  stats: 'unknown',
  nim: 'unknown',
  majorevents: 'unknown',
  worldmissions: 'unknown',
  story: 'unknown',
  anna: 'unknown'
};

// Global error log
const errorLog = [];
let errorContainer = null;

// Initialize error system
export function initErrorSystem(container) {
  if (!container) {
    console.error('App container not found during initialization.');
    showFallbackError('App container not found.', 'Errors', 'ERR_INIT');
    return;
  }

  // Create persistent error container
  errorContainer = document.createElement('div');
  errorContainer.id = 'error-container';
  errorContainer.setAttribute('role', 'alert');
  errorContainer.setAttribute('aria-live', 'assertive');
  errorContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    color: #f2f2f7;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    overflow-y: auto;
    padding: 20px;
    box-sizing: border-box;
  `;
  document.body.appendChild(errorContainer);

  // Global error handlers
  window.addEventListener('error', handleGlobalError);
  window.addEventListener('unhandledrejection', handlePromiseRejection);

  // Check for critical boot files
  checkBootErrors();

  // Periodic DOM duplication check
  setInterval(checkDomDuplication, 5000);
  checkDomDuplication();

  // Global click handler for disabled actions
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'BUTTON' && target.disabled) {
      displayError('This action is currently unavailable.', 'UserAction', 'ERR_ACTION');
      event.preventDefault();
    }
  });

  // Authorization check for mission cards
  document.addEventListener('click', (event) => {
    if (event.target.closest('.app-card') && !isUserAuthorized()) {
      displayError('Access to this mission denied.', 'MissionAccess', 'ERR_AUTH');
      event.preventDefault();
    }
  });

  injectErrorCSS();
}

// Update component status
export function updateCheck(component, state) {
  if (status[component] !== undefined) {
    status[component] = state;
    try {
      localStorage.setItem('titanos-status', JSON.stringify(status));
    } catch (err) {
      console.warn('Failed to persist status:', err);
    }
  } else {
    displayError(`Unknown component: ${component}`, 'Errors', 'ERR_COMP');
  }
}

// Log and display error
export function displayError(message, component = 'Unknown', errorCode = 'ERR_UNK', isCritical = false) {
  const timestamp = new Date().toISOString();
  const errorEntry = {
    component,
    message,
    errorCode,
    timestamp,
    file: `assets/js/${component.toLowerCase()}.js`
  };
  errorLog.push(errorEntry);
  console.error(`[${timestamp}] ${component} (${errorCode}): ${message}`);

  // Persist to localStorage
  try {
    localStorage.setItem('titanos-error-log', JSON.stringify(errorLog.slice(-100)));
  } catch (err) {
    console.warn('Failed to persist error log:', err);
  }

  if (!errorContainer) {
    showFallbackError(message, component, errorCode);
    return;
  }

  const errorElement = document.createElement('div');
  errorElement.className = 'error-popup';
  errorElement.setAttribute('tabindex', '0');
  errorElement.innerHTML = `
    <div class="error-header">
      <h3 class="error-title">System Error - ${component}</h3>
      <button class="error-close-btn" aria-label="Close error">✖</button>
    </div>
    <div class="error-details">
      <p><strong>File:</strong> ${errorEntry.file}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Code:</strong> ${errorCode}</p>
      <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
    </div>
    <div class="error-actions">
      <button class="error-copy-btn">Copy Error Details</button>
      ${isCritical ? '<button class="error-retry-btn">Retry</button>' : ''}
    </div>
  `;
  errorContainer.appendChild(errorElement);
  errorContainer.style.display = 'flex';
  errorElement.focus();

  // Event handlers
  const closeBtn = errorElement.querySelector('.error-close-btn');
  closeBtn.addEventListener('click', () => {
    errorElement.style.animation = 'slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => {
      errorElement.remove();
      if (!errorContainer.children.length) errorContainer.style.display = 'none';
    }, 300);
  });

  const copyBtn = errorElement.querySelector('.error-copy-btn');
  copyBtn.addEventListener('click', () => {
    const copyText = `Component: ${component}\nFile: ${errorEntry.file}\nMessage: ${message}\nCode: ${errorCode}\nTime: ${new Date(timestamp).toLocaleString('en-GB', { timeZone: 'Europe/London' })}`;
    navigator.clipboard.writeText(copyText).then(() => {
      copyBtn.textContent = 'Copied!';
      copyBtn.style.backgroundColor = '#34c759';
      setTimeout(() => {
        copyBtn.textContent = 'Copy Error Details';
        copyBtn.style.backgroundColor = '#007bff';
      }, 2000);
    }).catch(() => {
      copyBtn.textContent = 'Copy Failed';
      copyBtn.style.backgroundColor = '#ff4b4b';
      setTimeout(() => {
        copyBtn.textContent = 'Copy Error Details';
        copyBtn.style.backgroundColor = '#007bff';
      }, 2000);
    });
  });

  if (isCritical) {
    const retryBtn = errorElement.querySelector('.error-retry-btn');
    retryBtn.addEventListener('click', () => window.location.reload());
  }

  // Auto-dismiss non-critical errors
  if (!isCritical) {
    setTimeout(() => {
      errorElement.style.animation = 'slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => {
        errorElement.remove();
        if (!errorContainer.children.length) errorContainer.style.display = 'none';
      }, 300);
    }, 5000);
  }

  // Haptic feedback
  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
}

// Fallback for when error container fails
function showFallbackError(message, component, errorCode) {
  console.error(`[${component}] ${errorCode}: ${message}`);
  alert(`Error: ${component} (${errorCode}): ${message}`);
}

// Handle global errors
function handleGlobalError(event) {
  const errorDetails = {
    message: event.message || 'Unknown error',
    module: event.filename || 'Global',
    code: 'ERR_GLOBAL',
    timestamp: new Date().toISOString(),
    line: event.lineno || 'N/A',
    column: event.colno || 'N/A'
  };
  errorLog.push(errorDetails);
  displayError(errorDetails.message, errorDetails.module, errorDetails.code);
}

// Handle promise rejections
function handlePromiseRejection(event) {
  const errorDetails = {
    message: event.reason?.message || 'Unhandled promise rejection',
    module: 'Promise',
    code: 'ERR_PROMISE',
    timestamp: new Date().toISOString()
  };
  errorLog.push(errorDetails);
  displayError(errorDetails.message, errorDetails.module, errorDetails.code);
}

// Check for critical boot files
function checkBootErrors() {
  const criticalFiles = [
    '/index.html',
    '/manifest.json',
    '/assets/js/bootscreen.js',
    '/assets/js/router.js',
    '/assets/js/performance.js'
  ];
  criticalFiles.forEach(file => {
    fetch(file, { method: 'HEAD' })
      .catch(() => {
        displayError(`Critical file missing: ${file}`, 'Boot', 'ERR_BOOT_FILE', true);
      });
  });
}

// Check for DOM duplication
function checkDomDuplication() {
  const screens = ['#home-screen', '#login-background', '#splash-container'];
  screens.forEach(screenId => {
    const elements = document.querySelectorAll(screenId);
    if (elements.length > 1) {
      displayError(`Multiple instances of ${screenId} detected.`, 'DOM', 'ERR_DUP');
    }
  });
}

// Mock authorization check (to be moved to user.js)
function isUserAuthorized() {
  return localStorage.getItem('user-auth') === 'true';
}

// Inject CSS
function injectErrorCSS() {
  const styleId = 'error-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    .error-popup {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 15px;
      padding: 20px;
      max-width: 90%;
      width: 400px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.05);
      color: #f2f2f7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      text-align: left;
      animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .error-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .error-title {
      font-size: 1.6em;
      font-weight: 700;
      color: #ff4b4b;
      margin: 0;
    }
    .error-close-btn {
      background: none;
      border: none;
      color: #ff4b4b;
      font-size: 1.2em;
      cursor: pointer;
      transition: color 0.3s;
    }
    .error-close-btn:hover, .error-close-btn:focus {
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
      font-size: 0.9em;
    }
    .error-details strong {
      color: #34c759;
    }
    .error-actions {
      text-align: center;
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    .error-copy-btn, .error-retry-btn {
      padding: 10px 20px;
      background: #007bff;
      border: none;
      border-radius: 8px;
      color: #f2f2f7;
      font-size: 1em;
      cursor: pointer;
      transition: background 0.3s;
    }
    .error-copy-btn:hover, .error-copy-btn:focus {
      background: #0056b3;
    }
    .error-retry-btn:hover, .error-retry-btn:focus {
      background: #34c759;
    }
    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(-20px); opacity: 0; }
    }
  `;
  document.head.appendChild(styleTag);
}
// assets/js/errors.js

// Status tracking for active components
const status = {
  bootscreen: 'unknown',
  loginscreen: 'unknown',
  homescreen: 'unknown',
  router: 'unknown',
  navigation: 'unknown',
  header: 'unknown',
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
    background: rgba(0, 0, 0, 0.7); /* Darker overlay for better contrast */
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    color: #f2f2f7;
    font-family: var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
    overflow-y: auto;
    padding: 20px;
    box-sizing: border-box;
    backdrop-filter: blur(8px); /* Apply blur to the overlay */
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
      <h3 class="error-title">System Alert</h3>
      <button class="error-close-btn" aria-label="Close error">✖</button>
    </div>
    <div class="error-details">
      <p class="error-message-text">${message}</p>
      <div class="error-meta">
        <span class="error-meta-item"><strong>Component:</strong> ${component}</span>
        <span class="error-meta-item"><strong>Code:</strong> ${errorCode}</span>
        <span class="error-meta-item"><strong>Time:</strong> ${new Date(timestamp).toLocaleString('en-GB', { timeZone: 'Europe/London' })}</span>
      </div>
    </div>
    <div class="error-actions">
      <button class="error-copy-btn">Copy</button>
      ${isCritical ? '<button class="error-retry-btn">Retry</button>' : ''}
    </div>
  `;
  errorContainer.appendChild(errorElement);
  errorContainer.style.display = 'flex';
  errorElement.focus();

  // Event handlers
  const closeBtn = errorElement.querySelector('.error-close-btn');
  closeBtn.addEventListener('click', () => {
    errorElement.classList.add('hide');
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
      copyBtn.classList.add('success');
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('success');
      }, 2000);
    }).catch(() => {
      copyBtn.textContent = 'Failed';
      copyBtn.classList.add('failed');
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('failed');
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
      if (errorElement.parentElement) {
        errorElement.classList.add('hide');
        setTimeout(() => {
          errorElement.remove();
          if (!errorContainer.children.length) errorContainer.style.display = 'none';
        }, 300);
      }
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
    component: event.filename || 'Global',
    errorCode: 'ERR_GLOBAL',
    timestamp: new Date().toISOString(),
    file: event.filename || 'N/A'
  };
  errorLog.push(errorDetails);
  displayError(errorDetails.message, errorDetails.component, errorDetails.errorCode);
}

// Handle promise rejections
function handlePromiseRejection(event) {
  const errorDetails = {
    message: event.reason?.message || 'Unhandled promise rejection',
    component: 'Promise',
    errorCode: 'ERR_PROMISE',
    timestamp: new Date().toISOString()
  };
  errorLog.push(errorDetails);
  displayError(errorDetails.message, errorDetails.component, errorDetails.errorCode);
}

// Check for critical boot files
function checkBootErrors() {
  const criticalFiles = [
    '/index.html',
    '/manifest.json',
    '/assets/js/bootscreen.js',
    '/assets/js/router.js',
    '/assets/js/navigation.js',
    '/assets/js/homescreen.js'
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
      background: rgba(18, 22, 30, 0.4);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 20px;
      max-width: 380px;
      width: 90%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      color: #f2f2f7;
      text-align: left;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 1;
      transform: translateY(0);
    }
    .error-popup.hide {
      opacity: 0;
      transform: translateY(-20px);
    }
    .error-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .error-title {
      font-size: 1.2em;
      font-weight: 600;
      color: #ff3b30;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .error-close-btn {
      background: none;
      border: none;
      color: #8e8e93;
      font-size: 1.2em;
      cursor: pointer;
      transition: color 0.3s;
    }
    .error-close-btn:hover, .error-close-btn:focus {
      color: #f2f2f7;
    }
    .error-details {
      margin-bottom: 15px;
    }
    .error-message-text {
      margin: 0 0 10px 0;
      font-size: 1em;
      line-height: 1.4;
    }
    .error-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 5px 15px;
      font-size: 0.75em;
      color: #8e8e93;
    }
    .error-meta strong {
      color: #f2f2f7;
      font-weight: 500;
    }
    .error-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    .error-copy-btn, .error-retry-btn {
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      color: #f2f2f7;
      font-size: 0.85em;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.3s, border-color 0.3s;
    }
    .error-copy-btn:hover, .error-copy-btn:focus {
      background: rgba(255, 255, 255, 0.2);
    }
    .error-retry-btn {
      background-color: #34c759;
      border-color: #34c759;
    }
    .error-retry-btn:hover {
      background-color: #2eaf51;
    }
    .error-copy-btn.success {
      background-color: #34c759;
      border-color: #34c759;
    }
    .error-copy-btn.failed {
      background-color: #ff4b4b;
      border-color: #ff4b4b;
    }
  `;
  document.head.appendChild(styleTag);
}

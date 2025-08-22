// assets/js/router.js

import { loadBootScreen } from './bootscreen.js';
import { loadLoginScreen } from './loginscreen.js';
import { loadHomeScreen } from './homescreen.js';
import { displayError } from './errors.js';

export async function initApp(container) {
  if (!container) {
    displayError('App container not found. Please ensure the #app element exists.', 'Router', 'ERR_INIT');
    return;
  }

  try {
    // Load boot screen
    await loadBootScreen(container);

    // Remove boot screen
    const bootEl = container.querySelector('#splash-container');
    if (bootEl) bootEl.remove();
    else displayError('Boot screen container not found for removal.', 'Router', 'ERR_BOOT');

    // Load login screen
    await loadLoginScreen(container);

    // Wait for login completion
    const loginScreen = container.querySelector('#login-background');
    if (!loginScreen) {
      displayError('Login screen element (#login-background) not found.', 'Router', 'ERR_LOGIN');
      return;
    }
    loginScreen.style.transition = 'opacity 0.5s ease-in-out';
    loginScreen.style.opacity = '1';

    // Simulate login completion (replace with actual login logic)
    await new Promise(resolve => setTimeout(resolve, 2000)); // Mock login delay

    // Remove login screen
    loginScreen.remove();

    // Load home screen
    await loadHomeScreen(container);
  } catch (err) {
    displayError(`Failed to initialize app: ${err.message}`, 'Router', 'ERR_APP');
  }
}
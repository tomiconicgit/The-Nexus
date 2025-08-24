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
    // -----------------------------------------------------------------
    // To skip the boot and login screens for development,
    // comment out the following lines and uncomment the last one.
    // -----------------------------------------------------------------

    // Original flow:
    // await loadBootScreen(container);
    // const bootEl = container.querySelector('#splash-container');
    // if (bootEl) bootEl.remove();
    // else displayError('Boot screen container not found for removal.', 'Router', 'ERR_BOOT');
    // await loadLoginScreen(container);
    // const loginScreen = container.querySelector('#login-background');
    // if (!loginScreen) {
    //   displayError('Login screen element (#login-background) not found.', 'Router', 'ERR_LOGIN');
    //   return;
    // }
    // loginScreen.style.transition = 'opacity 0.5s ease-in-out';
    // loginScreen.style.opacity = '1';
    // await new Promise(resolve => setTimeout(resolve, 2000));
    // loginScreen.remove();

    // Direct to Home Screen for development:
    await loadHomeScreen(container);

  } catch (err) {
    displayError(`Failed to initialize app: ${err.message}`, 'Router', 'ERR_APP');
  }
}

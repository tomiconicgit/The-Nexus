// loginscreen.js

// Purpose: Initializes the login screen, loads assets, and handles UI transitions.
export function initLoginScreen() {
  const container = document.getElementById('login-screen');
  if (!container) {
    console.error('Login screen container not found');
    return;
  }

  preloadSealLogo(container);
  generateParticles();
  setupLoginEvents(container);
  applyResponsiveLayout(container);
}

// Preloads the Nexus seal logo and handles load errors.
function preloadSealLogo(container) {
  const sealPath = '/assets/images/nexusseal.png'; // Ensure lowercase filename

  const logoImg = new Image();
  logoImg.src = sealPath;
  logoImg.decoding = 'async';

  logoImg.onload = () => {
    const loginTitle = container.querySelector('#login-title');
    if (loginTitle) {
      loginTitle.removeAttribute('loading');
      loginTitle.src = sealPath;
      loginTitle.classList.add('loaded');
    }
  };

  logoImg.onerror = () => {
    displayError(
      'Failed to load Nexus seal logo. Check file path or format.',
      'LoginScreen',
      'ERR_SEAL_LOAD',
      true
    );
  };
}

// Generates animated particles for the login screen background.
function generateParticles() {
  const container = document.getElementById('particle-container');
  if (!container) {
    console.warn('Particle container not found');
    return;
  }

  const particleCount = 8; // Reduced for performance optimization.
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

// Sets up login button and input events.
function setupLoginEvents(container) {
  const loginBtn = container.querySelector('#login-btn');
  const usernameInput = container.querySelector('#username');
  const passwordInput = container.querySelector('#password');

  if (!loginBtn || !usernameInput || !passwordInput) {
    console.warn('Login elements missing');
    return;
  }

  loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      displayError('Username and password required', 'LoginScreen', 'ERR_CREDENTIALS');
      return;
    }

    authenticateUser(username, password);
  });
}

// Applies layout adjustments based on screen size.
function applyResponsiveLayout(container) {
  const isMobile = window.innerWidth < 768;
  container.classList.toggle('mobile-layout', isMobile);
}

// Simulated authentication handler (replace with real logic).
function authenticateUser(username, password) {
  console.log(`Authenticating ${username}...`);
  // TODO: Replace with secure auth logic
  setTimeout(() => {
    if (username === 'admin' && password === 'nexus') {
      window.location.href = '/homescreen.html';
    } else {
      displayError('Invalid credentials', 'LoginScreen', 'ERR_AUTH_FAIL');
    }
  }, 800);
}

// Displays error messages in a consistent format.
function displayError(message, source, code, critical = false) {
  console.error(`[${source}] ${code}: ${message}`);
  const errorBox = document.getElementById('error-box');
  if (errorBox) {
    errorBox.textContent = message;
    errorBox.classList.add('visible');
    if (critical) errorBox.classList.add('critical');
  }
}

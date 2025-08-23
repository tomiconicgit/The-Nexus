// assets/js/loginscreen.js
import { loadHomeScreen } from './homescreen.js';
import { updateCheck, displayError } from './errors.js';

const BUILD_VERSION = "0.174";
let usernameTyped = false;
let passwordTyped = false;

export function loadLoginScreen(container) {
  return new Promise((resolve) => {
    try {
      updateCheck('loginscreen', 'ok');

      container.innerHTML = `
        <div id="login-background">
          <div id="login-content" class="stage-panel" aria-hidden="false">
            <img id="login-title" src="assets/images/nexusseal.PNG" alt="Nexus Intelligence Agency Seal" loading="lazy">
            <div id="form-elements">
              <div class="input-group">
                <label for="username">ID</label>
                <input type="text" id="username" autocomplete="off" class="login-input" readonly tabindex="-1">
              </div>
              <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" autocomplete="off" class="login-input" readonly tabindex="-1">
              </div>
              <div id="login-buttons">
                <button class="glassy-btn primary" id="login-btn" disabled>Login</button>
                <button class="glassy-btn outline" disabled>Register</button>
              </div>
            </div>
          </div>

          <div id="sequence-panel" class="stage-panel" aria-hidden="true">
            <div id="sequence-text"></div>
            <div id="sequence-bar-container">
              <div id="sequence-bar"></div>
            </div>
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
      const formPanel = container.querySelector('#login-content');
      const seqPanel = container.querySelector('#sequence-panel');
      const seqText = container.querySelector('#sequence-text');
      const seqBar = container.querySelector('#sequence-bar');
      const bg = container.querySelector('#login-background');
      const loginTitle = container.querySelector('#login-title');

      if (!usernameInput || !passwordInput || !loginBtn || !formPanel || !seqPanel || !seqText || !seqBar || !bg || !loginTitle) {
        displayError('Login DOM not ready', 'LoginScreen', 'ERR_FORM_ELEMENTS');
        resolve();
        return;
      }

      // Add fade-in for title and form
      loginTitle.style.opacity = '1';
      formPanel.style.opacity = '1';

      // Username typing
      usernameInput.addEventListener('click', async () => {
        if (!usernameTyped) {
          usernameInput.value = '';
          await typeText(usernameInput, 'Agent 173');
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

      // LOGIN sequence
      loginBtn.addEventListener('click', async () => {
        if (!passwordTyped) return;
        softHaptic();

        try {
          formPanel.setAttribute('aria-hidden', 'true');
          seqPanel.setAttribute('aria-hidden', 'false');

          const agentID = (usernameInput.value && usernameInput.value.trim()) || 'Agent 173';

          const sequences = [
            "Decrypting Credentials",
            "Loading Security Keys",
            "Verifying Access",
            "Initializing NEXUS Software",
            "Establishing Secure Session"
          ];

          for (let seq of sequences) {
            await animateKBWithBar(seqText, seqBar, seq);
            await wait(400);
          }

          // Welcome text with fade left to right
          seqText.innerHTML = `<span id="welcome-text">Welcome, ${agentID}</span>`;
          const welcomeEl = container.querySelector('#welcome-text');
          welcomeEl.style.opacity = 0;
          welcomeEl.style.background = 'rgba(0,0,0,0.25)';
          welcomeEl.style.padding = '4px 8px';
          welcomeEl.style.borderRadius = '4px';
          welcomeEl.style.display = 'inline-block';
          welcomeEl.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
          welcomeEl.style.transform = 'translateX(-30px)';

          requestAnimationFrame(() => {
            welcomeEl.style.opacity = 1;
            welcomeEl.style.transform = 'translateX(0)';
          });

          await wait(1600);
          bg.style.transition = 'opacity 0.45s ease-in-out';
          bg.style.opacity = '0';
          await wait(460);
          bg.remove();
          await loadHomeScreen(container);
          resolve();
        } catch (err) {
          displayError(`Login sequence failed: ${err.message}`, 'LoginScreen', 'ERR_LOGIN_FAIL');
          resolve();
        }
      });

    } catch (err) {
      updateCheck('loginscreen', 'fail');
      displayError(`Failed to load login screen: ${err.message}`, 'LoginScreen', 'ERR_LOGIN_LOAD');
      resolve();
    }
  });
}

// Typing animation
function typeText(el, text) {
  return new Promise((res) => {
    let i = 0;
    (function typeChar() {
      if (i < text.length) {
        el.value += text.charAt(i++);
        softHaptic();
        setTimeout(typeChar, 50 + Math.random() * 120);
      } else res();
    })();
  });
}

// Haptic feedback
function softHaptic() { if (navigator.vibrate) navigator.vibrate(10); }
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

// KB simulation + progress bar
function animateKBWithBar(textEl, barEl, phrase) {
  return new Promise((res) => {
    const targetKB = Math.floor(100 + Math.random() * 900);
    let kb = 0;
    const speed = 10 + Math.random() * 20;

    const interval = setInterval(() => {
      kb += Math.floor(Math.random() * speed);
      if (kb >= targetKB) kb = targetKB;

      textEl.textContent = `${phrase} ... ${kb}KB`;
      const pct = (kb / targetKB) * 100;
      barEl.style.width = pct + '%';

      if (kb >= targetKB) {
        clearInterval(interval);
        barEl.style.width = '0%';
        setTimeout(res, 250);
      }
    }, 35);
  });
}

// Inject CSS
function injectLoginCSS() {
  const id = 'loginscreen-styles';
  if (document.getElementById(id)) return;

  if (!document.querySelector('meta[name=viewport]')) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(meta);
  }

  const style = document.createElement('style');
  style.id = id;
  style.innerHTML = `
    :root{
      --glass-bg: rgba(255,255,255,0.1);
      --input-border-color:#555;
      --text-color:#f2f2f7;
      --accent-color:#1E90FF;
      --font-ui:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
      --font-agency:'Courier New',Courier,monospace;
    }

    html, body { touch-action: manipulation; -webkit-text-size-adjust: 100%; user-select: none; }

    .stage-panel[aria-hidden="true"]{ display:none; }
    .stage-panel[aria-hidden="false"]{ display:flex; }

    #login-background{
      height:100vh;width:100vw;
      display:flex;flex-direction:column;justify-content:center;align-items:center;
      color:var(--text-color);font-family:var(--font-ui);position:relative;overflow:hidden;
      transition:opacity .3s ease-in-out;
      background-color:#000;
      
      /* New background layers and animation */
      background-image:
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 500'%3E%3Cpath fill='rgba(255,255,255,0.05)' d='M978.88 471.21L980 472l-1.12-0.79c-1.32-0.94-2.67-1.74-4.04-2.42-2.1-1.07-4.22-2.02-6.38-2.85-4.42-1.76-8.87-3.32-13.35-4.66-8.98-2.69-18.06-4.9-27.24-6.61-18.35-3.48-36.94-5.74-55.72-6.57-37.56-1.7-75.32-0.54-113.1 3.51-24.31 2.59-48.51 6.55-72.33 11.96-23.01 5.26-45.54 11.45-67.24 18.9-20.93 7.19-41.05 15.22-60.03 24.58-18.6 9.1-36.19 19.34-52.79 30.82-16.89 11.75-32.55 24.34-46.74 38.08-14.7 14.39-27.2 29.83-37.45 45.98-12.01 18.91-20.12 39.4-24.89 60.54-4.66 20.6-5.46 41.74-2.58 62.91 3.01 21.68 9.53 42.66 19.53 62.39 12.02 23.63 27.65 45.41 46.85 64.91 22.08 22.38 48.01 41.13 76.54 55.75 29.85 15.22 62.06 25.13 95.73 29.56 31.81 4.2-61.94 13.56-94.88 8.08-33.15-5.52-65.7-18.15-95.31-37.74-28.91-19.16-55.08-41.97-77.92-68.53-22.3-25.9-41.1-54.3-56.12-84.58-14.73-29.61-25.29-60.67-31.96-91.82-7.15-33.72-8.31-67.65-4.11-100.22 4.31-33.13 13.91-65.25 28.53-95.27 15.11-30.93 33.43-60.27 55.25-88.07 23.36-29.8 49.33-58.01 77.99-84.09 29.35-26.68 59.81-50.91 91.22-72.76 30.87-21.46 61.5-40.85 91.31-58.33 29.43-17.29 57.5-32.35 83.94-44.59 26.8-12.44 51.55-21.94 73.84-28.73 22.8-6.95 43.15-11.51 60.82-13.79 17.65-2.28 32.74-2.22 45.28 0.16 12.18 2.3 22.18 6.55 29.98 12.51 7.42 5.75 12.9 12.82 17.06 21.05 4.09 8.08 6.94 16.63 8.35 25.12 1.45 8.79 1.34 17.6-0.3 26.16-1.63 8.54-4.23 16.73-7.85 24.36-3.87 8.06-8.52 15.82-13.88 23.1-5.6 7.64-11.96 15.02-18.89 22.02-6.66 6.5-13.92 12.63-21.49 18.25-7.79 5.86-15.93 11.21-24.16 16.16-8.15 4.88-16.51 9.38-24.77 13.56-8.1 4.1-16.14 7.9-23.77 11.23-7.52 3.25-14.77 6.13-21.43 8.52-6.52 2.3-12.85 4.14-18.73 5.48-5.91 1.35-11.45 2.15-16.48 2.45-5.06 0.3-9.58-0.03-13.54-0.96-3.89-0.9-7.23-2.31-10.03-4.14-2.71-1.78-5.11-3.95-7.14-6.42-1.92-2.32-3.7-4.9-5.15-7.6-1.52-2.85-2.7-5.83-3.64-8.87-0.9-2.92-1.62-5.9-1.99-8.86-0.34-2.88-0.65-5.74-0.78-8.54-0.12-2.8-0.09-5.59 0.08-8.34 0.16-2.76 0.44-5.5 0.76-8.17 0.35-2.9 0.81-5.74 1.3-8.5 0.52-2.8 1.05-5.56 1.62-8.24 0.58-2.69 1.15-5.32 1.69-7.9 0.54-2.58 1.04-5.12 1.44-7.6 0.4-2.48 0.74-4.88 0.94-7.22 0.22-2.42 0.3-4.68 0.27-6.84-0.04-2.16-0.28-4.18-0.56-6.09-0.3-1.9-0.67-3.66-1.12-5.28-0.44-1.6-0.96-3.09-1.52-4.42-0.58-1.35-1.22-2.58-1.89-3.69-0.64-1.11-1.34-2.07-2.06-2.89-0.73-0.81-1.5-1.46-2.28-1.9-0.75-0.45-1.55-0.73-2.3-0.87-0.73-0.14-1.5-0.12-2.24-0.08-0.71 0.04-1.44 0.18-2.12 0.39-0.69 0.21-1.34 0.49-1.95 0.84-0.61 0.35-1.18 0.75-1.72 1.2-0.53 0.45-1.02 0.95-1.47 1.48-0.43 0.53-0.85 1.08-1.2 1.64-0.35 0.56-0.67 1.14-0.9 1.72-0.24 0.59-0.44 1.18-0.61 1.79-0.15 0.6-0.29 1.21-0.39 1.83-0.12 0.64-0.19 1.27-0.24 1.9-0.06 0.63-0.09 1.26-0.08 1.88 0.01 0.63 0.07 1.24 0.17 1.84 0.11 0.61 0.27 1.22 0.44 1.8-0.35 1.58-1.05 3.02-2.03 4.34-0.93 1.26-2.04 2.4-3.23 3.42-1.17 1.0-2.4 1.9-3.66 2.68-1.28 0.79-2.57 1.48-3.86 2.1-1.3 0.61-2.61 1.13-3.88 1.57-1.25 0.43-2.5 0.76-3.72 0.99-1.25 0.24-2.49 0.37-3.68 0.4-1.2 0.03-2.35-0.01-3.48-0.08-1.14-0.07-2.27-0.15-3.37-0.24-1.1-0.1-2.18-0.23-3.22-0.36-1.02-0.13-2.04-0.29-3.03-0.46-0.98-0.17-1.95-0.36-2.9-0.55-0.94-0.2-1.87-0.41-2.77-0.63-0.89-0.22-1.75-0.47-2.6-0.72-0.83-0.25-1.66-0.52-2.46-0.8-0.79-0.29-1.57-0.59-2.33-0.92-0.76-0.34-1.51-0.69-2.23-1.07-0.73-0.37-1.43-0.78-2.1-1.19-0.66-0.41-1.32-0.84-1.93-1.29-0.6-0.46-1.18-0.93-1.7-1.43-0.52-0.5-0.99-1.03-1.42-1.56-0.42-0.54-0.82-1.08-1.15-1.63-0.33-0.56-0.64-1.1-0.85-1.65-0.23-0.55-0.38-1.09-0.5-1.6-0.13-0.51-0.21-0.97-0.26-1.42-0.05-0.44-0.06-0.87-0.02-1.28 0.04-0.41 0.12-0.8 0.24-1.17 0.12-0.37 0.29-0.73 0.48-1.07 0.19-0.34 0.42-0.67 0.65-0.99 0.24-0.31 0.5-0.62 0.76-0.92 0.26-0.3 0.53-0.59 0.81-0.88 0.27-0.29 0.56-0.57 0.85-0.85 0.3-0.28 0.61-0.56 0.94-0.83 0.32-0.27 0.65-0.54 0.98-0.8 0.34-0.26 0.69-0.52 1.04-0.78 0.36-0.25 0.72-0.5 1.09-0.74 0.38-0.25 0.75-0.48 1.13-0.7 0.38-0.22 0.76-0.43 1.15-0.63 0.39-0.2 0.77-0.4 1.17-0.58 0.4-0.18 0.8-0.36 1.2-0.52 0.4-0.16 0.8-0.32 1.19-0.48 0.4-0.16 0.8-0.3 1.2-0.44 0.4-0.15 0.79-0.28 1.19-0.42 0.39-0.14 0.79-0.26 1.18-0.39 0.38-0.12 0.78-0.25 1.16-0.37 0.39-0.12 0.77-0.24 1.15-0.36 0.38-0.12 0.76-0.23 1.14-0.34 0.38-0.11 0.75-0.22 1.13-0.32 0.37-0.11 0.74-0.21 1.11-0.3 0.36-0.09 0.73-0.19 1.09-0.26 0.36-0.08 0.72-0.15 1.07-0.21 0.35-0.06 0.7-0.12 1.04-0.16 0.33-0.04 0.66-0.07 0.99-0.09 0.32-0.01 0.64-0.01 0.96 0.01 0.32 0.02 0.64 0.05 0.95 0.09 0.32 0.04 0.63 0.09 0.93 0.15 0.31 0.07 0.6 0.16 0.89 0.25 0.29 0.09 0.58 0.19 0.86 0.31 0.28 0.12 0.56 0.25 0.83 0.4 0.27 0.15 0.54 0.3 0.8 0.47 0.27 0.17 0.52 0.36 0.78 0.55 0.25 0.19 0.5 0.39 0.75 0.6 0.24 0.21 0.48 0.44 0.71 0.67 0.23 0.23 0.46 0.47 0.68 0.72 0.22 0.25 0.43 0.51 0.64 0.78 0.21 0.27 0.41 0.55 0.61 0.84 0.2 0.29 0.4 0.59 0.59 0.91 0.18 0.32 0.37 0.65 0.54 0.99 0.18 0.34 0.35 0.69 0.52 1.05 0.17 0.36 0.34 0.72 0.49 1.1 0.15 0.38 0.31 0.76 0.46 1.15 0.15 0.39 0.29 0.79 0.43 1.2 0.14 0.4 0.28 0.81 0.41 1.22 0.13 0.41 0.26 0.82 0.39 1.24 0.13 0.42 0.25 0.85 0.38 1.28 0.12 0.43 0.24 0.87 0.37 1.31 0.13 0.44 0.25 0.88 0.38 1.32 0.13 0.44 0.27 0.88 0.39 1.33 0.12 0.44 0.25 0.87 0.37 1.31 0.13 0.44 0.26 0.86 0.39 1.29 0.12 0.43 0.25 0.85 0.38 1.26 0.13 0.41 0.25 0.81 0.37 1.21 0.12 0.4 0.24 0.79 0.37 1.18 0.12 0.39 0.24 0.77 0.37 1.14 0.11 0.37 0.22 0.72 0.35 1.07 0.1 0.35 0.2 0.68 0.33 1.01 0.09 0.33 0.19 0.64 0.31 0.94 0.08 0.3 0.17 0.58 0.29 0.88 0.07 0.27 0.15 0.52 0.27 0.81 0.05 0.24 0.12 0.46 0.25 0.74 0.04 0.21 0.09 0.39 0.22 0.66 0.04 0.19 0.07 0.33 0.2 0.58 0.03 0.16 0.05 0.28 0.17 0.5 0.03 0.14 0.04 0.22 0.15 0.43 0.02 0.11 0.03 0.18 0.12 0.36 0.02 0.09 0.02 0.13 0.09 0.28 0.01 0.07 0.01 0.1 0.07 0.22 0.01 0.05 0.01 0.06 0.05 0.16 0 0.04 0.01 0.03 0.03 0.1 0 0.02 0 0.01 0.02 0.06 0 0.01 0 0 0.01 0.03 0 0 0 0 0 0Z'/%3E%3C/svg%3E"),
        radial-gradient(ellipse at center, rgba(255,255,255,.03) 0%, rgba(255,255,255,0) 70%),
        repeating-linear-gradient(to right,transparent,transparent 99px,rgba(255,255,255,.05) 100px),
        repeating-linear-gradient(to bottom,transparent,transparent 99px,rgba(255,255,255,.05) 100px);
      
      background-size: cover, cover, 100% 100vh, 100vw 100%;
      background-position: center, center, center, center;
      background-repeat: no-repeat, no-repeat, repeat, repeat;
      animation: animateBackground 30s linear infinite;
    }

    /* Animation for the background layers */
    @keyframes animateBackground {
      0% { background-position: 50% 50%, center, center, center; }
      100% { background-position: 50% 55%, center, center, center; }
    }
    
    #login-content{z-index:3;flex-direction:column;justify-content:center;align-items:center;gap:14px;padding:20px;width:90%;max-width:360px;opacity:0;animation:fadeInLogin .8s ease forwards;}
    @keyframes fadeInLogin{ from{opacity:0;} to{opacity:1;} }

    #login-title{max-width:170px;width:70%;height:auto;object-fit:contain;margin-bottom:6px;transition:opacity .8s ease, transform .2s ease;}
    #login-title.loaded{ opacity:1; transform:none; }

    #form-elements{display:flex;flex-direction:column;align-items:center;gap:14px;width:100%;}
    .input-group{display:flex;justify-content:center;align-items:center;width:100%;max-width:300px;margin:0 auto;gap:10px;}
    .input-group label{color:var(--text-color);font-weight:bold;width:70px;text-align:right;font-size:16px;font-family:var(--font-agency);flex-shrink:0;}
    .login-input{font-size:16px;padding:6px;border:1px solid var(--input-border-color);background:#fff;color:#000;width:160px;box-sizing:border-box;touch-action:manipulation;-webkit-user-select:none;-webkit-touch-callout:none;}
    #login-buttons{display:flex;justify-content:center;gap:10px;margin-top:12px;width:100%;max-width:300px;margin-left:auto;margin-right:auto;}
    .glassy-btn{font-family:var(--font-agency);padding:10px;border:1px solid rgba(255,255,255,.1);border-radius:8px;cursor:pointer;font-weight:bold;width:100%;max-width:140px;transition:background .2s ease,color .2s ease;}
    .glassy-btn.primary{ color:var(--text-color);background:var(--accent-color);border-color:var(--accent-color); }
    .glassy-btn.outline{ background:var(--glass-bg);color:rgba(255,255,255,.7); }
    .glassy-btn:disabled{ opacity:.5; cursor:default; }

    #sequence-panel{z-index:4;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-height:120px;padding:10px;text-align:center;}
    #sequence-text{font-family:var(--font-agency);font-size:1rem;color:#aadfff;min-height:1.2em;text-shadow:0 0 4px rgba(0,0,0,.35);}
    #sequence-bar-container{width:200px;height:6px;background:#fff;border-radius:3px;margin-top:4px;}
    #sequence-bar{width:0%;height:100%;background:linear-gradient(90deg,#1E90FF,#00ccff);border-radius:3px;transition:width 0.05s linear;}

    #login-footer{position:absolute;bottom:20px;font-size:.8rem;color:#ddd;text-align:center;z-index:3;line-height:1.4;}
  `;
  document.head.appendChild(style);
}

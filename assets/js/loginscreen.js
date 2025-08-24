// assets/js/loginscreen.js
import { loadHomeScreen } from './homescreen.js';
import { updateCheck, displayError } from './errors.js';

const BUILD_VERSION = "0.174";
let usernameTyped = false;
let passwordTyped = false;

// preload mouse click sound
const clickSound = new Audio("assets/sounds/mouseclicksingle.wav");
clickSound.preload = "auto";

export function loadLoginScreen(container) {
  return new Promise((resolve) => {
    try {
      updateCheck('loginscreen', 'ok');

      container.innerHTML = `
        <div id="login-background">
          <div id="hex-grid-overlay"></div>
          
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
      const loginBtn      = container.querySelector('#login-btn');
      const formPanel     = container.querySelector('#login-content');
      const seqPanel      = container.querySelector('#sequence-panel');
      const seqText       = container.querySelector('#sequence-text');
      const seqBar        = container.querySelector('#sequence-bar');
      const bg            = container.querySelector('#login-background');
      const loginTitle    = container.querySelector('#login-title');

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
        playClick();
        if (!usernameTyped) {
          usernameInput.value = '';
          await typeText(usernameInput, 'Agent 173');
          usernameTyped = true;
          passwordInput.removeAttribute('readonly');
        }
      });

      // Password typing
      passwordInput.addEventListener('click', async () => {
        playClick();
        if (usernameTyped && !passwordTyped) {
          passwordInput.value = '';
          await typeText(passwordInput, '••••••••');
          passwordTyped = true;
          loginBtn.removeAttribute('disabled');
        }
      });

      // LOGIN sequence
      loginBtn.addEventListener('click', async () => {
        playClick();
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

// --- Helpers ---

// play click sound safely
function playClick() {
  try {
    clickSound.currentTime = 0; // rewind for instant replay
    clickSound.play();
  } catch (err) {
    console.warn("Click sound error:", err);
  }
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
      --login-bg-color: #000;
    }

    html, body { touch-action: manipulation; -webkit-text-size-adjust: 100%; user-select: none; }

    .stage-panel[aria-hidden="true"]{ display:none; }
    .stage-panel[aria-hidden="false"]{ display:flex; }

    #login-background{
      height:100vh;width:100vw;
      display:flex;flex-direction:column;justify-content:center;align-items:center;
      color:var(--text-color);font-family:var(--font-ui);position:relative;overflow:hidden;
      transition:opacity .3s ease-in-out; background-color:var(--login-bg-color);
      z-index: 0;
      background-image:
        linear-gradient(to top, var(--login-bg-color) 0%, transparent 40%),
        linear-gradient(to bottom, var(--login-bg-color) 0%, transparent 40%);
    }

    /* Hex Grid Overlay (Bottom Layer) */
    #hex-grid-overlay {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle at 10% 10%, rgba(0,0,51,0.2), rgba(0,0,51,0) 50%),
        radial-gradient(circle at 90% 90%, rgba(0,0,51,0.2), rgba(0,0,51,0) 50%),
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpath d='M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z' fill='none' stroke='%23f2f2f7' opacity='0.1'/%3E%3C/svg%3E");
      background-size: 100% 100%, 100% 100%, 50px 86.6px;
      animation: hex-pan 45s linear infinite;
    }
    
    /* Animation for the hex grid */
    @keyframes hex-pan {
      0% {
        background-position: 0 0, 0 0, 0 0;
      }
      100% {
        background-position: 0 100px, 0 100px, 0 866px;
      }
    }

    #login-content{z-index:2;flex-direction:column;justify-content:center;align-items:center;gap:14px;padding:20px;width:90%;max-width:360px;opacity:0;animation:fadeInLogin .8s ease forwards;}
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
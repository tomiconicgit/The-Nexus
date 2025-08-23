// assets/js/loginscreen.js
import { loadHomeScreen } from './homescreen.js';
import { updateCheck, displayError } from './errors.js';

const BUILD_VERSION = "0.164";
let usernameTyped = false;
let passwordTyped = false;

export function loadLoginScreen(container) {
  return new Promise((resolve) => {
    try {
      updateCheck('loginscreen', 'ok');
      container.innerHTML = `
        <div id="login-background">
          <div id="grid-overlay"></div>
          <div id="fade-overlay"></div>

          <!-- FORM PANEL -->
          <div id="login-content" class="stage-panel" aria-hidden="false">
            <img id="login-title" src="assets/images/nexusseal.PNG" alt="Nexus Intelligence Agency Seal" loading="lazy">
            <div id="form-elements">
              <div class="input-group">
                <label for="username">ID</label>
                <input type="text" id="username" autocomplete="off" class="login-input" readonly onfocus="this.blur()">
              </div>
              <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" autocomplete="off" class="login-input" readonly onfocus="this.blur()">
              </div>
              <div id="login-buttons">
                <button class="glassy-btn primary" id="login-btn" disabled>Login</button>
                <button class="glassy-btn outline" disabled>Register</button>
              </div>
            </div>
          </div>

          <!-- A.N.N.A. PANEL (hidden until Login) -->
          <div id="anna-sequence" class="stage-panel" aria-hidden="true">
            <div id="anna-orb" aria-label="A.N.N.A. processing"></div>
            <div id="anna-text" role="status" aria-live="polite"></div>
          </div>

          <div id="login-footer">
            <div>Secure Software | All Rights Reserved</div>
            <div>&copy; 2025 | Iconic Developments OS</div>
          </div>
        </div>
      `;

      injectLoginCSS();

      // Ensure SEAL stays small & in place
      const logoImg = new Image();
      logoImg.src = 'assets/images/nexusseal.PNG';
      logoImg.onload = () => {
        const t = container.querySelector('#login-title');
        if (t) t.classList.add('loaded');
      };
      logoImg.onerror = () =>
        displayError('Failed to load Nexus seal logo', 'LoginScreen', 'ERR_SEAL_LOAD', true);

      const usernameInput = container.querySelector('#username');
      const passwordInput = container.querySelector('#password');
      const loginBtn      = container.querySelector('#login-btn');
      const formPanel     = container.querySelector('#login-content');
      const annaPanel     = container.querySelector('#anna-sequence');
      const annaText      = container.querySelector('#anna-text');
      const bg            = container.querySelector('#login-background');

      if (!usernameInput || !passwordInput || !loginBtn || !formPanel || !annaPanel || !annaText || !bg) {
        displayError('Login DOM not ready', 'LoginScreen', 'ERR_FORM_ELEMENTS');
        resolve();
        return;
      }

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
          annaPanel.setAttribute('aria-hidden', 'false');

          const agentID = (usernameInput.value && usernameInput.value.trim()) || 'Agent 173';

          // Phrase + KB count simulation
          const sequences = [
            "Decrypting Credentials",
            "Loading Security Keys",
            "Verifying Access",
            "Initializing NEXUS Software",
            "Establishing Secure Session"
          ];

          for (let seq of sequences) {
            await animateKBSequence(annaText, seq);
            await wait(500); // small pause between sequences
          }

          annaText.textContent = `Welcome, ${agentID}`;
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

// Simulated typing
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

// Soft haptic
function softHaptic() { if (navigator.vibrate) navigator.vibrate(10); }
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

// Animate KB counter for each sequence
function animateKBSequence(el, phrase) {
  return new Promise((res) => {
    const targetKB = Math.floor(100 + Math.random() * 900); // 100-1000 KB
    let kb = 0;
    const speed = 10 + Math.random() * 20;

    const interval = setInterval(() => {
      kb += Math.floor(Math.random() * speed);
      if (kb >= targetKB) kb = targetKB;
      el.textContent = `${phrase} ... ${kb}KB`;
      if (kb >= targetKB) {
        clearInterval(interval);
        setTimeout(res, 250); // small pause at the end
      }
    }, 35);
  });
}

// Inject CSS
function injectLoginCSS() {
  const id = 'loginscreen-styles';
  if (document.getElementById(id)) return;
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

    .stage-panel[aria-hidden="true"]{ display:none; }
    .stage-panel[aria-hidden="false"]{ display:flex; }

    #login-background{
      height:100vh;width:100vw;
      background:url('assets/images/world-map.jpg') no-repeat center center/cover;
      display:flex;flex-direction:column;justify-content:center;align-items:center;
      color:var(--text-color);font-family:var(--font-ui);position:relative;overflow:hidden;
      transition:opacity .3s ease-in-out;touch-action:manipulation;-webkit-user-select:none;
    }

    #fade-overlay{
      position:absolute;bottom:0;left:0;width:100%;height:50%;
      background:linear-gradient(to top, black, transparent);
      z-index:1;pointer-events:none;
    }
    #grid-overlay{
      position:absolute;inset:0;
      background:
        repeating-linear-gradient(to right,transparent,transparent 99px,rgba(255,255,255,.05) 100px),
        repeating-linear-gradient(to bottom,transparent,transparent 99px,rgba(255,255,255,.05) 100px);
      z-index:0;pointer-events:none;
    }

    #login-content{z-index:2;flex-direction:column;justify-content:center;align-items:center;gap:14px;padding:20px;width:90%;max-width:360px;}
    #login-title{max-width:170px;width:70%;height:auto;object-fit:contain;margin-bottom:6px;transition:transform .2s ease,opacity .2s ease;}
    #login-title.loaded{ opacity:1; transform:none; }

    #form-elements{display:flex;flex-direction:column;align-items:center;gap:14px;width:100%;}
    .input-group{display:flex;justify-content:center;align-items:center;width:100%;max-width:300px;margin:0 auto;gap:10px;}
    .input-group label{color:var(--text-color);font-weight:bold;width:70px;text-align:right;font-size:.9rem;font-family:var(--font-agency);flex-shrink:0;}
    .login-input{padding:6px;border:1px solid var(--input-border-color);background:#fff;color:#000;font-size:.9rem;width:160px;box-sizing:border-box;}
    #login-buttons{display:flex;justify-content:center;gap:10px;margin-top:12px;width:100%;max-width:300px;margin-left:auto;margin-right:auto;}
    .glassy-btn{font-family:var(--font-agency);padding:10px;border:1px solid rgba(255,255,255,.1);border-radius:8px;cursor:pointer;font-weight:bold;width:100%;max-width:140px;transition:background .2s ease,color .2s ease;}
    .glassy-btn.primary{ color:var(--text-color);background:var(--accent-color);border-color:var(--accent-color); }
    .glassy-btn.outline{ background:var(--glass-bg);color:rgba(255,255,255,.7); }
    .glassy-btn:disabled{ opacity:.5; cursor:default; }

    /* --- A.N.N.A. PANEL --- */
    #anna-sequence{z-index:3;flex-direction:column;align-items:center;justify-content:center;gap:14px;min-height:180px;padding:10px;text-align:center;}
    #anna-orb{
      position:relative;width:90px;height:90px;border-radius:50%;
      background:conic-gradient(from 0deg,#0099ff,#00ccff,#0066ff,#0099ff);
      animation: anna-rotate 3.6s linear infinite, anna-breathe 2s ease-in-out infinite;
      box-shadow:0 0 20px rgba(0,180,255,.5), inset 0 0 12px rgba(255,255,255,.06);
      -webkit-mask: radial-gradient(circle at 50% 50%, transparent 55%, black 56%);
              mask: radial-gradient(circle at 50% 50%, transparent 55%, black 56%);
    }
    #anna-orb::before{
      content:"";position:absolute;inset:12%;border-radius:50%;
      background:conic-gradient(from 90deg,#00cfff,#0066ff,#0099ff,#00ccff);
      filter:blur(6px);opacity:.9;
      animation: anna-swirl 2.8s linear infinite reverse;
      -webkit-mask: radial-gradient(circle at 50% 50%, black 60%, transparent 62%);
              mask: radial-gradient(circle at 50% 50%, black 60%, transparent 62%);
    }
    #anna-orb::after{
      content:"";position:absolute;inset:-5%;border-radius:50%;
      background:radial-gradient(closest-side, rgba(0,200,255,.2), rgba(0,200,255,0) 70%);
      filter:blur(4px);opacity:.6;
      animation: anna-ripple 2.4s ease-in-out infinite;
    }
    #anna-text{font-family:var(--font-agency);font-size:.95rem;color:#aadfff;min-height:1.2em;text-shadow:0 0 4px rgba(0,0,0,.35);}

    @keyframes anna-rotate{ to{ transform: rotate(360deg);} }
    @keyframes anna-breathe{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}
    @keyframes anna-swirl{0%{transform:rotate(0deg) scale(1);}50%{transform:rotate(180deg) scale(1.02);}100%{transform:rotate(360deg) scale(1);}}
    @keyframes anna-ripple{0%,100%{transform:scale(1);opacity:.55;}50%{transform:scale(1.05);opacity:.75;}}

    #login-footer{position:absolute;bottom:20px;font-size:.8rem;color:#ddd;text-align:center;z-index:2;line-height:1.4;}
  `;
  document.head.appendChild(style);
}
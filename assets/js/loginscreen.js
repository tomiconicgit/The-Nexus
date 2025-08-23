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
          <div id="grid-overlay"></div>
          <div id="fade-overlay"></div>

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
      transition:opacity .3s ease-in-out; background-color:#000;
    }

    /* Corrected continents CSS */
    #login-background::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      /* The fix: changed to a semi-transparent white */
      background-color: rgba(255, 255, 255, 0.05); 
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 500'%3E%3Cpath fill='%23fff' d='M835 150Q850 170 820 190T770 190T750 200T720 230T690 260T660 290T630 310T610 320T580 330T540 330T510 320T480 300T450 280T420 260T390 250T360 250T330 260T300 280T270 300T240 310T210 310T180 300T150 280T120 250T90 220T60 190T40 170T30 150Q20 130 50 120T100 110T150 120T200 140T250 160T300 170T350 170T400 160T450 140T500 120T550 110T600 110T650 120T700 140T750 160T800 170T835 150Z'/%3E%3Cpath fill='%23fff' d='M250 150Q270 160 280 170T290 180T290 190T280 200T260 210T240 220T220 230T200 240T180 240T160 230T140 220T120 210T100 200T80 190T60 180T40 170T20 160T10 150Q0 140 20 130T60 120T100 110T140 100T180 100T220 110T250 120T270 130T280 140T280 150Q280 160 260 160T250 150Z'/%3E%3Cpath fill='%23fff' d='M400 300Q420 310 430 320T440 330T440 340T430 350T410 360T390 370T370 380T350 390T330 390T310 380T290 370T270 360T250 350T230 340T210 330T190 320T170 310T150 300T130 290T110 280T90 270T70 260T50 250T30 240T10 230Q0 220 20 210T60 200T100 190T140 180T180 170T220 160T260 150T300 140T340 130T380 120T420 110T460 100T500 90T540 80T580 70T620 60T660 50T700 40T740 30T780 20T820 10T860 0T900 0T940 10T980 20T1000 30Q1000 40 980 50T940 60T900 70T860 80T820 90T780 100T740 110T700 120T660 130T620 140T580 150T540 160T500 170T460 180T420 190T400 200Q400 210 420 220T460 230T500 240T540 250T580 260T620 270T660 280T700 290T740 300T780 310T820 320T860 330T900 340T940 350T980 360T1000 370Q1000 380 980 390T940 400T900 410T860 420T820 430T780 440T740 450T700 460T660 470T620 480T580 490T540 500T500 500T460 490T420 480T380 470T340 460T300 450T260 440T220 430T180 420T140 410T100 400T60 390T20 380T0 370Q0 360 20 350T60 340T100 330T140 320T180 310T220 300T250 290Q250 280 230 270T190 260T150 250T110 240T70 230T30 220T0 210Q0 200 20 190T60 180T100 170T140 160T180 150T220 140T250 130T270 120T280 110T280 100T270 90T260 80T250 70T240 60T230 50T220 40T210 30T200 20T190 10T180 0T170 0T160 10T150 20T140 30T130 40T120 50T110 60T100 70T90 80T80 90T70 100T60 110T50 120T40 130T30 140T20 150T10 160T0 170T0 180Q0 190 20 200T60 210T100 220T140 230T180 240T220 250T260 260T300 270T340 280T380 290T400 300Z'/%3E%3C/svg%3E");
      -webkit-mask-size: cover;
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-position: center;
    }

    #fade-overlay{position:absolute;bottom:0;left:0;width:100%;height:50%;background:linear-gradient(to top, black, transparent);z-index:2;pointer-events:none;}
    #grid-overlay{position:absolute;inset:0;background:
        repeating-linear-gradient(to right,transparent,transparent 99px,rgba(255,255,255,.05) 100px),
        repeating-linear-gradient(to bottom,transparent,transparent 99px,rgba(255,255,255,.05) 100px);
      z-index:1;pointer-events:none;
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

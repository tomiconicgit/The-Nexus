// Inject CSS
function injectLoginCSS() {
  const styleId = 'loginscreen-styles';
  if (document.getElementById(styleId)) return;

  const styleTag = document.createElement('style');
  styleTag.id = styleId;
  styleTag.innerHTML = `
    :root {
      --dark-theme-bg: #000;
      --glass-bg: rgba(255, 255, 255, 0.1);
      --input-border-color: #555;
      --text-color: #f2f2f7;
      --secondary-text-color: #8e8e93;
      --accent-color: #1E90FF;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #login-background {
      height: 100vh;
      width: 100vw;
      background: url('assets/images/world-map.jpg') no-repeat center center/cover;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: var(--text-color);
      font-family: var(--font-family);
      position: relative;
      overflow: hidden;
      transition: opacity 0.3s ease-in-out;
      touch-action: manipulation;
      -webkit-user-select: none;
    }
    #fade-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50%;
      background: linear-gradient(to top, black, transparent);
      z-index: 1;
      pointer-events: none;
    }
    #grid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(to right, transparent, transparent 99px, rgba(255, 255, 255, 0.05) 100px),
                  repeating-linear-gradient(to bottom, transparent, transparent 99px, rgba(255, 255, 255, 0.05) 100px);
      z-index: 0;
      pointer-events: none;
    }
    #login-content {
      z-index: 2;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
      padding: 20px;
      width: 90%;
      max-width: 320px;
    }
    #form-elements {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      width: 100%;
    }
    .input-group {
      display: flex;
      align-items: center;
      width: 220px;
      gap: 10px;
    }
    .input-group label {
      color: var(--text-color);
      font-weight: bold;
      width: 80px;
      text-align: right;
      flex-shrink: 0;
      font-size: 0.9rem;
      font-family: 'Courier New', Courier, monospace;
    }
    .login-input {
      padding: 6px;
      border: 1px solid var(--input-border-color);
      background: #fff;
      color: #000;
      font-size: 0.9rem;
      flex-grow: 1;
      box-sizing: border-box;
    }
    #login-buttons {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 15px;
      width: 220px;
    }
    .glassy-btn {
      padding: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      letter-spacing: 0.2px;
      width: 110px;
      transition: background 0.2s ease, color 0.2s ease;
      will-change: background, color;
    }
    .glassy-btn.primary {
      color: var(--text-color);
      background: var(--accent-color);
      border-color: var(--accent-color);
    }
    .glassy-btn.primary:hover {
      background: #36a4ff;
    }
    .glassy-btn.outline {
      background: var(--glass-bg);
      color: rgba(255, 255, 255, 0.5);
    }
    .glassy-btn.outline:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-color);
    }
    .glassy-btn:disabled {
      opacity: 0.5;
      cursor: default;
    }
    #login-title {
      max-width: 200px;
      height: auto;
      margin-bottom: 2px;
      object-fit: contain;
    }
    #login-subtitle {
      display: none;
    }
    #login-monitoring {
      display: none;
    }
    #login-footer {
      position: absolute;
      bottom: 20px;
      font-size: 0.8rem;
      color: #ddd;
      text-align: center;
      z-index: 2;
      line-height: 1.4;
    }
  `;
  document.head.appendChild(styleTag);
}

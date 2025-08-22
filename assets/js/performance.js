// assets/js/performance.js

import { displayError } from './errors.js';

export function initPerformanceMonitor() {
  // Create performance button
  const btn = document.createElement('button');
  btn.id = 'performance-btn';
  btn.innerText = 'Perf';
  btn.style.position = 'fixed';
  btn.style.top = '10px';
  btn.style.right = '10px';
  btn.style.zIndex = '5000';
  btn.style.padding = '5px 10px';
  btn.style.background = '#007bff';
  btn.style.border = 'none';
  btn.style.borderRadius = '5px';
  btn.style.color = '#fff';
  btn.style.cursor = 'pointer';
  document.body.appendChild(btn);

  // Create floating performance container
  const perfContainer = document.createElement('div');
  perfContainer.id = 'performance-container';
  perfContainer.style.display = 'none';
  perfContainer.style.position = 'fixed';
  perfContainer.style.top = '50px';
  perfContainer.style.right = '10px';
  perfContainer.style.zIndex = '5000';
  perfContainer.style.background = 'linear-gradient(135deg, #1a1a1a, #2a2a2a)';
  perfContainer.style.border = '1px solid #444';
  perfContainer.style.borderRadius = '10px';
  perfContainer.style.padding = '15px';
  perfContainer.style.color = '#fff';
  perfContainer.style.fontFamily = 'Inter, sans-serif';
  perfContainer.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.5)';
  perfContainer.style.maxWidth = '300px';
  perfContainer.innerHTML = `
    <h3 style="margin: 0 0 10px; font-size: 1.2rem;">Performance</h3>
    <div id="perf-data">
      <p><strong>FPS:</strong> <span id="perf-fps">0</span></p>
      <p><strong>Memory:</strong> <span id="perf-memory">N/A</span></p>
      <p><strong>Data Usage:</strong> <span id="perf-data">N/A</span></p>
      <p><strong>CPU Est.:</strong> <span id="perf-cpu">N/A</span></p>
      <p><strong>Time:</strong> <span id="perf-time"></span></p>
    </div>
    <button id="perf-close" style="padding: 5px 10px; background: #dc3545; border: none; border-radius: 5px; color: #fff; cursor: pointer; margin-top: 10px;">Close</button>
  `;
  document.body.appendChild(perfContainer);

  // Toggle container visibility and initialize update
  btn.addEventListener('click', () => {
    const isVisible = perfContainer.style.display === 'block';
    perfContainer.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
      setTimeout(updatePerformance, 100); // Delay to ensure DOM is ready
    }
  });

  // Close button
  const closeBtn = perfContainer.querySelector('#perf-close');
  closeBtn.addEventListener('click', () => {
    perfContainer.style.display = 'none';
  });

  // Update performance data
  function updatePerformance() {
    if (perfContainer.style.display !== 'block') return; // Only update when visible
    try {
      const now = performance.now();
      const fps = window.lastTime ? Math.round(1000 / (now - window.lastTime)) : 0;
      window.lastTime = now;

      // Memory (N/A on iOS Safari)
      const memory = performance.memory ? (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB' : 'N/A';

      // Data Usage (Network Information API, limited support)
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const dataUsage = connection ? `${connection.downlink} Mb/s` : 'N/A';

      // CPU Estimate (approximate via frame time deltas)
      const cpuEst = window.lastCpuTime ? ((now - window.lastCpuTime) / 16.67 * 100).toFixed(1) + '%' : 'N/A';
      window.lastCpuTime = now;

      // Update DOM elements if they exist
      const fpsEl = document.getElementById('perf-fps');
      const memoryEl = document.getElementById('perf-memory');
      const dataEl = document.getElementById('perf-data');
      const cpuEl = document.getElementById('perf-cpu');
      const timeEl = document.getElementById('perf-time');
      if (fpsEl) fpsEl.textContent = fps;
      if (memoryEl) memoryEl.textContent = memory;
      if (dataEl) dataEl.textContent = dataUsage;
      if (cpuEl) cpuEl.textContent = cpuEst;
      if (timeEl) timeEl.textContent = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });

      requestAnimationFrame(updatePerformance);
    } catch (err) {
      displayError(`Performance update failed: ${err.message}`, 'Performance', 'ERR_PERF');
    }
  }
}
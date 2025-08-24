/**
 * Creates and manages a dynamic, animated desktop background for the NEXUS game.
 * @param {HTMLElement} container The DOM element to render the canvas into.
 */
function createNexusBackground(container) {
  // Ensure the container element is valid before proceeding
  if (!container) {
    console.error('Failed to initialize background: container element is null.');
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);

  let width;
  let height;
  let particles = [];
  const particleCount = 75;
  const nexusLogo = 'NEXUS'; // Correctly initialized
  const logoFontSize = 30; // Correctly initialized

  function setSize() {
    width = container.clientWidth;
    height = container.clientHeight;
    
    // Ensure width and height have valid values before proceeding
    if (width <= 0 || height <= 0) {
      console.warn('Container dimensions are zero or invalid. Skipping resize.');
      return;
    }

    canvas.width = width;
    canvas.height = height;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  
  // Call setSize to initialize width, height, and particles
  setSize(); 
  window.addEventListener('resize', setSize);

  class Particle {
    constructor() {
      // Ensure particles are created with valid coordinates
      this.x = Math.random() * (width || 1); // Use fallback in case width is not set
      this.y = Math.random() * (height || 1); // Use fallback in case height is not set
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  function drawLines() {
    ctx.beginPath();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          const opacity = 1 - (distance / 100);
          ctx.strokeStyle = `rgba(52, 199, 89, ${opacity * 0.7})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
        }
      }
    }
    ctx.stroke();
  }

  function drawLogo() {
    const time = Date.now() * 0.001;
    const pulseAlpha = Math.sin(time * 2) * 0.2 + 0.5;
    ctx.textAlign = 'center';
    ctx.font = `bold ${logoFontSize}px 'Courier New', Courier, monospace`;
    ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
    ctx.fillText(nexusLogo, width / 2, height / 2 - logoFontSize);
  }

  function animate() {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0b0c10');
    gradient.addColorStop(1, '#141a2a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawLines();
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLogo();

    requestAnimationFrame(animate);
  }

  animate();
}

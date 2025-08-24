// assets/js/webgl-utils.js

import * as THREE from 'https://unpkg.com/three@0.138.0/build/three.module.js';
import { displayError } from './errors.js';

export function initWebGLScene(container) {
  try {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    if (!renderer) throw new Error('WebGL not supported');
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 500;

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene, camera, renderer };
  } catch (err) {
    displayError(`WebGL initialization error: ${err.message}`, 'WebGLUtils', 'ERR_WEBGL_INIT');
    return {};
  }
}
import * as THREE from 'three';
import { OrbitControls } from './orbit-controls';

export const init = (canvas: HTMLCanvasElement) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.width / canvas.height,
    0.1,
    1000
  );
  const controls = new OrbitControls(camera, canvas);
  const renderer = new THREE.WebGLRenderer({ canvas });
  // renderer.setSize(canvas.width, canvas.height);
  const geometry = new THREE.BoxGeometry(1000, 10, 1000);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    // wireframe: true,
    transparent: true,
    opacity: 0.2,
  });
  const cube = new THREE.Mesh(geometry, material);

  const geometry2 = new THREE.BoxGeometry(10, 10, 10);
  const material2 = new THREE.MeshBasicMaterial({
    color: 0xffff00,
  });
  const cube2 = new THREE.Mesh(geometry2, material2);

  camera.position.z = 100;
  camera.position.y = 50;

  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  const sceneGrid = new THREE.GridHelper(150, 5);
  const grid = new THREE.GridHelper(100, 10, 0xff0000, 0xff0000);
  scene.add(sceneGrid);
  cube.add(grid);
  // cube.add(cube2);

  scene.add(cube);

  const clones = [];

  for (let i = 0; i < 100; i++) {
    const cubeClone = cube2.clone();
    clones.push(cubeClone);
    cubeClone.position.x = i * 10 - 500;
    cubeClone.position.z = i * 10 - 500;
    cubeClone.position.y = 10 * Math.cos(((i * 50) / 180) * Math.PI);
    cube.add(cubeClone);
  }
  // const l2 = cube.clone();
  // scene.add(l2);

  // const l3 = cube.clone();
  // scene.add(l3);

  // l2.position.y = 25;
  // l3.position.y = -25;

  grid.position.set(0, -5, 0);

  cube.position.set(0, 5, 0);
  cube2.position.set(0, 1, 0);
  camera.position.x = 25;
  camera.rotation.x = (-20 * Math.PI) / 180;
  camera.rotation.y = (15 * Math.PI) / 180;

  // scene.rotation.x = (25 * Math.PI) / 180;
  controls.update();
  const animate = function(passed) {
    requestAnimationFrame(animate);
    for (let i = 0; i < 100; i++) {
      clones[i].position.y =
        10 * Math.cos(((i * 50 + passed / 4) / 180) * Math.PI);
    }

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    // camera.position.z -= 0.1;
    // camera.position.y -= 0.1;
    controls.update();
    renderer.render(scene, camera);
  };

  animate(0);
};

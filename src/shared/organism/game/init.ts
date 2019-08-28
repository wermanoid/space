import * as THREE from 'three';
import { OrbitControls } from './orbit-controls';

import { loadGraphics } from './systems/graphics';

export const init = (canvas: HTMLCanvasElement) => {
  const graphics = loadGraphics();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#777');
  const camera = new THREE.PerspectiveCamera(
    35,
    canvas.width / canvas.height,
    0.1,
    500
  );

  const controls = new OrbitControls(camera, canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  renderer.physicallyCorrectLights = true;

  // renderer.setSize(canvas.width, canvas.height);
  const geometry = new THREE.PlaneGeometry(100, 100);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    // wireframe: true,
    transparent: true,
    opacity: 0.2,
  });
  const layer = new THREE.Mesh(geometry, material);
  layer.matrixAutoUpdate = false;

  // layer.rotation.x = -Math.PI / 2;

  // some stuff...

  const edges = new THREE.EdgesGeometry(graphics.geometries['block']);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );

  const items: THREE.Mesh[] = [];
  for (let i = 0; i < 100; i++) {
    const item = new THREE.Mesh(
      graphics.geometries[i % 2 === 0 ? 'block' : 'plate'],
      graphics.materials[i % 2 === 0 ? 'stone' : 'quartz']
    );
    item.position.set(
      10 * (Math.floor(10 * Math.random()) - 5) + 5,
      10 * (Math.floor(10 * Math.random()) - 5) + 5,
      0
    );
    items[i] = item;
    setTimeout(
      xx => {
        layer.add(xx);
      },
      i * 100,
      item
    );
  }

  // lights
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);

  const sceneGrid = new THREE.GridHelper(140, 14);
  const grid = new THREE.GridHelper(100, 10, 0xff0000, 0xff0000);
  scene.add(sceneGrid);
  sceneGrid.rotation.x = Math.PI / 2;
  grid.rotation.x = Math.PI / 2;

  layer.add(grid);
  // layer.add(...items);

  scene.add(layer);

  const axes = new THREE.AxesHelper(10);
  scene.add(axes);

  // const l2 = cube.clone();
  // scene.add(l2);

  // const l3 = cube.clone();
  // scene.add(l3);

  // l2.position.y = 25;
  // l3.position.y = -25;

  // grid.position.set(0, 0, 0);

  // grid.rotation.x = Math.PI / 2;

  // camera.position.x = 5;
  // camera.rotation.x = (-50 * Math.PI) / 180;
  // camera.rotation.y = (25 * Math.PI) / 180;
  // camera.position.z = 50;
  // camera.position.y = 100;

  camera.position.set(0, -50, 150);
  camera.lookAt(0, 0, 0);
  camera.rotation.z = (15 * Math.PI) / 180;

  // camera.rotation.x = (-90 * Math.PI) / 180;

  // scene.rotation.x = (25 * Math.PI) / 180;
  controls.update();

  const animate = function(passed) {
    requestAnimationFrame(animate);

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    // camera.position.z -= 0.1;
    // camera.position.y -= 0.1;
    controls.update();
    renderer.render(scene, camera);
  };

  window.stats = () => {
    console.log('renderer.info.render.frame', renderer.info.render.frame);
    console.log('renderer.info.programs', renderer.info.programs);
    console.log('renderer.info.memory.textures', renderer.info.memory.textures);
    console.log(
      'renderer.info.memory.geometries',
      renderer.info.memory.geometries
    );
    console.log('renderer.info.render.calls', renderer.info.render.calls);
  };

  animate(0);
};

import * as THREE from 'three';
import { OrbitControls } from './orbit-controls';

import { loadGraphics } from './systems/graphics';
import { LayerSystem } from './models/layer';

export const init = (container: HTMLDivElement) => {
  const graphics = loadGraphics();
  const layers = new LayerSystem(graphics);
  const aspect = container.clientWidth / container.clientHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#777');
  const camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 500);

  const controls = new OrbitControls(camera, container);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  renderer.physicallyCorrectLights = true;
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneGeometry(10, 10);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.2,
  });
  const ground = new THREE.Mesh(geometry, material);
  // const layer = new THREE.Group();
  // layer.matrixAutoUpdate = false;

  // some stuff...

  // const edges = new THREE.EdgesGeometry(graphics.geometries['block']);
  // const line = new THREE.LineSegments(
  //   edges,
  //   new THREE.LineBasicMaterial({ color: 0xffffff })
  // );

  const vals = rnd => (rnd < 0.33 ? 0 : rnd < 0.66 ? 1 : 2);
  const layer = layers.add(
    new Uint32Array(100).map(() => vals(Math.random())),
    new Uint32Array(100).map(() => vals(Math.random()))
  );
  layer.position.set(5, 5, 0);
  layer.updateMatrix();
  const layerBottom = layers.add(
    new Uint32Array(100).map(() => vals(Math.random())),
    new Uint32Array(100).map(() => vals(Math.random()))
  );
  layerBottom.position.set(5, 5, -10);
  layerBottom.updateMatrix();
  const layerUp = layers.add(
    new Uint32Array(100).map(() => vals(Math.random())),
    new Uint32Array(100).map(() => vals(Math.random()))
  );
  layerUp.position.set(5, 5, 13);
  layerUp.updateMatrix();

  // const items: THREE.Mesh[] = [];
  // for (let i = 0; i < 10; i++) {
  //   const item = new THREE.Mesh(
  //     graphics.geometries[i % 2],
  //     graphics.materials[i % 2]
  //   );
  //   item.position.set(
  //     10 * (Math.floor(10 * Math.random()) - 5) + 5,
  //     10 * (Math.floor(10 * Math.random()) - 5) + 5,
  //     0
  //   );
  //   items[i] = item;
  //   for (let j = 0; j < 10; j++) {
  //     const it = ground.clone();
  //     it.position.set((i - 5) * 10 + 5, (j - 5) * 10 + 5, 0);
  //     layer.add(it);
  //   }
  // }

  // lights
  // const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.DirectionalLight(0xffffff, 0);
  const pointLight2 = new THREE.PointLight(0xff0000, 5);
  pointLight2.position.set(10, 10, 5);
  camera.add(pointLight);
  scene.add(camera, pointLight2);

  const sceneGrid = new THREE.GridHelper(140, 14);
  const grid = new THREE.GridHelper(100, 10, 0xff0000, 0xff0000);
  scene.add(sceneGrid);
  sceneGrid.rotation.x = Math.PI / 2;
  grid.rotation.x = Math.PI / 2;

  layer.add(grid);
  // layer.add(...items);

  scene.add(layer);
  scene.add(layerBottom);
  scene.add(layerUp);

  const axes = new THREE.AxesHelper(10);
  scene.add(axes);

  camera.position.set(0, -50, 200);
  camera.lookAt(0, 0, 0);
  camera.rotation.z = (15 * Math.PI) / 180;

  // camera.rotation.x = (-90 * Math.PI) / 180;

  // scene.rotation.x = (25 * Math.PI) / 180;
  controls.update();

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });

  // const animate = function(passed) {
  //   requestAnimationFrame(animate);

  //   // cube.rotation.x += 0.01;
  //   // cube.rotation.y += 0.01;

  //   // camera.position.z -= 0.1;
  //   // camera.position.y -= 0.1;
  //   controls.update();
  //   renderer.render(scene, camera);
  // };

  window.stats = () => {
    console.log('renderer.info.render.frame', renderer.info.render.frame);
    console.log('renderer.info.programs', renderer.info.programs);
    console.log('renderer.info.memory.textures', renderer.info.memory.textures);
    console.log(
      'renderer.info.memory.geometries',
      renderer.info.memory.geometries
    );
    console.log('renderer.info.render.calls', renderer.info.render.calls);
    console.log(camera.position);
  };

  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  window.addEventListener('resize', onWindowResize);
};

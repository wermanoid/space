import * as THREE from 'three';
import { OrbitControls } from './orbit-controls';

import { GraphicsSystem } from './systems/graphics';
import { Mesh } from 'three';

const loadGraphics = (graphics: GraphicsSystem) => {
  graphics.addGeomerty(
    'block',
    new THREE.BoxGeometry(10, 10, 10).translate(0, 0, 5)
  );
  graphics.addGeomerty(
    'plate',
    new THREE.BoxGeometry(10, 10, 1).translate(0, 0, 0.5)
  );

  graphics.addMaterial(
    'stone',
    new THREE.MeshLambertMaterial({
      color: 0x333333,
    })
  );
  graphics.addMaterial(
    'quartz',
    new THREE.MeshLambertMaterial({
      color: 0x999999,
    })
  );

  return graphics;
};

export const init = (canvas: HTMLCanvasElement) => {
  const graphics = loadGraphics(new GraphicsSystem());

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
  const geometry = new THREE.PlaneGeometry(100, 100);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    // wireframe: true,
    transparent: true,
    opacity: 0.2,
  });
  const layer = new THREE.Mesh(geometry, material);
  layer.rotation.x = -Math.PI / 2;

  // some stuff...

  const items: THREE.Mesh[] = [];
  for (let i = 0; i < 20; i++) {
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
  }

  // const edges = new THREE.EdgesGeometry(graphics.geometries['block']);
  // const line = new THREE.LineSegments(
  //   edges,
  //   new THREE.LineBasicMaterial({ color: 0xffffff })
  // );
  // lights
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);

  const sceneGrid = new THREE.GridHelper(140, 14);
  const grid = new THREE.GridHelper(100, 10, 0xff0000, 0xff0000);
  scene.add(sceneGrid);

  layer.add(grid);
  // cube.add(cube2);
  // cube2.add(line);
  layer.add(...items);

  setTimeout(() => {
    items[4].material = graphics.materials.quartz;
  }, 4000);

  setTimeout(() => {
    items[4].material.dispose();
    items[4].geometry.dispose();
    layer.remove(items[4]);
    items[4] = new Mesh(graphics.geometries.block, graphics.materials.stone);
    layer.add(items[4]);
  }, 5000);

  scene.add(layer);
  scene.add(new THREE.AxesHelper(20));

  // const l2 = cube.clone();
  // scene.add(l2);

  // const l3 = cube.clone();
  // scene.add(l3);

  // l2.position.y = 25;
  // l3.position.y = -25;

  // grid.position.set(0, 0, 0);
  grid.rotation.x = Math.PI / 2;

  // cube.position.set(0, 0, 0);
  // cube2.position.set(0, 0, 0);

  camera.position.x = 5;
  camera.rotation.x = (-50 * Math.PI) / 180;
  camera.rotation.y = (25 * Math.PI) / 180;
  camera.position.z = 50;
  camera.position.y = 100;

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

  animate(0);
};

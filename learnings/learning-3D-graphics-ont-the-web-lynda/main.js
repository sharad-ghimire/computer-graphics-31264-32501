const init = () => {
  const scene = new THREE.Scene();
  const gui = new dat.GUI();

  let enableFog = false;
  if (enableFog) scene.fog = new THREE.FogExp2(0xffffff, 0.2);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const box = getBox(1, 1, 1, 'rgb(120, 120, 120)');
  const plane = getPlane(20, 'rgb(120, 120, 120)');
  const sphere = getSphere(0.05, 'rgb(255, 255, 255)');
  const pointLight = getPointLight(1);

  box.position.y = box.geometry.parameters.height / 2;
  plane.rotation.x = Math.PI / 2;
  pointLight.position.y = 1.25;
  pointLight.intensity = 2;

  // dat.GUI() controllers
  gui.add(pointLight, 'intensity', 0, 10);
  gui.add(pointLight.position, 'y', 0, 5);

  pointLight.add(sphere);
  scene.add(pointLight);
  scene.add(box);

  scene.add(plane);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor('rgb(120, 120, 120)');
  document.getElementById('webgl').append(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  update(renderer, scene, camera, controls);
  return scene;
};

const getBox = (width, height, depth, color) =>
  new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshPhongMaterial({ color })
  );

const getPlane = (size, color) =>
  new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide })
  );
const getSphere = (radius, color) =>
  new THREE.Mesh(
    new THREE.SphereGeometry(radius, 24, 24),
    new THREE.MeshBasicMaterial({ color })
  );

const getPointLight = (intensity) => new THREE.PointLight(0xffffff, intensity);

const update = (renderer, scene, camera, controls) => {
  renderer.render(scene, camera);

  controls.update();

  requestAnimationFrame(() => {
    update(renderer, scene, camera, controls);
  });
};
const scene = init();

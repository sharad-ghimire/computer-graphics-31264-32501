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

  // const box = getBox(1, 1, 1, 'rgb(120, 120, 120)');
  const plane = getPlane(30, 'rgb(120, 120, 120)');
  const sphere = getSphere(0.05, 'rgb(255, 255, 255)');
  const spotLight = getSpotLight(1);
  const boxGrid = getBoxGrid(10, 1.5);

  // box.position.y = box.geometry.parameters.height / 2;
  plane.rotation.x = Math.PI / 2;
  spotLight.position.y = 1.25;
  spotLight.intensity = 2;

  // dat.GUI() controllers
  gui.add(spotLight, 'intensity', 0, 10);
  gui.add(spotLight.position, 'y', 0, 20);
  gui.add(spotLight.position, 'x', 0, 20);
  gui.add(spotLight.position, 'z', 0, 20);
  gui.add(spotLight, 'penumbra', 0, 1);

  spotLight.add(sphere);
  scene.add(spotLight);
  scene.add(boxGrid);

  // scene.add(box);

  scene.add(plane);

  const renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor('rgb(120, 120, 120)');
  document.getElementById('webgl').append(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  update(renderer, scene, camera, controls);
  return scene;
};

const getBox = (width, height, depth, color) => {
  let mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshPhongMaterial({ color })
  );
  mesh.castShadow = true;
  return mesh;
};

const getPlane = (size, color) => {
  let mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide })
  );
  mesh.receiveShadow = true;
  return mesh;
};

const getSphere = (radius, color) =>
  new THREE.Mesh(
    new THREE.SphereGeometry(radius, 24, 24),
    new THREE.MeshBasicMaterial({ color })
  );

const getPointLight = (intensity) => {
  let light = new THREE.PointLight(0xffffff, intensity);
  light.castShadow = true;
  return light;
};

const getSpotLight = (intensity) => {
  let light = new THREE.SpotLight(0xffffff, intensity);
  light.castShadow = true;
  light.shadow.bias = 0.001;
  return light;
};

const getBoxGrid = (amount, separationMultiplier) => {
  let group = new THREE.Group();

  for (let i = 0; i < amount; i++) {
    let object = getBox(1, 1, 1, 'rgb(120, 120, 120)');
    object.position.x = i * separationMultiplier;
    object.position.y = object.geometry.parameters.height / 2;
    group.add(object);
    for (let j = 1; j < amount; j++) {
      let object = getBox(1, 1, 1, 'rgb(120, 120, 120)');
      object.position.x = i * separationMultiplier;
      object.position.y = object.geometry.parameters.height / 2;
      object.position.z = j * separationMultiplier;

      group.add(object);
    }
  }

  group.position.x = -(separationMultiplier * (amount - 1)) / 2;
  group.position.z = -(separationMultiplier * (amount - 1)) / 2;
  return group;
};

const update = (renderer, scene, camera, controls) => {
  renderer.render(scene, camera);

  controls.update();

  requestAnimationFrame(() => {
    update(renderer, scene, camera, controls);
  });
};
const scene = init();

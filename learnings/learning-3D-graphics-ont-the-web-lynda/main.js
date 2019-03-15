const init = () => {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xffffff, 0.2);
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

  const box = getBox(1, 1, 1, 0x00ff00);
  const plane = getPlane(20, 0xff0000);
  plane.name = 'Plane-1';

  box.position.y = box.geometry.parameters.height / 2;
  plane.rotation.x = Math.PI / 2;
  scene.add(box);
  scene.add(plane);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor('rgb(255, 255, 255)');
  document.getElementById('webgl').append(renderer.domElement);

  update(renderer, scene, camera);
  return scene;
};

const getBox = (width, height, depth, color) =>
  new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshBasicMaterial({ color })
  );

const getPlane = (size, color) =>
  new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
  );

const update = (renderer, scene, camera) => {
  renderer.render(scene, camera);

  requestAnimationFrame(() => {
    update(renderer, scene, camera);
  });
};
const scene = init();

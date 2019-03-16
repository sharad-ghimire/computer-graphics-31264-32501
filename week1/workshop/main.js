var scene, camera, renderer;
var width = window.innerWidth;
var height = window.innerHeight;
var ratio = width / height;

const init = () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, ratio, 1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });

  const cube = getCube(1, 1, 1, 0x00ff00);
  cube.rotation.x = 2;
  scene.add(cube);
  camera.position.z = 5;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer.setSize(width, height);
  document.getElementById('webgl').append(renderer.domElement);
  animate(renderer, scene, camera);
};

const animate = (renderer, scene, camera) => {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
};

const getCube = (width, height, depth, color) =>
  new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshBasicMaterial({ color })
  );

init();
animate();

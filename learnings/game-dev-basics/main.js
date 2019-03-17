var scene, camera, renderer;
const width = window.innerWidth;
const height = window.innerHeight;
const ratio = width / height;

const init = () => {
  document.body.style.backgroundColor = '#d7f0f7';
  setupThree();
  setupWorld();
  const render = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();
};

const getSphere = (radius, width, height, color) => {
  let geometry = new THREE.SphereGeometry(radius, width, height);
  let material = new THREE.MeshLambertMaterial({ color });
  return new THREE.Mesh(geometry, material);
};

const getPointLight = (color, intensity, distance) => {
  let light = new THREE.PointLight(color, intensity, distance);
  return light;
};

const setupThree = () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, ratio, 1, 10000);
  camera.position.y = 400;
  camera.position.z = 400;
  camera.rotation.x = (-45 * Math.PI) / 180;
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor('#e5e5e5');
  renderer.setSize(width, height);

  document.getElementById('webgl').append(renderer.domElement);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

const setupWorld = () => {
  // Floor
  let geo = new THREE.PlaneGeometry(2000, 2000, 20, 20);
  let mat = new THREE.MeshBasicMaterial({ color: 0x9db3b5, overdraw: true });

  let floor = new THREE.Mesh(geo, mat);
  floor.rotation.x = (-90 * Math.PI) / 180;
  scene.add(floor);

  // Original building
  let geometry = new THREE.CubeGeometry(1, 1, 1);
  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
  let material = new THREE.MeshDepthMaterial({ overdraw: true });

  // Cloned buildings
  var cityGeometry = new THREE.Geometry();
  for (var i = 0; i < 300; i++) {
    var building = new THREE.Mesh(geometry.clone());
    building.position.x = Math.floor(Math.random() * 200 - 100) * 4;
    building.position.z = Math.floor(Math.random() * 200 - 100) * 4;
    building.scale.x = Math.random() * 50 + 10;
    building.scale.y = Math.random() * building.scale.x * 8 + 8;
    building.scale.z = building.scale.x;
    THREE.GeometryUtils.merge(cityGeometry, building);
  }
  var city = new THREE.Mesh(cityGeometry, material);
  scene.add(city);
};

init();
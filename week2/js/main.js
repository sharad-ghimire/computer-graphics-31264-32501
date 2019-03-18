var scene, camera, renderer, controls, axis, gui, params;
const width = window.innerWidth;
const height = window.innerHeight;
const ratio = width / height;

const init = () => {
  scene = new THREE.Scene();
  gui = new dat.GUI();
  camera = new THREE.PerspectiveCamera(70, ratio, 1, 2000);
  controls = new THREE.OrbitControls(camera);
  axis = new THREE.AxisHelper(300);
  camera.position.z = 200;

  // dat.GUI()
  gui.add(camera.position, 'z', 0, 800);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor('#e5e5e5');
  renderer.setSize(width, height);

  document.getElementById('webgl').append(renderer.domElement);

  const sphere = getSphere(100, 32, 16, 0xffcc00);
  const pointLight = getPointLight(0xffffff, 1, 500);
  scene.add(sphere);
  scene.add(pointLight);
  scene.add(axis);
  pointLight.position.set(10, 0, 25);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const animate = () => {
    sphere.position.y = 100 * Math.abs(Math.cos(Date.now() * 0.01));
  };

  const render = () => {
    requestAnimationFrame(render);
    controls.update();
    animate();
    gui.open();
    renderer.render(scene, camera);
  };
  render();
};

const getSphere = (radius, width, height, color) => {
  let geometry = new THREE.SphereGeometry(radius, width, height);
  let material = new THREE.MeshLambertMaterial({ color });
  material.wireframe = true;
  return new THREE.Mesh(geometry, material);
};

const getPointLight = (color, intensity, distance) => {
  let light = new THREE.PointLight(color, intensity, distance);
  return light;
};

init();

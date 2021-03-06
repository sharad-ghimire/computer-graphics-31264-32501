## WebGL

A Javascript API that enables creation and display of 3D content inside the browser using the graphical processing unit (GPU). Works in all modern browsers and is a low-level API.

## Three.js

An open source JS library that abstract away the complexity of WebGL and allows us to create real time content in a much easier manner.

### Basic Setup

```js
// Scene => container for every other 3D object we are planning of work with, it represent the 3D word we see.
// Camera to define a point of view (needs, Field of view, aspect ratio, near clipping plane, far clipping plane)

const init = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  // rendering => process of converting 3D data to 2D data
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff); // Gives white background
  // we can also use css styles color like rgb(255, 255, 255) or #ffffff
  document.getElementById('webgl').append(renderer.domElement);

  renderer.render(scene, camera);
};

init();
```

**Primitive**

3D objects are made up of 2 parts: a **geometry** that defines the shape of the object and the **material** that defines the surface quality or apperance of the object. Combining these two properties make up a **Mesh**.

```js
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00
}); // Mesh basic material is not affected by scene lighting

const mesh = new THREE.Mesh(geometry, material); // mesh will form 3D object
// Add that object to the scene
scene.add(mesh);
```

Or we can just create a function to simply above process

```js
const getBox = (width, height, depth, color) =>
  new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshBasicMaterial({ color })
  );

// Call above function in init()
const box = getBox(1, 1, 1, 0x00ff00);
scene.add(box);
```

But we are not seeing anything in the screen yet! Because, whenever we create something in 3D, we are creating it at the 0, 0, 0 (x, y, z) coordinate space ie at the center of the `scene`. (y axis pointing upwards, x and z in other directions). So, when we add box and camera they are both created at 0,0,0 and are superimposed at the same coordinate space, so camera is unable to see the box. So, to be able to see the box, either we should move that box in z (or -z) direction or we can move the camera in +z direction (or -z) so that they can see each other. Let's move camera 5 units in the z axis.

```js
camera.position.z = 5;
```

So, objects in Three.js has three attributes called position, rotation and scale and that we use to transform them. And all these attributes has 3 more attributes for us to choose which axis we would like to perform the transformation on.

```js
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 5;
```

Now, we can see the dimension, but the camera is not pointing to that box anymore? i,e Box is not centered in the frame. To fix: use `lookAt()` method on `camera` object which determines which point the camera is looking at.

The points in the 3D space are representated by **vectors**. So, lets pass a new vector object with point 0,0,0 to that `lookAt()`.

```js
camera.lookAt(new THREE.Vector3(0, 0, 0));
```

**Create a plane**

```js
const getPlane = (size, color) =>
  new THREE.Mesh(
    new THREE.PlaneGeometry(size, size), // same size width and depth
    new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
  );

// Inside init()
const plane = getPlane(4, 0xff0000);

scene.add(plane);
```

In 3D, 2 dimensional flat objects don't have both of their sides displayed by default. So, to be able to see the other side of the object, we need to pass attribute called `THREE.DoubleSide` for the 2D object as well.

If we want that plane horizantal to the ground so we need to rotate it 90 degrees around x axis.

```js
plane.rotation.x = Math.PI / 2;
```

Three.js uses radian instead of angles to do the rotation. Let's move that box half of its current size so that it can sit on that plane.

```js
box.position.y = 0.5; // But will work only for the box with height 1
box.position.y = box.geometry.parameters.heigth; // Better way
```

#### Three.js Objects

- Most objects in Three.js are instances of the `Object3D` base class. So, they share some common properties.
  2

```js
const init = () => {
  //...
  return scene;
};

const scene = init(); // Now we will be able to see properties of scene object

// inside scene there is a property called visible that determines if a object is visible or not.
// Inside console
scene.visible = false;
```

Even if we set the value of `scene.visibility = false`, we will not see anything changing in the screen. The reason for this, is currently the 3D scene is being rendered only once, when our script loads, which is before we are doing the above change. For every subsequent change to be visible, we need to be rendering the scene at all times. And, this continuous rendering cycle would allow for animation and interactivity. (This is how we get real time 3D graphics).

For continous renders, we need to use a special method on window object called `requestAnimationFrame()`. This function is similar to `setInterval()` in a sense that it periodically calls the given function but it also performs sorts of optimizations regarding the frame fets painted, which makes it preferable to use this func while working with animations.

```js
// This function will handle the rendering of the scene using the requestAnimationFrame()
// And now we are doing our rendering through this function
const update = (renderer, scene, camera) => {
  renderer.render(scene, camera);

  // This function will get an callback, and inside the callback, we are going to be calling the update() recursively
  requestAnimationFrame(() => {
    update(renderer, scene, camera);
  });
};
```

What we did in above code is, we set up a function that gets recursively called by the request animation frame function, so that things will get continously rendered, about 60 times a second until we close the browser. So, as we are continuously rendering the scene, things like `scene.visibility = false` will immediately take effect.

**Common `Object3D` Properties**

- 3D scenes are structured in a hierarchical manner, so there's **parent** **child** relationship in between objects. The `scene` object is the parent for all other objects that are get added by `scene.add()`. `scene` is simply a container for every other object that we will be rendering. Just like how we are adding objects inside the `scene` object, we could add objects inside other objects as well.
- So, this helps us to establish a parent child relationship between different objects. So, why do we want to do that? We might want to do this when it provides a logical grouping of objects. Or, objects that are added to other objects will share the transformation of the parent object. So, if we move parent, child will also move along.
- For example, what if we want to rotate that box we created along side when we rotate that plane instead of adding it directly to the scene?

```js
// Now box is a child of plane object
plane.add(box);
scene.add(plane);
// So, if we move plane, the box will also move
plane.position.y = 1;
```

- Another property that objects in Three.js share are the name property which make them easier to find them by using `getObjectByName`

```js
plane.name = 'Plane-1';

//After naming, we can loacte that object by calling getObjectByName() on its parent object. And lets create an animation as well.
const update = (renderer, scene, camera) => {
  renderer.render(scene, camera);

  const plane = scene.getObjectByName('Plane-1');
  plane.rotation.y += 0.001;
  plane.rotation.z += 0.001;

  requestAnimationFrame(() => {
    update(renderer, scene, camera);
  });
};
```

- Another common method: `traverse()`. It allows us to execute a given callback function on the current object, and all of its descendants. It is useful when we are working with lots of objects, and if we wanted to call a function on all the children of a certain object.

```js
//Add a scale x animation to everything that is children of the scene object
scene.traverse((child) => (child.scale.x += 0.001));
// Above function takes a callback with child and for all child of scene adds 0.001 scale.x property (inside update())
```

**Add fog to the scene**
As we already know, `scene` object inherits properties from the `Object3D` class. It only has few properties of its own like thr `fog` property. It allows the scene to fade off to a given color. (visual prop, aestheticc quality of scene). Two kinds.

```js
// We need to pass this object inside the fog property. This object has two params
// new THREE.FogExp2(<color>,<density>)
scene.fog = new THREE.FogExp2(0xffffff, 0.2);
```

### Lights

Till now, we are using `MeshBasicMaterial()` on our object which is not affected by the scene lighting. Some of the material to choose in Three.js for example: `MeshPhongMetarial`.

```js
const getBox = (width, height, depth, color) =>
  new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshPhongMaterial({ color })
  );
```

Now, we have objects that are affected by lightings. But we are not seeing anything because there is no lights. Let's create one. Types of light

- **PointLight**: is emmitted from a single point in space, in all direction. Like a bulb.

```js
// Will get an intensity
// A point light takes two arguments, 1 is color of the light and 2 intensity
const getPointLight = (intensity) => {
  let light = new THREE.PointLight(0xffffff, intensity);
  return light;
};

// inside init()
const pointLight = getPointLight(1);
pointLight.position.y = 2; //  because initialy any object will be place at 0
scene.add(pointLight);
```

As we cannot precisely see the positon of light, we can use some tricks. Like create a simple sphere object and add it to light object. (parent child relationship)

```js
const getSphere = (radius, color) =>
  new THREE.Mesh(
    new THREE.SphereGeometry(radius, 24, 24), // those 24 are segement values (resolution of geometry) It tells how smooth the curved object going to look
    new THREE.MeshBasicMaterial({ color })
  );

// Inside init()

const sphere = getSphere(0.05, 'rgb(255, 255, 255)');
pointLight.add(sphere); // child of pointLight
```

**dat.GUI** : Is a JavaScript library to easily create user interfaces that control variables. It works well with three.js as it provides a way to alter the scene values in real time.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.5/dat.gui.min.js"></script>
```

To use it, just instantiate and use `add()` to add the parameters that we would like to control, through a user interface.

```js
const gui = new dat.GUI();
//...0, 10 is the range of argument intensity
gui.add(pointLight, 'intensity', 0, 10);
gui.add(pointLight.position, 'y', 0, 5);
```

Now, we can see new slider being created and allows us to interact with it.

**Orbit Control**: Another interactivity is orbit control for camera. It allows us to rotate the camera around the scene by just dragging our mouse on the screen. It will let us see what's going on much better by allowing for interactive camera movement. [Download that script]("https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.js"). Which is same as below:

```html
<script src="OrbitControl.js"></script>
```

_Instantiating orbit controls_

```js
// Instantiating with camera and renderer.domElement
const controls = new THREE.OrbitControls(camera, renderer.domElement);

//pass that control to update() becoz we want to update it with each requestAnimationFrame call (on each frame render)
update(renderer, scene, camera, controls);

//...
const update = (renderer, scene, camera, controls) => {
  renderer.render(scene, camera);

  // call update() on controls object to active it
  controls.update();

  requestAnimationFrame(() => {
    update(renderer, scene, camera, controls);
  });
};
```

### Shadows

Shadows are the crucial element of lighting, although it not straight forward in Three.js because shadows are conditionally expensive and we need to active shadow rendering on multiple places. Shadows in three.js are generated using a technique called shadow maps, which is a performance-optimized way of calculating shadows, but can sometimes yield glitchy results.

```js
// first we need to tell  the renderer to start rendering shadows
renderer.shadowMap.enabled = true;
// Then we need to tell lighhts to cast the shadows
const getPointLight = (intensity) => {
  let light = new THREE.PointLight(0xffffff, intensity);
  light.castShadow = true;
  return light;
};

// We should also tell objects to cast or recieve shadows
// lets make box to cast shadow
const getBox = (width, height, depth, color) => {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshPhongMaterial({ color })
  );
  mesh.castShadow = true;
  return mesh;
};
// and plane to recieve shadow
const getPlane = (size, color) => {
  let mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide })
  );
  mesh.receiveShadow = true;
  return mesh;
};
```

### Programmatically creating more boxes

```js
const getBoxGrid = (amount, separationMultiplier) => {
  let group = new THREE.Group(); // A Group is a non-geometric object used for organizing other objects together (like html <div>). It serves the purpose of containing other object

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

// inside init()
const boxGrid = getBoxGrid(10, 1.5);
scene.add(boxGrid);
```

### Types of light

- **SpotLight** : The SpotLight is somewhat similar to PointLighting, but its influence is limited to a cone that gets projected from the light. The border where the light meets the shadow might look too sharp which can be controlled by setting the `penumbra` parameter.

```js
const getSpotLight = (intensity) => {
  let light = new THREE.SpotLight(0xffffff, intensity);
  light.castShadow = true;
  light.shadow.bias = 0.001; //fix for common shadowmap problem in artifacts
  return light;
};
// init() same as pointLighht
const spotLight = getSpotLight(1);
spotLight.position.y = 1.25;
spotLight.intensity = 2;
// dat.GUI() controllers
gui.add(spotLight, 'intensity', 0, 10);
gui.add(spotLight.position, 'y', 0, 20);
gui.add(spotLight.position, 'x', 0, 20);
gui.add(spotLight.position, 'z', 0, 20);
gui.add(spotLight, 'penumbra', 0, 1);

spotLight.add(sphere);
```

- DirectionalLight
- AmbientLight
- RectAreaLight

let isPaused = false;
let controlsVisible = false;
let topView = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color('black');

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);

const setTopView = () => {
  camera.position.set(0, 50, 0);
  camera.lookAt(0, 0, 0);
};

const setSideView = () => {
  camera.position.set(0, 0, 35);
  camera.lookAt(0, 0, 0);
};

setTopView(); // Default

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#solarCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// LIGHT
const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(0, 0, 0);
scene.add(light);

// STARS
function addStars() {
  const geometry = new THREE.BufferGeometry();
  const starCount = 1000;
  const positions = [];
  for (let i = 0; i < starCount; i++) {
    positions.push(
      (Math.random() - 0.5) * 500,
      (Math.random() - 0.5) * 500,
      (Math.random() - 0.5) * 500
    );
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
}
addStars();

// SUN
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xFDB813 })
);
scene.add(sun);

// PLANETS
const planetsData = [
  { name: "Mercury", color: 0xaaaaaa, distance: 5, size: 0.3, speed: 0.04 },
  { name: "Venus",   color: 0xffcc99, distance: 7, size: 0.5, speed: 0.03 },
  { name: "Earth",   color: 0x3399ff, distance: 9, size: 0.6, speed: 0.025 },
  { name: "Mars",    color: 0xff3300, distance: 11, size: 0.4, speed: 0.02 },
  { name: "Jupiter", color: 0xffcc66, distance: 15, size: 1.1, speed: 0.01 },
  { name: "Saturn",  color: 0xffff99, distance: 19, size: 0.9, speed: 0.008 },
  { name: "Uranus",  color: 0x66ffff, distance: 23, size: 0.7, speed: 0.006 },
  { name: "Neptune", color: 0x6666ff, distance: 27, size: 0.7, speed: 0.005 }
];

const planets = [];

planetsData.forEach(p => {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(p.size, 32, 32),
    new THREE.MeshStandardMaterial({ color: p.color })
  );
  scene.add(mesh);
  p.mesh = mesh;
  p.angle = 0;
  planets.push(p);

  // Sliders
  const label = document.createElement('label');
  label.textContent = `${p.name}:`;
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = 0.001;
  slider.max = 0.1;
  slider.step = 0.001;
  slider.value = p.speed;
  slider.oninput = e => p.speed = parseFloat(e.target.value);
  document.getElementById('controls').append(label, slider);
});

// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);

  if (!isPaused) {
    planets.forEach(p => {
      p.angle += p.speed;
      const x = p.distance * Math.cos(p.angle);
      const z = p.distance * Math.sin(p.angle);
      p.mesh.position.set(x, 0, z);
    });
  }

  renderer.render(scene, camera);
}
animate();

// MENU TOGGLE
document.getElementById('menuBtn').addEventListener('click', () => {
  controlsVisible = !controlsVisible;
  document.getElementById('controls').style.display = controlsVisible ? 'block' : 'none';
});

// PAUSE / RESUME
document.getElementById('pauseBtn').addEventListener('click', () => {
  isPaused = !isPaused;
  document.getElementById('pauseBtn').textContent = isPaused ? "▶ Resume" : "⏸ Pause";
});

// VIEW SWITCH
document.getElementById('viewToggle').addEventListener('click', () => {
  topView = !topView;
  if (topView) {
    setTopView();
  } else {
    setSideView();
  }
});

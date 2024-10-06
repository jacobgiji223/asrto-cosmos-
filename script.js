let scene, camera, renderer, earth, controls;

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 15); // Position the camera to see the Earth

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement); // Attach the renderer canvas to the body

    // Load Earth textures
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('textures/texture.jpg');
    const earthBumpMap = textureLoader.load('textures/bumpmap.jpg');

    // Create Earth Sphere
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        map: earthTexture,
        bumpMap: earthBumpMap,
        bumpScale: 0.1
    });
    earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Create Atmosphere (slightly larger sphere with transparency)
    const atmosphereGeometry = new THREE.SphereGeometry(5.2, 32, 32); // Slightly larger than Earth
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,         // Smoggy white color
        transparent: true,
        opacity: 0.3,           // Low opacity for the smog effect
        side: THREE.DoubleSide, // Make sure it’s visible from both sides
    });
    atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5); // Position the light
    scene.add(directionalLight);

    // Orbit Controls setup
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth the motion
    controls.dampingFactor = 0.05;
    controls.enableZoom = true; // Allow zooming

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Error logging in case textures fail to load
    renderer.domElement.addEventListener('error', (e) => {
        console.error('Error with renderer:', e);
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Update controls for smooth interaction
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

/* ==========================================================================
   NIIOMA — 3D WEBGL ENGINE (PURE BLACK FOG & ULTRA-HIGH CONTRAST)
   ========================================================================== */

let scene, camera, renderer, mainGroup;

// 3D Objects
let heroGroup, heroGlobe, heroCore, heroRings = [], heroSatellites = [];
let valueCrystals = [];
let constellationNodes, constellationLines;
let waveGridMesh, waveGridGeo, techCrystals = [];
let ecoPortalLeft, ecoPortalRight, portalRingLeft, portalRingRight;
let vortexTunnelParticles;
let globalParticleSystem;

// Mouse Interaction & Camera Control
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Camera Keyframes for 3D Flight Path
const cameraKeyframes = [
    { progress: 0.0, pos: { x: 0, y: 0, z: 9.5 }, rot: { x: 0, y: 0, z: 0 } },               // Hero
    { progress: 0.2, pos: { x: 25, y: -1.8, z: 7.2 }, rot: { x: 0.12, y: -0.15, z: -0.05 } }, // Values
    { progress: 0.4, pos: { x: 50, y: 1.5, z: 5.8 }, rot: { x: -0.12, y: 0.2, z: 0.05 } },    // AI for Good
    { progress: 0.6, pos: { x: 75, y: 5.0, z: 10.0 }, rot: { x: -0.4, y: -0.1, z: 0 } },      // Capabilities
    { progress: 0.8, pos: { x: 100, y: -1.2, z: 11.5 }, rot: { x: 0.08, y: 0.18, z: -0.04 } },// Ecosystem
    { progress: 1.0, pos: { x: 125, y: 0, z: 5.5 }, rot: { x: 0, y: 0, z: 0 } }              // Register
];

let currentCameraPos = { x: 0, y: 0, z: 9.5 };
let currentCameraRot = { x: 0, y: 0, z: 0 };

function initThreeScene() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.008); // Pure pitch black fog

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 9.5);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    mainGroup = new THREE.Group();
    scene.add(mainGroup);

    setupLighting();

    createGlobalParticleBackground();
    build3DScene0Hero(0);
    build3DScene1Values(25);
    build3DScene2Culture(50);
    build3DScene3Capabilities(75);
    build3DScene4Ecosystem(100);
    build3DScene5Register(125);

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);

    animateThreeScene();
}

function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 6, 90);
    cyanLight.position.set(10, 10, 15);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x7000ff, 7, 100);
    purpleLight.position.set(-10, -10, 12);
    scene.add(purpleLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(20, 30, 25);
    scene.add(dirLight);
}

function createGlobalParticleBackground() {
    const count = 2400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cCyan = new THREE.Color(0x00f2fe);
    const cPurple = new THREE.Color(0x7000ff);
    const cPink = new THREE.Color(0xff007f);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.1) * 200 - 35;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 55;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 45 - 5;

        const rand = Math.random();
        const col = rand < 0.4 ? cCyan.clone().lerp(cPurple, rand * 2.5) : cPurple.clone().lerp(cPink, (rand - 0.4) * 1.6);
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
    });

    globalParticleSystem = new THREE.Points(geometry, material);
    mainGroup.add(globalParticleSystem);
}

// 1. HERO 3D SCENE (X = 0)
function build3DScene0Hero(originX) {
    heroGroup = new THREE.Group();
    heroGroup.position.set(originX + 7, 0, 0);

    const globeGeo = new THREE.IcosahedronGeometry(3.5, 4);
    const globeMat = new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
        emissive: 0x00f2fe,
        emissiveIntensity: 0.4
    });
    heroGlobe = new THREE.Mesh(globeGeo, globeMat);
    heroGroup.add(heroGlobe);

    const coreGeo = new THREE.SphereGeometry(2.1, 32, 32);
    const coreMat = new THREE.MeshPhysicalMaterial({
        color: 0x7000ff,
        emissive: 0x7000ff,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.9,
        clearcoat: 1.0
    });
    heroCore = new THREE.Mesh(coreGeo, coreMat);
    heroGroup.add(heroCore);

    const ringRadii = [4.8, 5.5, 6.2];
    const ringColors = [0x00f2fe, 0x7000ff, 0xff007f];
    const ringRotations = [
        { x: Math.PI / 3, y: 0, z: 0 },
        { x: -Math.PI / 4, y: Math.PI / 6, z: 0 },
        { x: Math.PI / 6, y: -Math.PI / 3, z: Math.PI / 4 }
    ];

    ringRadii.forEach((radius, i) => {
        const ringGeo = new THREE.TorusGeometry(radius, 0.05, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: ringColors[i], transparent: true, opacity: 0.7 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.set(ringRotations[i].x, ringRotations[i].y, ringRotations[i].z);
        heroRings.push(ring);
        heroGroup.add(ring);
    });

    const satGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const satMat = new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0x00f2fe, emissiveIntensity: 0.6 });
    for (let i = 0; i < 6; i++) {
        const sat = new THREE.Mesh(satGeo, satMat);
        sat.userData = { angle: (i / 6) * Math.PI * 2, radius: 5.2, speed: 0.015 + i * 0.003 };
        heroSatellites.push(sat);
        heroGroup.add(sat);
    }

    mainGroup.add(heroGroup);
}

// 2. VALUES 3D SCENE (X = 25)
function build3DScene1Values(originX) {
    const geometries = [
        new THREE.OctahedronGeometry(1.4),
        new THREE.TetrahedronGeometry(1.5),
        new THREE.DodecahedronGeometry(1.3),
        new THREE.IcosahedronGeometry(1.4),
        new THREE.TorusKnotGeometry(0.9, 0.3, 120, 16)
    ];

    const posX = [-9, -4.5, 0, 4.5, 9];
    const posY = [2.4, -2.4, 3.0, -2.4, 2.2];

    geometries.forEach((geo, idx) => {
        const mat = new THREE.MeshPhysicalMaterial({
            color: idx % 2 === 0 ? 0x00f2fe : 0x7000ff,
            emissive: idx % 2 === 0 ? 0x00f2fe : 0x7000ff,
            emissiveIntensity: 0.4,
            roughness: 0.1,
            metalness: 0.9,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            wireframe: idx === 4
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(originX + posX[idx], posY[idx], 0);
        mesh.userData = { originalY: posY[idx], speed: 0.012 + idx * 0.004 };
        
        valueCrystals.push(mesh);
        mainGroup.add(mesh);
    });
}

// 3. AI FOR GOOD 3D SCENE (X = 50)
function build3DScene2Culture(originX) {
    const group = new THREE.Group();
    group.position.set(originX, 0, 0);

    const nodeCount = 70;
    const positions = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 16;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xff007f, size: 0.25, transparent: true, opacity: 0.9 });
    const nodes = new THREE.Points(pGeo, pMat);
    group.add(nodes);

    const lineMat = new THREE.LineBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.35 });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lineSegments);

    constellationNodes = nodes;
    constellationLines = lineSegments;
    mainGroup.add(group);
}

// 4. CAPABILITIES 3D SCENE (X = 75)
function build3DScene3Capabilities(originX) {
    const group = new THREE.Group();
    group.position.set(originX, -4, 0);

    waveGridGeo = new THREE.PlaneGeometry(36, 36, 36, 36);
    const waveMat = new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
        emissive: 0x7000ff,
        emissiveIntensity: 0.3
    });
    waveGridMesh = new THREE.Mesh(waveGridGeo, waveMat);
    waveGridMesh.rotation.x = -Math.PI / 2.5;
    group.add(waveGridMesh);

    const cubeGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    for (let i = 0; i < 4; i++) {
        const mat = new THREE.MeshPhysicalMaterial({
            color: 0x00f2fe,
            emissive: 0x00f2fe,
            emissiveIntensity: 0.5,
            roughness: 0.1,
            metalness: 0.9
        });
        const cube = new THREE.Mesh(cubeGeo, mat);
        cube.position.set((i - 1.5) * 5, 4.5 + (i % 2), 0);
        techCrystals.push(cube);
        group.add(cube);
    }

    mainGroup.add(group);
}

// 5. ECOSYSTEM 3D SCENE (X = 100)
function build3DScene4Ecosystem(originX) {
    const group = new THREE.Group();
    group.position.set(originX, 0, 0);

    const entGeo = new THREE.TorusGeometry(2.6, 0.12, 16, 100);
    const entMat = new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0x00f2fe, emissiveIntensity: 0.8 });
    ecoPortalLeft = new THREE.Mesh(entGeo, entMat);
    ecoPortalLeft.position.set(-6, 0, 0);
    group.add(ecoPortalLeft);

    const innerEntGeo = new THREE.IcosahedronGeometry(1.8, 3);
    const innerEntMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true });
    portalRingLeft = new THREE.Mesh(innerEntGeo, innerEntMat);
    portalRingLeft.position.set(-6, 0, 0);
    group.add(portalRingLeft);

    const venGeo = new THREE.TorusGeometry(2.6, 0.12, 16, 100);
    const venMat = new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 0.8 });
    ecoPortalRight = new THREE.Mesh(venGeo, venMat);
    ecoPortalRight.position.set(6, 0, 0);
    group.add(ecoPortalRight);

    const innerVenGeo = new THREE.IcosahedronGeometry(1.8, 3);
    const innerVenMat = new THREE.MeshBasicMaterial({ color: 0xff007f, wireframe: true });
    portalRingRight = new THREE.Mesh(innerVenGeo, innerVenMat);
    portalRingRight.position.set(6, 0, 0);
    group.add(portalRingRight);

    mainGroup.add(group);
}

// 6. REGISTER 3D SCENE (X = 125)
function build3DScene5Register(originX) {
    const count = 550;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const angle = i * 0.12;
        const radius = 0.6 + (i / count) * 5.0;
        positions[i * 3] = originX + Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = (i / count) * 15 - 7.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0x00f2fe, size: 0.18, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    vortexTunnelParticles = new THREE.Points(geometry, mat);
    mainGroup.add(vortexTunnelParticles);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    pointer.x = mouse.x;
    pointer.y = mouse.y;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Render Animation Loop
function animateThreeScene() {
    requestAnimationFrame(animateThreeScene);

    const time = Date.now() * 0.0015;

    mouse.targetX += (mouse.x - mouse.targetX) * 0.05;
    mouse.targetY += (mouse.y - mouse.targetY) * 0.05;

    camera.position.x = currentCameraPos.x;
    camera.position.y = currentCameraPos.y + mouse.targetY * 0.6;
    camera.position.z = currentCameraPos.z;

    camera.rotation.x = currentCameraRot.x - mouse.targetY * 0.03;
    camera.rotation.y = currentCameraRot.y - mouse.targetX * 0.04;
    camera.rotation.z = currentCameraRot.z;

    if (heroGlobe) {
        heroGlobe.rotation.y += 0.006;
        heroCore.rotation.y -= 0.009;
        heroRings.forEach((ring, i) => {
            ring.rotation.z += (i % 2 === 0 ? 0.005 : -0.005);
        });
        heroSatellites.forEach((sat) => {
            sat.userData.angle += sat.userData.speed;
            sat.position.x = Math.cos(sat.userData.angle) * sat.userData.radius;
            sat.position.z = Math.sin(sat.userData.angle) * sat.userData.radius;
            sat.rotation.x += 0.02;
            sat.rotation.y += 0.02;
        });
    }

    valueCrystals.forEach((mesh, idx) => {
        mesh.rotation.x += 0.012;
        mesh.rotation.y += 0.015;
        mesh.position.y = mesh.userData.originalY + Math.sin(time * 2 + idx) * 0.35;
    });

    if (constellationNodes) {
        constellationNodes.rotation.y += 0.004;
        constellationLines.rotation.y += 0.004;
    }

    if (waveGridGeo) {
        const pos = waveGridGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const u = pos.getX(i);
            const v = pos.getY(i);
            const z = Math.sin(u * 0.3 + time * 2) * Math.cos(v * 0.3 + time * 1.5) * 0.7;
            pos.setZ(i, z);
        }
        pos.needsUpdate = true;
    }

    techCrystals.forEach((cube) => {
        cube.rotation.x += 0.018;
        cube.rotation.y += 0.012;
    });

    if (ecoPortalLeft && ecoPortalRight) {
        ecoPortalLeft.rotation.z += 0.01;
        portalRingLeft.rotation.y += 0.015;

        ecoPortalRight.rotation.z -= 0.01;
        portalRingRight.rotation.y -= 0.015;
    }

    if (vortexTunnelParticles) {
        vortexTunnelParticles.rotation.z += 0.015;
    }

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(valueCrystals);

    valueCrystals.forEach(mesh => {
        mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    });

    if (intersects.length > 0) {
        const hit = intersects[0].object;
        hit.scale.lerp(new THREE.Vector3(1.45, 1.45, 1.45), 0.2);
    }

    renderer.render(scene, camera);
}

function updateThreeCameraPosition(progress) {
    let startIndex = 0;
    for (let i = 0; i < cameraKeyframes.length - 1; i++) {
        if (progress >= cameraKeyframes[i].progress) {
            startIndex = i;
        }
    }

    const endIndex = Math.min(startIndex + 1, cameraKeyframes.length - 1);
    const kfStart = cameraKeyframes[startIndex];
    const kfEnd = cameraKeyframes[endIndex];

    const range = kfEnd.progress - kfStart.progress;
    const localProgress = range > 0 ? (progress - kfStart.progress) / range : 0;

    currentCameraPos.x = kfStart.pos.x + (kfEnd.pos.x - kfStart.pos.x) * localProgress;
    currentCameraPos.y = kfStart.pos.y + (kfEnd.pos.y - kfStart.pos.y) * localProgress;
    currentCameraPos.z = kfStart.pos.z + (kfEnd.pos.z - kfStart.pos.z) * localProgress;

    currentCameraRot.x = kfStart.rot.x + (kfEnd.rot.x - kfStart.rot.x) * localProgress;
    currentCameraRot.y = kfStart.rot.y + (kfEnd.rot.y - kfStart.rot.y) * localProgress;
    currentCameraRot.z = kfStart.rot.z + (kfEnd.rot.z - kfStart.rot.z) * localProgress;
}

document.addEventListener('DOMContentLoaded', initThreeScene);

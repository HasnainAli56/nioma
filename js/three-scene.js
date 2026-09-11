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
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
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
    // Crisp Ambient Light for bright continent & ocean details across the whole planet
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 1.4);
    scene.add(ambientLight);

    // Front-top Directional Light for natural 3D depth without harsh white glare or dark shadows
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(5, 10, 15);
    scene.add(sunLight);

    // Cyan atmosphere rim light from left
    const cyanLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    cyanLight.position.set(-10, 5, 10);
    scene.add(cyanLight);

    // Bottom fill light so bottom edge is bright and clear
    const fillLight = new THREE.DirectionalLight(0x00f2fe, 0.5);
    fillLight.position.set(0, -10, 10);
    scene.add(fillLight);
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

//// 1. HERO 3D SCENE: PHOTOREALISTIC NASA EARTH & FILM/TECH ORBITAL SYSTEM (MATCHING REFERENCE PHOTO 100%)
function build3DScene0Hero(originX) {
    heroGroup = new THREE.Group();
    heroGroup.position.set(originX + 3.2, 0, 0); // Positioned nicely on the right

    const textureLoader = new THREE.TextureLoader();

    // 1. OFFICIAL NASA HIGH-RESOLUTION SATELLITE EARTH MAP
    const earthTexture = textureLoader.load(
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg',
        () => { renderer.render(scene, camera); }
    );
    earthTexture.encoding = THREE.sRGBEncoding;

    const specularMap = textureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_specular_2048.jpg');

    // Globe geometry with MeshStandardMaterial for photorealistic surface texture
    const globeGeo = new THREE.SphereGeometry(2.9, 128, 128);
    const globeMat = new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 0.45,
        metalness: 0.02
    });
    heroGlobe = new THREE.Mesh(globeGeo, globeMat);
    heroGlobe.rotation.y = 2.8; // Front-facing view centered on Africa, Europe, Mediterranean & Americas
    heroGlobe.rotation.x = 0.15;
    heroGroup.add(heroGlobe);

    // 2. REALISTIC CLOUD LAYER
    const cloudTexture = textureLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_clouds_2048.png');
    const cloudGeo = new THREE.SphereGeometry(2.92, 96, 96);
    const cloudMat = new THREE.MeshStandardMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    heroGroup.add(cloudMesh);

    // 4. ELEGANT ASTRONOMY ORBITAL TRACKING PATHS (2 SLEEK CYAN/BLUE LOOPS)
    const ringRadii = [3.8, 4.6];
    const ringColors = [0x00f2fe, 0x38bdf8];
    const ringRotations = [
        { x: Math.PI / 3.8, y: 0.2, z: Math.PI / 5 },
        { x: -Math.PI / 3.2, y: Math.PI / 4, z: -Math.PI / 6 }
    ];

    ringRadii.forEach((radius, i) => {
        const ringGeo = new THREE.TorusGeometry(radius, 0.014, 16, 120);
        const ringMat = new THREE.MeshStandardMaterial({
            color: ringColors[i],
            emissive: ringColors[i],
            emissiveIntensity: 0.9,
            transparent: true,
            opacity: 0.75
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.set(ringRotations[i].x, ringRotations[i].y, ringRotations[i].z);
        heroRings.push(ring);
        heroGroup.add(ring);
    });

    // 5. REALISTIC MODERN SATELLITES (Body + Solar Panels + Blue Beacon Light)
    for (let s = 0; s < 2; s++) {
        const satGroup = new THREE.Group();
        
        // Body
        const bodyGeo = new THREE.BoxGeometry(0.26, 0.26, 0.38);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x202634, metalness: 0.9, roughness: 0.2 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        satGroup.add(body);

        // Solar Wings
        const wingGeo = new THREE.BoxGeometry(0.85, 0.16, 0.02);
        const wingMat = new THREE.MeshStandardMaterial({ color: 0x051a3a, emissive: 0x38bdf8, emissiveIntensity: 0.5 });
        const wing = new THREE.Mesh(wingGeo, wingMat);
        satGroup.add(wing);

        // Beacon Light
        const beaconGeo = new THREE.SphereGeometry(0.05);
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.set(0, 0.16, 0);
        satGroup.add(beacon);

        const angle = s === 0 ? 1.2 : 4.4;
        const radius = ringRadii[s % ringRadii.length];
        satGroup.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.5), Math.sin(angle) * radius);
        satGroup.userData = { angle: angle, radius: radius, speed: 0.005 + s * 0.002 };
        
        heroSatellites.push(satGroup);
        heroGroup.add(satGroup);
    }

    // 6. TECH ANNOTATION CALLOUT BADGES (MATCHING REFERENCE UI 100% - TRANSPARENT FLOATING BADGES)
    const calloutData = [
        { text: 'REAL-TIME DATA', pos: new THREE.Vector3(-4.8, 2.8, 0.5), target: new THREE.Vector3(-2.2, 1.8, 1.8) },
        { text: 'BETTER DECISIONS', pos: new THREE.Vector3(5.2, 2.2, 0.5), target: new THREE.Vector3(2.8, 1.2, 1.8) },
        { text: 'HEALTHIER PLANET', pos: new THREE.Vector3(-3.8, -3.2, 0.5), target: new THREE.Vector3(-1.4, -2.4, 1.8) }
    ];

    calloutData.forEach(item => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 90;
        const ctx = canvas.getContext('2d');

        // Completely transparent background (No dark box!)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Glowing Icon Circle (⊕)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(35, 45, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#00f2fe';
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(35, 45, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Clean Minimal Text matching reference font
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px "Space Grotesk", sans-serif';
        ctx.fillText(item.text, 65, 53);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(item.pos);
        sprite.scale.set(3.2, 0.56, 1);
        heroGroup.add(sprite);

        // Thin cyan connecting line from label to point on Earth
        const linePoints = [item.pos, item.target];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 });
        const line = new THREE.Line(lineGeo, lineMat);
        heroGroup.add(line);

        // Glowing target dot on Earth
        const targetDotGeo = new THREE.SphereGeometry(0.05, 16, 16);
        const targetDotMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
        const targetDot = new THREE.Mesh(targetDotGeo, targetDotMat);
        targetDot.position.copy(item.target);
        heroGroup.add(targetDot);
    });

    // 7. CONNECTING ARCS ACROSS EARTH SURFACE
    const arcCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-1.8, 1.4, 1.2),
        new THREE.Vector3(0, 2.4, 2.0),
        new THREE.Vector3(2.2, 0.9, 1.2)
    );
    const arcPoints = arcCurve.getPoints(50);
    const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
    const arcMat = new THREE.LineBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.8 });
    const arcLine = new THREE.Line(arcGeo, arcMat);
    heroGroup.add(arcLine);

    mainGroup.add(heroGroup);
    updateHeroGroupPosition();
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

function updateHeroGroupPosition() {
    if (!heroGroup) return;
    const aspect = window.innerWidth / window.innerHeight;
    if (aspect >= 1.4) {
        heroGroup.position.x = 3.2;
        heroGroup.position.y = 0;
        heroGroup.scale.set(1.0, 1.0, 1.0);
    } else if (aspect >= 1.1) {
        heroGroup.position.x = 2.4;
        heroGroup.position.y = 0;
        heroGroup.scale.set(0.85, 0.85, 0.85);
    } else {
        heroGroup.position.x = 0;
        heroGroup.position.y = -2.6;
        heroGroup.scale.set(0.70, 0.70, 0.70);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateHeroGroupPosition();
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
        heroGlobe.rotation.y = 2.8 + Math.sin(time * 0.15) * 0.25; // Gentle oscillation keeping continents in front-center view 100% of the time!
        heroRings.forEach((ring, i) => {
            ring.rotation.z += (i % 2 === 0 ? 0.0025 : -0.0025);
            ring.rotation.y += 0.001;
        });
        heroSatellites.forEach((sat) => {
            sat.userData.angle += sat.userData.speed;
            sat.position.x = Math.cos(sat.userData.angle) * sat.userData.radius;
            sat.position.z = Math.sin(sat.userData.angle) * sat.userData.radius;
            sat.rotation.y += 0.01;
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

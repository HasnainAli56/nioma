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
    // Crisp Ambient Light ensuring 100% clear texture & geographic detail visibility across the globe
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.75);
    scene.add(ambientLight);

    // Directional Key Light illuminating the front-right face of the Earth GLB model
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(22, 12, 18);
    scene.add(keyLight);

    // Cyan Fill & Rim Light for 3D glowing outlines
    const cyanLight = new THREE.PointLight(0x00f2fe, 4.0, 70);
    cyanLight.position.set(10, 8, 12);
    scene.add(cyanLight);

    // Deep Purple Fill Light from lower left
    const purpleLight = new THREE.PointLight(0x7000ff, 3.5, 80);
    purpleLight.position.set(-15, -10, 10);
    scene.add(purpleLight);
}

function createDarkEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Deep Black Ocean Base
    ctx.fillStyle = '#03050a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Subtle Dark Slate Geographic Landmasses
    ctx.fillStyle = '#111622';
    ctx.strokeStyle = '#1d2638';
    ctx.lineWidth = 2;

    const drawLand = (coords) => {
        ctx.beginPath();
        coords.forEach(([x, y], idx) => {
            const px = (x / 360 + 0.5) * canvas.width;
            const py = (-y / 180 + 0.5) * canvas.height;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

    // North America
    drawLand([[-160,65],[-130,70],[-80,75],[-60,60],[-65,45],[-80,30],[-105,20],[-120,35],[-160,60]]);
    // South America
    drawLand([[-80,10],[-35,-5],[-40,-25],[-70,-55],[-80,-30],[-80,10]]);
    // Europe & Asia
    drawLand([[-10,35],[30,40],[60,65],[100,75],[140,70],[170,60],[140,35],[100,10],[70,25],[40,35],[10,40],[-10,35]]);
    // Africa
    drawLand([[-15,35],[35,30],[50,10],[40,-35],[20,-35],[-15,5],[-15,35]]);
    // Australia
    drawLand([[115,-15],[150,-12],[155,-35],[130,-38],[115,-25],[115,-15]]);

    // 3. Subtle Cyber City/Tech Lights (Cyan #00f2fe dots at 0.18 opacity)
    ctx.fillStyle = 'rgba(0, 242, 254, 0.18)';
    const cityPoints = [
        [-74, 40], [-118, 34], [-43, -22], [0, 51], [13, 52], [37, 55],
        [55, 25], [77, 28], [103, 1], [121, 31], [139, 35], [151, -33]
    ];
    cityPoints.forEach(([x, y]) => {
        const px = (x / 360 + 0.5) * canvas.width;
        const py = (-y / 180 + 0.5) * canvas.height;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
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

/// 1. HERO 3D SCENE: CINEMATIC SHADOWED EARTH & FILM/TECH ORBITAL SYSTEM (X = 0)
function build3DScene0Hero(originX) {
    heroGroup = new THREE.Group();
    heroGroup.position.set(originX + 3.4, 0, 0); // Positioned comfortably on the RIGHT side of viewport

    // Create primary heroGlobe mesh container immediately for instant frame 1 render
    const earthTexture = createDarkEarthTexture();
    const globeGeo = new THREE.SphereGeometry(2.6, 64, 64);
    const globeMat = new THREE.MeshStandardMaterial({
        map: earthTexture,
        color: 0x1a2332,
        roughness: 0.5,
        metalness: 0.3,
        emissive: 0x00f2fe,
        emissiveIntensity: 0.08
    });
    heroGlobe = new THREE.Mesh(globeGeo, globeMat);
    heroGroup.add(heroGlobe);

    // Asynchronously load user's 3d-earth.glb model and replace/attach once ready
    if (typeof THREE.GLTFLoader !== 'undefined') {
        const loader = new THREE.GLTFLoader();
        loader.load('3d-earth.glb', (gltf) => {
            const model = gltf.scene;
            
            // Auto-scale to fit 5.2 units diameter
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetScale = maxDim > 0 ? (5.2 / maxDim) : 1;
            model.scale.set(targetScale, targetScale, targetScale);

            // Smooth shading & realistic lighting: compute smooth vertex normals to fix low-poly facets
            model.traverse((child) => {
                if (child.isMesh) {
                    if (child.geometry) {
                        child.geometry.computeVertexNormals();
                    }
                    if (child.material) {
                        child.material.flatShading = false;
                        child.material.roughness = 0.5;
                        child.material.metalness = 0.15;
                        if (child.material.map) {
                            child.material.map.encoding = THREE.sRGBEncoding;
                            child.material.map.needsUpdate = true;
                        } else {
                            child.material.map = earthTexture;
                        }
                        child.material.needsUpdate = true;
                    }
                }
            });

            // Set front-facing orientation for Earth model
            model.rotation.y = 1.4;

            // Replace placeholder globe with loaded GLB model
            heroGroup.remove(heroGlobe);
            heroGlobe = model;
            heroGroup.add(heroGlobe);
            console.log("3D Earth GLB loaded & rendered with smooth normals successfully!");
        }, undefined, (error) => {
            console.log('GLTF loader error fallback active:', error);
        });
    }

    // Subtle Atmospheric Glow Shell
    const atmosGeo = new THREE.SphereGeometry(2.95, 64, 64);
    const atmosMat = new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.22,
        side: THREE.BackSide
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    heroGroup.add(atmosMesh);

    // 2. ELEGANT ASTRONOMY ORBITAL TRACKING PATHS (CYAN/BLUE HIGHLIGHTS)
    const ringRadii = [3.6, 4.3, 5.0, 5.7];
    const ringColors = [0x00f2fe, 0x3b82f6, 0x7000ff, 0x00f2fe];
    const ringRotations = [
        { x: Math.PI / 4, y: 0, z: Math.PI / 6 },
        { x: -Math.PI / 3.5, y: Math.PI / 5, z: 0 },
        { x: Math.PI / 5, y: -Math.PI / 3, z: Math.PI / 4 },
        { x: -Math.PI / 6, y: Math.PI / 4, z: -Math.PI / 5 }
    ];

    ringRadii.forEach((radius, i) => {
        const ringGeo = new THREE.TorusGeometry(radius, 0.02, 16, 120);
        const ringMat = new THREE.MeshStandardMaterial({
            color: ringColors[i],
            emissive: ringColors[i],
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.65
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.set(ringRotations[i].x, ringRotations[i].y, ringRotations[i].z);
        heroRings.push(ring);
        heroGroup.add(ring);
    });

    // 3. CINEMATIC FILM INDUSTRY FRAME MARKERS & RETICLES
    const frameGeo = new THREE.BoxGeometry(0.3, 0.18, 0.012);
    const frameMat = new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        emissive: 0x00f2fe,
        emissiveIntensity: 0.9,
        wireframe: true
    });

    for (let i = 0; i < 10; i++) {
        const frame = new THREE.Mesh(frameGeo, frameMat);
        const angle = (i / 10) * Math.PI * 2;
        const radius = ringRadii[i % ringRadii.length];
        frame.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.5) * 1.0, Math.sin(angle) * radius);
        frame.userData = { angle: angle, radius: radius, speed: 0.008 + (i % 3) * 0.003 };
        heroSatellites.push(frame);
        heroGroup.add(frame);
    }

    // 4. REALISTIC MODERN SATELLITES (Body + Solar Panels + Blue Beacon Light)
    for (let s = 0; s < 4; s++) {
        const satGroup = new THREE.Group();
        
        // Body
        const bodyGeo = new THREE.BoxGeometry(0.24, 0.24, 0.35);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x202634, metalness: 0.9, roughness: 0.2 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        satGroup.add(body);

        // Solar Wings
        const wingGeo = new THREE.BoxGeometry(0.7, 0.14, 0.02);
        const wingMat = new THREE.MeshStandardMaterial({ color: 0x051a3a, emissive: 0x3b82f6, emissiveIntensity: 0.4 });
        const wing = new THREE.Mesh(wingGeo, wingMat);
        satGroup.add(wing);

        // Beacon Light
        const beaconGeo = new THREE.SphereGeometry(0.05);
        const beaconMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.set(0, 0.15, 0);
        satGroup.add(beacon);

        const angle = (s / 4) * Math.PI * 2 + 0.5;
        const radius = 4.6;
        satGroup.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.5), Math.sin(angle) * radius);
        satGroup.userData = { angle: angle, radius: radius, speed: 0.006 + s * 0.002 };
        
        heroSatellites.push(satGroup);
        heroGroup.add(satGroup);
    }

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
        heroGroup.position.x = 4.4;
        heroGroup.position.y = 0;
        heroGroup.scale.set(1.05, 1.05, 1.05);
    } else if (aspect >= 1.1) {
        heroGroup.position.x = 3.6;
        heroGroup.position.y = 0;
        heroGroup.scale.set(0.9, 0.9, 0.9);
    } else {
        heroGroup.position.x = 0;
        heroGroup.position.y = -2.4;
        heroGroup.scale.set(0.7, 0.7, 0.7);
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
        heroGlobe.rotation.y += 0.0012; // Slow continuous planetary rotation
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

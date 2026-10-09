(function () {
  'use strict';

  // Original procedural exhibit. No external textures, models, or network requests are used.
  const DISTRICTS = [
    { key: 'manufacturing', label: '智造工厂', color: '#6d9cff', x: -4.1, z: 2.8 },
    { key: 'health', label: '医疗中心', color: '#63d6c7', x: 3.5, z: 3.5 },
    { key: 'agriculture', label: '智慧农场', color: '#b8d66e', x: 5.0, z: -1.4 },
    { key: 'science', label: '科学实验室', color: '#ae9aef', x: 0.2, z: -4.6 },
    { key: 'education', label: '学习空间', color: '#e6b76d', x: -4.2, z: -2.6 }
  ];

  function mount(container, options) {
    const settings = options || {};
    if (!container) throw new Error('CityScene.mount requires a container');
    const T = window.THREE;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let renderer;
    try {
      if (!T || !T.OrbitControls) throw new Error('Three.js is unavailable');
      renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch (_) {
      return mountFallback(container, settings, reduceMotion.matches);
    }

    let destroyed = false;
    let selected = null;
    let hovered = null;
    let simple = false;
    let motion = !reduceMotion.matches;
    let visible = true;
    let raf = 0;
    let previousFrame = 0;
    let activeUntil = 0;
    let elapsed = 0;
    let cameraTween = null;
    let pointerStart = null;
    let dragActive = false;
    const trackedMaterials = new Set();
    const trackedGeometries = new Set();
    const trackedTextures = new Set();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.55;
    renderer.setClearColor(0x07162a, 0);
    const canvas = renderer.domElement;
    canvas.setAttribute('aria-label', '未来生产力之城。拖动旋转，Ctrl 加滚轮缩放，点击产业建筑。也可用左右方向键选择建筑。');
    canvas.setAttribute('role', 'application');
    canvas.tabIndex = 0;
    container.appendChild(canvas);

    const scene = new T.Scene();
    scene.fog = new T.FogExp2(0x07162a, 0.021);
    const camera = new T.PerspectiveCamera(36, 1, 0.1, 100);
    const home = new T.Vector3(12.5, 13.8, 17.3);
    const homeTarget = new T.Vector3(0, 1.15, 0);
    camera.position.copy(home);
    const controls = new T.OrbitControls(camera, canvas);
    controls.target.copy(homeTarget);
    controls.enablePan = false;
    controls.enableZoom = false; // Ordinary wheel events must continue to scroll the page.
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.maxPolarAngle = Math.PI * 0.45;
    controls.autoRotate = motion;
    controls.autoRotateSpeed = 0.28;
    canvas.style.touchAction = 'pan-y';
    controls.update();

    scene.add(new T.HemisphereLight(0xb7d7ff, 0x0a1728, 2.3));
    const keyLight = new T.DirectionalLight(0xd7e9ff, 3.8);
    keyLight.position.set(-5, 15, 10);
    scene.add(keyLight);
    const rimLight = new T.DirectionalLight(0x749cff, 2.9);
    rimLight.position.set(8, 5, -8);
    scene.add(rimLight);
    const coreLight = new T.PointLight(0x7acdf5, 65, 16, 2);
    coreLight.position.set(0, 5, 0);
    scene.add(coreLight);

    function material(config) {
      const result = new T.MeshStandardMaterial(config);
      trackedMaterials.add(result);
      return result;
    }
    function geometry(result) { trackedGeometries.add(result); return result; }
    function box(w, h, d) { return geometry(new T.BoxGeometry(w, h, d)); }
    function cylinder(top, bottom, height, sides) { return geometry(new T.CylinderGeometry(top, bottom, height, sides || 32)); }
    function torus(radius, tube) { return geometry(new T.TorusGeometry(radius, tube || 0.025, 6, 64)); }
    function sphere(radius, detail) { return geometry(new T.SphereGeometry(radius, detail || 16, 12)); }
    function addMesh(parent, geo, mat, x, y, z, rotation) {
      const mesh = new T.Mesh(geo, mat);
      mesh.position.set(x || 0, y || 0, z || 0);
      if (rotation) mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
      parent.add(mesh);
      return mesh;
    }
    const baseMat = material({ color: 0x10253b, roughness: 0.38, metalness: 0.72 });
    const stageMat = material({ color: 0x153b54, roughness: 0.45, metalness: 0.65 });
    const glassMat = material({ color: 0x245575, roughness: 0.18, metalness: 0.66, transparent: true, opacity: 0.76 });
    const whiteMat = material({ color: 0xb6d3e1, roughness: 0.42, metalness: 0.35 });
    const navyMat = material({ color: 0x173449, roughness: 0.5, metalness: 0.25 });
    const ground = new T.Group();
    scene.add(ground);
    addMesh(ground, cylinder(7.85, 8.15, 0.32, 12), baseMat, 0, -0.65, 0);
    addMesh(ground, cylinder(7.85, 7.85, 0.13, 12), stageMat, 0, -0.43, 0);
    const borderMat = material({ color: 0x5c9bd0, emissive: 0x3a70a5, emissiveIntensity: 0.6, roughness: 0.3 });
    const stageBorder = addMesh(ground, torus(7.72, 0.025), borderMat, 0, -0.33, 0, [Math.PI / 2, 0, 0]);
    const gridGeo = geometry(new T.BufferGeometry());
    const gridPositions = [];
    for (let i = -6; i <= 6; i += 1.5) {
      const extent = Math.sqrt(Math.max(0, 7.4 * 7.4 - i * i));
      gridPositions.push(-extent, -0.345, i, extent, -0.345, i, i, -0.345, -extent, i, -0.345, extent);
    }
    gridGeo.setAttribute('position', new T.Float32BufferAttribute(gridPositions, 3));
    const gridMat = new T.LineBasicMaterial({ color: 0x6f9dc4, transparent: true, opacity: 0.12 });
    trackedMaterials.add(gridMat);
    ground.add(new T.LineSegments(gridGeo, gridMat));

    function label(text, color, width) {
      const surface = document.createElement('canvas');
      surface.width = 512;
      surface.height = 128;
      const ctx = surface.getContext('2d');
      ctx.clearRect(0, 0, 512, 128);
      ctx.fillStyle = 'rgba(7, 22, 42, 0.82)';
      ctx.beginPath();
      ctx.roundRect(4, 8, 504, 106, 10);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.font = '500 46px "Microsoft YaHei", "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#e4eff8';
      ctx.fillText(text, 256, 63);
      const texture = new T.CanvasTexture(surface);
      texture.colorSpace = T.SRGBColorSpace;
      trackedTextures.add(texture);
      const mat = new T.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, depthTest: false, opacity: 0.88 });
      trackedMaterials.add(mat);
      const sprite = new T.Sprite(mat);
      sprite.scale.set(width || 2.1, (width || 2.1) / 4, 1);
      return sprite;
    }

    const buildings = new Map();
    const pickTargets = [];
    const animatedParts = [];
    function districtBase(d) {
      const group = new T.Group();
      group.position.set(d.x, 0, d.z);
      scene.add(group);
      const glow = material({ color: d.color, emissive: d.color, emissiveIntensity: 0.6, roughness: 0.3, metalness: 0.25 });
      const skin = material({ color: 0x254259, emissive: d.color, emissiveIntensity: 0.035, metalness: 0.55, roughness: 0.3 });
      addMesh(group, cylinder(1.78, 1.92, 0.25, 6), baseMat, 0, -0.22, 0);
      addMesh(group, cylinder(1.72, 1.78, 0.12, 6), skin, 0, -0.04, 0);
      const ring = addMesh(group, torus(1.66, 0.025), glow, 0, 0.04, 0, [Math.PI / 2, 0, 0]);
      ring.material = glow;
      const tag = label(d.label, d.color, 2.25);
      tag.position.set(0, 0.2, 1.85);
      group.add(tag);
      const body = new T.Group();
      group.add(body);
      body.userData.district = d.key;
      pickTargets.push(body);
      const record = { ...d, group, body, glow, skin, ring, tag };
      buildings.set(d.key, record);
      return record;
    }

    function windows(parent, glow, count, start, step, width, height, depth) {
      const geom = box(width, height, depth);
      const instanced = new T.InstancedMesh(geom, glow, count);
      const dummy = new T.Object3D();
      for (let i = 0; i < count; i++) {
        dummy.position.set(start[0] + step[0] * i, start[1] + step[1] * i, start[2] + step[2] * i);
        dummy.updateMatrix();
        instanced.setMatrixAt(i, dummy.matrix);
      }
      parent.add(instanced);
      return instanced;
    }

    function factory(d) {
      const g = d.body;
      addMesh(g, box(2.5, 0.88, 1.6), d.skin, -0.1, 0.49, -0.1);
      // Three sawtooth skylights give the industrial roof its recognizable silhouette.
      for (let i = 0; i < 3; i++) {
        addMesh(g, box(0.78, 0.17, 1.74), glassMat, -0.94 + i * 0.82, 1.04, -0.1, [0, 0, -0.3]);
      }
      windows(g, d.glow, 5, [-1.06, 0.62, 0.72], [0.48, 0, 0], 0.25, 0.15, 0.018);
      addMesh(g, box(0.5, 0.55, 0.04), navyMat, 0.62, 0.31, 0.73);
      addMesh(g, cylinder(0.10, 0.17, 1.75, 12), whiteMat, -1.0, 0.95, -0.64);
      addMesh(g, cylinder(0.14, 0.14, 0.08, 12), d.glow, -1.0, 1.84, -0.64);
      const robot = new T.Group();
      robot.position.set(-0.47, 0.1, 1.12);
      g.add(robot);
      addMesh(robot, cylinder(0.24, 0.29, 0.12, 16), whiteMat, 0, 0.06, 0);
      addMesh(robot, cylinder(0.12, 0.18, 0.35, 12), d.glow, 0, 0.26, 0);
      const elbow = new T.Group();
      elbow.position.y = 0.45;
      elbow.rotation.z = -0.38;
      robot.add(elbow);
      addMesh(elbow, box(0.16, 0.68, 0.17), whiteMat, 0, 0.34, 0);
      addMesh(elbow, sphere(0.13), d.glow, 0, 0.04, 0);
      addMesh(elbow, sphere(0.12), d.glow, 0, 0.7, 0);
      addMesh(elbow, box(0.64, 0.12, 0.14), whiteMat, 0.27, 0.73, 0, [0, 0, -0.23]);
      addMesh(elbow, box(0.06, 0.22, 0.06), d.glow, 0.56, 0.60, 0.08);
      addMesh(elbow, box(0.06, 0.22, 0.06), d.glow, 0.56, 0.60, -0.08);
      animatedParts.push({ kind: 'robot', object: elbow });
    }

    function health(d) {
      const g = d.body;
      addMesh(g, box(1.16, 2.5, 1.13), d.skin, 0, 1.3, 0);
      addMesh(g, box(2.35, 0.7, 1.26), glassMat, 0, 0.43, 0.2);
      addMesh(g, box(1.31, 0.13, 1.28), whiteMat, 0, 2.59, 0);
      windows(g, d.glow, 6, [-0.58, 0.72, 0.585], [0, 0.28, 0], 0.026, 0.07, 0.032);
      windows(g, d.glow, 6, [0.58, 0.72, 0.585], [0, 0.28, 0], 0.026, 0.07, 0.032);
      addMesh(g, box(0.14, 0.63, 0.05), d.glow, 0, 1.96, 0.60);
      addMesh(g, box(0.63, 0.14, 0.05), d.glow, 0, 1.96, 0.60);
      addMesh(g, box(0.54, 0.35, 0.09), d.glow, 0, 0.25, 0.86);
      const roof = addMesh(g, torus(0.4, 0.021), d.glow, 0, 2.68, 0, [Math.PI / 2, 0, 0]);
      roof.name = 'helipad';
    }

    function farm(d) {
      const g = d.body;
      const soil = material({ color: 0x3b503b, roughness: 0.96, metalness: 0 });
      const plant = material({ color: 0x92b866, roughness: 0.86, emissive: 0x405321, emissiveIntensity: 0.12 });
      addMesh(g, box(2.7, 0.1, 2.2), soil, 0, 0.13, 0);
      const beds = windows(g, plant, 5, [-1.04, 0.22, 0.12], [0.51, 0, 0], 0.23, 0.12, 1.64);
      beds.name = 'planting-rows';
      const seedlings = new T.InstancedMesh(geometry(new T.ConeGeometry(0.09, 0.24, 5)), plant, 35);
      const dummy = new T.Object3D();
      for (let i = 0; i < 35; i++) {
        dummy.position.set(-1.04 + (i % 5) * 0.51, 0.38, -0.60 + Math.floor(i / 5) * 0.21);
        dummy.updateMatrix();
        seedlings.setMatrixAt(i, dummy.matrix);
      }
      g.add(seedlings);
      const greenHouse = new T.Group();
      greenHouse.position.set(0, 0, -0.55);
      g.add(greenHouse);
      const shellGeo = geometry(new T.CylinderGeometry(0.65, 0.65, 1.95, 16, 1, true, 0, Math.PI));
      const shellMat = material({ color: 0xa0c9c9, transparent: true, opacity: 0.3, metalness: 0.45, roughness: 0.12, side: T.DoubleSide });
      addMesh(greenHouse, shellGeo, shellMat, 0, 0.27, 0, [0, 0, Math.PI / 2]);
      for (let i = 0; i < 4; i++) {
        const arcGeo = geometry(new T.TorusGeometry(0.65, 0.021, 5, 28, Math.PI));
        addMesh(greenHouse, arcGeo, whiteMat, -0.92 + i * 0.61, 0.26, 0, [0, Math.PI / 2, 0]);
      }
      addMesh(g, box(0.13, 1.45, 0.13), whiteMat, 1.2, 0.82, 0.66);
      addMesh(g, sphere(0.12), d.glow, 1.2, 1.63, 0.66);
      const drone = new T.Group();
      drone.position.set(0.85, 2.1, -0.45);
      g.add(drone);
      addMesh(drone, box(0.5, 0.1, 0.1), whiteMat);
      addMesh(drone, box(0.1, 0.1, 0.5), whiteMat);
      for (let i = 0; i < 4; i++) {
        const angle = i * Math.PI / 2;
        addMesh(drone, torus(0.11, 0.017), d.glow, Math.cos(angle) * 0.27, 0.01, Math.sin(angle) * 0.27, [Math.PI / 2, 0, 0]);
      }
      animatedParts.push({ kind: 'drone', object: drone });
    }

    function laboratory(d) {
      const g = d.body;
      addMesh(g, cylinder(1.30, 1.43, 0.86, 12), glassMat, 0, 0.47, 0);
      addMesh(g, cylinder(1.43, 1.43, 0.10, 12), d.skin, 0, 0.95, 0);
      addMesh(g, torus(1.36, 0.03), d.glow, 0, 1.01, 0, [Math.PI / 2, 0, 0]);
      const atom = new T.Group();
      atom.position.y = 1.98;
      g.add(atom);
      addMesh(atom, geometry(new T.IcosahedronGeometry(0.62, 1)), d.skin);
      const wire = new T.LineSegments(geometry(new T.EdgesGeometry(geometry(new T.IcosahedronGeometry(0.63, 1)))), new T.LineBasicMaterial({ color: d.color, transparent: true, opacity: 0.8 }));
      trackedMaterials.add(wire.material);
      atom.add(wire);
      addMesh(atom, torus(0.95, 0.026), d.glow, 0, 0, 0, [Math.PI / 2, 0, 0.3]);
      addMesh(atom, torus(0.95, 0.022), d.glow, 0, 0, 0, [0.58, 0.4, 0.8]);
      addMesh(atom, sphere(0.08), whiteMat, 0.87, 0.31, 0.15);
      animatedParts.push({ kind: 'atom', object: atom });
      windows(g, d.glow, 5, [-0.7, 0.57, 1.18], [0.35, 0, 0], 0.1, 0.19, 0.015);
    }

    function campus(d) {
      const g = d.body;
      // A stepped campus and an open book form the education pavilion.
      for (let i = 0; i < 4; i++) {
        addMesh(g, box(2.38 - i * 0.42, 0.28, 1.56 - i * 0.19), i % 2 ? glassMat : d.skin, 0, 0.2 + i * 0.27, -0.18 - i * 0.11);
        addMesh(g, box(2.35 - i * 0.42, 0.024, 0.032), d.glow, 0, 0.31 + i * 0.27, 0.61 - i * 0.205);
      }
      const book = new T.Group();
      book.position.set(0, 1.37, -0.18);
      g.add(book);
      addMesh(book, box(0.76, 0.08, 1.05), d.glow, -0.37, 0.1, 0, [0, 0, -0.24]);
      addMesh(book, box(0.76, 0.08, 1.05), d.glow, 0.37, 0.1, 0, [0, 0, 0.24]);
      addMesh(book, box(0.71, 0.055, 0.98), whiteMat, -0.37, 0.15, 0, [0, 0, -0.24]);
      addMesh(book, box(0.71, 0.055, 0.98), whiteMat, 0.37, 0.15, 0, [0, 0, 0.24]);
      addMesh(book, box(0.05, 0.14, 1.08), d.skin, 0, 0.08, 0);
      addMesh(g, cylinder(0.11, 0.11, 1.4, 12), whiteMat, -1.1, 0.85, -0.75);
      addMesh(g, box(0.44, 0.23, 0.025), d.glow, -0.87, 1.45, -0.75);
    }

    const builders = { manufacturing: factory, health, agriculture: farm, science: laboratory, education: campus };
    DISTRICTS.forEach(d => builders[d.key](districtBase(d)));

    // Central AI tower: data is the hub, the five sectors retain their own identities.
    const tower = new T.Group();
    scene.add(tower);
    const coreMat = material({ color: 0x9dbfff, emissive: 0x668bce, emissiveIntensity: 0.8, metalness: 0.6, roughness: 0.21 });
    addMesh(tower, cylinder(1.03, 1.3, 0.3, 6), stageMat, 0, 0.05, 0);
    addMesh(tower, cylinder(0.76, 0.88, 0.28, 6), coreMat, 0, 0.31, 0);
    addMesh(tower, cylinder(0.46, 0.70, 3.6, 6), glassMat, 0, 2.28, 0);
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3;
      addMesh(tower, box(0.035, 3.6, 0.035), coreMat, Math.cos(angle) * 0.52, 2.28, Math.sin(angle) * 0.52);
    }
    for (let i = 0; i < 3; i++) {
      addMesh(tower, cylinder(0.77 - i * 0.1, 0.77 - i * 0.1, 0.1, 6), stageMat, 0, 1.17 + i * 1.12, 0);
    }
    const crown = new T.Group();
    crown.position.y = 4.34;
    tower.add(crown);
    addMesh(crown, geometry(new T.OctahedronGeometry(0.47)), coreMat);
    addMesh(crown, torus(0.75, 0.024), coreMat, 0, 0, 0, [Math.PI / 2, 0, 0]);
    const coreTag = label('AI · 数据枢纽', '#9dbfff', 2.2);
    coreTag.position.set(0, 5.15, 0);
    tower.add(coreTag);

    const curves = DISTRICTS.map(d => new T.CubicBezierCurve3(
      new T.Vector3(0, 0.7, 0),
      new T.Vector3(d.x * 0.25, 1.1, d.z * 0.25),
      new T.Vector3(d.x * 0.65, 0.15, d.z * 0.65),
      new T.Vector3(d.x, 0.08, d.z)
    ));
    curves.forEach((curve, i) => {
      const pathMat = material({ color: DISTRICTS[i].color, emissive: DISTRICTS[i].color, emissiveIntensity: 0.5, transparent: true, opacity: 0.34, roughness: 0.5 });
      addMesh(scene, geometry(new T.TubeGeometry(curve, 30, 0.022, 5, false)), pathMat);
    });
    const particleCount = 125;
    const particleGeo = geometry(new T.BufferGeometry());
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const color = new T.Color(DISTRICTS[i % 5].color);
      color.toArray(particleColors, i * 3);
    }
    particleGeo.setAttribute('position', new T.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new T.BufferAttribute(particleColors, 3));
    const particleMat = new T.PointsMaterial({ size: 0.082, vertexColors: true, transparent: true, opacity: 0.8, blending: T.AdditiveBlending, depthWrite: false });
    trackedMaterials.add(particleMat);
    const particles = new T.Points(particleGeo, particleMat);
    scene.add(particles);
    const point = new T.Vector3();

    const starGeo = geometry(new T.BufferGeometry());
    const starPositions = [];
    let seed = 427;
    function random() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
    for (let i = 0; i < 90; i++) starPositions.push((random() - 0.5) * 22, 0.5 + random() * 8, (random() - 0.5) * 18);
    starGeo.setAttribute('position', new T.Float32BufferAttribute(starPositions, 3));
    const starMat = new T.PointsMaterial({ color: 0x789fbb, size: 0.028, transparent: true, opacity: 0.45, depthWrite: false });
    trackedMaterials.add(starMat);
    const stars = new T.Points(starGeo, starMat);
    scene.add(stars);

    function renderParticles() {
      for (let i = 0; i < particleCount; i++) {
        const lane = i % 5;
        const phase = ((Math.floor(i / 5) / 25) + elapsed * (selected === DISTRICTS[lane].key ? 0.13 : 0.075)) % 1;
        curves[lane].getPoint(phase, point);
        particlePositions[i * 3] = point.x;
        particlePositions[i * 3 + 1] = point.y + 0.06;
        particlePositions[i * 3 + 2] = point.z;
      }
      particleGeo.attributes.position.needsUpdate = true;
    }

    function canRender() { return !destroyed && visible && !document.hidden; }
    function requestFrame() {
      if (canRender() && !raf) raf = requestAnimationFrame(frame);
    }
    function frame(now) {
      raf = 0;
      if (!canRender()) return;
      if (previousFrame && now - previousFrame < 1000 / 30) { requestFrame(); return; }
      const delta = Math.min(previousFrame ? (now - previousFrame) / 1000 : 0.033, 0.1);
      previousFrame = now;
      if (motion) elapsed += delta;
      if (cameraTween) {
        const t = Math.min(1, (now - cameraTween.started) / 800);
        const ease = t * t * (3 - 2 * t);
        controls.target.lerpVectors(cameraTween.from, cameraTween.to, ease);
        if (cameraTween.position) camera.position.lerpVectors(cameraTween.positionFrom, cameraTween.position, ease);
        if (t === 1) cameraTween = null;
      }
      controls.update(delta);
      crown.rotation.y = elapsed * 0.2;
      if (motion) animatedParts.forEach(part => {
        if (part.kind === 'atom') part.object.rotation.y = elapsed * 0.12;
        if (part.kind === 'robot') part.object.rotation.z = -0.38 + Math.sin(elapsed * 0.6) * 0.12;
        if (part.kind === 'drone') part.object.position.y = 2.1 + Math.sin(elapsed * 1.1) * 0.075;
      });
      renderParticles();
      buildings.forEach(d => {
        d.ring.scale.setScalar(d.key === selected ? 1.05 : 1);
        d.glow.emissiveIntensity = d.key === selected ? 1.2 : d.key === hovered ? 0.9 : 0.6;
        d.skin.emissiveIntensity = d.key === selected ? 0.19 : d.key === hovered ? 0.09 : 0.035;
        d.tag.material.opacity = selected && selected !== d.key ? 0.65 : 0.9;
      });
      renderer.render(scene, camera);
      if (motion || cameraTween || dragActive || now < activeUntil) requestFrame();
    }

    function resize() {
      if (destroyed) return;
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      camera.aspect = width / height;
      // Maintain a substantial city in both wide desktop and square mobile viewports.
      camera.fov = width / height < 0.85 ? 42 : 36;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      requestFrame();
    }

    const raycaster = new T.Raycaster();
    const pointer = new T.Vector2();
    function hitAt(event) {
      const rect = canvas.getBoundingClientRect();
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(pickTargets, true);
      if (!hits.length) return null;
      let object = hits[0].object;
      while (object && !object.userData.district) object = object.parent;
      return object ? object.userData.district : null;
    }
    function select(key) {
      if (key != null && !buildings.has(key)) return;
      selected = key || null;
      const d = buildings.get(key);
      const target = d ? new T.Vector3(d.x * 0.13, 1.15, d.z * 0.13) : homeTarget.clone();
      if (reduceMotion.matches) { controls.target.copy(target); cameraTween = null; }
      else cameraTween = { started: performance.now(), from: controls.target.clone(), to: target };
      activeUntil = performance.now() + 900;
      requestFrame();
    }
    function pointerDown(event) {
      pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId, moved: false };
    }
    function pointerMove(event) {
      if (pointerStart && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 6) pointerStart.moved = true;
      if (dragActive || event.pointerType === 'touch') return;
      const hit = hitAt(event);
      if (hit !== hovered) { hovered = hit; canvas.style.cursor = hit ? 'pointer' : 'grab'; requestFrame(); }
    }
    function pointerUp(event) {
      const start = pointerStart;
      pointerStart = null;
      if (!start || start.id !== event.pointerId || start.moved || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6) return;
      const hit = hitAt(event);
      if (hit) { select(hit); if (settings.onSelect) settings.onSelect(hit); }
    }
    function pointerCancel() { pointerStart = null; dragActive = false; }
    function pointerLeave() { hovered = null; canvas.style.cursor = 'grab'; requestFrame(); }
    function wheel(event) {
      if (!event.ctrlKey) return;
      event.preventDefault();
      cameraTween = null;
      const direction = camera.position.clone().sub(controls.target);
      const distance = T.MathUtils.clamp(direction.length() * Math.exp(event.deltaY * 0.0016), 14, 33);
      direction.setLength(distance);
      camera.position.copy(controls.target).add(direction);
      activeUntil = performance.now() + 800;
      requestFrame();
    }
    function keyDown(event) {
      const currentIndex = DISTRICTS.findIndex(d => d.key === selected);
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        const offset = event.key === 'ArrowRight' ? 1 : -1;
        const next = DISTRICTS[(currentIndex + offset + DISTRICTS.length) % DISTRICTS.length].key;
        select(next);
        if (settings.onSelect) settings.onSelect(next);
      }
      if (event.key === 'Escape') select(null);
      if (event.key === 'Home') { event.preventDefault(); reset(); }
    }
    function controlsStart() { dragActive = true; cameraTween = null; activeUntil = performance.now() + 1000; requestFrame(); }
    function controlsEnd() { dragActive = false; activeUntil = performance.now() + 750; requestFrame(); }
    function controlsChange() { requestFrame(); }
    function stopFrame() { if (raf) cancelAnimationFrame(raf); raf = 0; previousFrame = 0; }
    function visibilityChange() { if (document.hidden) stopFrame(); else requestFrame(); }
    function preferenceChange(event) { if (event.matches) { motion = false; controls.autoRotate = false; } requestFrame(); }

    canvas.style.cursor = 'grab';
    canvas.addEventListener('pointerdown', pointerDown);
    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerup', pointerUp);
    canvas.addEventListener('pointercancel', pointerCancel);
    canvas.addEventListener('pointerleave', pointerLeave);
    canvas.addEventListener('wheel', wheel, { passive: false });
    canvas.addEventListener('keydown', keyDown);
    document.addEventListener('visibilitychange', visibilityChange);
    reduceMotion.addEventListener('change', preferenceChange);
    controls.addEventListener('start', controlsStart);
    controls.addEventListener('end', controlsEnd);
    controls.addEventListener('change', controlsChange);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) requestFrame(); else stopFrame();
    }, { threshold: 0.01 });
    intersection.observe(container);
    resize();
    requestFrame();

    function reset() {
      selected = null;
      hovered = null;
      if (reduceMotion.matches) {
        camera.position.copy(home);
        controls.target.copy(homeTarget);
        cameraTween = null;
      } else {
        cameraTween = { started: performance.now(), from: controls.target.clone(), to: homeTarget.clone(), positionFrom: camera.position.clone(), position: home.clone() };
      }
      activeUntil = performance.now() + 900;
      requestFrame();
    }
    function destroy() {
      if (destroyed) return;
      destroyed = true;
      stopFrame();
      resizeObserver.disconnect();
      intersection.disconnect();
      controls.dispose();
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerup', pointerUp);
      canvas.removeEventListener('pointercancel', pointerCancel);
      canvas.removeEventListener('pointerleave', pointerLeave);
      canvas.removeEventListener('wheel', wheel);
      canvas.removeEventListener('keydown', keyDown);
      document.removeEventListener('visibilitychange', visibilityChange);
      reduceMotion.removeEventListener('change', preferenceChange);
      trackedGeometries.forEach(g => g.dispose());
      trackedMaterials.forEach(m => m.dispose());
      trackedTextures.forEach(t => t.dispose());
      renderer.dispose();
      canvas.remove();
    }
    let meshCount = 0;
    scene.traverse(object => { if (object.isMesh) meshCount++; });
    return {
      select,
      toggleMotion() { motion = !motion; controls.autoRotate = motion; activeUntil = performance.now() + 100; requestFrame(); return motion; },
      reset,
      setSimple(on) {
        simple = Boolean(on);
        renderer.setPixelRatio(simple ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
        stars.visible = !simple;
        stageBorder.visible = !simple;
        particleGeo.setDrawRange(0, simple ? 45 : particleCount);
        resize();
      },
      destroy,
      getState() { return { backend: 'webgl', selected, motion, simple, visible: visible && !document.hidden, meshCount, particleCount: simple ? 45 : particleCount, zoomHint: 'Ctrl+滚轮缩放' }; }
    };
  }

  function mountFallback(container, settings, reduced) {
    let selected = null;
    let simple = false;
    let motion = false;
    const wrapper = document.createElement('div');
    wrapper.dataset.cityFallback = '';
    wrapper.style.cssText = 'width:100%;height:100%;display:grid;place-items:center;color:#dae8f6;';
    const icon = {
      manufacturing: '<path d="M-48 18v-47l23 10v-16L0-18v-17l26 16v-35h13v72z"/><path d="M-33-4h12m13 0H4m13 0h12M-33 10h12m13 0H4m13 0h12"/>',
      health: '<path d="M-34 20v-85h68v85zm-20 0v-31h20m68 0h20v31"/><path d="M-15-43h30M0-58v30" stroke-width="7"/>',
      agriculture: '<path d="M-52 19h104M-44 6h88M-37-7h74M-30-20h60"/><path d="M-33 20v-51q33-47 66 0v51M-19-41v48M0-49v56M19-41v48"/>',
      science: '<ellipse rx="49" ry="20" cy="12"/><path d="M-49 12v-21a49 20 0 0 1 98 0v21"/><circle cy="-42" r="19"/><ellipse cy="-42" rx="35" ry="10" transform="rotate(30 0 -42)"/><ellipse cy="-42" rx="35" ry="10" transform="rotate(-40 0 -42)"/>',
      education: '<path d="M-52 23h104v-14H-52zm9-14h86V-7H-43zm11-16h64v-14H-32"/><path d="M0-20v-27q-22-14-43-8v26q23-6 43 9zm0-27q22-14 43-8v26q-23-6-43 9"/>'
    };
    const coordinates = [[255, 420], [640, 410], [735, 255], [610, 210], [215, 235]];
    wrapper.innerHTML = '<svg viewBox="0 0 900 650" style="width:100%;height:100%;max-height:720px" aria-label="未来产业之城平面视图">' +
      '<ellipse cx="470" cy="382" rx="346" ry="169" fill="#102d45" stroke="#3f6384"/><ellipse cx="470" cy="365" rx="346" ry="169" fill="#17394d" stroke="#5484a7" opacity=".7"/>' +
      DISTRICTS.map((d, i) => '<path d="M470 315Q' + coordinates[i][0] + ' 290 ' + coordinates[i][0] + ' ' + coordinates[i][1] + '" fill="none" stroke="' + d.color + '" opacity=".45"/>').join('') +
      '<g transform="translate(470 320)" fill="#235273" stroke="#9dbfff" stroke-width="2"><ellipse rx="47" ry="18" cy="35"/><path d="M-21 30v-160l21-17 21 17V30L0 45z"/><path d="M0-147V45M-21-75l21 15 21-15M-21-30l21 15 21-15"/><circle cy="-163" r="10"/><text fill="#e5edff" stroke="none" y="-190" text-anchor="middle" font-size="19" font-family="Microsoft YaHei,sans-serif">AI · 数据枢纽</text></g>' +
      DISTRICTS.map((d, i) => '<g data-city-key="' + d.key + '" tabindex="0" role="button" aria-label="选择' + d.label + '" transform="translate(' + coordinates[i][0] + ' ' + coordinates[i][1] + ')" style="cursor:pointer" fill="#183c52" stroke="' + d.color + '" stroke-width="2.5"><ellipse rx="77" ry="29" cy="21" fill="#183149"/>' + icon[d.key] + '<text fill="#e0eaf4" stroke="none" y="65" text-anchor="middle" font-size="19" font-family="Microsoft YaHei,sans-serif">' + d.label + '</text></g>').join('') +
      '<text x="470" y="596" text-anchor="middle" fill="#849db8" font-size="15" font-family="Microsoft YaHei,sans-serif">平面参观模式 · 点击五座建筑继续探索</text></svg>';
    container.appendChild(wrapper);
    const groups = wrapper.querySelectorAll('[data-city-key]');
    function select(key) {
      if (key && !DISTRICTS.some(d => d.key === key)) return;
      selected = key || null;
      groups.forEach(g => {
        g.setAttribute('stroke-width', g.dataset.cityKey === selected ? '5' : '2.5');
        g.setAttribute('aria-pressed', String(g.dataset.cityKey === selected));
      });
    }
    function click(event) {
      const group = event.target.closest('[data-city-key]');
      if (group) { select(group.dataset.cityKey); if (settings.onSelect) settings.onSelect(selected); }
    }
    function keydown(event) {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); click(event); }
    }
    wrapper.addEventListener('click', click);
    wrapper.addEventListener('keydown', keydown);
    if (settings.notify) settings.notify('已开启平面参观模式，可点击五个产业建筑继续探索。');
    return {
      select,
      toggleMotion() { motion = false; return false; },
      reset() { select(null); },
      setSimple(on) { simple = Boolean(on); },
      destroy() { wrapper.removeEventListener('click', click); wrapper.removeEventListener('keydown', keydown); wrapper.remove(); },
      getState() { return { backend: 'fallback', selected, motion, simple, reducedMotion: reduced, zoomHint: '平面参观模式' }; }
    };
  }

  window.CityScene = { mount };
})();

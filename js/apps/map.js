/* map.js - ENHANCED LOVE MAP */
const MAP = {
    scene: null,
    camera: null,
    renderer: null,
    pivot: null,
    animationId: null,
    isDraggingFlag: false,
    pins: [],
    raycaster: null,
    mouse: null,
    targetZoom: 16,
    currentZoom: 16,
    zoomSpeed: 0.1,
    currentView: 'world',
    countryMeshes: [],
    arcPulse: null,          // the traveling dot on the arc
    arcPoints: [],           // sampled great-circle points
    arcPulseT: 0,            // 0..1 along arc
    glowRings: [],           // pulsing halo rings
    openingDone: false,
    tooltipEl: null,
    distanceEl: null,

    t: function(key, fallback) {
    if (typeof I18N !== 'undefined' && I18N.t) return I18N.t(key);
    return fallback || key;
},

onLanguageChanged: function() {
    // Update overlay distance text
    if (this.distanceEl) {
        this.distanceEl.textContent = this.t('map_distance', this.distanceEl.textContent);
    }

    // Rebuild current view so canvas sprites + back button text update
    const view = this.currentView;
    const camPos = this.camera ? this.camera.position.clone() : null;
    const pivotRot = this.pivot ? this.pivot.rotation.clone() : null;

    if (view === 'world') this.showWorldView();
    else if (view === 'czechia') this.showCzechiaView();
    else if (view === 'capetown') this.showCapeTownView();

    // Optional: restore camera + rotation so it doesn’t “jump” after language switch
    if (camPos && this.camera) this.camera.position.copy(camPos);
    if (pivotRot && this.pivot) this.pivot.rotation.copy(pivotRot);
},

    // ═══════════════════════════════════════════════════════════════
    // INIT
    // ═══════════════════════════════════════════════════════════════
    init: function() {
        const container = document.getElementById('map-container-inner');
        if (!container) return;
        if (typeof THREE === 'undefined') {
            container.innerHTML = "<p style='color:#ff4d6d;text-align:center;padding-top:20%;font-size:1.5rem;'>⚠ 3D ENGINE OFFLINE</p>";
            return;
        }
        try {
            this.setupScene(container);
            this.createOverlayUI(container);
            this.showWorldView();
            this.runOpeningSequence();
        } catch(e) { console.error('Map failed:', e); }
    },

    // ═══════════════════════════════════════════════════════════════
    // SCENE SETUP
    // ═══════════════════════════════════════════════════════════════
    setupScene: function(container) {
        container.innerHTML = '';
        this.scene   = new THREE.Scene();
        const w = container.offsetWidth  || 580;
        const h = container.offsetHeight || 350;
        this.camera  = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
        this.camera.position.z = 16;
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(w, h);
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);
        this.raycaster = new THREE.Raycaster();
        this.mouse     = new THREE.Vector2();
        this.pivot     = new THREE.Group();
        this.scene.add(this.pivot);
        this.setupInteraction(container);
        this.animate();
        window.addEventListener('resize', () => this.handleResize(container));
    },

    // ═══════════════════════════════════════════════════════════════
    // OVERLAY UI  (tooltip, distance label)
    // ═══════════════════════════════════════════════════════════════
    createOverlayUI: function(container) {
        container.style.position = 'relative';

        // Tooltip
        this.tooltipEl = document.createElement('div');
        this.tooltipEl.style.cssText = `
            position:absolute; pointer-events:none; display:none;
            background:rgba(0,0,0,0.85); border:1px solid #ff4d6d;
            color:#ff4d6d; font-family:VT323,monospace; font-size:1.1rem;
            padding:4px 10px; border-radius:2px; white-space:nowrap;
            z-index:10; transform:translate(-50%,-120%);
        `;
        container.appendChild(this.tooltipEl);

        // Distance counter
        this.distanceEl = document.createElement('div');
        this.distanceEl.style.cssText = `
            position:absolute; bottom:10px; left:50%; transform:translateX(-50%);
            color:rgba(255,77,109,0.6); font-family:VT323,monospace; font-size:1rem;
            pointer-events:none; letter-spacing:1px;
        `;
        this.distanceEl.textContent = this.t(
    'map_distance',
    '📡  9,678 km apart — but who\'s counting'
);

        container.appendChild(this.distanceEl);
        if (!this._langListenerAdded) {
    window.addEventListener('languageChanged', () => this.onLanguageChanged());
    this._langListenerAdded = true;
}
    },

    

    showTooltip: function(text, x, y) {
        if (!this.tooltipEl) return;
        this.tooltipEl.textContent = text;
        this.tooltipEl.style.left  = x + 'px';
        this.tooltipEl.style.top   = y + 'px';
        this.tooltipEl.style.display = 'block';
    },
    hideTooltip: function() {
        if (this.tooltipEl) this.tooltipEl.style.display = 'none';
    },

    // ═══════════════════════════════════════════════════════════════
    // OPENING SEQUENCE
    // ═══════════════════════════════════════════════════════════════
    runOpeningSequence: function() {
        // fade in
        const container = document.getElementById('map-container-inner');
        if (container) {
            container.style.opacity = '0';
            container.style.transition = 'opacity 0.8s ease';
            setTimeout(() => { container.style.opacity = '1'; }, 100);
        }

        // Rotate globe so both cities are in view (facing slightly between them)
        // Cape Town lon~18, Prague lon~14 — both roughly 0-20° lon
        // Tilt the pivot so they face the camera
        this.pivot.rotation.y = -0.3;
        this.pivot.rotation.x =  0.15;

        // After 1.2s draw the arc progressively
        setTimeout(() => { this.drawArcAnimated(); }, 1200);

        this.openingDone = true;
    },

    // ═══════════════════════════════════════════════════════════════
    // WORLD VIEW
    // ═══════════════════════════════════════════════════════════════
    showWorldView: function() {
        this.currentView = 'world';
        this.clearScene();
        this.glowRings = [];
        this.arcPulse  = null;
        this.arcPoints = [];

        const titleBar = document.querySelector('#win-map .window-bar span');
        if (titleBar) titleBar.innerText = this.t('map_love_title', '💕 LOVE MAP');


        this.camera.position.x = 0;
        this.camera.position.y = 0;

        this.addRetroGlobe();
        this.addCityMarker(-33.9249, 18.4241, 0x00ff88, this.t('map_city_capetown', 'Cape Town 🇿🇦'), 'capetown');
this.addCityMarker( 50.0755, 14.4378, 0xff4d6d, this.t('map_city_prague',   'Prague 🇨🇿'),    'czechia');

        this.addFloatingHearts();

        if (this.distanceEl) this.distanceEl.style.display = 'block';

        this.targetZoom = 16;
    },

    // ═══════════════════════════════════════════════════════════════
    // GLOBE — core + filled continents + wireframe
    // ═══════════════════════════════════════════════════════════════
    addRetroGlobe: function() {
        // Dark core
        const core = new THREE.Mesh(
            new THREE.SphereGeometry(4.92, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0x1a0510 })
        );
        this.pivot.add(core);

        // Filled continent shapes (subtle)
        this.addFilledContinents();

        // Retro wireframe on top
        const wire = new THREE.Mesh(
            new THREE.SphereGeometry(5.01, 18, 18),
            new THREE.MeshBasicMaterial({ color: 0xff4d6d, wireframe: true, transparent: true, opacity: 0.18 })
        );
        this.pivot.add(wire);
        this.wireSphere = wire;
    },

    addFilledContinents: function() {
        const continents = [
            // Africa
            { pts: [[-35,18],[-30,22],[-18,38],[-8,42],[2,38],[12,42],[18,32],[28,32],[37,22],[32,12],[8,8],[-12,12],[-22,8],[-35,18]], col: 0x5c1a27 },
            // Europe
            { pts: [[36,-8],[42,2],[52,12],[62,18],[71,22],[70,32],[58,42],[48,36],[42,18],[36,2],[36,-8]], col: 0x4a1520 },
            // Asia
            { pts: [[70,35],[65,55],[55,85],[45,115],[35,138],[20,140],[5,125],[15,95],[25,75],[40,55],[70,35]], col: 0x3d1019 },
            // N America
            { pts: [[72,-165],[68,-135],[58,-115],[48,-95],[38,-85],[28,-88],[18,-98],[22,-115],[35,-130],[55,-155],[72,-165]], col: 0x4a1520 },
            // S America
            { pts: [[12,-78],[2,-72],[-12,-68],[-25,-68],[-38,-72],[-52,-70],[-48,-58],[-28,-48],[-8,-52],[5,-62],[12,-78]], col: 0x5c1a27 },
            // Australia
            { pts: [[-15,130],[-12,136],[-18,140],[-26,154],[-38,147],[-38,140],[-30,115],[-22,114],[-15,130]], col: 0x3d1019 },
        ];

        continents.forEach(({ pts, col }) => {
            // Outline
            const outlinePts = pts.map(([lat,lon]) => this.latLonToVector3(lat, lon, 5.02));
            const outlineGeo = new THREE.BufferGeometry().setFromPoints(outlinePts);
            const outline = new THREE.Line(outlineGeo, new THREE.LineBasicMaterial({
                color: 0xff6b8a, transparent: true, opacity: 0.5
            }));
            this.pivot.add(outline);

            // Filled shape projected onto sphere — approximate with triangulated fan
            // Use SphericalGeometry subset approach via canvas sprite
            this.addContinentFill(pts, col);
        });
    },

    addContinentFill: function(coords, color) {
        // Build a tube/flat mesh by sampling points and connecting to centroid
        const r = 4.98;
        const pts3d = coords.map(([lat,lon]) => this.latLonToVector3(lat, lon, r));
        // Centroid
        const cx = pts3d.reduce((s,p) => s+p.x, 0) / pts3d.length;
        const cy = pts3d.reduce((s,p) => s+p.y, 0) / pts3d.length;
        const cz = pts3d.reduce((s,p) => s+p.z, 0) / pts3d.length;
        const cLen = Math.sqrt(cx*cx+cy*cy+cz*cz);
        const center = new THREE.Vector3(cx/cLen*r, cy/cLen*r, cz/cLen*r);

        const verts = [];
        const idx   = [];
        verts.push(center.x, center.y, center.z);
        pts3d.forEach((p,i) => {
            verts.push(p.x, p.y, p.z);
            const next = (i+1) % pts3d.length;
            idx.push(0, i+1, next+1);
        });

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
        geo.setIndex(idx);
        const mat = new THREE.MeshBasicMaterial({
            color, transparent: true, opacity: 0.55, side: THREE.DoubleSide
        });
        this.pivot.add(new THREE.Mesh(geo, mat));
    },

    // ═══════════════════════════════════════════════════════════════
    // CITY MARKERS with multi-ring glow halos
    // ═══════════════════════════════════════════════════════════════
    addCityMarker: function(lat, lon, color, label, country) {
        const pos = this.latLonToVector3(lat, lon, 5.15);

        // Core dot
        const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.14, 16, 16),
            new THREE.MeshBasicMaterial({ color })
        );
        dot.position.copy(pos);
        dot.userData = { country, name: label };
        this.pivot.add(dot);
        this.countryMeshes.push(dot);

        // 3 glow rings at different scales / phase offsets
        [0, 1, 2].forEach(i => {
            const ring = new THREE.Mesh(
                new THREE.RingGeometry(0.18, 0.26, 32),
                new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.0, side: THREE.DoubleSide })
            );
            ring.position.copy(pos);
            ring.lookAt(0, 0, 0);
            ring.userData = { glowPhase: i * (Math.PI * 2 / 3), baseColor: color };
            this.pivot.add(ring);
            this.glowRings.push(ring);
        });

        // Text label sprite
        const canvas = document.createElement('canvas');
        canvas.width  = 256;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');
        ctx.font = 'bold 26px VT323, monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#' + color.toString(16).padStart(6,'0');
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 6;
        ctx.fillText(label, 128, 30);
        const labelSprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(canvas),
            transparent: true, opacity: 0.9
        }));
        const labelPos = this.latLonToVector3(lat, lon, 5.7);
        labelSprite.position.copy(labelPos);
        labelSprite.scale.set(2.2, 0.55, 1);
        labelSprite.userData = { isLabel: true };
        this.pivot.add(labelSprite);
    },

    // ═══════════════════════════════════════════════════════════════
    // THE ARC — great circle Cape Town ↔ Prague
    // ═══════════════════════════════════════════════════════════════
    greatCirclePoints: function(lat1, lon1, lat2, lon2, segments, radius) {
        const toRad = d => d * Math.PI / 180;
        const p1 = new THREE.Vector3().copy(this.latLonToVector3(lat1, lon1, radius));
        const p2 = new THREE.Vector3().copy(this.latLonToVector3(lat2, lon2, radius));
        const pts = [];
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const v = new THREE.Vector3().lerpVectors(p1, p2, t).normalize().multiplyScalar(radius);
            pts.push(v);
        }
        return pts;
    },

    drawArcAnimated: function() {
        const CAPE  = [-33.9249, 18.4241];
        const PRAGUE = [50.0755, 14.4378];
        const SEGS  = 80;
        const R     = 5.12;

        const allPts = this.greatCirclePoints(CAPE[0], CAPE[1], PRAGUE[0], PRAGUE[1], SEGS, R);
        this.arcPoints = allPts;

        // Build line geometry with all points but initially empty
        const positions = new Float32Array((SEGS + 1) * 3);
        const arcGeo = new THREE.BufferGeometry();
        arcGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        arcGeo.setDrawRange(0, 0);

        const arcMat = new THREE.LineBasicMaterial({
            color: 0xff4d6d, transparent: true, opacity: 0.85, linewidth: 2
        });
        const arcLine = new THREE.Line(arcGeo, arcMat);
        this.pivot.add(arcLine);

        // Animate drawing the arc point by point
        let drawn = 0;
        const drawStep = () => {
            if (drawn > SEGS) {
                // Arc fully drawn — add the pulse dot and glow dots
                this.addArcPulse(R);
                this.addArcGlowDots(allPts);
                return;
            }
            const pos = arcGeo.attributes.position;
            allPts.slice(0, drawn + 1).forEach((p, i) => {
                pos.setXYZ(i, p.x, p.y, p.z);
            });
            pos.needsUpdate = true;
            arcGeo.setDrawRange(0, drawn + 1);
            drawn += 2;
            requestAnimationFrame(drawStep);
        };
        drawStep();
    },

    addArcPulse: function(radius) {
        // Traveling dot that rides along the arc
        const pulse = new THREE.Mesh(
            new THREE.SphereGeometry(0.09, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 })
        );
        this.pivot.add(pulse);
        this.arcPulse = pulse;
        this.arcPulseT = 0;

        // Midpoint glow — a soft pink sphere at the arc midpoint
        if (this.arcPoints.length > 0) {
            const midPt = this.arcPoints[Math.floor(this.arcPoints.length / 2)];
            const glow = new THREE.Mesh(
                new THREE.SphereGeometry(0.18, 16, 16),
                new THREE.MeshBasicMaterial({ color: 0xff4d6d, transparent: true, opacity: 0.25 })
            );
            glow.position.copy(midPt);
            glow.userData = { isMidGlow: true };
            this.pivot.add(glow);
        }
    },

    addArcGlowDots: function(pts) {
        // Scatter tiny dots along the arc for a starfield/trail effect
        [0.15, 0.3, 0.45, 0.55, 0.7, 0.85].forEach(t => {
            const idx = Math.floor(t * (pts.length - 1));
            const dot = new THREE.Mesh(
                new THREE.SphereGeometry(0.04, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0xff8fa3, transparent: true, opacity: 0.5 })
            );
            dot.position.copy(pts[idx]);
            this.pivot.add(dot);
        });
    },

    // ═══════════════════════════════════════════════════════════════
    // FLOATING HEARTS
    // ═══════════════════════════════════════════════════════════════
    addFloatingHearts: function() {
        [[20,45],[-15,80],[50,-30],[-40,120],[65,0],[-25,-50],[35,160],[-60,25]].forEach(([lat,lon], i) => {
            const pos  = this.latLonToVector3(lat, lon, 5.35);
            const c    = document.createElement('canvas');
            c.width = c.height = 32;
            const ctx = c.getContext('2d');
            ctx.font = 'bold 22px Arial';
            ctx.textAlign = ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ff4d6d';
            ctx.fillText('♥', 16, 16);
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: new THREE.CanvasTexture(c), transparent: true, opacity: 0.5
            }));
            sprite.position.copy(pos);
            sprite.scale.set(0.35, 0.35, 1);
            sprite.userData = { heartIndex: i, baseOpacity: 0.5 };
            this.pivot.add(sprite);
        });
    },

    // ═══════════════════════════════════════════════════════════════
    // CZECHIA REGIONAL VIEW
    // ═══════════════════════════════════════════════════════════════
    showCzechiaView: function() {
        this.currentView = 'czechia';
        this.clearScene();
        this.camera.position.set(0, 0, 10);
        const titleBar = document.querySelector('#win-map .window-bar span');
        if (titleBar) titleBar.innerText = this.t('map_view_czechia_title', '🇨🇿 CZECHIA');

        if (this.distanceEl) this.distanceEl.style.display = 'none';

        this.addGridBackground(0x1a0510, 0xff4d6d);
        this.drawCzechiaShape();

        const pts = LORE.mapPoints.filter(p => p.color === 0xff4d6d);
        this.addRouteLines(pts, 49.75, 15.5, 3.0, 0xff4d6d);
        pts.forEach((pt, i) => this.addGeographicPin(pt, i, 49.75, 15.5, 3.0));

        this.addBackButton();
        this.targetZoom = 10;
    },

    drawCzechiaShape: function() {
        const border = [
            [51.05,14.25],[50.95,14.70],[50.85,15.05],[50.88,15.50],
            [50.87,16.00],[50.85,16.50],[50.88,17.00],[50.87,17.30],
            [50.68,17.73],[50.45,18.00],[50.25,18.50],[50.10,18.85],
            [49.85,18.86],[49.60,18.85],[49.35,18.65],[49.10,18.25],
            [48.95,17.80],[48.85,17.30],[48.78,17.00],[48.73,16.85],
            [48.68,16.50],[48.62,16.00],[48.60,15.50],[48.65,15.00],
            [48.70,14.50],[48.75,14.00],[48.80,13.50],[48.88,13.00],
            [49.00,12.70],[49.15,12.50],[49.35,12.40],[49.55,12.45],
            [49.75,12.55],[49.95,12.70],[50.15,12.90],[50.35,13.15],
            [50.50,13.45],[50.65,13.70],[50.80,14.00],[51.05,14.25]
        ];
        this.drawRegionShape(border, 49.75, 15.5, 3.0, 0xff4d6d);
    },

    // ═══════════════════════════════════════════════════════════════
    // CAPE TOWN REGIONAL VIEW
    // ═══════════════════════════════════════════════════════════════
    showCapeTownView: function() {
        this.currentView = 'capetown';
        this.clearScene();
        this.camera.position.set(0, 0, 10);
        const titleBar = document.querySelector('#win-map .window-bar span');
        if (titleBar) titleBar.innerText = this.t('map_view_capetown_title', '🇿🇦 CAPE TOWN');

        if (this.distanceEl) this.distanceEl.style.display = 'none';

        this.addGridBackground(0x001a10, 0x00ff88);
        this.drawCapeTownRegion();

        const pts = LORE.mapPoints.filter(p => p.color === 0x00ff88 || p.color === 0x0088ff);
        this.addRouteLines(pts, -34.0, 18.44, 25.0, 0x00ff88);
        pts.forEach((pt, i) => this.addGeographicPin(pt, i, -34.0, 18.44, 25.0));

        this.addBackButton();
        this.targetZoom = 10;
    },

    drawCapeTownRegion: function() {
        const border = [
            [-33.70,18.25],[-33.75,18.30],[-33.85,18.35],[-33.95,18.38],
            [-34.05,18.40],[-34.15,18.43],[-34.22,18.47],[-34.30,18.50],
            [-34.35,18.52],[-34.22,18.58],[-34.15,18.60],[-34.05,18.57],
            [-33.95,18.52],[-33.88,18.47],[-33.80,18.42],[-33.72,18.35],[-33.70,18.25]
        ];
        this.drawRegionShape(border, -34.0, 18.44, 25.0, 0x00ff88);
    },

    drawRegionShape: function(border, cLat, cLon, scale, color) {
        const pts = border.map(([lat,lon]) => this.latLonToCartesian(lat, lon, cLat, cLon, scale));
        // Fill
        const shape = new THREE.Shape();
        shape.moveTo(pts[0].x, pts[0].y);
        pts.forEach(p => shape.lineTo(p.x, p.y));
        const fillMesh = new THREE.Mesh(
            new THREE.ShapeGeometry(shape),
            new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
        );
        this.scene.add(fillMesh);
        // Outline
        const linePts = pts.map(p => new THREE.Vector3(p.x, p.y, 0.01));
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
        this.scene.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 })));
    },

    // ═══════════════════════════════════════════════════════════════
    // GRID BACKGROUND for regional views
    // ═══════════════════════════════════════════════════════════════
    addGridBackground: function(bgColor, lineColor) {
        // Dark base
        const bg = new THREE.Mesh(
            new THREE.PlaneGeometry(30, 20),
            new THREE.MeshBasicMaterial({ color: bgColor })
        );
        bg.position.z = -0.2;
        this.scene.add(bg);

        // Grid lines
        const gridMat = new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.07 });
        const step = 0.8;
        for (let x = -15; x <= 15; x += step) {
            const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,-10,-.1), new THREE.Vector3(x,10,-.1)]);
            this.scene.add(new THREE.Line(g, gridMat));
        }
        for (let y = -10; y <= 10; y += step) {
            const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-15,y,-.1), new THREE.Vector3(15,y,-.1)]);
            this.scene.add(new THREE.Line(g, gridMat));
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // ROUTE LINES between pins
    // ═══════════════════════════════════════════════════════════════
    addRouteLines: function(pts, cLat, cLon, scale, color) {
        if (pts.length < 2) return;
        const positions = pts.map(p => {
            const c = this.latLonToCartesian(p.lat, p.lon, cLat, cLon, scale);
            return new THREE.Vector3(c.x, c.y, 0.02);
        });
        const geo = new THREE.BufferGeometry().setFromPoints(positions);
        // Dashed-look: use a thin line with low opacity
        const mat = new THREE.LineDashedMaterial({
            color, transparent: true, opacity: 0.35,
            dashSize: 0.3, gapSize: 0.2
        });
        const line = new THREE.Line(geo, mat);
        line.computeLineDistances();
        this.scene.add(line);
    },

    // ═══════════════════════════════════════════════════════════════
    // PIN with label
    // ═══════════════════════════════════════════════════════════════
    addGeographicPin: function(locationData, index, cLat, cLon, scale) {
        const pos = this.latLonToCartesian(locationData.lat, locationData.lon, cLat, cLon, scale);

        // Heart sprite
        const c = document.createElement('canvas');
        c.width = c.height = 128;
        const ctx = c.getContext('2d');
        ctx.font = 'bold 96px Arial';
        ctx.textAlign = ctx.textBaseline = 'middle';
        ctx.fillStyle = '#' + locationData.color.toString(16).padStart(6,'0');
        ctx.shadowColor = '#000'; ctx.shadowBlur = 8;
        ctx.fillText('♥', 64, 64);
        const pin = new THREE.Mesh(
            new THREE.PlaneGeometry(0.6, 0.6),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true })
        );
        pin.position.set(pos.x, pos.y, 0.05);
        pin.userData = { locationData };
        this.scene.add(pin);

        // Label
        const lc = document.createElement('canvas');
        lc.width = 256; lc.height = 56;
        const lctx = lc.getContext('2d');
        lctx.font = 'bold 26px VT323, monospace';
        lctx.textAlign = 'center';
        lctx.fillStyle = '#fff';
        lctx.shadowColor = '#000'; lctx.shadowBlur = 5;
        lctx.strokeStyle='#000'; lctx.lineWidth=3;
        lctx.strokeText(locationData.title, 128, 32);
        lctx.fillText(locationData.title, 128, 32);
        const label = new THREE.Mesh(
            new THREE.PlaneGeometry(2.0, 0.45),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(lc), transparent: true })
        );
        label.position.set(pos.x, pos.y - 0.5, 0.04);
        this.scene.add(label);

        // Pulsing ring
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(0.33, 0.42, 32),
            new THREE.MeshBasicMaterial({ color: locationData.color, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
        );
        ring.position.set(pos.x, pos.y, 0.04);
        this.scene.add(ring);

        this.pins.push({ mesh: pin, ring, label, data: locationData, offset: index * 0.5 });
    },

    // ═══════════════════════════════════════════════════════════════
    // BACK BUTTON
    // ═══════════════════════════════════════════════════════════════
    addBackButton: function() {
        const c = document.createElement('canvas');
        c.width = 256; c.height = 64;
        const ctx = c.getContext('2d');
        ctx.fillStyle = 'rgba(255,77,109,0.85)';
        ctx.roundRect(0, 0, 256, 64, 6);
        ctx.fill();
        ctx.font = 'bold 28px VT323, monospace';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.t('map_back_world', '← WORLD MAP'), 128, 32);

        const btn = new THREE.Mesh(
            new THREE.PlaneGeometry(2.4, 0.6),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true })
        );
        btn.position.set(-6.2, 4.8, 0.1);
        btn.userData = { isBackButton: true };
        this.scene.add(btn);
        this.countryMeshes.push(btn);
    },

    // ═══════════════════════════════════════════════════════════════
    // POPUP — slide-in panel
    // ═══════════════════════════════════════════════════════════════
    showLocationPopup: function(locationData) {
    const win = document.getElementById('win-map');
    let panel = document.getElementById('map-side-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'map-side-panel';
        panel.style.cssText = `
            position:absolute; top:32px; right:0; bottom:0;
            width:260px; background:rgba(10,2,8,0.97);
            border-left:2px solid #ff4d6d;
            font-family:VT323,monospace; color:#fff;
            overflow-y:auto; z-index:20;
            transform:translateX(100%); transition:transform 0.3s ease; display:none;
        `;
        if (win) { win.style.overflow = 'hidden'; win.appendChild(panel); }
    }

    // --- TRANSLATION LOGIC ---
    // We look for a key like 'map_loc_prague_title' or fall back to the default
    const locId = locationData.id || locationData.title.toLowerCase().replace(/\s+/g, '_');
    const displayTitle = this.t(`map_loc_${locId}_title`, locationData.title);
    const displayDesc = this.t(`map_loc_${locId}_desc`, locationData.description);
    const visitedText = this.t('map_visited_label', '✓ YOU WERE HERE');

    panel.innerHTML = `
        <div style="position:relative;">
            <img src="${locationData.image}" alt="${displayTitle}"
                style="width:100%;height:150px;object-fit:cover;display:block;"
                onerror="this.style.display='none'">
            <button onclick="MAP.closePopup()"
                style="position:absolute;top:6px;right:8px;background:rgba(0,0,0,0.7);
                border:1px solid #ff4d6d;color:#ff4d6d;font-family:VT323,monospace;
                font-size:1.1rem;padding:2px 8px;cursor:pointer;">✕</button>
        </div>
        <div style="padding:14px 16px;">
            <div style="font-size:1.4rem;color:#ff4d6d;margin-bottom:6px;">${displayTitle}</div>
            <div style="font-size:1rem;color:#ccc;line-height:1.5;margin-bottom:12px;">${displayDesc}</div>
            <div style="font-size:0.85rem;color:#555;border-top:1px solid #2a0a14;padding-top:8px;">
                📍 ${locationData.lat.toFixed(4)}°, ${locationData.lon.toFixed(4)}°
            </div>
            <div style="margin-top:10px;">
                <span style="display:inline-block;border:1px solid #ff4d6d;color:#ff4d6d;
                    font-size:0.9rem;padding:3px 10px;letter-spacing:1px;">${visitedText}</span>
            </div>
        </div>
    `;

    panel.style.transform = 'translateX(100%)';
    panel.style.display = 'block';
    requestAnimationFrame(() => requestAnimationFrame(() => { panel.style.transform = 'translateX(0)'; }));
},

    closePopup: function() {
        const panel = document.getElementById('map-side-panel');
        if (!panel) return;
        panel.style.transform = 'translateX(100%)';
        setTimeout(() => { panel.style.display = 'none'; }, 320);
    },

    // ═══════════════════════════════════════════════════════════════
    // INTERACTION
    // ═══════════════════════════════════════════════════════════════
    setupInteraction: function(container) {
        let prev = { x:0, y:0 }, clickStart = { t:0, x:0, y:0 }, isPanning = false;

        container.addEventListener('wheel', (e) => {
            if (this.currentView === 'world') {
                e.preventDefault();
                this.targetZoom = Math.max(10, Math.min(25, this.targetZoom - e.deltaY * -0.01));
            }
        });
        container.addEventListener('mousedown', (e) => {
            this.isDraggingFlag = true; isPanning = false;
            clickStart = { t: Date.now(), x: e.clientX, y: e.clientY };
            prev = { x: e.offsetX, y: e.offsetY };
        });
        container.addEventListener('mouseup', (e) => {
            const dur  = Date.now() - clickStart.t;
            const dist = Math.hypot(e.clientX - clickStart.x, e.clientY - clickStart.y);
            if (dur < 300 && dist < 5 && !isPanning) this.checkPinClick(e, container);
            this.isDraggingFlag = false; isPanning = false;
        });
        container.addEventListener('mouseleave', () => { this.isDraggingFlag = false; isPanning = false; this.hideTooltip(); });
        container.addEventListener('mousemove', (e) => {
            if (this.isDraggingFlag) {
                const dx = e.offsetX - prev.x, dy = e.offsetY - prev.y;
                if (Math.abs(dx) > 2 || Math.abs(dy) > 2) isPanning = true;
                if (this.currentView === 'world') {
                    this.pivot.rotation.y += dx * 0.005;
                    this.pivot.rotation.x += dy * 0.005;
                } else {
                    this.camera.position.x = Math.max(-10, Math.min(10, this.camera.position.x - dx * 0.02));
                    this.camera.position.y = Math.max(-8,  Math.min(8,  this.camera.position.y + dy * 0.02));
                }
            }
            prev = { x: e.offsetX, y: e.offsetY };
            this.updateHover(e, container);
        });

        // Touch support
        let lastTouch = null;
        container.addEventListener('touchstart', (e) => {
            lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
        }, { passive: true });
        container.addEventListener('touchmove', (e) => {
            if (!lastTouch) return;
            const dx = e.touches[0].clientX - lastTouch.x;
            const dy = e.touches[0].clientY - lastTouch.y;
            if (this.currentView === 'world') {
                this.pivot.rotation.y += dx * 0.006;
                this.pivot.rotation.x += dy * 0.006;
            } else {
                this.camera.position.x = Math.max(-10, Math.min(10, this.camera.position.x - dx * 0.025));
                this.camera.position.y = Math.max(-8,  Math.min(8,  this.camera.position.y + dy * 0.025));
            }
            lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
        }, { passive: true });
        container.addEventListener('touchend', (e) => {
            if (lastTouch && Date.now() - lastTouch.t < 200) {
                const fakeEvent = { clientX: lastTouch.x, clientY: lastTouch.y };
                this.checkPinClick(fakeEvent, container);
            }
            lastTouch = null;
        });
    },

    checkPinClick: function(event, container) {
        const rect = container.getBoundingClientRect();
        this.mouse.x =  ((event.clientX - rect.left)  / rect.width)  * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top)    / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);

        if (this.currentView === 'world') {
            const hits = this.raycaster.intersectObjects(this.countryMeshes);
            if (hits.length) {
                const country = hits[0].object.userData.country;
                if (country === 'czechia')  this.transitionToView('czechia');
                if (country === 'capetown') this.transitionToView('capetown');
            }
        } else {
            const allObj = [...this.pins.map(p => p.mesh), ...this.countryMeshes];
            const hits = this.raycaster.intersectObjects(allObj);
            if (hits.length) {
                const obj = hits[0].object;
                if (obj.userData.isBackButton) { this.transitionToView('world'); return; }
                const clicked = this.pins.find(p => p.mesh === obj);
                if (clicked) this.showLocationPopup(clicked.data);
            }
        }
    },

    transitionToView: function(view) {
        const container = document.getElementById('map-container-inner');
        this.closePopup();
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            if (view === 'world')    this.showWorldView();
            else if (view === 'czechia')  this.showCzechiaView();
            else if (view === 'capetown') this.showCapeTownView();
            setTimeout(() => { container.style.opacity = '1'; }, 50);
        }, 300);
    },

    updateHover: function(event, container) {
        const rect = container.getBoundingClientRect();
        this.mouse.x =  ((event.clientX - rect.left)  / rect.width)  * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top)    / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Reset scales
        this.countryMeshes.forEach(m => { if (!m.userData.isBackButton) m.scale.set(1,1,1); });
        this.pins.forEach(p => { p.mesh.scale.set(1,1,1); if (p.ring) p.ring.scale.set(1,1,1); });

        const objs = this.currentView === 'world'
            ? this.countryMeshes
            : [...this.pins.map(p => p.mesh), ...this.countryMeshes];

        const hits = this.raycaster.intersectObjects(objs);
        if (hits.length) {
            container.style.cursor = 'pointer';
            const h = hits[0].object;
            if (!h.userData.isBackButton) h.scale.set(1.3, 1.3, 1.3);

            // Tooltip
            if (h.userData.country) {
                const name = h.userData.name || h.userData.country;
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                this.showTooltip(name, x, y);
            } else if (h.userData.locationData) {
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                this.showTooltip(h.userData.locationData.title, x, y);
            } else {
                this.hideTooltip();
            }
        } else {
            this.hideTooltip();
            container.style.cursor = this.currentView === 'world'
                ? (this.isDraggingFlag ? 'grabbing' : 'grab')
                : (this.isDraggingFlag ? 'grabbing' : 'move');
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // ANIMATION LOOP
    // ═══════════════════════════════════════════════════════════════
    animate: function() {
        const loop = () => {
            this.animationId = requestAnimationFrame(loop);
            const t = Date.now() * 0.001;

            // Smooth zoom
            this.currentZoom += (this.targetZoom - this.currentZoom) * this.zoomSpeed;
            this.camera.position.z = this.currentZoom;

            // Auto-rotate globe
            if (this.pivot && !this.isDraggingFlag && this.currentView === 'world' && this.currentZoom > 14) {
                this.pivot.rotation.y += 0.0025;
            }

            // Wireframe pulse
            if (this.wireSphere) {
                const s = 1 + Math.sin(t * 1.8) * 0.006;
                this.wireSphere.scale.set(s, s, s);
            }

            // City glow rings radiating outward
            this.glowRings.forEach((ring, i) => {
                const phase = ring.userData.glowPhase || 0;
                const wave  = (Math.sin(t * 2 + phase) + 1) / 2; // 0..1
                ring.material.opacity = wave * 0.6;
                const sc = 1 + wave * 0.6;
                ring.scale.set(sc, sc, sc);
            });

            // Arc pulse dot traveling along arc
            if (this.arcPulse && this.arcPoints.length > 1) {
                this.arcPulseT = (this.arcPulseT + 0.003) % 1;
                const idx = Math.floor(this.arcPulseT * (this.arcPoints.length - 1));
                const next = Math.min(idx + 1, this.arcPoints.length - 1);
                const frac = this.arcPulseT * (this.arcPoints.length - 1) - idx;
                const pos  = new THREE.Vector3().lerpVectors(this.arcPoints[idx], this.arcPoints[next], frac);
                this.arcPulse.position.copy(pos);
                // Pulse scale
                const ps = 1 + Math.sin(t * 6) * 0.3;
                this.arcPulse.scale.set(ps, ps, ps);
            }

            // Midpoint glow breathe
            this.pivot.children.forEach(child => {
                if (child.userData.isMidGlow) {
                    child.material.opacity = 0.15 + Math.sin(t * 2) * 0.12;
                }
                if (child.userData.heartIndex !== undefined) {
                    const p = Math.sin(t * 2 + child.userData.heartIndex * 0.5);
                    child.material.opacity = child.userData.baseOpacity + p * 0.25;
                }
            });

            // Pin pulses
            this.pins.forEach(pin => {
                const ps = 1 + Math.sin(t * 3 + pin.offset) * 0.15;
                if (pin.mesh.scale.x < 1.2) {
                    pin.mesh.scale.set(ps, ps, ps);
                    if (pin.ring) pin.ring.scale.set(ps, ps, ps);
                }
            });

            if (this.renderer && this.scene && this.camera)
                this.renderer.render(this.scene, this.camera);
        };
        loop();
    },

    // ═══════════════════════════════════════════════════════════════
    // UTILS
    // ═══════════════════════════════════════════════════════════════
    latLonToVector3: function(lat, lon, r) {
        const phi   = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
            -(r * Math.sin(phi) * Math.cos(theta)),
              r * Math.cos(phi),
              r * Math.sin(phi) * Math.sin(theta)
        );
    },

    latLonToCartesian: function(lat, lon, cLat, cLon, scale) {
        return { x: (lon - cLon) * scale, y: (lat - cLat) * scale };
    },

    clearScene: function() {
        while (this.pivot.children.length)  this.pivot.remove(this.pivot.children[0]);
        const toRemove = this.scene.children.filter(c => c !== this.pivot);
        toRemove.forEach(c => this.scene.remove(c));
        this.pins = []; this.countryMeshes = []; this.glowRings = [];
        this.wireSphere = null; this.arcPulse = null; this.arcPoints = [];
    },

    handleResize: function(container) {
        if (!this.renderer || !this.camera) return;
        const w = container.offsetWidth || 580, h = container.offsetHeight || 350;
        this.renderer.setSize(w, h);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    },

    cleanup: function() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.renderer) this.renderer.dispose();
        this.scene = this.camera = this.pivot = this.renderer = null;
        this.pins = []; this.countryMeshes = []; this.glowRings = [];
        this.arcPulse = null; this.arcPoints = [];
    }
};
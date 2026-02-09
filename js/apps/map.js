/* js/apps/map.js - RETRO VALENTINE'S 3D MAP */
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

    init: function() {
        console.log('🗺️ MAP.init() called');
        
        const container = document.getElementById('map-container-inner');
        if (!container) {
            console.error('❌ Map container not found!');
            return;
        }

        if (typeof THREE === 'undefined') {
            console.error('❌ THREE.js not loaded');
            container.innerHTML = "<p style='color:#ff4d6d; text-align:center; padding-top:20%; font-size:1.5rem;'>⚠ 3D ENGINE OFFLINE</p>";
            return;
        }

        try {
            this.setupScene(container);
            this.showWorldView();
            console.log('✅ Map initialized');
        } catch(error) {
            console.error('❌ Map failed:', error);
        }
    },

    setupScene: function(container) {
        container.innerHTML = ""; 
        
        this.scene = new THREE.Scene();
        
        const width = container.offsetWidth || 580;
        const height = container.offsetHeight || 350;
        
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.z = 16;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.pivot = new THREE.Group();
        this.scene.add(this.pivot);

        this.setupInteraction(container);
        this.animate();
        window.addEventListener('resize', () => this.handleResize(container));
    },

    // ==================== WORLD VIEW ====================
    showWorldView: function() {
        this.currentView = 'world';
        this.clearScene();
        
        const titleBar = document.querySelector('#win-map .window-bar span');
        if (titleBar) titleBar.innerText = "💕 LOVE MAP - Select Destination";

        // Reset camera to center (IMPORTANT!)
        this.camera.position.x = 0;
        this.camera.position.y = 0;

        this.addRetroGlobe();
        this.addHeartTrails();
        this.addCountryHighlights();
        
        this.targetZoom = 16;
        this.pivot.rotation.set(0, 0, 0);
    },

    addRetroGlobe: function() {
        // DARK CORE (Deep burgundy heart)
        const geoCore = new THREE.SphereGeometry(4.92, 24, 24);
        const matCore = new THREE.MeshBasicMaterial({ color: 0x2b0a12 });
        const coreSphere = new THREE.Mesh(geoCore, matCore);
        this.pivot.add(coreSphere);

        // PINK WIREFRAME (Low-poly retro aesthetic)
        const geoWire = new THREE.SphereGeometry(5, 16, 16); // Lower segments = more retro/blocky
        const matWire = new THREE.MeshBasicMaterial({ 
            color: 0xff4d6d,
            wireframe: true,
            transparent: true,
            opacity: 0.7
        });
        const wireSphere = new THREE.Mesh(geoWire, matWire);
        this.pivot.add(wireSphere);
        
        // Store for animation
        this.wireSphere = wireSphere;

        // Add stylized continents with HEART theme
        this.addStylizedContinents();
    },

    addStylizedContinents: function() {
        // Simplified, chunky continent shapes (retro game style)
        const continentData = [
            // AFRICA (includes Cape Town)
            {
                coords: [
                    [-35, 18], [-30, 22], [-18, 38], [-8, 42], [2, 38], 
                    [12, 42], [18, 32], [28, 32], [37, 22], [32, 12], 
                    [8, 8], [-12, 12], [-22, 8], [-35, 18]
                ],
                color: 0xff8fa3 // Light pink
            },
            // EUROPE (includes Czechia)
            {
                coords: [
                    [36, -8], [42, 2], [52, 12], [62, 18], [71, 22], 
                    [70, 32], [58, 42], [48, 36], [42, 18], [36, 2], [36, -8]
                ],
                color: 0xffb3c1 // Lighter pink
            },
            // ASIA (simplified)
            {
                coords: [
                    [70, 35], [65, 55], [55, 85], [45, 115], [35, 138],
                    [20, 140], [5, 125], [15, 95], [25, 75], [40, 55]
                ],
                color: 0xffc2d1 // Very light pink
            },
            // NORTH AMERICA
            {
                coords: [
                    [72, -165], [68, -135], [58, -115], [48, -95], 
                    [38, -85], [28, -88], [18, -98], [22, -115], [35, -130]
                ],
                color: 0xff8fa3
            },
            // SOUTH AMERICA
            {
                coords: [
                    [12, -78], [2, -72], [-12, -68], [-25, -68], 
                    [-38, -72], [-52, -70], [-48, -58], [-28, -48], 
                    [-8, -52], [5, -62], [12, -78]
                ],
                color: 0xffb3c1
            }
        ];

        continentData.forEach(continent => {
            const points = [];
            continent.coords.forEach(([lat, lon]) => {
                const pos = this.latLonToVector3(lat, lon, 5.05);
                points.push(pos);
            });
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ 
                color: continent.color,
                transparent: true,
                opacity: 0.6,
                linewidth: 2
            });
            const line = new THREE.Line(geometry, material);
            this.pivot.add(line);
        });
    },

    addHeartTrails: function() {
        // Add small floating hearts around the globe for extra romance
        const heartPositions = [
            [20, 45], [-15, 80], [50, -30], [-40, 120], [65, 0],
            [-25, -50], [35, 160], [-60, 25]
        ];

        heartPositions.forEach(([lat, lon], idx) => {
            const pos = this.latLonToVector3(lat, lon, 5.3);
            
            // Create small heart-shaped marker
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ff4d6d';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('♥', 16, 16);
            
            const texture = new THREE.CanvasTexture(canvas);
            const spriteMat = new THREE.SpriteMaterial({ 
                map: texture,
                transparent: true,
                opacity: 0.6
            });
            const sprite = new THREE.Sprite(spriteMat);
            sprite.position.copy(pos);
            sprite.scale.set(0.4, 0.4, 1);
            sprite.userData = { heartIndex: idx, baseOpacity: 0.6 };
            this.pivot.add(sprite);
        });
    },

    addCountryHighlights: function() {
        // CZECHIA MARKER - Glowing pink heart
        const czCenter = this.latLonToVector3(49.8, 15.5, 5.2);
        const czGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const czMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff4d6d,
            emissive: 0xff4d6d,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.95
        });
        const czMarker = new THREE.Mesh(czGeometry, czMaterial);
        czMarker.position.copy(czCenter);
        czMarker.userData = { country: 'czechia', name: 'Czechia 💕' };
        this.pivot.add(czMarker);
        this.countryMeshes.push(czMarker);

        // Pulsing ring
        const czRingGeo = new THREE.RingGeometry(0.4, 0.5, 32);
        const czRingMat = new THREE.MeshBasicMaterial({ 
            color: 0xff4d6d, 
            transparent: true, 
            opacity: 0.5, 
            side: THREE.DoubleSide 
        });
        const czRing = new THREE.Mesh(czRingGeo, czRingMat);
        czRing.position.copy(czCenter);
        czRing.lookAt(0, 0, 0);
        this.pivot.add(czRing);

        // CAPE TOWN MARKER - Glowing green/teal heart
        const saCenter = this.latLonToVector3(-33.9, 18.4, 5.2);
        const saGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const saMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ff88,
            emissive: 0x00ff88,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.95
        });
        const saMarker = new THREE.Mesh(saGeometry, saMaterial);
        saMarker.position.copy(saCenter);
        saMarker.userData = { country: 'capetown', name: 'Cape Town 💚' };
        this.pivot.add(saMarker);
        this.countryMeshes.push(saMarker);

        // Pulsing ring
        const saRingGeo = new THREE.RingGeometry(0.4, 0.5, 32);
        const saRingMat = new THREE.MeshBasicMaterial({ 
            color: 0x00ff88, 
            transparent: true, 
            opacity: 0.5, 
            side: THREE.DoubleSide 
        });
        const saRing = new THREE.Mesh(saRingGeo, saRingMat);
        saRing.position.copy(saCenter);
        saRing.lookAt(0, 0, 0);
        this.pivot.add(saRing);
    },

    // ==================== CZECHIA VIEW ====================
    showCzechiaView: function() {
        this.currentView = 'czechia';
        this.clearScene();
        
        const titleBar = document.querySelector('#win-map .window-bar span');
        if (titleBar) titleBar.innerText = "💕 CZECHIA - Our Adventures";

        // Reset camera to center
        this.camera.position.x = 0;
        this.camera.position.y = 0;

        this.createMapBackground();
        this.drawCzechiaShape();
        
        const czechiaPins = LORE.mapPoints.filter(pt => pt.color === 0xff4d6d);
        czechiaPins.forEach((pt, idx) => {
            this.addGeographicPin(pt, idx, 49.75, 15.5, 3.0); // BIGGER SCALE
        });

        this.addBackButton();
        this.targetZoom = 10;
    },

    drawCzechiaShape: function() {
        const border = [
            [51.05, 14.25], [50.95, 14.70], [50.85, 15.05], [50.88, 15.50],
            [50.87, 16.00], [50.85, 16.50], [50.88, 17.00], [50.87, 17.30],
            [50.68, 17.73], [50.45, 18.00], [50.25, 18.50], [50.10, 18.85],
            [49.85, 18.86], [49.60, 18.85], [49.35, 18.65], [49.10, 18.25],
            [48.95, 17.80], [48.85, 17.30], [48.78, 17.00], [48.73, 16.85],
            [48.68, 16.50], [48.62, 16.00], [48.60, 15.50], [48.65, 15.00],
            [48.70, 14.50], [48.75, 14.00], [48.80, 13.50], [48.88, 13.00],
            [49.00, 12.70], [49.15, 12.50], [49.35, 12.40], [49.55, 12.45],
            [49.75, 12.55], [49.95, 12.70], [50.15, 12.90], [50.35, 13.15],
            [50.50, 13.45], [50.65, 13.70], [50.80, 14.00], [51.05, 14.25]
        ];

        const points = [];
        border.forEach(([lat, lon]) => {
            points.push(this.latLonToCartesian(lat, lon, 49.75, 15.5, 3.0)); // BIGGER SCALE
        });

        const shape = new THREE.Shape();
        shape.moveTo(points[0].x, points[0].y);
        points.forEach(p => shape.lineTo(p.x, p.y));

        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xff4d6d,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        const lineGeo = new THREE.BufferGeometry().setFromPoints(
            points.map(p => new THREE.Vector3(p.x, p.y, 0.01))
        );
        const lineMat = new THREE.LineBasicMaterial({ color: 0xff4d6d, linewidth: 2 });
        const line = new THREE.Line(lineGeo, lineMat);
        this.scene.add(line);
    },

    // ==================== CAPE TOWN VIEW ====================
    showCapeTownView: function() {
        this.currentView = 'capetown';
        this.clearScene();
        
        const titleBar = document.querySelector('#win-map .window-bar span');
        if (titleBar) titleBar.innerText = "💚 CAPE TOWN - Our Paradise";

        // Reset camera to center
        this.camera.position.x = 0;
        this.camera.position.y = 0;

        this.createMapBackground();
        this.drawCapeTownRegion();
        
        const capeTownPins = LORE.mapPoints.filter(pt => pt.color === 0x00ff88 || pt.color === 0x0088ff);
        capeTownPins.forEach((pt, idx) => {
            this.addGeographicPin(pt, idx, -34.0, 18.44, 25.0); // MUCH BIGGER SCALE
        });

        this.addBackButton();
        this.targetZoom = 10;
    },

    drawCapeTownRegion: function() {
        const border = [
            [-33.70, 18.25], [-33.75, 18.30], [-33.85, 18.35], [-33.95, 18.38],
            [-34.05, 18.40], [-34.15, 18.43], [-34.22, 18.47], [-34.30, 18.50],
            [-34.35, 18.52], [-34.22, 18.58], [-34.15, 18.60], [-34.05, 18.57],
            [-33.95, 18.52], [-33.88, 18.47], [-33.80, 18.42], [-33.72, 18.35],
            [-33.70, 18.25]
        ];

        const points = [];
        border.forEach(([lat, lon]) => {
            points.push(this.latLonToCartesian(lat, lon, -34.0, 18.44, 25.0)); // BIGGER SCALE
        });

        const shape = new THREE.Shape();
        shape.moveTo(points[0].x, points[0].y);
        points.forEach(p => shape.lineTo(p.x, p.y));

        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ff88,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        const lineGeo = new THREE.BufferGeometry().setFromPoints(
            points.map(p => new THREE.Vector3(p.x, p.y, 0.01))
        );
        const lineMat = new THREE.LineBasicMaterial({ color: 0x00ff88, linewidth: 2 });
        const line = new THREE.Line(lineGeo, lineMat);
        this.scene.add(line);
    },

    // ==================== SHARED FUNCTIONS ====================
    createMapBackground: function() {
        const bgGeo = new THREE.PlaneGeometry(20, 15);
        const bgMat = new THREE.MeshBasicMaterial({ color: 0x1a0510 });
        const bg = new THREE.Mesh(bgGeo, bgMat);
        bg.position.z = -0.1;
        this.scene.add(bg);
    },

    addGeographicPin: function(locationData, index, centerLat, centerLon, scale) {
        const pos = this.latLonToCartesian(locationData.lat, locationData.lon, centerLat, centerLon, scale);
        
        // BIGGER Heart-shaped pin
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#' + locationData.color.toString(16).padStart(6, '0');
        ctx.font = 'bold 96px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('♥', 64, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        const geometry = new THREE.PlaneGeometry(0.6, 0.6); // BIGGER
        const material = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true,
            opacity: 0.95
        });
        const pin = new THREE.Mesh(geometry, material);
        pin.position.set(pos.x, pos.y, 0.05);
        this.scene.add(pin);

        // Add text label below pin
        const labelCanvas = document.createElement('canvas');
        labelCanvas.width = 256;
        labelCanvas.height = 64;
        const labelCtx = labelCanvas.getContext('2d');
        labelCtx.fillStyle = '#ffffff';
        labelCtx.strokeStyle = '#000000';
        labelCtx.lineWidth = 3;
        labelCtx.font = 'bold 28px VT323, monospace';
        labelCtx.textAlign = 'center';
        labelCtx.textBaseline = 'middle';
        
        // Outline
        labelCtx.strokeText(locationData.title, 128, 32);
        // Fill
        labelCtx.fillText(locationData.title, 128, 32);
        
        const labelTexture = new THREE.CanvasTexture(labelCanvas);
        const labelGeometry = new THREE.PlaneGeometry(2, 0.5);
        const labelMaterial = new THREE.MeshBasicMaterial({
            map: labelTexture,
            transparent: true,
            opacity: 0.9
        });
        const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
        labelMesh.position.set(pos.x, pos.y - 0.5, 0.04);
        this.scene.add(labelMesh);

        const ringGeo = new THREE.RingGeometry(0.35, 0.45, 32); // BIGGER
        const ringMat = new THREE.MeshBasicMaterial({
            color: locationData.color,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(pos.x, pos.y, 0.04);
        this.scene.add(ring);

        this.pins.push({
            mesh: pin,
            ring: ring,
            label: labelMesh,
            data: locationData,
            offset: index * 0.5
        });
    },

    addBackButton: function() {
        const btnGeo = new THREE.CircleGeometry(0.4, 32);
        const btnMat = new THREE.MeshBasicMaterial({ 
            color: 0xff4d6d,
            transparent: true,
            opacity: 0.3
        });
        const btn = new THREE.Mesh(btnGeo, btnMat);
        btn.position.set(-7, 5, 0.1);
        btn.userData = { isBackButton: true };
        this.scene.add(btn);
        this.countryMeshes.push(btn);

        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('←', 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const textGeo = new THREE.PlaneGeometry(0.6, 0.6);
        const textMat = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true
        });
        const textMesh = new THREE.Mesh(textGeo, textMat);
        textMesh.position.set(-7, 5, 0.11);
        textMesh.userData = { isBackButton: true };
        this.scene.add(textMesh);
        this.countryMeshes.push(textMesh);
    },

    latLonToCartesian: function(lat, lon, centerLat, centerLon, scale) {
        const x = (lon - centerLon) * scale;
        const y = (lat - centerLat) * scale;
        return { x, y };
    },

    setupInteraction: function(container) {
        let previousMousePosition = { x: 0, y: 0 };
        let clickStartTime = 0;
        let clickStartPos = { x: 0, y: 0 };
        let isPanning = false;

        container.addEventListener('wheel', (e) => {
            if (this.currentView === 'world') {
                e.preventDefault();
                const delta = e.deltaY * -0.01;
                this.targetZoom = Math.max(10, Math.min(25, this.targetZoom - delta));
            }
        });

        container.addEventListener('mousedown', (e) => {
            this.isDraggingFlag = true;
            isPanning = false;
            clickStartTime = Date.now();
            clickStartPos = { x: e.clientX, y: e.clientY };
            previousMousePosition = { x: e.offsetX, y: e.offsetY };
        });

        container.addEventListener('mouseup', (e) => {
            const clickDuration = Date.now() - clickStartTime;
            const clickDistance = Math.sqrt(
                Math.pow(e.clientX - clickStartPos.x, 2) + 
                Math.pow(e.clientY - clickStartPos.y, 2)
            );

            // Only register click if it was quick and didn't move much
            if (clickDuration < 300 && clickDistance < 5 && !isPanning) {
                this.checkPinClick(e, container);
            }

            this.isDraggingFlag = false;
            isPanning = false;
        });

        container.addEventListener('mouseleave', () => {
            this.isDraggingFlag = false;
            isPanning = false;
        });

        container.addEventListener('mousemove', (e) => {
            if (this.isDraggingFlag) {
                const deltaMove = {
                    x: e.offsetX - previousMousePosition.x,
                    y: e.offsetY - previousMousePosition.y
                };

                // If we moved more than a few pixels, it's a pan not a click
                if (Math.abs(deltaMove.x) > 2 || Math.abs(deltaMove.y) > 2) {
                    isPanning = true;
                }

                if (this.currentView === 'world' && this.pivot) {
                    // WORLD VIEW: Rotate the globe
                    this.pivot.rotation.y += deltaMove.x * 0.005;
                    this.pivot.rotation.x += deltaMove.y * 0.005;
                } else if (this.currentView !== 'world') {
                    // REGIONAL VIEW: Pan the camera
                    const panSpeed = 0.02;
                    this.camera.position.x -= deltaMove.x * panSpeed;
                    this.camera.position.y += deltaMove.y * panSpeed;
                    
                    // Limit panning (keep it reasonable)
                    this.camera.position.x = Math.max(-10, Math.min(10, this.camera.position.x));
                    this.camera.position.y = Math.max(-8, Math.min(8, this.camera.position.y));
                }
            }
            previousMousePosition = { x: e.offsetX, y: e.offsetY };
            this.updateHover(e, container);
        });
    },

    checkPinClick: function(event, container) {
        const rect = container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        if (this.currentView === 'world') {
            const intersects = this.raycaster.intersectObjects(this.countryMeshes);
            
            if (intersects.length > 0) {
                const country = intersects[0].object.userData.country;
                SYSTEM.playAudio('click-sound');
                
                if (country === 'czechia') {
                    this.transitionToView('czechia');
                } else if (country === 'capetown') {
                    this.transitionToView('capetown');
                }
            }
        } else {
            const allObjects = [...this.pins.map(p => p.mesh), ...this.countryMeshes];
            const intersects = this.raycaster.intersectObjects(allObjects);
            
            if (intersects.length > 0) {
                const clicked = intersects[0].object;
                
                if (clicked.userData.isBackButton) {
                    SYSTEM.playAudio('click-sound');
                    this.transitionToView('world');
                    return;
                }
                
                const clickedPin = this.pins.find(p => p.mesh === clicked);
                if (clickedPin) {
                    SYSTEM.playAudio('click-sound');
                    this.showLocationPopup(clickedPin.data);
                }
            }
        }
    },

    transitionToView: function(view) {
        const container = document.getElementById('map-container-inner');
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s';

        setTimeout(() => {
            if (view === 'world') {
                this.showWorldView();
            } else if (view === 'czechia') {
                this.showCzechiaView();
            } else if (view === 'capetown') {
                this.showCapeTownView();
            }
            
            setTimeout(() => {
                container.style.opacity = '1';
            }, 50);
        }, 300);
    },

    updateHover: function(event, container) {
        const rect = container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        this.countryMeshes.forEach(mesh => {
            if (!mesh.userData.isBackButton) {
                mesh.scale.set(1, 1, 1);
            }
        });
        this.pins.forEach(pin => {
            pin.mesh.scale.set(1, 1, 1);
            if (pin.ring) pin.ring.scale.set(1, 1, 1);
        });

        const allObjects = this.currentView === 'world' 
            ? this.countryMeshes 
            : [...this.pins.map(p => p.mesh), ...this.countryMeshes];

        const intersects = this.raycaster.intersectObjects(allObjects);

        if (intersects.length > 0) {
            container.style.cursor = 'pointer';
            const hovered = intersects[0].object;
            if (!hovered.userData.isBackButton) {
                hovered.scale.set(1.3, 1.3, 1.3);
            }
        } else {
            // Different cursors for different views
            if (this.currentView === 'world') {
                container.style.cursor = 'grab';
                if (this.isDraggingFlag) container.style.cursor = 'grabbing';
            } else {
                container.style.cursor = 'move'; // Pan cursor for regional views
                if (this.isDraggingFlag) container.style.cursor = 'grabbing';
            }
        }
    },

    showLocationPopup: function(locationData) {
        const popup = document.getElementById('map-popup') || this.createPopup();
        
        const hasImage = locationData.image && locationData.image !== "";
        
        popup.innerHTML = `
            <div class="popup-header">
                <h2>${locationData.title}</h2>
                <button onclick="MAP.closePopup()" class="popup-close">✕</button>
            </div>
            ${hasImage ? `<img src="${locationData.image}" alt="${locationData.title}" class="popup-image" onerror="this.style.display='none'">` : ''}
            <div class="popup-content">
                <p>${locationData.description}</p>
                <p style="font-size: 0.9rem; color: #999; margin-top: 10px;">
                    📍 ${locationData.lat.toFixed(4)}°, ${locationData.lon.toFixed(4)}°
                </p>
            </div>
            <div class="popup-footer">
                <button onclick="MAP.closePopup()" class="popup-btn">♥ Close</button>
            </div>
        `;
        
        popup.classList.remove('hidden');
    },

    createPopup: function() {
        const popup = document.createElement('div');
        popup.id = 'map-popup';
        popup.className = 'map-popup hidden';
        document.getElementById('win-map').appendChild(popup);
        return popup;
    },

    closePopup: function() {
        const popup = document.getElementById('map-popup');
        if (popup) popup.classList.add('hidden');
    },

    clearScene: function() {
        while(this.pivot.children.length > 0) {
            this.pivot.remove(this.pivot.children[0]);
        }
        
        while(this.scene.children.length > 1) {
            if (this.scene.children[this.scene.children.length - 1] !== this.pivot) {
                this.scene.remove(this.scene.children[this.scene.children.length - 1]);
            } else {
                break;
            }
        }
        
        this.pins = [];
        this.countryMeshes = [];
        this.wireSphere = null;
    },

    latLonToVector3: function(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = (radius * Math.sin(phi) * Math.sin(theta));
        const y = (radius * Math.cos(phi));

        return new THREE.Vector3(x, y, z);
    },

    animate: function() {
        const animateLoop = () => {
            this.animationId = requestAnimationFrame(animateLoop);
            
            // Smooth zoom
            this.currentZoom += (this.targetZoom - this.currentZoom) * this.zoomSpeed;
            this.camera.position.z = this.currentZoom;

            // Auto-rotate globe (FIXED - now works!)
            if(this.pivot && !this.isDraggingFlag && this.currentView === 'world' && this.currentZoom > 14) {
                this.pivot.rotation.y += 0.003; 
                this.pivot.rotation.x += 0.001;
            }

            const time = Date.now() * 0.001;
            
            // Pulse wireframe
            if (this.wireSphere) {
                const scale = 1 + Math.sin(time * 2) * 0.008;
                this.wireSphere.scale.set(scale, scale, scale);
            }
            
            // Pulse country markers
            if (this.currentView === 'world') {
                this.countryMeshes.forEach((mesh, idx) => {
                    if (!mesh.userData.isBackButton) {
                        const pulse = 1 + Math.sin(time * 2 + idx) * 0.12;
                        if (mesh.scale.x < 1.2) {
                            mesh.scale.set(pulse, pulse, pulse);
                        }
                    }
                });
                
                // Pulse floating hearts
                this.pivot.children.forEach(child => {
                    if (child.userData.heartIndex !== undefined) {
                        const pulse = Math.sin(time * 2 + child.userData.heartIndex * 0.5);
                        child.material.opacity = child.userData.baseOpacity + pulse * 0.3;
                    }
                });
            }
            
            // Pulse location pins
            this.pins.forEach(pin => {
                const pulse = 1 + Math.sin(time * 3 + pin.offset) * 0.15;
                if (pin.mesh.scale.x < 1.2) {
                    pin.mesh.scale.set(pulse, pulse, pulse);
                    if (pin.ring) pin.ring.scale.set(pulse, pulse, pulse);
                    if (pin.label) pin.label.scale.set(1, 1, 1); // Don't pulse labels
                }
            });

            if(this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        };
        animateLoop();
    },

    handleResize: function(container) {
        if(!this.renderer || !this.camera) return;
        
        const width = container.offsetWidth || 580;
        const height = container.offsetHeight || 350;
        
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    },

    cleanup: function() {
        if(this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if(this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        this.scene = null;
        this.camera = null;
        this.pivot = null;
        this.pins = [];
        this.countryMeshes = [];
    }
};
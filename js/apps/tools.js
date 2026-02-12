const TOOLS = {
    // We store 3D variables here so they don't get lost
    scene: null,
    camera: null,
    renderer: null,
    globe: null,

    init: function() {
        // Always render timeline and letters — they guard their own containers
        this.renderTimeline();
        this.renderLetters();
        // Always init terminal — it guards its own container
        if (typeof TERMINAL !== 'undefined') {
            TERMINAL.init();
        }
    },

    renderTimeline: function() {
        const c = document.getElementById('timeline-content');
        if(!c) return;
        c.innerHTML = "";
        LORE.timeline.forEach(i => {
            c.innerHTML += `<div class="timeline-item"><h3>${i.date}: ${i.title}</h3><p>${i.desc}</p></div>`;
        });
    },

    renderLetters: function() {
        const c = document.getElementById('letters-content');
        if(!c) return;
        c.innerHTML = "";
        LORE.letters.forEach(i => {
            const div = document.createElement('div');
            div.className = 'folder-item';
            div.innerHTML = `<span class="folder-icon">${i.icon}</span>${i.title}`;
            div.onclick = () => SYSTEM.openLightbox(null, i.content);
            c.appendChild(div);
        });
    },
    

    // --- THE NEW 3D MAP ENGINE ---
    renderMap: function() {
        const container = document.getElementById('map-container-inner');
        if (!container) return;

        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            container.innerHTML = "<p style='color:#ff4d6d; text-align:center; padding-top:20%'>ERROR: 3D ENGINE OFFLINE</p>";
            return;
        }

        // 1. Setup Scene (Pink Background)
        container.innerHTML = ""; 
        this.scene = new THREE.Scene();
        // No background color (transparent) to let the OS pink shine through

        this.camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        this.camera.position.z = 16; 

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(this.renderer.domElement);

        // 2. Create the "Retro Globe" Group
        const pivot = new THREE.Group();
        this.scene.add(pivot);

        // A. The Wireframe (Hot Pink Grid)
        const geoWire = new THREE.SphereGeometry(5, 24, 24); 
        const matWire = new THREE.MeshBasicMaterial({ 
            color: 0xff4d6d, // Hot Pink
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        const wireSphere = new THREE.Mesh(geoWire, matWire);
        pivot.add(wireSphere);

        // B. The Core (Deep Burgundy)
        // This makes the globe look solid so you don't see lines through the back
        const geoCore = new THREE.SphereGeometry(4.9, 24, 24); 
        const matCore = new THREE.MeshBasicMaterial({ 
            color: 0x2b0a12 // Dark Burgundy
        });
        const coreSphere = new THREE.Mesh(geoCore, matCore);
        pivot.add(coreSphere);

        // 3. Add Pins
        if(LORE.mapPoints) {
            LORE.mapPoints.forEach(pt => {
                // Math to convert Lat/Lon to 3D Coordinates
                const phi = (90 - pt.lat) * (Math.PI / 180);
                const theta = (pt.lon + 180) * (Math.PI / 180);
                const radius = 5; 

                const x = -(radius * Math.sin(phi) * Math.cos(theta));
                const z = (radius * Math.sin(phi) * Math.sin(theta));
                const y = (radius * Math.cos(phi));

                const pinGeo = new THREE.SphereGeometry(0.2, 8, 8);
                const pinMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White dots
                const pin = new THREE.Mesh(pinGeo, pinMat);
                
                pin.position.set(x, y, z);
                pivot.add(pin);
            });
        }

        // 4. Interaction (Spin with Mouse)
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        container.addEventListener('mousedown', () => isDragging = true);
        container.addEventListener('mouseup', () => isDragging = false);
        container.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaMove = {
                    x: e.offsetX - previousMousePosition.x,
                    y: e.offsetY - previousMousePosition.y
                };
                pivot.rotation.y += deltaMove.x * 0.005;
                pivot.rotation.x += deltaMove.y * 0.005;
            }
            previousMousePosition = { x: e.offsetX, y: e.offsetY };
        });

        // 5. Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Auto-Spin
            if(!isDragging) {
                pivot.rotation.y += 0.004; 
                pivot.rotation.x += 0.001; 
            }
            this.renderer.render(this.scene, this.camera);
        };
        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            const w = container.offsetWidth;
            const h = container.offsetHeight;
            this.renderer.setSize(w, h);
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
        });
    }
};
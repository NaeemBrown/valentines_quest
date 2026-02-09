/* CORE SYSTEM LOGIC */

const SYSTEM = {
    zIndex: 100,
    mapInitialized: false,
    browserInitialized: false, // Track if browser has been rendered

    boot: function() {
        // Build the pixel heart grid
        this.buildPixelHeart();
        
        const text = document.getElementById('boot-text');
        const progressBar = document.getElementById('boot-progress-bar');
        const progressText = document.getElementById('boot-progress-text');
        
        const lines = [
            "♥ INITIALIZING HEARTOS v3.0...",
            "► CHECKING SYSTEM INTEGRITY... OK",
            "► LOADING EMOTIONAL CORE... OK", 
            "► MOUNTING MEMORY DRIVES... OK",
            "► ESTABLISHING CONNECTION... OK",
            "► DECRYPTING VAULT... OK",
            "♥ SYSTEM READY - WELCOME BACK ♥"
        ];
        
        let delay = 0;
        const totalLines = lines.length;
        const stepDelay = 800; // Slower: 800ms per step instead of 500ms
        
        lines.forEach((line, index) => {
            delay += stepDelay;
            setTimeout(() => {
                // Add text line
                const p = document.createElement('p'); 
                p.innerText = line;
                p.style.animationDelay = '0s';
                if (index === 0 || index === lines.length - 1) {
                    p.style.color = '#ff4d6d';
                    p.style.fontWeight = 'bold';
                    p.style.textShadow = '0 0 20px #ff4d6d, 2px 2px 0px #000';
                }
                text.appendChild(p);
                
                // Update progress bar
                const progress = ((index + 1) / totalLines) * 100;
                progressBar.style.width = progress + '%';
                progressText.innerText = Math.round(progress) + '%';
                
                // Light up portions of the heart as we load
                this.lightUpHeartSection(index, totalLines);
                
                // Sound effect for each step
                if (index < lines.length - 1) {
                    this.playAudio('click-sound');
                }
            }, delay);
        });
        
        // Transition to login screen
        setTimeout(() => {
            this.playAudio('startup-sound');
            document.getElementById('boot-screen').classList.add('hidden');
            document.getElementById('login-screen').classList.remove('hidden');
        }, delay + 1500);
    },
    
    buildPixelHeart: function() {
        // 15x13 pixel heart pattern (1 = filled, 0 = empty)
        const heartPattern = [
            [0,0,1,1,1,0,0,0,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,0,1,1,1,1,1,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ];
        
        const grid = document.getElementById('pixel-heart-grid');
        grid.innerHTML = '';
        
        heartPattern.forEach(row => {
            row.forEach(cell => {
                const pixel = document.createElement('div');
                pixel.className = 'pixel';
                if (cell === 1) {
                    pixel.dataset.active = 'true';
                }
                grid.appendChild(pixel);
            });
        });
    },
    
    lightUpHeartSection: function(step, totalSteps) {
        const pixels = document.querySelectorAll('.pixel[data-active="true"]');
        const pixelsPerStep = Math.ceil(pixels.length / totalSteps);
        const startIdx = step * pixelsPerStep;
        const endIdx = Math.min(startIdx + pixelsPerStep, pixels.length);
        
        // Light up pixels in this section with slight random delay for cool effect
        for (let i = startIdx; i < endIdx; i++) {
            setTimeout(() => {
                if (pixels[i]) {
                    pixels[i].classList.add('active');
                    // Add extra glow to last few pixels of each section
                    if (i >= endIdx - 3) {
                        pixels[i].classList.add('glow');
                        setTimeout(() => pixels[i].classList.remove('glow'), 1000);
                    }
                }
            }, (i - startIdx) * 30); // Stagger the pixels slightly
        }
    },

    attemptLogin: function() {
        const pass = document.getElementById('password').value;
        if(pass === LORE.passcode) {
            this.playAudio('startup-sound');
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('desktop-screen').classList.remove('hidden');
            this.initDesktop();
        } else {
            this.playAudio('error-sound');
            const win = document.querySelector('#login-screen .os-window-box');
            win.classList.add('shake');
            setTimeout(() => win.classList.remove('shake'), 400);
        }
    },

    initDesktop: function() {
        document.getElementById('bgm').volume = 0.3;
        document.getElementById('bgm').play().catch(e=>{});
        
        setInterval(() => {
            document.getElementById('taskbar-clock').innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        }, 1000);

        this.setupDrag();
        this.setupStartMenu();
        
        BROWSER.init(); 
        
        try { GALLERY.init(); } catch(e) { console.error(e); }
        try { TOOLS.init(); } catch(e) { console.error(e); }
        try { MUSIC.init(); } catch(e) { console.error(e); }
        
        setTimeout(() => this.openApp('win-amp'), 800);
    },

    openApp: function(id) {
        const win = document.getElementById(id);
        win.classList.remove('hidden');
        win.style.zIndex = ++this.zIndex;
        this.playAudio('click-sound');

        // Initialize map when map window opens
        if(id === 'win-map' && !this.mapInitialized) {
            console.log('🗺️ Map window opened - initializing map...');
            setTimeout(() => {
                if(typeof MAP !== 'undefined') {
                    MAP.init();
                    this.mapInitialized = true;
                } else {
                    console.error('MAP object not found!');
                }
            }, 100);
        }

        // Initialize browser when browser window opens
        if(id === 'win-browser' && !this.browserInitialized) {
            console.log('🌐 Browser window opened - rendering browser...');
            setTimeout(() => {
                if(typeof BROWSER !== 'undefined') {
                    BROWSER.renderOnOpen();
                    this.browserInitialized = true;
                } else {
                    console.error('BROWSER object not found!');
                }
            }, 100);
        }
    },

    closeApp: function(id) {
        document.getElementById(id).classList.add('hidden');
    },

    playAudio: function(id) {
        const el = document.getElementById(id);
        if(el) { el.currentTime = 0; el.play().catch(e=>{}); }
    },

    setupDrag: function() {
        document.querySelectorAll('.app-window').forEach(win => {
            const bar = win.querySelector('.window-bar');
            let isDragging = false, startX, startY, initLeft, initTop;

            bar.addEventListener('mousedown', e => {
                if(e.target.tagName === 'BUTTON') return;
                isDragging = true;
                startX = e.clientX; startY = e.clientY;
                initLeft = win.offsetLeft; initTop = win.offsetTop;
                win.style.zIndex = ++this.zIndex;
            });

            window.addEventListener('mousemove', e => {
                if(!isDragging) return;
                win.style.left = (initLeft + (e.clientX - startX)) + "px";
                win.style.top = (initTop + (e.clientY - startY)) + "px";
            });

            window.addEventListener('mouseup', () => isDragging = false);
        });
    },

    setupStartMenu: function() {
        const btn = document.querySelector('.start-btn');
        const menu = document.getElementById('start-menu');
        btn.onclick = () => menu.classList.toggle('hidden');
        document.onclick = (e) => {
            if(!btn.contains(e.target) && !menu.contains(e.target)) menu.classList.add('hidden');
        }
    },

    openLightbox: function(url, caption, ext) {
        const box = document.getElementById('lightbox');
        const wrapper = document.getElementById('lightbox-content-wrapper');
        const cap = document.getElementById('lightbox-caption');
        
        wrapper.innerHTML = "";
        cap.innerHTML = caption;
        
        ext = ext || url.split('.').pop().toLowerCase();

        if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
            wrapper.innerHTML = `
                <video controls autoplay style="max-width: 90vw; max-height: 80vh; border: 5px solid #fff;">
                    <source src="${url}" type="video/${ext}">
                    Your browser does not support the video tag.
                </video>`;
                
        } else if (['mp3', 'wav'].includes(ext)) {
            wrapper.innerHTML = `
                <div style="background: #000; padding: 50px; border: 5px solid #fff; text-align: center;">
                    <div style="font-size: 5rem;">🎵</div>
                    <audio controls autoplay src="${url}" style="margin-top: 20px;"></audio>
                </div>`;
                
        } else {
            wrapper.innerHTML = `<img src="${url}" style="max-width: 90vw; max-height: 80vh; border: 5px solid #fff;">`;
        }

        box.classList.remove('hidden');
    },

    closeLightbox: function() {
        document.getElementById('lightbox').classList.add('hidden');
        document.getElementById('lightbox-content-wrapper').innerHTML = "";
    }
};
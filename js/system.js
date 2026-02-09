/* CORE SYSTEM LOGIC */

const SYSTEM = {
    zIndex: 100,
    mapInitialized: false, // Track if map has been initialized

    boot: function() {
        const text = document.getElementById('boot-text');
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
        lines.forEach((line, index) => {
            delay += 500;
            setTimeout(() => {
                const p = document.createElement('p'); 
                p.innerText = line;
                p.style.animationDelay = '0s';
                if (index === 0 || index === lines.length - 1) {
                    p.style.color = '#ff4d6d';
                    p.style.fontWeight = 'bold';
                    p.style.textShadow = '0 0 10px #ff4d6d';
                }
                text.appendChild(p);
            }, delay);
        });
        setTimeout(() => {
            document.getElementById('boot-screen').classList.add('hidden');
            document.getElementById('login-screen').classList.remove('hidden');
        }, delay + 1200);
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
    
    GALLERY.init();
    TOOLS.init();
    MUSIC.init();
    BROWSER.init();  // ← A

    
    setTimeout(() => this.openApp('win-amp'), 800);
    },

    openApp: function(id) {
        const win = document.getElementById(id);
        win.classList.remove('hidden');
        win.style.zIndex = ++this.zIndex;
        this.playAudio('click-sound');

        if(id === 'win-map' && !this.mapInitialized) {
            console.log('🗺️ Map window opened - initializing map...');
            // Small delay to ensure window is fully visible
            setTimeout(() => {
                if(typeof MAP !== 'undefined') {
                    MAP.init();
                    this.mapInitialized = true;
                } else {
                    console.error('MAP object not found!');
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
        
        wrapper.innerHTML = ""; // Clear previous
        cap.innerHTML = caption;
        
        // Clean extension check
        ext = ext || url.split('.').pop().toLowerCase();

        if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
            // RENDER VIDEO PLAYER
            wrapper.innerHTML = `
                <video controls autoplay style="max-width: 90vw; max-height: 80vh; border: 5px solid #fff;">
                    <source src="${url}" type="video/${ext}">
                    Your browser does not support the video tag.
                </video>`;
                
        } else if (['mp3', 'wav'].includes(ext)) {
            // RENDER AUDIO PLAYER
            wrapper.innerHTML = `
                <div style="background: #000; padding: 50px; border: 5px solid #fff; text-align: center;">
                    <div style="font-size: 5rem;">🎵</div>
                    <audio controls autoplay src="${url}" style="margin-top: 20px;"></audio>
                </div>`;
                
        } else {
            // RENDER IMAGE
            wrapper.innerHTML = `<img src="${url}" style="max-width: 90vw; max-height: 80vh; border: 5px solid #fff;">`;
        }

        box.classList.remove('hidden');
    },

    closeLightbox: function() {
        document.getElementById('lightbox').classList.add('hidden');
        document.getElementById('lightbox-content-wrapper').innerHTML = "";
    }
};
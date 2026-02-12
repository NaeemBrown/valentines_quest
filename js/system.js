/* CORE SYSTEM LOGIC */

const SYSTEM = {
    zIndex: 100,
    mapInitialized: false,
    browserInitialized: false,

    boot: function() {
        this.buildPixelHeart();
        
        const text = document.getElementById('boot-text');
        const progressBar = document.getElementById('boot-progress-bar');
        const progressText = document.getElementById('boot-progress-text');
        
        const lines = [
            "â™¥ INITIALIZING HEARTOS v3.0...",
            "â–º CHECKING SYSTEM INTEGRITY... OK",
            "â–º LOADING EMOTIONAL CORE... OK", 
            "â–º MOUNTING MEMORY DRIVES... OK",
            "â–º ESTABLISHING CONNECTION... OK",
            "â–º DECRYPTING VAULT... OK",
            "â™¥ SYSTEM READY - WELCOME BACK â™¥"
        ];
        
        let delay = 0;
        const totalLines = lines.length;
        const stepDelay = 800;
        
        lines.forEach((line, index) => {
            delay += stepDelay;
            setTimeout(() => {
                const p = document.createElement('p'); 
                p.innerText = line;
                p.style.animationDelay = '0s';
                if (index === 0 || index === lines.length - 1) {
                    p.style.color = '#ff4d6d';
                    p.style.fontWeight = 'bold';
                    p.style.textShadow = '0 0 20px #ff4d6d, 2px 2px 0px #000';
                }
                text.appendChild(p);
                
                const progress = ((index + 1) / totalLines) * 100;
                progressBar.style.width = progress + '%';
                progressText.innerText = Math.round(progress) + '%';
                
                this.lightUpHeartSection(index, totalLines);
                
                if (index < lines.length - 1) {
                    this.playAudio('click-sound');
                }
            }, delay);
        });
        
        setTimeout(() => {
            this.playAudio('startup-sound');
            document.getElementById('boot-screen').classList.add('hidden');
            document.getElementById('login-screen').classList.remove('hidden');
        }, delay + 1500);
    },
    
    buildPixelHeart: function() {
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
        
        for (let i = startIdx; i < endIdx; i++) {
            setTimeout(() => {
                if (pixels[i]) {
                    pixels[i].classList.add('active');
                    if (i >= endIdx - 3) {
                        pixels[i].classList.add('glow');
                        setTimeout(() => pixels[i].classList.remove('glow'), 1000);
                    }
                }
            }, (i - startIdx) * 30);
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

        // DESKTOP_MANAGER now handles dragging and resizing
        // this.setupDrag();
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
        
        // Let DESKTOP_MANAGER handle focus and z-index
        if (typeof DESKTOP_MANAGER !== 'undefined') {
            DESKTOP_MANAGER.focusWindow(id);
        } else {
            win.style.zIndex = ++this.zIndex;
        }
        
        this.playAudio('click-sound');

        if(id === 'win-map' && !this.mapInitialized) {
            console.log('ðŸ—ºï¸ Map window opened - initializing map...');
            setTimeout(() => {
                if(typeof MAP !== 'undefined') {
                    MAP.init();
                    this.mapInitialized = true;
                } else {
                    console.error('MAP object not found!');
                }
            }, 100);
        }

        if(id === 'win-browser' && !this.browserInitialized) {
            console.log('ðŸŒ Browser window opened - rendering browser...');
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
                
                let newLeft = initLeft + (e.clientX - startX);
                let newTop = initTop + (e.clientY - startY);
                
                // Get window dimensions
                const winWidth = win.offsetWidth;
                const winHeight = win.offsetHeight;
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight;
                
                // Constrain to screen boundaries
                // Left edge
                newLeft = Math.max(0, newLeft);
                // Right edge (ensure at least 100px of window is visible)
                newLeft = Math.min(screenWidth - 100, newLeft);
                // Top edge
                newTop = Math.max(0, newTop);
                // Bottom edge (account for taskbar - 40px)
                newTop = Math.min(screenHeight - 40 - 30, newTop); // Keep at least title bar visible
                
                win.style.left = newLeft + "px";
                win.style.top = newTop + "px";
            });

            window.addEventListener('mouseup', () => isDragging = false);
            
            // Add resize handles
            this.makeResizable(win);
        });
    },
    
    makeResizable: function(win) {
        const handles = [
            { pos: 'se', cursor: 'nwse-resize' },
            { pos: 'e', cursor: 'ew-resize' },
            { pos: 's', cursor: 'ns-resize' },
            { pos: 'sw', cursor: 'nesw-resize' },
            { pos: 'ne', cursor: 'nesw-resize' },
            { pos: 'nw', cursor: 'nwse-resize' }
        ];
        
        handles.forEach(handle => {
            const resizer = document.createElement('div');
            resizer.className = `resize-handle resize-${handle.pos}`;
            resizer.style.cursor = handle.cursor;
            win.appendChild(resizer);
            
            let isResizing = false;
            let startX, startY, startWidth, startHeight, startLeft, startTop;
            
            resizer.addEventListener('mousedown', e => {
                e.preventDefault();
                e.stopPropagation();
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = parseInt(getComputedStyle(win).width);
                startHeight = parseInt(getComputedStyle(win).height);
                startLeft = win.offsetLeft;
                startTop = win.offsetTop;
                win.style.zIndex = ++this.zIndex;
            });
            
            window.addEventListener('mousemove', e => {
                if (!isResizing) return;
                
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                const minWidth = 400;
                const minHeight = 300;
                
                // Get screen bounds
                const maxWidth = window.innerWidth - startLeft;
                const maxHeight = window.innerHeight - startTop - 40; // 40px for taskbar
                
                if (handle.pos.includes('e')) {
                    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX));
                    win.style.width = newWidth + 'px';
                }
                
                if (handle.pos.includes('s')) {
                    const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
                    win.style.height = newHeight + 'px';
                }
                
                if (handle.pos.includes('w')) {
                    const newWidth = Math.max(minWidth, startWidth - deltaX);
                    const newLeft = startLeft + deltaX;
                    
                    // Don't allow window to go off left edge
                    if (newWidth > minWidth && newLeft >= 0) {
                        win.style.width = newWidth + 'px';
                        win.style.left = newLeft + 'px';
                    }
                }
                
                if (handle.pos.includes('n')) {
                    const newHeight = Math.max(minHeight, startHeight - deltaY);
                    const newTop = startTop + deltaY;
                    
                    // Don't allow window to go off top edge
                    if (newHeight > minHeight && newTop >= 0) {
                        win.style.height = newHeight + 'px';
                        win.style.top = newTop + 'px';
                    }
                }
            });
            
            window.addEventListener('mouseup', () => {
                isResizing = false;
            });
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
        cap.innerHTML = caption || '';

        // Letters pass null url — show text content directly
        if (!url) {
            cap.innerHTML = '';
            wrapper.innerHTML = `<div style="background:#1a0510;border:2px solid #ff4d6d;padding:40px;max-width:520px;text-align:center;font-family:VT323,monospace;color:#fff;font-size:1.3rem;line-height:1.8;">${caption || ''}</div>`;
            box.classList.remove('hidden');
            return;
        }

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
                    <div style="font-size: 5rem;">ðŸŽµ</div>
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
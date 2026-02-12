/* CORE SYSTEM LOGIC */

const SYSTEM = {
    zIndex: 100,
    mapInitialized: false,
    browserInitialized: false,
    biosKeyListener: null,
    biosOpen: false,

    boot: function() {
        this.buildPixelHeart();
        this.showBiosHint();
        
        const text = document.getElementById('boot-text');
        const progressBar = document.getElementById('boot-progress-bar');
        const progressText = document.getElementById('boot-progress-text');
        
        // Safe I18N access with fallback
        const t = (key) => {
            if (typeof I18N !== 'undefined' && I18N.t) {
                return I18N.t(key);
            }
            // Fallback English text
            const fallbacks = {
                'boot_line1': '♥ INITIALIZING HEARTOS v3.0...',
                'boot_line2': '► CHECKING SYSTEM INTEGRITY... OK',
                'boot_line3': '► LOADING EMOTIONAL CORE... OK',
                'boot_line4': '► MOUNTING MEMORY DRIVES... OK',
                'boot_line5': '► ESTABLISHING CONNECTION... OK',
                'boot_line6': '► DECRYPTING VAULT... OK',
                'boot_line7': '♥ SYSTEM READY - WELCOME BACK ♥'
            };
            return fallbacks[key] || key;
        };

        const lines = [
            t('boot_line1'),
            t('boot_line2'),
            t('boot_line3'),
            t('boot_line4'),
            t('boot_line5'),
            t('boot_line6'),
            t('boot_line7')
        ];
        
        // Listen for DEL key to open BIOS
        this.biosKeyListener = (e) => {
            if (e.key === 'Delete' || e.key === 'Del') {
                e.preventDefault();
                this.openBios();
            }
        };
        document.addEventListener('keydown', this.biosKeyListener);
        
        let delay = 0;
        const totalLines = lines.length;
        const stepDelay = 800;
        
        lines.forEach((line, index) => {
            delay += stepDelay;
            setTimeout(() => {
                if (this.biosOpen) return;
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
        
        this.bootTimeout = setTimeout(() => {
            if (this.biosOpen) return;
            this.finishBoot();
        }, delay + 1500);
    },

    finishBoot: function() {
        // Remove BIOS key listener
        if (this.biosKeyListener) {
            document.removeEventListener('keydown', this.biosKeyListener);
            this.biosKeyListener = null;
        }
        // Remove BIOS hint
        const hint = document.getElementById('bios-hint');
        if (hint) hint.remove();

        this.playAudio('startup-sound');
        document.getElementById('boot-screen').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
        
        // Apply translations to login screen
        if (typeof I18N !== 'undefined') {
            I18N.applyToPage();
        }
    },

    showBiosHint: function() {
        const bootScreen = document.getElementById('boot-screen');
        // Remove old hint if exists
        const old = document.getElementById('bios-hint');
        if (old) old.remove();

        const t = (key) => {
            if (typeof I18N !== 'undefined' && I18N.t) {
                return I18N.t(key);
            }
            return 'Press DEL to enter BIOS Setup...';
        };

        const hint = document.createElement('div');
        hint.id = 'bios-hint';
        hint.style.cssText = 'position:absolute;bottom:30px;left:50%;transform:translateX(-50%);z-index:20;font-size:1.1rem;color:#ff8fa3;animation:biosBlink 1s infinite;text-align:center;';
        hint.textContent = t('boot_bios_hint');
        bootScreen.appendChild(hint);

        // Add blink animation if not already added
        if (!document.getElementById('bios-blink-style')) {
            const style = document.createElement('style');
            style.id = 'bios-blink-style';
            style.textContent = '@keyframes biosBlink { 0%,100%{opacity:1} 50%{opacity:0.3} }';
            document.head.appendChild(style);
        }
    },

    openBios: function() {
        this.biosOpen = true;
        
        // Stop boot
        if (this.bootTimeout) clearTimeout(this.bootTimeout);
        
        // Remove BIOS key listener
        if (this.biosKeyListener) {
            document.removeEventListener('keydown', this.biosKeyListener);
            this.biosKeyListener = null;
        }

        // Hide boot screen, show BIOS
        document.getElementById('boot-screen').classList.add('hidden');
        
        let biosScreen = document.getElementById('bios-screen');
        if (!biosScreen) {
            biosScreen = this.createBiosScreen();
            document.body.appendChild(biosScreen);
        }
        biosScreen.classList.remove('hidden');
        this.updateBiosDisplay();
    },

    createBiosScreen: function() {
        const t = (key) => {
            if (typeof I18N !== 'undefined' && I18N.t) {
                return I18N.t(key);
            }
            const fallbacks = {
                'bios_title': 'HeartOS BIOS Setup Utility',
                'bios_language': 'System Language',
                'bios_lang_label': 'Language:',
                'bios_english': 'English',
                'bios_czech': 'Čeština',
                'bios_nav': 'Use mouse to change settings',
                'bios_version': 'BIOS Version 3.0 ❤',
                'bios_continue': 'Continue Boot',
                'bios_save': 'Save & Exit'
            };
            return fallbacks[key] || key;
        };

        const currentLang = (typeof I18N !== 'undefined') ? I18N.currentLang : 'en';

        const screen = document.createElement('div');
        screen.id = 'bios-screen';
        screen.innerHTML = `
            <style>
                #bios-screen {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: #0000aa; color: #fff; font-family: 'VT323', monospace;
                    z-index: 100000; display: flex; flex-direction: column;
                    padding: 0; overflow: hidden;
                }
                .bios-header {
                    background: #aaaaaa; color: #0000aa; padding: 8px 20px;
                    font-size: 1.6rem; font-weight: bold; text-align: center;
                    border-bottom: 3px solid #fff;
                    text-shadow: none;
                }
                .bios-body {
                    flex: 1; display: flex; padding: 30px 40px; gap: 40px;
                }
                .bios-main {
                    flex: 1;
                }
                .bios-sidebar {
                    width: 280px; background: rgba(255,255,255,0.08);
                    border: 1px solid #5555ff; padding: 20px;
                }
                .bios-sidebar h3 {
                    color: #ffff55; margin: 0 0 15px 0; font-size: 1.3rem;
                    border-bottom: 1px solid #5555ff; padding-bottom: 8px;
                }
                .bios-sidebar p {
                    color: #aaaaaa; font-size: 1.1rem; line-height: 1.6; margin: 0;
                }
                .bios-section {
                    border: 2px solid #5555ff; margin-bottom: 25px; background: rgba(0,0,0,0.2);
                }
                .bios-section-title {
                    background: #5555ff; color: #fff; padding: 6px 15px;
                    font-size: 1.3rem; font-weight: bold;
                }
                .bios-row {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 12px 15px; border-bottom: 1px solid rgba(85,85,255,0.3);
                    font-size: 1.2rem;
                }
                .bios-row:last-child { border-bottom: none; }
                .bios-row-label { color: #aaaaaa; }
                .bios-row-value { color: #ffff55; font-weight: bold; }
                .bios-lang-option {
                    display: inline-block; padding: 8px 25px; margin: 0 8px;
                    cursor: pointer; font-size: 1.3rem; font-family: 'VT323', monospace;
                    border: 2px solid #5555ff; background: transparent; color: #aaaaaa;
                    transition: all 0.15s;
                }
                .bios-lang-option:hover {
                    background: #5555ff; color: #fff;
                }
                .bios-lang-option.active {
                    background: #ffff55; color: #0000aa; border-color: #ffff55;
                    font-weight: bold;
                }
                .bios-footer {
                    background: #aaaaaa; color: #0000aa; padding: 10px 20px;
                    display: flex; justify-content: space-between; align-items: center;
                    border-top: 3px solid #fff; font-size: 1.2rem;
                    text-shadow: none;
                }
                .bios-footer-btn {
                    background: #0000aa; color: #fff; border: 2px solid #fff;
                    padding: 8px 30px; font-family: 'VT323', monospace;
                    font-size: 1.3rem; cursor: pointer; transition: all 0.15s;
                }
                .bios-footer-btn:hover {
                    background: #5555ff; 
                }
                .bios-footer-btn.primary {
                    background: #ffff55; color: #0000aa; border-color: #ffff55;
                }
                .bios-footer-btn.primary:hover {
                    background: #fff; 
                }
                .bios-version-row {
                    color: #5555ff; font-size: 1.1rem; padding: 8px 15px;
                }
            </style>
            <div class="bios-header" id="bios-title-bar">${t('bios_title')}</div>
            <div class="bios-body">
                <div class="bios-main">
                    <div class="bios-section">
                        <div class="bios-section-title" id="bios-lang-section-title">${t('bios_language')}</div>
                        <div class="bios-row">
                            <span class="bios-row-label" id="bios-lang-label">${t('bios_lang_label')}</span>
                            <span>
                                <button class="bios-lang-option ${currentLang === 'en' ? 'active' : ''}" onclick="SYSTEM.setBiosLang('en')" id="bios-btn-en">${t('bios_english')}</button>
                                <button class="bios-lang-option ${currentLang === 'cs' ? 'active' : ''}" onclick="SYSTEM.setBiosLang('cs')" id="bios-btn-cs">${t('bios_czech')}</button>
                            </span>
                        </div>
                    </div>
                    <div class="bios-section">
                        <div class="bios-section-title">System Info</div>
                        <div class="bios-row"><span class="bios-row-label">OS:</span><span class="bios-row-value">HeartOS v3.0</span></div>
                        <div class="bios-row"><span class="bios-row-label">Build:</span><span class="bios-row-value">2024.12.28</span></div>
                        <div class="bios-row"><span class="bios-row-label">CPU:</span><span class="bios-row-value">LoveCore™ x2</span></div>
                        <div class="bios-row"><span class="bios-row-label">RAM:</span><span class="bios-row-value">∞ memories</span></div>
                        <div class="bios-row"><span class="bios-row-label">Storage:</span><span class="bios-row-value">1 full heart</span></div>
                    </div>
                </div>
                <div class="bios-sidebar">
                    <h3>Help</h3>
                    <p id="bios-help-text">${t('bios_nav')}</p>
                </div>
            </div>
            <div class="bios-footer">
                <span id="bios-version-label">${t('bios_version')}</span>
                <span>
                    <button class="bios-footer-btn" onclick="SYSTEM.closeBios(false)" id="bios-btn-continue">${t('bios_continue')}</button>
                    <button class="bios-footer-btn primary" onclick="SYSTEM.closeBios(true)" id="bios-btn-save">${t('bios_save')}</button>
                </span>
            </div>
        `;
        return screen;
    },

    setBiosLang: function(lang) {
        console.log('SYSTEM.setBiosLang called with:', lang);
        if (typeof I18N !== 'undefined') {
            console.log('I18N is defined, calling setLang');
            I18N.setLang(lang);
            console.log('Language changed to:', I18N.currentLang);
            this.updateBiosDisplay();
            
            // Dispatch event to notify all apps
            if (typeof dispatchLanguageChange === 'function') {
                dispatchLanguageChange();
            } else {
                window.dispatchEvent(new Event('languageChanged'));
            }
        } else {
            console.error('I18N is not defined!');
        }
    },

    updateBiosDisplay: function() {
        if (typeof I18N === 'undefined') return;
        
        // Update BIOS UI to reflect current language
        const titleBar = document.getElementById('bios-title-bar');
        if (titleBar) titleBar.textContent = I18N.t('bios_title');

        const langTitle = document.getElementById('bios-lang-section-title');
        if (langTitle) langTitle.textContent = I18N.t('bios_language');

        const langLabel = document.getElementById('bios-lang-label');
        if (langLabel) langLabel.textContent = I18N.t('bios_lang_label');

        const btnEn = document.getElementById('bios-btn-en');
        const btnCs = document.getElementById('bios-btn-cs');
        if (btnEn) {
            btnEn.textContent = I18N.t('bios_english');
            btnEn.className = 'bios-lang-option ' + (I18N.currentLang === 'en' ? 'active' : '');
        }
        if (btnCs) {
            btnCs.textContent = I18N.t('bios_czech');
            btnCs.className = 'bios-lang-option ' + (I18N.currentLang === 'cs' ? 'active' : '');
        }

        const helpText = document.getElementById('bios-help-text');
        if (helpText) helpText.textContent = I18N.t('bios_nav');

        const versionLabel = document.getElementById('bios-version-label');
        if (versionLabel) versionLabel.textContent = I18N.t('bios_version');

        const btnContinue = document.getElementById('bios-btn-continue');
        if (btnContinue) btnContinue.textContent = I18N.t('bios_continue');

        const btnSave = document.getElementById('bios-btn-save');
        if (btnSave) btnSave.textContent = I18N.t('bios_save');
    },

    closeBios: function(save) {
        if (save) {
            // Language already saved via setBiosLang -> I18N.setLang
        }
        
        const biosScreen = document.getElementById('bios-screen');
        if (biosScreen) biosScreen.classList.add('hidden');
        
        // Reset and restart boot
        this.biosOpen = false;
        const bootScreen = document.getElementById('boot-screen');
        bootScreen.classList.remove('hidden');
        document.getElementById('boot-text').innerHTML = '';
        document.getElementById('boot-progress-bar').style.width = '0%';
        document.getElementById('boot-progress-text').innerText = '0%';
        
        // Reset pixel heart
        document.querySelectorAll('.pixel').forEach(p => {
            p.classList.remove('active', 'glow');
        });
        
        this.boot();
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
        // Apply translations
        if (typeof I18N !== 'undefined') {
            I18N.applyToPage();
        }
        
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
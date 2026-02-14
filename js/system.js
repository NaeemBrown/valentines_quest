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
        
        const t = (key) => {
            if (typeof I18N !== 'undefined' && I18N.t) {
                return I18N.t(key);
            }
            const fallbacks = {
                'boot_line1': '\u2665 INITIALIZING HEARTOS v3.0...',
                'boot_line2': '\u25ba CHECKING SYSTEM INTEGRITY... OK',
                'boot_line3': '\u25ba LOADING EMOTIONAL CORE... OK',
                'boot_line4': '\u25ba MOUNTING MEMORY DRIVES... OK',
                'boot_line5': '\u25ba ESTABLISHING CONNECTION... OK',
                'boot_line6': '\u25ba DECRYPTING VAULT... OK',
                'boot_line7': '\u2665 SYSTEM READY - WELCOME BACK \u2665'
            };
            return fallbacks[key] || key;
        };

        const lines = [
            t('boot_line1'), t('boot_line2'), t('boot_line3'),
            t('boot_line4'), t('boot_line5'), t('boot_line6'), t('boot_line7')
        ];
        
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
        if (this.biosKeyListener) {
            document.removeEventListener('keydown', this.biosKeyListener);
            this.biosKeyListener = null;
        }
        const hint = document.getElementById('bios-hint');
        if (hint) hint.remove();

        this.playAudio('startup-sound');
        document.getElementById('boot-screen').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
        
        if (typeof I18N !== 'undefined') {
            I18N.applyToPage();
        }
    },

    showBiosHint: function() {
        const bootScreen = document.getElementById('boot-screen');
        const old = document.getElementById('bios-hint');
        if (old) old.remove();

        const t = (key) => {
            if (typeof I18N !== 'undefined' && I18N.t) return I18N.t(key);
            return 'Press DEL to enter BIOS Setup...';
        };

        const hint = document.createElement('div');
        hint.id = 'bios-hint';
        hint.style.cssText = 'position:absolute;bottom:30px;left:50%;transform:translateX(-50%);z-index:20;font-size:1.1rem;color:#ff8fa3;animation:biosBlink 1s infinite;text-align:center;';
        hint.textContent = t('boot_bios_hint');
        bootScreen.appendChild(hint);

        if (!document.getElementById('bios-blink-style')) {
            const style = document.createElement('style');
            style.id = 'bios-blink-style';
            style.textContent = '@keyframes biosBlink { 0%,100%{opacity:1} 50%{opacity:0.3} }';
            document.head.appendChild(style);
        }
    },

    openBios: function() {
        this.biosOpen = true;
        if (this.bootTimeout) clearTimeout(this.bootTimeout);
        if (this.biosKeyListener) {
            document.removeEventListener('keydown', this.biosKeyListener);
            this.biosKeyListener = null;
        }

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
            if (typeof I18N !== 'undefined' && I18N.t) return I18N.t(key);
            const fallbacks = {
                'bios_title': 'HeartOS BIOS Setup Utility',
                'bios_language': 'System Language',
                'bios_lang_label': 'Language:',
                'bios_english': 'English',
                'bios_czech': '\u010ce\u0161tina',
                'bios_nav': 'Use mouse to change settings',
                'bios_version': 'BIOS Version 3.0 \u2764',
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
                @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

                #bios-screen {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: #050510; color: #c0c0ff;
                    font-family: 'Share Tech Mono', 'VT323', monospace;
                    z-index: 100000; display: flex; flex-direction: column;
                    padding: 0; overflow: hidden;
                }
                /* CRT Scanlines */
                #bios-screen::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    background: repeating-linear-gradient(
                        0deg, transparent, transparent 2px,
                        rgba(0, 0, 0, 0.15) 2px, rgba(0, 0, 0, 0.15) 4px
                    );
                    pointer-events: none; z-index: 10;
                }
                /* CRT vignette */
                #bios-screen::after {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%);
                    pointer-events: none; z-index: 11;
                }
                .bios-bg-grid {
                    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    background-image: 
                        linear-gradient(rgba(255, 77, 109, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 77, 109, 0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                    animation: gridPulse 4s ease-in-out infinite;
                }
                @keyframes gridPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }

                .bios-header {
                    position: relative; z-index: 5;
                    background: linear-gradient(90deg, #1a0020 0%, #0d0030 50%, #1a0020 100%);
                    padding: 12px 30px;
                    font-size: 1.4rem; font-weight: bold; text-align: center;
                    border-bottom: 2px solid #ff4d6d;
                    color: #ff4d6d;
                    text-shadow: 0 0 10px #ff4d6d, 0 0 30px rgba(255,77,109,0.3);
                    letter-spacing: 4px; text-transform: uppercase;
                    display: flex; align-items: center; justify-content: center; gap: 15px;
                }
                .bios-header-heart {
                    display: inline-block; animation: heartPulse 1.2s ease-in-out infinite; font-size: 1.2rem;
                }
                @keyframes heartPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); } }

                .bios-body {
                    position: relative; z-index: 5;
                    flex: 1; display: flex; padding: 25px 35px; gap: 30px; overflow-y: auto;
                }
                .bios-main { flex: 1; display: flex; flex-direction: column; gap: 20px; }

                .bios-section {
                    border: 1px solid rgba(255, 77, 109, 0.3);
                    background: rgba(10, 5, 25, 0.8);
                    overflow: hidden;
                    animation: sectionFadeIn 0.5s ease forwards; opacity: 0;
                }
                .bios-section:nth-child(1) { animation-delay: 0.1s; }
                .bios-section:nth-child(2) { animation-delay: 0.3s; }
                @keyframes sectionFadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .bios-section-title {
                    background: linear-gradient(90deg, rgba(255, 77, 109, 0.2), transparent);
                    color: #ff4d6d; padding: 8px 18px;
                    font-size: 1.1rem; font-weight: bold;
                    border-bottom: 1px solid rgba(255, 77, 109, 0.2);
                    letter-spacing: 2px; text-transform: uppercase;
                    display: flex; align-items: center; gap: 10px;
                }
                .bios-section-title::before {
                    content: '>'; color: #ff8fa3; animation: blink 1s step-end infinite;
                }
                @keyframes blink { 50% { opacity: 0; } }

                .bios-row {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 10px 18px; border-bottom: 1px solid rgba(255, 77, 109, 0.07);
                    font-size: 1.05rem; transition: background 0.2s;
                }
                .bios-row:hover { background: rgba(255, 77, 109, 0.05); }
                .bios-row:last-child { border-bottom: none; }
                .bios-row-label { color: #8888bb; }
                .bios-row-value {
                    color: #ff8fa3; font-weight: bold;
                    text-shadow: 0 0 8px rgba(255, 143, 163, 0.4);
                }

                .bios-lang-option {
                    display: inline-block; padding: 8px 28px; margin: 0 6px;
                    cursor: pointer; font-size: 1.1rem;
                    font-family: 'Share Tech Mono', 'VT323', monospace;
                    border: 1px solid rgba(255, 77, 109, 0.3);
                    background: transparent; color: #8888bb;
                    transition: all 0.25s ease; position: relative; letter-spacing: 1px;
                }
                .bios-lang-option::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(135deg, rgba(255,77,109,0.1), transparent);
                    opacity: 0; transition: opacity 0.25s;
                }
                .bios-lang-option:hover {
                    border-color: #ff4d6d; color: #ff8fa3;
                    box-shadow: 0 0 15px rgba(255, 77, 109, 0.2), inset 0 0 15px rgba(255, 77, 109, 0.05);
                }
                .bios-lang-option:hover::before { opacity: 1; }
                .bios-lang-option.active {
                    background: linear-gradient(135deg, rgba(255, 77, 109, 0.25), rgba(255, 77, 109, 0.1));
                    color: #ff4d6d; border-color: #ff4d6d;
                    box-shadow: 0 0 20px rgba(255, 77, 109, 0.3), inset 0 0 20px rgba(255, 77, 109, 0.08);
                    font-weight: bold; text-shadow: 0 0 10px rgba(255, 77, 109, 0.5);
                }

                .bios-sidebar {
                    width: 260px;
                    background: rgba(10, 5, 25, 0.6);
                    border: 1px solid rgba(255, 77, 109, 0.15);
                    padding: 20px; display: flex; flex-direction: column; gap: 20px;
                    animation: sectionFadeIn 0.5s ease 0.5s forwards; opacity: 0;
                }
                .bios-sidebar h3 {
                    color: #ff4d6d; margin: 0; font-size: 1.1rem;
                    border-bottom: 1px solid rgba(255, 77, 109, 0.2); padding-bottom: 10px;
                    letter-spacing: 2px; text-transform: uppercase;
                }
                .bios-sidebar p { color: #6666aa; font-size: 0.95rem; line-height: 1.7; margin: 0; }

                .bios-ascii-art {
                    color: #ff4d6d; font-size: 0.65rem; line-height: 1.1;
                    white-space: pre; text-align: center;
                    text-shadow: 0 0 10px rgba(255, 77, 109, 0.5);
                    animation: asciiGlow 2s ease-in-out infinite; margin-top: auto;
                }
                @keyframes asciiGlow {
                    0%, 100% { opacity: 0.7; filter: brightness(1); }
                    50% { opacity: 1; filter: brightness(1.3); }
                }

                .bios-status-line {
                    color: #44cc44; font-size: 0.85rem; padding: 3px 0;
                    animation: statusType 0.3s ease forwards; opacity: 0;
                }
                .bios-status-line:nth-child(1) { animation-delay: 0.8s; }
                .bios-status-line:nth-child(2) { animation-delay: 1.1s; }
                .bios-status-line:nth-child(3) { animation-delay: 1.4s; }
                .bios-status-line:nth-child(4) { animation-delay: 1.7s; }
                @keyframes statusType {
                    from { opacity: 0; transform: translateX(-5px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .bios-footer {
                    position: relative; z-index: 5;
                    background: linear-gradient(90deg, #1a0020 0%, #0d0030 50%, #1a0020 100%);
                    padding: 12px 30px;
                    display: flex; justify-content: space-between; align-items: center;
                    border-top: 2px solid #ff4d6d; font-size: 1rem;
                }
                .bios-footer-version { color: #555580; letter-spacing: 1px; }
                .bios-footer-btn {
                    background: transparent;
                    color: #8888bb; border: 1px solid rgba(255, 77, 109, 0.3);
                    padding: 8px 28px; font-family: 'Share Tech Mono', 'VT323', monospace;
                    font-size: 1.05rem; cursor: pointer; transition: all 0.25s;
                    letter-spacing: 1px; margin-left: 10px;
                }
                .bios-footer-btn:hover {
                    color: #ff8fa3; border-color: #ff4d6d;
                    box-shadow: 0 0 15px rgba(255, 77, 109, 0.2);
                }
                .bios-footer-btn.primary {
                    background: linear-gradient(135deg, rgba(255, 77, 109, 0.2), rgba(255, 77, 109, 0.1));
                    color: #ff4d6d; border-color: #ff4d6d;
                    text-shadow: 0 0 8px rgba(255, 77, 109, 0.4);
                }
                .bios-footer-btn.primary:hover {
                    background: linear-gradient(135deg, rgba(255, 77, 109, 0.35), rgba(255, 77, 109, 0.15));
                    box-shadow: 0 0 25px rgba(255, 77, 109, 0.3);
                }
                .bios-flicker { animation: crtFlicker 0.15s linear; }
                @keyframes crtFlicker {
                    0% { opacity: 0; } 10% { opacity: 1; } 20% { opacity: 0.3; }
                    30% { opacity: 1; } 40% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 1; }
                }
            </style>
            <div class="bios-bg-grid"></div>
            <div class="bios-header bios-flicker">
                <span class="bios-header-heart">\u2665</span>
                <span id="bios-title-bar">${t('bios_title')}</span>
                <span class="bios-header-heart">\u2665</span>
            </div>
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
                        <div class="bios-row"><span class="bios-row-label">Build:</span><span class="bios-row-value">2025.02.14</span></div>
                        <div class="bios-row"><span class="bios-row-label">CPU:</span><span class="bios-row-value">LoveCore\u2122 x2</span></div>
                        <div class="bios-row"><span class="bios-row-label">RAM:</span><span class="bios-row-value">\u221E memories</span></div>
                        <div class="bios-row"><span class="bios-row-label">Storage:</span><span class="bios-row-value">1 full heart</span></div>
                        <div class="bios-row"><span class="bios-row-label">Network:</span><span class="bios-row-value">CPT \u2194 PRG [linked]</span></div>
                        <div class="bios-row"><span class="bios-row-label">Uptime:</span><span class="bios-row-value" id="bios-uptime">calculating...</span></div>
                    </div>
                </div>
                <div class="bios-sidebar">
                    <h3>\u25b6 Status</h3>
                    <div>
                        <div class="bios-status-line">[OK] Emotional core online</div>
                        <div class="bios-status-line">[OK] Memory vault mounted</div>
                        <div class="bios-status-line">[OK] Heart sync active</div>
                        <div class="bios-status-line">[OK] Love.dll loaded</div>
                    </div>
                    <h3>Help</h3>
                    <p id="bios-help-text">${t('bios_nav')}</p>
                    <div class="bios-ascii-art">
  .:::.   .:::.
 :::::::.:::::::
 :::::::::::::::
 ':::::::::::'
   ':::::::'
     ':::'
      ':'</div>
                </div>
            </div>
            <div class="bios-footer">
                <span class="bios-footer-version" id="bios-version-label">${t('bios_version')}</span>
                <span>
                    <button class="bios-footer-btn" onclick="SYSTEM.closeBios(false)" id="bios-btn-continue">${t('bios_continue')}</button>
                    <button class="bios-footer-btn primary" onclick="SYSTEM.closeBios(true)" id="bios-btn-save">${t('bios_save')}</button>
                </span>
            </div>
        `;

        // Calculate uptime
        setTimeout(() => {
            const uptimeEl = screen.querySelector('#bios-uptime');
            if (uptimeEl) {
                const start = new Date('2024-01-01');
                const now = new Date();
                const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
                uptimeEl.textContent = days + ' days \u2665';
            }
        }, 200);

        return screen;
    },

    setBiosLang: function(lang) {
        if (typeof I18N !== 'undefined') {
            I18N.setLang(lang);
            this.updateBiosDisplay();
            if (typeof dispatchLanguageChange === 'function') {
                dispatchLanguageChange();
            } else {
                window.dispatchEvent(new Event('languageChanged'));
            }
        }
    },

    updateBiosDisplay: function() {
        if (typeof I18N === 'undefined') return;
        
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
        const biosScreen = document.getElementById('bios-screen');
        if (biosScreen) biosScreen.classList.add('hidden');
        
        this.biosOpen = false;
        const bootScreen = document.getElementById('boot-screen');
        bootScreen.classList.remove('hidden');
        document.getElementById('boot-text').innerHTML = '';
        document.getElementById('boot-progress-bar').style.width = '0%';
        document.getElementById('boot-progress-text').innerText = '0%';
        
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
                if (cell === 1) pixel.dataset.active = 'true';
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
if (window.ACHIEVEMENTS) ACHIEVEMENTS.mark('login');
        } else {
            this.playAudio('error-sound');
            const win = document.querySelector('#login-screen .os-window-box');
            win.classList.add('shake');
            setTimeout(() => win.classList.remove('shake'), 400);
        }
    },

    initDesktop: function() {
        if (typeof I18N !== 'undefined') I18N.applyToPage();
        
        document.getElementById('bgm').volume = 0.3;
        document.getElementById('bgm').play().catch(e=>{});
        
        setInterval(() => {
            document.getElementById('taskbar-clock').innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        }, 1000);

        this.setupStartMenu();
        
        BROWSER.init(); 
        
        try { GALLERY.init(); } catch(e) { console.error(e); }
        try { TOOLS.init(); } catch(e) { console.error(e); }
        try { MUSIC.init(); } catch(e) { console.error(e); }
        
        window.addEventListener('secretsUnlocked', () => {
            const badge = document.getElementById('secrets-lock-badge');
            if (badge) badge.style.display = 'none';if (window.ACHIEVEMENTS) ACHIEVEMENTS.mark('unlock_secrets');
        });
        
        setTimeout(() => this.openApp('win-amp'), 800);
         this.enableAppScrolling();

    },

    openApp: function(id) {
        if (id === 'win-letters') {
            const unlocked = !!(window.HEARTOS_FLAGS && window.HEARTOS_FLAGS.secretsUnlocked);
            if (!unlocked) {
                this.playAudio('error-sound');
                this.showLockedToast();
                return;
            }
        }

        const win = document.getElementById(id);
        win.classList.remove('hidden');
        
        if (typeof DESKTOP_MANAGER !== 'undefined') {
            DESKTOP_MANAGER.focusWindow(id);
        } else {
            win.style.zIndex = ++this.zIndex;
        }
        
        this.playAudio('click-sound');

        if(id === 'win-map' && !this.mapInitialized) {
            setTimeout(() => {
                if(typeof MAP !== 'undefined') { MAP.init(); this.mapInitialized = true; }
            }, 100);
        }

        if(id === 'win-browser' && !this.browserInitialized) {
            setTimeout(() => {
                if(typeof BROWSER !== 'undefined') { BROWSER.renderOnOpen(); this.browserInitialized = true; }
            }, 100);
        }

        if (id === 'win-videoplayer') {
            if (typeof VIDEOPLAYER !== 'undefined' && !VIDEOPLAYER._initialized) {
                VIDEOPLAYER.init();
            }
        }

        if (window.ACHIEVEMENTS) {
    const map = {
        'win-amp': 'open_heartamp',
        'win-quiz': 'open_terminal',
        'win-map': 'open_map',
        'win-videoplayer': 'open_message',
        'win-browser': 'open_browser',
        'win-gallery': 'open_photos',
        'win-timeline': 'open_achievements'
    };
    if (map[id]) ACHIEVEMENTS.mark(map[id]);
    }

    },

    closeApp: function(id) {
        document.getElementById(id).classList.add('hidden');
    },

    enableAppScrolling: function() {
        if (document.getElementById('heartos-scroll-fix')) return;

        const style = document.createElement('style');
        style.id = 'heartos-scroll-fix';
        style.textContent = `
            .window-content-scroll {
                overflow-y: auto !important;
                overflow-x: hidden !important;
                max-height: calc(100% - 30px) !important;
                -webkit-overflow-scrolling: touch;
            }
        `;
        document.head.appendChild(style);
    },

    showLockedToast: function() {
        const old = document.getElementById('locked-toast');
        if (old) old.remove();

        const t = (typeof I18N !== 'undefined' && I18N.t)
            ? I18N.t('secrets_locked') 
            : '\uD83D\uDD12 Complete the Terminal mission first';

        const toast = document.createElement('div');
        toast.id = 'locked-toast';
        toast.textContent = t;
        toast.style.cssText = `
            position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.9); color: #ff4d6d; border: 1px solid #ff4d6d;
            padding: 10px 24px; font-family: 'VT323', monospace; font-size: 1.1rem;
            z-index: 999999; pointer-events: none; animation: toastFade 2.5s ease forwards;
        `;
        document.body.appendChild(toast);

        if (!document.getElementById('toast-fade-style')) {
            const style = document.createElement('style');
            style.id = 'toast-fade-style';
            style.textContent = `
                @keyframes toastFade {
                    0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
                    15% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    75% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => toast.remove(), 2600);
        
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
                newLeft = Math.max(0, Math.min(window.innerWidth - 100, newLeft));
                newTop = Math.max(0, Math.min(window.innerHeight - 70, newTop));
                win.style.left = newLeft + "px";
                win.style.top = newTop + "px";
            });

            window.addEventListener('mouseup', () => isDragging = false);
            this.makeResizable(win);
        });
    },
    
    makeResizable: function(win) {
        const handles = [
            { pos: 'se', cursor: 'nwse-resize' }, { pos: 'e', cursor: 'ew-resize' },
            { pos: 's', cursor: 'ns-resize' }, { pos: 'sw', cursor: 'nesw-resize' },
            { pos: 'ne', cursor: 'nesw-resize' }, { pos: 'nw', cursor: 'nwse-resize' }
        ];
        
        handles.forEach(handle => {
            const resizer = document.createElement('div');
            resizer.className = `resize-handle resize-${handle.pos}`;
            resizer.style.cursor = handle.cursor;
            win.appendChild(resizer);
            
            let isResizing = false;
            let startX, startY, startWidth, startHeight, startLeft, startTop;
            
            resizer.addEventListener('mousedown', e => {
                e.preventDefault(); e.stopPropagation();
                isResizing = true;
                startX = e.clientX; startY = e.clientY;
                startWidth = parseInt(getComputedStyle(win).width);
                startHeight = parseInt(getComputedStyle(win).height);
                startLeft = win.offsetLeft; startTop = win.offsetTop;
                win.style.zIndex = ++this.zIndex;
            });
            
            window.addEventListener('mousemove', e => {
                if (!isResizing) return;
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                const minW = 400, minH = 300;
                const maxW = window.innerWidth - startLeft;
                const maxH = window.innerHeight - startTop - 40;
                
                if (handle.pos.includes('e')) win.style.width = Math.max(minW, Math.min(maxW, startWidth + deltaX)) + 'px';
                if (handle.pos.includes('s')) win.style.height = Math.max(minH, Math.min(maxH, startHeight + deltaY)) + 'px';
                if (handle.pos.includes('w')) {
                    const nw = Math.max(minW, startWidth - deltaX);
                    const nl = startLeft + deltaX;
                    if (nw > minW && nl >= 0) { win.style.width = nw + 'px'; win.style.left = nl + 'px'; }
                }
                if (handle.pos.includes('n')) {
                    const nh = Math.max(minH, startHeight - deltaY);
                    const nt = startTop + deltaY;
                    if (nh > minH && nt >= 0) { win.style.height = nh + 'px'; win.style.top = nt + 'px'; }
                }
            });
            
            window.addEventListener('mouseup', () => isResizing = false);
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
            wrapper.innerHTML = `<video controls autoplay style="max-width: 90vw; max-height: 80vh; border: 5px solid #fff;"><source src="${url}" type="video/${ext}"></video>`;
        } else if (['mp3', 'wav'].includes(ext)) {
            wrapper.innerHTML = `<div style="background: #000; padding: 50px; border: 5px solid #fff; text-align: center;"><div style="font-size: 5rem;">\uD83C\uDFB5</div><audio controls autoplay src="${url}" style="margin-top: 20px;"></audio></div>`;
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
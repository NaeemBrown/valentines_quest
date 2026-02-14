/* HEARTOS BIOS - COMPLETE I18N VERSION WITH ALL TABS */
/* Place this AFTER system.js in your HTML */

const BIOS_ENHANCEMENTS = {
    
    settings: {
        bootAnimation: true,
        crtEffect: true,
        soundEnabled: true,
        bootDelay: 'normal',
        theme: 'classic',
        particleEffects: true,
        screenSaver: true,
        autoLogin: false,
        quickBoot: false,
        bootLogo: true,
        verboseMode: false,
        cpuThrottle: 'balanced',
        memoryMode: 'auto',
        networkMode: 'always',
        crtIntensity: 'medium',
        scanlines: true,
        vignette: true,
        glowEffect: true,
        refreshRate: '60Hz',
        colorMode: 'retro'
    },

    loadSettings: function() {
        const saved = localStorage.getItem('heartos_bios_settings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch(e) {}
        }
    },

    saveSettings: function() {
        localStorage.setItem('heartos_bios_settings', JSON.stringify(this.settings));
    },

    toggleSetting: function(key) {
        this.settings[key] = !this.settings[key];
        this.updateToggleUI(key);
        this.playBiosSound();
    },

    setSetting: function(key, value) {
        this.settings[key] = value;
        this.updateSettingUI(key);
        this.playBiosSound();
    },

    updateToggleUI: function(key) {
        const toggle = document.querySelector(`[data-setting="${key}"]`);
        if (toggle) {
            toggle.textContent = this.settings[key] ? 
                (this.t('bios_enabled') || 'Enabled') : 
                (this.t('bios_disabled') || 'Disabled');
            toggle.style.color = this.settings[key] ? '#44cc44' : '#cc4444';
        }
    },

    updateSettingUI: function(key) {
        const select = document.querySelector(`[data-setting="${key}"]`);
        if (select && select.tagName === 'SELECT') {
            select.value = this.settings[key];
        }
    },

    playBiosSound: function() {
        try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 800;
            gain.gain.value = 0.1;
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.05);
            osc.stop(ctx.currentTime + 0.05);
        } catch(e) {}
    },

    // Translation with I18N fallback
    t: function(key) {
        if (typeof I18N !== 'undefined' && I18N.t) {
            return I18N.t(key);
        }
        
        const translations = {
            en: {
                // Main tab
                'bios_title': 'HeartOS BIOS Setup Utility',
                'bios_language': 'System Language',
                'bios_lang_label': 'Language:',
                'bios_english': 'English',
                'bios_czech': 'Čeština',
                'bios_nav': 'Use mouse to change settings',
                'bios_version': 'BIOS Version 3.0 ❤',
                'bios_continue': 'Continue Boot',
                'bios_save': 'Save & Exit',
                'bios_system_info': 'System Information',
                'bios_os': 'OS:',
                'bios_build': 'Build:',
                'bios_cpu': 'CPU:',
                'bios_ram': 'RAM:',
                'bios_storage': 'Storage:',
                'bios_network': 'Network:',
                'bios_uptime': 'Uptime:',
                'bios_browser': 'Browser:',
                'bios_system_status': '▶ STATUS',
                'bios_status_emotional': '[OK] Emotional core online',
                'bios_status_memory': '[OK] Memory vault mounted',
                'bios_status_heart': '[OK] Heart sync active',
                'bios_status_love': '[OK] Love.dll loaded',
                'bios_status_connection': '[OK] Connection stable',
                'bios_help': 'HELP',
                
                // Tab names
                'bios_tab_main': 'Main',
                'bios_tab_advanced': 'Advanced',
                'bios_tab_boot': 'Boot',
                'bios_tab_monitor': 'Monitor',
                'bios_tab_easter': '???',
                
                // Advanced tab
                'bios_adv_performance': 'Performance Settings',
                'bios_adv_cpu_mode': 'CPU Mode:',
                'bios_adv_memory': 'Memory Mode:',
                'bios_adv_network': 'Network Mode:',
                'bios_mode_performance': 'Performance',
                'bios_mode_balanced': 'Balanced',
                'bios_mode_powersave': 'Power Save',
                'bios_mode_auto': 'Auto',
                'bios_mode_manual': 'Manual',
                'bios_mode_always': 'Always On',
                'bios_mode_ondemand': 'On Demand',
                'bios_adv_features': 'Advanced Features',
                'bios_adv_quick_boot': 'Quick Boot:',
                'bios_adv_verbose': 'Verbose Mode:',
                'bios_adv_auto_login': 'Auto Login:',
                'bios_adv_screensaver': 'Screensaver:',
                'bios_enabled': 'Enabled',
                'bios_disabled': 'Disabled',
                'bios_adv_help': 'Advanced settings affect system performance and behavior. Change with caution.',
                
                // Boot tab
                'bios_boot_sequence': 'Boot Sequence',
                'bios_boot_order': 'Boot Order:',
                'bios_boot_1': '1st Boot Device: Heart Drive',
                'bios_boot_2': '2nd Boot Device: Memory Vault',
                'bios_boot_3': '3rd Boot Device: Network',
                'bios_boot_options': 'Boot Options',
                'bios_boot_logo': 'Boot Logo:',
                'bios_boot_animation': 'Boot Animation:',
                'bios_boot_sound': 'Boot Sound:',
                'bios_boot_delay': 'Boot Delay:',
                'bios_boot_delay_none': 'None',
                'bios_boot_delay_short': 'Short (2s)',
                'bios_boot_delay_normal': 'Normal (5s)',
                'bios_boot_delay_long': 'Long (10s)',
                'bios_boot_help': 'Configure boot behavior and startup sequence.',
                
                // Monitor tab
                'bios_mon_display': 'Display Settings',
                'bios_mon_refresh': 'Refresh Rate:',
                'bios_mon_color': 'Color Mode:',
                'bios_mon_crt_effects': 'CRT Effects',
                'bios_mon_crt_intensity': 'CRT Intensity:',
                'bios_mon_scanlines': 'Scanlines:',
                'bios_mon_vignette': 'Vignette:',
                'bios_mon_glow': 'Glow Effect:',
                'bios_intensity_off': 'Off',
                'bios_intensity_low': 'Low',
                'bios_intensity_medium': 'Medium',
                'bios_intensity_high': 'High',
                'bios_color_retro': 'Retro Pink',
                'bios_color_classic': 'Classic Green',
                'bios_color_amber': 'Amber',
                'bios_color_blue': 'Blue',
                'bios_mon_help': 'Adjust visual effects and display settings for optimal viewing.',
                
                // Easter egg tab
                'bios_easter_title': 'Easter Egg',
                'bios_easter_message': 'You found the secret tab!',
                'bios_easter_heart': 'Made with ❤ for us',
                'bios_easter_stats': 'Secret Stats',
                'bios_easter_visits': 'BIOS Visits:',
                'bios_easter_time': 'Time in BIOS:',
                'bios_easter_changes': 'Settings Changed:',
                'bios_easter_quote': '"Love is not about possession. Love is about appreciation." - Osho'
            },
            cs: {
                // Main tab
                'bios_title': 'HeartOS BIOS Nastavení',
                'bios_language': 'Jazyk Systému',
                'bios_lang_label': 'Jazyk:',
                'bios_english': 'English',
                'bios_czech': 'Čeština',
                'bios_nav': 'Použijte myš ke změně nastavení',
                'bios_version': 'BIOS Verze 3.0 ❤',
                'bios_continue': 'Pokračovat',
                'bios_save': 'Uložit a ukončit',
                'bios_system_info': 'INFORMACE O SYSTÉMU',
                'bios_os': 'OS:',
                'bios_build': 'Build:',
                'bios_cpu': 'CPU:',
                'bios_ram': 'RAM:',
                'bios_storage': 'Úložiště:',
                'bios_network': 'Síť:',
                'bios_uptime': 'Uptime:',
                'bios_browser': 'Prohlížeč:',
                'bios_system_status': '▶ STAV',
                'bios_status_emotional': '[OK] Emocionální jádro online',
                'bios_status_memory': '[OK] Trezor vzpomínek připojen',
                'bios_status_heart': '[OK] Synchronizace srdce aktivní',
                'bios_status_love': '[OK] Love.dll načten',
                'bios_status_connection': '[OK] Připojení stabilní',
                'bios_help': 'NÁPOVĚDA',
                
                // Tab names
                'bios_tab_main': 'Hlavní',
                'bios_tab_advanced': 'Pokročilé',
                'bios_tab_boot': 'Start',
                'bios_tab_monitor': 'Monitor',
                'bios_tab_easter': '???',
                
                // Advanced tab
                'bios_adv_performance': 'Nastavení výkonu',
                'bios_adv_cpu_mode': 'Režim CPU:',
                'bios_adv_memory': 'Režim paměti:',
                'bios_adv_network': 'Režim sítě:',
                'bios_mode_performance': 'Výkon',
                'bios_mode_balanced': 'Vyvážený',
                'bios_mode_powersave': 'Úspora energie',
                'bios_mode_auto': 'Auto',
                'bios_mode_manual': 'Manuální',
                'bios_mode_always': 'Vždy zapnuto',
                'bios_mode_ondemand': 'Na vyžádání',
                'bios_adv_features': 'Pokročilé funkce',
                'bios_adv_quick_boot': 'Rychlý start:',
                'bios_adv_verbose': 'Podrobný režim:',
                'bios_adv_auto_login': 'Auto přihlášení:',
                'bios_adv_screensaver': 'Šetřič obrazovky:',
                'bios_enabled': 'Zapnuto',
                'bios_disabled': 'Vypnuto',
                'bios_adv_help': 'Pokročilá nastavení ovlivňují výkon a chování systému. Měňte opatrně.',
                
                // Boot tab
                'bios_boot_sequence': 'Pořadí startu',
                'bios_boot_order': 'Pořadí startu:',
                'bios_boot_1': '1. startovací zařízení: Disk srdce',
                'bios_boot_2': '2. startovací zařízení: Trezor vzpomínek',
                'bios_boot_3': '3. startovací zařízení: Síť',
                'bios_boot_options': 'Možnosti startu',
                'bios_boot_logo': 'Logo při startu:',
                'bios_boot_animation': 'Animace startu:',
                'bios_boot_sound': 'Zvuk při startu:',
                'bios_boot_delay': 'Prodleva startu:',
                'bios_boot_delay_none': 'Žádná',
                'bios_boot_delay_short': 'Krátká (2s)',
                'bios_boot_delay_normal': 'Normální (5s)',
                'bios_boot_delay_long': 'Dlouhá (10s)',
                'bios_boot_help': 'Nastavení chování při startu a pořadí spouštění.',
                
                // Monitor tab
                'bios_mon_display': 'Nastavení displeje',
                'bios_mon_refresh': 'Obnovovací frekvence:',
                'bios_mon_color': 'Barevný režim:',
                'bios_mon_crt_effects': 'CRT efekty',
                'bios_mon_crt_intensity': 'Intenzita CRT:',
                'bios_mon_scanlines': 'Skenovací čáry:',
                'bios_mon_vignette': 'Vinětace:',
                'bios_mon_glow': 'Efekt záře:',
                'bios_intensity_off': 'Vypnuto',
                'bios_intensity_low': 'Nízká',
                'bios_intensity_medium': 'Střední',
                'bios_intensity_high': 'Vysoká',
                'bios_color_retro': 'Retro růžová',
                'bios_color_classic': 'Klasická zelená',
                'bios_color_amber': 'Jantarová',
                'bios_color_blue': 'Modrá',
                'bios_mon_help': 'Upravte vizuální efekty a nastavení displeje pro optimální zobrazení.',
                
                // Easter egg tab
                'bios_easter_title': 'Velikonoční vajíčko',
                'bios_easter_message': 'Našel jsi tajnou záložku!',
                'bios_easter_heart': 'Vytvořeno s ❤ pro nás',
                'bios_easter_stats': 'Tajné statistiky',
                'bios_easter_visits': 'Návštěv BIOSu:',
                'bios_easter_time': 'Čas v BIOSu:',
                'bios_easter_changes': 'Změněná nastavení:',
                'bios_easter_quote': '"Láska není o vlastnictví. Láska je o ocenění." - Osho'
            }
        };
        
        const currentLang = (typeof I18N !== 'undefined') ? I18N.currentLang : 'en';
        return translations[currentLang][key] || translations['en'][key] || key;
    },

    // BIOS HTML Generator
    createHTML: function() {
        const s = this.settings;
        const currentLang = (typeof I18N !== 'undefined') ? I18N.currentLang : 'en';
        const start = new Date('2024-01-01');
        const days = Math.floor((Date.now() - start) / 86400000);
        const uptimeStr = days + (currentLang === 'cs' ? ' dní ♥' : ' days ♥');
        
        // Track stats for easter egg
        let biosVisits = parseInt(localStorage.getItem('heartos_bios_visits') || '0') + 1;
        localStorage.setItem('heartos_bios_visits', biosVisits);
        const biosEnterTime = Date.now();
        
        return `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
                #bios-screen { position:fixed; top:0; left:0; width:100%; height:100%; background:#050510; color:#c0c0ff; font-family:'Share Tech Mono','VT323',monospace; z-index:100000; display:flex; flex-direction:column; padding:0; overflow:hidden; }
                #bios-screen::before { content:''; position:absolute; top:0; left:0; right:0; bottom:0; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 4px); pointer-events:none; z-index:10; }
                #bios-screen::after { content:''; position:absolute; top:0; left:0; right:0; bottom:0; background:radial-gradient(ellipse at center,transparent 60%,rgba(0,0,0,0.6) 100%); pointer-events:none; z-index:11; }
                .bios-bg-grid { position:absolute; top:0; left:0; right:0; bottom:0; background-image:linear-gradient(rgba(255,77,109,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,77,109,0.03) 1px,transparent 1px); background-size:40px 40px; animation:gridPulse 4s ease-in-out infinite; }
                @keyframes gridPulse { 0%,100%{ opacity:0.3; } 50%{ opacity:0.8; } }
                .bios-header { position:relative; z-index:5; background:linear-gradient(90deg,#1a0020 0%,#0d0030 50%,#1a0020 100%); padding:12px 30px; font-size:1.4rem; font-weight:bold; text-align:center; border-bottom:2px solid #ff4d6d; color:#ff4d6d; text-shadow:0 0 10px #ff4d6d,0 0 30px rgba(255,77,109,0.3); letter-spacing:4px; text-transform:uppercase; display:flex; align-items:center; justify-content:center; gap:15px; }
                .bios-header-heart { display:inline-block; animation:heartPulse 1.2s ease-in-out infinite; font-size:1.2rem; }
                @keyframes heartPulse { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.3); } }
                .bios-tabs { position:relative; z-index:5; display:flex; gap:5px; background:rgba(10,5,25,0.9); padding:8px 20px 0 20px; border-bottom:1px solid rgba(255,77,109,0.2); }
                .bios-tab { padding:10px 25px 8px; cursor:pointer; border:1px solid transparent; border-bottom:none; color:#8888bb; transition:all 0.2s; font-size:1rem; position:relative; background:rgba(0,0,0,0.3); }
                .bios-tab:hover { color:#ff8fa3; background:rgba(255,77,109,0.05); }
                .bios-tab.active { color:#ff4d6d; background:rgba(10,5,25,0.8); border:1px solid rgba(255,77,109,0.3); border-bottom:1px solid rgba(10,5,25,0.8); font-weight:bold; }
                .bios-tab.active::after { content:''; position:absolute; bottom:-1px; left:0; right:0; height:2px; background:rgba(10,5,25,0.8); }
                .bios-body { position:relative; z-index:5; flex:1; display:flex; padding:25px 35px; gap:30px; overflow-y:auto; }
                .bios-tab-content { display:none; flex:1; }
                .bios-tab-content.active { display:flex; flex-direction:column; gap:20px; }
                .bios-main { flex:1; display:flex; flex-direction:column; gap:20px; }
                .bios-section { border:1px solid rgba(255,77,109,0.3); background:rgba(10,5,25,0.8); overflow:hidden; animation:sectionFadeIn 0.5s ease forwards; opacity:0; }
                .bios-section:nth-child(1){ animation-delay:0.1s; } .bios-section:nth-child(2){ animation-delay:0.2s; } .bios-section:nth-child(3){ animation-delay:0.3s; } .bios-section:nth-child(4){ animation-delay:0.4s; }
                @keyframes sectionFadeIn { from{ opacity:0; transform:translateY(10px); } to{ opacity:1; transform:translateY(0); } }
                .bios-section-title { background:linear-gradient(90deg,rgba(255,77,109,0.2),transparent); color:#ff4d6d; padding:8px 18px; font-size:1.1rem; font-weight:bold; border-bottom:1px solid rgba(255,77,109,0.2); letter-spacing:2px; text-transform:uppercase; display:flex; align-items:center; gap:10px; }
                .bios-section-title::before { content:'>'; color:#ff8fa3; animation:blink 1s step-end infinite; }
                @keyframes blink { 50%{ opacity:0; } }
                .bios-row { display:flex; justify-content:space-between; align-items:center; padding:10px 18px; border-bottom:1px solid rgba(255,77,109,0.07); font-size:1.05rem; transition:background 0.2s; }
                .bios-row:hover { background:rgba(255,77,109,0.05); }
                .bios-row:last-child { border-bottom:none; }
                .bios-row-label { color:#8888bb; }
                .bios-row-value { color:#ff8fa3; font-weight:bold; text-shadow:0 0 8px rgba(255,143,163,0.4); }
                .bios-lang-option { display:inline-block; padding:8px 28px; margin:0 6px; cursor:pointer; font-size:1.1rem; font-family:'Share Tech Mono','VT323',monospace; border:1px solid rgba(255,77,109,0.3); background:transparent; color:#8888bb; transition:all 0.25s ease; position:relative; letter-spacing:1px; }
                .bios-lang-option:hover { border-color:#ff4d6d; color:#ff8fa3; box-shadow:0 0 15px rgba(255,77,109,0.2),inset 0 0 15px rgba(255,77,109,0.05); }
                .bios-lang-option.active { background:linear-gradient(135deg,rgba(255,77,109,0.25),rgba(255,77,109,0.1)); color:#ff4d6d; border-color:#ff4d6d; box-shadow:0 0 20px rgba(255,77,109,0.3),inset 0 0 20px rgba(255,77,109,0.08); font-weight:bold; text-shadow:0 0 10px rgba(255,77,109,0.5); }
                .bios-toggle-btn { display:inline-block; padding:6px 20px; cursor:pointer; font-size:0.95rem; font-family:'Share Tech Mono','VT323',monospace; border:1px solid rgba(255,77,109,0.3); background:transparent; transition:all 0.25s ease; letter-spacing:1px; min-width:100px; text-align:center; }
                .bios-toggle-btn:hover { border-color:#ff4d6d; box-shadow:0 0 10px rgba(255,77,109,0.2); }
                .bios-select { padding:6px 15px; background:rgba(0,0,0,0.5); border:1px solid rgba(255,77,109,0.3); color:#ff8fa3; font-family:'Share Tech Mono','VT323',monospace; font-size:0.95rem; cursor:pointer; transition:all 0.25s; }
                .bios-select:hover { border-color:#ff4d6d; box-shadow:0 0 10px rgba(255,77,109,0.2); }
                .bios-select:focus { outline:none; border-color:#ff4d6d; box-shadow:0 0 15px rgba(255,77,109,0.3); }
                .bios-sidebar { width:280px; background:rgba(10,5,25,0.6); border:1px solid rgba(255,77,109,0.15); padding:20px; display:flex; flex-direction:column; gap:20px; animation:sectionFadeIn 0.5s ease 0.5s forwards; opacity:0; }
                .bios-sidebar h3 { color:#ff4d6d; margin:0; font-size:1.1rem; border-bottom:1px solid rgba(255,77,109,0.2); padding-bottom:10px; letter-spacing:2px; text-transform:uppercase; }
                .bios-sidebar p { color:#6666aa; font-size:0.95rem; line-height:1.7; margin:0; }
                .bios-ascii-art { color:#ff4d6d; font-size:0.65rem; line-height:1.1; white-space:pre; text-align:center; text-shadow:0 0 10px rgba(255,77,109,0.5); animation:asciiGlow 2s ease-in-out infinite; margin-top:auto; }
                @keyframes asciiGlow { 0%,100%{ opacity:0.7; filter:brightness(1); } 50%{ opacity:1; filter:brightness(1.3); } }
                .bios-status-line { color:#44cc44; font-size:0.85rem; padding:3px 0; animation:statusType 0.3s ease forwards; opacity:0; }
                .bios-status-line:nth-child(1){ animation-delay:0.8s; } .bios-status-line:nth-child(2){ animation-delay:1.1s; } .bios-status-line:nth-child(3){ animation-delay:1.4s; } .bios-status-line:nth-child(4){ animation-delay:1.7s; } .bios-status-line:nth-child(5){ animation-delay:2.0s; }
                @keyframes statusType { from{ opacity:0; transform:translateX(-5px); } to{ opacity:1; transform:translateX(0); } }
                .bios-footer { position:relative; z-index:5; background:linear-gradient(90deg,#1a0020 0%,#0d0030 50%,#1a0020 100%); padding:12px 30px; display:flex; justify-content:space-between; align-items:center; border-top:2px solid #ff4d6d; font-size:1rem; }
                .bios-footer-version { color:#555580; letter-spacing:1px; }
                .bios-footer-btn { background:transparent; color:#8888bb; border:1px solid rgba(255,77,109,0.3); padding:8px 28px; font-family:'Share Tech Mono','VT323',monospace; font-size:1.05rem; cursor:pointer; transition:all 0.25s; letter-spacing:1px; margin-left:10px; }
                .bios-footer-btn:hover { color:#ff8fa3; border-color:#ff4d6d; box-shadow:0 0 15px rgba(255,77,109,0.2); }
                .bios-footer-btn.primary { background:linear-gradient(135deg,rgba(255,77,109,0.2),rgba(255,77,109,0.1)); color:#ff4d6d; border-color:#ff4d6d; text-shadow:0 0 8px rgba(255,77,109,0.4); }
                .bios-footer-btn.primary:hover { background:linear-gradient(135deg,rgba(255,77,109,0.35),rgba(255,77,109,0.15)); box-shadow:0 0 25px rgba(255,77,109,0.3); }
                .bios-flicker { animation:crtFlicker 0.15s linear; }
                @keyframes crtFlicker { 0%{ opacity:0; } 10%{ opacity:1; } 20%{ opacity:0.3; } 30%{ opacity:1; } 40%{ opacity:0.7; } 50%{ opacity:1; } 100%{ opacity:1; } }
                .bios-easter-center { text-align:center; padding:40px 20px; }
                .bios-easter-title { font-size:2rem; color:#ff4d6d; margin-bottom:20px; text-shadow:0 0 20px rgba(255,77,109,0.5); }
                .bios-easter-subtitle { font-size:1.3rem; color:#ff8fa3; margin-bottom:30px; }
                .bios-easter-quote { font-style:italic; color:#8888bb; margin-top:30px; padding:20px; border-left:3px solid #ff4d6d; background:rgba(255,77,109,0.05); }
            </style>
            
            <div class="bios-bg-grid"></div>
            
            <div class="bios-header bios-flicker">
                <span class="bios-header-heart">♥</span>
                <span>${this.t('bios_title')}</span>
                <span class="bios-header-heart">♥</span>
            </div>

            <div class="bios-tabs">
                <div class="bios-tab active" onclick="BIOS_ENHANCEMENTS.switchTab('main')">${this.t('bios_tab_main')}</div>
                <div class="bios-tab" onclick="BIOS_ENHANCEMENTS.switchTab('advanced')">${this.t('bios_tab_advanced')}</div>
                <div class="bios-tab" onclick="BIOS_ENHANCEMENTS.switchTab('boot')">${this.t('bios_tab_boot')}</div>
                <div class="bios-tab" onclick="BIOS_ENHANCEMENTS.switchTab('monitor')">${this.t('bios_tab_monitor')}</div>
                <div class="bios-tab" onclick="BIOS_ENHANCEMENTS.switchTab('easter')">${this.t('bios_tab_easter')}</div>
            </div>

            <div class="bios-body">
                <!-- MAIN TAB -->
                <div class="bios-tab-content active" data-tab="main">
                    <div class="bios-main" style="flex:1; display:flex; flex-direction:column; gap:20px;">
                        <div class="bios-section">
                            <div class="bios-section-title">${this.t('bios_language')}</div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_lang_label')}</span>
                                <span>
                                    <button class="bios-lang-option ${currentLang==='en'?'active':''}" onclick="BIOS_ENHANCEMENTS.changeLang('en')">${this.t('bios_english')}</button>
                                    <button class="bios-lang-option ${currentLang==='cs'?'active':''}" onclick="BIOS_ENHANCEMENTS.changeLang('cs')">${this.t('bios_czech')}</button>
                                </span>
                            </div>
                        </div>

                        <div class="bios-section">
                            <div class="bios-section-title">${this.t('bios_system_info')}</div>
                            <div class="bios-row"><span class="bios-row-label">${this.t('bios_os')}</span><span class="bios-row-value">HeartOS v3.0</span></div>
                            <div class="bios-row"><span class="bios-row-label">${this.t('bios_build')}</span><span class="bios-row-value">2025.02.14</span></div>
                            <div class="bios-row"><span class="bios-row-label">${this.t('bios_cpu')}</span><span class="bios-row-value">LoveCore™ x2</span></div>
                            <div class="bios-row"><span class="bios-row-label">${this.t('bios_ram')}</span><span class="bios-row-value">∞ ${currentLang==='cs'?'vzpomínek':'memories'}</span></div>
                            <div class="bios-row"><span class="bios-row-label">${this.t('bios_storage')}</span><span class="bios-row-value">1 ${currentLang==='cs'?'plné srdce':'full heart'}</span></div>
                            <div class="bios-row"><span class="bios-row-label">${this.t('bios_network')}</span><span class="bios-row-value">CPT ⇄ PRG [${currentLang==='cs'?'propojeno':'linked'}]</span></div>
                            <div class="bios-row"><span class="bios-row-label">${this.t('bios_uptime')}</span><span class="bios-row-value">${uptimeStr}</span></div>
                            <div class="bios-row"><span class="bios-row-label">${this.t('bios_browser')}</span><span class="bios-row-value">${navigator.userAgent.split(' ').pop()}</span></div>
                        </div>
                    </div>

                    <div class="bios-sidebar">
                        <h3>${this.t('bios_system_status')}</h3>
                        <div>
                            <div class="bios-status-line">${this.t('bios_status_emotional')}</div>
                            <div class="bios-status-line">${this.t('bios_status_memory')}</div>
                            <div class="bios-status-line">${this.t('bios_status_heart')}</div>
                            <div class="bios-status-line">${this.t('bios_status_love')}</div>
                            <div class="bios-status-line">${this.t('bios_status_connection')}</div>
                        </div>
                        <h3>${this.t('bios_help')}</h3>
                        <p>${this.t('bios_nav')}</p>
                        <div class="bios-ascii-art">  .:::.   .:::.
 :::::::.:::::::
 :::::::::::::::
 ':::::::::::'
   ':::::::'
     ':::'
      ':'</div>
                    </div>
                </div>

                <!-- ADVANCED TAB -->
                <div class="bios-tab-content" data-tab="advanced">
                    <div class="bios-main">
                        <div class="bios-section">
                            <div class="bios-section-title">${this.t('bios_adv_performance')}</div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_adv_cpu_mode')}</span>
                                <select class="bios-select" data-setting="cpuThrottle" onchange="BIOS_ENHANCEMENTS.setSetting('cpuThrottle', this.value)">
                                    <option value="performance" ${s.cpuThrottle==='performance'?'selected':''}>${this.t('bios_mode_performance')}</option>
                                    <option value="balanced" ${s.cpuThrottle==='balanced'?'selected':''}>${this.t('bios_mode_balanced')}</option>
                                    <option value="powersave" ${s.cpuThrottle==='powersave'?'selected':''}>${this.t('bios_mode_powersave')}</option>
                                </select>
                            </div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_adv_memory')}</span>
                                <select class="bios-select" data-setting="memoryMode" onchange="BIOS_ENHANCEMENTS.setSetting('memoryMode', this.value)">
                                    <option value="auto" ${s.memoryMode==='auto'?'selected':''}>${this.t('bios_mode_auto')}</option>
                                    <option value="manual" ${s.memoryMode==='manual'?'selected':''}>${this.t('bios_mode_manual')}</option>
                                </select>
                            </div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_adv_network')}</span>
                                <select class="bios-select" data-setting="networkMode" onchange="BIOS_ENHANCEMENTS.setSetting('networkMode', this.value)">
                                    <option value="always" ${s.networkMode==='always'?'selected':''}>${this.t('bios_mode_always')}</option>
                                    <option value="ondemand" ${s.networkMode==='ondemand'?'selected':''}>${this.t('bios_mode_ondemand')}</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="bios-section">
                            <div class="bios-section-title">${this.t('bios_adv_features')}</div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_adv_quick_boot')}</span>
                                <button class="bios-toggle-btn" data-setting="quickBoot" style="color:${s.quickBoot?'#44cc44':'#cc4444'}" onclick="BIOS_ENHANCEMENTS.toggleSetting('quickBoot')">${s.quickBoot?this.t('bios_enabled'):this.t('bios_disabled')}</button>
                            </div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_adv_verbose')}</span>
                                <button class="bios-toggle-btn" data-setting="verboseMode" style="color:${s.verboseMode?'#44cc44':'#cc4444'}" onclick="BIOS_ENHANCEMENTS.toggleSetting('verboseMode')">${s.verboseMode?this.t('bios_enabled'):this.t('bios_disabled')}</button>
                            </div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_adv_auto_login')}</span>
                                <button class="bios-toggle-btn" data-setting="autoLogin" style="color:${s.autoLogin?'#44cc44':'#cc4444'}" onclick="BIOS_ENHANCEMENTS.toggleSetting('autoLogin')">${s.autoLogin?this.t('bios_enabled'):this.t('bios_disabled')}</button>
                            </div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_adv_screensaver')}</span>
                                <button class="bios-toggle-btn" data-setting="screenSaver" style="color:${s.screenSaver?'#44cc44':'#cc4444'}" onclick="BIOS_ENHANCEMENTS.toggleSetting('screenSaver')">${s.screenSaver?this.t('bios_enabled'):this.t('bios_disabled')}</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bios-sidebar">
                        <h3>${this.t('bios_help')}</h3>
                        <p>${this.t('bios_adv_help')}</p>
                    </div>
                </div>

                <!-- BOOT TAB -->
                <div class="bios-tab-content" data-tab="boot">
                    <div class="bios-main">
                        <div class="bios-section">
                            <div class="bios-section-title">${this.t('bios_boot_sequence')}</div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_boot_order')}</span>
                            </div>
                            <div class="bios-row">
                                <span class="bios-row-value">${this.t('bios_boot_1')}</span>
                            </div>
                            <div class="bios-row">
                                <span class="bios-row-value">${this.t('bios_boot_2')}</span>
                            </div>
                            <div class="bios-row">
                                <span class="bios-row-value">${this.t('bios_boot_3')}</span>
                            </div>
                        </div>
                        
                        <div class="bios-section">
                            <div class="bios-section-title">${this.t('bios_boot_options')}</div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_boot_logo')}</span>
                                <button class="bios-toggle-btn" data-setting="bootLogo" style="color:${s.bootLogo?'#44cc44':'#cc4444'}" onclick="BIOS_ENHANCEMENTS.toggleSetting('bootLogo')">${s.bootLogo?this.t('bios_enabled'):this.t('bios_disabled')}</button>
                            </div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_boot_animation')}</span>
                                <button class="bios-toggle-btn" data-setting="bootAnimation" style="color:${s.bootAnimation?'#44cc44':'#cc4444'}" onclick="BIOS_ENHANCEMENTS.toggleSetting('bootAnimation')">${s.bootAnimation?this.t('bios_enabled'):this.t('bios_disabled')}</button>
                            </div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_boot_sound')}</span>
                                <button class="bios-toggle-btn" data-setting="soundEnabled" style="color:${s.soundEnabled?'#44cc44':'#cc4444'}" onclick="BIOS_ENHANCEMENTS.toggleSetting('soundEnabled')">${s.soundEnabled?this.t('bios_enabled'):this.t('bios_disabled')}</button>
                            </div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_boot_delay')}</span>
                                <select class="bios-select" data-setting="bootDelay" onchange="BIOS_ENHANCEMENTS.setSetting('bootDelay', this.value)">
                                    <option value="none" ${s.bootDelay==='none'?'selected':''}>${this.t('bios_boot_delay_none')}</option>
                                    <option value="short" ${s.bootDelay==='short'?'selected':''}>${this.t('bios_boot_delay_short')}</option>
                                    <option value="normal" ${s.bootDelay==='normal'?'selected':''}>${this.t('bios_boot_delay_normal')}</option>
                                    <option value="long" ${s.bootDelay==='long'?'selected':''}>${this.t('bios_boot_delay_long')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bios-sidebar">
                        <h3>${this.t('bios_help')}</h3>
                        <p>${this.t('bios_boot_help')}</p>
                    </div>
                </div>

                <!-- MONITOR TAB -->
                <div class="bios-tab-content" data-tab="monitor">
                    <div class="bios-main">
                        <div class="bios-section">
                            <div class="bios-section-title">${this.t('bios_mon_display')}</div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_mon_refresh')}</span>
                                <select class="bios-select" data-setting="refreshRate" onchange="BIOS_ENHANCEMENTS.setSetting('refreshRate', this.value)">
                                    <option value="60Hz" ${s.refreshRate==='60Hz'?'selected':''}>60Hz</option>
                                    <option value="75Hz" ${s.refreshRate==='75Hz'?'selected':''}>75Hz</option>
                                    <option value="120Hz" ${s.refreshRate==='120Hz'?'selected':''}>120Hz</option>
                                    <option value="144Hz" ${s.refreshRate==='144Hz'?'selected':''}>144Hz</option>
                                </select>
                            </div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_mon_color')}</span>
                                <select class="bios-select" data-setting="colorMode" onchange="BIOS_ENHANCEMENTS.setSetting('colorMode', this.value)">
                                    <option value="retro" ${s.colorMode==='retro'?'selected':''}>${this.t('bios_color_retro')}</option>
                                    <option value="classic" ${s.colorMode==='classic'?'selected':''}>${this.t('bios_color_classic')}</option>
                                    <option value="amber" ${s.colorMode==='amber'?'selected':''}>${this.t('bios_color_amber')}</option>
                                    <option value="blue" ${s.colorMode==='blue'?'selected':''}>${this.t('bios_color_blue')}</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="bios-section">
                            <div class="bios-section-title">${this.t('bios_mon_crt_effects')}</div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_mon_crt_intensity')}</span>
                                <select class="bios-select" data-setting="crtIntensity" onchange="BIOS_ENHANCEMENTS.setSetting('crtIntensity', this.value)">
                                    <option value="off" ${s.crtIntensity==='off'?'selected':''}>${this.t('bios_intensity_off')}</option>
                                    <option value="low" ${s.crtIntensity==='low'?'selected':''}>${this.t('bios_intensity_low')}</option>
                                    <option value="medium" ${s.crtIntensity==='medium'?'selected':''}>${this.t('bios_intensity_medium')}</option>
                                    <option value="high" ${s.crtIntensity==='high'?'selected':''}>${this.t('bios_intensity_high')}</option>
                                </select>
                            </div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_mon_scanlines')}</span>
                                <button class="bios-toggle-btn" data-setting="scanlines" style="color:${s.scanlines?'#44cc44':'#cc4444'}" onclick="BIOS_ENHANCEMENTS.toggleSetting('scanlines')">${s.scanlines?this.t('bios_enabled'):this.t('bios_disabled')}</button>
                            </div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_mon_vignette')}</span>
                                <button class="bios-toggle-btn" data-setting="vignette" style="color:${s.vignette?'#44cc44':'#cc4444'}" onclick="BIOS_ENHANCEMENTS.toggleSetting('vignette')">${s.vignette?this.t('bios_enabled'):this.t('bios_disabled')}</button>
                            </div>
                            <div class="bios-row">
                                <span class="bios-row-label">${this.t('bios_mon_glow')}</span>
                                <button class="bios-toggle-btn" data-setting="glowEffect" style="color:${s.glowEffect?'#44cc44':'#cc4444'}" onclick="BIOS_ENHANCEMENTS.toggleSetting('glowEffect')">${s.glowEffect?this.t('bios_enabled'):this.t('bios_disabled')}</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bios-sidebar">
                        <h3>${this.t('bios_help')}</h3>
                        <p>${this.t('bios_mon_help')}</p>
                    </div>
                </div>

                <!-- EASTER EGG TAB -->
                <div class="bios-tab-content" data-tab="easter">
                    <div class="bios-main" style="justify-content:center; align-items:center;">
                        <div class="bios-section" style="max-width:600px; width:100%;">
                            <div class="bios-easter-center">
                                <div class="bios-easter-title">${this.t('bios_easter_title')}</div>
                                <div class="bios-easter-subtitle">${this.t('bios_easter_message')}</div>
                                <div class="bios-ascii-art" style="font-size:1rem; margin:30px 0;">
      ♥♥♥        ♥♥♥
    ♥♥♥♥♥♥    ♥♥♥♥♥♥
  ♥♥♥♥♥♥♥♥  ♥♥♥♥♥♥♥♥
  ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
    ♥♥♥♥♥♥♥♥♥♥♥♥♥♥
      ♥♥♥♥♥♥♥♥♥♥
        ♥♥♥♥♥♥
          ♥♥
                </div>
                                <div style="color:#ff8fa3; font-size:1.2rem; margin:20px 0;">${this.t('bios_easter_heart')}</div>
                                
                                <div class="bios-section" style="margin-top:30px;">
                                    <div class="bios-section-title">${this.t('bios_easter_stats')}</div>
                                    <div class="bios-row">
                                        <span class="bios-row-label">${this.t('bios_easter_visits')}</span>
                                        <span class="bios-row-value">${biosVisits}</span>
                                    </div>
                                    <div class="bios-row">
                                        <span class="bios-row-label">${this.t('bios_easter_time')}</span>
                                        <span class="bios-row-value" id="bios-time-spent">0s</span>
                                    </div>
                                    <div class="bios-row">
                                        <span class="bios-row-label">${this.t('bios_easter_changes')}</span>
                                        <span class="bios-row-value">♥</span>
                                    </div>
                                </div>
                                
                                <div class="bios-easter-quote">${this.t('bios_easter_quote')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bios-footer">
                <span class="bios-footer-version">${this.t('bios_version')}</span>
                <span>
                    <button class="bios-footer-btn" onclick="SYSTEM.closeBios(false)">${this.t('bios_continue')}</button>
                    <button class="bios-footer-btn primary" onclick="SYSTEM.closeBios(true)">${this.t('bios_save')}</button>
                </span>
            </div>
            
            <script>
                // Update time spent in BIOS
                const biosEnterTime = ${biosEnterTime};
                setInterval(() => {
                    const timeEl = document.getElementById('bios-time-spent');
                    if (timeEl) {
                        const seconds = Math.floor((Date.now() - biosEnterTime) / 1000);
                        timeEl.textContent = seconds + 's';
                    }
                }, 1000);
            </script>
        `;
    },

    changeLang: function(lang) {
        if (typeof SYSTEM !== 'undefined' && SYSTEM.setBiosLang) {
            SYSTEM.setBiosLang(lang);
            const biosScreen = document.getElementById('bios-screen');
            if (biosScreen) {
                biosScreen.innerHTML = this.createHTML();
            }
            this.playBiosSound();
        }
    },

    switchTab: function(tabName) {
        document.querySelectorAll('.bios-tab').forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');
        document.querySelectorAll('.bios-tab-content').forEach(c => c.classList.remove('active'));
        const target = document.querySelector(`.bios-tab-content[data-tab="${tabName}"]`);
        if (target) target.classList.add('active');
        this.playBiosSound();
    },

    init: function() {
        this.loadSettings();
    }
};

// Integration
if (typeof SYSTEM !== 'undefined' && SYSTEM.createBiosScreen) {
    SYSTEM._origCreateBiosScreen = SYSTEM.createBiosScreen;
    SYSTEM.createBiosScreen = function() {
        const screen = document.createElement('div');
        screen.id = 'bios-screen';
        screen.innerHTML = BIOS_ENHANCEMENTS.createHTML();
        return screen;
    };
}

if (typeof SYSTEM !== 'undefined' && SYSTEM.closeBios) {
    SYSTEM._origCloseBios = SYSTEM.closeBios;
    SYSTEM.closeBios = function(save) {
        if (save) BIOS_ENHANCEMENTS.saveSettings();
        SYSTEM._origCloseBios.call(this, save);
    };
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BIOS_ENHANCEMENTS.init());
} else {
    BIOS_ENHANCEMENTS.init();
}

// Add missing translations to I18N if it exists
if (typeof I18N !== 'undefined' && I18N.translations) {
    const biosTranslations = {
        en: {
            'bios_enabled': 'Enabled',
            'bios_disabled': 'Disabled',
            'bios_tab_main': 'Main',
            'bios_tab_advanced': 'Advanced',
            'bios_tab_boot': 'Boot',
            'bios_tab_monitor': 'Monitor',
            'bios_tab_easter': '???',
            'bios_adv_performance': 'Performance Settings',
            'bios_adv_cpu_mode': 'CPU Mode:',
            'bios_adv_memory': 'Memory Mode:',
            'bios_adv_network': 'Network Mode:',
            'bios_mode_performance': 'Performance',
            'bios_mode_balanced': 'Balanced',
            'bios_mode_powersave': 'Power Save',
            'bios_mode_auto': 'Auto',
            'bios_mode_manual': 'Manual',
            'bios_mode_always': 'Always On',
            'bios_mode_ondemand': 'On Demand',
            'bios_adv_features': 'Advanced Features',
            'bios_adv_quick_boot': 'Quick Boot:',
            'bios_adv_verbose': 'Verbose Mode:',
            'bios_adv_auto_login': 'Auto Login:',
            'bios_adv_screensaver': 'Screensaver:',
            'bios_adv_help': 'Advanced settings affect system performance and behavior. Change with caution.',
            'bios_boot_sequence': 'Boot Sequence',
            'bios_boot_order': 'Boot Order:',
            'bios_boot_1': '1st Boot Device: Heart Drive',
            'bios_boot_2': '2nd Boot Device: Memory Vault',
            'bios_boot_3': '3rd Boot Device: Network',
            'bios_boot_options': 'Boot Options',
            'bios_boot_logo': 'Boot Logo:',
            'bios_boot_animation': 'Boot Animation:',
            'bios_boot_sound': 'Boot Sound:',
            'bios_boot_delay': 'Boot Delay:',
            'bios_boot_delay_none': 'None',
            'bios_boot_delay_short': 'Short (2s)',
            'bios_boot_delay_normal': 'Normal (5s)',
            'bios_boot_delay_long': 'Long (10s)',
            'bios_boot_help': 'Configure boot behavior and startup sequence.',
            'bios_mon_display': 'Display Settings',
            'bios_mon_refresh': 'Refresh Rate:',
            'bios_mon_color': 'Color Mode:',
            'bios_mon_crt_effects': 'CRT Effects',
            'bios_mon_crt_intensity': 'CRT Intensity:',
            'bios_mon_scanlines': 'Scanlines:',
            'bios_mon_vignette': 'Vignette:',
            'bios_mon_glow': 'Glow Effect:',
            'bios_intensity_off': 'Off',
            'bios_intensity_low': 'Low',
            'bios_intensity_medium': 'Medium',
            'bios_intensity_high': 'High',
            'bios_color_retro': 'Retro Pink',
            'bios_color_classic': 'Classic Green',
            'bios_color_amber': 'Amber',
            'bios_color_blue': 'Blue',
            'bios_mon_help': 'Adjust visual effects and display settings for optimal viewing.',
            'bios_easter_title': 'Easter Egg',
            'bios_easter_message': 'You found the secret tab!',
            'bios_easter_heart': 'Made with ❤ for us',
            'bios_easter_stats': 'Secret Stats',
            'bios_easter_visits': 'BIOS Visits:',
            'bios_easter_time': 'Time in BIOS:',
            'bios_easter_changes': 'Settings Changed:',
            'bios_easter_quote': '"Love is not about possession. Love is about appreciation." - Osho'
        },
        cs: {
            'bios_enabled': 'Zapnuto',
            'bios_disabled': 'Vypnuto',
            'bios_tab_main': 'Hlavní',
            'bios_tab_advanced': 'Pokročilé',
            'bios_tab_boot': 'Start',
            'bios_tab_monitor': 'Monitor',
            'bios_tab_easter': '???',
            'bios_adv_performance': 'Nastavení výkonu',
            'bios_adv_cpu_mode': 'Režim CPU:',
            'bios_adv_memory': 'Režim paměti:',
            'bios_adv_network': 'Režim sítě:',
            'bios_mode_performance': 'Výkon',
            'bios_mode_balanced': 'Vyvážený',
            'bios_mode_powersave': 'Úspora energie',
            'bios_mode_auto': 'Auto',
            'bios_mode_manual': 'Manuální',
            'bios_mode_always': 'Vždy zapnuto',
            'bios_mode_ondemand': 'Na vyžádání',
            'bios_adv_features': 'Pokročilé funkce',
            'bios_adv_quick_boot': 'Rychlý start:',
            'bios_adv_verbose': 'Podrobný režim:',
            'bios_adv_auto_login': 'Auto přihlášení:',
            'bios_adv_screensaver': 'Šetřič obrazovky:',
            'bios_adv_help': 'Pokročilá nastavení ovlivňují výkon a chování systému. Měňte opatrně.',
            'bios_boot_sequence': 'Pořadí startu',
            'bios_boot_order': 'Pořadí startu:',
            'bios_boot_1': '1. startovací zařízení: Disk srdce',
            'bios_boot_2': '2. startovací zařízení: Trezor vzpomínek',
            'bios_boot_3': '3. startovací zařízení: Síť',
            'bios_boot_options': 'Možnosti startu',
            'bios_boot_logo': 'Logo při startu:',
            'bios_boot_animation': 'Animace startu:',
            'bios_boot_sound': 'Zvuk při startu:',
            'bios_boot_delay': 'Prodleva startu:',
            'bios_boot_delay_none': 'Žádná',
            'bios_boot_delay_short': 'Krátká (2s)',
            'bios_boot_delay_normal': 'Normální (5s)',
            'bios_boot_delay_long': 'Dlouhá (10s)',
            'bios_boot_help': 'Nastavení chování při startu a pořadí spouštění.',
            'bios_mon_display': 'Nastavení displeje',
            'bios_mon_refresh': 'Obnovovací frekvence:',
            'bios_mon_color': 'Barevný režim:',
            'bios_mon_crt_effects': 'CRT efekty',
            'bios_mon_crt_intensity': 'Intenzita CRT:',
            'bios_mon_scanlines': 'Skenovací čáry:',
            'bios_mon_vignette': 'Vinětace:',
            'bios_mon_glow': 'Efekt záře:',
            'bios_intensity_off': 'Vypnuto',
            'bios_intensity_low': 'Nízká',
            'bios_intensity_medium': 'Střední',
            'bios_intensity_high': 'Vysoká',
            'bios_color_retro': 'Retro růžová',
            'bios_color_classic': 'Klasická zelená',
            'bios_color_amber': 'Jantarová',
            'bios_color_blue': 'Modrá',
            'bios_mon_help': 'Upravte vizuální efekty a nastavení displeje pro optimální zobrazení.',
            'bios_easter_title': 'Velikonoční vajíčko',
            'bios_easter_message': 'Našel jsi tajnou záložku!',
            'bios_easter_heart': 'Vytvořeno s ❤ pro nás',
            'bios_easter_stats': 'Tajné statistiky',
            'bios_easter_visits': 'Návštěv BIOSu:',
            'bios_easter_time': 'Čas v BIOSu:',
            'bios_easter_changes': 'Změněná nastavení:',
            'bios_easter_quote': '"Láska není o vlastnictví. Láska je o ocenění." - Osho'
        }
    };
    
    // Merge translations
    Object.keys(biosTranslations).forEach(lang => {
        if (I18N.translations[lang]) {
            Object.assign(I18N.translations[lang], biosTranslations[lang]);
        }
    });
}

console.log('✓ BIOS fully i18n loaded with all tabs');
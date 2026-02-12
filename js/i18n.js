/* js/i18n.js - HeartOS Internationalization */
const I18N = {
    currentLang: localStorage.getItem('heartosLang') || 'en',

    translations: {
        en: {
            // BIOS
            bios_title: "HeartOS BIOS Setup Utility",
            bios_version: "BIOS Version 3.0 ❤",
            bios_language: "System Language",
            bios_english: "English",
            bios_czech: "Čeština",
            bios_save: "Save & Exit",
            bios_continue: "Continue Boot",
            bios_hint: "Press DEL during boot to enter BIOS",
            bios_saved: "Settings saved!",
            bios_lang_label: "Language:",
            bios_nav: "Use mouse to change settings",

            // Boot
            boot_line1: "♥ INITIALIZING HEARTOS v3.0...",
            boot_line2: "► CHECKING SYSTEM INTEGRITY... OK",
            boot_line3: "► LOADING EMOTIONAL CORE... OK",
            boot_line4: "► MOUNTING MEMORY DRIVES... OK",
            boot_line5: "► ESTABLISHING CONNECTION... OK",
            boot_line6: "► DECRYPTING VAULT... OK",
            boot_line7: "♥ SYSTEM READY - WELCOME BACK ♥",
            boot_bios_hint: "Press DEL to enter BIOS Setup...",

            // Login
            login_title: "SYSTEM LOGIN",
            login_user: "User:",
            login_pass: "Pass:",
            login_user_placeholder: "Player 2",
            login_pass_placeholder: "****",
            login_btn: "Log In",

            // Desktop
            desktop_history: "History",
            desktop_photos: "Photos",
            desktop_secrets: "Secrets",
            desktop_map: "Map",
            desktop_terminal: "Terminal",
            desktop_heartamp: "HeartAmp",
            desktop_browser: "Browser",
            start_restart: "🔄 Restart",
            start_logoff: "🚪 Log Off",
            start_btn: "♥ Start",

            // Windows
            win_history: "History.exe",
            win_gallery: "C:\\Users\\Naeem\\Pictures\\",
            win_letters: "Secure_Logs",
            win_map: "Mission: Prague",
            win_browser: "🌐 HeartOS Browser",
            win_terminal: "ADMIN_TERMINAL",
            win_streamer: "Stream_Connection",
            win_heartamp: "HeartAmp",

            // Widget
            widget_countdown: "⏰ Countdown",
            widget_click_set: "Click to set",
            widget_its_today: "IT'S TODAY!",
            widget_days: "days",
            widget_prompt_title: "What are you counting down to?",
            widget_prompt_date: "Date (YYYY-MM-DD):",
            widget_prompt_time: "Time (HH:MM):",
            widget_invalid_date: "Invalid date!",
            widget_default_title: "Next Meeting",

            // Lightbox
            lightbox_caption: "...",

            // Empty state
            empty_chat: "Select a chat to start messaging"
        },
        cs: {
            // BIOS
            bios_title: "HeartOS BIOS Nastavení",
            bios_version: "BIOS Verze 3.0 ❤",
            bios_language: "Jazyk systému",
            bios_english: "English",
            bios_czech: "Čeština",
            bios_save: "Uložit a ukončit",
            bios_continue: "Pokračovat",
            bios_hint: "Stiskněte DEL během startu pro vstup do BIOSu",
            bios_saved: "Nastavení uloženo!",
            bios_lang_label: "Jazyk:",
            bios_nav: "Použijte myš ke změně nastavení",

            // Boot
            boot_line1: "♥ INICIALIZACE HEARTOS v3.0...",
            boot_line2: "► KONTROLA INTEGRITY SYSTÉMU... OK",
            boot_line3: "► NAČÍTÁNÍ EMOČNÍHO JÁDRA... OK",
            boot_line4: "► PŘIPOJOVÁNÍ PAMĚŤOVÝCH DISKŮ... OK",
            boot_line5: "► NAVAZOVÁNÍ SPOJENÍ... OK",
            boot_line6: "► DEŠIFROVÁNÍ TREZORU... OK",
            boot_line7: "♥ SYSTÉM PŘIPRAVEN - VÍTEJ ZPĚT ♥",
            boot_bios_hint: "Stiskněte DEL pro vstup do BIOSu...",

            // Login
            login_title: "PŘIHLÁŠENÍ DO SYSTÉMU",
            login_user: "Uživatel:",
            login_pass: "Heslo:",
            login_user_placeholder: "Hráč 2",
            login_pass_placeholder: "****",
            login_btn: "Přihlásit se",

            // Desktop
            desktop_history: "Historie",
            desktop_photos: "Fotky",
            desktop_secrets: "Tajemství",
            desktop_map: "Mapa",
            desktop_terminal: "Terminál",
            desktop_heartamp: "HeartAmp",
            desktop_browser: "Prohlížeč",
            start_restart: "🔄 Restartovat",
            start_logoff: "🚪 Odhlásit se",
            start_btn: "♥ Start",

            // Windows
            win_history: "Historie.exe",
            win_gallery: "C:\\Uživatelé\\Naeem\\Obrázky\\",
            win_letters: "Tajné_Záznamy",
            win_map: "Mise: Praha",
            win_browser: "🌐 HeartOS Prohlížeč",
            win_terminal: "ADMIN_TERMINÁL",
            win_streamer: "Připojení_Streamu",
            win_heartamp: "HeartAmp",

            // Widget
            widget_countdown: "⏰ Odpočítávání",
            widget_click_set: "Klikni pro nastavení",
            widget_its_today: "JE TO DNES!",
            widget_days: "dní",
            widget_prompt_title: "K čemu odpočítáváš?",
            widget_prompt_date: "Datum (RRRR-MM-DD):",
            widget_prompt_time: "Čas (HH:MM):",
            widget_invalid_date: "Neplatné datum!",
            widget_default_title: "Další setkání",

            // Lightbox
            lightbox_caption: "...",

            // Empty state
            empty_chat: "Vyber chat a začni psát"
        }
    },

    t: function(key) {
        const lang = this.translations[this.currentLang];
        return (lang && lang[key]) || this.translations.en[key] || key;
    },

    setLang: function(lang) {
        console.log('I18N.setLang called with:', lang);
        if (lang !== 'en' && lang !== 'cs') {
            console.error('Invalid language:', lang);
            return;
        }
        this.currentLang = lang;
        localStorage.setItem('heartosLang', lang);
        console.log('Language set to:', this.currentLang);
        console.log('LocalStorage updated:', localStorage.getItem('heartosLang'));
    },

    applyToPage: function() {
        console.log('I18N.applyToPage called, current lang:', this.currentLang);
        
        // Login screen
        const loginTitle = document.querySelector('#login-screen .window-bar span');
        if (loginTitle) loginTitle.textContent = this.t('login_title');

        const loginLabels = document.querySelectorAll('#login-screen .os-input-group label');
        if (loginLabels[0]) loginLabels[0].textContent = this.t('login_user');
        if (loginLabels[1]) loginLabels[1].textContent = this.t('login_pass');

        const usernameInput = document.getElementById('username');
        if (usernameInput) usernameInput.placeholder = this.t('login_user_placeholder');

        const passwordInput = document.getElementById('password');
        if (passwordInput) passwordInput.placeholder = this.t('login_pass_placeholder');

        const loginBtn = document.querySelector('#login-screen .os-btn');
        if (loginBtn) loginBtn.textContent = this.t('login_btn');

        // Desktop icons
        const iconLabels = document.querySelectorAll('.desktop-icon div');
        const iconKeys = ['desktop_history', 'desktop_photos', 'desktop_secrets', 'desktop_map', 'desktop_terminal', 'desktop_heartamp', 'desktop_browser'];
        iconLabels.forEach((label, i) => {
            if (iconKeys[i]) label.textContent = this.t(iconKeys[i]);
        });

        // Window titles
        const winMap = {
            'win-timeline': 'win_history',
            'win-gallery': 'win_gallery',
            'win-letters': 'win_letters',
            'win-map': 'win_map',
            'win-browser': 'win_browser',
            'win-quiz': 'win_terminal',
            'win-streamer': 'win_streamer',
            'win-amp': 'win_heartamp'
        };
        Object.entries(winMap).forEach(([winId, key]) => {
            const win = document.getElementById(winId);
            if (win) {
                const titleSpan = win.querySelector('.window-bar span');
                if (titleSpan) titleSpan.textContent = this.t(key);
            }
        });

        // Start menu
        const startItems = document.querySelectorAll('.start-item');
        if (startItems[0]) startItems[0].textContent = this.t('start_restart');
        if (startItems[1]) startItems[1].textContent = this.t('start_logoff');

        const startBtn = document.querySelector('.start-btn');
        if (startBtn) startBtn.textContent = this.t('start_btn');
    }
};

// Log when I18N is loaded
console.log('I18N module loaded, default language:', I18N.currentLang);
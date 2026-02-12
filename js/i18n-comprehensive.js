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

            // Browser
            browser_home: "Home",
            browser_back: "Back",
            browser_forward: "Forward",
            browser_refresh: "Refresh",
            browser_address: "Enter URL...",
            browser_search: "Search or enter URL",
            browser_loading: "Loading...",
            browser_error: "Page not found",
            browser_bookmarks: "Bookmarks",
            browser_history: "History",
            browser_settings: "Settings",

            // Gallery
            gallery_loading: "Loading photos...",
            gallery_no_photos: "No photos found",
            gallery_view: "View",
            gallery_download: "Download",
            gallery_delete: "Delete",
            gallery_upload: "Upload",
            gallery_slideshow: "Slideshow",

            // Music Player (HeartAmp)
            music_play: "Play",
            music_pause: "Pause",
            music_next: "Next",
            music_prev: "Previous",
            music_shuffle: "Shuffle",
            music_repeat: "Repeat",
            music_volume: "Volume",
            music_playlist: "Playlist",
            music_now_playing: "Now Playing",
            music_no_songs: "No songs available",

            // Map
            map_title: "Mission: Prague",
            map_loading: "Loading map...",
            map_zoom_in: "Zoom In",
            map_zoom_out: "Zoom Out",
            map_center: "Center",
            map_satellite: "Satellite",
            map_terrain: "Terrain",
            map_locations: "Locations",
            map_route: "Route",

            // Terminal
            terminal_welcome: "Welcome to HeartOS Terminal",
            terminal_type_help: "Type 'help' for commands",
            terminal_command: "Command:",
            terminal_output: "Output:",
            terminal_error: "Error:",
            terminal_clear: "Clear",
            terminal_history: "History",

            // Letters/Secrets
            letters_title: "Secure Messages",
            letters_new: "New Message",
            letters_reply: "Reply",
            letters_delete: "Delete",
            letters_save: "Save",
            letters_from: "From:",
            letters_to: "To:",
            letters_subject: "Subject:",
            letters_date: "Date:",
            letters_no_messages: "No messages",

            // Timeline/History
            timeline_title: "Our History",
            timeline_today: "Today",
            timeline_week: "This Week",
            timeline_month: "This Month",
            timeline_year: "This Year",
            timeline_all: "All Time",
            timeline_event: "Event",
            timeline_memory: "Memory",
            timeline_milestone: "Milestone",

            // Common buttons
            btn_ok: "OK",
            btn_cancel: "Cancel",
            btn_save: "Save",
            btn_delete: "Delete",
            btn_edit: "Edit",
            btn_close: "Close",
            btn_open: "Open",
            btn_submit: "Submit",
            btn_send: "Send",
            btn_back: "Back",
            btn_next: "Next",
            btn_yes: "Yes",
            btn_no: "No",

            // Common messages
            msg_loading: "Loading...",
            msg_saving: "Saving...",
            msg_saved: "Saved successfully!",
            msg_error: "An error occurred",
            msg_success: "Success!",
            msg_confirm: "Are you sure?",
            msg_welcome: "Welcome!",

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
            win_letters: "Tajné_Zprávy",
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

            // Browser
            browser_home: "Domů",
            browser_back: "Zpět",
            browser_forward: "Vpřed",
            browser_refresh: "Obnovit",
            browser_address: "Zadejte URL...",
            browser_search: "Hledat nebo zadat URL",
            browser_loading: "Načítání...",
            browser_error: "Stránka nenalezena",
            browser_bookmarks: "Záložky",
            browser_history: "Historie",
            browser_settings: "Nastavení",

            // Gallery
            gallery_loading: "Načítání fotek...",
            gallery_no_photos: "Žádné fotky nenalezeny",
            gallery_view: "Zobrazit",
            gallery_download: "Stáhnout",
            gallery_delete: "Smazat",
            gallery_upload: "Nahrát",
            gallery_slideshow: "Prezentace",

            // Music Player (HeartAmp)
            music_play: "Přehrát",
            music_pause: "Pauza",
            music_next: "Další",
            music_prev: "Předchozí",
            music_shuffle: "Náhodně",
            music_repeat: "Opakovat",
            music_volume: "Hlasitost",
            music_playlist: "Seznam skladeb",
            music_now_playing: "Právě hraje",
            music_no_songs: "Žádné skladby nejsou k dispozici",

            // Map
            map_title: "Mise: Praha",
            map_loading: "Načítání mapy...",
            map_zoom_in: "Přiblížit",
            map_zoom_out: "Oddálit",
            map_center: "Vycentrovat",
            map_satellite: "Satelit",
            map_terrain: "Terén",
            map_locations: "Místa",
            map_route: "Trasa",

            // Terminal
            terminal_welcome: "Vítejte v HeartOS Terminálu",
            terminal_type_help: "Napište 'help' pro příkazy",
            terminal_command: "Příkaz:",
            terminal_output: "Výstup:",
            terminal_error: "Chyba:",
            terminal_clear: "Vymazat",
            terminal_history: "Historie",

            // Letters/Secrets
            letters_title: "Zabezpečené zprávy",
            letters_new: "Nová zpráva",
            letters_reply: "Odpovědět",
            letters_delete: "Smazat",
            letters_save: "Uložit",
            letters_from: "Od:",
            letters_to: "Komu:",
            letters_subject: "Předmět:",
            letters_date: "Datum:",
            letters_no_messages: "Žádné zprávy",

            // Timeline/History
            timeline_title: "Naše historie",
            timeline_today: "Dnes",
            timeline_week: "Tento týden",
            timeline_month: "Tento měsíc",
            timeline_year: "Tento rok",
            timeline_all: "Celá doba",
            timeline_event: "Událost",
            timeline_memory: "Vzpomínka",
            timeline_milestone: "Milník",

            // Common buttons
            btn_ok: "OK",
            btn_cancel: "Zrušit",
            btn_save: "Uložit",
            btn_delete: "Smazat",
            btn_edit: "Upravit",
            btn_close: "Zavřít",
            btn_open: "Otevřít",
            btn_submit: "Odeslat",
            btn_send: "Poslat",
            btn_back: "Zpět",
            btn_next: "Další",
            btn_yes: "Ano",
            btn_no: "Ne",

            // Common messages
            msg_loading: "Načítání...",
            msg_saving: "Ukládání...",
            msg_saved: "Úspěšně uloženo!",
            msg_error: "Došlo k chybě",
            msg_success: "Úspěch!",
            msg_confirm: "Jste si jistí?",
            msg_welcome: "Vítejte!",

            // Lightbox
            lightbox_caption: "...",

            // Empty state
            empty_chat: "Vyberte chat a začněte psát"
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
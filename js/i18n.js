/* js/i18n.js - HeartOS Internationalization */
const I18N = {
    currentLang: localStorage.getItem('heartosLang') || 'en',

    translations: {
        en: {
            // BIOS
            bios_title: "HeartOS BIOS Setup Utility",
            bios_version: "BIOS Version 3.0 \u2764",
            bios_language: "System Language",
            bios_english: "English",
            bios_czech: "\u010Ce\u0161tina",
            bios_save: "Save & Exit",
            bios_continue: "Continue Boot",
            bios_hint: "Press DEL during boot to enter BIOS",
            bios_saved: "Settings saved!",
            bios_lang_label: "Language:",
            bios_nav: "Use mouse to change settings",

            // Boot
            boot_line1: "\u2665 INITIALIZING HEARTOS v3.0...",
            boot_line2: "\u25BA CHECKING SYSTEM INTEGRITY... OK",
            boot_line3: "\u25BA LOADING EMOTIONAL CORE... OK",
            boot_line4: "\u25BA MOUNTING MEMORY DRIVES... OK",
            boot_line5: "\u25BA ESTABLISHING CONNECTION... OK",
            boot_line6: "\u25BA DECRYPTING VAULT... OK",
            boot_line7: "\u2665 SYSTEM READY - WELCOME BACK \u2665",
            boot_bios_hint: "Press DEL to enter BIOS Setup...",

            // Login
            login_title: "SYSTEM LOGIN",
            login_user: "User:",
            login_pass: "Pass:",
            login_user_placeholder: "Player 2",
            login_pass_placeholder: "****",
            login_btn: "Log In",

            // Desktop
            desktop_history: "Achievements",
            desktop_photos: "Photos",
            desktop_secrets: "Secrets",
            desktop_map: "Map",
            desktop_terminal: "Terminal",
            desktop_heartamp: "HeartAmp",
            desktop_browser: "Browser",
            start_restart: "\uD83D\uDD04 Restart",
            start_logoff: "\uD83D\uDEAA Log Off",
            start_btn: "\u2665 Start",

            // Windows
            win_history: "Achievements.exe",
            win_gallery: "C:\\Users\\Naeem\\Pictures\\",
            win_letters: "Secure_Logs",
            win_map: "Mission: Prague",
            win_browser: "\uD83C\uDF10 HeartOS Browser",
            win_terminal: "ADMIN_TERMINAL",
            win_streamer: "Stream_Connection",
            win_heartamp: "HeartAmp",

            // Achievements
            achievements_title: "Achievements",
            ach_login: "Logged in",
            ach_open_ach: "Opened Achievements",
            ach_open_heartamp: "Opened HeartAmp",
            ach_open_terminal: "Opened Terminal",
            ach_unlock_secrets: "Unlocked Secrets",
            ach_open_map: "Opened Map",
            ach_open_message: "Opened Message",
            ach_open_browser: "Opened Browser",
            ach_open_photos: "Opened Photos",


            // Widget
            widget_countdown: "\u23F0 Countdown",
            widget_click_set: "Click to set",
            widget_its_today: "IT'S TODAY!",
            widget_days: "days",
            widget_prompt_title: "What are you counting down to?",
            widget_prompt_date: "Date (YYYY-MM-DD):",
            widget_prompt_time: "Time (HH:MM):",
            widget_invalid_date: "Invalid date!",
            widget_default_title: "Next Meeting",

            // Browser - toolbar & navigation
            browser_home: "Home",
            browser_back: "Back",
            browser_forward: "Forward",
            browser_refresh: "Refresh",
            browser_address: "Enter URL...",
            browser_search: "Search or enter URL...",
            browser_search_btn: "Search",
            browser_loading: "Loading...",
            browser_error: "Page not found",
            browser_bookmarks: "Bookmarks",
            browser_history: "History",
            browser_settings: "Settings",
            browser_new_tab: "New Tab",
            browser_cant_close_last: "Can't close the last tab!",
            browser_back_soon: "Back button - history coming soon!",
            browser_forward_soon: "Forward button - history coming soon!",
            browser_zoom_in: "Zoom In (Ctrl +)",
            browser_zoom_out: "Zoom Out (Ctrl -)",
            browser_zoom_reset: "Reset Zoom (Ctrl 0)",
            browser_welcome: "Welcome to HeartOS Browser",
            browser_welcome_sub: "Your personalized internet experience",
            browser_recent: "Recent Searches",
            browser_searching: "Searching for",
            browser_redirecting: "Redirecting to Google...",
            browser_footer: "Made with love for our journey together",

            // Browser - homepage cards
            browser_card_email: "Check emails",
            browser_card_insta: "Share moments",
            browser_card_spotify: "Our music",
            browser_card_whatsapp: "Stay connected",
            browser_card_youtube: "Watch together",
            browser_card_maps: "Plan trips",
            browser_card_amazon: "Shop online",
            browser_card_netflix: "Movie night",
            browser_card_linkedin: "Professional",
            browser_card_twitter: "Social feed",
            browser_card_reddit: "Communities",
            browser_card_places_title: "Our Places",
            browser_card_places: "Memories",

            // Browser - Our Places page
            places_title: "Our Places Around the World",
            places_subtitle: "Every pin tells a story of us",
            places_prague: "Prague, Czechia",
            places_prague_desc: "Where your heart calls home",
            places_cape_town: "Cape Town, South Africa",
            places_cape_town_desc: "Where adventure begins",
            places_distance: "Distance",
            places_hours: "hours",
            places_future: "Future Dreams",
            places_future_desc: "Places we'll explore",
            places_open_maps: "Open in Maps",
            places_view_route: "View Route",
            places_plan: "Plan Adventure",
            places_coming_soon: "Coming soon: Bucket list planner!",
            places_journey: "Our Journey So Far",
            places_july_2024: "July 2024 - First Visit to Czechia",
            places_july_2024_desc: "Where it all began. Prague, Brno, and unforgettable memories.",
            places_dec_2024: "December 2024 - Winter Magic",
            places_dec_2024_desc: "Snow, warmth, and cozy moments together.",
            places_future_together: "Future - Forever Together",
            places_future_together_desc: "More adventures await...",

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
            bios_title: "HeartOS BIOS Nastaven\u00ED",
            bios_version: "BIOS Verze 3.0 \u2764",
            bios_language: "Jazyk syst\u00E9mu",
            bios_english: "English",
            bios_czech: "\u010Ce\u0161tina",
            bios_save: "Ulo\u017Eit a ukon\u010Dit",
            bios_continue: "Pokra\u010Dovat",
            bios_hint: "Stiskn\u011Bte DEL b\u011Bhem startu pro vstup do BIOSu",
            bios_saved: "Nastaven\u00ED ulo\u017Eeno!",
            bios_lang_label: "Jazyk:",
            bios_nav: "Pou\u017Eijte my\u0161 ke zm\u011Bn\u011B nastaven\u00ED",

            // Boot
            boot_line1: "\u2665 INICIALIZACE HEARTOS v3.0...",
            boot_line2: "\u25BA KONTROLA INTEGRITY SYST\u00C9MU... OK",
            boot_line3: "\u25BA NA\u010C\u00CDT\u00C1N\u00CD EMO\u010CN\u00CDHO J\u00C1DRA... OK",
            boot_line4: "\u25BA P\u0158IPOJOV\u00C1N\u00CD PAM\u011A\u0164OV\u00DDCH DISK\u016E... OK",
            boot_line5: "\u25BA NAVAZOV\u00C1N\u00CD SPOJEN\u00CD... OK",
            boot_line6: "\u25BA DE\u0160IFROV\u00C1N\u00CD TREZORU... OK",
            boot_line7: "\u2665 SYST\u00C9M P\u0158IPRAVEN - V\u00CDTEJ ZP\u011AT \u2665",
            boot_bios_hint: "Stiskn\u011Bte DEL pro vstup do BIOSu...",

            // Login
            login_title: "P\u0158IHL\u00C1\u0160EN\u00CD DO SYST\u00C9MU",
            login_user: "U\u017Eivatel:",
            login_pass: "Heslo:",
            login_user_placeholder: "Hr\u00E1\u010D 2",
            login_pass_placeholder: "****",
            login_btn: "P\u0159ihl\u00E1sit se",

            // Desktop
            desktop_history: "Úspěchy",
            desktop_photos: "Fotky",
            desktop_secrets: "Tajemstv\u00ED",
            desktop_map: "Mapa",
            desktop_terminal: "Termin\u00E1l",
            desktop_heartamp: "HeartAmp",
            desktop_browser: "Prohl\u00ED\u017Ee\u010D",
            start_restart: "\uD83D\uDD04 Restartovat",
            start_logoff: "\uD83D\uDEAA Odhl\u00E1sit se",
            start_btn: "\u2665 Start",

            // Windows
            win_gallery: "C:\\U\u017Eivatel\u00E9\\Naeem\\Obr\u00E1zky\\",
            win_letters: "Tajn\u00E9_Z\u00E1znamy",
            win_map: "Mise: Praha",
            win_browser: "\uD83C\uDF10 HeartOS Prohl\u00ED\u017Ee\u010D",
            win_terminal: "ADMIN_TERMIN\u00C1L",
            win_streamer: "P\u0159ipojen\u00ED_Streamu",
            win_heartamp: "HeartAmp",

            // Achievements
            achievements_title: "Úspěchy",
            ach_login: "Přihlášení",
            ach_open_ach: "Otevřené Úspěchy",
            ach_open_heartamp: "Otevřený HeartAmp",
            ach_open_terminal: "Otevřený Terminál",
            ach_unlock_secrets: "Odemčené Tajemství",
            ach_open_map: "Otevřená Mapa",
            ach_open_message: "Otevřená Zpráva",
            ach_open_browser: "Otevřený Prohlížeč",
            ach_open_photos: "Otevřené Fotky",

            // Widget
            widget_countdown: "\u23F0 Odpo\u010D\u00EDt\u00E1v\u00E1n\u00ED",
            widget_click_set: "Klikni pro nastaven\u00ED",
            widget_its_today: "JE TO DNES!",
            widget_days: "dn\u00ED",
            widget_prompt_title: "K \u010Demu odpo\u010D\u00EDt\u00E1v\u00E1\u0161?",
            widget_prompt_date: "Datum (RRRR-MM-DD):",
            widget_prompt_time: "\u010Cas (HH:MM):",
            widget_invalid_date: "Neplatn\u00E9 datum!",
            widget_default_title: "Dal\u0161\u00ED setk\u00E1n\u00ED",

            // Browser - toolbar & navigation
            browser_home: "Dom\u016F",
            browser_back: "Zp\u011Bt",
            browser_forward: "Vp\u0159ed",
            browser_refresh: "Obnovit",
            browser_address: "Zadejte URL...",
            browser_search: "Hledat nebo zadat URL...",
            browser_search_btn: "Hledat",
            browser_loading: "Na\u010D\u00EDt\u00E1n\u00ED...",
            browser_error: "Str\u00E1nka nenalezena",
            browser_bookmarks: "Z\u00E1lo\u017Eky",
            browser_history: "Historie",
            browser_settings: "Nastaven\u00ED",
            browser_new_tab: "Nov\u00E1 karta",
            browser_cant_close_last: "Nelze zav\u0159\u00EDt posledn\u00ED kartu!",
            browser_back_soon: "Tla\u010D\u00EDtko zp\u011Bt - historie bude brzy!",
            browser_forward_soon: "Tla\u010D\u00EDtko vp\u0159ed - historie bude brzy!",
            browser_zoom_in: "P\u0159ibl\u00ED\u017Eit (Ctrl +)",
            browser_zoom_out: "Odd\u00E1lit (Ctrl -)",
            browser_zoom_reset: "Obnovit zoom (Ctrl 0)",
            browser_welcome: "V\u00EDtej v HeartOS Prohl\u00ED\u017Ee\u010Di",
            browser_welcome_sub: "Tv\u016Fj osobn\u00ED internetov\u00FD z\u00E1\u017Eitek",
            browser_recent: "Ned\u00E1vn\u00E9 hled\u00E1n\u00ED",
            browser_searching: "Hled\u00E1m",
            browser_redirecting: "P\u0159esm\u011Brov\u00E1n\u00ED na Google...",
            browser_footer: "Vytvo\u0159eno s l\u00E1skou pro na\u0161i spole\u010Dnou cestu",

            // Browser - homepage cards
            browser_card_email: "Zkontrolovat emaily",
            browser_card_insta: "Sd\u00EDlet momenty",
            browser_card_spotify: "Na\u0161e hudba",
            browser_card_whatsapp: "Z\u016Fstat ve spojen\u00ED",
            browser_card_youtube: "Koukat spolu",
            browser_card_maps: "Pl\u00E1novat v\u00FDlety",
            browser_card_amazon: "Nakupovat online",
            browser_card_netflix: "Filmov\u00FD ve\u010Der",
            browser_card_linkedin: "Profesion\u00E1ln\u00ED",
            browser_card_twitter: "Soci\u00E1ln\u00ED feed",
            browser_card_reddit: "Komunity",
            browser_card_places_title: "Na\u0161e m\u00EDsta",
            browser_card_places: "Vzpom\u00EDnky",

            // Browser - Our Places page
            places_title: "Na\u0161e m\u00EDsta po cel\u00E9m sv\u011Bt\u011B",
            places_subtitle: "Ka\u017Ed\u00FD \u0161pendl\u00EDk vypr\u00E1v\u00ED n\u00E1\u0161 p\u0159\u00EDb\u011Bh",
            places_prague: "Praha, \u010Cesko",
            places_prague_desc: "Kde tv\u00E9 srdce vol\u00E1 domov",
            places_cape_town: "Kapsk\u00E9 M\u011Bsto, Ji\u017En\u00ED Afrika",
            places_cape_town_desc: "Kde za\u010D\u00EDn\u00E1 dobrodru\u017Estv\u00ED",
            places_distance: "Vzd\u00E1lenost",
            places_hours: "hodin",
            places_future: "Budouc\u00ED sny",
            places_future_desc: "M\u00EDsta, kter\u00E1 prozkoum\u00E1me",
            places_open_maps: "Otev\u0159\u00EDt v Map\u00E1ch",
            places_view_route: "Zobrazit trasu",
            places_plan: "Pl\u00E1novat dobrodru\u017Estv\u00ED",
            places_coming_soon: "Ji\u017E brzy: Pl\u00E1nova\u010D bucket listu!",
            places_journey: "Na\u0161e cesta dosud",
            places_july_2024: "\u010Cervenec 2024 - Prvn\u00ED n\u00E1v\u0161t\u011Bva \u010Ceska",
            places_july_2024_desc: "Kde to v\u0161echno za\u010Dalo. Praha, Brno a nezapomenuteln\u00E9 vzpom\u00EDnky.",
            places_dec_2024: "Prosinec 2024 - Zimn\u00ED kouzlo",
            places_dec_2024_desc: "Sn\u00EDh, teplo a \u00FAtulnosti spolu.",
            places_future_together: "Budoucnost - Nav\u017Edy spolu",
            places_future_together_desc: "Dal\u0161\u00ED dobrodru\u017Estv\u00ED \u010Dekaj\u00ED...",

            // Map (extra UI)
            map_love_title: "💕 LOVE MAP",
            map_view_czechia_title: "🇨🇿 CZECHIA",
            map_view_capetown_title: "🇿🇦 CAPE TOWN",
            map_back_world: "← WORLD MAP",

            map_distance: "📡  9,678 km apart — but who's counting",
            map_city_capetown: "Cape Town 🇿🇦",
            map_city_prague: "Prague 🇨🇿",

            // Map (extra UI)
            map_love_title: "💕 MAPA LÁSKY",
            map_view_czechia_title: "🇨🇿 ČESKO",
            map_view_capetown_title: "🇿🇦 KAPSKÉ MĚSTO",
            map_back_world: "← SVĚTOVÁ MAPA",

            map_distance: "📡  9 678 km od sebe — ale kdo by to počítal",
            map_city_capetown: "Kapské Město 🇿🇦",
            map_city_prague: "Praha 🇨🇿",

            // Gallery
            gallery_loading: "Na\u010D\u00EDt\u00E1n\u00ED fotek...",
            gallery_no_photos: "\u017D\u00E1dn\u00E9 fotky nenalezeny",
            gallery_view: "Zobrazit",
            gallery_download: "St\u00E1hnout",
            gallery_delete: "Smazat",
            gallery_upload: "Nahr\u00E1t",
            gallery_slideshow: "Prezentace",

            // Music Player (HeartAmp)
            music_play: "P\u0159ehr\u00E1t",
            music_pause: "Pauza",
            music_next: "Dal\u0161\u00ED",
            music_prev: "P\u0159edchoz\u00ED",
            music_shuffle: "N\u00E1hodn\u011B",
            music_repeat: "Opakovat",
            music_volume: "Hlasitost",
            music_playlist: "Seznam skladeb",
            music_now_playing: "Pr\u00E1v\u011B hraje",
            music_no_songs: "\u017D\u00E1dn\u00E9 skladby nejsou k dispozici",

            // Map
            map_title: "Mise: Praha",
            map_loading: "Na\u010D\u00EDt\u00E1n\u00ED mapy...",
            map_zoom_in: "P\u0159ibl\u00ED\u017Eit",
            map_zoom_out: "Odd\u00E1lit",
            map_center: "Vycentrovat",
            map_satellite: "Satelit",
            map_terrain: "Ter\u00E9n",
            map_locations: "M\u00EDsta",
            map_route: "Trasa",

            // Terminal
            terminal_welcome: "V\u00EDtejte v HeartOS Termin\u00E1lu",
            terminal_type_help: "Napi\u0161te 'help' pro p\u0159\u00EDkazy",
            terminal_command: "P\u0159\u00EDkaz:",
            terminal_output: "V\u00FDstup:",
            terminal_error: "Chyba:",
            terminal_clear: "Vymazat",
            terminal_history: "Historie",

            // Letters/Secrets
            letters_title: "Zabezpe\u010Den\u00E9 zpr\u00E1vy",
            letters_new: "Nov\u00E1 zpr\u00E1va",
            letters_reply: "Odpov\u011Bd\u011Bt",
            letters_delete: "Smazat",
            letters_save: "Ulo\u017Eit",
            letters_from: "Od:",
            letters_to: "Komu:",
            letters_subject: "P\u0159edm\u011Bt:",
            letters_date: "Datum:",
            letters_no_messages: "\u017D\u00E1dn\u00E9 zpr\u00E1vy",

            // Timeline/History
            timeline_title: "Na\u0161e historie",
            timeline_today: "Dnes",
            timeline_week: "Tento t\u00FDden",
            timeline_month: "Tento m\u011Bs\u00EDc",
            timeline_year: "Tento rok",
            timeline_all: "Cel\u00E1 doba",
            timeline_event: "Ud\u00E1lost",
            timeline_memory: "Vzpom\u00EDnka",
            timeline_milestone: "Miln\u00EDk",

            // Common buttons
            btn_ok: "OK",
            btn_cancel: "Zru\u0161it",
            btn_save: "Ulo\u017Eit",
            btn_delete: "Smazat",
            btn_edit: "Upravit",
            btn_close: "Zav\u0159\u00EDt",
            btn_open: "Otev\u0159\u00EDt",
            btn_submit: "Odeslat",
            btn_send: "Poslat",
            btn_back: "Zp\u011Bt",
            btn_next: "Dal\u0161\u00ED",
            btn_yes: "Ano",
            btn_no: "Ne",

            // Common messages
            msg_loading: "Na\u010D\u00EDt\u00E1n\u00ED...",
            msg_saving: "Ukl\u00E1d\u00E1n\u00ED...",
            msg_saved: "\u00DAsp\u011B\u0161n\u011B ulo\u017Eeno!",
            msg_error: "Do\u0161lo k chyb\u011B",
            msg_success: "\u00DAsp\u011Bch!",
            msg_confirm: "Jste si jist\u00ED?",
            msg_welcome: "V\u00EDtejte!",

            // Lightbox
            lightbox_caption: "...",

            // Empty state
            empty_chat: "Vyber chat a za\u010Dni ps\u00E1t"
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

console.log('I18N module loaded, default language:', I18N.currentLang);
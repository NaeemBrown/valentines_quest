// js/new-features.js

window.ACHIEVEMENTS = {
    key: 'heartos_achievements_v1',
    items: [
        { id: 'login',           key: 'ach_login',          fallback: 'Logged in' },
        { id: 'open_achievements', key: 'ach_open_ach',     fallback: 'Opened Achievements' },
        { id: 'open_heartamp',   key: 'ach_open_heartamp',  fallback: 'Opened HeartAmp' },
        { id: 'open_terminal',   key: 'ach_open_terminal',  fallback: 'Opened Terminal' },
        { id: 'unlock_secrets',  key: 'ach_unlock_secrets', fallback: 'Unlocked Secrets' },
        { id: 'open_map',        key: 'ach_open_map',       fallback: 'Opened Map' },
        { id: 'open_message',    key: 'ach_open_message',   fallback: 'Opened Message' },
        { id: 'open_browser',    key: 'ach_open_browser',   fallback: 'Opened Browser' },
        { id: 'open_photos',     key: 'ach_open_photos',    fallback: 'Opened Photos' }
    ],

    _load() {
        try { return JSON.parse(localStorage.getItem(this.key) || '{}'); }
        catch { return {}; }
    },

    _save(state) {
        localStorage.setItem(this.key, JSON.stringify(state));
    },

    init() {
        this.render();
        window.addEventListener('languageChanged', () => this.render());
        window.addEventListener('languageChanged', () => this._rerenderIfOpen());
    },

    _rerenderIfOpen() {
        const win = document.getElementById('win-timeline');
        if (win && !win.classList.contains('hidden')) this.render();
    },

    mark(id) {
        const state = this._load();
        state[id] = true;
        this._save(state);
        this.render();
    },

    toggle(id) {
        const state = this._load();
        state[id] = !state[id];
        this._save(state);
        this.render();
    },

    render() {
        const container = document.getElementById('timeline-content');
        if (!container) return;

        const t = (typeof I18N !== 'undefined' && I18N.t) ? I18N.t.bind(I18N) : (k) => k;
        const state = this._load();

        const title = (t('achievements_title') !== 'achievements_title')
            ? t('achievements_title')
            : 'Achievements';

        container.innerHTML = `
            <div style="padding:16px;">
                <div style="font-family:'VT323',monospace;font-size:2rem;color:var(--accent);margin-bottom:10px;">
                    🏆 ${title}
                </div>
                <div id="ach-list" style="display:flex;flex-direction:column;gap:10px;"></div>
                <div style="margin-top:14px;opacity:0.7;font-size:0.95rem;">
                    Click an item to tick/untick it.
                </div>
            </div>
        `;

        const list = container.querySelector('#ach-list');

        this.items.forEach(item => {
            const done = !!state[item.id];
            const label = (t(item.key) !== item.key) ? t(item.key) : item.fallback;

            const row = document.createElement('div');
            row.setAttribute('data-ach', item.id);
            row.style.cssText = `
                border:1px solid rgba(255,77,109,0.35);
                background: rgba(0,0,0,0.25);
                padding:12px 14px;
                cursor:pointer;
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:12px;
                transition: 0.15s ease;
                opacity: ${done ? '1' : '0.45'};
                filter: ${done ? 'none' : 'grayscale(0.7)'};
            `;

            row.onmouseenter = () => row.style.transform = 'translateY(-1px)';
            row.onmouseleave = () => row.style.transform = 'translateY(0px)';

            row.onclick = () => this.toggle(item.id);

            row.innerHTML = `
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="width:22px;text-align:center;font-size:1.2rem;">
                        ${done ? '✅' : '⬜'}
                    </div>
                    <div style="font-size:1.15rem;">${label}</div>
                </div>
                <div style="font-family:monospace;opacity:0.75;">${done ? 'UNLOCKED' : 'LOCKED'}</div>
            `;

            list.appendChild(row);
        });
    }
};

window.NEW_FEATURES = {
    init() {
        console.log("\uD83D\uDE80 HeartOS New Features Module Loaded");
        this.createCountdownWidget();
        if (window.ACHIEVEMENTS) ACHIEVEMENTS.init();
    },

    createCountdownWidget() {
        const desktop = document.getElementById('desktop-screen');
        if (!desktop || document.getElementById('countdown-widget')) return;

        const widget = document.createElement('div');
        widget.id = 'countdown-widget';
        widget.style.cssText = `
            position: absolute; top: 150px; left: 20px;
            background: rgba(255, 255, 255, 0.9); border: 2px solid var(--accent);
            padding: 15px; border-radius: 8px; box-shadow: 4px 4px 0 rgba(0,0,0,0.1);
            min-width: 200px; backdrop-filter: blur(10px); cursor: pointer; z-index: 100;
        `;
        
        widget.onclick = () => {
            const t = (typeof I18N !== 'undefined') ? I18N.t.bind(I18N) : (k) => k;
            const title = prompt(t('widget_prompt_title'), localStorage.getItem('countdownTitle') || t('widget_default_title'));
            if (!title) return;
            const date = prompt(t('widget_prompt_date'), localStorage.getItem('countdownDate') || '2026-03-14');
            if (!date) return;
            const time = prompt(t('widget_prompt_time'), '00:00');
            if (!time) return;
            
            const fullDate = new Date(`${date}T${time}:00`);
            if (isNaN(fullDate.getTime())) { alert(t('widget_invalid_date')); return; }
            
            localStorage.setItem('countdownDate', fullDate.toISOString());
            localStorage.setItem('countdownTitle', title);
            this.updateCountdown();
        };
        
        desktop.appendChild(widget);
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);
    },

    updateCountdown() {
        const widget = document.getElementById('countdown-widget');
        if (!widget) return;

        const t = (typeof I18N !== 'undefined') ? I18N.t.bind(I18N) : (k) => k;
        const saved = localStorage.getItem('countdownDate');
        const title = localStorage.getItem('countdownTitle') || t('widget_default_title');
        
        if (!saved) {
            widget.innerHTML = '<div style="text-align:center;color:var(--text-main);"><div style="font-weight:bold;color:var(--accent);margin-bottom:5px;">' + t('widget_countdown') + '</div><div style="font-size:0.9rem;">' + t('widget_click_set') + '</div></div>';
            return;
        }

        const diff = new Date(saved) - new Date();
        if (diff < 0) {
            widget.innerHTML = '<div style="text-align:center;color:var(--text-main);"><div style="font-weight:bold;color:var(--accent);margin-bottom:5px;">\uD83C\uDF89 ' + title + '</div><div style="font-size:1.2rem;font-weight:bold;">' + t('widget_its_today') + '</div></div>';
            return;
        }

        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        widget.innerHTML = '<div style="text-align:center;color:var(--text-main);"><div style="font-weight:bold;color:var(--accent);margin-bottom:8px;font-size:1.1rem;">\u23F0 ' + title + '</div><div style="font-size:1.8rem;font-weight:bold;color:var(--accent);">' + d + '</div><div style="font-size:0.9rem;margin-bottom:5px;">' + t('widget_days') + '</div><div style="font-size:1.2rem;font-family:monospace;">' + String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0') + '</div></div>';
    }
};

const featureInit = setInterval(() => {
    const desktop = document.getElementById('desktop-screen');
    if (desktop && !desktop.classList.contains('hidden')) {
        NEW_FEATURES.init();
        clearInterval(featureInit);
    }
}, 500);
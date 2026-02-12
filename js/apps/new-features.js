// js/new-features.js

window.NEW_FEATURES = {
    // Initialize countdown widget
    init() {
        console.log("🚀 HeartOS New Features Module Loaded");
        this.createCountdownWidget();
    },

    // Countdown Widget Logic
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
            const title = prompt('What are you counting down to?', localStorage.getItem('countdownTitle') || 'Next Meeting');
            if (!title) return;
            const date = prompt('Date (YYYY-MM-DD):', localStorage.getItem('countdownDate') || '2026-03-14');
            if (!date) return;
            const time = prompt('Time (HH:MM):', '00:00');
            if (!time) return;
            
            const fullDate = new Date(`${date}T${time}:00`);
            if (isNaN(fullDate.getTime())) { alert('Invalid date!'); return; }
            
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

        const saved = localStorage.getItem('countdownDate');
        const title = localStorage.getItem('countdownTitle') || 'Next Meeting';
        
        if (!saved) {
            widget.innerHTML = '<div style="text-align:center;color:var(--text-main);"><div style="font-weight:bold;color:var(--accent);margin-bottom:5px;">⏰ Countdown</div><div style="font-size:0.9rem;">Click to set</div></div>';
            return;
        }

        const diff = new Date(saved) - new Date();
        if (diff < 0) {
            widget.innerHTML = `<div style="text-align:center;color:var(--text-main);"><div style="font-weight:bold;color:var(--accent);margin-bottom:5px;">🎉 ${title}</div><div style="font-size:1.2rem;font-weight:bold;">IT'S TODAY!</div></div>`;
            return;
        }

        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        widget.innerHTML = `<div style="text-align:center;color:var(--text-main);"><div style="font-weight:bold;color:var(--accent);margin-bottom:8px;font-size:1.1rem;">⏰ ${title}</div><div style="font-size:1.8rem;font-weight:bold;color:var(--accent);">${d}</div><div style="font-size:0.9rem;margin-bottom:5px;">days</div><div style="font-size:1.2rem;font-family:monospace;">${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}</div></div>`;
    }
};

// Wait for the desktop to actually appear (login successful) before initializing countdown
const featureInit = setInterval(() => {
    const desktop = document.getElementById('desktop-screen');
    // Check if desktop exists and DOES NOT have the 'hidden' class
    if (desktop && !desktop.classList.contains('hidden')) {
        NEW_FEATURES.init();
        clearInterval(featureInit);
    }
}, 500);
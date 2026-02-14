const SECRETS = {
    init: function() {
        const container = document.getElementById('letters-content');
        if (!container) return;
        
        // Prevent double-loading if video is already there
        if (container.querySelector('video')) return;

        const lang = (typeof I18N !== 'undefined' && I18N.currentLang === 'cs') ? 'cs' : 'en';

        container.innerHTML = '';
        container.appendChild(this.buildVideoPlayer(lang));

        // Listen for language changes to swap video source
        // Remove old listener to prevent duplicates if init is called twice
        window.removeEventListener('languageChanged', this.handleLangChange);
        window.addEventListener('languageChanged', this.handleLangChange.bind(this));
    },

    handleLangChange: function() {
        const container = document.getElementById('letters-content');
        if (!container) return;
        
        const newLang = (typeof I18N !== 'undefined' && I18N.currentLang === 'cs') ? 'cs' : 'en';
        container.innerHTML = '';
        container.appendChild(this.buildVideoPlayer(newLang));
    },

    videos: {
        en: 'assets\\videos\\messageAng.mp4',
        cs: 'assets\\videos\\messageCz.mp4'
    },

    buildVideoPlayer: function(lang) {
        const videoSrc = this.videos[lang] || this.videos.en;

        if (!document.getElementById('secrets-player-style')) {
            const style = document.createElement('style');
            style.id = 'secrets-player-style';
            style.textContent = `
                .video-wrap {
                    display: flex; justify-content: center; align-items: center;
                    padding: 40px 20px; min-height: 100%;
                    background: #000;
                }
                .player-container {
                    width: 100%; max-width: 800px;
                    background: #0d0d0d;
                    border: 1px solid #ff4d6d;
                    box-shadow: 0 0 50px rgba(255,77,109,0.2);
                    font-family: 'VT323', monospace;
                    position: relative;
                    overflow: hidden;
                    border-radius: 8px;
                    /* Container Fade In */
                    animation: containerFade 0.5s ease-out forwards;
                }
                .player-titlebar {
                    background: linear-gradient(90deg, #2b0a14, #1a0a10);
                    border-bottom: 1px solid #ff4d6d;
                    padding: 10px 16px;
                    display: flex; justify-content: space-between; align-items: center;
                    font-size: 0.9rem; color: #ff4d6d;
                    letter-spacing: 2px;
                }
                .player-titlebar .dot {
                    width: 10px; height: 10px; border-radius: 50%;
                    background: #ff4d6d; display: inline-block;
                    margin-right: 8px; animation: dotPulse 2s ease infinite;
                }
                @keyframes dotPulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 1; box-shadow: 0 0 10px #ff4d6d; }
                }
                .video-screen {
                    width: 100%;
                    display: block;
                    background: #000;
                    filter: contrast(1.1) brightness(1.1);
                    /* VIDEO FADE FROM BLACK MAGIC */
                    opacity: 0; 
                    animation: videoFadeIn 4s ease-in forwards; 
                }
                .player-lang-status {
                    padding: 8px 16px;
                    background: #1a0a10;
                    color: #666;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    display: flex; justify-content: space-between;
                }
                
                @keyframes containerFade {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }

                /* This handles the slow fade from black */
                @keyframes videoFadeIn {
                    0% { opacity: 0; }
                    20% { opacity: 0; } /* Stay black for a moment */
                    100% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        const wrap = document.createElement('div');
        wrap.className = 'video-wrap';

        const player = document.createElement('div');
        player.className = 'player-container';

        // Title bar
        const titlebar = document.createElement('div');
        titlebar.className = 'player-titlebar';
        const fileName = lang === 'cs' ? 'MESSAGE_CZ.MP4' : 'MESSAGE_EN.MP4';
        titlebar.innerHTML = `<span><span class="dot"></span> DECRYPTED_STREAM: ${fileName}</span><span style="color:#666;">LIVE</span>`;
        player.appendChild(titlebar);

        // Video Element
        const videoEl = document.createElement('video');
        videoEl.className = 'video-screen';
        videoEl.autoplay = true;
        videoEl.controls = true; // Keep controls so they can replay/volume
        videoEl.playsInline = true;
        videoEl.src = videoSrc;
        
        player.appendChild(videoEl);

        // Sub-bar
        const statusBar = document.createElement('div');
        statusBar.className = 'player-lang-status';
        statusBar.innerHTML = `<span>MODE: ${lang.toUpperCase()}</span><span>CODEC: H.264</span>`;
        player.appendChild(statusBar);

        wrap.appendChild(player);
        return wrap;
    }
};

/* ---------------------------------------------------------
   CRITICAL CHANGE: 
   We removed the window.addEventListener('secretsUnlocked') 
   block entirely. 
   
   We ONLY use the openApp override below.
   ---------------------------------------------------------
*/

// Hook into the system opening logic
const _origOpenApp = SYSTEM.openApp.bind(SYSTEM);
SYSTEM.openApp = function(id) {
    _origOpenApp(id); // Open the window normally

    // Only Initialize the video if the SPECIFIC window is opened
    if (id === 'win-letters') {
        // Small timeout to ensure DOM is ready inside the window
        setTimeout(() => {
            const container = document.getElementById('letters-content');
            // Only init if it hasn't been done yet (check for children)
            if (container && container.children.length === 0) {
                SECRETS.init();
            }
        }, 50);
    }
};
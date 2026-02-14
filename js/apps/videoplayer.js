/* VIDEO PLAYER APP — Single video message with fade-from-black */

const VIDEOPLAYER = {
    isPlaying: false,

    init: function() {
        const container = document.getElementById('videoplayer-content');
        if (!container) return;

        // Inject styles once
        if (!document.getElementById('videoplayer-style')) {
            const style = document.createElement('style');
            style.id = 'videoplayer-style';
            style.textContent = `
                .vp-wrap {
                    width: 100%; height: 100%;
                    background: #000;
                    display: flex; align-items: center; justify-content: center;
                    position: relative; overflow: hidden;
                }

                /* Black overlay that fades out when video plays */
                .vp-overlay {
                    position: absolute; inset: 0;
                    background: #000;
                    z-index: 2;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    cursor: pointer;
                    transition: opacity 1.5s ease;
                }
                .vp-overlay.fading {
                    opacity: 0;
                    pointer-events: none;
                }

                /* Play button circle */
                .vp-play-btn {
                    width: 80px; height: 80px;
                    border: 2px solid rgba(255,77,109,0.5);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.3s ease;
                    position: relative;
                }
                .vp-play-btn::after {
                    content: '';
                    display: block;
                    width: 0; height: 0;
                    border-style: solid;
                    border-width: 14px 0 14px 24px;
                    border-color: transparent transparent transparent rgba(255,77,109,0.7);
                    margin-left: 4px;
                    transition: all 0.3s ease;
                }
                .vp-overlay:hover .vp-play-btn {
                    border-color: #ff4d6d;
                    box-shadow: 0 0 30px rgba(255,77,109,0.3);
                    transform: scale(1.08);
                }
                .vp-overlay:hover .vp-play-btn::after {
                    border-left-color: #ff4d6d;
                }

                .vp-play-label {
                    color: rgba(255,77,109,0.5);
                    font-family: 'VT323', monospace;
                    font-size: 0.9rem;
                    margin-top: 16px;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    transition: color 0.3s ease;
                }
                .vp-overlay:hover .vp-play-label {
                    color: #ff4d6d;
                }

                /* Subtle pulse on the play button */
                @keyframes vpPulse {
                    0%, 100% { box-shadow: 0 0 0px rgba(255,77,109,0); }
                    50% { box-shadow: 0 0 20px rgba(255,77,109,0.2); }
                }
                .vp-play-btn {
                    animation: vpPulse 3s ease-in-out infinite;
                }

                /* Video element */
                .vp-video {
                    width: 100%; height: 100%;
                    object-fit: contain;
                    background: #000;
                    z-index: 1;
                }

                /* Controls bar at bottom */
                .vp-controls {
                    position: absolute; bottom: 0; left: 0; right: 0;
                    background: linear-gradient(transparent, rgba(0,0,0,0.85));
                    padding: 20px 16px 12px;
                    z-index: 3;
                    display: flex; align-items: center; gap: 12px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    font-family: 'VT323', monospace;
                }
                .vp-wrap:hover .vp-controls.active {
                    opacity: 1;
                }

                .vp-ctrl-btn {
                    background: none; border: none;
                    color: #ff8fa3; font-size: 1.2rem;
                    cursor: pointer; padding: 4px 8px;
                    font-family: 'VT323', monospace;
                    transition: color 0.2s;
                }
                .vp-ctrl-btn:hover { color: #ff4d6d; }

                .vp-progress-wrap {
                    flex: 1; height: 4px;
                    background: rgba(255,255,255,0.1);
                    cursor: pointer; position: relative;
                    border-radius: 2px;
                }
                .vp-progress-fill {
                    height: 100%; width: 0%;
                    background: #ff4d6d;
                    border-radius: 2px;
                    transition: width 0.1s linear;
                }
                .vp-progress-wrap:hover {
                    height: 6px;
                }

                .vp-time {
                    color: #ff8fa3; font-size: 0.9rem;
                    min-width: 80px; text-align: right;
                    letter-spacing: 1px;
                }

                .vp-volume-wrap {
                    display: flex; align-items: center; gap: 6px;
                }
                .vp-volume-slider {
                    width: 60px; height: 3px;
                    -webkit-appearance: none; appearance: none;
                    background: rgba(255,255,255,0.15);
                    outline: none; border-radius: 2px;
                    cursor: pointer;
                }
                .vp-volume-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 10px; height: 10px;
                    border-radius: 50%;
                    background: #ff4d6d;
                    cursor: pointer;
                }

                /* Ended state */
                .vp-ended-overlay {
                    position: absolute; inset: 0;
                    background: rgba(0,0,0,0.8);
                    z-index: 4;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    animation: fadeIn 0.5s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; } to { opacity: 1; }
                }
                .vp-replay-btn {
                    width: 60px; height: 60px;
                    border: 2px solid rgba(255,77,109,0.5);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    font-size: 1.5rem;
                    transition: all 0.3s ease;
                    color: rgba(255,77,109,0.7);
                    background: none;
                    font-family: 'VT323', monospace;
                }
                .vp-replay-btn:hover {
                    border-color: #ff4d6d; color: #ff4d6d;
                    box-shadow: 0 0 20px rgba(255,77,109,0.3);
                    transform: scale(1.08);
                }
                .vp-replay-label {
                    color: rgba(255,77,109,0.5);
                    font-family: 'VT323', monospace;
                    font-size: 0.85rem; margin-top: 12px;
                    letter-spacing: 2px;
                }
            `;
            document.head.appendChild(style);
        }

        this.render(container);
    },

    render: function(container) {
        container.innerHTML = '';

        const wrap = document.createElement('div');
        wrap.className = 'vp-wrap';

        // Video element (hidden behind black overlay initially)
        const video = document.createElement('video');
        video.className = 'vp-video';
        video.preload = 'metadata';
        video.src = 'assets/videos/message.mp4';  // <-- Put your video file here
        wrap.appendChild(video);

        // Black overlay with play button
        const overlay = document.createElement('div');
        overlay.className = 'vp-overlay';
        overlay.innerHTML = `
            <div class="vp-play-btn"></div>
            <div class="vp-play-label">Play Message</div>
        `;
        wrap.appendChild(overlay);

        // Custom controls
        const controls = document.createElement('div');
        controls.className = 'vp-controls';
        controls.innerHTML = `
            <button class="vp-ctrl-btn" id="vp-pause-btn">⏸</button>
            <div class="vp-progress-wrap" id="vp-progress-wrap">
                <div class="vp-progress-fill" id="vp-progress-fill"></div>
            </div>
            <span class="vp-time" id="vp-time">0:00 / 0:00</span>
            <div class="vp-volume-wrap">
                <button class="vp-ctrl-btn" id="vp-mute-btn">🔊</button>
                <input type="range" class="vp-volume-slider" id="vp-volume" min="0" max="1" step="0.05" value="0.8">
            </div>
        `;
        wrap.appendChild(controls);

        container.appendChild(wrap);

        // --- Event wiring ---

        // Click overlay to start
        overlay.addEventListener('click', () => {
            video.volume = 0.8;
            video.play().then(() => {
                overlay.classList.add('fading');
                controls.classList.add('active');
                this.isPlaying = true;
            }).catch(e => console.error('Video play error:', e));
        });

        // Pause / play toggle
        const pauseBtn = controls.querySelector('#vp-pause-btn');
        pauseBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                pauseBtn.textContent = '⏸';
                this.isPlaying = true;
            } else {
                video.pause();
                pauseBtn.textContent = '▶';
                this.isPlaying = false;
            }
        });

        // Click video to toggle pause
        video.addEventListener('click', () => {
            if (!overlay.classList.contains('fading')) return;
            pauseBtn.click();
        });

        // Progress bar
        const progressWrap = controls.querySelector('#vp-progress-wrap');
        const progressFill = controls.querySelector('#vp-progress-fill');
        const timeDisplay = controls.querySelector('#vp-time');

        const formatTime = (s) => {
            const m = Math.floor(s / 60);
            const sec = Math.floor(s % 60);
            return `${m}:${sec.toString().padStart(2, '0')}`;
        };

        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                const pct = (video.currentTime / video.duration) * 100;
                progressFill.style.width = pct + '%';
                timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
            }
        });

        progressWrap.addEventListener('click', (e) => {
            const rect = progressWrap.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            video.currentTime = pct * video.duration;
        });

        // Volume
        const volumeSlider = controls.querySelector('#vp-volume');
        const muteBtn = controls.querySelector('#vp-mute-btn');

        volumeSlider.addEventListener('input', () => {
            video.volume = parseFloat(volumeSlider.value);
            muteBtn.textContent = video.volume === 0 ? '🔇' : '🔊';
        });

        muteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            muteBtn.textContent = video.muted ? '🔇' : '🔊';
        });

        // Video ended — show replay overlay
        video.addEventListener('ended', () => {
            this.isPlaying = false;
            pauseBtn.textContent = '▶';

            const endedOverlay = document.createElement('div');
            endedOverlay.className = 'vp-ended-overlay';
            endedOverlay.innerHTML = `
                <button class="vp-replay-btn">↺</button>
                <div class="vp-replay-label">Replay</div>
            `;
            wrap.appendChild(endedOverlay);

            endedOverlay.addEventListener('click', () => {
                endedOverlay.remove();
                video.currentTime = 0;
                video.play();
                pauseBtn.textContent = '⏸';
                this.isPlaying = true;
            });
        });
    }
};
const MUSIC = {
    init: function() {
        const container = document.getElementById('amp-interface');
        container.innerHTML = `
            <div class="amp-screen">
                <div id="amp-vis">
                    <div class="bar"></div><div class="bar"></div>
                    <div class="bar"></div><div class="bar"></div>
                    <div class="bar"></div><div class="bar"></div>
                    <div class="bar"></div><div class="bar"></div>
                </div>
                <div class="amp-text"><marquee scrollamount="4">TRACK: 01 - OUR_SONG.MP3</marquee></div>
            </div>
            <div class="amp-controls">
                <div style="display:flex; gap:5px;">
                    <button class="amp-btn play" id="amp-play-btn" onclick="MUSIC.toggle()">&#9199;</button>
                    <button class="amp-btn" onclick="MUSIC.stop()">&#9209;</button>
                </div>
                <input type="range" id="vol-slider" min="0" max="1" step="0.1" value="0.3" onchange="MUSIC.vol(this.value)">
            </div>
        `;
    },

    toggle: function() {
        const bgm = document.getElementById('bgm');
        const btn = document.getElementById('amp-play-btn');
        if (bgm.paused) {
            bgm.play().catch(e => {});
            if (btn) btn.classList.add('active');
        } else {
            bgm.pause();
            if (btn) btn.classList.remove('active');
        }
    },

    stop: function() {
        const bgm = document.getElementById('bgm');
        bgm.pause();
        bgm.currentTime = 0;
        const btn = document.getElementById('amp-play-btn');
        if (btn) btn.classList.remove('active');
    },

    vol: function(v) {
        const bgm = document.getElementById('bgm');
        if (bgm) bgm.volume = v;
    }
};
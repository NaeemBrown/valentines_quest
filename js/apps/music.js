const MUSIC = {
    init: function() {
        const container = document.getElementById('amp-interface');
        // INJECTING THE NEW HARDWARE HTML
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
                    <button class="amp-btn" onclick="MUSIC.toggle()">⏯</button>
                    <button class="amp-btn" onclick="MUSIC.stop()">⏹</button>
                </div>
                <input type="range" id="vol-slider" min="0" max="1" step="0.1" value="0.3" onchange="MUSIC.vol(this.value)">
            </div>
        `;
    },
    
    toggle: function() { 
        const bgm = document.getElementById('bgm'); 
        const btn = document.querySelector('.amp-btn.play');
        
        if(bgm.paused) { 
            bgm.play(); 
            btn.classList.add('active'); // Light up button
        } else { 
            bgm.pause(); 
            btn.classList.remove('active');
        }
    },
    
    stop: function() { 
        const bgm = document.getElementById('bgm'); 
        bgm.pause(); 
        bgm.currentTime = 0; 
        document.querySelector('.amp-btn.play').classList.remove('active');
    },
    
    vol: function(v) { document.getElementById('bgm').volume = v; }
};
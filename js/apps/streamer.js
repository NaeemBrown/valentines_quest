const STREAMER = {
    state: {
        links: [],
        currentIdx: 0,
        total: 0
    },

    open: function(linkList, startIdx = 0) {
        if (!linkList || linkList.length === 0) {
            alert("ERROR: No files in this folder.");
            return;
        }

        this.state.links = linkList;
        this.state.total = linkList.length;
        this.state.currentIdx = startIdx;

        // Open the Window
        const win = document.getElementById('win-streamer');
        win.classList.remove('hidden');
        SYSTEM.playAudio('click-sound');
        
        this.render();
    },

    render: function() {
        const content = document.getElementById('streamer-content');
        const title = document.getElementById('streamer-title-text');
        
        // 1. Get Current Link
        const rawLink = this.state.links[this.state.currentIdx];
        
        // 2. Extract ID safely
        let id = "";
        let isFolder = false;
        
        try {
            // Check if it's a folder link
            if(rawLink.includes("/folders/")) {
                isFolder = true;
                id = rawLink.split("/folders/")[1].split("?")[0].split("/")[0];
            } 
            // Individual file links
            else if(rawLink.includes("/file/d/")) {
                id = rawLink.split("/file/d/")[1].split("/")[0];
            } else if(rawLink.includes("/d/")) {
                id = rawLink.split("/d/")[1].split("/")[0];
            } else if (rawLink.includes("id=")) {
                id = rawLink.split("id=")[1].split("&")[0];
            }
        } catch(e) { 
            console.error("Bad Link", rawLink); 
        }

        // 3. Update Title
        title.innerText = `STREAM: ${isFolder ? 'FOLDER' : 'IMG_' + (this.state.currentIdx + 1)} / ${this.state.total}`;

        // 4. Render Content Based on Type
        if (isFolder) {
            // FOLDER VIEW - Show the entire folder in grid view
            content.innerHTML = `
                <div class="streamer-container">
                    <div class="streamer-view-area">
                        <iframe 
                            src="https://drive.google.com/embeddedfolderview?id=${id}#grid" 
                            style="width:100%; height:100%; border:none; background: #fff;"
                        ></iframe>
                    </div>
                    
                    <div class="streamer-controls">
                        <button class="os-btn stream-btn" onclick="STREAMER.prev()">◀ PREV FOLDER</button>
                        <button class="os-btn stream-btn" onclick="STREAMER.close()">CLOSE</button>
                        <button class="os-btn stream-btn" onclick="STREAMER.next()">NEXT FOLDER ▶</button>
                    </div>
                </div>
            `;
        } else {
            // FILE VIEW - Show individual image
            content.innerHTML = `
                <div class="streamer-container">
                    <div class="streamer-view-area">
                        <iframe 
                            src="https://drive.google.com/file/d/${id}/preview" 
                            style="width:100%; height:100%; border:none; background: #000;"
                            allow="autoplay"
                        ></iframe>
                        <div id="stream-error-msg" style="display:none; color: #ff4d6d; text-align:center; padding:20px;">
                            <h3>SIGNAL LOST</h3>
                            <p>Unable to load stream.<br><br>
                            <strong>Make sure:</strong><br>
                            1. File/folder is shared "Anyone with the link"<br>
                            2. Link format is correct<br><br>
                            Link: ${rawLink.substring(0, 60)}...</p>
                        </div>
                    </div>
                    
                    <div class="streamer-controls">
                        <button class="os-btn stream-btn" onclick="STREAMER.prev()">◀ PREV</button>
                        <button class="os-btn stream-btn" onclick="STREAMER.close()">CLOSE</button>
                        <button class="os-btn stream-btn" onclick="STREAMER.next()">NEXT ▶</button>
                    </div>
                </div>
            `;
        }
    },

    next: function() {
        if (this.state.currentIdx < this.state.total - 1) {
            this.state.currentIdx++;
            this.render();
        } else {
            this.state.currentIdx = 0; // Loop to start
            this.render();
        }
    },

    prev: function() {
        if (this.state.currentIdx > 0) {
            this.state.currentIdx--;
            this.render();
        } else {
            this.state.currentIdx = this.state.total - 1; // Loop to end
            this.render();
        }
    },
    
    close: function() {
        document.getElementById('win-streamer').classList.add('hidden');
        document.getElementById('streamer-content').innerHTML = ""; 
    }
};
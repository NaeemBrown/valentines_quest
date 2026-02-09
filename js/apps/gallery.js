/* GALLERY APP LOGIC */
const GALLERY = {
    init: function() { this.renderRoot(); },

    renderRoot: function() {
        const container = document.getElementById('gallery-content');
        document.getElementById('gallery-title').innerText = "CLOUD_STORAGE:\\VAULT\\";
        container.innerHTML = "";
        
        const grid = document.createElement('div'); 
        grid.className = 'folder-grid';

        LORE.vault.forEach((item, index) => {
            const folder = document.createElement('div'); 
            folder.className = 'gallery-folder-icon';
            
            // CHECK: Is this a Streaming Folder?
            if (item.type === "stream") {
                folder.innerHTML = `
                    <div class="folder-img">📡</div>
                    <div class="folder-name">${item.title}</div>
                `;
                // Open the Streamer Window with the list of links
                folder.onclick = () => STREAMER.open(item.items, 0);
            } else {
                // Fallback for local folders
                folder.innerHTML = `<div class="folder-img">📁</div><div class="folder-name">${item.title}</div>`;
                folder.onclick = () => this.openFolder(item);
            }
            
            grid.appendChild(folder);
        });
        container.appendChild(grid);
    },

    openFolder: function(folderData) {
        const container = document.getElementById('gallery-content');
        document.getElementById('gallery-title').innerText = `LOCAL:\\...\\${folderData.title}`;
        container.innerHTML = "";

        const toolbar = document.createElement('div'); 
        toolbar.className = 'gallery-toolbar';
        toolbar.innerHTML = `<button onclick="GALLERY.renderRoot()">⬆ UP</button><span>${folderData.title}</span>`;
        container.appendChild(toolbar);

        const grid = document.createElement('div'); 
        grid.className = 'photo-grid';
        
        folderData.items.forEach(file => {
            const ext = file.url.split('.').pop().toLowerCase();
            let el;

            // --- TYPE CHECKING LOGIC ---
            if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
                // VIDEO
                el = document.createElement('video');
                el.src = file.url;
                el.className = 'photo-thumb';
                el.muted = true; // Mute preview
                el.onmouseover = () => el.play(); // Auto-play preview on hover
                el.onmouseout = () => el.pause();
                
            } else if (['mp3', 'wav'].includes(ext)) {
                // AUDIO
                el = document.createElement('div');
                el.className = 'photo-thumb audio-thumb';
                el.innerHTML = "🎵"; // Or use an icon image
                
            } else {
                // IMAGE (Default)
                el = document.createElement('img');
                el.src = file.url;
                el.className = 'photo-thumb';
            }

            // Universal Click Handler
            el.onclick = () => SYSTEM.openLightbox(file.url, file.caption, ext);
            grid.appendChild(el);
        });

        container.appendChild(grid);
        SYSTEM.playAudio('click-sound');
    }
};
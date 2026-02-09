const DRIVE = {
    open: function(url, title) {
        SYSTEM.playAudio('click-sound');

        // 1. Extract the Folder ID from the messy URL
        // Supports: .../folders/ID... and ...?id=ID...
        let id = "";
        try {
            if (url.includes("folders/")) {
                id = url.split("folders/")[1].split("?")[0].split("/")[0];
            } else if (url.includes("id=")) {
                id = url.split("id=")[1].split("&")[0];
            }
        } catch (e) {
            console.error("ID Extraction Failed", e);
        }

        if (!id) {
            alert("ERROR: Could not mount drive.\nInvalid Link Format.");
            return;
        }

        // 2. Prepare the Window
        const win = document.getElementById('win-drive');
        const content = document.getElementById('drive-content');
        const titleBar = document.getElementById('drive-title');

        // 3. Update Title ("Mounting" the drive)
        titleBar.innerText = `NET:\\${title.toUpperCase()}`;

        // 4. Inject the Google Drive Embed
        // using 'embeddedfolderview' to prevent redirection
        content.innerHTML = `
            <div style="text-align:center; padding:20px; color:#666;">Connecting to Server...</div>
            <iframe 
                src="https://drive.google.com/embeddedfolderview?id=${id}#list" 
                style="width:100%; height:100%; border:none; background: #fff;" 
                allowfullscreen>
            </iframe>
        `;

        // 5. Open the Window
        SYSTEM.openApp('win-drive');
    }
};
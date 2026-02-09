/* js/apps/browser.js - RETRO INTERNET EXPLORER */
const BROWSER = {
    currentTab: 0,
    tabs: [],
    history: [],

    init: function() {
        console.log('🌐 BROWSER.init() called');
        
        // Define default tabs
        this.tabs = [
            {
                title: "💕 Our Homepage",
                type: "custom",
                content: this.renderHomepage()
            },
            {
                title: "📸 Instagram",
                type: "iframe",
                url: "https://www.instagram.com"
            },
            {
                title: "🎵 Spotify",
                type: "iframe", 
                url: "https://open.spotify.com"
            },
            {
                title: "💬 WhatsApp Web",
                type: "iframe",
                url: "https://web.whatsapp.com"
            },
            {
                title: "📺 YouTube",
                type: "iframe",
                url: "https://www.youtube.com"
            },
            {
                title: "🗺️ Google Maps",
                type: "custom",
                content: this.renderMapsPage()
            }
        ];

        this.renderBrowser();
        this.switchTab(0);
    },

    renderBrowser: function() {
        const container = document.getElementById('browser-content');
        
        container.innerHTML = `
            <div class="browser-chrome">
                <!-- Address Bar -->
                <div class="browser-toolbar">
                    <div class="browser-nav-buttons">
                        <button class="browser-btn" onclick="BROWSER.back()" title="Back">◄</button>
                        <button class="browser-btn" onclick="BROWSER.forward()" title="Forward">►</button>
                        <button class="browser-btn" onclick="BROWSER.refresh()" title="Refresh">↻</button>
                        <button class="browser-btn" onclick="BROWSER.home()" title="Home">🏠</button>
                    </div>
                    <div class="browser-address-bar">
                        <span class="address-protocol">https://</span>
                        <input type="text" id="browser-url" class="address-input" placeholder="heartos.love/home" readonly>
                        <button class="browser-btn go-btn" onclick="BROWSER.go()">GO</button>
                    </div>
                </div>

                <!-- Tab Bar -->
                <div class="browser-tabs" id="browser-tabs"></div>

                <!-- Content Area -->
                <div class="browser-viewport" id="browser-viewport"></div>
            </div>
        `;

        this.renderTabs();
    },

    renderTabs: function() {
        const tabBar = document.getElementById('browser-tabs');
        tabBar.innerHTML = '';

        this.tabs.forEach((tab, index) => {
            const tabEl = document.createElement('div');
            tabEl.className = 'browser-tab' + (index === this.currentTab ? ' active' : '');
            tabEl.innerHTML = `
                <span class="tab-title">${tab.title}</span>
                <button class="tab-close" onclick="BROWSER.closeTab(${index}); event.stopPropagation()">✕</button>
            `;
            tabEl.onclick = () => this.switchTab(index);
            tabBar.appendChild(tabEl);
        });

        // New Tab Button
        const newTabBtn = document.createElement('div');
        newTabBtn.className = 'browser-tab new-tab-btn';
        newTabBtn.innerHTML = '<span>+</span>';
        newTabBtn.onclick = () => this.newTab();
        tabBar.appendChild(newTabBtn);
    },

    switchTab: function(index) {
        if (index < 0 || index >= this.tabs.length) return;
        
        this.currentTab = index;
        const tab = this.tabs[index];
        
        // Update address bar
        const urlInput = document.getElementById('browser-url');
        if (tab.type === 'iframe') {
            urlInput.value = tab.url;
        } else {
            urlInput.value = 'heartos.love/' + tab.title.toLowerCase().replace(/[^a-z]/g, '');
        }

        // Render content
        const viewport = document.getElementById('browser-viewport');
        if (tab.type === 'iframe') {
            viewport.innerHTML = `
                <iframe 
                    src="${tab.url}" 
                    class="browser-frame"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                ></iframe>
            `;
        } else {
            viewport.innerHTML = tab.content;
        }

        this.renderTabs();
        SYSTEM.playAudio('click-sound');
    },

    closeTab: function(index) {
        if (this.tabs.length <= 1) {
            alert("Can't close the last tab!");
            return;
        }

        this.tabs.splice(index, 1);
        
        if (this.currentTab >= index && this.currentTab > 0) {
            this.currentTab--;
        }
        
        this.switchTab(this.currentTab);
    },

    newTab: function() {
        this.tabs.push({
            title: "💕 New Tab",
            type: "custom",
            content: this.renderHomepage()
        });
        this.switchTab(this.tabs.length - 1);
    },

    back: function() {
        SYSTEM.playAudio('click-sound');
        // In a real browser, this would go back in history
        alert("← Back button (History not implemented)");
    },

    forward: function() {
        SYSTEM.playAudio('click-sound');
        alert("→ Forward button (History not implemented)");
    },

    refresh: function() {
        SYSTEM.playAudio('click-sound');
        this.switchTab(this.currentTab);
    },

    home: function() {
        this.switchTab(0);
    },

    go: function() {
        const url = document.getElementById('browser-url').value;
        alert("Navigate to: " + url + "\n(Custom URLs not implemented yet)");
    },

    // ==================== CUSTOM PAGES ====================

    renderHomepage: function() {
        return `
            <div class="browser-page homepage">
                <div class="homepage-header">
                    <h1>💕 Welcome to Our Internet 💕</h1>
                    <p class="homepage-tagline">Your personal corner of the web</p>
                </div>

                <div class="homepage-grid">
                    <div class="homepage-card" onclick="BROWSER.openQuickLink('https://www.instagram.com', 1)">
                        <div class="card-icon">📸</div>
                        <h3>Instagram</h3>
                        <p>Share moments</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.openQuickLink('https://open.spotify.com', 2)">
                        <div class="card-icon">🎵</div>
                        <h3>Spotify</h3>
                        <p>Our playlists</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.openQuickLink('https://web.whatsapp.com', 3)">
                        <div class="card-icon">💬</div>
                        <h3>WhatsApp</h3>
                        <p>Stay connected</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.openQuickLink('https://www.youtube.com', 4)">
                        <div class="card-icon">📺</div>
                        <h3>YouTube</h3>
                        <p>Watch together</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.switchTab(5)">
                        <div class="card-icon">🗺️</div>
                        <h3>Our Places</h3>
                        <p>Map of memories</p>
                    </div>

                    <div class="homepage-card" onclick="alert('Coming soon!')">
                        <div class="card-icon">📅</div>
                        <h3>Calendar</h3>
                        <p>Our schedule</p>
                    </div>
                </div>

                <div class="homepage-footer">
                    <p>💕 Always connected, even across the miles 💕</p>
                </div>
            </div>
        `;
    },

    renderMapsPage: function() {
        return `
            <div class="browser-page maps-page">
                <div class="maps-header">
                    <h2>🗺️ Our Places</h2>
                    <p>Memories mapped across the world</p>
                </div>

                <div class="maps-grid">
                    <div class="place-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <h3>🇨🇿 Prague, Czechia</h3>
                        <p>Where your heart calls home</p>
                        <button class="place-btn" onclick="window.open('https://www.google.com/maps/place/Prague,+Czechia', '_blank')">
                            Open in Maps →
                        </button>
                    </div>

                    <div class="place-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                        <h3>🇿🇦 Cape Town, South Africa</h3>
                        <p>Where adventure begins</p>
                        <button class="place-btn" onclick="window.open('https://www.google.com/maps/place/Cape+Town,+South+Africa', '_blank')">
                            Open in Maps →
                        </button>
                    </div>

                    <div class="place-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                        <h3>✈️ Distance Between Us</h3>
                        <p>~9,500 km | ~12 hour flight</p>
                        <button class="place-btn" onclick="window.open('https://www.google.com/maps/dir/Prague,+Czechia/Cape+Town,+South+Africa', '_blank')">
                            View Route →
                        </button>
                    </div>

                    <div class="place-card" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                        <h3>🌍 Future Adventures</h3>
                        <p>Places we'll explore together</p>
                        <button class="place-btn" onclick="alert('Add to bucket list!')">
                            Plan Trip →
                        </button>
                    </div>
                </div>

                <div class="maps-iframe-wrapper">
                    <iframe 
                        src="https://www.google.com/maps/d/embed?mid=1G7vO_6RHO7qyqX4C5KqEJCg9pME&ll=20,10&z=2" 
                        class="maps-embed"
                    ></iframe>
                </div>
            </div>
        `;
    },

    openQuickLink: function(url, tabIndex) {
        if (tabIndex && tabIndex < this.tabs.length) {
            this.switchTab(tabIndex);
        } else {
            window.open(url, '_blank');
        }
    }
};
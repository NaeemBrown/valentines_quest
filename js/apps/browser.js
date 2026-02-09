// @ts-nocheck
/* js/apps/browser.js - RETRO INTERNET EXPLORER */
const BROWSER = {
    currentTab: 0,
    tabs: [],
    history: [],
    searchHistory: [],
    zoomLevel: 100,

    init: function() {
        console.log('🌐 BROWSER.init() called');
        
        // Define default tabs - ONLY HOME TAB
        this.tabs = [
            {
                title: "💕 Home",
                type: "custom",
                content: this.renderHomepage()
            }
        ];

        // Load search history from localStorage (with error handling)
        try {
            const saved = localStorage.getItem('browserSearchHistory');
            if (saved) {
                this.searchHistory = JSON.parse(saved);
            }
        } catch(e) {
            console.log('Could not load search history');
            this.searchHistory = [];
        }

        // Setup keyboard shortcuts for zoom
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === '=' || e.key === '+') {
                    e.preventDefault();
                    this.zoomIn();
                } else if (e.key === '-') {
                    e.preventDefault();
                    this.zoomOut();
                } else if (e.key === '0') {
                    e.preventDefault();
                    this.resetZoom();
                }
            }
        });

        // Don't render yet - wait for window to open
        console.log('Browser initialized, waiting for window open');
    },

    // NEW: Render when window opens
    renderOnOpen: function() {
        console.log('🌐 Rendering browser interface');
        const container = document.getElementById('browser-content');
        
        if (!container) {
            console.error('Browser container not found!');
            return;
        }

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
                        <input type="text" id="browser-url" class="address-input" placeholder="Search or enter URL..." 
                               onkeypress="if(event.key==='Enter') BROWSER.search()">
                        <button class="browser-btn go-btn" onclick="BROWSER.search()">GO</button>
                    </div>
                    <div class="browser-zoom-controls">
                        <button class="browser-btn" onclick="BROWSER.zoomOut()" title="Zoom Out (Ctrl -)">🔍−</button>
                        <span class="zoom-level" id="zoom-level">100%</span>
                        <button class="browser-btn" onclick="BROWSER.zoomIn()" title="Zoom In (Ctrl +)">🔍+</button>
                        <button class="browser-btn" onclick="BROWSER.resetZoom()" title="Reset Zoom (Ctrl 0)">⟲</button>
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
        if (!tabBar) return;
        
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
        if (urlInput) {
            if (tab.type === 'iframe') {
                urlInput.value = tab.url.replace('https://', '');
            } else {
                urlInput.value = 'heartos.love';
            }
        }

        // Render content
        const viewport = document.getElementById('browser-viewport');
        if (!viewport) return;
        
        if (tab.type === 'iframe') {
            viewport.innerHTML = `
                <iframe 
                    src="${tab.url}" 
                    class="browser-frame"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                ></iframe>
            `;
            // Apply zoom after a short delay to ensure iframe is loaded
            setTimeout(() => this.applyZoom(), 100);
        } else if (tab.type === 'search') {
            viewport.innerHTML = this.renderSearchResults(tab.query);
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
        alert('Back button - history coming soon!');
    },

    forward: function() {
        alert('Forward button - history coming soon!');
    },

    refresh: function() {
        this.switchTab(this.currentTab);
    },

    home: function() {
        this.tabs[this.currentTab] = {
            title: "💕 Home",
            type: "custom",
            content: this.renderHomepage()
        };
        this.switchTab(this.currentTab);
    },

    search: function() {
        const input = document.getElementById('browser-url');
        const query = input.value.trim();
        
        if (!query) return;

        // Save to search history
        if (!this.searchHistory.includes(query)) {
            this.searchHistory.unshift(query);
            if (this.searchHistory.length > 10) {
                this.searchHistory = this.searchHistory.slice(0, 10);
            }
            try {
                localStorage.setItem('browserSearchHistory', JSON.stringify(this.searchHistory));
            } catch(e) {
                console.log('Could not save search history');
            }
        }

        this.tabs[this.currentTab] = {
            title: `🔍 ${query}`,
            type: "search",
            query: query
        };
        
        this.switchTab(this.currentTab);
    },

    quickLink: function(title, url) {
        this.tabs[this.currentTab] = {
            title: title,
            type: "iframe",
            url: url
        };
        this.switchTab(this.currentTab);
    },

    renderHomepage: function() {
        const recentSearches = this.searchHistory.slice(0, 5);
        
        return `
            <div class="browser-page homepage">
                <div class="homepage-header">
                    <h1>💕 Welcome to HeartOS Browser</h1>
                    <p>Your personalized internet experience</p>
                </div>

                <div class="homepage-search">
                    <input type="text" id="homepage-search" class="homepage-search-input" 
                           placeholder="Search the web or enter URL..." 
                           onkeypress="if(event.key==='Enter') BROWSER.homeSearch()">
                    <button class="homepage-search-btn" onclick="BROWSER.homeSearch()">🔍 Search</button>
                </div>

                ${recentSearches.length > 0 ? `
                    <div class="recent-searches">
                        <h3>Recent Searches:</h3>
                        <div class="search-chips">
                            ${recentSearches.map(s => `
                                <div class="search-chip" onclick="BROWSER.searchFor('${s}')">
                                    🔍 ${s}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="homepage-grid">
                    <div class="homepage-card" onclick="BROWSER.quickLink('📧 Gmail', 'assets/sites/email.html')">
                        <div class="card-icon">📧</div>
                        <h3>Gmail</h3>
                        <p>Check emails</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('📸 Instagram', 'assets/sites/instagram.html')">
                        <div class="card-icon">📸</div>
                        <h3>Instagram</h3>
                        <p>Share moments</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('🎵 Spotify', 'assets/sites/spotify.html')">
                        <div class="card-icon">🎵</div>
                        <h3>Spotify</h3>
                        <p>Our music</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('💬 WhatsApp', 'assets/sites/whatsapp.html')">
                        <div class="card-icon">💬</div>
                        <h3>WhatsApp</h3>
                        <p>Stay connected</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('📺 YouTube', 'assets/sites/youtube.html')">
                        <div class="card-icon">📺</div>
                        <h3>YouTube</h3>
                        <p>Watch together</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('🗺️ Maps', 'assets/sites/maps.html')">
                        <div class="card-icon">🗺️</div>
                        <h3>HeartMaps</h3>
                        <p>Plan trips</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('🛒 Amazon', 'assets/sites/amazon.html')">
                        <div class="card-icon">🛒</div>
                        <h3>Amazon</h3>
                        <p>Shop online</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('🎬 Netflix', 'assets/sites/netflix.html')">
                        <div class="card-icon">🎬</div>
                        <h3>Netflix</h3>
                        <p>Movie night</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('💼 LinkedIn', 'assets/sites/linkedin.html')">
                        <div class="card-icon">💼</div>
                        <h3>HeartedIn</h3>
                        <p>Professional</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('🐦 Twitter/X', 'assets/sites/twitter.html')">
                        <div class="card-icon">🐦</div>
                        <h3>HeartTweet</h3>
                        <p>Social feed</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('📚 Reddit', 'assets/sites/reddit.html')">
                        <div class="card-icon">📚</div>
                        <h3>HeartReddit</h3>
                        <p>Communities</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.renderOurPlaces()">
                        <div class="card-icon">💕</div>
                        <h3>Our Places</h3>
                        <p>Memories</p>
                    </div>
                </div>

                <div class="homepage-footer">
                    <p>💕 Made with love for our journey together 💕</p>
                </div>
            </div>
        `;
    },

    homeSearch: function() {
        const input = document.getElementById('homepage-search');
        const query = input.value.trim();
        if (query) {
            document.getElementById('browser-url').value = query;
            this.search();
        }
    },

    searchFor: function(query) {
        document.getElementById('browser-url').value = query;
        this.search();
    },

    renderSearchResults: function(query) {
        // Redirect to Google search
        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        return `
            <div class="browser-page search-page">
                <div class="search-redirect">
                    <div class="loading-spinner">🔍</div>
                    <h2>Searching for "${query}"...</h2>
                    <p>Redirecting to Google...</p>
                    <iframe src="${googleUrl}" class="browser-frame"></iframe>
                </div>
            </div>
        `;
    },

    renderOurPlaces: function() {
        this.tabs[this.currentTab] = {
            title: "💕 Our Places",
            type: "custom",
            content: `
                <div class="browser-page maps-page">
                    <div class="maps-header">
                        <h2>🗺️ Our Places Around the World</h2>
                        <p>Every pin tells a story of us</p>
                    </div>

                    <div class="maps-grid">
                        <div class="place-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <h3>🇨🇿 Prague, Czechia</h3>
                            <p>Where your heart calls home</p>
                            <button class="place-btn" onclick="BROWSER.quickLink('Prague Map', 'https://www.google.com/maps/place/Prague,+Czechia')">
                                Open in Maps →
                            </button>
                        </div>

                        <div class="place-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                            <h3>🇿🇦 Cape Town, South Africa</h3>
                            <p>Where adventure begins</p>
                            <button class="place-btn" onclick="BROWSER.quickLink('Cape Town Map', 'https://www.google.com/maps/place/Cape+Town,+South+Africa')">
                                Open in Maps →
                            </button>
                        </div>

                        <div class="place-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                            <h3>✈️ Distance</h3>
                            <p>~9,500 km | ~12 hours</p>
                            <button class="place-btn" onclick="BROWSER.quickLink('Flight Route', 'https://www.google.com/maps/dir/Prague,+Czechia/Cape+Town,+South+Africa')">
                                View Route →
                            </button>
                        </div>

                        <div class="place-card" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                            <h3>🌍 Future Dreams</h3>
                            <p>Places we'll explore</p>
                            <button class="place-btn" onclick="alert('✈️ Coming soon: Bucket list planner!')">
                                Plan Adventure →
                            </button>
                        </div>
                    </div>

                    <div class="memory-timeline">
                        <h3>📍 Our Journey So Far</h3>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <h4>July 2024 - First Visit to Czechia 🇨🇿</h4>
                                <p>Where it all began. Prague, Brno, and unforgettable memories.</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <h4>December 2024 - Winter Magic ❄️</h4>
                                <p>Snow, warmth, and cozy moments together.</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <h4>Future - Forever Together 💕</h4>
                                <p>More adventures await...</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
        this.switchTab(this.currentTab);
    },

    // Zoom controls
    zoomIn: function() {
        if (this.zoomLevel < 200) {
            this.zoomLevel += 10;
            this.applyZoom();
        }
    },

    zoomOut: function() {
        if (this.zoomLevel > 50) {
            this.zoomLevel -= 10;
            this.applyZoom();
        }
    },

    resetZoom: function() {
        this.zoomLevel = 100;
        this.applyZoom();
    },

    applyZoom: function() {
        const viewport = document.getElementById('browser-viewport');
        const zoomDisplay = document.getElementById('zoom-level');
        
        if (viewport) {
            const iframe = viewport.querySelector('iframe');
            if (iframe) {
                iframe.style.transform = `scale(${this.zoomLevel / 100})`;
                iframe.style.transformOrigin = 'top left';
                iframe.style.width = `${100 / (this.zoomLevel / 100)}%`;
                iframe.style.height = `${100 / (this.zoomLevel / 100)}%`;
            }
        }
        
        if (zoomDisplay) {
            zoomDisplay.textContent = `${this.zoomLevel}%`;
        }
    }
};
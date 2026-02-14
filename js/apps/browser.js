// @ts-nocheck
/* js/apps/browser.js - RETRO INTERNET EXPLORER */
const BROWSER = {
    currentTab: 0,
    tabs: [],
    history: [],
    searchHistory: [],
    zoomLevel: 100,

    // Helper for safe translations
    t: function(key) {
        return (typeof I18N !== 'undefined' && I18N.t) ? I18N.t(key) : key;
    },

    init: function() {
        console.log('\uD83C\uDF10 BROWSER.init() called');
        
        this.tabs = [
            {
                title: "\uD83D\uDC95 " + this.t('browser_home'),
                type: "custom",
                content: this.renderHomepage()
            }
        ];

        try {
            const saved = localStorage.getItem('browserSearchHistory');
            if (saved) {
                this.searchHistory = JSON.parse(saved);
            }
        } catch(e) {
            console.log('Could not load search history');
            this.searchHistory = [];
        }

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

        console.log('Browser initialized, waiting for window open');
    },

    renderOnOpen: function() {
        console.log('\uD83C\uDF10 Rendering browser interface');
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
        const t = this.t.bind(this);
        
        container.innerHTML = `
            <div class="browser-chrome">
                <!-- Address Bar -->
                <div class="browser-toolbar">
                    <div class="browser-nav-buttons">
                        <button class="browser-btn" onclick="BROWSER.back()" title="${t('browser_back')}">&#9668;</button>
                        <button class="browser-btn" onclick="BROWSER.forward()" title="${t('browser_forward')}">&#9658;</button>
                        <button class="browser-btn" onclick="BROWSER.refresh()" title="${t('browser_refresh')}">&#8635;</button>
                        <button class="browser-btn" onclick="BROWSER.home()" title="${t('browser_home')}">\uD83C\uDFE0</button>
                    </div>
                    <div class="browser-address-bar">
                        <span class="address-protocol">https://</span>
                        <input type="text" id="browser-url" class="address-input" placeholder="${t('browser_search')}" 
                               onkeypress="if(event.key==='Enter') BROWSER.search()">
                        <button class="browser-btn go-btn" onclick="BROWSER.search()">GO</button>
                    </div>
                    <div class="browser-zoom-controls">
                        <button class="browser-btn" onclick="BROWSER.zoomOut()" title="${t('browser_zoom_out')}">&#128269;&#8722;</button>
                        <span class="zoom-level" id="zoom-level">100%</span>
                        <button class="browser-btn" onclick="BROWSER.zoomIn()" title="${t('browser_zoom_in')}">&#128269;+</button>
                        <button class="browser-btn" onclick="BROWSER.resetZoom()" title="${t('browser_zoom_reset')}">&#10226;</button>
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
                <button class="tab-close" onclick="BROWSER.closeTab(${index}); event.stopPropagation()">&#10005;</button>
            `;
            tabEl.onclick = () => this.switchTab(index);
            tabBar.appendChild(tabEl);
        });

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
        
        const urlInput = document.getElementById('browser-url');
        if (urlInput) {
            if (tab.type === 'iframe') {
                urlInput.value = tab.url.replace('https://', '');
            } else {
                urlInput.value = 'heartos.love';
            }
        }

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
        const t = this.t.bind(this);
        if (this.tabs.length <= 1) {
            alert(t('browser_cant_close_last'));
            return;
        }

        this.tabs.splice(index, 1);
        
        if (this.currentTab >= index && this.currentTab > 0) {
            this.currentTab--;
        }
        
        this.switchTab(this.currentTab);
    },

    newTab: function() {
        const t = this.t.bind(this);
        this.tabs.push({
            title: "\uD83D\uDC95 " + t('browser_new_tab'),
            type: "custom",
            content: this.renderHomepage()
        });
        
        this.switchTab(this.tabs.length - 1);
    },

    back: function() {
        alert(this.t('browser_back_soon'));
    },

    forward: function() {
        alert(this.t('browser_forward_soon'));
    },

    refresh: function() {
        this.switchTab(this.currentTab);
    },

    home: function() {
        this.tabs[this.currentTab] = {
            title: "\uD83D\uDC95 " + this.t('browser_home'),
            type: "custom",
            content: this.renderHomepage()
        };
        this.switchTab(this.currentTab);
    },

    search: function() {
        const input = document.getElementById('browser-url');
        const query = input.value.trim();
        
        if (!query) return;

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
            title: "\uD83D\uDD0D " + query,
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
        const t = this.t.bind(this);
        const recentSearches = this.searchHistory.slice(0, 5);
        
        return `
            <div class="browser-page homepage">
                <div class="homepage-header">
                    <h1>\uD83D\uDC95 ${t('browser_welcome')}</h1>
                    <p>${t('browser_welcome_sub')}</p>
                </div>

                <div class="homepage-search">
                    <input type="text" id="homepage-search" class="homepage-search-input" 
                           placeholder="${t('browser_search')}" 
                           onkeypress="if(event.key==='Enter') BROWSER.homeSearch()">
                    <button class="homepage-search-btn" onclick="BROWSER.homeSearch()">\uD83D\uDD0D ${t('browser_search_btn')}</button>
                </div>

                ${recentSearches.length > 0 ? `
                    <div class="recent-searches">
                        <h3>${t('browser_recent')}:</h3>
                        <div class="search-chips">
                            ${recentSearches.map(s => `
                                <div class="search-chip" onclick="BROWSER.searchFor('${s}')">
                                    \uD83D\uDD0D ${s}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="homepage-grid">
                    <div class="homepage-card" onclick="BROWSER.quickLink('\uD83D\uDCE7 Gmail', 'assets/sites/email.html')">
                        <div class="card-icon">\uD83D\uDCE7</div>
                        <h3>Gmail</h3>
                        <p>${t('browser_card_email')}</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('\uD83D\uDCF8 Instagram', 'assets/sites/instagram.html')">
                        <div class="card-icon">\uD83D\uDCF8</div>
                        <h3>Instagram</h3>
                        <p>${t('browser_card_insta')}</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('\uD83C\uDFB5 Spotify', 'assets/sites/spotify.html')">
                        <div class="card-icon">\uD83C\uDFB5</div>
                        <h3>Spotify</h3>
                        <p>${t('browser_card_spotify')}</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('\uD83D\uDCAC WhatsApp', 'assets/sites/whatsapp.html')">
                        <div class="card-icon">\uD83D\uDCAC</div>
                        <h3>WhatsApp</h3>
                        <p>${t('browser_card_whatsapp')}</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('\uD83D\uDCFA YouTube', 'assets/sites/youtube.html')">
                        <div class="card-icon">\uD83D\uDCFA</div>
                        <h3>YouTube</h3>
                        <p>${t('browser_card_youtube')}</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('\uD83D\uDDFA\uFE0F Maps', 'assets/sites/maps.html')">
                        <div class="card-icon">\uD83D\uDDFA\uFE0F</div>
                        <h3>HeartMaps</h3>
                        <p>${t('browser_card_maps')}</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('\uD83D\uDED2 Amazon', 'assets/sites/amazon.html')">
                        <div class="card-icon">\uD83D\uDED2</div>
                        <h3>Amazon</h3>
                        <p>${t('browser_card_amazon')}</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('\uD83C\uDFAC Netflix', 'assets/sites/netflix.html')">
                        <div class="card-icon">\uD83C\uDFAC</div>
                        <h3>Netflix</h3>
                        <p>${t('browser_card_netflix')}</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('\uD83D\uDCBC LinkedIn', 'assets/sites/linkedin.html')">
                        <div class="card-icon">\uD83D\uDCBC</div>
                        <h3>HeartedIn</h3>
                        <p>${t('browser_card_linkedin')}</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('\uD83D\uDC26 Twitter/X', 'assets/sites/twitter.html')">
                        <div class="card-icon">\uD83D\uDC26</div>
                        <h3>HeartTweet</h3>
                        <p>${t('browser_card_twitter')}</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.quickLink('\uD83D\uDCDA Reddit', 'assets/sites/reddit.html')">
                        <div class="card-icon">\uD83D\uDCDA</div>
                        <h3>HeartReddit</h3>
                        <p>${t('browser_card_reddit')}</p>
                    </div>

                    <div class="homepage-card" onclick="BROWSER.renderOurPlaces()">
                        <div class="card-icon">\uD83D\uDC95</div>
                        <h3>${t('browser_card_places_title')}</h3>
                        <p>${t('browser_card_places')}</p>
                    </div>
                </div>

                <div class="homepage-footer">
                    <p>\uD83D\uDC95 ${t('browser_footer')} \uD83D\uDC95</p>
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
        const t = this.t.bind(this);
        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        return `
            <div class="browser-page search-page">
                <div class="search-redirect">
                    <div class="loading-spinner">\uD83D\uDD0D</div>
                    <h2>${t('browser_searching')} "${query}"...</h2>
                    <p>${t('browser_redirecting')}</p>
                    <iframe src="${googleUrl}" class="browser-frame"></iframe>
                </div>
            </div>
        `;
    },

    renderOurPlaces: function() {
        const t = this.t.bind(this);
        this.tabs[this.currentTab] = {
            title: "\uD83D\uDC95 " + t('browser_card_places_title'),
            type: "custom",
            content: `
                <div class="browser-page maps-page">
                    <div class="maps-header">
                        <h2>\uD83D\uDDFA\uFE0F ${t('places_title')}</h2>
                        <p>${t('places_subtitle')}</p>
                    </div>

                    <div class="maps-grid">
                        <div class="place-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <h3>\uD83C\uDDE8\uD83C\uDDFF ${t('places_prague')}</h3>
                            <p>${t('places_prague_desc')}</p>
                            <button class="place-btn" onclick="BROWSER.quickLink('Prague Map', 'https://www.google.com/maps/place/Prague,+Czechia')">
                                ${t('places_open_maps')} \u2192
                            </button>
                        </div>

                        <div class="place-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                            <h3>\uD83C\uDDFF\uD83C\uDDE6 ${t('places_cape_town')}</h3>
                            <p>${t('places_cape_town_desc')}</p>
                            <button class="place-btn" onclick="BROWSER.quickLink('Cape Town Map', 'https://www.google.com/maps/place/Cape+Town,+South+Africa')">
                                ${t('places_open_maps')} \u2192
                            </button>
                        </div>

                        <div class="place-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                            <h3>\u2708\uFE0F ${t('places_distance')}</h3>
                            <p>~9 500 km | ~12 ${t('places_hours')}</p>
                            <button class="place-btn" onclick="BROWSER.quickLink('Flight Route', 'https://www.google.com/maps/dir/Prague,+Czechia/Cape+Town,+South+Africa')">
                                ${t('places_view_route')} \u2192
                            </button>
                        </div>

                        <div class="place-card" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                            <h3>\uD83C\uDF0D ${t('places_future')}</h3>
                            <p>${t('places_future_desc')}</p>
                            <button class="place-btn" onclick="alert('\u2708\uFE0F ${t('places_coming_soon')}')">
                                ${t('places_plan')} \u2192
                            </button>
                        </div>
                    </div>

                    <div class="memory-timeline">
                        <h3>\uD83D\uDCCD ${t('places_journey')}</h3>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <h4>${t('places_july_2024')} \uD83C\uDDE8\uD83C\uDDFF</h4>
                                <p>${t('places_july_2024_desc')}</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <h4>${t('places_dec_2024')} \u2744\uFE0F</h4>
                                <p>${t('places_dec_2024_desc')}</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <h4>${t('places_future_together')} \uD83D\uDC95</h4>
                                <p>${t('places_future_together_desc')}</p>
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
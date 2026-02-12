/* js/i18n-helpers.js - Helper utilities for easy translation */

/**
 * Language Helper - Makes it easy to add translations to your apps
 */
const I18N_HELPER = {
    
    /**
     * Auto-translate all elements with data-i18n attribute
     * Usage in HTML: <button data-i18n="btn_save">Save</button>
     */
    autoTranslate: function() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translated = I18N.t(key);
            
            // Update text content
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translated;
            } else {
                element.textContent = translated;
            }
        });
    },

    /**
     * Create a translatable button
     * @param {string} translationKey - Key from i18n.js
     * @param {function} onClick - Click handler
     * @param {string} className - Optional CSS class
     */
    createButton: function(translationKey, onClick, className = 'os-btn') {
        const btn = document.createElement('button');
        btn.className = className;
        btn.textContent = I18N.t(translationKey);
        btn.onclick = onClick;
        btn.setAttribute('data-i18n', translationKey); // For auto-updates
        return btn;
    },

    /**
     * Create translatable toolbar
     * @param {Array} buttons - Array of {key: 'translation_key', onClick: function}
     */
    createToolbar: function(buttons) {
        const toolbar = document.createElement('div');
        toolbar.className = 'toolbar';
        
        buttons.forEach(btn => {
            toolbar.appendChild(
                this.createButton(btn.key, btn.onClick, btn.className || 'os-btn')
            );
        });
        
        return toolbar;
    },

    /**
     * Translate HTML string with placeholders
     * @param {string} html - HTML with {{key}} placeholders
     */
    translateHTML: function(html) {
        return html.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
            return I18N.t(key.trim());
        });
    },

    /**
     * Register an app to auto-update when language changes
     * @param {Object} app - Your app object with render() method
     */
    registerApp: function(app) {
        if (!app.render) {
            console.error('App must have a render() method');
            return;
        }
        
        window.addEventListener('languageChanged', () => {
            console.log('Language changed, re-rendering app');
            app.render();
        });
    },

    /**
     * Get current language code
     * @returns {string} 'en' or 'cs'
     */
    getCurrentLang: function() {
        return I18N.currentLang;
    },

    /**
     * Check if current language is Czech
     * @returns {boolean}
     */
    isCzech: function() {
        return I18N.currentLang === 'cs';
    }
};

/**
 * Global language change event dispatcher
 * Call this whenever language changes
 */
function dispatchLanguageChange() {
    console.log('🌍 Language changed to:', I18N.currentLang);
    window.dispatchEvent(new Event('languageChanged'));
    I18N_HELPER.autoTranslate(); // Auto-translate marked elements
}

/**
 * Example usage in your apps:
 * 
 * // 1. Simple button creation
 * const saveBtn = I18N_HELPER.createButton('btn_save', () => this.save());
 * 
 * // 2. Toolbar creation
 * const toolbar = I18N_HELPER.createToolbar([
 *     { key: 'gallery_upload', onClick: () => this.upload() },
 *     { key: 'gallery_slideshow', onClick: () => this.slideshow() }
 * ]);
 * 
 * // 3. HTML with placeholders
 * const html = I18N_HELPER.translateHTML(`
 *     <h1>{{gallery_title}}</h1>
 *     <button>{{btn_save}}</button>
 * `);
 * 
 * // 4. Register app for auto-updates
 * I18N_HELPER.registerApp(GALLERY);
 * 
 * // 5. In HTML, use data-i18n attribute
 * <button data-i18n="btn_save">Save</button>
 * <input data-i18n="browser_search" placeholder="Search...">
 */
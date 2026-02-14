/* NOTE.EXE - Personal Message Application */

const NOTE = {
    messages: {
        en: {
            content: `Hi Agi.

I just wanted to let you know that you mean so much to me and I would never have ever thought that I could be this lucky and find the most perfect girl. There is nothing in this world more beautiful, no one more kind or caring.

I am so proud of you always and notice all the small things you do for me and everyone else.

Thank you for making me the happiest guy in the world.

I love you.

With love
~ Naeem`
        },
        cs: {
            content: `Ahoj Agi.

Jen jsem ti chtěl říct, že pro mě znamenáš tolik a nikdy by mě nenapadlo, že bych mohl mít takové štěstí a najít tu nejdokonalejší holku. Nic na tomto světě není krásnější, nikdo laskavější nebo starostlivější.

Jsem na tebe vždycky hrdý a všímám si všech malých věcí, které děláš pro mě a pro všechny ostatní.

Děkuji, že ze mě děláš nejšťastnějšího kluka na světě.

Miluji tě.

S láskou
~ Naeem`
        }
    },

    init() {
        console.log('📝 Note.exe initializing...');
        this.render();
        
        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            this.render();
        });
        
        // Also listen for message events from parent window
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'languageChanged') {
                this.render();
            }
        });
    },

    getCurrentLanguage() {
        // Check if I18N exists
        if (typeof I18N !== 'undefined' && I18N.currentLang) {
            return I18N.currentLang;
        }
        
        // Check localStorage
        const stored = localStorage.getItem('heartosLang');
        if (stored) return stored;
        
        // Default to English
        return 'en';
    },

    render() {
        const container = document.getElementById('note-content');
        if (!container) {
            console.warn('note-content container not found');
            return;
        }

        const lang = this.getCurrentLanguage();
        const message = this.messages[lang] || this.messages.en;

        // Create beautiful note styling
        container.innerHTML = `
            <style>
                #note-content {
                    background: linear-gradient(135deg, #fff9f0 0%, #ffe8e8 100%);
                    font-family: 'Georgia', 'Times New Roman', serif;
                    color: #2a1a1a;
                    position: relative;
                    overflow-y: auto;
                }
                
                #note-content::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: 
                        repeating-linear-gradient(
                            transparent,
                            transparent 25px,
                            rgba(255, 77, 109, 0.08) 25px,
                            rgba(255, 77, 109, 0.08) 26px
                        );
                    pointer-events: none;
                    z-index: 1;
                }
                
                .note-inner {
                    position: relative;
                    z-index: 2;
                    white-space: pre-wrap;
                    padding: 15px 20px;
                    line-height: 2;
                }
                
                .note-decoration {
                    text-align: center;
                    font-size: 2rem;
                    margin: 20px 0;
                    color: #ff4d6d;
                    animation: heartbeat 1.5s ease-in-out infinite;
                }
                
                @keyframes heartbeat {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.15);
                    }
                }
                
                .note-signature {
                    margin-top: 30px;
                    font-style: italic;
                    color: #ff4d6d;
                }
            </style>
            <div class="note-decoration">♥</div>
            <div class="note-inner">${this.escapeHtml(message.content)}</div>
            <div class="note-decoration">♥</div>
        `;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Auto-initialize when the window is opened
window.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the app to be opened
    setTimeout(() => {
        const noteWin = document.getElementById('win-note');
        if (noteWin && !noteWin.classList.contains('hidden')) {
            NOTE.init();
        }
    }, 100);
});
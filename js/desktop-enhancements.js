// DESKTOP-ENHANCEMENTS.JS - Minimal version with animations DISABLED

const DESKTOP_ENHANCEMENTS = {
    // State
    stickyNotes: [],
    stickyNoteCounter: 0,
    
    init() {
        console.log('Desktop enhancements loading (minimal mode - no animations)...');
        this.setupWindowEnhancements();
        this.setupInteractiveWidgets();
        this.setupDesktopCustomization();
        this.loadStickyNotes();
    },

    // ===== WINDOW ENHANCEMENTS (MINIMAL) =====
    setupWindowEnhancements() {
        const style = document.createElement('style');
        style.textContent = `
            .os-window-box {
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
            }
        `;
        document.head.appendChild(style);
    },

    // ===== 4. INTERACTIVE ELEMENTS =====
    setupInteractiveWidgets() {
        this.createEnhancedClock();
    },
    
    createEnhancedClock() {
        const widget = document.getElementById('desktop-widget');
        if (!widget) return;
        
        // Add enhanced clock row
        const clockRow = document.createElement('div');
        clockRow.className = 'widget-row';
        clockRow.style.cssText = 'font-size: 1.4rem; font-weight: bold; border-top: 2px solid var(--accent); padding-top: 5px; margin-top: 5px;';
        clockRow.innerHTML = `
            <span id="widget-date" style="font-size: 1rem;">...</span>
            <span id="widget-time">00:00</span>
        `;
        widget.appendChild(clockRow);
        
        this.updateEnhancedClock();
        setInterval(() => this.updateEnhancedClock(), 1000);
    },
    
    updateEnhancedClock() {
        const now = new Date();
        const timeEl = document.getElementById('widget-time');
        const dateEl = document.getElementById('widget-date');
        
        if (timeEl) {
            timeEl.textContent = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
        }
        
        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
        }
    },

    // ===== 5. DESKTOP CUSTOMIZATION =====
    setupDesktopCustomization() {
        // Add right-click context menu
        const desktop = document.getElementById('desktop-screen');
        if (!desktop) return;
        
        desktop.addEventListener('contextmenu', (e) => {
            // Only show if clicking on desktop background
            if (e.target.id === 'desktop-screen' || e.target.id === 'icon-grid') {
                e.preventDefault();
                this.showDesktopContextMenu(e.clientX, e.clientY);
            }
        });
        
        // Close menu on click elsewhere
        document.addEventListener('click', () => {
            const menu = document.getElementById('context-menu');
            if (menu) menu.remove();
        });
    },
    
    showDesktopContextMenu(x, y) {
        // Remove existing menu
        const existing = document.getElementById('context-menu');
        if (existing) existing.remove();
        
        const menu = document.createElement('div');
        menu.id = 'context-menu';
        menu.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            background: var(--win-bg);
            border: 2px solid var(--accent);
            padding: 5px 0;
            z-index: 10000;
            box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
            min-width: 180px;
            font-size: 1.2rem;
        `;
        
        const items = [
            { label: '🔄 Refresh', action: () => location.reload() },
            { label: '📝 New Sticky Note', action: () => this.createStickyNote() },
            { divider: true },
            { label: '⚙️ Personalize', action: () => alert('Desktop customization coming soon!') }
        ];
        
        items.forEach(item => {
            if (item.divider) {
                const divider = document.createElement('div');
                divider.style.cssText = 'height: 1px; background: var(--accent); margin: 5px 0; opacity: 0.3;';
                menu.appendChild(divider);
            } else {
                const menuItem = document.createElement('div');
                menuItem.textContent = item.label;
                menuItem.style.cssText = `
                    padding: 8px 15px;
                    cursor: pointer;
                    transition: background 0.1s;
                `;
                menuItem.onmouseover = () => {
                    menuItem.style.background = 'var(--accent)';
                    menuItem.style.color = 'white';
                };
                menuItem.onmouseout = () => {
                    menuItem.style.background = '';
                    menuItem.style.color = '';
                };
                menuItem.onclick = (e) => {
                    e.stopPropagation();
                    item.action();
                    menu.remove();
                };
                menu.appendChild(menuItem);
            }
        });
        
        document.body.appendChild(menu);
        
        // Adjust position if menu goes off screen
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            menu.style.left = (window.innerWidth - rect.width - 10) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            menu.style.top = (window.innerHeight - rect.height - 10) + 'px';
        }
    },
    
    createStickyNote() {
        const desktop = document.getElementById('desktop-screen');
        if (!desktop) return;
        
        this.stickyNoteCounter++;
        const noteId = `sticky-note-${this.stickyNoteCounter}`;
        
        const note = document.createElement('div');
        note.className = 'sticky-note';
        note.id = noteId;
        note.style.cssText = `
            position: absolute;
            left: ${100 + this.stickyNoteCounter * 30}px;
            top: ${100 + this.stickyNoteCounter * 30}px;
            width: 200px;
            min-height: 150px;
            background: #feff9c;
            border: 1px solid #ddd;
            box-shadow: 5px 5px 15px rgba(0,0,0,0.3);
            padding: 10px;
            z-index: 100;
            font-family: 'Comic Sans MS', cursive;
            cursor: move;
        `;
        
        note.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="font-weight: bold; font-size: 0.8rem;">📌 Note</span>
                <button onclick="DESKTOP_ENHANCEMENTS.deleteStickyNote('${noteId}')" 
                        style="background: #ff6b6b; border: none; color: white; cursor: pointer; padding: 2px 6px; border-radius: 3px;">
                    ×
                </button>
            </div>
            <textarea style="width: 100%; min-height: 100px; border: none; background: transparent; 
                            font-family: inherit; resize: vertical; outline: none; font-size: 1rem;"
                      placeholder="Type your note..."
                      onchange="DESKTOP_ENHANCEMENTS.saveStickyNotes()"></textarea>
        `;
        
        desktop.appendChild(note);
        this.makeDraggable(note);
        this.saveStickyNotes();
        
        const menu = document.getElementById('context-menu');
        if (menu) menu.remove();
    },
    
    makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        element.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
            
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            DESKTOP_ENHANCEMENTS.saveStickyNotes();
        }
    },
    
    deleteStickyNote(noteId) {
        const note = document.getElementById(noteId);
        if (note) {
            note.remove();
            this.saveStickyNotes();
        }
    },
    
    saveStickyNotes() {
        const notes = [];
        document.querySelectorAll('.sticky-note').forEach(note => {
            const textarea = note.querySelector('textarea');
            notes.push({
                id: note.id,
                content: textarea ? textarea.value : '',
                left: note.style.left,
                top: note.style.top
            });
        });
        localStorage.setItem('heartosNotes', JSON.stringify(notes));
    },
    
    loadStickyNotes() {
        const saved = localStorage.getItem('heartosNotes');
        if (!saved) return;
        
        try {
            const notes = JSON.parse(saved);
            notes.forEach(noteData => {
                setTimeout(() => {
                    const desktop = document.getElementById('desktop-screen');
                    if (!desktop) return;
                    
                    const note = document.createElement('div');
                    note.className = 'sticky-note';
                    note.id = noteData.id;
                    note.style.cssText = `
                        position: absolute;
                        left: ${noteData.left};
                        top: ${noteData.top};
                        width: 200px;
                        min-height: 150px;
                        background: #feff9c;
                        border: 1px solid #ddd;
                        box-shadow: 5px 5px 15px rgba(0,0,0,0.3);
                        padding: 10px;
                        z-index: 100;
                        font-family: 'Comic Sans MS', cursive;
                        cursor: move;
                    `;
                    
                    note.innerHTML = `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="font-weight: bold; font-size: 0.8rem;">📌 Note</span>
                            <button onclick="DESKTOP_ENHANCEMENTS.deleteStickyNote('${noteData.id}')" 
                                    style="background: #ff6b6b; border: none; color: white; cursor: pointer; padding: 2px 6px; border-radius: 3px;">
                                ×
                            </button>
                        </div>
                        <textarea style="width: 100%; min-height: 100px; border: none; background: transparent; 
                                        font-family: inherit; resize: vertical; outline: none; font-size: 1rem;"
                                  onchange="DESKTOP_ENHANCEMENTS.saveStickyNotes()">${noteData.content}</textarea>
                    `;
                    
                    desktop.appendChild(note);
                    this.makeDraggable(note);
                }, 100);
            });
        } catch (e) {
            console.error('Error loading sticky notes:', e);
        }
    }
};

// Auto-initialize when desktop loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for desktop to be visible
        const checkDesktop = setInterval(() => {
            const desktop = document.getElementById('desktop-screen');
            if (desktop && !desktop.classList.contains('hidden')) {
                DESKTOP_ENHANCEMENTS.init();
                clearInterval(checkDesktop);
            }
        }, 100);
    });
} else {
    setTimeout(() => DESKTOP_ENHANCEMENTS.init(), 1000);
}
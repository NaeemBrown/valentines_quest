/* DESKTOP MANAGER - Enhanced Window & Desktop Management for HeartOS v3.0 */

const DESKTOP_MANAGER = {
    // State
    windows: new Map(),
    activeWindow: null,
    zIndex: 100,
    minimizedWindows: new Set(),

    ensureResizeHandles(win) {
        // If handles already exist, don't duplicate
        if (win.querySelector('.resize-handle')) return;

         const handles = ['se','e','s','sw','ne','nw','w','n'];
        handles.forEach(pos => {
            const h = document.createElement('div');
            h.className = `resize-handle resize-${pos}`;
            win.appendChild(h);
        });

        // Inject minimal positioning styles if not already present
        if (!document.getElementById('resize-handle-style')) {
            const style = document.createElement('style');
            style.id = 'resize-handle-style';
            style.textContent = `
                .resize-handle { position:absolute; width:14px; height:14px; z-index:10001; }
                .resize-w  { left:-6px; top:50%; transform:translateY(-50%); height:40px; }
                .resize-n  { top:-6px; left:50%; transform:translateX(-50%); width:40px; }
                .resize-se { right:-6px; bottom:-6px; }
                .resize-e  { right:-6px; top:50%; transform:translateY(-50%); height:40px; }
                .resize-s  { bottom:-6px; left:50%; transform:translateX(-50%); width:40px; }
                .resize-sw { left:-6px; bottom:-6px; }
                .resize-ne { right:-6px; top:-6px; }
                .resize-nw { left:-6px; top:-6px; }
            `;
            document.head.appendChild(style);
        }
    },
    
    // Dragging state
    dragState: {
        isDragging: false,
        window: null,
        startX: 0,
        startY: 0,
        initialLeft: 0,
        initialTop: 0,
        offsetX: 0,
        offsetY: 0
    },
    
    // Grid settings
    gridSize: 20,
    snapToGrid: true,
    
    // Desktop customization
    iconSize: 'medium', // small, medium, large
    
    init() {
        console.log('🖥️ Desktop Manager initializing...');
        this.setupWindows();
        this.setupDesktopIcons();
        this.setupDesktopContextMenu();
        this.setupKeyboardShortcuts();
        this.setupTaskbar();
        this.injectStyles();
        console.log('✅ Desktop Manager ready');
    },
    
    // ==================== WINDOW MANAGEMENT ====================
    
    setupWindows() {
        // Register all app windows
        document.querySelectorAll('.app-window').forEach(win => {
            const id = win.id;
            this.windows.set(id, {
                element: win,
                isMinimized: false,
                isMaximized: false,
                savedPosition: null,
                savedSize: null
            });
            
            // Setup window controls
            this.setupWindowControls(win);
            this.setupWindowDragging(win);
            this.ensureResizeHandles(win);
            this.setupWindowResize(win);
            this.setupWindowFocus(win);
            this.setupWindowTitlebar(win);
        });
    },
    
    setupWindowControls(win) {
        const id = win.id;
        const controlsDiv = win.querySelector('.win-controls');
        
        if (!controlsDiv) return;
        
        // Clear existing controls
        controlsDiv.innerHTML = '';
        
        // Minimize button
        const minBtn = document.createElement('button');
        minBtn.innerHTML = '_';
        minBtn.title = 'Minimize';
        minBtn.onclick = (e) => {
            e.stopPropagation();
            this.minimizeWindow(id);
        };
        
        // Maximize button
        const maxBtn = document.createElement('button');
        maxBtn.innerHTML = '□';
        maxBtn.title = 'Maximize';
        maxBtn.onclick = (e) => {
            e.stopPropagation();
            this.toggleMaximize(id);
        };
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = 'X';
        closeBtn.title = 'Close';
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            this.closeWindow(id);
        };
        
        controlsDiv.appendChild(minBtn);
        controlsDiv.appendChild(maxBtn);
        controlsDiv.appendChild(closeBtn);
    },
    
    setupWindowDragging(win) {
        const titleBar = win.querySelector('.window-bar');
        if (!titleBar) return;
        
        titleBar.addEventListener('mousedown', (e) => {
            // Don't drag if clicking on buttons
            if (e.target.tagName === 'BUTTON') return;
            
            const winData = this.windows.get(win.id);
            if (winData.isMaximized) return; // Can't drag maximized windows
            
            e.preventDefault();
            
            // Bring to front
            this.focusWindow(win.id);
            
            // Start dragging
            this.dragState.isDragging = true;
            this.dragState.window = win;
            this.dragState.startX = e.clientX;
            this.dragState.startY = e.clientY;
            this.dragState.initialLeft = win.offsetLeft;
            this.dragState.initialTop = win.offsetTop;
            this.dragState.offsetX = e.clientX - win.offsetLeft;
            this.dragState.offsetY = e.clientY - win.offsetTop;
            
            win.classList.add('dragging');
            titleBar.style.cursor = 'grabbing';
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        });
        
        // Global mouse move
        document.addEventListener('mousemove', (e) => {
            if (!this.dragState.isDragging) return;
            
            e.preventDefault();
            const win = this.dragState.window;
            
            // Calculate new position
            let newLeft = e.clientX - this.dragState.offsetX;
            let newTop = e.clientY - this.dragState.offsetY;
            
            // Get window and screen dimensions
            const winWidth = win.offsetWidth;
            const winHeight = win.offsetHeight;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const taskbarHeight = 40;
            
            // Constrain to screen bounds (keep at least 50px visible)
            const minVisible = 50;
            newLeft = Math.max(-winWidth + minVisible, Math.min(screenWidth - minVisible, newLeft));
            newTop = Math.max(0, Math.min(screenHeight - taskbarHeight - 30, newTop));
            
            // Apply position
            win.style.left = newLeft + 'px';
            win.style.top = newTop + 'px';
            
            // Show snap zones
            this.showSnapZones(e.clientX, e.clientY);
        });
        
        // Global mouse up
        document.addEventListener('mouseup', (e) => {
            if (!this.dragState.isDragging) return;
            
            const win = this.dragState.window;
            
            // Handle window snapping
            this.handleWindowSnap(win, e.clientX, e.clientY);
            
            // Cleanup
            win.classList.remove('dragging');
            const titleBar = win.querySelector('.window-bar');
            if (titleBar) titleBar.style.cursor = 'grab';
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            
            this.dragState.isDragging = false;
            this.dragState.window = null;
            
            this.hideSnapZones();
        });
        
        // Set initial cursor
        titleBar.style.cursor = 'grab';
    },
    
    setupWindowResize(win) {
        // Setup resize functionality for all handles
        const handles = win.querySelectorAll('.resize-handle');
        
        handles.forEach(handle => {
            handle.style.transition = 'background 0.2s';
            
            let isResizing = false;
            let startX, startY, startWidth, startHeight, startLeft, startTop;
            const handleClass = handle.className.split(' ').find(c => c.startsWith('resize-') && c !== 'resize-handle');
            const position = handleClass ? handleClass.replace('resize-', '') : '';

            const cursorMap = {
                se: 'nwse-resize', nw: 'nwse-resize',
                ne: 'nesw-resize', sw: 'nesw-resize',
                e: 'ew-resize', w: 'ew-resize',
                n: 'ns-resize', s: 'ns-resize'
            };
            if (cursorMap[position]) handle.style.cursor = cursorMap[position];

            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = parseInt(getComputedStyle(win).width);
                startHeight = parseInt(getComputedStyle(win).height);
                startLeft = win.offsetLeft;
                startTop = win.offsetTop;
                
                // Bring window to front
                this.focusWindow(win.id);
                
                // Add resizing class
                win.classList.add('resizing');
                
                // Prevent text selection while resizing
                document.body.style.userSelect = 'none';
            });
            
            const handleMouseMove = (e) => {
                if (!isResizing) return;
                
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                const minWidth = 400;
                const minHeight = 300;
                
                // Get screen bounds
                const maxWidth = window.innerWidth - startLeft;
                const maxHeight = window.innerHeight - startTop - 40; // 40px for taskbar
                
                // Handle different resize directions
                if (position.includes('e')) {
                    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX));
                    win.style.width = newWidth + 'px';
                }
                
                if (position.includes('s')) {
                    const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
                    win.style.height = newHeight + 'px';
                }
                
                if (position.includes('w')) {
                    const newWidth = Math.max(minWidth, startWidth - deltaX);
                    const newLeft = startLeft + deltaX;
                    
                    // Don't allow window to go off left edge
                    if (newWidth > minWidth && newLeft >= 0) {
                        win.style.width = newWidth + 'px';
                        win.style.left = newLeft + 'px';
                    }
                }
                
                if (position.includes('n')) {
                    const newHeight = Math.max(minHeight, startHeight - deltaY);
                    const newTop = startTop + deltaY;
                    
                    // Don't allow window to go off top edge
                    if (newHeight > minHeight && newTop >= 0) {
                        win.style.height = newHeight + 'px';
                        win.style.top = newTop + 'px';
                    }
                }
            };
            
            const handleMouseUp = () => {
                if (isResizing) {
                    isResizing = false;
                    win.classList.remove('resizing');
                    document.body.style.userSelect = '';
                }
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });
    },
    
    setupWindowFocus(win) {
        win.addEventListener('mousedown', () => {
            this.focusWindow(win.id);
        });
    },
    
    setupWindowTitlebar(win) {
        const titleBar = win.querySelector('.window-bar');
        if (!titleBar) return;
        
        // Double-click to maximize
        titleBar.addEventListener('dblclick', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            this.toggleMaximize(win.id);
        });
        
        // Right-click context menu
        titleBar.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showWindowContextMenu(win.id, e.clientX, e.clientY);
        });
    },
    
    focusWindow(winId) {
        const winData = this.windows.get(winId);
        if (!winData) return;
        
        // Remove active class from all windows
        this.windows.forEach((data, id) => {
            data.element.classList.remove('active-window');
        });
        
        // Add active class and bring to front
        winData.element.classList.add('active-window');
        winData.element.style.zIndex = ++this.zIndex;
        this.activeWindow = winId;
    },
    
    minimizeWindow(winId) {
        const winData = this.windows.get(winId);
        if (!winData) return;
        
        winData.element.classList.add('minimizing');
        
        setTimeout(() => {
            winData.element.classList.add('hidden');
            winData.element.classList.remove('minimizing');
            winData.isMinimized = true;
            this.minimizedWindows.add(winId);
            this.updateTaskbar();
        }, 300);
        
        SYSTEM.playAudio('click-sound');
    },
    
    restoreWindow(winId) {
        const winData = this.windows.get(winId);
        if (!winData) return;
        
        winData.element.classList.remove('hidden');
        winData.element.classList.add('restoring');
        winData.isMinimized = false;
        this.minimizedWindows.delete(winId);
        
        setTimeout(() => {
            winData.element.classList.remove('restoring');
        }, 300);
        
        this.focusWindow(winId);
        this.updateTaskbar();
        SYSTEM.playAudio('click-sound');
    },
    
    toggleMaximize(winId) {
        const winData = this.windows.get(winId);
        if (!winData) return;
        
        if (winData.isMaximized) {
            // Restore
            if (winData.savedPosition) {
                winData.element.style.left = winData.savedPosition.left;
                winData.element.style.top = winData.savedPosition.top;
                winData.element.style.width = winData.savedSize.width;
                winData.element.style.height = winData.savedSize.height;
            }
            winData.element.classList.remove('maximized');
            winData.isMaximized = false;
        } else {
            // Maximize
            winData.savedPosition = {
                left: winData.element.style.left,
                top: winData.element.style.top
            };
            winData.savedSize = {
                width: winData.element.style.width,
                height: winData.element.style.height
            };
            
            winData.element.style.left = '0';
            winData.element.style.top = '0';
            winData.element.style.width = '100%';
            winData.element.style.height = 'calc(100% - 40px)'; // Account for taskbar
            winData.element.classList.add('maximized');
            winData.isMaximized = true;
        }
        
        SYSTEM.playAudio('click-sound');
    },
    
    closeWindow(winId) {
        const winData = this.windows.get(winId);
        if (!winData) return;
        
        winData.element.classList.add('closing');
        
        setTimeout(() => {
            winData.element.classList.add('hidden');
            winData.element.classList.remove('closing');
            winData.isMinimized = false;
            this.minimizedWindows.delete(winId);
            this.updateTaskbar();
        }, 300);
        
        SYSTEM.playAudio('click-sound');
    },
    
    // ==================== WINDOW SNAPPING ====================
    
    showSnapZones(mouseX, mouseY) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const snapThreshold = 50;
        
        // Remove existing snap zones
        this.hideSnapZones();
        
        let snapZone = null;
        
        // Left edge
        if (mouseX < snapThreshold) {
            snapZone = this.createSnapZone(0, 0, screenWidth / 2, screenHeight - 40);
        }
        // Right edge
        else if (mouseX > screenWidth - snapThreshold) {
            snapZone = this.createSnapZone(screenWidth / 2, 0, screenWidth / 2, screenHeight - 40);
        }
        // Top edge (maximize)
        else if (mouseY < snapThreshold) {
            snapZone = this.createSnapZone(0, 0, screenWidth, screenHeight - 40);
        }
        
        if (snapZone) {
            document.body.appendChild(snapZone);
        }
    },
    
    createSnapZone(left, top, width, height) {
        const zone = document.createElement('div');
        zone.className = 'snap-zone';
        zone.style.cssText = `
            position: fixed;
            left: ${left}px;
            top: ${top}px;
            width: ${width}px;
            height: ${height}px;
            background: rgba(255, 77, 109, 0.2);
            border: 2px dashed var(--accent);
            pointer-events: none;
            z-index: 9998;
            animation: snapZonePulse 0.5s ease-in-out infinite alternate;
        `;
        return zone;
    },
    
    hideSnapZones() {
        document.querySelectorAll('.snap-zone').forEach(zone => zone.remove());
    },
    
    handleWindowSnap(win, mouseX, mouseY) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const snapThreshold = 50;
        const winData = this.windows.get(win.id);
        
        // Left snap
        if (mouseX < snapThreshold) {
            win.style.left = '0';
            win.style.top = '0';
            win.style.width = '50%';
            win.style.height = `calc(100% - 40px)`;
            winData.isMaximized = false;
        }
        // Right snap
        else if (mouseX > screenWidth - snapThreshold) {
            win.style.left = '50%';
            win.style.top = '0';
            win.style.width = '50%';
            win.style.height = `calc(100% - 40px)`;
            winData.isMaximized = false;
        }
        // Top snap (maximize)
        else if (mouseY < snapThreshold) {
            this.toggleMaximize(win.id);
        }
    },
    
    // ==================== DESKTOP ICONS ====================
    
    setupDesktopIcons() {
        const icons = document.querySelectorAll('.desktop-icon');
        
        icons.forEach((icon, index) => {
            // Enhanced hover effects
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.1) translateY(-5px)';
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1) translateY(0)';
            });
            
            // Right-click context menu
            icon.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showIconContextMenu(icon, e.clientX, e.clientY);
            });
            
            // Animate icons on load
            setTimeout(() => {
                icon.style.animation = 'iconBounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            }, index * 100);
        });
        
        this.updateIconSize();
    },
    
    updateIconSize() {
        const icons = document.querySelectorAll('.desktop-icon');
        
        icons.forEach(icon => {
            icon.classList.remove('icon-small', 'icon-medium', 'icon-large');
            icon.classList.add(`icon-${this.iconSize}`);
        });
    },
    
    autoArrangeIcons() {
        const iconGrid = document.getElementById('icon-grid');
        if (!iconGrid) return;
        
        // Reset icon positions to grid
        iconGrid.style.display = 'flex';
        iconGrid.style.flexDirection = 'column';
        iconGrid.style.flexWrap = 'wrap';
        iconGrid.style.gap = '20px';
        
        SYSTEM.playAudio('click-sound');
        
        // Animate rearrangement
        const icons = iconGrid.querySelectorAll('.desktop-icon');
        icons.forEach((icon, i) => {
            icon.style.animation = 'none';
            setTimeout(() => {
                icon.style.animation = 'iconSlideIn 0.4s ease-out';
            }, i * 50);
        });
    },
    
    // ==================== CONTEXT MENUS ====================
    
    setupDesktopContextMenu() {
        const desktop = document.getElementById('desktop-screen');
        if (!desktop) return;
        
        desktop.addEventListener('contextmenu', (e) => {
            // Don't show if clicking on icon or window
            if (e.target.closest('.desktop-icon') || e.target.closest('.app-window')) {
                return;
            }
            
            e.preventDefault();
            this.showDesktopContextMenu(e.clientX, e.clientY);
        });
        
        // Close menu on click elsewhere
        document.addEventListener('click', () => {
            this.closeContextMenu();
        });
    },
    
    showDesktopContextMenu(x, y) {
        this.closeContextMenu();
        
        const menu = document.createElement('div');
        menu.id = 'desktop-context-menu';
        menu.className = 'context-menu';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        
        menu.innerHTML = `
            <div class="context-item" onclick="DESKTOP_MANAGER.refresh()">
                <span>🔄 Refresh</span>
            </div>
            <div class="context-item" onclick="DESKTOP_MANAGER.autoArrangeIcons()">
                <span>📐 Auto Arrange Icons</span>
            </div>
            <div class="context-divider"></div>
            <div class="context-item" onclick="DESKTOP_MANAGER.createStickyNote()">
                <span>📝 New Sticky Note</span>
            </div>
            <div class="context-divider"></div>
            <div class="context-item submenu">
                <span>🎨 Personalize ▶</span>
                <div class="context-submenu">
                    <div class="context-item" onclick="DESKTOP_MANAGER.changeWallpaper()">
                        <span>Change Wallpaper</span>
                    </div>
                    <div class="context-item submenu">
                        <span>Icon Size ▶</span>
                        <div class="context-submenu">
                            <div class="context-item" onclick="DESKTOP_MANAGER.setIconSize('small')">
                                <span>${this.iconSize === 'small' ? '✓ ' : ''}Small</span>
                            </div>
                            <div class="context-item" onclick="DESKTOP_MANAGER.setIconSize('medium')">
                                <span>${this.iconSize === 'medium' ? '✓ ' : ''}Medium</span>
                            </div>
                            <div class="context-item" onclick="DESKTOP_MANAGER.setIconSize('large')">
                                <span>${this.iconSize === 'large' ? '✓ ' : ''}Large</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Position adjustment if near edge
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            menu.style.left = (window.innerWidth - rect.width - 5) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            menu.style.top = (window.innerHeight - rect.height - 5) + 'px';
        }
    },
    
    showWindowContextMenu(winId, x, y) {
        this.closeContextMenu();
        
        const winData = this.windows.get(winId);
        if (!winData) return;
        
        const menu = document.createElement('div');
        menu.id = 'window-context-menu';
        menu.className = 'context-menu';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        
        menu.innerHTML = `
            <div class="context-item" onclick="DESKTOP_MANAGER.restoreWindow('${winId}')">
                <span>↕️ Restore</span>
            </div>
            <div class="context-item" onclick="DESKTOP_MANAGER.minimizeWindow('${winId}')">
                <span>_ Minimize</span>
            </div>
            <div class="context-item" onclick="DESKTOP_MANAGER.toggleMaximize('${winId}')">
                <span>□ ${winData.isMaximized ? 'Restore' : 'Maximize'}</span>
            </div>
            <div class="context-divider"></div>
            <div class="context-item" onclick="DESKTOP_MANAGER.closeWindow('${winId}')">
                <span>✕ Close</span>
            </div>
        `;
        
        document.body.appendChild(menu);
    },
    
    showIconContextMenu(icon, x, y) {
        this.closeContextMenu();
        
        const menu = document.createElement('div');
        menu.id = 'icon-context-menu';
        menu.className = 'context-menu';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        
        const iconName = icon.querySelector('div').textContent;
        
        menu.innerHTML = `
            <div class="context-item" onclick="this.closest('.desktop-icon').click(); DESKTOP_MANAGER.closeContextMenu()">
                <span>▶️ Open</span>
            </div>
            <div class="context-divider"></div>
            <div class="context-item">
                <span>📌 ${iconName}</span>
            </div>
        `;
        
        document.body.appendChild(menu);
    },
    
    closeContextMenu() {
        document.querySelectorAll('.context-menu').forEach(menu => menu.remove());
    },
    
    // ==================== KEYBOARD SHORTCUTS ====================
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + Tab (window switcher would go here)
            if (e.altKey && e.key === 'Tab') {
                e.preventDefault();
                // TODO: Implement window switcher
            }
            
            // Ctrl + W (close active window)
            if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
                if (this.activeWindow) {
                    e.preventDefault();
                    this.closeWindow(this.activeWindow);
                }
            }
            
            // F11 (toggle maximize on active window)
            if (e.key === 'F11') {
                if (this.activeWindow) {
                    e.preventDefault();
                    this.toggleMaximize(this.activeWindow);
                }
            }
        });
    },
    
    // ==================== TASKBAR ====================
    
    setupTaskbar() {
        this.updateTaskbar();
    },
    
    updateTaskbar() {
        // Create minimized windows section in taskbar
        let taskbarWindows = document.getElementById('taskbar-windows');
        
        if (!taskbarWindows) {
            taskbarWindows = document.createElement('div');
            taskbarWindows.id = 'taskbar-windows';
            taskbarWindows.style.cssText = `
                display: flex;
                gap: 5px;
                flex: 1;
                padding: 0 10px;
                overflow-x: auto;
            `;
            
            const taskbar = document.getElementById('taskbar');
            const startBtn = taskbar.querySelector('.start-btn');
            taskbar.insertBefore(taskbarWindows, startBtn.nextSibling);
        }
        
        taskbarWindows.innerHTML = '';
        
        // Add buttons for all open windows
        this.windows.forEach((winData, id) => {
            if (!winData.element.classList.contains('hidden') || winData.isMinimized) {
                const title = winData.element.querySelector('.window-bar span')?.textContent || 'Window';
                
                const btn = document.createElement('button');
                btn.className = 'taskbar-window-btn';
                btn.textContent = title;
                btn.title = title;
                
                if (winData.isMinimized) {
                    btn.classList.add('minimized');
                }
                if (this.activeWindow === id) {
                    btn.classList.add('active');
                }
                
                btn.onclick = () => {
                    if (winData.isMinimized) {
                        this.restoreWindow(id);
                    } else if (this.activeWindow === id) {
                        this.minimizeWindow(id);
                    } else {
                        this.focusWindow(id);
                    }
                };
                
                taskbarWindows.appendChild(btn);
            }
        });
    },
    
    // ==================== UTILITY FUNCTIONS ====================
    
    refresh() {
        this.closeContextMenu();
        location.reload();
    },
    
    createStickyNote() {
        this.closeContextMenu();
        if (typeof DESKTOP_ENHANCEMENTS !== 'undefined' && DESKTOP_ENHANCEMENTS.createStickyNote) {
            DESKTOP_ENHANCEMENTS.createStickyNote();
        } else {
            alert('Sticky notes feature coming soon!');
        }
    },
    
    changeWallpaper() {
        this.closeContextMenu();
        alert('Wallpaper selector coming soon!');
    },
    
    setIconSize(size) {
        this.iconSize = size;
        this.updateIconSize();
        this.closeContextMenu();
        localStorage.setItem('heartosIconSize', size);
        SYSTEM.playAudio('click-sound');
    },
    
    tileWindows() {
        // Arrange all windows in a grid
        const openWindows = Array.from(this.windows.entries())
            .filter(([id, data]) => !data.element.classList.contains('hidden') && !data.isMinimized);
        
        if (openWindows.length === 0) return;
        
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight - 40; // Account for taskbar
        
        const cols = Math.ceil(Math.sqrt(openWindows.length));
        const rows = Math.ceil(openWindows.length / cols);
        
        const winWidth = screenWidth / cols;
        const winHeight = screenHeight / rows;
        
        openWindows.forEach(([id, data], index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            
            data.element.style.left = (col * winWidth) + 'px';
            data.element.style.top = (row * winHeight) + 'px';
            data.element.style.width = winWidth + 'px';
            data.element.style.height = winHeight + 'px';
            data.isMaximized = false;
        });
    },
    
    // ==================== STYLES ====================
    
    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Window animations */
            .app-window {
                transition: opacity 0.3s, transform 0.3s;
            }
            
            .app-window.dragging {
                opacity: 0.9;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 30px var(--accent);
                transition: none;
            }
            
            .app-window.minimizing {
                animation: minimizeWindow 0.3s ease-out forwards;
            }
            
            .app-window.restoring {
                animation: restoreWindow 0.3s ease-out forwards;
            }
            
            .app-window.closing {
                animation: closeWindow 0.3s ease-out forwards;
            }
            
            .app-window.maximized {
                border-radius: 0 !important;
            }
            
            .app-window.active-window {
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 20px var(--accent);
            }
            
            @keyframes minimizeWindow {
                0% {
                    opacity: 1;
                    transform: scale(1);
                }
                100% {
                    opacity: 0;
                    transform: scale(0.1) translateY(500px);
                }
            }
            
            @keyframes restoreWindow {
                0% {
                    opacity: 0;
                    transform: scale(0.1) translateY(500px);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            @keyframes closeWindow {
                0% {
                    opacity: 1;
                    transform: scale(1) rotate(0deg);
                }
                100% {
                    opacity: 0;
                    transform: scale(0.8) rotate(5deg);
                }
            }
            
            @keyframes snapZonePulse {
                0% { opacity: 0.2; }
                100% { opacity: 0.4; }
            }
            
            /* Context menu */
            .context-menu {
                position: fixed;
                background: var(--win-bg);
                border: 2px solid var(--accent);
                box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
                padding: 5px 0;
                min-width: 200px;
                z-index: 10000;
                font-size: 1.2rem;
                animation: contextMenuAppear 0.15s ease-out;
            }
            
            @keyframes contextMenuAppear {
                0% {
                    opacity: 0;
                    transform: scale(0.9) translateY(-10px);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            .context-item {
                padding: 8px 15px;
                cursor: pointer;
                transition: background 0.1s;
                position: relative;
            }
            
            .context-item:hover {
                background: var(--accent);
                color: white;
            }
            
            .context-item.submenu:hover > .context-submenu {
                display: block;
            }
            
            .context-divider {
                height: 1px;
                background: var(--accent);
                margin: 5px 0;
                opacity: 0.3;
            }
            
            .context-submenu {
                display: none;
                position: absolute;
                left: 100%;
                top: 0;
                background: var(--win-bg);
                border: 2px solid var(--accent);
                box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
                padding: 5px 0;
                min-width: 180px;
            }
            
            /* Taskbar windows */
            .taskbar-window-btn {
                background: linear-gradient(180deg, #fff 0%, #c0c0c0 100%);
                border-top: 2px solid #fff;
                border-left: 2px solid #fff;
                border-right: 2px solid #404040;
                border-bottom: 2px solid #404040;
                padding: 4px 12px;
                font-family: 'VT323', monospace;
                font-size: 1.2rem;
                cursor: pointer;
                max-width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                transition: all 0.1s;
            }
            
            .taskbar-window-btn:hover {
                background: linear-gradient(180deg, #fff 0%, #ddd 100%);
            }
            
            .taskbar-window-btn.active {
                background: var(--accent);
                color: white;
                border-top: 2px solid #404040;
                border-left: 2px solid #404040;
                border-right: 2px solid #fff;
                border-bottom: 2px solid #fff;
            }
            
            .taskbar-window-btn.minimized {
                opacity: 0.7;
            }
            
            /* Icon animations */
            @keyframes iconBounceIn {
                0% {
                    opacity: 0;
                    transform: scale(0) translateY(-100px);
                }
                50% {
                    transform: scale(1.2) translateY(10px);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            @keyframes iconSlideIn {
                0% {
                    opacity: 0;
                    transform: translateX(-50px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            /* Icon sizes */
            .desktop-icon {
                transition: transform 0.2s ease-out;
            }
            
            .desktop-icon.icon-small .icon-img {
                font-size: 2rem;
            }
            
            .desktop-icon.icon-medium .icon-img {
                font-size: 3rem;
            }
            
            .desktop-icon.icon-large .icon-img {
                font-size: 4rem;
            }
            
            .desktop-icon.icon-small {
                width: 60px;
            }
            
            .desktop-icon.icon-large {
                width: 110px;
            }
        `;
        document.head.appendChild(style);
    }
};

// Initialize when desktop is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const checkDesktop = setInterval(() => {
            const desktop = document.getElementById('desktop-screen');
            if (desktop && !desktop.classList.contains('hidden')) {
                DESKTOP_MANAGER.init();
                clearInterval(checkDesktop);
            }
        }, 100);
    });
} else {
    setTimeout(() => {
        const desktop = document.getElementById('desktop-screen');
        if (desktop && !desktop.classList.contains('hidden')) {
            DESKTOP_MANAGER.init();
        }
    }, 1000);
}
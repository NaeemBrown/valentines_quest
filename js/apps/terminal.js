/* SECRET ACCESS TERMINAL — INTERACTIVE MINI-GAME (BILINGUAL i18n) */

// Global gate for Secrets app (unlocked only after reveal completes)
window.HEARTOS_FLAGS = window.HEARTOS_FLAGS || { secretsUnlocked: false };

const TERMINAL = {
    commandHistory: [],
    historyIndex: -1,
    gameProgress: 0,
    inputLocked: false,

    steps: ['scan','analyze','decrypt','bypass','trace','access','unlock','reveal'],

    /* ─────────────────────────────────────────────────────────────
       i18n
    ───────────────────────────────────────────────────────────── */
    i18nInit: function() {
        // Read language from same key you used elsewhere
        const LANG = localStorage.getItem('heartosLang') || 'en';
        window.__lang = LANG;

        // Minimal, practical translations. You can tweak tone later.
        window.__translations = window.__translations || {};
        window.__translations.terminal = {
            en: {
                // generic / commands
                next_hint: "[→] Type {cmd} to continue.",
                error_wrong: "[ERROR] Wrong command or sequence.",
                hint_next: "[HINT]  Next: {cmd}",
                mission_complete: "Mission complete. Type {cmd} to replay.",
                cmd_index_title: "COMMAND INDEX",
                help_desc: "this menu",
                status_desc: "progress bar",
                clear_desc: "wipe screen",
                done: "done",

                // status
                progress: "Progress",
                layers: "Layers",
                complete: "COMPLETE",
                next: "next",

                // welcome screen
                welcome_conn: "[✓] Connection established",
                welcome_shell: "[✓] Remote shell active",
                welcome_alert: "[!] ENCRYPTED FILE DETECTED — 8 security layers active",
                welcome_story_1: "There is a secret file buried deep in this system.",
                welcome_story_2: "8 security layers stand between you and it.",
                welcome_story_3: "Each one is different. Break them all.",
                welcome_begin: "Type {cmd} to begin.",

                // scan
                scan_title: "[SCAN] Deploying deep scan — initialising matrix sweep...",
                scan_scanning: "Scanning: {n} files...",
                scan_found_canvas: "⚠  ANOMALOUS FILE DETECTED  ⚠",
                scan_found_loc: "Location   : {path}  (path obfuscated)",
                scan_found_mod: "Modified   : {date}",
                scan_found_enc: "Encryption : {enc}",
                scan_found_perm: "Permissions: ---------- (none)",
                scan_complete: "[1/8 COMPLETE]  Filesystem swept. 1 encrypted file found.",

                // analyze
                analyze_title: "[ANALYZE] Pattern recognition engine loaded. Examining file header...",
                analyze_prompt: "[!] Signature match found. Identify the algorithm to proceed:",
                analyze_right: "✓ Correct — AES-256-CBC identified.",
                analyze_details: "Key length: 256-bit | IV: 0x4e61656d4b68616e | Key: recoverable from memory",
                analyze_complete: "[2/8 COMPLETE]  Encryption mapped.",
                analyze_wrong: "[✗] Incorrect — that signature does not match. Try again.",

                // decrypt
                decrypt_title: "[DECRYPT] AES-256-CBC engine ready. 4 encrypted blocks detected.",
                decrypt_click: "Click each block to decrypt it.",
                decrypt_all: "✓ All blocks decrypted — photo5.jpg (2.4 MB)",
                decrypt_fw: "[!] Firewall blocking access on port 443.",
                decrypt_complete: "[3/8 COMPLETE]  File decrypted.",

                // bypass (keep fictional)
                bypass_title: "[BYPASS] Enterprise firewall detected — intrusion mini-game mode loaded.",
                bypass_hint: "Kill all 5 firewall rules to gain access.",
                bypass_done: "✓ All 5 rules neutralised — root access granted",
                bypass_complete: "[4/8 COMPLETE]  Firewall disabled.",

                // trace
                trace_title: "[TRACE] Inode sector map loaded — 100 sectors to search.",
                trace_hint: "The encrypted file lives in one sector. Find it.",
                trace_subhint: "Hint: inode numbers don't lie. Think about dates.",
                trace_found: "✓ Sector 0715 located",
                trace_path: "Path: {path}",
                trace_inode: "Inode: 0715 — vault lock active",
                trace_complete: "[5/8 COMPLETE]  File location confirmed.",

                // access
                access_title: "[ACCESS] Vault biometric system active — 4-signal authentication required.",
                access_hint: "Watch the sequence. Then repeat it.",
                access_memorise: "Memorise the sequence...",
                access_watch: "Watch...",
                access_your_turn: "Your turn — repeat the sequence.",
                access_wrong: "[✗] Wrong sequence — resetting...",
                access_ok: "[✓] Sequence accepted — biometrics cleared!",
                access_ok2: "✓ All biometric signals verified",
                access_ok3: "Vault door open — 1 file inside, PIN lock active",
                access_complete: "[6/8 COMPLETE]  Biometrics passed.",

                // unlock
                unlock_title: "[UNLOCK] Final barrier — 4-digit PIN lock on photo5.jpg.",
                unlock_note: "Brute-forcer timed out. Manual entry required.",
                unlock_hint: "Hint: the inode number wasn't random.",
                unlock_ok: "✓ PIN accepted — 0715.",
                unlock_joke: "Of course it was that date.",
                unlock_complete: "[7/8 COMPLETE]  Lock disengaged.",

                // reveal
                reveal_title: "[REVEAL] Opening {path}...",
                decode: "[DECODE]",
                stage_read: "Reading sectors",
                stage_decomp: "Decompressing",
                stage_color: "Colour correction",
                stage_render: "Rendering display",
                granted_title: "🎉   A C C E S S   G R A N T E D   🎉",
                granted_line1: "8 layers. You broke through every single one of them.",
                granted_line2: "This is what was locked away, waiting for you.",
                replay: "Type {cmd} to play again."
            },

            cs: {
                next_hint: "[→] Napiš {cmd} pro pokračování.",
                error_wrong: "[ERROR] Špatný příkaz nebo pořadí.",
                hint_next: "[HINT]  Další: {cmd}",
                mission_complete: "Mise splněna. Pro opakování napiš {cmd}.",
                cmd_index_title: "SEZNAM PŘÍKAZŮ",
                help_desc: "tahle nápověda",
                status_desc: "stav/progress",
                clear_desc: "vyčistit obrazovku",
                done: "hotovo",

                progress: "Postup",
                layers: "Vrstvy",
                complete: "HOTOVO",
                next: "další",

                welcome_conn: "[✓] Spojení navázáno",
                welcome_shell: "[✓] Vzdálený shell aktivní",
                welcome_alert: "[!] NALEZEN ŠIFROVANÝ SOUBOR — aktivních 8 vrstev zabezpečení",
                welcome_story_1: "V systému je schovaný tajný soubor.",
                welcome_story_2: "Od něj tě dělí 8 bezpečnostních vrstev.",
                welcome_story_3: "Každá je jiná. Prolom je všechny.",
                welcome_begin: "Pro start napiš {cmd}.",

                scan_title: "[SCAN] Spouštím hluboký sken — inicializace matrix sweep...",
                scan_scanning: "Skenuju: {n} souborů...",
                scan_found_canvas: "⚠  NALEZEN PODEZŘELÝ SOUBOR  ⚠",
                scan_found_loc: "Lokace     : {path}  (cesta skrytá)",
                scan_found_mod: "Upraveno   : {date}",
                scan_found_enc: "Šifrování  : {enc}",
                scan_found_perm: "Práva      : ---------- (žádná)",
                scan_complete: "[1/8 HOTOVO]  Disk prohledán. Nalezen 1 šifrovaný soubor.",

                analyze_title: "[ANALYZE] Načten rozpoznávací modul. Kontroluju hlavičku souboru...",
                analyze_prompt: "[!] Shoda signatury. Urči algoritmus pro pokračování:",
                analyze_right: "✓ Správně — identifikováno AES-256-CBC.",
                analyze_details: "Délka klíče: 256-bit | IV: 0x4e61656d4b68616e | Klíč: dohledatelný v paměti",
                analyze_complete: "[2/8 HOTOVO]  Šifrování zmapováno.",
                analyze_wrong: "[✗] Špatně — tohle nesedí na signaturu. Zkus znovu.",

                decrypt_title: "[DECRYPT] AES-256-CBC modul připraven. Nalezeny 4 šifrované bloky.",
                decrypt_click: "Klikni na každý blok a dešifruj ho.",
                decrypt_all: "✓ Všechny bloky dešifrovány — photo5.jpg (2.4 MB)",
                decrypt_fw: "[!] Firewall blokuje přístup na portu 443.",
                decrypt_complete: "[3/8 HOTOVO]  Soubor dešifrován.",

                bypass_title: "[BYPASS] Detekován enterprise firewall — režim mini-hry aktivní.",
                bypass_hint: "Vypni všech 5 firewall pravidel, ať získáš přístup.",
                bypass_done: "✓ Všech 5 pravidel vypnuto — root přístup povolen",
                bypass_complete: "[4/8 HOTOVO]  Firewall vypnut.",

                trace_title: "[TRACE] Načtena mapa inode sektorů — prohledává se 100 sektorů.",
                trace_hint: "Soubor je v jednom sektoru. Najdi ho.",
                trace_subhint: "Hint: inode čísla nelžou. Přemýšlej nad daty.",
                trace_found: "✓ Sektor 0715 nalezen",
                trace_path: "Cesta: {path}",
                trace_inode: "Inode: 0715 — zámek trezoru aktivní",
                trace_complete: "[5/8 HOTOVO]  Lokace souboru potvrzena.",

                access_title: "[ACCESS] Biometrika trezoru aktivní — vyžaduje 4 signály.",
                access_hint: "Sleduj sekvenci. Pak ji zopakuj.",
                access_memorise: "Zapamatuj si sekvenci...",
                access_watch: "Dívej se...",
                access_your_turn: "Teď ty — zopakuj sekvenci.",
                access_wrong: "[✗] Špatná sekvence — resetuju...",
                access_ok: "[✓] Sekvence přijata — biometrika prošla!",
                access_ok2: "✓ Všechny biometrické signály ověřeny",
                access_ok3: "Trezor otevřen — uvnitř 1 soubor, aktivní PIN zámek",
                access_complete: "[6/8 HOTOVO]  Biometrika prošla.",

                unlock_title: "[UNLOCK] Poslední bariéra — 4místný PIN pro photo5.jpg.",
                unlock_note: "Brute-force vypršel. Zadej PIN ručně.",
                unlock_hint: "Hint: inode číslo nebyla náhoda.",
                unlock_ok: "✓ PIN přijat — 0715.",
                unlock_joke: "Jasně… samozřejmě zrovna tohle datum.",
                unlock_complete: "[7/8 HOTOVO]  Zámek odemčen.",

                reveal_title: "[REVEAL] Otevírám {path}...",
                decode: "[DECODE]",
                stage_read: "Načítání sektorů",
                stage_decomp: "Dekomprese",
                stage_color: "Korekce barev",
                stage_render: "Renderuju obraz",
                granted_title: "🎉   P Ř Í S T U P   P O V O L E N   🎉",
                granted_line1: "8 vrstev. Prošel/a jsi každou z nich.",
                granted_line2: "Tohle bylo zamčené… a čekalo to na tebe.",
                replay: "Pro opakování napiš {cmd}."
            }
        };

        window.__t = function(key, vars) {
            const pack = window.__translations && window.__translations.terminal;
            const lang = (pack && pack[window.__lang]) ? window.__lang : 'en';
            let s = (pack && pack[lang] && pack[lang][key]) || (pack && pack.en && pack.en[key]) || key;
            if (vars) {
                Object.keys(vars).forEach(k => {
                    s = s.replaceAll(`{${k}}`, String(vars[k]));
                });
            }
            return s;
        };

        // Optional: live update when HeartOS toggles language
        window.addEventListener('storage', (e) => {
            if (e.key === 'heartosLang') location.reload();
        });
    },

    /* ══════════════════════════════════════════════════════════════════
       INIT
    ══════════════════════════════════════════════════════════════════ */
    init: function() {
        this.i18nInit();

        const wrapper = document.getElementById('quiz-wrapper');
        if (!wrapper) return;
        this.injectStyles();
        wrapper.innerHTML = `
            <div id="terminal-container">
                <div id="terminal-output"></div>
                <div id="terminal-input-line">
                    <span class="terminal-prompt">root@secret:~$&nbsp;</span>
                    <input type="text" id="terminal-input" autocomplete="off" spellcheck="false">
                </div>
            </div>`;
        this.setupInput();
        this.displayWelcome();
    },

    /* ══════════════════════════════════════════════════════════════════
       STYLES — unchanged
    ══════════════════════════════════════════════════════════════════ */
    injectStyles: function() {
        const s = document.createElement('style');
        s.textContent = `/* your existing CSS exactly as-is */\n` + `
        /* ── shared ── */
        .t-box { border:1px solid #0f0; padding:14px 18px; margin:10px 0; display:inline-block; font-family:monospace; }
        .t-row { display:flex; gap:8px; margin:6px 0; flex-wrap:wrap; }
        .hack-btn {
            border:1px solid #0f0; color:#0f0; padding:8px 18px; cursor:pointer;
            font-family:monospace; font-size:.95rem; background:#000; letter-spacing:1px;
            transition:all .15s;
        }
        .hack-btn:hover  { background:#0f0; color:#000; }
        .hack-btn:active { transform:scale(.95); }
        .hack-btn:disabled { border-color:#333; color:#333; cursor:default; background:#000; }
        /* ── step 1 — matrix rain ── */
        #matrix-canvas { display:block; margin:10px 0; }
        @keyframes scanPulse {
            0%,100%{ box-shadow:none; }
            50%{ box-shadow:0 0 30px rgba(255,0,0,0.6); background:rgba(255,0,0,.08); }
        }
        .scan-alert { border:1px solid #f00; color:#f00; padding:10px 16px; margin:8px 0;
            animation:scanPulse .5s ease 4; font-family:monospace; }
        /* ── step 2 — multiple choice ── */
        .choice-btn {
            border:1px solid #0ff; color:#0ff; padding:10px 20px; cursor:pointer;
            font-family:monospace; font-size:.9rem; background:#000; margin:4px;
            transition:all .2s; display:block; width:100%; text-align:left;
        }
        .choice-btn:hover { background:rgba(0,255,255,.1); }
        .choice-btn.wrong  { border-color:#f00; color:#f00; background:rgba(255,0,0,.1); animation:shake .4s ease; }
        .choice-btn.right  { border-color:#0f0; color:#0f0; background:rgba(0,255,0,.1); }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        /* ── step 3 — decrypt blocks ── */
        .enc-block {
            border:1px solid #f00; padding:10px 16px; margin:5px 0; cursor:pointer;
            font-family:monospace; color:#f00; font-size:.85rem; transition:all .2s;
            position:relative; overflow:hidden;
        }
        .enc-block:hover { background:rgba(255,0,0,.07); }
        .enc-block.cracked { border-color:#0f0; color:#0f0; cursor:default; }
        .enc-block.cracked:hover { background:transparent; }
        @keyframes decryptSweep {
            0%   { transform:translateX(-100%); }
            100% { transform:translateX(100%); }
        }
        .enc-block::after {
            content:''; position:absolute; top:0; left:0; width:30%; height:100%;
            background:linear-gradient(90deg,transparent,rgba(0,255,0,.3),transparent);
            transform:translateX(-100%);
        }
        .enc-block.cracking::after { animation:decryptSweep .5s ease forwards; }
        /* ── step 4 — toggles ── */
        .fw-rule {
            display:flex; align-items:center; gap:14px; margin:7px 0; font-family:monospace; font-size:.9rem;
        }
        .toggle-track {
            width:44px; height:22px; border-radius:11px; border:1px solid #f00;
            position:relative; cursor:pointer; flex-shrink:0; background:rgba(255,0,0,.2);
            transition:all .3s;
        }
        .toggle-track.off { border-color:#333; background:#111; }
        .toggle-thumb {
            width:18px; height:18px; border-radius:50%; background:#f00;
            position:absolute; top:1px; right:2px; transition:all .3s;
        }
        .toggle-track.off .toggle-thumb { background:#333; right:auto; left:2px; }
        .fw-label { transition:all .3s; color:#f00; }
        .fw-label.off { color:#333; text-decoration:line-through; }
        @keyframes toggleKill { 50%{ opacity:.3; } }
        .fw-rule.killing { animation:toggleKill .3s ease; }
        /* ── step 5 — sector grid ── */
        .sec-grid { display:grid; grid-template-columns:repeat(10,1fr); gap:3px; margin:10px 0; max-width:380px; }
        .sec-cell {
            border:1px solid #111; text-align:center; font-family:monospace; font-size:.65rem;
            padding:4px 0; color:#222; cursor:pointer; transition:all .2s; user-select:none;
        }
        .sec-cell:hover  { border-color:#0ff; color:#0ff; background:rgba(0,255,255,.06); }
        .sec-cell.scanned { color:#0a0; border-color:#0a0; cursor:default; }
        .sec-cell.wrong   { color:#f00; border-color:#f00; background:rgba(255,0,0,.1); }
        @keyframes foundPulse { 0%,100%{background:#300;color:#f00;} 50%{background:#f00;color:#fff;} }
        .sec-cell.found   { animation:foundPulse .4s ease infinite; color:#f00; border-color:#f00; cursor:default; }
        /* ── step 6 — sequence game ── */
        .seq-btn {
            width:70px; height:70px; border-radius:8px; border:2px solid; cursor:pointer;
            font-family:monospace; font-size:.75rem; text-align:center; display:flex;
            align-items:center; justify-content:center; transition:all .15s; user-select:none;
        }
        .seq-btn.idle { opacity:.35; }
        @keyframes seqFlash { 0%,100%{opacity:.35} 50%{opacity:1; transform:scale(1.1);} }
        .seq-btn.showing { animation:seqFlash .5s ease; }
        .seq-btn.pressed { transform:scale(.92); opacity:1; }
        .seq-btn.success-flash { animation:seqFlash .3s ease 2; }
        @keyframes seqWrong { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-4deg)} 75%{transform:rotate(4deg)} }
        .seq-btn.wrong-flash { animation:seqWrong .3s ease 2; }
        #seq-status { font-family:monospace; margin:8px 0; min-height:1.4em; }
        /* ── step 7 — PIN pad ── */
        .pin-pad { display:inline-block; border:1px solid #0f0; padding:16px; margin:8px 0; }
        .pin-display {
            font-size:2rem; letter-spacing:14px; text-align:center; color:#0f0;
            border-bottom:1px solid #0f0; padding-bottom:8px; margin-bottom:12px;
            min-height:2.8rem; font-family:monospace;
        }
        .pin-row { display:flex; gap:6px; margin-bottom:6px; justify-content:center; }
        .pin-btn {
            width:46px; height:46px; background:#000; border:1px solid #0f0;
            color:#0f0; font-size:1.2rem; cursor:pointer; font-family:monospace; transition:all .1s;
        }
        .pin-btn:hover  { background:#0f0; color:#000; }
        .pin-btn:active { transform:scale(.92); }
        .pin-btn.del    { border-color:#f00; color:#f00; }
        .pin-btn.del:hover { background:#f00; color:#000; }
        @keyframes pinShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 60%{transform:translateX(8px)} }
        .pin-pad.shake { animation:pinShake .4s ease; }
        @keyframes pinWin { 0%,100%{border-color:#0f0} 50%{border-color:#fff;box-shadow:0 0 24px #0f0;background:#001a00;} }
        .pin-pad.win { animation:pinWin .5s ease 3; }
        /* ── step 8 — reveal ── */
        @keyframes barFill { from{width:0} to{width:100%} }
        .bar-track { width:200px; height:8px; background:#111; border:1px solid #333; display:inline-block; vertical-align:middle; }
        .bar-fill   { height:100%; background:#0f0; width:0; }
        @keyframes revealGlow { 0%,100%{box-shadow:0 0 10px rgba(0,255,0,.3)} 50%{box-shadow:0 0 50px rgba(0,255,0,.9),0 0 100px rgba(0,255,0,.4)} }
        .reveal-img { animation:revealGlow 2.5s ease-in-out infinite; border-radius:8px; border:2px solid #0f0; }
        @keyframes textFlicker { 0%,100%{opacity:1} 50%{opacity:.4} }
        .flicker { animation:textFlicker .3s ease 6; }
        `;
        document.head.appendChild(s);
    },

    /* ══════════════════════════════════════════════════════════════════
       INPUT
    ══════════════════════════════════════════════════════════════════ */
    setupInput: function() {
        const input = document.getElementById('terminal-input');
        if (!input) return;
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                if (cmd && !this.inputLocked) {
                    this.commandHistory.unshift(cmd);
                    this.historyIndex = -1;
                    this.processCommand(cmd);
                    input.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.historyIndex < this.commandHistory.length - 1)
                    input.value = this.commandHistory[++this.historyIndex];
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                input.value = this.historyIndex > 0 ? this.commandHistory[--this.historyIndex] : (this.historyIndex=-1,'');
            }
        });
        input.focus();
        document.addEventListener('click', () => { if (!this.inputLocked) input.focus(); });
    },

    /* ══════════════════════════════════════════════════════════════════
       HELPERS
    ══════════════════════════════════════════════════════════════════ */
    t: function(key, vars){ return window.__t ? window.__t(key, vars) : key; },

    print: function(html, cls='') {
        const out = document.getElementById('terminal-output');
        if (!out) return null;
        const d = document.createElement('div');
        d.className = 'terminal-line ' + cls;
        d.innerHTML = html.replace(/\n/g,'<br>');
        out.appendChild(d);
        out.scrollTop = out.scrollHeight;
        return d;
    },
    printEl: function(el) {
        const out = document.getElementById('terminal-output');
        if (!out) return;
        const d = document.createElement('div');
        d.className = 'terminal-line';
        d.appendChild(el);
        out.appendChild(d);
        out.scrollTop = out.scrollHeight;
        return d;
    },
    printCmd: function(cmd) { this.print(`<span class="terminal-prompt">root@secret:~$&nbsp;</span>${cmd}`,'command'); },
    lockInput:   function() { this.inputLocked=true;  const i=document.getElementById('terminal-input'); if(i)i.disabled=true; },
    unlockInput: function() { this.inputLocked=false; const i=document.getElementById('terminal-input'); if(i){i.disabled=false;i.focus();} },
    scroll: function() { const o=document.getElementById('terminal-output'); if(o)o.scrollTop=o.scrollHeight; },
    rand: (arr) => arr[Math.floor(Math.random()*arr.length)],

    advance: function(msg) {
        this.gameProgress++;
        const next = this.steps[this.gameProgress];
        if (msg) this.print(msg);
        if (next) this.print(`\n<span style="color:#ff0;">[→]</span> ${this.t('next_hint', {cmd: `<span style="color:#0f0;">${next}</span>`})}\n`);
        this.unlockInput();
    },

    /* ══════════════════════════════════════════════════════════════════
       COMMAND ROUTER
    ══════════════════════════════════════════════════════════════════ */
    processCommand: function(raw) {
        const cmd = raw.toLowerCase().trim();
        this.printCmd(raw);
        if (cmd==='help')   { this.showHelp();   return; }
        if (cmd==='status') { this.showStatus(); return; }
        if (cmd==='clear')  { document.getElementById('terminal-output').innerHTML=''; return; }
        if (this.gameProgress >= this.steps.length) {
            this.print(`<span style="color:#666;">${this.t('mission_complete', {cmd:'clear'})}</span>`);
            return;
        }
        const next = this.steps[this.gameProgress];
        if (cmd === next) { this.lockInput(); this[`step_${next}`](); }
        else {
            this.print(`<span style="color:#f00;">${this.t('error_wrong')}</span>`);
            this.print(`<span style="color:#ff0;">${this.t('hint_next', {cmd:`<span style="color:#0f0;">${next}</span>`})}</span>`);
        }
    },

    showHelp: function() {
        const done = i => this.gameProgress > this.steps.indexOf(i);
        const r = (cmd, desc) => done(cmd)
            ? `│  <span style="color:#333;">✓  ${cmd.padEnd(8)} — done</span>                                            │`
            : `│     <span style="color:#aaa;">${cmd.padEnd(8)}</span> — ${desc.padEnd(50)}│`;

        this.print(`
┌────────────────────────────────────────────────────────────────┐
│                        ${this.t('cmd_index_title').padEnd(28)}                         │
├────────────────────────────────────────────────────────────────┤
│  <span style="color:#0ff;">help</span>     — ${this.t('help_desc').padEnd(52)}│
│  <span style="color:#0ff;">status</span>   — ${this.t('status_desc').padEnd(52)}│
│  <span style="color:#0ff;">clear</span>    — ${this.t('clear_desc').padEnd(52)}│
├────────────────────────────────────────────────────────────────┤
${r('scan',   'detect encrypted files in the system  ')}
${r('analyze','identify the encryption algorithm     ')}
${r('decrypt','break open the encrypted data         ')}
${r('bypass', 'disable the firewall                  ')}
${r('trace',  'find the exact sector location        ')}
${r('access', 'pass biometric security               ')}
${r('unlock', 'crack the PIN                         ')}
${r('reveal', 'open the secret file                  ')}
└────────────────────────────────────────────────────────────────┘
${this.gameProgress < this.steps.length
    ? `<span style="color:#ff0;">[→]</span> ${this.t('hint_next', {cmd:`<span style="color:#0f0;">${this.steps[this.gameProgress]}</span>`})}`
    : `<span style="color:#0f0;">[✓] ALL LAYERS BREACHED</span>`}
`);
    },

    showStatus: function() {
        const pct = Math.floor((this.gameProgress/this.steps.length)*100);
        const f = Math.floor(pct/5);
        const bar = `<span style="color:#0f0;">${'█'.repeat(f)}</span><span style="color:#1a1a1a;">${'█'.repeat(20-f)}</span>`;
        this.print(`  ${this.t('progress')} : [${bar}]  ${pct}%\n  ${this.t('layers')}   : ${this.gameProgress} / ${this.steps.length}  ${
            this.gameProgress<this.steps.length
                ? `— ${this.t('next')}: <span style="color:#0f0;">${this.steps[this.gameProgress]}</span>`
                : `<span style="color:#0f0;">${this.t('complete')}</span>`
        }\n`);
    },

    /* ══════════════════════════════════════════════════════════════════
       WELCOME
    ══════════════════════════════════════════════════════════════════ */
    displayWelcome: function() {
        this.print(`
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   ██████╗  ██████╗ ██████╗     ██╗  ██╗ █████╗  ██████╗    │
│  ██╔════╝ ██╔═══██╗██╔══██╗    ██║  ██║██╔══██╗██╔════╝    │
│  ██║  ███╗██║   ██║██║  ██║    ███████║███████║██║         │
│  ██║   ██║██║   ██║██║  ██║    ██╔══██║██╔══██║██║         │
│  ╚██████╔╝╚██████╔╝██████╔╝    ██║  ██║██║  ██║╚██████╗    │
│   ╚═════╝  ╚═════╝ ╚═════╝     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    │
│                                                              │
│               [ SECRET ACCESS TERMINAL v2.8 ]               │
└──────────────────────────────────────────────────────────────┘

<span style="color:#0f0;">${this.t('welcome_conn')}</span>
<span style="color:#0f0;">${this.t('welcome_shell')}</span>
<span style="color:#f00;">${this.t('welcome_alert')}</span>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${this.t('welcome_story_1')}
${this.t('welcome_story_2')}
${this.t('welcome_story_3')}

${this.t('welcome_begin', {cmd:`<span style="color:#0f0;">help</span>`})}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,'welcome');
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 1 — SCAN
    ══════════════════════════════════════════════════════════════════ */
    step_scan: function() {
        this.print(`\n<span style="color:#0ff;">${this.t('scan_title')}</span>\n`);

        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas';
        canvas.width = 560; canvas.height = 160;
        canvas.style.cssText = 'display:block;margin:6px 0;border:1px solid #1a1a1a;';
        this.printEl(canvas);

        const ctx = canvas.getContext('2d');
        const cols = Math.floor(canvas.width / 14);
        const drops = Array(cols).fill(1);
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*!?/\\<>';
        let frame = 0, done = false;

        const draw = () => {
            ctx.fillStyle = 'rgba(0,0,0,0.06)';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            drops.forEach((y, i) => {
                const c = chars[Math.floor(Math.random()*chars.length)];
                const hue = frame < 80 ? '#0f0' : '#f00';
                ctx.fillStyle = i % 7 === 0 ? '#fff' : hue;
                ctx.font = '12px monospace';
                ctx.fillText(c, i*14, y*14);
                if (y*14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
            frame++;
            if (!done) requestAnimationFrame(draw);
        };
        draw();

        const counter = this.print(`<span style="color:#444;">${this.t('scan_scanning', {n: 0})}</span>`);
        let count = 0;
        const tick = setInterval(() => {
            count += Math.floor(Math.random()*180+60);
            if (count >= 3847) { count = 3847; clearInterval(tick); }
            counter.innerHTML = `<span style="color:#444;">${this.t('scan_scanning', {n: count.toLocaleString()})}</span>`;
            this.scroll();
        }, 80);

        setTimeout(() => {
            done = true;
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle='#000'; ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle='#f00'; ctx.font='bold 18px monospace';
            ctx.textAlign='center';
            ctx.fillText(this.t('scan_found_canvas'), canvas.width/2, canvas.height/2 - 10);
            ctx.fillStyle='#666'; ctx.font='12px monospace';
            ctx.fillText('/vault/???  —  AES-256  —  2024-07-15', canvas.width/2, canvas.height/2 + 16);

            const alert = document.createElement('div');
            alert.className = 'scan-alert';
            alert.innerHTML =
                `  <span style="color:#f00;font-weight:bold;">${this.t('scan_found_canvas')}</span><br>` +
                `  <span style="color:#666;">${this.t('scan_found_loc', {path:'/vault/???'})}</span><br>` +
                `  <span style="color:#666;">${this.t('scan_found_mod', {date:'2024-07-15 00:00:01'})}</span><br>` +
                `  <span style="color:#666;">${this.t('scan_found_enc', {enc:'AES-256 — military grade'})}</span><br>` +
                `  <span style="color:#666;">${this.t('scan_found_perm')}</span>`;
            this.printEl(alert);

            this.print(`\n<span style="color:#0f0;">${this.t('scan_complete')}</span>\n`);
            this.advance();
        }, 4000);
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 2 — ANALYZE
    ══════════════════════════════════════════════════════════════════ */
    step_analyze: function() {
        this.print(`\n<span style="color:#0ff;">${this.t('analyze_title')}</span>\n`);

        const hexLines = [];
        for (let i=0; i<4; i++) {
            let line = `  <span style="color:#333;">${(i*16).toString(16).padStart(4,'0')}:</span>  `;
            for (let j=0; j<16; j++) line += `<span style="color:#555;">${Math.floor(Math.random()*256).toString(16).padStart(2,'0')} </span>`;
            hexLines.push(line);
        }
        this.print(hexLines.join('\n'));

        setTimeout(() => {
            this.print(`\n  <span style="color:#ff0;">${this.t('analyze_prompt')}</span>\n`);

            const choices = [
                { label:'A.  RSA-4096  — asymmetric, public-key', correct:false },
                { label:'B.  AES-256-CBC — symmetric block cipher', correct:true  },
                { label:'C.  SHA-512  — hash function, one-way', correct:false },
                { label:'D.  RC4  — stream cipher, deprecated', correct:false  },
            ].sort(()=>Math.random()-.5);

            const box = document.createElement('div');
            box.style.cssText='margin:6px 0;';

            choices.forEach(ch => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn';
                btn.innerHTML = ch.label;
                btn.onclick = () => {
                    if (ch.correct) {
                        btn.classList.add('right');
                        box.querySelectorAll('.choice-btn').forEach(b => b.disabled=true);
                        setTimeout(() => {
                            this.print(`\n  <span style="color:#0f0;">${this.t('analyze_right')}</span>`);
                            this.print(`  <span style="color:#666;">${this.t('analyze_details')}\n</span>`);
                            this.print(`<span style="color:#0f0;">${this.t('analyze_complete')}</span>\n`);
                            this.advance();
                        }, 400);
                    } else {
                        btn.classList.add('wrong');
                        setTimeout(() => btn.classList.remove('wrong'), 500);
                        const err = document.createElement('div');
                        err.style.cssText='color:#f00;font-family:monospace;font-size:.85rem;margin:2px 0;';
                        err.textContent = `  ${this.t('analyze_wrong')}`;
                        box.insertBefore(err, btn.nextSibling);
                        setTimeout(()=>err.remove(), 1200);
                    }
                    this.scroll();
                };
                box.appendChild(btn);
            });

            this.printEl(box);
            this.scroll();
        }, 800);
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 3 — DECRYPT
    ══════════════════════════════════════════════════════════════════ */
    step_decrypt: function() {
        this.print(`\n<span style="color:#0ff;">${this.t('decrypt_title')}</span>\n`);
        this.print(`  <span style="color:#ff0;">${this.t('decrypt_click')}</span>\n`);

        const blocks = [
            { enc:'9F A2 3C 11 47 BB 02 EE  DC 88 01 F5 A9 3C 77 21  [JPEG HEADER — LOCKED]',   dec:'FF D8 FF E0 00 10 4A 46  49 46 00 01 01 00 00 01  JPEG header  ✓ ' },
            { enc:'4E 61 65 6D 4B 68 61 6E  20 24 07 15 AA BB CC DD  [EXIF DATA — LOCKED]',      dec:'Exif..MM 00 2A 00 00 08  Camera: iPhone | Date: 2024-07-15  ✓' },
            { enc:'C8 4F 19 D2 88 3A F1 07  55 E4 29 BC 11 6D 44 90  [IMAGE BODY — LOCKED]',     dec:'Image body: 2.1 MB of pixel data — rendered  ✓               ' },
            { enc:'70 68 6F 74 6F 35 2E 6A  70 67 00 00 00 00 00 00  [FILENAME — LOCKED]',       dec:'70 68 6F 74 6F 35 2E 6A  70 67  →  photo5.jpg  ✓           ' },
        ];

        let cracked = 0;
        const box = document.createElement('div');
        box.style.cssText='margin:6px 0;';

        blocks.forEach((b, i) => {
            const el = document.createElement('div');
            el.className = 'enc-block';
            el.innerHTML = `  <span style="color:#666;font-size:.75rem;">BLOCK 0${i+1}/04</span>  ${b.enc}`;
            el.onclick = () => {
                if (el.classList.contains('cracked')) return;
                el.classList.add('cracking');
                setTimeout(() => {
                    el.classList.remove('cracking');
                    el.classList.add('cracked');
                    el.innerHTML = `  <span style="color:#0a0;font-size:.75rem;">BLOCK 0${i+1}/04 ✓</span>  ${b.dec}`;
                    cracked++;
                    if (cracked === blocks.length) {
                        setTimeout(() => {
                            this.print(`\n  <span style="color:#0f0;">${this.t('decrypt_all')}</span>`);
                            this.print(`  <span style="color:#f00;">${this.t('decrypt_fw')}</span>\n`);
                            this.print(`<span style="color:#0f0;">${this.t('decrypt_complete')}</span>\n`);
                            this.advance();
                        }, 400);
                    }
                    this.scroll();
                }, 500);
            };
            box.appendChild(el);
        });

        this.printEl(box);
        this.scroll();
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 4 — BYPASS (fictional)
    ══════════════════════════════════════════════════════════════════ */
    step_bypass: function() {
        this.print(`\n<span style="color:#0ff;">${this.t('bypass_title')}</span>\n`);
        this.print(`  <span style="color:#ff0;">${this.t('bypass_hint')}</span>\n`);

        const rules = [
            'RULE 001  BLOCK  port 443  inbound',
            'RULE 002  DENY   /secure/* all-access',
            'RULE 003  FILTER AES-256   egress',
            'RULE 004  LOCK   admin     escalation',
            'RULE 005  BLOCK  root@*    shell-access',
        ];

        let killed = 0;
        const box = document.createElement('div');
        box.style.cssText = 'margin:8px 0;';

        rules.forEach(rule => {
            const row = document.createElement('div');
            row.className = 'fw-rule';

            const track = document.createElement('div');
            track.className = 'toggle-track';
            const thumb = document.createElement('div');
            thumb.className = 'toggle-thumb';
            track.appendChild(thumb);

            const label = document.createElement('span');
            label.className = 'fw-label';
            label.style.fontFamily = 'monospace';
            label.style.fontSize = '.9rem';
            label.textContent = rule;

            let isOff = false;
            track.onclick = () => {
                if (isOff) return;
                isOff = true;
                track.classList.add('off');
                label.classList.add('off');
                row.classList.add('killing');
                killed++;

                if (killed === rules.length) {
                    setTimeout(() => {
                        this.print(`\n  <span style="color:#0f0;">${this.t('bypass_done')}</span>\n`);
                        this.print(`<span style="color:#0f0;">${this.t('bypass_complete')}</span>\n`);
                        this.advance();
                    }, 500);
                }
                this.scroll();
            };

            row.appendChild(track);
            row.appendChild(label);
            box.appendChild(row);
        });

        this.printEl(box);
        this.scroll();
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 5 — TRACE
    ══════════════════════════════════════════════════════════════════ */
    step_trace: function() {
        this.print(`\n<span style="color:#0ff;">${this.t('trace_title')}</span>\n`);
        this.print(`  <span style="color:#ff0;">${this.t('trace_hint')}</span>`);
        this.print(`  <span style="color:#666;">${this.t('trace_subhint')}\n</span>`);

        const TARGET = '0715';
        const sectors = [];
        for (let i=0; i<100; i++) {
            if (i===47) { sectors.push(TARGET); continue; }
            let n;
            do { n=Math.floor(Math.random()*9000+1000).toString(); } while(n===TARGET);
            sectors.push(n);
        }

        const grid = document.createElement('div');
        grid.className = 'sec-grid';

        sectors.forEach((s) => {
            const cell = document.createElement('div');
            cell.className = 'sec-cell';
            cell.textContent = s;
            cell.onclick = () => {
                if (cell.classList.contains('scanned') || cell.classList.contains('found')) return;

                if (s === TARGET) {
                    cell.classList.add('found');
                    grid.querySelectorAll('.sec-cell:not(.found)').forEach(c => { c.classList.add('scanned'); c.onclick=null; });

                    setTimeout(() => {
                        const path = '/secure/vault/memories/photo5.jpg';
                        this.print(`\n  <span style="color:#0f0;">${this.t('trace_found')}</span>`);
                        this.print(`  <span style="color:#0ff;">${this.t('trace_path', {path})}</span>`);
                        this.print(`  <span style="color:#666;">${this.t('trace_inode')}\n</span>`);
                        this.print(`<span style="color:#0f0;">${this.t('trace_complete')}</span>\n`);
                        this.advance();
                    }, 600);
                } else {
                    cell.classList.add('wrong');
                    setTimeout(() => { cell.classList.remove('wrong'); }, 500);
                }
                this.scroll();
            };
            grid.appendChild(cell);
        });

        this.printEl(grid);
        this.scroll();
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 6 — ACCESS
    ══════════════════════════════════════════════════════════════════ */
    step_access: function() {
        this.print(`\n<span style="color:#0ff;">${this.t('access_title')}</span>\n`);
        this.print(`  <span style="color:#ff0;">${this.t('access_hint')}</span>\n`);

        const SIGNALS = [
            { id:'RETINA',  color:'#0ff', border:'#0ff' },
            { id:'VOICE',   color:'#0f0', border:'#0f0' },
            { id:'THERMAL', color:'#f90', border:'#f90' },
            { id:'NEURAL',  color:'#f0f', border:'#f0f' },
        ];

        const sequence = Array.from({length:4}, ()=>Math.floor(Math.random()*4));
        let playerSeq = [];
        let accepting = false;

        const statusEl = document.createElement('div');
        statusEl.id = 'seq-status';
        statusEl.style.cssText = 'font-family:monospace;margin:8px 0;min-height:1.4em;color:#666;';
        statusEl.textContent = this.t('access_memorise');

        const pad = document.createElement('div');
        pad.className='t-row'; pad.style.gap='12px';

        const btns = SIGNALS.map((sig, idx) => {
            const b = document.createElement('div');
            b.className='seq-btn idle';
            b.style.cssText=`border-color:${sig.border};color:${sig.color};`;
            b.innerHTML=`<div style="font-size:.65rem;text-align:center;">${sig.id}</div>`;

            b.onclick = () => {
                if (!accepting) return;

                b.classList.add('pressed');
                setTimeout(()=>b.classList.remove('pressed'),150);

                playerSeq.push(idx);
                const at = playerSeq.length - 1;

                if (playerSeq[at] !== sequence[at]) {
                    accepting = false;
                    btns.forEach(x=>x.classList.add('wrong-flash'));
                    statusEl.innerHTML = `<span style="color:#f00;">${this.t('access_wrong')}</span>`;
                    setTimeout(()=>{
                        btns.forEach(x=>x.classList.remove('wrong-flash'));
                        playerSeq=[];
                        showSequence();
                    },1200);
                } else if (playerSeq.length === sequence.length) {
                    accepting = false;
                    btns.forEach(x=>x.classList.add('success-flash'));
                    statusEl.innerHTML = `<span style="color:#0f0;">${this.t('access_ok')}</span>`;
                    setTimeout(()=>{
                        this.print(`\n  <span style="color:#0f0;">${this.t('access_ok2')}</span>`);
                        this.print(`  <span style="color:#666;">${this.t('access_ok3')}\n</span>`);
                        this.print(`<span style="color:#0f0;">${this.t('access_complete')}</span>\n`);
                        this.advance();
                    },900);
                }

                this.scroll();
            };

            pad.appendChild(b);
            return b;
        });

        this.printEl(statusEl);
        this.printEl(pad);

        const showSequence = () => {
            accepting = false;
            statusEl.textContent = this.t('access_watch');
            btns.forEach(b=>b.classList.add('idle'));

            let i=0;
            const flash = setInterval(()=>{
                if (i>0) btns[sequence[i-1]].classList.add('idle');

                if (i >= sequence.length) {
                    clearInterval(flash);
                    statusEl.innerHTML = `<span style="color:#ff0;">${this.t('access_your_turn')}</span>`;
                    btns.forEach(b=>b.classList.remove('idle'));
                    accepting=true;
                    return;
                }

                btns[sequence[i]].classList.remove('idle');
                btns[sequence[i]].classList.add('showing');
                setTimeout(()=>btns[sequence[i]] && btns[sequence[i]].classList.remove('showing'),400);
                i++;
            }, 700);
        };

        setTimeout(showSequence, 600);
        this.scroll();
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 7 — UNLOCK
    ══════════════════════════════════════════════════════════════════ */
    step_unlock: function() {
        this.print(`\n<span style="color:#0ff;">${this.t('unlock_title')}</span>\n`);
        this.print(`  <span style="color:#666;">${this.t('unlock_note')}</span>`);
        this.print(`  <span style="color:#666;">${this.t('unlock_hint')}\n</span>`);

        const SECRET = '0715';
        let entered = '';

        const pad = document.createElement('div');
        pad.className = 'pin-pad';

        const display = document.createElement('div');
        display.className = 'pin-display';
        display.textContent = '_ _ _ _';
        pad.appendChild(display);

        const update = () => {
            display.textContent = entered.split('').concat(Array(4-entered.length).fill('_')).join(' ');
        };

        [['1','2','3'],['4','5','6'],['7','8','9'],['','0','⌫']].forEach(row => {
            const rowEl = document.createElement('div');
            rowEl.className = 'pin-row';

            row.forEach(k => {
                const btn = document.createElement('button');
                btn.className = 'pin-btn' + (k==='⌫'?' del':'');
                btn.textContent = k;
                btn.style.visibility = k==='' ? 'hidden' : 'visible';

                btn.onclick = () => {
                    if (k==='⌫') { entered=entered.slice(0,-1); update(); return; }
                    if (entered.length>=4) return;

                    entered+=k; update();

                    if (entered.length===4) {
                        if (entered===SECRET) {
                            pad.classList.add('win');
                            display.textContent = '✓ ✓ ✓ ✓';
                            display.style.color='#0f0';
                            setTimeout(()=>{
                                pad.remove();
                                this.print(`  <span style="color:#0f0;">${this.t('unlock_ok')}</span>`);
                                this.print(`  <span style="color:#666;">${this.t('unlock_joke')}\n</span>`);
                                this.print(`<span style="color:#0f0;">${this.t('unlock_complete')}</span>\n`);
                                this.advance();
                            },900);
                        } else {
                            pad.classList.add('shake');
                            display.style.color='#f00';
                            display.textContent='✗ ✗ ✗ ✗';
                            setTimeout(()=>{
                                pad.classList.remove('shake');
                                entered=''; display.style.color='#0f0'; update();
                            },500);
                        }
                    }
                };

                rowEl.appendChild(btn);
            });

            pad.appendChild(rowEl);
        });

        this.printEl(pad);
        this.scroll();
    },

    /* ══════════════════════════════════════════════════════════════════
       STEP 8 — REVEAL
    ══════════════════════════════════════════════════════════════════ */
    step_reveal: function() {
        const path = '/secure/vault/memories/photo5.jpg';
        this.print(`\n<span style="color:#0ff;">${this.t('reveal_title', {path})}</span>\n`);

        const stages = [
            { key:'stage_read',  dur:700  },
            { key:'stage_decomp',dur:900  },
            { key:'stage_color', dur:600  },
            { key:'stage_render',dur:1100 },
        ];

        let delay = 0;
        stages.forEach(({key, dur}) => {
            setTimeout(() => {
                const row = document.createElement('div');
                row.style.cssText='font-family:monospace;color:#666;margin:3px 0;display:flex;align-items:center;gap:10px;';

                const track = document.createElement('div');
                track.className='bar-track';
                const fill = document.createElement('div');
                fill.className='bar-fill';
                fill.style.cssText=`animation:barFill ${dur}ms linear forwards;`;
                track.appendChild(fill);

                row.innerHTML=`  <span style="color:#0ff;">${this.t('decode')}</span> ${this.t(key).padEnd(16)} `;
                row.appendChild(track);

                const doneSpan = document.createElement('span');
                doneSpan.style.cssText='color:#0f0;font-size:.85rem;opacity:0;transition:opacity .3s;';
                doneSpan.textContent=this.t('done');
                row.appendChild(doneSpan);

                setTimeout(()=>doneSpan.style.opacity='1', dur);
                this.printEl(row);
                this.scroll();
            }, delay);

            delay += dur + 180;
        });

        const totalDelay = stages.reduce((a,b) => a+b.dur+180, 0);

        setTimeout(() => {
            this.print(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              ${this.t('granted_title').padEnd(44)}            ║
║                                                              ║
║     ${this.t('granted_line1').padEnd(56)}║
║     ${this.t('granted_line2').padEnd(56)}║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);

            const wrap = document.createElement('div');
            wrap.style.cssText='text-align:center;padding:24px 0;';

            const img = document.createElement('img');
            img.src='assets/images/photo5.jpg';
            img.className='reveal-img';
            img.style.cssText='max-width:460px;width:100%;display:block;margin:0 auto;';

            const caption = document.createElement('div');
            caption.className='flicker';
            caption.style.cssText='color:#0f0;margin-top:20px;font-size:1.4rem;letter-spacing:4px;font-family:monospace;';
            caption.innerHTML='💚 &nbsp; F O R &nbsp; A G I &nbsp; 💚';

            wrap.appendChild(img);
            wrap.appendChild(caption);
            this.printEl(wrap);

            this.print(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
            this.print(`<span style="color:#666;">${this.t('replay', {cmd:'clear'})}</span>`);

            // Unlock Secrets app ONLY after reveal completes
            window.HEARTOS_FLAGS.secretsUnlocked = true;
            window.dispatchEvent(new Event('secretsUnlocked'));

            this.gameProgress++;
            this.unlockInput();
            this.scroll();
        }, totalDelay + 600);
    }
};

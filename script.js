function init() {
    // Создаем снежинки на фоне
    function createLines() {
        const linesContainer = document.getElementById('lines');
        if (!linesContainer) return;
        const isSmall = window.innerWidth < 700 || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const lineCount = isSmall ? 2 : 5; // fewer particles on small devices

        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.className = 'line';
            line.style.left = Math.random() * 100 + 'vw';

            const size = Math.floor(Math.random() * 12) + 6; // 6-18px
            line.style.width = size + 'px';
            line.style.height = size + 'px';

            line.style.animationDelay = (Math.random() * (isSmall ? 2 : 5)).toFixed(2) + 's';
            const duration = Math.random() * (isSmall ? 4 : 6) + (isSmall ? 6 : 6); // shorter on small
            line.style.animationDuration = duration.toFixed(2) + 's';

            line.style.opacity = (Math.random() * 0.5 + 0.4).toFixed(2);
            if (!isSmall && Math.random() > 0.75) line.style.filter = 'blur(0.6px)';

            linesContainer.appendChild(line);

            setTimeout(() => {
                if (line.parentNode) line.remove();
            }, duration * 1000 + 2000);
        }
    }

    setInterval(createLines, 3500);
    createLines();

    // Языки и переводы
    function detectLanguageAndCountry() {
        const userLang = navigator.language || navigator.userLanguage || 'en';
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        const cisLanguages = ['ru', 'uk', 'be', 'kk', 'az', 'hy', 'ka', 'ky', 'tg', 'tk', 'uz'];
        const cisTimezones = ['Europe/Moscow', 'Europe/Kiev', 'Europe/Minsk', 'Asia/Almaty', 'Asia/Tashkent', 'Asia/Bishkek', 'Asia/Dushanbe', 'Asia/Yerevan', 'Asia/Tbilisi', 'Europe/Simferopol'];
        const isCISByLang = cisLanguages.some(lang => userLang.startsWith(lang));
        const isCISByTz = cisTimezones.some(tz => timezone.includes(tz));
        return (isCISByLang && isCISByTz) ? 'ru' : 'en';
    }

    const translations = {
        ru: {
            home: '🏠 Главная',
            mods: '🎮 Моды',
            contact: '📞 Связь',
            language: '🌐 Язык',
            cancel: '❌ Отмена',
            welcomeTitle: 'Добро пожаловать',
            welcomeText: 'Добро пожаловать на сайт модов и скриптов от Sanbox. Вам предстоит пролистать вниз и выбрать, что вы хотите скачать — мод или скрипт. Все материалы протестированы и безопасны в использовании.',
            modsTitle: 'Доступные Моды',
            modsSubtitle: 'Выберите нужную модификацию',
            scriptTitle: 'Скрипт',
            scriptDesc: 'Скрипт для разрушения игры',
            hsTitle: 'Hypper Sandbox Mod v1.0',
            hsDesc: 'Мод: Нет рекламы, устранение багов, добавление полезных функций',
            downloadScript: 'Скачать',
            downloadHS: 'Скачать',
            discord: 'DISCORD',
            telegram: 'TELEGRAM',
            contactTitle: 'Связь с нами',
            contactChannel: 'Наш телеграм канал:',
            contactDiscord: 'Дискорд создателя:',
            contactCreator: 'Телеграм создателя:',
            infoText: "Вся инструкция по установке находится в архиве. Распакуйте скачанный ZIP-файл и откройте документ 'INSTALL.txt' для получения подробных указаний.",
            footerText: 'By Sanbox'
        },
        en: {
            home: '🏠 Home',
            mods: '🎮 Mods',
            contact: '📞 Contact',
            language: '🌐 Language',
            cancel: '❌ Cancel',
            welcomeTitle: 'Welcome',
            welcomeText: 'Welcome to Sanbox mods and scripts. Scroll down to choose which mod or script you want to download. All files are tested and safe to use.',
            modsTitle: 'Available Mods',
            modsSubtitle: 'Select a modification',
            scriptTitle: 'Script',
            scriptDesc: 'Script for Destroy the Game',
            hsTitle: 'Hypper Sandbox Mod v1.0',
            hsDesc: 'Mod: No Ads, fixes, added features',
            downloadScript: 'Download',
            downloadHS: 'Download',
            discord: 'DISCORD',
            telegram: 'TELEGRAM',
            contactTitle: 'Contact Us',
            contactChannel: 'Our telegram channel:',
            contactDiscord: "Creator's Discord:",
            contactCreator: "Creator's Telegram:",
            infoText: 'All installation instructions are in the archive. Extract the ZIP and open INSTALL.txt for details.',
            footerText: 'By Sanbox'
        }
    };

    function applyTranslation(lang) {
        const texts = translations[lang] || translations.en;
        const safeSet = (selector, value, isHtml = false) => {
            const el = document.querySelector(selector);
            if (!el) return;
            if (isHtml) el.innerHTML = value; else el.textContent = value;
        };

        safeSet('.welcome-title', texts.welcomeTitle);
        safeSet('#welcomeText', texts.welcomeText);
        safeSet('#discordBtn', texts.discord);
        safeSet('#telegramBtn', texts.telegram);
        safeSet('.section-title', texts.modsTitle);
        safeSet('.section-subtitle', texts.modsSubtitle);
        const modTitles = document.querySelectorAll('.mod-title');
        if (modTitles[0]) modTitles[0].textContent = texts.scriptTitle;
        if (modTitles[1]) modTitles[1].textContent = texts.hsTitle;
        safeSet('#scriptDesc', texts.scriptDesc);
        safeSet('#hsDesc', texts.hsDesc);
        safeSet('#downloadScript', texts.downloadScript);
        safeSet('#downloadHS', texts.downloadHS);
        safeSet('#infoText', texts.infoText);
        safeSet('#footerText', texts.footerText);

        localStorage.setItem('preferredLanguage', lang);
        document.documentElement.lang = lang;
    }

    const preferredLang = localStorage.getItem('preferredLanguage') || detectLanguageAndCountry();
    applyTranslation(preferredLang);

    // VPN detection (best-effort)
    function detectVPN() {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                const indicators = [data.security && data.security.vpn, data.security && data.security.proxy, data.security && data.security.tor];
                if (indicators.some(Boolean)) showVPNWarning();
            }).catch(()=>{});
    }

    function showVPNWarning(){
        const warning = document.createElement('div');
        warning.className = 'vpn-warning';
        warning.textContent = '⚠️ VPN Detected! For better experience, please disable VPN.';
        document.body.appendChild(warning);
        setTimeout(()=> warning.remove(), 5000);
    }

    setTimeout(detectVPN, 1000);

    // Download buttons
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(button => {
        button.addEventListener('click', function(e){
            const fileName = this.dataset.file || this.textContent.trim();
            openDownloadModal(fileName);
        });
    });

    // Modal logic
    const downloadModal = document.getElementById('downloadModal');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalDirect = document.getElementById('modalDirect');
    const modalMirror = document.getElementById('modalMirror');

    function openDownloadModal(fileName){
        if (!downloadModal) return;
        modalTitle.textContent = `Скачать: ${fileName}`;
        modalDirect.href = encodeURI(fileName);
        modalDirect.setAttribute('download', fileName);
        modalMirror.href = '#';
        downloadModal.setAttribute('aria-hidden','false');
    }

    function closeDownloadModal(){
        if (!downloadModal) return;
        downloadModal.setAttribute('aria-hidden','true');
    }

    if (modalClose) modalClose.addEventListener('click', closeDownloadModal);
    if (downloadModal) downloadModal.addEventListener('click', function(e){ if (e.target === this) closeDownloadModal(); });

    // startDownload removed (unused) — downloads handled via modal direct links

    // Button hover/touch animations (kept simple)
    const buttons = document.querySelectorAll('button, .social-btn, .contact-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function(){ this.style.transform = 'translateY(-3px)'; });
        button.addEventListener('mouseleave', function(){ if (!this.classList.contains('loading')) this.style.transform = ''; });
        button.addEventListener('touchstart', function(){ this.style.transform = 'translateY(2px)'; });
        button.addEventListener('touchend', function(){ if (!this.classList.contains('loading')) this.style.transform = ''; });
    });

    // Reduce background animation on small devices
    function animateBackground(){
        const bg = document.querySelector('.animated-bg');
        if (!bg) return;
        if (window.innerWidth < 700 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let position = 0;
        setInterval(()=>{ position = (position + 1) % 10000; bg.style.backgroundPosition = `${position}px ${position}px`; }, 60);
    }
    animateBackground();
    function showSection(id){
        document.querySelectorAll('.section').forEach(s=> s.classList.remove('active'));
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
        document.querySelectorAll('.nav-link').forEach(n=> n.classList.toggle('active', n.dataset.target===id));
    }

    document.querySelectorAll('.nav-link').forEach(btn=>{
        btn.addEventListener('click', ()=> showSection(btn.dataset.target));
    });

    // Theme toggle (dark / light)
    const themeToggle = document.getElementById('themeToggle');
    function applyTheme(name){
        if (name === 'light') document.body.classList.add('light-theme'); else document.body.classList.remove('light-theme');
        localStorage.setItem('preferredTheme', name);
        if (themeToggle) themeToggle.textContent = name === 'light' ? '🌤️' : '🌑';
        document.querySelectorAll('.theme-option').forEach(b=> b.classList.toggle('active', b.dataset.theme===name));
    }
    const savedTheme = localStorage.getItem('preferredTheme') || 'dark';
    applyTheme(savedTheme);
    if (themeToggle) themeToggle.addEventListener('click', ()=> applyTheme(document.body.classList.contains('light-theme') ? 'dark' : 'light'));

    // Theme options (settings page)
    document.querySelectorAll('.theme-option').forEach(btn=> btn.addEventListener('click', ()=> applyTheme(btn.dataset.theme)));

    // Language options (settings page)
    document.querySelectorAll('.lang-option').forEach(btn=> btn.addEventListener('click', ()=>{
        applyTranslation(btn.dataset.lang);
        document.querySelectorAll('.lang-option').forEach(b=> b.classList.toggle('active', b.dataset.lang===btn.dataset.lang));
    }));

    // mark language buttons active on load
    document.querySelectorAll('.lang-option').forEach(b=> b.classList.toggle('active', b.dataset.lang===preferredLang));

    // Accounts: simple localStorage-backed 'work accounts' UI
    const accountListEl = document.getElementById('accountList');
    const accName = document.getElementById('accName');
    const accToken = document.getElementById('accToken');
    const saveAccountBtn = document.getElementById('saveAccount');
    const clearAccountsBtn = document.getElementById('clearAccounts');
    const accountPreview = document.getElementById('accountPreview');

    function loadAccounts(){
        const raw = localStorage.getItem('workAccounts');
        try{
            return raw ? JSON.parse(raw) : [];
        }catch(e){ return []; }
    }

    function saveAccounts(list){ localStorage.setItem('workAccounts', JSON.stringify(list)); }

    function renderAccounts(){
        const list = loadAccounts();
        accountListEl.innerHTML = '';
        if (!list.length) accountListEl.innerHTML = '<div class="account-item">No accounts saved</div>';
        list.forEach((acc, idx)=>{
            const el = document.createElement('div');
            el.className = 'account-item';
            el.innerHTML = `<div>${acc.name}</div><div><button class="btn small use-acc" data-idx="${idx}">Use</button> <button class="btn small ghost del-acc" data-idx="${idx}">Del</button></div>`;
            accountListEl.appendChild(el);
        });
        // bind buttons
        accountListEl.querySelectorAll('.use-acc').forEach(b=> b.addEventListener('click', ()=>{
            const idx = b.dataset.idx; const acc = loadAccounts()[idx];
            if (acc){ localStorage.setItem('activeAccount', JSON.stringify(acc)); updateAccountPreview(); }
        }));
        accountListEl.querySelectorAll('.del-acc').forEach(b=> b.addEventListener('click', ()=>{
            const idx = +b.dataset.idx; const list = loadAccounts(); list.splice(idx,1); saveAccounts(list); renderAccounts();
        }));
    }

    function updateAccountPreview(){
        const raw = localStorage.getItem('activeAccount');
        if (!raw){ accountPreview.textContent = 'No account'; return; }
        try{ const acc = JSON.parse(raw); accountPreview.textContent = `Active: ${acc.name}`; }catch(e){ accountPreview.textContent = 'No account'; }
    }

    if (saveAccountBtn) saveAccountBtn.addEventListener('click', function(e){
        e.preventDefault();
        const name = accName.value.trim(); const token = accToken.value.trim();
        if (!name || !token) return alert('Please enter name and token');
        const list = loadAccounts(); list.push({name, token}); saveAccounts(list); accName.value=''; accToken.value=''; renderAccounts();
    });

    if (clearAccountsBtn) clearAccountsBtn.addEventListener('click', function(){ if (confirm('Clear all saved accounts?')){ saveAccounts([]); renderAccounts(); localStorage.removeItem('activeAccount'); updateAccountPreview(); } });

    renderAccounts(); updateAccountPreview();

    // open settings btn
    const openSettingsBtn = document.getElementById('openSettingsBtn');
    if (openSettingsBtn) openSettingsBtn.addEventListener('click', ()=> showSection('settings'));

    // theme option active state reflect
    document.querySelectorAll('.theme-option').forEach(b=> b.classList.toggle('active', b.dataset.theme === (localStorage.getItem('preferredTheme') || 'dark')));

    // Initialize show based on hash or default
    const initial = location.hash ? location.hash.replace('#','') : 'home';
    showSection(initial);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
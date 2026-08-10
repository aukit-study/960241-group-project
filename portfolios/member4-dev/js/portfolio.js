(function () {
    'use strict';

    /* ── Theme Toggle ── */
    const themeBtn = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    function setTheme(isDark) {
        if (isDark) {
            htmlEl.classList.add('dark');
            bodyEl.classList.add('dark');
            htmlEl.setAttribute('data-theme', 'dark');
            if (themeBtn) themeBtn.textContent = '☀️';
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            htmlEl.classList.remove('dark');
            bodyEl.classList.remove('dark');
            htmlEl.setAttribute('data-theme', 'light');
            if (themeBtn) themeBtn.textContent = '🌙';
            localStorage.setItem('portfolio-theme', 'light');
        }
    }

    // Init theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'dark') {
        setTheme(true);
    } else {
        setTheme(false);
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            const isDark = htmlEl.classList.contains('dark');
            setTheme(!isDark);
        });
    }

    /* ── Mobile Menu Toggle ── */
    const menuBtn = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('open');
            menuBtn.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
        });

        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('open');
                menuBtn.textContent = '☰';
            });
        });
    }

    /* ── Project Filter Tabs ── */
    const filterTabsContainer = document.getElementById('filterTabs');
    const projectCards = document.querySelectorAll('#projectsList .card');

    if (filterTabsContainer) {
        const tabs = filterTabsContainer.querySelectorAll('.filter-tab');

        // Update counts on tabs initially
        tabs.forEach(function (tab) {
            const filter = tab.getAttribute('data-filter');
            let count = 0;
            if (filter === 'all') {
                count = projectCards.length;
            } else {
                projectCards.forEach(function (card) {
                    if (card.getAttribute('data-category') === filter) count++;
                });
            }
            // Add or update count badge if active
            const existingCount = tab.querySelector('.filter-tab__count');
            if (existingCount) {
                existingCount.textContent = count;
            } else if (tab.classList.contains('active')) {
                const countBadge = document.createElement('span');
                countBadge.className = 'filter-tab__count';
                countBadge.textContent = count;
                tab.appendChild(countBadge);
            }
        });

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                const filter = this.getAttribute('data-filter');

                // Update active tab class
                tabs.forEach(function (t) {
                    t.classList.remove('active');
                    const badge = t.querySelector('.filter-tab__count');
                    if (badge) badge.remove();
                });

                this.classList.add('active');

                // Filter cards with smooth fade
                let matchingCount = 0;
                projectCards.forEach(function (card) {
                    const cat = card.getAttribute('data-category');
                    if (filter === 'all' || cat === filter) {
                        card.style.display = '';
                        matchingCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Add count badge to active tab
                const countBadge = document.createElement('span');
                countBadge.className = 'filter-tab__count';
                countBadge.textContent = matchingCount;
                this.appendChild(countBadge);
            });
        });
    }

    /* ── Smooth Scroll & Active Nav Tracking ── */
    const navLinks = document.querySelectorAll('.port-nav__link, .port-nav__mobile-link');
    const sections = ['home', 'about', 'projects', 'blog'].map(function (id) {
        return document.getElementById(id);
    }).filter(Boolean);

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    function updateActiveNav() {
        const scrollY = window.scrollY || window.pageYOffset;
        let currentId = 'home';

        sections.forEach(function (section) {
            const top = section.offsetTop - 120;
            if (scrollY >= top) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === '#' + currentId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
})();

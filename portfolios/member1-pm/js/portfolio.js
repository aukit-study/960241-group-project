/* Portfolio console behaviour — Stratis "Control Room" posture:
   feedback is functional, never playful. No parallax, no bounce. */
(function () {
    'use strict';

    var root = document.documentElement;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Theme (shared key with the welcome page) ── */
    var toggle = document.getElementById('theme-toggle');
    var iconSun = document.getElementById('theme-icon-light');
    var iconMoon = document.getElementById('theme-icon-dark');

    function paintIcons() {
        var isDark = root.classList.contains('dark');
        iconSun.hidden = !isDark;   /* offer "go light" while dark */
        iconMoon.hidden = isDark;
    }

    /* Light is the default here; dark is opt-in and remembered. */
    if (localStorage.getItem('theme') === 'dark') root.classList.add('dark');
    paintIcons();

    toggle.addEventListener('click', function () {
        root.classList.toggle('dark');
        localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
        paintIcons();
    });

    /* ── Section reveal ── */
    var reveals = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        reveals.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(function (el) { observer.observe(el); });
    }

    /* ── Meters fill once their panel is on screen ── */
    var meters = document.querySelectorAll('.meter__fill');
    function fillMeters() {
        meters.forEach(function (bar) { bar.style.width = bar.dataset.level + '%'; });
    }
    if (reduceMotion || !('IntersectionObserver' in window)) {
        fillMeters();
    } else {
        var skills = document.getElementById('skills');
        var meterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                fillMeters();
                meterObserver.disconnect();
            });
        }, { threshold: 0.25 });
        if (skills) meterObserver.observe(skills);
    }

    /* Safety net: content must never stay hidden because the observer
       never fired (background tab, odd embed, IO quirk). */
    setTimeout(function () {
        if (document.querySelectorAll('.reveal.is-visible').length) return;
        reveals.forEach(function (el) { el.classList.add('is-visible'); });
        fillMeters();
    }, 1200);

    /* ── Topbar clock: a live readout, matching the instrument-panel framing ── */
    var clock = document.getElementById('clock');
    if (clock) {
        var render = function () {
            var now = new Date();
            var pad = function (n) { return String(n).padStart(2, '0'); };
            clock.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
        };
        render();
        setInterval(render, 1000);
    }
})();

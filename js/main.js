/* ========================================================================
   QuadraCraft Studio — Main JavaScript (main.js)
   Interactive terminal, smooth scroll, mobile menu, counters, scroll reveal
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initTerminal();
});

/* ── Navbar: Scroll Effect & Active Link ── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');

  function onScroll() {
    // Add scrolled class
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight active section
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.includes(current) && current !== '') {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile Menu Toggle ── */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Scroll Reveal (IntersectionObserver) ── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    reveals.forEach(el => el.classList.add('revealed'));
  }
}

/* ── Counter Animation ── */
function initCounters() {
  const counters = document.querySelectorAll('.counter');

  if (!('IntersectionObserver' in window)) {
    counters.forEach(c => { c.textContent = c.dataset.target; });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000; // ms
  const startTime = performance.now();

  // Determine formatting
  const formatNumber = (num) => {
    if (target >= 10000) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    const current = Math.round(eased * target);

    el.textContent = formatNumber(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ── Interactive Terminal Typing Effect ── */
function initTerminal() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lines = [
    { type: 'prompt', text: '~/quadracraft $ ', cmd: 'npm run build:nexpos' },
    { type: 'info', text: '⚡ Building NexPOS 360 v4.2.0...' },
    { type: 'dim', text: '' },
    { type: 'dim', text: '  ├── Compiling POS transaction engine' },
    { type: 'success', text: '  │   ✓ 247 modules compiled (1.2s)' },
    { type: 'dim', text: '  ├── Building inventory sync service' },
    { type: 'success', text: '  │   ✓ Real-time WebSocket channels ready' },
    { type: 'dim', text: '  ├── Bundling retail analytics dashboard' },
    { type: 'success', text: '  │   ✓ 12 chart components optimized' },
    { type: 'dim', text: '  └── Running integration tests' },
    { type: 'success', text: '      ✓ 384 tests passed (3.1s)' },
    { type: 'dim', text: '' },
    { type: 'info', text: '📦 Bundle size: 142KB (gzipped)' },
    { type: 'success', text: '🚀 Deployed to 13,247 nodes — all green' },
    { type: 'dim', text: '' },
    { type: 'prompt', text: '~/quadracraft $ ', cmd: '' },
  ];

  // If reduced motion, show all at once
  if (prefersReducedMotion) {
    renderAllLines(body, lines);
    return;
  }

  typeLines(body, lines, 0);
}

function renderAllLines(container, lines) {
  lines.forEach(line => {
    const span = document.createElement('span');
    span.className = 'terminal__line';

    if (line.type === 'prompt') {
      span.innerHTML = `<span class="terminal__prompt">${line.text}</span><span class="terminal__command">${line.cmd || ''}</span>`;
    } else {
      span.innerHTML = `<span class="terminal__${line.type}">${line.text}</span>`;
    }

    container.appendChild(span);
  });

  // Add cursor at the end
  const cursor = document.createElement('span');
  cursor.className = 'terminal__cursor';
  container.lastElementChild.appendChild(cursor);
}

function typeLines(container, lines, index) {
  if (index >= lines.length) return;

  const line = lines[index];
  const span = document.createElement('span');
  span.className = 'terminal__line';
  container.appendChild(span);

  // Auto-scroll terminal
  container.scrollTop = container.scrollHeight;

  if (line.type === 'prompt' && line.cmd) {
    // Type the prompt immediately, then type command char by char
    span.innerHTML = `<span class="terminal__prompt">${line.text}</span><span class="terminal__command"></span><span class="terminal__cursor"></span>`;
    const cmdSpan = span.querySelector('.terminal__command');
    const cursor = span.querySelector('.terminal__cursor');

    typeText(cmdSpan, line.cmd, 0, 40, () => {
      cursor.remove();
      setTimeout(() => {
        typeLines(container, lines, index + 1);
      }, 300);
    });
  } else if (line.type === 'prompt' && !line.cmd) {
    // Just a prompt with cursor (final line)
    span.innerHTML = `<span class="terminal__prompt">${line.text}</span><span class="terminal__cursor"></span>`;
  } else {
    // Regular output line — appear with slight delay
    span.style.opacity = '0';
    span.innerHTML = `<span class="terminal__${line.type}">${line.text}</span>`;

    setTimeout(() => {
      span.style.opacity = '1';
      span.style.transition = 'opacity 150ms ease';
      container.scrollTop = container.scrollHeight;
      setTimeout(() => {
        typeLines(container, lines, index + 1);
      }, line.text === '' ? 100 : 120);
    }, line.text === '' ? 50 : 80);
  }
}

function typeText(element, text, charIndex, speed, callback) {
  if (charIndex < text.length) {
    element.textContent += text.charAt(charIndex);
    element.parentElement.parentElement.scrollTop = element.parentElement.parentElement.scrollHeight;
    setTimeout(() => {
      typeText(element, text, charIndex + 1, speed, callback);
    }, speed + Math.random() * 30);
  } else {
    if (callback) callback();
  }
}

(function () {
    const card = document.getElementById('hero-card');
    const canvas = document.getElementById('particle-canvas');

    if (!card) return;

    /* ── 3D Tilt on Hero Card ── */
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    document.addEventListener('mousemove', (e) => {
        const mx = (e.clientX / window.innerWidth - 0.5) * 2;
        const my = (e.clientY / window.innerHeight - 0.5) * 2;
        targetRotateY = mx * 6;
        targetRotateX = -my * 4;
    });

    document.addEventListener('mouseleave', () => {
        targetRotateX = 0;
        targetRotateY = 0;
    });

    function animateCard() {
        currentRotateX += (targetRotateX - currentRotateX) * 0.06;
        currentRotateY += (targetRotateY - currentRotateY) * 0.06;
        card.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
        requestAnimationFrame(animateCard);
    }
    animateCard();

    /* ── Particle Canvas ── */
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const count = window.innerWidth < 768 ? 35 : 70;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const colors = [
            { r: 34, g: 197, b: 94 },   // green
            { r: 6, g: 182, b: 212 },    // cyan
            { r: 59, g: 130, b: 246 },   // blue
            { r: 148, g: 163, b: 184 },  // slate
        ];

        for (let i = 0; i < count; i++) {
            const c = colors[Math.floor(Math.random() * colors.length)];
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                opacity: Math.random() * 0.3 + 0.1,
                color: c
            });
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connection lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(34, 197, 94, ${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
                ctx.fill();
            });

            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }

    /* ── Stagger Reveal Animations ── */
    document.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.animationDelay = `${0.2 + i * 0.08}s`;
    });
})();

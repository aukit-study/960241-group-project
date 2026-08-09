(function () {
    const scene = document.getElementById('scene-3d');
    const canvas = document.getElementById('particle-canvas');

    if (scene) {
        const shapes = scene.querySelectorAll('[data-float]');
        shapes.forEach((shape, i) => {
            const speed = 0.25 + i * 0.12;
            let t = i * 1.4;

            function floatShape() {
                t += 0.007 * speed;
                const y = Math.sin(t) * 14;
                const x = Math.cos(t * 0.65) * 10;
                shape.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                requestAnimationFrame(floatShape);
            }
            floatShape();
        });

        document.addEventListener('mousemove', (e) => {
            const mx = (e.clientX / window.innerWidth - 0.5) * 2;
            const my = (e.clientY / window.innerHeight - 0.5) * 2;
            scene.style.transform = `translate3d(${mx * -8}px, ${my * -6}px, 0)`;
        });
    }

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const count = window.innerWidth < 768 ? 50 : 100;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
        }
        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('load', resize);
        setTimeout(resize, 1500);

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.4 + 0.4,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                opacity: Math.random() * 0.35 + 0.08
            });
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(148, 163, 184, ${p.opacity})`;
                ctx.fill();
            });
            requestAnimationFrame(drawParticles);
        }
        drawParticles();

        window.addEventListener('scroll', () => {
            canvas.style.transform = `translateY(${window.scrollY * 0.15}px)`;
        }, { passive: true });
    }

    const reveals = document.querySelectorAll('.section-reveal');
    if (reveals.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );
        reveals.forEach((el) => observer.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add('visible'));
    }
})();

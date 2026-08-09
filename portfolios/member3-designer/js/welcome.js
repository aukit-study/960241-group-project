(function () {
    const card = document.getElementById('hero-card');
    const scene = document.getElementById('scene-3d');
    const canvas = document.getElementById('particle-canvas');

    if (!card || !scene) return;

    let mouseX = 0;
    let mouseY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        targetRotateY = mouseX * 8;
        targetRotateX = -mouseY * 6;
    });

    document.addEventListener('mouseleave', () => {
        targetRotateX = 0;
        targetRotateY = 0;
    });

    function animateCard() {
        currentRotateX += (targetRotateX - currentRotateX) * 0.08;
        currentRotateY += (targetRotateY - currentRotateY) * 0.08;
        card.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
        requestAnimationFrame(animateCard);
    }
    animateCard();

    const shapes = scene.querySelectorAll('[data-float]');
    shapes.forEach((shape, i) => {
        const speed = 0.3 + i * 0.15;
        const offset = i * 1.2;
        let t = offset;

        function floatShape() {
            t += 0.008 * speed;
            const y = Math.sin(t) * 12;
            const x = Math.cos(t * 0.7) * 8;
            const base = shape.dataset.baseTransform || '';
            shape.style.transform = `${base} translate3d(${x}px, ${y}px, 0)`;
            requestAnimationFrame(floatShape);
        }
        floatShape();
    });

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const count = window.innerWidth < 768 ? 40 : 80;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.4 + 0.1
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
    }

    document.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.animationDelay = `${0.15 + i * 0.1}s`;
    });
})();

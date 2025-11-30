document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggler ---
    const themeToggleBtn = document.createElement('button');
    themeToggleBtn.className = 'theme-toggle';
    themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggleBtn.setAttribute('aria-label', 'Toggle Theme');
    document.body.appendChild(themeToggleBtn);

    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';

    function setTheme(theme) {
        html.setAttribute('data-color-scheme', theme);
        localStorage.setItem('theme', theme);
        themeToggleBtn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    setTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-color-scheme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // --- Mobile Menu ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // --- Typing Effect ---
    const textElement = document.getElementById('typing-text');
    const textToType = "Muhammad Awais Amin";
    let charIndex = 0;

    function typeText() {
        if (charIndex < textToType.length) {
            textElement.textContent = textToType.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeText, 100);
        }
    }

    // Clear initial text to start typing
    if (textElement) {
        textElement.textContent = '';
        setTimeout(typeText, 500);
    }

    // --- Active Navigation Link on Scroll ---
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- Scroll to Top ---
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to Top');
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Skill Bar Animation ---
    const skillSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.skill-progress');
    let skillsAnimated = false;

    const skillObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !skillsAnimated) {
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            skillsAnimated = true;
        }
    }, { threshold: 0.5 });

    if (skillSection) {
        skillObserver.observe(skillSection);
    }

    // --- Canvas Background Animation (Subtle Particles) ---
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const heroSection = document.getElementById('home');

    if (heroSection) {
        canvas.id = 'bg-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        heroSection.appendChild(canvas);

        let particlesArray;

        function resizeCanvas() {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            const numberOfParticles = (canvas.width * canvas.height) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();

        // Re-init on theme change to update color
        themeToggleBtn.addEventListener('click', () => {
            setTimeout(() => {
                particlesArray.forEach(p => {
                    p.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
                });
            }, 100);
        });
    }
});

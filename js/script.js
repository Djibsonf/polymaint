// Configuration du carousel
document.addEventListener('DOMContentLoaded', function() {
    // ===== CAROUSEL CONFIGURATION =====
    const heroCarousel = document.getElementById('hero-carousel');
    if (heroCarousel) {
        const carousel = new bootstrap.Carousel(heroCarousel, {
            interval: 6000,
            wrap: true,
            pause: 'hover',
            touch: true,
            keyboard: true
        });
        
        // Navigation avec flèches clavier
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                carousel.prev();
            } else if (e.key === 'ArrowRight') {
                carousel.next();
            }
        });
        
        // Effets sur les flèches
        const arrows = document.querySelectorAll('.carousel-control-prev, .carousel-control-next');
        arrows.forEach(arrow => {
            arrow.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-50%) scale(1.15)';
                this.style.boxShadow = '0 0 20px rgba(255, 152, 0, 0.5)';
            });
            
            arrow.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-50%) scale(1)';
                this.style.boxShadow = 'none';
            });
        });
    }
    
    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fermer le menu mobile si ouvert
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });
    
    // ===== ANIMATION DES STATISTIQUES =====
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const originalText = stat.textContent;
            const hasPlus = originalText.includes('+');
            const isPercent = originalText.includes('%');
            const finalValue = parseInt(originalText.replace('+', '').replace('%', ''));
            
            let startValue = 0;
            const duration = 1500;
            const increment = finalValue / (duration / 16);
            
            const updateCounter = () => {
                startValue += increment;
                if (startValue < finalValue) {
                    stat.textContent = Math.floor(startValue) + 
                                      (hasPlus ? '+' : '') + 
                                      (isPercent ? '%' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = originalText;
                }
            };
            
            updateCounter();
        });
    }
    
    // ===== ANIMATION DES DOMAINES =====
    const domainesSection = document.getElementById('domaines');
    if (domainesSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.domain-card').forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(domainesSection);
        
        // Initial state
        document.querySelectorAll('.domain-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    }
    
    // ===== ANIMATION DES COLLABORATIONS =====
    const collaborations = document.getElementById('collaborations');
    if (collaborations) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.collaborator-logo').forEach((logo, index) => {
                        setTimeout(() => {
                            logo.style.opacity = '1';
                            logo.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(collaborations);
        
        // Initial state
        document.querySelectorAll('.collaborator-logo').forEach(logo => {
            logo.style.opacity = '0';
            logo.style.transform = 'translateY(20px)';
            logo.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    }
    
    // ===== NAVIGATION ACTIVE =====
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}` || 
                (current === '' && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            }
        });
    });
});
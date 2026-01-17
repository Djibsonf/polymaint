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
        // Ne pas appliquer le smooth scroll aux liens qui pointent vers d'autres pages
        if (!anchor.getAttribute('href').includes('.html')) {
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
                    
                    // Mettre à jour l'URL sans rechargement
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    }
                    
                    // Mettre à jour l'état actif
                    updateActiveNav();
                    
                    // Fermer le menu mobile si ouvert
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        navbarToggler.click();
                    }
                }
            });
        }
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
    
    // ===== GESTION DE L'ÉTAT ACTIF DE LA NAVBAR =====

function clearActiveNav() {
    document.querySelectorAll('.navbar-nav a').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
}

function activateLink(link) {
    if (!link) return;

    link.classList.add('active');
    link.setAttribute('aria-current', 'page');

    // Activer le parent dropdown si nécessaire
    const dropdownMenu = link.closest('.dropdown-menu');
    if (dropdownMenu) {
        const toggle = dropdownMenu.parentElement.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.classList.add('active');
            toggle.setAttribute('aria-current', 'page');
        }
    }
}

function updateActiveNav() {
    // Ne pas clearActiveNav ici, pour que le carré bleu reste actif
    const page = window.location.pathname.split('/').pop() || 'index.html';

    if (page === 'index.html') {
        // On scroll dans index.html, activer la section
        const scrollPos = window.scrollY + 120;
        const sections = document.querySelectorAll('section[id]');
        let currentSection = null;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                currentSection = section.id;
            }
        });

        if (currentSection) {
            activateLink(document.querySelector(`.navbar-nav a[href="#${currentSection}"]`));
        } else {
            activateLink(document.querySelector('.navbar-nav a[href="index.html"]'));
        }
    } else {
        // Autres pages
        const link = document.querySelector(`.navbar-nav a[href="${page}"]`);
        activateLink(link);
    }
}

// ===== SCROLL (uniquement pour index.html) =====
window.addEventListener('scroll', () => {
    if (window.location.pathname.split('/').pop() === 'index.html') {
        updateActiveNav();
    }
});

// ===== CLIC NAVBAR =====
document.querySelectorAll('.navbar-nav a').forEach(link => {
    link.addEventListener('click', () => {
        activateLink(link); // Ne plus clearActiveNav pour que ça reste actif
    });
});

// ===== INIT =====
window.addEventListener('load', updateActiveNav);
window.addEventListener('popstate', updateActiveNav);

});
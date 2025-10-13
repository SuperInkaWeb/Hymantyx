// ===================================
// Navbar Scroll Effect
// ===================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===================================
// Smooth Scroll for Navigation Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
});

// ===================================
// Active Navigation Link on Scroll
// ===================================
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let current = '';
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===================================
// Tab Switching for Contact Forms
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const empresaTab = document.getElementById('empresa-tab');
    const candidatoTab = document.getElementById('candidato-tab');
    
    if (empresaTab && candidatoTab) {
        empresaTab.addEventListener('shown.bs.tab', function (event) {
            console.log('Tab de Empresa activado');
        });
        
        candidatoTab.addEventListener('shown.bs.tab', function (event) {
            console.log('Tab de Candidato activado');
        });
    }
});

// ===================================
// Tab Switching + Animations
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const empresaTab = document.getElementById('empresa-tab');
    const candidatoTab = document.getElementById('candidato-tab');
    
    if (empresaTab && candidatoTab) {
        empresaTab.addEventListener('shown.bs.tab', function () {
            console.log('Tab de Empresa activado');
        });
        
        candidatoTab.addEventListener('shown.bs.tab', function () {
            console.log('Tab de Candidato activado');
        });
    }

    // Reveal on scroll
    const revealables = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealables.forEach(el => observer.observe(el));

    // Floating micro interactions
    document.querySelectorAll('[data-float]').forEach((el, idx) => {
        el.style.setProperty('--delay', `${idx * 80}ms`);
    });
});

// ===================================
// Console Welcome Message
// ===================================
console.log('%c¡Bienvenido a Humantyx!', 'color: #10b981; font-size: 20px; font-weight: bold;');
console.log('%cTransformamos tu gestión de talento en Perú', 'color: #2563eb; font-size: 14px;');

// Single-Page Scrollable Portfolio Application JavaScript

class PortfolioApp {
    constructor() {
        this.currentSection = 'home';
        this.sections = [];
        this.isScrolling = false;
        this.init();
    }

    init() {
        this.sections = document.querySelectorAll('.section');
        this.setupEventListeners();
        this.setupSmoothScrollNavigation();
        this.setupMobileMenu();
        this.setupContactForm();
        this.setupScrollEffects();
        this.setupScrollToTop();
        this.setupIntersectionObserver();
        this.setupSkillBars();
    }

    setupEventListeners() {
        // Navigation items - smooth scroll to sections
        const navItems = document.querySelectorAll('.navbar-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.closeMobileMenu();
                this.updateActiveNavigation(targetId);
            });
        });

        // Hero action buttons
        const heroButtons = document.querySelectorAll('.hero-actions .btn');
        heroButtons.forEach(button => {
            if (button.getAttribute('href')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = button.getAttribute('href').substring(1);
                    this.scrollToSection(targetId);
                    this.updateActiveNavigation(targetId);
                });
            }
        });

        // Project links
        const projectLinks = document.querySelectorAll('.project-link');
        projectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.href === '#' || link.href.endsWith('#')) {
                    e.preventDefault();
                    this.showNotification('Demo link - Connect with me to see the live project!');
                }
            });
        });
    }

    setupSmoothScrollNavigation() {
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            if (hash && document.getElementById(hash)) {
                this.scrollToSection(hash);
            }
        });

        // Handle initial hash on page load
        if (window.location.hash) {
            const hash = window.location.hash.slice(1);
            setTimeout(() => this.scrollToSection(hash), 100);
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Update URL without triggering hashchange
            if (history.pushState) {
                history.pushState(null, null, `#${sectionId}`);
            }
        }
    }

    updateActiveNavigation(sectionId) {
        // Update active nav item
        const navItems = document.querySelectorAll('.navbar-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${sectionId}`) {
                item.classList.add('active');
            }
        });
        
        this.currentSection = sectionId;
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navbarMenu = document.getElementById('navbarMenu');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                navbarMenu.classList.toggle('active');
                this.toggleMobileMenuIcon();
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && navbarMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    closeMobileMenu() {
        const navbarMenu = document.getElementById('navbarMenu');
        navbarMenu.classList.remove('active');
        this.resetMobileMenuIcon();
    }

    toggleMobileMenuIcon() {
        const spans = document.querySelectorAll('.mobile-menu-btn span');
        spans.forEach((span, index) => {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        });
    }

    resetMobileMenuIcon() {
        const spans = document.querySelectorAll('.mobile-menu-btn span');
        spans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Add loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual backend integration)
        setTimeout(() => {
            this.showNotification('Thank you for your message! I\'ll get back to you soon.');
            form.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);

        console.log('Form data:', data); // For testing
    }

    setupScrollEffects() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Update active navigation based on scroll position
        this.updateNavigationOnScroll();
        
        // Show/hide scroll to top button
        this.toggleScrollToTopButton();
        
        // Add parallax effect to hero section
        const hero = document.querySelector('.hero-section');
        if (hero) {
            const offset = scrollY * 0.5;
            hero.style.transform = `translateY(${offset}px)`;
        }
    }

    updateNavigationOnScroll() {
        const sections = document.querySelectorAll('.section');
        const scrollPos = window.scrollY + 100; // Offset for navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.updateActiveNavigation(sectionId);
            }
        });
    }

    setupScrollToTop() {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    toggleScrollToTopButton() {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        if (scrollToTopBtn) {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe all sections and cards
        const elementsToObserve = document.querySelectorAll('.section, .project-card, .education-card, .achievement-item');
        elementsToObserve.forEach(el => observer.observe(el));
    }

    setupSkillBars() {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBars();
                    skillObserver.disconnect(); // Only animate once
                }
            });
        });

        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            skillObserver.observe(skillsSection);
        }
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            setTimeout(() => {
                bar.style.width = `${progress}%`;
            }, Math.random() * 500); // Stagger the animations
        });
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the portfolio app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Additional utility functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Text copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu on escape
        const navbarMenu = document.getElementById('navbarMenu');
        if (navbarMenu.classList.contains('active')) {
            navbarMenu.classList.remove('active');
        }
    }
});

// Print functionality
function printResume() {
    window.print();
}

// Download resume functionality (placeholder)
function downloadResume() {
    // This would typically link to your actual resume PDF
    alert('Resume download would start here. Please add your actual resume PDF link.');
}

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    konamiCode = konamiCode.slice(-konamiSequence.length);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

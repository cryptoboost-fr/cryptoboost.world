// Enhanced Interactions and Animations for CryptoBoost
// This script provides advanced UI interactions and animations

class CryptoBoostEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupParticleEffects();
        this.setupEnhancedCards();
        this.setupFormEnhancements();
        this.setupFAQInteractions();
        this.setupCounterAnimations();
        this.setupNavigationEnhancements();
        this.setupPerformanceOptimizations();

        console.log('🚀 CryptoBoost Enhancer Initialized');
    }

    // Scroll-triggered animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.fade-in, .fade-in-delayed, .scroll-reveal, .scroll-reveal-left, .scroll-reveal-right').forEach(el => {
            observer.observe(el);
        });
    }

    // Particle effects for enhanced visual appeal
    setupParticleEffects() {
        // Create floating particles in hero section
        const heroSection = document.querySelector('section');
        if (heroSection) {
            for (let i = 0; i < 20; i++) {
                this.createParticle(heroSection);
            }
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle-enhanced';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${this.getRandomGradient()};
            border-radius: 50%;
            opacity: ${Math.random() * 0.6 + 0.2};
            pointer-events: none;
            animation: particleFloat ${Math.random() * 4 + 3}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;

        container.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 8000);
    }

    getRandomGradient() {
        const gradients = [
            'linear-gradient(45deg, #6366f1, #8b5cf6)',
            'linear-gradient(45deg, #10b981, #06b6d4)',
            'linear-gradient(45deg, #f59e0b, #ef4444)',
            'linear-gradient(45deg, #8b5cf6, #06b6d4)'
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
    }

    // Enhanced card interactions
    setupEnhancedCards() {
        document.querySelectorAll('.card-hover, .glass-card-hover').forEach(card => {
            card.addEventListener('mouseenter', this.handleCardEnter.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            card.addEventListener('mousemove', this.handleCardMove.bind(this));
        });
    }

    handleCardEnter(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(-8px) scale(1.02)';

        // Add subtle glow effect
        card.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
    }

    handleCardLeave(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '';
    }

    handleCardMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Subtle tilt effect
        const tiltX = (x - rect.width / 2) / 20;
        const tiltY = (y - rect.height / 2) / 20;

        card.style.transform = `translateY(-8px) scale(1.02) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
    }

    // Enhanced form interactions
    setupFormEnhancements() {
        document.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('focus', this.handleFieldFocus.bind(this));
            field.addEventListener('blur', this.handleFieldBlur.bind(this));
            field.addEventListener('input', this.handleFieldInput.bind(this));
        });

        // Enhanced button interactions
        document.querySelectorAll('.btn-enhanced, .btn-primary-enhanced').forEach(button => {
            button.addEventListener('mouseenter', this.handleButtonEnter.bind(this));
            button.addEventListener('mouseleave', this.handleButtonLeave.bind(this));
            button.addEventListener('click', this.handleButtonClick.bind(this));
        });
    }

    handleFieldFocus(e) {
        const field = e.target;
        const container = field.closest('.form-field') || field.parentElement;

        container.classList.add('focused');
        field.style.transform = 'translateY(-1px)';
        field.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
    }

    handleFieldBlur(e) {
        const field = e.target;
        const container = field.closest('.form-field') || field.parentElement;

        container.classList.remove('focused');
        field.style.transform = '';
        field.style.boxShadow = '';
    }

    handleFieldInput(e) {
        const field = e.target;
        if (field.value.length > 0) {
            field.classList.add('has-content');
        } else {
            field.classList.remove('has-content');
        }
    }

    handleButtonEnter(e) {
        const button = e.target;
        button.style.transform = 'translateY(-3px) scale(1.05)';
        button.style.filter = 'brightness(1.1)';
    }

    handleButtonLeave(e) {
        const button = e.target;
        button.style.transform = '';
        button.style.filter = '';
    }

    handleButtonClick(e) {
        const button = e.target;

        // Add click animation
        button.style.transform = 'translateY(-1px) scale(1.02)';

        // Add loading state for form submissions
        if (button.type === 'submit' || button.closest('form')) {
            this.showButtonLoading(button);
        }

        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    showButtonLoading(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<div class="spinner-enhanced"></div>Chargement...';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 3000);
    }

    // FAQ interactions
    setupFAQInteractions() {
        document.querySelectorAll('.faq-item').forEach(item => {
            const header = item.querySelector('.faq-header');
            if (header) {
                header.addEventListener('click', () => this.toggleFAQ(item));
            }
        });
    }

    toggleFAQ(item) {
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            icon.style.transform = 'rotate(0deg)';
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            icon.style.transform = 'rotate(180deg)';
        }
    }

    // Counter animations for stats
    setupCounterAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.counter').forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounters(container) {
        container.querySelectorAll('.counter-value').forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = parseInt(counter.dataset.duration) || 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current).toLocaleString();
            }, 16);
        });
    }

    // Navigation enhancements
    setupNavigationEnhancements() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Active navigation highlighting
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');

        function updateActiveNav() {
            const scrollY = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });

                    const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }

        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav();

        // Mobile menu enhancements
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                mobileMenu.classList.toggle('animate-fade-in');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                }
            });
        }
    }

    // Performance optimizations
    setupPerformanceOptimizations() {
        // Throttle scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    this.handleScrollOptimized();
                    scrollTimeout = null;
                }, 16);
            }
        });

        // Use passive listeners for better performance
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });

        // Optimize animations for reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        }
    }

    handleScrollOptimized() {
        // Optimized scroll handling
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;

        // Parallax effect for background elements
        document.querySelectorAll('.parallax-bg').forEach(el => {
            el.style.transform = `translateY(${rate}px)`;
        });
    }

    // Utility methods
    static addCSS(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    static addKeyframes(name, keyframes) {
        const css = `@keyframes ${name} { ${keyframes} }`;
        this.addCSS(css);
    }

    static createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        Object.keys(attributes).forEach(attr => {
            element.setAttribute(attr, attributes[attr]);
        });
        element.innerHTML = content;
        return element;
    }

    // Enhanced visual effects
    addVisualEffects() {
        // Add subtle background animation
        this.constructor.addCSS(`
            body {
                background: linear-gradient(-45deg, #0f172a, #1e293b, #0f172a, #1e293b);
                background-size: 400% 400%;
                animation: gradientShift 15s ease infinite;
            }

            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `);

        // Add particle styles
        this.constructor.addCSS(`
            .particle-enhanced {
                animation: particleFloat 4s ease-in-out infinite;
            }

            @keyframes particleFloat {
                0%, 100% {
                    transform: translateY(0px) translateX(0px) scale(1);
                    opacity: 0.6;
                }
                25% {
                    transform: translateY(-10px) translateX(5px) scale(1.1);
                    opacity: 1;
                }
                50% {
                    transform: translateY(-15px) translateX(-3px) scale(0.9);
                    opacity: 0.8;
                }
                75% {
                    transform: translateY(-8px) translateX(-5px) scale(1.05);
                    opacity: 0.9;
                }
            }

            .spinner-enhanced {
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-left-color: #6366f1;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                display: inline-block;
                margin-right: 8px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `);
    }
}

// Initialize the enhancer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const enhancer = new CryptoBoostEnhancer();
    enhancer.addVisualEffects();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoBoostEnhancer;
}

console.log('🎨 CryptoBoost Enhanced Interactions Loaded');

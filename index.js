// 0. Cinematic Intro Animation
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create the Elements
    const overlay = document.createElement('div');
    overlay.className = 'intro-overlay';

    const box = document.createElement('div');
    box.className = 'intro-box';

    const title = document.createElement('h1');
    title.className = 'intro-text';
    title.innerHTML = '<span>Ceylon<span class="font-light">Visor</span></span>';

    const line = document.createElement('div');
    line.className = 'intro-line';

    box.appendChild(title);
    box.appendChild(line);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Lock scroll during intro
    document.body.style.overflow = 'hidden';

    // 2. Trigger Animations
    requestAnimationFrame(() => {
        setTimeout(() => {
            // Start filling text and growing line
            title.classList.add('filled');
            line.classList.add('grow');
        }, 500);

        setTimeout(() => {
            // Slide the whole overlay up (Shutter effect)
            overlay.style.transform = 'translateY(-100%)';
            document.body.style.overflow = '';
        }, 3000);

        setTimeout(() => {
            // Cleanup from DOM
            overlay.remove();
        }, 4000);
    });
});

// 1. Hero Parallax Effect
const heroBg = document.querySelector('.hero-bg img');
if (heroBg) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        // Move background at 40% speed of scroll for depth
        heroBg.style.transform = `translateY(${scrollPosition * 0.4}px)`;
    });
}

// 2. 3D Tilt Effect for Cards
const cards = document.querySelectorAll('.card, .card-dark, .card-gold, .feature-item, .feature-item-brown');

cards.forEach(card => {
    // Setup transition properties
    card.style.transition = 'transform 0.1s ease';
    card.style.transformStyle = 'preserve-3d';

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation (Max 5 degrees)
        const xRotation = -((y - rect.height / 2) / (rect.height / 2)) * 5;
        const yRotation = ((x - rect.width / 2) / (rect.width / 2)) * 5;

        card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// 3. Staggered Text Reveal
const textWrappers = document.querySelectorAll('.text-wrapper');
const staggerObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            Array.from(entry.target.children).forEach((child, index) => {
                child.style.transitionDelay = `${index * 100}ms`;
                child.classList.add('active');
            });
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

textWrappers.forEach(wrapper => {
    // Disable parent slide animation to focus on text stagger
    wrapper.parentElement.classList.remove('reveal-slide-left', 'reveal-slide-right');

    Array.from(wrapper.children).forEach(child => {
        child.classList.add('reveal-fade-up');
    });
    staggerObserver.observe(wrapper);
});

// 4. Parallax Background Decorations
const decoElements = document.querySelectorAll('[class*="bg-deco-"]');
window.addEventListener('scroll', () => {
    decoElements.forEach(el => {
        const rect = el.parentElement.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.style.transform = `translateY(${(window.innerHeight - rect.top) * 0.15}px)`;
        }
    });
});

// 5. Sticky Phone Scroll Logic
const masterPhone = document.getElementById('master-phone');
const masterScreen = document.getElementById('master-phone-screen');
const sections = document.querySelectorAll('.features-sequence .section');

if (masterPhone && sections.length > 0) {
    const phoneObserverOptions = {
        root: null,
        threshold: 0.3 // Trigger when 30% of section is visible
    };

    const phoneObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                const position = section.getAttribute('data-pos');
                const image = section.getAttribute('data-img');
                const bgColor = section.getAttribute('data-bg');

                // Update Position
                const targetClass = `pos-${position}`;
                if (position && !masterPhone.classList.contains(targetClass)) {
                    masterPhone.classList.add('is-switching');
                    setTimeout(() => masterPhone.classList.remove('is-switching'), 1200);

                    masterPhone.classList.remove('pos-left', 'pos-right');
                    masterPhone.classList.add(targetClass);
                }

                // Update Image
                if (image && masterScreen.getAttribute('src') !== image) {
                    masterScreen.style.opacity = '0';
                    setTimeout(() => {
                        masterScreen.src = image;
                        masterScreen.style.opacity = '';
                    }, 600);
                }

                // Update Background Color
                if (bgColor) {
                    document.body.style.backgroundColor = bgColor;
                }
            }
        });
    }, phoneObserverOptions);

    sections.forEach(section => phoneObserver.observe(section));
}

// 6. Navigation Bar Scroll Effect
const header = document.querySelector('.site-header');
const heroSection = document.getElementById('hero');

if (header && heroSection) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// 7. Bottom Scroll Pulse Effect
const downloadBtn = document.querySelector('.btn-download');

if (downloadBtn) {
    window.addEventListener('scroll', () => {
        // Check if user is near the bottom of the page (within 100px)
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100) {
            downloadBtn.classList.add('pulse');
        } else {
            downloadBtn.classList.remove('pulse');
        }
    });
}

// 8. Hero Typewriter Effect
const heroSubtitle = document.querySelector('.hero-subtitle p');

if (heroSubtitle) {
    const text = heroSubtitle.textContent.trim();
    heroSubtitle.textContent = '';
    heroSubtitle.classList.add('typing-cursor');

    // Start typing after the fade-in animation (approx 1.2s)
    setTimeout(() => {
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                heroSubtitle.classList.remove('typing-cursor'); // Stop blinking when done
            }
        }, 30); // Typing speed (ms per character)
    }, 3000);
}

// 9. Contact Form Validation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Select inputs based on placeholder or structure
        const nameInput = contactForm.querySelector('input[placeholder="Name"]');
        const emailInput = contactForm.querySelector('input[placeholder="Email"]');
        const messageInput = contactForm.querySelector('textarea');

        // Helper functions
        const setError = (input, message) => {
            const group = input.parentElement;
            group.classList.add('error');

            let errorMsg = group.querySelector('.error-msg');
            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-msg';
                group.appendChild(errorMsg);
            }
            errorMsg.textContent = message;
        };

        const clearError = (input) => {
            const group = input.parentElement;
            group.classList.remove('error');
        };

        // Validate Name
        if (!nameInput.value.trim()) {
            setError(nameInput, 'Name is required');
            isValid = false;
        } else {
            clearError(nameInput);
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            setError(emailInput, 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            setError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(emailInput);
        }

        if (isValid) {
            // Simulate success
            const btn = contactForm.querySelector('.btn-submit');
            const originalText = btn.textContent;

            // Loading State
            btn.innerHTML = 'Opening... <span class="spinner"></span>';
            btn.style.opacity = '0.9';
            btn.style.pointerEvents = 'none';

            // Mailto Logic (Opens User's Email Client)
            setTimeout(() => {
                const subject = `Contact from CeylonVisor: ${nameInput.value}`;
                const body = `Name: ${nameInput.value}\nEmail: ${emailInput.value}\n\nMessage:\n${messageInput ? messageInput.value : ''}`;
                const mailtoLink = `mailto:ceylonvisor@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                window.location.href = mailtoLink;

                // Reset UI
                btn.textContent = originalText;
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
                contactForm.reset();
            }, 1000);
        }
    });
}

// 10. Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            if (!backToTopBtn.classList.contains('visible')) {
                backToTopBtn.classList.add('visible');
                backToTopBtn.classList.add('pulse');
            }
        } else {
            backToTopBtn.classList.remove('visible', 'pulse');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 11. Phone Fade Out Logic
const contactSection = document.getElementById('contact');
const stickyWrapper = document.querySelector('.sticky-phone-wrapper');

if (contactSection && stickyWrapper) {
    window.addEventListener('scroll', () => {
        const contactRect = contactSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Fade out as contact section enters viewport
        // Map range: contact top at bottom of screen (opacity 1) -> contact top at 40% of screen (opacity 0)
        const startFade = windowHeight;
        const endFade = windowHeight * 0.4;

        let opacity = (contactRect.top - endFade) / (startFade - endFade);
        opacity = Math.max(0, Math.min(1, opacity));

        stickyWrapper.style.opacity = opacity.toString();
    });
}

// 12. Mobile Menu Toggle
const menuToggle = document.querySelector('.mobile-menu-toggle');
const mainNav = document.querySelector('.main-nav');
if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
}
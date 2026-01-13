// ========================================
// MODERN HACKATHON WEBSITE - JAVASCRIPT
// ========================================

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initParticles();
    initScrollAnimations();
    initFAQ();
    initSmoothScroll();
    initHeaderScroll();
});

// --- NAVIGATION ---
function initNavigation() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// --- HEADER SCROLL EFFECT ---
function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// --- PARTICLE ANIMATION ---
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around screen
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles
    const particlesArray = [];
    const numberOfParticles = Math.min(100, Math.floor(canvas.width / 15));

    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }

    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        connectParticles();

        requestAnimationFrame(animateParticles);
    }

    // Connect nearby particles
    function connectParticles() {
        for (let i = 0; i < particlesArray.length; i++) {
            for (let j = i + 1; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.2;
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    animateParticles();

    // Mouse interaction
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;

        // Push particles away from mouse
        particlesArray.forEach(particle => {
            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                particle.x += Math.cos(angle) * force * 2;
                particle.y += Math.sin(angle) * force * 2;
            }
        });
    });
}

// --- SCROLL ANIMATIONS ---
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Add stagger effect for grid items
                if (entry.target.classList.contains('participant-grid') ||
                    entry.target.classList.contains('fields-grid')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.style.animation = `fadeInUp 0.6s ease-out forwards`;
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const elementsToAnimate = document.querySelectorAll(`
        .section-header,
        .about-content,
        .participant-grid,
        .fields-grid,
        .timeline,
        .split-section,
        .faq-container,
        .glass-card,
        .step-item
    `);

    elementsToAnimate.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// --- FAQ ACCORDION ---
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// --- SMOOTH SCROLL ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// --- BUTTON RIPPLE EFFECT ---
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// --- PARALLAX EFFECT REMOVED ---
// (Previously caused overlapping issues during scroll)

// --- CARD TILT EFFECT ---
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// --- COUNTER ANIMATION ---
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// --- CURSOR TRAIL EFFECT (Optional - can be enabled) ---
function initCursorTrail() {
    const coords = { x: 0, y: 0 };
    const circles = document.querySelectorAll('.cursor-circle');

    circles.forEach((circle, index) => {
        circle.x = 0;
        circle.y = 0;
    });

    window.addEventListener('mousemove', (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });

    function animateCircles() {
        let x = coords.x;
        let y = coords.y;

        circles.forEach((circle, index) => {
            circle.style.left = x - 12 + 'px';
            circle.style.top = y - 12 + 'px';
            circle.style.transform = `scale(${(circles.length - index) / circles.length})`;

            circle.x = x;
            circle.y = y;

            const nextCircle = circles[index + 1] || circles[0];
            x += (nextCircle.x - x) * 0.3;
            y += (nextCircle.y - y) * 0.3;
        });

        requestAnimationFrame(animateCircles);
    }

    animateCircles();
}

// --- TYPING EFFECT FOR HERO TITLE (Optional) ---
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// --- LOADING ANIMATION ---
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.hero-content > *').forEach((el, index) => {
            setTimeout(() => {
                el.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }, index * 100);
        });
    }, 100);
});

// --- PERFORMANCE OPTIMIZATION ---
// Debounce function for scroll events
function debounce(func, wait = 10) {
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

// Throttle function for resize events
function throttle(func, limit = 100) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// --- ACCESSIBILITY ENHANCEMENTS ---
// Add keyboard navigation for FAQ
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            question.click();
        }
    });
});

// Focus management for mobile menu
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

mobileToggle.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        mobileToggle.click();
    }
});

// --- CONSOLE EASTER EGG ---
console.log('%c🚀 INNOVATE.HACK', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cWelcome to the future of innovation!', 'font-size: 14px; color: #8b5cf6;');
console.log('%cInterested in the code? Check out our GitHub!', 'font-size: 12px; color: #64748b;');

// ========================================
// REGISTRATION MODAL FUNCTIONALITY
// ========================================

const registrationModal = document.getElementById('registration-modal');
const modalClose = document.getElementById('modal-close');
const registrationForm = document.getElementById('registration-form');
const formMessage = document.getElementById('form-message');

// Get all registration buttons
const registerButtons = document.querySelectorAll('.btn-primary');

// Open modal when any register button is clicked
registerButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Check if button text contains register-related keywords
        const buttonText = button.textContent.toLowerCase();
        if (buttonText.includes('register') || buttonText.includes('join')) {
            e.preventDefault();
            openRegistrationModal();
        }
    });
});

// Open modal function
function openRegistrationModal() {
    registrationModal.classList.add('active');
    document.body.classList.add('modal-open');
    // Reset form and messages
    registrationForm.reset();
    hideFormMessage();
    clearFormErrors();
    // Hide team name field by default
    document.getElementById('team-name-group').style.display = 'none';
}

// Close modal function
function closeRegistrationModal() {
    registrationModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

// Close modal on close button click
modalClose.addEventListener('click', closeRegistrationModal);

// Close modal on overlay click
registrationModal.addEventListener('click', (e) => {
    if (e.target === registrationModal) {
        closeRegistrationModal();
    }
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && registrationModal.classList.contains('active')) {
        closeRegistrationModal();
    }
});

// ========================================
// TEAM PREFERENCE TOGGLE
// ========================================

const teamPreferenceRadios = document.querySelectorAll('input[name="teamPreference"]');
const teamNameGroup = document.getElementById('team-name-group');
const teamNameInput = document.getElementById('teamName');

teamPreferenceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'team') {
            teamNameGroup.style.display = 'block';
            teamNameInput.setAttribute('required', 'required');
        } else {
            teamNameGroup.style.display = 'none';
            teamNameInput.removeAttribute('required');
            teamNameInput.value = '';
            clearFieldError(teamNameInput);
        }
    });
});

// ========================================
// FORM VALIDATION
// ========================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateAge(age) {
    const ageNum = parseInt(age);
    return ageNum >= 13 && ageNum <= 18;
}

function showFieldError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    const errorSpan = formGroup.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.textContent = message;
    }
}

function clearFieldError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    const errorSpan = formGroup.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.textContent = '';
    }
}

function clearFormErrors() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
    document.querySelectorAll('.error-message').forEach(span => {
        span.textContent = '';
    });
}

function showFormMessage(message, type = 'success') {
    formMessage.textContent = message;
    formMessage.className = `form-message show ${type}`;
}

function hideFormMessage() {
    formMessage.className = 'form-message';
}

// Real-time validation
document.getElementById('email').addEventListener('blur', function () {
    if (this.value && !validateEmail(this.value)) {
        showFieldError(this, 'Please enter a valid email address');
    } else {
        clearFieldError(this);
    }
});

document.getElementById('age').addEventListener('input', function () {
    if (this.value && !validateAge(this.value)) {
        showFieldError(this, 'Age must be between 13 and 18 years');
    } else {
        clearFieldError(this);
    }
});

// ========================================
// FORM SUBMISSION
// ========================================

registrationForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Clear previous errors and messages
    clearFormErrors();
    hideFormMessage();

    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: document.getElementById('age').value,
        school: document.getElementById('school').value.trim(),
        country: document.getElementById('country').value.trim(),
        teamPreference: document.querySelector('input[name="teamPreference"]:checked').value,
        teamName: document.getElementById('teamName').value.trim(),
        category: document.getElementById('category').value,
        comments: document.getElementById('comments').value.trim()
    };

    // Validation
    let isValid = true;

    if (!formData.fullName) {
        showFieldError(document.getElementById('fullName'), 'Please enter your full name');
        isValid = false;
    }

    if (!formData.email) {
        showFieldError(document.getElementById('email'), 'Please enter your email');
        isValid = false;
    } else if (!validateEmail(formData.email)) {
        showFieldError(document.getElementById('email'), 'Please enter a valid email address');
        isValid = false;
    }

    if (!formData.age) {
        showFieldError(document.getElementById('age'), 'Please enter your age');
        isValid = false;
    } else if (!validateAge(formData.age)) {
        showFieldError(document.getElementById('age'), 'Age must be between 13 and 18 years');
        isValid = false;
    }

    if (!formData.school) {
        showFieldError(document.getElementById('school'), 'Please enter your school name');
        isValid = false;
    }

    if (!formData.country) {
        showFieldError(document.getElementById('country'), 'Please enter your country');
        isValid = false;
    }

    if (formData.teamPreference === 'team' && !formData.teamName) {
        showFieldError(document.getElementById('teamName'), 'Please enter your team name');
        isValid = false;
    }

    if (!formData.category) {
        showFieldError(document.getElementById('category'), 'Please select a category');
        isValid = false;
    }

    if (!isValid) {
        showFormMessage('Please fix the errors above and try again.', 'error');
        return;
    }

    // Show loading state
    const submitButton = this.querySelector('.btn-submit');
    submitButton.classList.add('loading');
    submitButton.disabled = true;

    // Simulate API call (replace with actual API endpoint)
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Log form data (in production, send to server)
        console.log('Registration Data:', formData);

        // Show success message
        showFormMessage('🎉 Registration successful! Check your email for confirmation details.', 'success');

        // Reset form after 3 seconds and close modal
        setTimeout(() => {
            registrationForm.reset();
            hideFormMessage();
            closeRegistrationModal();
        }, 3000);

    } catch (error) {
        showFormMessage('❌ Something went wrong. Please try again later.', 'error');
    } finally {
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
    }
});

// ========================================
// VIDEO MODAL (PLACEHOLDER)
// ========================================

// Create video modal dynamically
const videoModalHTML = `
    <div class="modal-overlay" id="video-modal">
        <div class="modal-container video-modal-container">
            <button class="modal-close" id="video-modal-close" aria-label="Close video">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-header">
                <div class="modal-icon">
                    <i class="fas fa-play-circle"></i>
                </div>
                <h2>Hackathon Overview</h2>
                <p>Learn more about innovateKGL</p>
            </div>
            <div class="video-placeholder">
                <div class="video-placeholder-content">
                    <i class="fas fa-video" style="font-size: 4rem; color: var(--primary-500); margin-bottom: 1rem;"></i>
                    <h3>Video Coming Soon!</h3>
                    <p>We're creating an amazing video to showcase the hackathon experience.</p>
                    <p style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.875rem;">
                        For now, check out our <a href="#about" style="color: var(--primary-500); text-decoration: underline;">About section</a> to learn more.
                    </p>
                </div>
            </div>
        </div>
    </div>
`;

// Add video modal to body
document.body.insertAdjacentHTML('beforeend', videoModalHTML);

const videoModal = document.getElementById('video-modal');
const videoModalClose = document.getElementById('video-modal-close');
const watchVideoButtons = document.querySelectorAll('.btn-secondary');

// Open video modal
watchVideoButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const buttonText = button.textContent.toLowerCase();
        if (buttonText.includes('watch') || buttonText.includes('video')) {
            e.preventDefault();
            videoModal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    });
});

// Close video modal
videoModalClose.addEventListener('click', () => {
    videoModal.classList.remove('active');
    document.body.classList.remove('modal-open');
});

videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        videoModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
});

// Add video modal styles
const videoModalStyles = document.createElement('style');
videoModalStyles.textContent = `
    .video-modal-container {
        max-width: 900px;
    }
    
    .video-placeholder {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
        border-radius: var(--radius-lg);
        padding: 4rem 2rem;
        text-align: center;
        min-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .video-placeholder-content h3 {
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }
    
    .video-placeholder-content p {
        color: var(--text-secondary);
        font-size: 1.125rem;
    }
`;
document.head.appendChild(videoModalStyles);


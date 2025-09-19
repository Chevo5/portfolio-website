// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Navigation between sections
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
            
            // Update active nav link
            navLinks.forEach(nl => nl.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Portfolio item interactions
    setupPortfolioItems();
    
    // Contact form functionality
    setupContactForm();
    
    // Smooth scrolling for internal navigation
    setupSmoothScrolling();
});

// Section navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update URL hash without jumping
    history.pushState(null, null, `#${sectionId}`);
}

// Portfolio grid functionality
function setupPortfolioItems() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const liveUrl = item.dataset.live;
        const githubUrl = item.dataset.github;
        
        // Update overlay links with actual URLs
        const liveLink = item.querySelector('.portfolio-link.live');
        const githubLink = item.querySelector('.portfolio-link.github');
        
        if (liveLink && liveUrl) {
            liveLink.href = liveUrl;
            liveLink.target = '_blank';
            liveLink.rel = 'noopener noreferrer';
        }
        
        if (githubLink && githubUrl) {
            githubLink.href = githubUrl;
            githubLink.target = '_blank';
            githubLink.rel = 'noopener noreferrer';
        }
        
        // Add click handler for the entire item
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking on overlay links
            if (e.target.classList.contains('portfolio-link')) {
                return;
            }
            
            // If item has live URL, open it; otherwise open GitHub
            const urlToOpen = liveUrl || githubUrl;
            if (urlToOpen) {
                window.open(urlToOpen, '_blank', 'noopener,noreferrer');
            }
        });
        
        // Add keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const urlToOpen = liveUrl || githubUrl;
                if (urlToOpen) {
                    window.open(urlToOpen, '_blank', 'noopener,noreferrer');
                }
            }
        });
    });
}

// Contact form handling
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = this.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // Reset form
            this.reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Show success message
            showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // In a real implementation, you would send the data to your server
            console.log('Form submitted:', { name, email, message });
        }, 1500);
    });
}

// Form message display
function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Add styles
    messageDiv.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 6px;
        font-weight: 500;
        ${type === 'success' 
            ? 'background: #166534; color: #BBF7D0; border: 1px solid #22C55E;' 
            : 'background: #7F1D1D; color: #FECACA; border: 1px solid #EF4444;'
        }
    `;
    
    // Insert message
    const contactForm = document.getElementById('contactForm');
    contactForm.insertBefore(messageDiv, contactForm.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Smooth scrolling setup
function setupSmoothScrolling() {
    // Handle initial page load with hash
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            showSection(sectionId);
            
            // Update active nav link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        if (window.location.hash) {
            const sectionId = window.location.hash.substring(1);
            showSection(sectionId);
        } else {
            showSection('home');
        }
    });
}

// Intersection Observer for scroll animations (optional enhancement)
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure CSS is loaded
    setTimeout(setupScrollAnimations, 100);
});

// Utility function for debouncing
function debounce(func, wait) {
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

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
}, 250));
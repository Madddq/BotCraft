// Reviews data - will be stored in localStorage
let reviews = [];

// DOM Elements
const reviewFab = document.getElementById('reviewFab');
const reviewModal = document.getElementById('reviewModal');
const closeModal = document.querySelector('.close-modal');
const reviewForm = document.getElementById('reviewForm');
const sortSelect = document.getElementById('sortReviews');
const testimonialsContainer = document.getElementById('testimonialsContainer');

// Star rating functionality
function setupStarRating() {
    const stars = document.querySelectorAll('.rating-input i');
    const ratingInput = document.getElementById('ratingValue');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = rating;
            
            // Update star display
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
    });
}

// Load reviews from localStorage
function loadReviews() {
    const savedReviews = localStorage.getItem('santoBarReviews');
    if (savedReviews) {
        reviews = JSON.parse(savedReviews);
    } else {
        // Add initial review if no reviews exist
        reviews = [{
            id: Date.now(),
            name: 'Agustín Riffo',
            rating: 5,
            text: '10/10, experiencia inolvidable, las mejores pizzas y tragos de Arauco',
            date: new Date().toISOString()
        }];
        saveReviews();
    }
    renderReviews();
}

// Save reviews to localStorage
function saveReviews() {
    localStorage.setItem('santoBarReviews', JSON.stringify(reviews));
}

// Render reviews to the page
function renderReviews() {
    // Clear current reviews
    testimonialsContainer.innerHTML = '';
    
    // Sort reviews based on selected option
    const sortedReviews = [...reviews];
    const sortBy = sortSelect.value;
    
    switch(sortBy) {
        case 'newest':
            sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'highest':
            sortedReviews.sort((a, b) => b.rating - a.rating);
            break;
        case 'lowest':
            sortedReviews.sort((a, b) => a.rating - b.rating);
            break;
    }
    
    // Create and append review cards
    sortedReviews.forEach((review, index) => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'testimonial-card';
        reviewCard.style.animationDelay = `${index * 0.1}s`;
        
        // Create stars
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += i < review.rating 
                ? '<i class="fas fa-star"></i>'
                : '<i class="far fa-star"></i>';
        }
        
        reviewCard.innerHTML = `
            <div class="testimonial-content">
                <div class="rating">
                    ${stars}
                </div>
                <p class="testimonial-text">${review.text}</p>
                <div class="testimonial-author">
                    <h4>${review.name}</h4>
                    <span class="review-date">${new Date(review.date).toLocaleDateString('es-CL')}</span>
                </div>
            </div>
        `;
        
        testimonialsContainer.appendChild(reviewCard);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    loadReviews();
    setupStarRating();
    
    // Modal functionality
    reviewFab.addEventListener('click', () => {
        reviewModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    closeModal.addEventListener('click', () => {
        reviewModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === reviewModal) {
            reviewModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Handle form submission
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('reviewerName').value;
        const rating = parseInt(document.getElementById('ratingValue').value);
        const text = document.getElementById('reviewText').value;
        
        if (name && rating > 0 && text) {
            // Add new review
            const newReview = {
                id: Date.now(),
                name,
                rating,
                text,
                date: new Date().toISOString()
            };
            
            reviews.unshift(newReview);
            saveReviews();
            renderReviews();
            
            // Reset form
            reviewForm.reset();
            document.querySelectorAll('.rating-input i').forEach(star => {
                star.classList.remove('fas');
                star.classList.add('far');
            });
            document.getElementById('ratingValue').value = '0';
            
            // Close modal
            reviewModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Show success message
            alert('¡Gracias por tu reseña!');
        } else {
            alert('Por favor completa todos los campos y selecciona una calificación.');
        }
    });
    
    // Handle sort change
    sortSelect.addEventListener('change', renderReviews);
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-times');
            this.querySelector('i').classList.toggle('fa-bars');
        });
    }
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // Height of fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Sticky header on scroll
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });
    
    // Add active class to current section in navigation
    const sections = document.querySelectorAll('section');
    
    function highlightNavigation() {
        let scrollPosition = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector(`.main-nav a[href*=${sectionId}]`).classList.add('active');
            } else {
                const navLink = document.querySelector(`.main-nav a[href*=${sectionId}]`);
                if (navLink) navLink.classList.remove('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // Initialize AOS (Animate on Scroll) if needed
    // Note: You'll need to include AOS library in your HTML
    // if (typeof AOS !== 'undefined') {
    //     AOS.init({
    //         duration: 800,
    //         once: true
    //     });
    // }
});

// Form submission handling
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Here you would typically send the form data to a server
        console.log('Form submitted:', formObject);
        
        // Show success message
        const formMessage = document.createElement('div');
        formMessage.className = 'form-message success';
        formMessage.textContent = '¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.';
        
        const formContainer = document.querySelector('.contact-form-container');
        if (formContainer) {
            formContainer.insertBefore(formMessage, contactForm);
            contactForm.reset();
            
            // Remove message after 5 seconds
            setTimeout(() => {
                formMessage.remove();
            }, 5000);
        }
    });
}

// Lazy loading for images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

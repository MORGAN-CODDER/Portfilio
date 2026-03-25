// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Portfolio Filtering (Dynamic)
    function setupPortfolioTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const portfolioGrid = document.getElementById('dynamic-portfolio-grid');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filter = this.getAttribute('data-tab');
                filterPortfolio(filter);
            });
        });
    }

    function filterPortfolio(filter) {
        const portfolioItems = document.querySelectorAll('#dynamic-portfolio-grid .portfolio-item');
        
        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || filter === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    // Star Rating for Reviews
    const stars = document.querySelectorAll('.star-rating i');
    const ratingValue = document.getElementById('rating-value');

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            ratingValue.value = rating;

            stars.forEach(s => {
                const sRating = parseInt(s.getAttribute('data-rating'));
                if (sRating <= rating) {
                    s.classList.remove('fa-regular');
                    s.classList.add('fa-solid');
                    s.classList.add('active');
                } else {
                    s.classList.remove('fa-solid');
                    s.classList.add('fa-regular');
                    s.classList.remove('active');
                }
            });
        });

        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            
            stars.forEach(s => {
                const sRating = parseInt(s.getAttribute('data-rating'));
                if (sRating <= rating) {
                    s.classList.add('hover');
                }
            });
        });

        star.addEventListener('mouseout', function() {
            stars.forEach(s => {
                s.classList.remove('hover');
            });
        });
    });

    // Booking Form Submission
    const bookingForm = document.getElementById('booking-form');
    const successModal = document.getElementById('success-modal');
    const modalMessage = document.getElementById('modal-message');

    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            serviceType: document.getElementById('service-type').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            address: document.getElementById('address').value,
            description: document.getElementById('description').value
        };

        // Validate form
        if (!validateBookingForm(formData)) {
            return;
        }

        // Show success message
        modalMessage.textContent = `Thank you, ${formData.name}! Your appointment for ${formData.serviceType} has been booked successfully. We will contact you at ${formData.phone} to confirm.`;
        successModal.classList.add('show');

        // Reset form
        bookingForm.reset();

        // Store booking in localStorage (demo purposes)
        saveBooking(formData);
    });

    // Review Form Submission
    const reviewForm = document.getElementById('review-form');
    
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('reviewer-name').value;
        const type = document.getElementById('reviewer-type').value;
        const rating = parseInt(document.getElementById('rating-value').value);
        const text = document.getElementById('review-text').value;

        // Create review object
        const review = {
            name: name,
            type: type,
            rating: rating,
            text: text,
            date: new Date().toLocaleDateString()
        };

        // Add review to the page
        addReviewToPage(review);

        // Show success
        modalMessage.textContent = 'Thank you for your review! It has been added to our page.';
        successModal.classList.add('show');

        // Reset form
        reviewForm.reset();
        
        // Reset stars
        stars.forEach(s => {
            s.classList.remove('fa-solid', 'active');
            s.classList.add('fa-regular');
        });
        ratingValue.value = 5;

        // Save review in localStorage
        saveReview(review);
    });

    // Set minimum date for booking (today)
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        }
    });

    // Load dynamic portfolio
    loadPortfolio();
    setupPortfolioTabs();

    // Load saved data (demo purposes)
    loadSavedData();
});

// Functions
function validateBookingForm(data) {
    if (!data.name || !data.email || !data.phone || !data.serviceType || 
        !data.date || !data.time || !data.address || !data.description) {
        alert('Please fill in all required fields.');
        return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    // Validate phone format (basic)
    const phoneRegex = /^[\d\s\-()]+$/;
    if (!phoneRegex.test(data.phone) || data.phone.replace(/\D/g, '').length < 10) {
        alert('Please enter a valid phone number.');
        return false;
    }

    return true;
}

function addReviewToPage(review) {
    const reviewsContainer = document.getElementById('reviews-container');
    
    // Get initials
    const initials = review.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    // Generate stars HTML
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= review.rating) {
            starsHtml += '<i class="fa-solid fa-star"></i>';
        } else {
            starsHtml += '<i class="fa-regular fa-star"></i>';
        }
    }

    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    reviewCard.innerHTML = `
        <div class="review-stars">
            ${starsHtml}
        </div>
        <p class="review-text">"${review.text}"</p>
        <div class="review-author">
            <div class="author-avatar">${initials}</div>
            <div class="author-info">
                <h4>${review.name}</h4>
                <span>${review.type}</span>
            </div>
        </div>
    `;

    // Add animation
    reviewCard.style.animation = 'fadeInUp 0.5s ease';
    reviewsContainer.appendChild(reviewCard);
}

function closeModal() {
    const successModal = document.getElementById('success-modal');
    successModal.classList.remove('show');
}

// Close modal when clicking outside
document.getElementById('success-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Local Storage Functions
function saveBooking(booking) {
    let bookings = JSON.parse(localStorage.getItem('plumberBookings') || '[]');
    bookings.push({...booking, createdAt: new Date().toISOString()});
    localStorage.setItem('plumberBookings', JSON.stringify(bookings));
}

function saveReview(review) {
    let reviews = JSON.parse(localStorage.getItem('plumberReviews') || '[]');
    reviews.push(review);
    localStorage.setItem('plumberReviews', JSON.stringify(reviews));
}

function loadSavedData() {
    // Load reviews (in a real app, these would be from a database)
    const savedReviews = JSON.parse(localStorage.getItem('plumberReviews') || '[]');
    // Reviews are already displayed statically in HTML for demo
    
    // Check for any bookings (demo)
    const bookings = JSON.parse(localStorage.getItem('plumberBookings') || '[]');
    if (bookings.length > 0) {
        console.log('Previous bookings found:', bookings.length);
    }
}

function loadPortfolio() {
    const portfolioData = JSON.parse(localStorage.getItem('plumberPortfolio') || '[]');
    const portfolioGrid = document.getElementById('dynamic-portfolio-grid');
    
    if (portfolioData.length === 0) {
        portfolioGrid.innerHTML = `
            <div class="empty-state portfolio-empty">
                <i class="fa-solid fa-images" style="font-size: 4rem; color: var(--gray); margin-bottom: 20px;"></i>
                <h3 style="color: var(--dark-color);">No Work Samples Yet</h3>
                <p style="color: var(--gray);">Upload your first photo or video from the <a href="login.html" class="admin-link" style="color: var(--primary-color); font-weight: 600;">Admin Panel</a></p>
            </div>
        `;
        return;
    }
    
    // Reverse to show newest first
    const sortedPortfolio = portfolioData.slice().reverse();
    
    portfolioGrid.innerHTML = sortedPortfolio.map(post => {
        let mediaHtml;
        if (post.isEmbed && post.embedHtml) {
            mediaHtml = post.embedHtml;
        } else if (post.type === 'videos') {
            const vidAlt = post.title ? \`${post.title} - Plumbing Service Video by Apex Wrench Solutions\${post.description ? ' - ' + post.description.substring(0,50) : ''}\` : 'Plumbing Service Video';
            mediaHtml = \`<video controls poster="\${post.poster || ''}" aria-label="\${vidAlt}" preload="metadata">
                <source src="\${post.url}" type="video/mp4">
                Your browser does not support video playback.
              </video>\`;
        } else {
        const imgAlt = post.title ? \`${post.title} - Apex Wrench Solutions Plumbing Portfolio\${post.description ? ' - ' + post.description.substring(0,50) : ''}\` : 'Apex Wrench Solutions Plumbing Work Example';
        mediaHtml = `<img src="${post.url}" alt="\${imgAlt}" loading="lazy" width="400" height="300">`;
        }
        
        return `
            <div class="portfolio-item" data-category="${post.type}">
                ${mediaHtml}
                <div class="portfolio-overlay">
                    <h4>${post.title || 'Untitled'}</h4>
                    <p>${post.description || ''}</p>
                </div>
            </div>
        `;
    }).join('');
    
    // Trigger reveal animation
    setTimeout(() => reveal(), 100);
}

// Animation on scroll
function reveal() {
    const reveals = document.querySelectorAll('.service-card, .portfolio-item, .review-card');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

window.addEventListener('scroll', reveal);

// Initial call
reveal();

// Embed Link

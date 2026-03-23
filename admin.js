// Admin Portal JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin
    loadDashboard();
    loadPortfolio();
    loadBookings();
    loadReviews();
    
    // Navigation
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Portfolio filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterPortfolio(this.getAttribute('data-filter'));
        });
    });

// Upload form
    const uploadForm = document.getElementById('upload-form');
    const mediaType = document.getElementById('media-type');
    const videoPosterGroup = document.getElementById('video-poster-group');
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    
    mediaType.addEventListener('change', function() {
        if (this.value === 'videos') {
            videoPosterGroup.style.display = 'block';
        } else {
            videoPosterGroup.style.display = 'none';
        }
    });

    // Drag and drop handlers
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleFile(this.files[0]);
        }
    });

    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        uploadMedia();
    });
});

// Show section
function showSection(sectionId) {
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// Dashboard
function loadDashboard() {
    const portfolio = getPortfolio();
    const bookings = getBookings();
    const reviews = getReviews();
    
    document.getElementById('total-portfolio').textContent = portfolio.length;
    document.getElementById('total-bookings').textContent = bookings.length;
    document.getElementById('total-reviews').textContent = reviews.length;
    
    const videos = portfolio.filter(item => item.type === 'videos');
    document.getElementById('total-videos').textContent = videos.length;
}

// Portfolio Management
function getPortfolio() {
    return JSON.parse(localStorage.getItem('plumberPortfolio') || '[]');
}

function savePortfolio(portfolio) {
    localStorage.setItem('plumberPortfolio', JSON.stringify(portfolio));
}

function loadPortfolio() {
    const portfolio = getPortfolio();
    const grid = document.getElementById('portfolio-grid');
    
    if (portfolio.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-images"></i>
                <h3>No portfolio items yet</h3>
                <p>Upload your first photo or video in the Upload section</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = portfolio.map((item, index) => `
        <div class="portfolio-item" data-type="${item.type}" data-index="${index}">
            ${item.type === 'videos' 
                ? `<video controls poster="${item.poster || ''}">
                    <source src="${item.url}" type="video/mp4">
                   </video>`
                : `<img src="${item.url}" alt="${item.title}">`
            }
            <div class="portfolio-item-actions">
                <button class="action-btn delete" onclick="deletePortfolioItem(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            <div class="portfolio-item-content">
                <h4>${item.title}</h4>
                <p>${item.description || 'No description'}</p>
                <span class="portfolio-item-type">${item.type}</span>
            </div>
        </div>
    `).join('');
}

function filterPortfolio(filter) {
    const items = document.querySelectorAll('.portfolio-item');
    items.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-type') === filter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function deletePortfolioItem(index) {
    if (confirm('Are you sure you want to delete this item?')) {
        let portfolio = getPortfolio();
        portfolio.splice(index, 1);
        savePortfolio(portfolio);
        loadPortfolio();
        loadDashboard();
    }
}

// Upload Media
function uploadMedia() {
    const type = document.getElementById('media-type').value;
    const title = document.getElementById('media-title').value;
    const description = document.getElementById('media-desc').value;
    const url = document.getElementById('media-url').value;
    const poster = document.getElementById('media-poster').value;
    
    if (!url) {
        alert('Please upload an image or video first!');
        return;
    }
    
    const portfolio = getPortfolio();
    portfolio.unshift({
        type: type,
        title: title,
        description: description,
        url: url,
        poster: poster,
        addedAt: new Date().toISOString()
    });
    
    savePortfolio(portfolio);
    
    // Reset form and preview
    document.getElementById('upload-form').reset();
    document.getElementById('video-poster-group').style.display = 'none';
    document.getElementById('upload-area').style.display = 'block';
    document.getElementById('preview-area').style.display = 'none';
    document.getElementById('image-preview').src = '';
    document.getElementById('video-preview').src = '';
    
    alert('Media uploaded successfully! The item is now visible on the website.');
    
    // Refresh
    loadPortfolio();
    loadDashboard();
}

// Bookings Management
function getBookings() {
    return JSON.parse(localStorage.getItem('plumberBookings') || '[]');
}

function saveBookings(bookings) {
    localStorage.setItem('plumberBookings', JSON.stringify(bookings));
}

function loadBookings() {
    const bookings = getBookings();
    const list = document.getElementById('bookings-list');
    document.getElementById('booking-count').textContent = `${bookings.length} bookings`;
    
    if (bookings.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-calendar-xmark"></i>
                <h3>No bookings yet</h3>
                <p>Client bookings will appear here</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = bookings.map((booking, index) => `
        <div class="booking-card">
            <div class="booking-info">
                <h3>${booking.name}</h3>
                <p><i class="fa-solid fa-envelope"></i> ${booking.email}</p>
                <p><i class="fa-solid fa-phone"></i> ${booking.phone}</p>
                <p><i class="fa-solid fa-wrench"></i> ${booking.serviceType}</p>
                <p><i class="fa-solid fa-calendar"></i> ${booking.date} - ${booking.time}</p>
                <p><i class="fa-solid fa-location-dot"></i> ${booking.address}</p>
                <p><i class="fa-solid fa-comment"></i> ${booking.description}</p>
            </div>
            <div>
                <span class="booking-status ${booking.status || 'pending'}">${booking.status || 'Pending'}</span>
                <div class="booking-actions">
                    <button class="btn-sm btn-confirm" onclick="updateBookingStatus(${index}, 'confirmed')">Confirm</button>
                    <button class="btn-sm btn-complete" onclick="updateBookingStatus(${index}, 'completed')">Complete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateBookingStatus(index, status) {
    let bookings = getBookings();
    bookings[index].status = status;
    saveBookings(bookings);
    loadBookings();
}

// Reviews Management
function getReviews() {
    return JSON.parse(localStorage.getItem('plumberReviews') || '[]');
}

function loadReviews() {
    const reviews = getReviews();
    const list = document.getElementById('reviews-list');
    
    if (reviews.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-star"></i>
                <h3>No reviews yet</h3>
                <p>Customer reviews will appear here</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = reviews.map(review => {
        const initials = review.name.split(' ').map(n => n[0]).join('').toUpperCase();
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= review.rating ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
        }
        
        return `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-author">
                        <div class="author-avatar">${initials}</div>
                        <div class="author-details">
                            <h4>${review.name}</h4>
                            <span>${review.type}</span>
                        </div>
                    </div>
                    <div class="review-stars">${stars}</div>
                </div>
                <p class="review-text">"${review.text}"</p>
                <span class="review-date">${review.date || 'Recently'}</span>
            </div>
        `;
    }).join('');
}

// Make functions globally available
window.deletePortfolioItem = deletePortfolioItem;
window.updateBookingStatus = updateBookingStatus;
window.removeFile = removeFile;

// Handle file selection
function handleFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
    
    if (!validTypes.includes(file.type)) {
        alert('Invalid file type. Please upload an image or video file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;
        
        document.getElementById('media-url').value = dataUrl;
        document.getElementById('upload-area').style.display = 'none';
        document.getElementById('preview-area').style.display = 'block';
        
        const imagePreview = document.getElementById('image-preview');
        const videoPreview = document.getElementById('video-preview');
        
        if (file.type.startsWith('image/')) {
            imagePreview.src = dataUrl;
            imagePreview.style.display = 'block';
            videoPreview.style.display = 'none';
            document.getElementById('media-type').value = 'photos';
        } else {
            videoPreview.src = dataUrl;
            videoPreview.style.display = 'block';
            imagePreview.style.display = 'none';
            document.getElementById('media-type').value = 'videos';
            document.getElementById('video-poster-group').style.display = 'block';
        }
    };
    reader.readAsDataURL(file);
}

// Remove selected file
function removeFile() {
    document.getElementById('media-url').value = '';
    document.getElementById('file-input').value = '';
    document.getElementById('upload-area').style.display = 'block';
    document.getElementById('preview-area').style.display = 'none';
    document.getElementById('image-preview').src = '';
    document.getElementById('video-preview').src = '';
}

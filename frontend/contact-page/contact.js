// Contact form handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Here you would typically send this data to your backend
    // For now, we'll just show a success message
    showNotification('Message sent successfully! We will get back to you soon.', 'success');
    
    // Reset form
    contactForm.reset();
});

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger reflow
    notification.offsetHeight;
    
    // Show notification
    notification.classList.add('show');
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Star Rating Functionality
const ratingStars = document.querySelectorAll('.rating-stars i');
let selectedRating = 0;

ratingStars.forEach(star => {
    star.addEventListener('mouseover', function() {
        const rating = this.dataset.rating;
        highlightStars(rating);
    });

    star.addEventListener('mouseout', function() {
        highlightStars(selectedRating);
    });

    star.addEventListener('click', function() {
        selectedRating = this.dataset.rating;
        highlightStars(selectedRating);
        updateStarIcons();
    });
});

function highlightStars(rating) {
    ratingStars.forEach(star => {
        const starRating = star.dataset.rating;
        if (starRating <= rating) {
            star.classList.remove('ri-star-line');
            star.classList.add('ri-star-fill');
        } else {
            star.classList.remove('ri-star-fill');
            star.classList.add('ri-star-line');
        }
    });
}

function updateStarIcons() {
    ratingStars.forEach(star => {
        const starRating = star.dataset.rating;
        if (starRating <= selectedRating) {
            star.classList.remove('ri-star-line');
            star.classList.add('ri-star-fill');
            star.style.color = '#ffd700';
        } else {
            star.classList.remove('ri-star-fill');
            star.classList.add('ri-star-line');
            star.style.color = '#ddd';
        }
    });
}

// Feedback Form Submission
const feedbackForm = document.getElementById('feedbackForm');

feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const orderNumber = document.getElementById('orderNumber').value;
    const feedback = document.getElementById('feedback').value;
    
    if (!selectedRating) {
        showNotification('Please select a rating', 'error');
        return;
    }
    
    // Here you would typically send the feedback to your backend
    // For now, we'll just show a success message
    showNotification('Thank you for your feedback!', 'success');
    
    // Reset form
    feedbackForm.reset();
    selectedRating = 0;
    updateStarIcons();
});

// Initialize star icons
updateStarIcons(); 
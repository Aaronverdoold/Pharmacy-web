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
    // For now, we'll just show a success message cause db doesnt work for me
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
const purchaseList = document.querySelector('.purchase-list');

// Function to get product image based on keywords
function getProductImage(feedback) {
    const feedbackLower = feedback.toLowerCase();
    if (feedbackLower.includes('paracetamol') || feedbackLower.includes('pain') || feedbackLower.includes('headache')) {
        return '../../images/Paracetamol.webp';
    } else if (feedbackLower.includes('vitamin') || feedbackLower.includes('vitamine') || feedbackLower.includes('immune')) {
        return '../../images/Vitamin.webp';
    } else if (feedbackLower.includes('ibuprofen') || feedbackLower.includes('inflammation')) {
        return '../../images/Ibuprofen.jpg';
    } else if (feedbackLower.includes('aspirin') || feedbackLower.includes('heart')) {
        return '../../images/Aspirin.png';
    } else if (feedbackLower.includes('nurofen') || feedbackLower.includes('fever')) {
        return '../../images/Nurofen.jpeg';
    } else if (feedbackLower.includes('bepanthen') || feedbackLower.includes('skin')) {
        return '../../images/Bepanthen.jpg';
    } else if (feedbackLower.includes('menosol') || feedbackLower.includes('menopause')) {
        return '../../images/MenosolPro.jpg';
    } else if (feedbackLower.includes('voltaren') || feedbackLower.includes('joint')) {
        return '../../images/VoltarenK.png';
    } else {
        // Default image if no keyword matches
        return '../../images/pillen.jpg';
    }
}

feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const orderNumber = document.getElementById('orderNumber').value;
    const feedback = document.getElementById('feedback').value;
    
    if (!selectedRating) {
        showNotification('Please select a rating', 'error');
        return;
    }
    
    // Get appropriate product image based on feedback keywords
    const productImage = getProductImage(feedback);
    
    // Create new purchase item
    const newPurchase = document.createElement('div');
    newPurchase.className = 'purchase-item';
    newPurchase.innerHTML = `
        <div class="purchase-header">
            <span class="purchase-date">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span class="purchase-status">Delivered</span>
            <button class="delete-purchase"><i class="ri-close-line"></i></button>
        </div>
        <div class="purchase-details">
            <img src="${productImage}" alt="Product" class="product-image">
            <div class="product-info">
                <h4>Order #${orderNumber}</h4>
                <p class="product-description">${feedback}</p>
                <div class="product-meta">
                    <span class="rating">Rating: ${selectedRating}/5</span>
                </div>
            </div>
        </div>
        <div class="feedback-response">
            <p class="response-text">Thank you for your feedback! We appreciate your input and will use it to improve our services.</p>
        </div>
    `;

    // Add delete button functionality
    const deleteButton = newPurchase.querySelector('.delete-purchase');
    deleteButton.addEventListener('click', function() {
        newPurchase.remove();
        showNotification('Purchase removed successfully', 'success');
    });

    // Add the new purchase to the top of the list
    purchaseList.insertBefore(newPurchase, purchaseList.firstChild);
    
    // Reset form
    feedbackForm.reset();
    selectedRating = 0;
    updateStarIcons();
    
    showNotification('Thank you for your feedback!', 'success');
});

// Initialize star icons
updateStarIcons(); 
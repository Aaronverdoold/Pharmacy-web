// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Handle menu navigation and smooth scrolling
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active menu item
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Smooth scroll to selected section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            // TODO: Implement search functionality not implemented yet
            console.log('Searching for:', searchTerm);
        }
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim();
            if (searchTerm) {
                // TODO: Implement search functionality not implemented yet
                console.log('Searching for:', searchTerm);
            }
        }
    });

    // Notification system. this thing can be removed.
    const notificationBell = document.querySelector('.notifications');
    notificationBell.addEventListener('click', function() {
        console.log('Notifications clicked');
    });

    // Load user data
    loadUserData();

    // Initialize profile picture change functionality
    const changePictureBtn = document.querySelector('.change-picture-btn');
    const profileImageInput = document.getElementById('profileImageInput');
    const profilePicture = document.getElementById('profilePicture');
    const topProfileImg = document.querySelector('.profile-img');

    if (changePictureBtn && profileImageInput && profilePicture && topProfileImg) {
        changePictureBtn.addEventListener('click', function() {
            profileImageInput.click();
        });

        profileImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePicture.src = e.target.result;
                    topProfileImg.src = e.target.result;
                    
                    // Add notification for profile picture change
                    addProfilePictureNotification();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Initialize notification functionality
    initializeNotifications();
});

let ordersChart = null;

// Create and configure dashboard charts
function initializeCharts() {
    // Orders Chart
    const ordersCtx = document.getElementById('ordersChart').getContext('2d');
    ordersChart = new Chart(ordersCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Orders',
                data: [45, 60, 55, 70],
                borderColor: '#056439',
                backgroundColor: 'rgba(5, 100, 57, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Patient growth chart
    const patientCtx = document.getElementById('patientChart').getContext('2d');
    new Chart(patientCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'New Patients',
                data: [65, 59, 80, 81, 56, 85],
                backgroundColor: '#056439',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Initialize chart period change functionality
    const chartPeriod = document.querySelector('.chart-period');
    if (chartPeriod) {
        chartPeriod.addEventListener('change', function() {
            updateOrdersChart(this.value);
        });
    }

    // Prescriptions Chart
    const prescriptionsCtx = document.getElementById('prescriptionsChart').getContext('2d');
    const prescriptionsChart = new Chart(prescriptionsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Antibiotics', 'Painkillers', 'Vitamins', 'Others'],
            datasets: [{
                data: [30, 25, 20, 25],
                backgroundColor: [
                    '#056439',
                    '#0d8a5c',
                    '#15b07f',
                    '#1ed6a2'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateOrdersChart(period) {
    if (!ordersChart) return;

    // Define different data sets for different periods
    const dataSets = {
        'week': {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [12, 19, 15, 25, 22, 30, 18]
        },
        'month': {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [45, 60, 55, 70]
        },
        'year': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [150, 180, 200, 220, 250, 280, 300, 320, 350, 380, 400, 420]
        }
    };

    // Get the selected data set
    const selectedData = dataSets[period] || dataSets['month'];

    // Update the chart data
    ordersChart.data.labels = selectedData.labels;
    ordersChart.data.datasets[0].data = selectedData.data;
    ordersChart.update();
}

function loadUserData() {
    // Mock data for demonstration
    const mockOrders = [
        {
            date: '2024-04-08',
            status: 'Delivered',
            items: 3,
            total: '€45.99'
        },
        {
            date: '2024-04-05',
            status: 'Processing',
            items: 2,
            total: '€32.50'
        }
    ];

    const mockPrescriptions = [
        {
            name: 'Paracetamol',
            validUntil: '2024-05-08',
            status: 'Active'
        },
        {
            name: 'Ibuprofen',
            validUntil: '2024-05-12',
            status: 'Active'
        }
    ];

    // Update orders list
    const ordersList = document.querySelector('.orders-list');
    ordersList.innerHTML = mockOrders.map(order => `
        <div class="order-item">
            <div class="order-info">
                <span class="order-date">${order.date}</span>
                <span class="order-status">${order.status}</span>
            </div>
            <div class="order-details">
                <span class="order-items">${order.items} items</span>
                <span class="order-total">${order.total}</span>
            </div>
        </div>
    `).join('');

    // Update prescriptions list
    const prescriptionsList = document.querySelector('.prescriptions-list');
    prescriptionsList.innerHTML = mockPrescriptions.map(prescription => `
        <div class="prescription-item">
            <div class="prescription-info">
                <span class="prescription-name">${prescription.name}</span>
                <span class="prescription-date">Valid until: ${prescription.validUntil}</span>
            </div>
            <span class="prescription-status">${prescription.status}</span>
        </div>
    `).join('');
}

// Notification functionality
function initializeNotifications() {
    const notifications = document.querySelector('.notifications');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    const clearAllBtn = document.querySelector('.clear-all');
    
    if (notifications && notificationDropdown) {
        // Toggle dropdown on bell click
        notifications.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationDropdown.style.display = 
                notificationDropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!notifications.contains(e.target)) {
                notificationDropdown.style.display = 'none';
            }
        });

        // Handle clear all button
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                clearAllNotifications();
            });
        }
    }
}

function addProfilePictureNotification() {
    const notificationList = document.querySelector('.notification-list');
    if (!notificationList) return;

    const notification = document.createElement('div');
    notification.className = 'notification-item';
    notification.innerHTML = `
        <div class="notification-title">Profile Picture Updated</div>
        <div class="notification-message">Your profile picture has been changed. Click here to change it back.</div>
        <div class="notification-time">Just now</div>
    `;

    notification.addEventListener('click', function(e) {
        e.stopPropagation();
        // Close the dropdown
        const notificationDropdown = document.querySelector('.notification-dropdown');
        if (notificationDropdown) {
            notificationDropdown.style.display = 'none';
        }
        // Navigate to profile section
        const profileLink = document.querySelector('.sidebar-nav a[href="#profile"]');
        if (profileLink) {
            profileLink.click();
        }
    });

    // Add notification to the top of the list
    notificationList.insertBefore(notification, notificationList.firstChild);

    // Update notification badge
    updateNotificationBadge();
}

function clearAllNotifications() {
    const notificationList = document.querySelector('.notification-list');
    if (notificationList) {
        notificationList.innerHTML = '';
        updateNotificationBadge();
    }
}

function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    const notificationList = document.querySelector('.notification-list');
    if (badge && notificationList) {
        const count = notificationList.children.length;
        badge.textContent = count;
        badge.style.display = count > 0 ? 'block' : 'none';
    }
}
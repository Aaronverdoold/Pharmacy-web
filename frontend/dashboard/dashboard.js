// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCharts();

    // Handle sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.dashboard-section');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');

            // Hide all sections
            sections.forEach(section => section.classList.add('hidden'));
            
            // Show the selected section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
            }
        });
    });

    // Handle smooth scrolling for "View All" links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Update active navigation
                sidebarLinks.forEach(l => l.classList.remove('active'));
                document.querySelector(`.sidebar-nav a[href="#${targetId}"]`).classList.add('active');
                
                // Show the target section
                sections.forEach(section => section.classList.add('hidden'));
                targetSection.classList.remove('hidden');
                
                // Scroll to top of the section
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Handle notifications
    const notifications = document.querySelector('.notifications');
    notifications.addEventListener('click', function() {
        // Add notification dropdown functionality here
        console.log('Notifications clicked');
    });

    // Handle chart period changes
    const chartPeriod = document.querySelector('.chart-period');
    if (chartPeriod) {
        chartPeriod.addEventListener('change', function() {
            updateOrdersChart(this.value);
        });
    }

    // Load user data
    loadUserData();

    // Initialize order actions
    initializeOrderActions();
});

function initializeCharts() {
    // Orders Chart
    const ordersCtx = document.getElementById('ordersChart').getContext('2d');
    const ordersChart = new Chart(ordersCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Orders',
                data: [12, 19, 15, 25, 22, 30],
                borderColor: '#056439',
                backgroundColor: 'rgba(5, 100, 57, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#edf2f7'
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

    // Prescriptions Chart
    const prescriptionsCtx = document.getElementById('prescriptionsChart').getContext('2d');
    const prescriptionsChart = new Chart(prescriptionsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Active', 'Expired', 'Pending'],
            datasets: [{
                data: [8, 3, 2],
                backgroundColor: [
                    '#056439',
                    '#e53e3e',
                    '#f6ad55'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '70%'
        }
    });
}

function updateOrdersChart(period) {
    // This function would update the orders chart based on the selected period
    // For now, we'll just log the selected period
    console.log('Updating chart for period:', period);
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
    const ordersList = document.querySelectorAll('.orders-list');
    ordersList.forEach(list => {
        list.innerHTML = mockOrders.map(order => `
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
    });

    // Update prescriptions list
    const prescriptionsList = document.querySelectorAll('.prescriptions-list');
    prescriptionsList.forEach(list => {
        list.innerHTML = mockPrescriptions.map(prescription => `
            <div class="prescription-item">
                <div class="prescription-info">
                    <span class="prescription-name">${prescription.name}</span>
                    <span class="prescription-date">Valid until: ${prescription.validUntil}</span>
                </div>
                <span class="prescription-status">${prescription.status}</span>
            </div>
        `).join('');
    });
}

// Order Actions
function initializeOrderActions() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const orderItem = this.closest('.order-item');
            // TODO: Implement edit functionality
            console.log('Edit order:', orderItem);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const orderItem = this.closest('.order-item');
            if (confirm('Are you sure you want to delete this order?')) {
                orderItem.style.opacity = '0';
                setTimeout(() => {
                    orderItem.remove();
                    // TODO: Implement actual deletion in backend
                }, 300);
            }
        });
    });
}
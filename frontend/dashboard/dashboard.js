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

    // Initialize dashboard charts
    initializeCharts();
});

// Create and configure dashboard charts
function initializeCharts() {
    // Sales performance chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Sales',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
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

    // Medication distribution chart
    const medicationCtx = document.getElementById('medicationChart').getContext('2d');
    new Chart(medicationCtx, {
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

    // Prescription trends chart
    const prescriptionCtx = document.getElementById('prescriptionChart').getContext('2d');
    new Chart(prescriptionCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Prescriptions',
                data: [12, 19, 15, 17, 22, 24, 20],
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
}
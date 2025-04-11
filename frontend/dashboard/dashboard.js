// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Handle menu navigation
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.dashboard-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Update active menu item
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));

            // Show selected section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Initialize profile picture change functionality
    const profilePicture = document.getElementById('profilePicture');
    const profileImageInput = document.getElementById('profileImageInput');
    const topProfileImg = document.querySelector('.profile-img');
    const changePictureBtn = document.querySelector('.change-picture-btn');

    changePictureBtn.addEventListener('click', function() {
        profileImageInput.click();
    });

    profileImageInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();

            reader.onload = function(e) {
                // Update both profile pictures
                profilePicture.src = e.target.result;
                topProfileImg.src = e.target.result;

                // Add notification
                addNotification('Profile picture updated successfully', 'success');
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Initialize notifications
    const notificationIcon = document.querySelector('.notifications i');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    const clearAllBtn = document.querySelector('.clear-all');
    const notificationList = document.querySelector('.notification-list');

    // Toggle notification dropdown
    notificationIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationDropdown.style.display = notificationDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!notificationDropdown.contains(e.target) && e.target !== notificationIcon) {
            notificationDropdown.style.display = 'none';
        }
    });

    // Clear all notifications
    clearAllBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationList.innerHTML = '';
        document.querySelector('.notification-badge').textContent = '0';
        notificationDropdown.style.display = 'none';
    });

    // Function to add notifications
    function addNotification(message, type = 'info') {
        const notificationItem = document.createElement('div');
        notificationItem.className = 'notification-item';
        notificationItem.innerHTML = `
            <div class="notification-content">
                <p class="notification-message">${message}</p>
                <span class="notification-time">Just now</span>
            </div>
        `;

        notificationList.insertBefore(notificationItem, notificationList.firstChild);

        // Update badge count
        const badge = document.querySelector('.notification-badge');
        badge.textContent = parseInt(badge.textContent) + 1;

        // Show dropdown
        notificationDropdown.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            notificationDropdown.style.display = 'none';
        }, 5000);
    }

    // Initialize all charts
    initializeCharts();

    // Initialize profile dropdown
    initializeProfileDropdown();

    // Handle profile dropdown menu
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');

    // Add click event listeners to all dropdown links
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);

            // Hide all sections
            document.querySelectorAll('.dashboard-section').forEach(section => {
                section.classList.remove('active');
            });

            // Show the target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Update active state in sidebar
            document.querySelectorAll('.sidebar-nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });

            // If the clicked link is in the sidebar, mark it as active
            if (this.closest('.sidebar-nav')) {
                this.classList.add('active');
            }

            // Close the dropdown
            document.querySelector('.dropdown-content').style.display = 'none';
        });
    });

    // Handle profile information editing
    const editButtons = document.querySelectorAll('.edit-btn');

    // Add click event listeners to edit buttons
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const detailItem = this.closest('.detail-item');
            const detailValue = detailItem.querySelector('.detail-value');
            const detailLabel = detailItem.querySelector('.detail-label').textContent;
            const currentValue = detailValue.textContent;

            // Create input field
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentValue;
            input.className = 'edit-input';

            // Replace value with input field
            detailValue.textContent = '';
            detailValue.appendChild(input);
            input.focus();

            // Change edit button to save button
            this.innerHTML = '<i class="fas fa-save"></i>';
            this.classList.add('save-btn');
            this.classList.remove('edit-btn');

            // Handle save
            const saveButton = this;
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    saveChanges();
                }
            });

            function saveChanges() {
                const newValue = input.value.trim();
                if (newValue) {
                    detailValue.textContent = newValue;
                    saveButton.innerHTML = '<i class="fas fa-edit"></i>';
                    saveButton.classList.remove('save-btn');
                    saveButton.classList.add('edit-btn');

                    // Here you would typically send the update to your backend
                    console.log(`Updated ${detailLabel} to: ${newValue}`);
                }
            }

            // Add click event listener to save button
            saveButton.addEventListener('click', saveChanges);
        });
    });
});

// Chart initialization
let ordersChart = null;
let prescriptionsChart = null;
let analyticsCharts = {};

function initializeCharts() {
    // Data for different time periods
    const timePeriodData = {
        'week': {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            orders: [12, 19, 15, 25, 22, 30, 18],
            revenue: [5000, 6000, 5500, 7000, 6500, 8000, 7500],
            patients: [15, 20, 18, 25, 22, 30, 28],
            sales: [120, 150, 130, 180, 160, 200, 190],
            prescriptions: [50, 60, 55, 70, 65, 80, 75],
            inventory: [8000, 8200, 8100, 8300, 8250, 8350, 8400],
            satisfaction: [85, 88, 87, 90, 89, 92, 91],
            performance: [75, 80, 78, 85, 82, 90, 88]
        },
        'month': {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            orders: [45, 60, 55, 70],
            revenue: [20000, 22000, 24000, 26000],
            patients: [80, 90, 100, 110],
            sales: [600, 650, 700, 750],
            prescriptions: [250, 280, 300, 320],
            inventory: [8000, 8500, 9000, 9500],
            satisfaction: [85, 88, 90, 92],
            performance: [75, 80, 85, 90]
        },
        'year': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            orders: [150, 180, 200, 220, 250, 280, 300, 320, 350, 380, 400, 420],
            revenue: [35000, 42000, 38000, 45000, 50000, 48000, 52000, 55000, 58000, 60000, 62000, 65000],
            patients: [120, 150, 180, 200, 220, 250, 280, 300, 320, 350, 380, 400],
            sales: [1500, 1800, 2000, 2200, 2500, 2800, 3000, 3200, 3500, 3800, 4000, 4200],
            prescriptions: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600],
            inventory: [8000, 7500, 7000, 8500, 9000, 9500, 10000, 10500, 11000, 11500, 12000, 12500],
            satisfaction: [85, 88, 90, 92, 95, 93, 94, 96, 95, 97, 98, 99],
            performance: [75, 80, 85, 90, 95, 90, 95, 100, 95, 100, 100, 100]
        }
    };

    // Initialize Orders Chart
    const ordersCtx = document.getElementById('ordersChart').getContext('2d');
    ordersChart = new Chart(ordersCtx, {
        type: 'line',
        data: {
            labels: timePeriodData.year.labels,
            datasets: [{
                label: 'Orders',
                data: timePeriodData.year.orders,
                borderColor: '#056439',
                backgroundColor: 'rgba(5, 100, 57, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: getChartOptions('line')
    });

    // Initialize Prescriptions Chart
    const prescriptionsCtx = document.getElementById('prescriptionsChart').getContext('2d');
    prescriptionsChart = new Chart(prescriptionsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Regular', 'Emergency', 'Chronic', 'Special'],
            datasets: [{
                data: [40, 20, 25, 15],
                backgroundColor: ['#056439', '#0a7a4a', '#0f8f55', '#14a460']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });

    // Initialize Analytics Charts
    const chartConfigs = {
        revenueChart: { type: 'line', label: 'Revenue' },
        patientGrowthChart: { type: 'bar', label: 'New Patients' },
        medicationSalesChart: { type: 'line', label: 'Sales' },
        prescriptionTrendsChart: { type: 'bar', label: 'Prescriptions' },
        inventoryLevelsChart: { type: 'line', label: 'Inventory' },
        customerSatisfactionChart: { type: 'line', label: 'Satisfaction' },
        staffPerformanceChart: { type: 'bar', label: 'Performance' }
    };

    Object.entries(chartConfigs).forEach(([id, config]) => {
        const ctx = document.getElementById(id).getContext('2d');
        analyticsCharts[id] = new Chart(ctx, {
            type: config.type,
            data: {
                labels: timePeriodData.year.labels,
                datasets: [{
                    label: config.label,
                    data: timePeriodData.year[getDataKey(id)],
                    borderColor: '#056439',
                    backgroundColor: config.type === 'line' ? 'rgba(5, 100, 57, 0.1)' : '#056439',
                    tension: 0.4,
                    fill: config.type === 'line',
                    borderRadius: config.type === 'bar' ? 4 : 0
                }]
            },
            options: getChartOptions(config.type)
        });
    });

    // Initialize pie/doughnut charts (these don't change with time period)
    initializePieCharts();

    // Add event listeners to all period selectors
    document.querySelectorAll('.chart-period').forEach(selector => {
        selector.addEventListener('change', function() {
            const period = this.value;
            const card = this.closest('.analytics-card, .chart-card');
            const chartId = card.querySelector('canvas').id;

            if (chartId === 'ordersChart') {
                updateOrdersChart(period);
            } else if (analyticsCharts[chartId]) {
                updateChartData(analyticsCharts[chartId], period);
            }
        });
    });

    // Helper function to initialize pie/doughnut charts
    function initializePieCharts() {
        // Top Medications Chart
        new Chart(document.getElementById('topMedicationsChart').getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Pain Relief', 'Antibiotics', 'Vitamins', 'Heart Meds', 'Other'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: ['#056439', '#0a7a4a', '#0f8f55', '#14a460', '#19b96b']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
            }
        });

        // Patient Demographics Chart
        new Chart(document.getElementById('patientDemographicsChart').getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['18-25', '26-35', '36-45', '46-55', '56+'],
                datasets: [{
                    data: [15, 25, 30, 20, 10],
                    backgroundColor: ['#056439', '#0a7a4a', '#0f8f55', '#14a460', '#19b96b']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
            }
        });

        // Prescription Types Chart
        new Chart(document.getElementById('prescriptionTypesChart').getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Regular', 'Refill', 'Emergency', 'Special'],
                datasets: [{
                    data: [40, 30, 20, 10],
                    backgroundColor: ['#056439', '#0a7a4a', '#0f8f55', '#14a460']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
            }
        });

        // Revenue by Category Chart
        new Chart(document.getElementById('revenueByCategoryChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Prescriptions', 'OTC', 'Medical Supplies', 'Other'],
                datasets: [{
                    label: 'Revenue',
                    data: [45000, 30000, 20000, 5000],
                    backgroundColor: '#056439',
                    borderRadius: 4
                }]
            },
            options: getChartOptions('bar')
        });
    }

    // Helper function to update chart data based on time period
    function updateChartData(chart, period) {
        const canvasId = chart.canvas.id;
        const dataKey = getDataKey(canvasId);

        chart.data.labels = timePeriodData[period].labels;
        chart.data.datasets[0].data = timePeriodData[period][dataKey];
        chart.update();
    }

    // Helper function to update orders chart
    function updateOrdersChart(period) {
        ordersChart.data.labels = timePeriodData[period].labels;
        ordersChart.data.datasets[0].data = timePeriodData[period].orders;
        ordersChart.update();
    }

    // Helper function to get data key based on chart ID
    function getDataKey(canvasId) {
        const keyMap = {
            'revenueChart': 'revenue',
            'patientGrowthChart': 'patients',
            'medicationSalesChart': 'sales',
            'prescriptionTrendsChart': 'prescriptions',
            'inventoryLevelsChart': 'inventory',
            'customerSatisfactionChart': 'satisfaction',
            'staffPerformanceChart': 'performance'
        };
        return keyMap[canvasId];
    }

    // Helper function to get chart options
    function getChartOptions(type) {
        return {
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
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        };
    }
}

// Profile dropdown functionality
function initializeProfileDropdown() {
    const profileDropdown = document.querySelector('.profile-dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (profileDropdown && dropdownContent) {
        profileDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', function() {
            dropdownContent.style.display = 'none';
        });
    }
}

// Medication Management
let medications = [];

function showAddMedicationForm() {
    document.querySelector('.add-medication-form').style.display = 'block';
    document.querySelector('.medication-list').style.display = 'none';
}

function hideAddMedicationForm() {
    document.querySelector('.add-medication-form').style.display = 'none';
    document.querySelector('.medication-list').style.display = 'block';
}

function selectMedicationPhoto(element) {
    const selectedPhoto = element.querySelector('img') || element;
    const photoInput = document.getElementById('selectedMedicationPhoto');
    photoInput.value = selectedPhoto.src;

    // Remove selected class from all photos
    document.querySelectorAll('.medication-photo-option').forEach(photo => {
        photo.classList.remove('selected');
    });

    // Add selected class to clicked photo
    element.classList.add('selected');
}

document.getElementById('medicationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newMedication = {
        id: 'M' + (medications.length + 1).toString().padStart(3, '0'),
        name: document.getElementById('medicationName').value,
        category: document.getElementById('medicationCategory').value,
        stock: parseInt(document.getElementById('medicationStock').value),
        price: parseFloat(document.getElementById('medicationPrice').value),
        photo: document.getElementById('selectedMedicationPhoto').value
    };

    medications.push(newMedication);
    addMedicationToTable(newMedication);
    hideAddMedicationForm();
    this.reset();
});

function addMedicationToTable(medication) {
    const tbody = document.querySelector('.medications-table tbody');
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td>
            <div class="medication-photo-container">
                <img src="${medication.photo}" alt="${medication.name}" class="medication-img">
            </div>
        </td>
        <td>${medication.name}</td>
        <td>${medication.category}</td>
        <td>${medication.stock}</td>
        <td>$${medication.price.toFixed(2)}</td>
        <td>
            <button class="edit-btn" onclick="editMedication('${medication.id}')"><i class="fas fa-edit"></i></button>
            <button class="delete-btn" onclick="deleteMedication('${medication.id}')"><i class="fas fa-trash"></i></button>
        </td>
    `;

    tbody.appendChild(tr);
}

// Patient Management
let patients = [];

function showAddPatientForm() {
    document.querySelector('.add-patient-form').style.display = 'block';
    document.querySelector('.patients-grid').style.display = 'none';
}

function hideAddPatientForm() {
    document.querySelector('.add-patient-form').style.display = 'none';
    document.querySelector('.patients-grid').style.display = 'block';
}

document.getElementById('patientForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newPatient = {
        id: 'P' + (patients.length + 1).toString().padStart(4, '0'),
        name: document.getElementById('patientName').value,
        email: document.getElementById('patientEmail').value,
        phone: document.getElementById('patientPhone').value,
        address: document.getElementById('patientAddress').value,
        dob: document.getElementById('patientDOB').value,
        gender: document.getElementById('patientGender').value,
        status: 'active',
        lastVisit: new Date().toLocaleDateString()
    };

    patients.push(newPatient);
    addPatientToList(newPatient);
    hideAddPatientForm();
    this.reset();
});

function addPatientToList(patient) {
    const recentItems = document.querySelector('.recent-items');
    const div = document.createElement('div');
    div.className = 'recent-item';
    div.onclick = () => showPatientDetails(patient.id);
    div.style.cursor = 'pointer';

    div.innerHTML = `
        <div class="item-info">
            <span class="item-name">${patient.name}</span>
            <span class="item-details">ID: ${patient.id} | Last Visit: ${patient.lastVisit}</span>
        </div>
        <span class="item-status ${patient.status}">${patient.status}</span>
    `;

    recentItems.insertBefore(div, recentItems.firstChild);
}

function showPatientDetails(patientId) {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    // Update modal content with patient information
    document.getElementById('patientDetailsName').textContent = patient.name;
    document.getElementById('patientDetailsId').textContent = patient.id;
    document.getElementById('patientDetailsDOB').textContent = patient.dob;
    document.getElementById('patientDetailsGender').textContent = patient.gender;
    document.getElementById('patientDetailsEmail').textContent = patient.email;
    document.getElementById('patientDetailsPhone').textContent = patient.phone;
    document.getElementById('patientDetailsAddress').textContent = patient.address;
    document.getElementById('patientDetailsStatus').textContent = patient.status;
    document.getElementById('patientDetailsLastVisit').textContent = patient.lastVisit;

    // Update prescriptions list
    const prescriptionsList = document.getElementById('patientDetailsPrescriptions');
    prescriptionsList.innerHTML = '';

    const patientPrescriptions = prescriptions.filter(p => p.patientId === patientId);
    if (patientPrescriptions.length === 0) {
        prescriptionsList.innerHTML = '<p>No prescriptions found</p>';
    } else {
        patientPrescriptions.forEach(prescription => {
            const div = document.createElement('div');
            div.className = 'prescription-item';
            div.innerHTML = `
                <div class="prescription-header">
                    <span class="prescription-id">${prescription.id}</span>
                    <span class="prescription-date">${prescription.date}</span>
                </div>
                <div class="prescription-details">
                    <span class="prescription-doctor">Dr. ${prescription.doctor}</span>
                    <span class="prescription-status ${prescription.status}">${prescription.status}</span>
                </div>
            `;
            prescriptionsList.appendChild(div);
        });
    }

    // Show the modal
    document.getElementById('patientDetailsModal').style.display = 'block';
}

function closePatientDetailsModal() {
    document.getElementById('patientDetailsModal').style.display = 'none';
}

function editPatientDetails() {
    // Here you would implement the edit functionality
    // For now, we'll just show a notification
    addNotification('Edit functionality coming soon!', 'info');
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('patientDetailsModal');
    if (e.target === modal) {
        closePatientDetailsModal();
    }
});

// Prescription Management
let prescriptions = [];

function showAddPrescriptionForm() {
    document.querySelector('.add-prescription-form').style.display = 'block';
    document.querySelector('.prescriptions-grid').style.display = 'none';
}

function hideAddPrescriptionForm() {
    document.querySelector('.add-prescription-form').style.display = 'none';
    document.querySelector('.prescriptions-grid').style.display = 'block';
}

function addMedicationItem() {
    const medicationsList = document.querySelector('.medications-list');
    const div = document.createElement('div');
    div.className = 'medication-item';

    div.innerHTML = `
        <select class="medication-select" required>
            <option value="">Select Medication</option>
            ${medications.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}
        </select>
        <input type="number" class="medication-quantity" placeholder="Quantity" required>
        <button type="button" class="remove-medication-btn" onclick="this.parentElement.remove()">
            <i class="fas fa-trash"></i>
        </button>
    `;

    medicationsList.appendChild(div);
}

document.getElementById('prescriptionForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const medicationItems = Array.from(document.querySelectorAll('.medication-item')).map(item => ({
        medicationId: item.querySelector('.medication-select').value,
        quantity: parseInt(item.querySelector('.medication-quantity').value)
    }));

    const total = medicationItems.reduce((sum, item) => {
        const medication = medications.find(m => m.id === item.medicationId);
        return sum + (medication ? medication.price * item.quantity : 0);
    }, 0);

    const newPrescription = {
        id: 'RX' + (prescriptions.length + 1).toString().padStart(4, '0'),
        patientId: document.getElementById('prescriptionPatient').value,
        doctor: document.getElementById('prescriptionDoctor').value,
        date: document.getElementById('prescriptionDate').value,
        medications: medicationItems,
        total: total,
        status: 'pending',
        notes: document.getElementById('prescriptionNotes').value
    };

    prescriptions.push(newPrescription);
    addPrescriptionToList(newPrescription);
    hideAddPrescriptionForm();
    this.reset();
});

function addPrescriptionToList(prescription) {
    const recentItems = document.querySelector('.prescriptions-grid .recent-items');
    const div = document.createElement('div');
    div.className = 'recent-item';

    const patient = patients.find(p => p.id === prescription.patientId);
    const medicationCount = prescription.medications.length;

    div.innerHTML = `
        <div class="item-info">
            <span class="item-name">${prescription.patientId} - ${patient ? patient.name : 'Unknown Patient'}</span>
            <span class="item-details">${medicationCount} medications | Total: $${prescription.total.toFixed(2)}</span>
        </div>
        <span class="item-status ${prescription.status}">${prescription.status}</span>
    `;

    recentItems.insertBefore(div, recentItems.firstChild);
}

// Account Settings Functions
function resetAccountSettings() {
    const form = document.getElementById('accountSettingsForm');
    form.reset();
    // Reset the email to the default value
    document.getElementById('accountEmail').value = 'john.doe@example.com';
    // Reset the two-factor auth toggle
    document.getElementById('twoFactorAuth').checked = true;
    // Reset notification preferences
    document.querySelectorAll('input[name="notifications"]').forEach(checkbox => {
        checkbox.checked = checkbox.value === 'email' || checkbox.value === 'sms';
    });
}

// Handle account settings form submission
document.getElementById('accountSettingsForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const email = document.getElementById('accountEmail').value;
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const twoFactorAuth = document.getElementById('twoFactorAuth').checked;
    const notifications = Array.from(document.querySelectorAll('input[name="notifications"]:checked'))
        .map(checkbox => checkbox.value);

    // Validate passwords if they are being changed
    if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        if (newPassword.length < 8) {
            alert('New password must be at least 8 characters long!');
            return;
        }
        if (!currentPassword) {
            alert('Please enter your current password to change it!');
            return;
        }
    }

    // Here you would typically send the data to your backend
    const accountData = {
        email,
        currentPassword,
        newPassword: newPassword || undefined,
        twoFactorAuth,
        notifications
    };

    console.log('Account Settings Data:', accountData);

    // Show success message
    addNotification('Account settings updated successfully', 'success');

    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
});
// Initialize form when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('signupForm');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    // Validate username format and length
    function checkUsername(value) {
        const lengthReq = document.querySelector('#usernameRequirements [data-requirement="length"]');
        const charsReq = document.querySelector('#usernameRequirements [data-requirement="chars"]');

        // Check if username is between 3-20 characters
        if (value.length >= 3 && value.length <= 20) {
            lengthReq.classList.add('valid');
            lengthReq.classList.remove('invalid');
        } else {
            lengthReq.classList.add('invalid');
            lengthReq.classList.remove('valid');
        }

        // Check if username contains only allowed characters
        if (/^[A-Za-z0-9_ ]+$/.test(value)) {
            charsReq.classList.add('valid');
            charsReq.classList.remove('invalid');
        } else {
            charsReq.classList.add('invalid');
            charsReq.classList.remove('valid');
        }
    }

    // Validate email format
    function checkEmail(value) {
        const formatReq = document.querySelector('#emailRequirements [data-requirement="format"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(value)) {
            formatReq.classList.add('valid');
            formatReq.classList.remove('invalid');
        } else {
            formatReq.classList.add('invalid');
            formatReq.classList.remove('valid');
        }
    }

    // Validate password strength requirements
    function checkPassword(value) {
        const lengthReq = document.querySelector('#passwordRequirements [data-requirement="length"]');
        const upperReq = document.querySelector('#passwordRequirements [data-requirement="uppercase"]');
        const lowerReq = document.querySelector('#passwordRequirements [data-requirement="lowercase"]');
        const numberReq = document.querySelector('#passwordRequirements [data-requirement="number"]');

        // Check minimum length
        if (value.length >= 8) {
            lengthReq.classList.add('valid');
            lengthReq.classList.remove('invalid');
        } else {
            lengthReq.classList.add('invalid');
            lengthReq.classList.remove('valid');
        }

        // Check for uppercase letter
        if (/[A-Z]/.test(value)) {
            upperReq.classList.add('valid');
            upperReq.classList.remove('invalid');
        } else {
            upperReq.classList.add('invalid');
            upperReq.classList.remove('valid');
        }

        // Check for lowercase letter
        if (/[a-z]/.test(value)) {
            lowerReq.classList.add('valid');
            lowerReq.classList.remove('invalid');
        } else {
            lowerReq.classList.add('invalid');
            lowerReq.classList.remove('valid');
        }

        // Check for number
        if (/[0-9]/.test(value)) {
            numberReq.classList.add('valid');
            numberReq.classList.remove('invalid');
        } else {
            numberReq.classList.add('invalid');
            numberReq.classList.remove('valid');
        }
    }

    // Check if passwords match
    function checkPasswordMatch() {
        const matchReq = document.querySelector('#confirmRequirements [data-requirement="match"]');

        if (password.value === confirmPassword.value && password.value !== '') {
            matchReq.classList.add('valid');
            matchReq.classList.remove('invalid');
        } else {
            matchReq.classList.add('invalid');
            matchReq.classList.remove('valid');
        }
    }

    // Set up real-time validation as user types
    username.addEventListener('input', () => checkUsername(username.value));
    email.addEventListener('input', () => checkEmail(email.value));
    password.addEventListener('input', () => {
        checkPassword(password.value);
        checkPasswordMatch();
    });
    confirmPassword.addEventListener('input', checkPasswordMatch);

    // Show validation requirements when field is focused
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input');
        const requirements = group.querySelector('.requirements');

        // Show requirements when field is clicked
        input.addEventListener('focus', () => {
            requirements.style.display = 'block';
        });

        // Hide requirements when field loses focus (if valid)
        input.addEventListener('blur', () => {
            // Only hide if the input is valid
            if (input === username && username.value.length >= 3 && /^[A-Za-z0-9_]+$/.test(username.value)) {
                requirements.style.display = 'none';
            } else if (input === email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                requirements.style.display = 'none';
            } else if (input === password && password.value.length >= 8 && /[A-Z]/.test(password.value) &&
                /[a-z]/.test(password.value) && /[0-9]/.test(password.value)) {
                requirements.style.display = 'none';
            } else if (input === confirmPassword && password.value === confirmPassword.value && password.value !== '') {
                requirements.style.display = 'none';
            }
        });
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');

        // Run all validation checks
        checkUsername(username.value);
        checkEmail(email.value);
        checkPassword(password.value);
        checkPasswordMatch();

        // Check if all requirements are met
        const allRequirementsMet =
            username.value.length >= 3 &&
            username.value.length <= 20 &&
            /^[A-Za-z0-9_ ]+$/.test(username.value) &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
            password.value.length >= 8 &&
            /[A-Z]/.test(password.value) &&
            /[a-z]/.test(password.value) &&
            /[0-9]/.test(password.value) &&
            password.value === confirmPassword.value;

        // Remove any existing error messages
        const existingError = form.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // If all validations pass, submit the form
        if (allRequirementsMet) {
            submitButton.textContent = 'Creating Account...';
            submitButton.disabled = true;

            const formData = new FormData(form);

            // Send data to server
            fetch('./../../backend/sign-up/signup.php', {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        // Redirect to login page on success
                        window.location.href = './../login-page/login.html';
                    } else {
                        // Show error message from server
                        showError(data.message || 'Something went wrong.');
                        submitButton.textContent = 'Sign up';
                        submitButton.disabled = false;
                    }
                })
                .catch(() => {
                    // Show network error message
                    showError('Network error. Please try again.');
                    submitButton.textContent = 'Sign up';
                    submitButton.disabled = false;
                });
        } else {
            // Show validation error message
            showError('Please correct the highlighted fields before submitting.');
            const invalidField = document.querySelector('.invalid input');
            if (invalidField) invalidField.focus();
        }
    });

    // Display error messages to the user
    function showError(message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        form.insertBefore(errorMessage, form.querySelector('button[type="submit"]'));

        // Automatically remove error after 5 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }

});
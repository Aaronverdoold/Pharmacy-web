const form = document.getElementById('loginForm');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const errorBox = document.getElementById('errorBox');

function validateUsername() {
    const value = username.value.trim();
    const isValid = /^[A-Za-z0-9_ ]{3,20}$/.test(value);
    username.classList.toggle('valid', isValid);
    username.classList.toggle('invalid', !isValid);
    return isValid;
}

function validateEmail() {
    const value = email.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    email.classList.toggle('valid', isValid);
    email.classList.toggle('invalid', !isValid);
    return isValid;
}

function validatePassword() {
    const value = password.value.trim();
    const isValid = value.length >= 6;
    password.classList.toggle('valid', isValid);
    password.classList.toggle('invalid', !isValid);
    return isValid;
}

form.addEventListener('input', () => {
    validateUsername();
    validateEmail();
    validatePassword();
    errorBox.style.display = 'none';
    errorBox.textContent = '';
});

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    errorBox.style.display = 'none';
    errorBox.textContent = '';

    if (!emailValue || !passwordValue) {
        showError("Email and password are required.");
        return;
    }

    fetch("../../backend/login/login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `email=${encodeURIComponent(emailValue)}&password=${encodeURIComponent(passwordValue)}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.role === 'admin') {
                    window.location.href = "../../frontend/dashboard/dashboard.html";
                } else {
                    window.location.href = "../../frontend/home-page/home.html";
                }
            } else {
                showError(data.message || "Login failed.");
            }
        })
        .catch(() => {
            showError("An error occurred. Please try again.");
        });

    function showError(message) {
        errorBox.textContent = message;
        errorBox.style.display = 'block';
    }
});
function updateNavigation() {
    const userNav = document.getElementById('userNav');

    // Check if user is logged in
    fetch('/Pharmacy-web/backend/login/checkSession.php')
        .then((response) => response.json())
        .then((data) => {
            if (data.loggedIn) {
                // User is logged in, show username
                if (userNav) {
                    userNav.innerHTML = `
                        <span class="user-username">${data.username}</span>
                        <a href="../../backend/login/logout.php" class="logout-link">Logout</a>
                    `;
                }
            } else {
                // User is not logged in, show login/signup links
                if (userNav) {
                    userNav.innerHTML = `
                        <a href="./../login-page/login.html">Login</a>
                    `;
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            // Default to showing login/signup links if there's an error
            if (userNav) {
                userNav.innerHTML = `
                    <a href="./../login-page/login.html">Login</a>
                `;
            }
        });
}

// Check login status when page loads
updateNavigation();
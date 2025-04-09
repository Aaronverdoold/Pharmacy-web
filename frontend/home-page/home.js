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
let translated = false;

    function translatePage() {
      const headline = document.getElementById('headline');
      const intro = document.getElementById('intro-description');

      if (!translated) {
        headline.innerHTML = "Kwaliteitsmedicatie &<br>professionele zorg";
        intro.innerText = "Betrouwbare medicatie voor jou of je dierbaren, ondersteund door deskundige zorg.";
        translated = true;
      } else {
        headline.innerHTML = "Quality medication &<br>professional care";
        intro.innerText = "Reliable medication for you or your loved ones, backed by expert support and care.";
        translated = false;
      }
    }
// Check login status when page loads
updateNavigation();
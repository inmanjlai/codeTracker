window.addEventListener('load', () => {
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalContent = document.querySelector('.modal-content');

    if (localStorage.getItem('pocketbase_auth') == null) {
        modalOverlay.style.display = 'grid';
        modalContent.innerHTML = `
            <p id='error-field' style='display:none'>Your username/email and password combination was incorrect</p>
            <label for="username">
                username / email
                <input type="text" id="login-username" placeholder="username / email">
            </label>
            <label for="password">
                password
                <input type="password" id="login-password" placeholder="password">
            </label>
            <button onclick="login()">Login</button>
            <a href="register.html">Don't have an account? Sign up</a>
        `
    } else {
        userAuthControls = document.querySelector('.user-auth-controls');
        userAuthControls.innerHTML = `
            <a href="./dashboard.html">Dashboard</a>
            <button class="logout-button" onclick="logout()">Logout</button>
        `
    }

})

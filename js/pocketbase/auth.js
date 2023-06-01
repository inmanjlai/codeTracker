async function logout() {
    localStorage.removeItem('pocketbase_auth')
    window.location.reload()
}

const pb = new PocketBase(PB_URL)

async function login() {
    const loginUsername = document.getElementById('login-username').value;
    const loginPassword = document.getElementById('login-password').value;
    const errorField = document.getElementById('error-field');

    try {
        const user = await pb.collection('users').authWithPassword(loginUsername, loginPassword);
        window.location.href = BASE_URL + '/index.html'
    } catch (e) {
        errorField.style.display = 'block'
    }

}

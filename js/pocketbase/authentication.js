import { pb } from "./pocketbase"

async function login(e) {
    e.preventDefault()
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');

    await pb.collection('users').authWithPassword(loginUsername, loginPassword)
}
async function signUp(e) {
    e.preventDefault()
    try {
        const createdUser = await pb.collection('users').create(data);
        await login(data.username, data.password);
    } catch (err) {
        console.error(err);
    }
}
function signOut() {
    pb.authStore.clear();
}

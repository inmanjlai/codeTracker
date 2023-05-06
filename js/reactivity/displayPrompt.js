window.addEventListener = ('onload', () => {
    const prompt = document.querySelector('#prompt');
    const user = localStorage.getItem('pocketbase_auth');
    let username = "";

    if (user !== null) {
        const userJson =  JSON.parse(user)
        username = userJson.model.username;

        prompt.innerText = `${username}@codeTracker ~`
    }
})

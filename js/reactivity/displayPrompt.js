window.addEventListener = ('onload', () => {
    const prompt = document.querySelector('#output');
    const user = localStorage.getItem('pocketbase_auth');
    let username = "";

    if (user !== null) {
        const userJson =  JSON.parse(user)
        username = userJson.model.username;

        prompt.innerText = `${username}@codeTracker ~`
    }
})

const snackbar = document.querySelector('.snackbar')

const snackbarNotification = (message) => {
    snackbar.innerHTML = message
    snackbar.style.opacity = 100;

    setTimeout(() => {
        snackbar.style.opacity = 0
    }, 5000)
}
const password = document.querySelector('#signup-password');
const passwordConfirm = document.querySelector('#signup-confirm-password');
const button = document.querySelector('.register-form button');
const username = document.querySelector('#signup-username');
const email = document.querySelector('#signup-email');

const errorField = document.querySelector('#error-field')

passwordConfirm.addEventListener('keyup', () => {

    if (passwordConfirm.value == "") {
        passwordConfirm.style.backgroundColor = "rgb(213, 213, 213)"
        button.setAttribute('disabled', 'true')
    }
    else if (passwordConfirm.value !== password.value || password.value.length < 8) {
        passwordConfirm.style.backgroundColor = "rgba(255, 0, 0, 0.2)"
        button.setAttribute('disabled', 'true')
    }
    else {
        passwordConfirm.style.backgroundColor = "rgba(129, 225, 150, 0.5)"
        password.style.backgroundColor = "rgba(129, 225, 150, 0.5)"
        button.removeAttribute('disabled')
    }

})

password.addEventListener('keyup', () => {
    if (password.value == "") {
        password.style.backgroundColor = "rgb(213, 213, 213)"
    }
    else if (password.value.length < 8 || password.value !== passwordConfirm.value) {
        password.style.backgroundColor = "rgba(255, 0, 0, 0.2)"
        if (passwordConfirm.value !== "") passwordConfirm.style.backgroundColor = "rgba(255, 0, 0, 0.2)"

    } else if (password.value.length >= 8 && password.value === passwordConfirm.value) {
        password.style.backgroundColor = "rgba(129, 225, 150, 0.5)"
        passwordConfirm.style.backgroundColor = "rgba(129, 225, 150, 0.5)"
    }
})

button.addEventListener('click', () => {
    errorField.innerHTML = ""

    if (username.value.length === 0) {
        errorField.innerHTML += "<li>username field is empty</li>"
        errorField.style.display = 'block'
    }
    if (email.value.length === 0) {
        errorField.innerHTML += "<li>email field is empty</li>"
        errorField.style.display = 'block'
    }
})

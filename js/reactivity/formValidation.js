const password = document.querySelector('#signup-password');
const passwordConfirm = document.querySelector('#signup-confirm-password');
const button = document.querySelector('.register-form button');
const username = document.querySelector('#signup-username');
const email = document.querySelector('#signup-email');

const errorField = document.querySelector('#error-field')

passwordConfirm.addEventListener('keyup', () => {

    // check if the confirm password field's value is empty
    // if it is, then set the background color to default
    if (passwordConfirm.value == "") {
        passwordConfirm.style.backgroundColor = "rgb(213, 213, 213)"
    }
    // if the value of the confirm password field is not equal to the value of the password field
    // OR
    // if the length of the value of the password field is less than 8
        // set the background color to red
    else if (passwordConfirm.value !== password.value || password.value.length < 8) {
        passwordConfirm.style.backgroundColor = "rgba(255, 0, 0, 0.2)"
    }
    // if the two conditions above are false 
    // then we wil just set both the password and the confirm password's background color to green
    else {
        passwordConfirm.style.backgroundColor = "rgba(129, 225, 150, 0.5)"
        password.style.backgroundColor = "rgba(129, 225, 150, 0.5)"
    }
    
    // At the end of the first conditional we check if the Register button should be enabled
    // We will enable the button if ALL the following conditions are true:
        // 1. password.value's length is 8 or higher
        // 2. password.value === passwordConfirm.value
        // 3. the username.value is not empty
        // 4. the email.value is not empty
    if (password.value.length >= 8 && password.value === passwordConfirm.value && username.value.length !== 0 && email.value.length !== 0) {
        button.removeAttribute('disabled')
    } else {
        button.setAttribute('disabled', 'true')
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

    // check if we should enable the submit button
    if (password.value.length >= 8 && password.value === passwordConfirm.value && username.value.length !== 0 && email.value.length !== 0) {
        button.removeAttribute('disabled')
    } else {
        button.setAttribute('disabled', 'true')
    }
})

username.addEventListener('keyup', () => {
    // check if we should enable the submit button
    if (password.value.length >= 8 && password.value === passwordConfirm.value && username.value.length !== 0 && email.value.length !== 0) {
        button.removeAttribute('disabled')
    } else {
        button.setAttribute('disabled', 'true')
    }
})

email.addEventListener('keyup', () => {
        // check if we should enable the submit button
    if (password.value.length >= 8 && password.value === passwordConfirm.value && username.value.length !== 0 && email.value.length !== 0) {
        button.removeAttribute('disabled')
    } else {
        button.setAttribute('disabled', 'true')
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



# CodeTracker

CodeTracker is a simple online code editor, that makes use of CodeMirror's code editor and Skulpt's Python to JavaScript translator.

User authentication is handled by PocketBase, using their provided JavaScript SDK.

## Dependancies

### CodeMirror

CodeMirror is imported into `index.html` with these two lines:

```html
index.html

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/codemirror.min.css"></link>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/codemirror.min.js"></script>
```

The basic implementation just consists of creating an instantiation of the CodeMirror class, and passing in an HTML element to be the parent of the editor. In our case this is the div element with an id of editor.

```html
index.html

<body>
	...
	<main>
		...
		<div id="editor"></div> // editor element that is injected into the CodeMirror instance
	</main>
	...
</body>
```

```javascript
js/skulpt/run.js

function buildEditor() {
    const editor = CodeMirror(document.querySelector('#editor'), {
        lineNumbers: true,
        tabSize: 2,
        value: ("print('hello world')"),
        mode: {
            name: "python",
            version: 3,
            singleLineStringErrors: false
        },
    })

    return editor
}

const editor = buildEditor()
```

Lines 3 - 10 are extra configuration for the editor, such as `lineNumbers`, `tabSize`, the initial text content when mounted with `value` and which `mode` to consider when highlighting syntax

Syntax highlighting is possible through an extra import in the `index.html` file

```html
index.html

<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/mode/python/python.min.js"></script>
```

### Skulpt

Skulpt lives in `js/skulpt/`

The only file to consider is the `run.js` file, which basically selects two elements in the DOM, an input element, and an output element.

Our input element is the CodeMirror editor, and the output element is a `pre` element that will be written to after Skulpt executes our code from the input element.

The two are being defined on lines 13 and 14:

```javascript
js/skulpt/run.js

function outf(text) {
    var mypre = document.getElementById("output");
    mypre.innerHTML = mypre.innerHTML + text;
}
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}
function runit() {
    var prog = editor.getValue(); // input
    var mypre = document.getElementById("output"); // output
    mypre.innerHTML = '';

    Sk.pre = "output";
    Sk.configure({ output: outf, read: builtinRead });
    var myPromise = Sk.misceval.asyncToPromise(function () {
        return Sk.importMainWithBody("<stdin>", false, prog, true);
    });
    myPromise.then(function (mod) {
        console.log('success');
    },
        function (err) {
            console.log(err.toString());
            mypre.innerHTML = err.toString()
        });
}
```

The `runit()` function is being called by an `onclick` event on a button in `index.html`

```html
index.html

<button type="button" onclick="runit()">
        Run
	<span class="material-symbols-outlined">
		chevron_right
	</span>
</button>
```

### PocketBase

Pocketbase offers a JavaScript SDK which is super simple to use

Instantiate a new PocketBase object and pass in the URL to where your PocketBase instance lives.

```javascript
index.html

const pb = new PocketBase(PB_URL)
```

`login()`

await the authWithPassword method and once that succeeds we just redirect back to the homepage.

```javascript
index.html

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
```

`signUp()`

```javascript
register.html

async function signUp() {
	const username = document.querySelector('#signup-username').value;
        const email = document.querySelector('#signup-email').value;
        const password = document.querySelector('#signup-password').value;
        const passwordConfirm = document.querySelector('#signup-confirm-password').value;

        const errorField = document.querySelector('#error-field')

        const data = {
        	username, email, password, passwordConfirm
        }

        try {
        	console.log(data)
                const createdUser = await pb.collection('users').create(data);
                await login()
        } catch (err) {
                console.error(err);
        }
}
```

`logout()`

Mainly just removing the `pocketbase_auth` object from localStorage and reloading the window

```javascript
index.html

async function logout() {
	localStorage.removeItem('pocketbase_auth')
	window.location.reload()
}
```

## Reactivity

### js/reactivity

This is a set of scripts I wrote to make the website feel a bit more reactive



`js/reactivity/isLoggedIn.js`

This is the main reactive script in the program, basically checks if the user is logged in, and if the user is not logged in it will display a modal asking the user to login.

```javascript
window.onload = () => {
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalContent = document.querySelector('.modal-content');

    if (localStorage.getItem('pocketbase_auth') == null) {
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
        modalOverlay.style.display = 'none';
        userAuthControls = document.querySelector('.user-auth-controls');
        userAuthControls.innerHTML = `
            <button class="logout-button" onclick="logout()">Logout</button>
        `
    }

}

```



`js/reactivity/displayPrompt.js`

Adding an eventListener to the window, when the window finishes loading, we want to find the currently logged in user's username from the localStorage object `pocketbase_auth` and replace the prompt element with a custom prompt that includes the username

```javascript
window.addEventListener = ('onload', () => {
    const prompt = document.querySelector('#prompt');
    const user = localStorage.getItem('pocketbase_auth');
    let username = "";

    if (user !== null) {
        const userJson =  JSON.parse(user)
        username = userJson.model.username;

        prompt.innerText = `${username}@codeTracker ~` // if the user's username is imanjlai this will read as 'imanjlai@codeTracker ~'
    }
})
```




`js/reactivity/formValidation`

This is a basic form validation script to make sure the user has a better experience when trying to create an account

The script is pretty long so I will just document the steps taken for the password fields and you can look through the rest and it should be easy enough to understand.

```javascript
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
```

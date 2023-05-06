# CodeTracker

CodeTracker is a simple online code editor, that makes use of CodeMirror's code editor and Skulpt's Python to JavaScript translator.

User authentication is handled by PocketBase, using their provided JavaScript SDK.

### CodeMirror

CodeMirror is imported into `index.html` with these two lines:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/codemirror.min.css"></link>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/codemirror.min.js"></script>
```

The basic implementation just consists of creating an instantiation of the CodeMirror class, and passing in an HTML element to be the parent of the editor. In our case this is the div element with an id of editor.

```html
#editor element that is injected into the CodeMirror instance

<body>
	...
	<main>
		...
		<div id="editor"></div>
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

login 

await the authWithPassword method and once that succeeds we just redirect back to the homepage.

```javascript
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

signUp

```javascript
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

logout 

Mainly just removing the `pocketbase_auth` object from localStorage and reloading the window

```javascript
async function logout() {
	localStorage.removeItem('pocketbase_auth')
	window.location.reload()
}
```

// THIS IS THE DEFAULT IMPLEMENTATION OF SKULPT FROM THEIR DOCUMENTATION ->

// output functions are configurable.  This one just appends some text
// to a pre element.
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

function outf(text) {
    var mypre = document.getElementById("output");
    mypre.innerHTML = mypre.innerHTML + text;
}
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

// Here's everything you need to run a python program in skulpt
// grab the code from your textarea
// get a reference to your pre element for output
// configure the output function
// call Sk.importMainWithBody()
function runit() {
    var prog = editor.getValue();
    var mypre = document.getElementById("output");
    mypre.innerHTML = '';

    console.log(prog)

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

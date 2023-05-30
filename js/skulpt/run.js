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
const events = [];
async function logevent()
{
    var userid = pb.authStore.model.id;
    // process all events and clear our the array
    while(events.length > 0) {
        // get each event
        evt = events.pop();
        // create data with event and user id
        const data = {
            "eventtype":evt,
            "userid": userid
        };
        // write to database
        const record = await pb.collection('events').create(data);
        //console.log("log event");
    }
}
editor.on("change",function(a,e){	
    //debugger;

    timestamp = Date.now();
    e.timestamp = timestamp; 
    var evnt = JSON.stringify(e);
    
    events.push(evnt);
    console.log(events.length);
    if(events.length > 10)
    {
        // log these events in the database
        // clear out the events.
        logevent();
        
    }

});


function outf(text) {
    var mypre = document.getElementById("system-output");
    mypre.innerHTML = mypre.innerHTML + text;
}
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function sInput(prompt){
    let output = document.querySelector('#system-output');
    output.innerText += `${prompt} `;

    return new Promise((resolve, reject) => {
        let input = document.querySelector('#programInputField')
        input.value = ""
        
        const handleInput = (e) => {
            if (e.key === "Enter") {
                e.preventDefault()
                var inputLines = document.querySelector("#programInputField").value
                output.innerText += `${input.value}\n`
                resolve(inputLines);
                input.removeEventListener('keydown', handleInput)
                input.value = ""
                }
        }
        input.addEventListener('keydown', handleInput)

    });
}

// Here's everything you need to run a python program in skulpt
// grab the code from your textarea
// get a reference to your pre element for output
// configure the output function
// call Sk.importMainWithBody()
function runit() {
    var prog = editor.getValue();
    var mypre = document.getElementById("system-output");
    console.log(mypre, "HERE")
    mypre.innerHTML = '';

    
    {
        // log all the  events in the database
        // clear out the events.
    }
    Sk.pre = "system-output";
    if (prog.includes("turtle"))
    {  
        // Sk.configure({output:outf, read:builtinRead}); 
        Sk.configure({output:outf, read:builtinRead, inputfun:sInput, inputfunTakesPrompt: true});
        (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'system-output';
        var myPromise = Sk.misceval.asyncToPromise(function() {
            return Sk.importMainWithBody("<stdin>", false, prog, true);
        });
    }

    else
    {
        // Sk.configure({ output: outf, read: builtinRead });
        Sk.configure({output:outf, read:builtinRead, inputfun:sInput, inputfunTakesPrompt: true});
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
}

async function save()
{
    //formData = new FormData();
    var file = document.getElementById('filename').innerText;
    var code = editor.getValue();
    var userid = pb.authStore.model.id;
    //console.log(userid);
    //formData.append(file,code); 
    //const createdRecord = await pb.collection('codedocs').create(formData);
    const data = {
        "filename":file,
        "code": code,
        "userid": userid
    };
    console.log(data);
    const record = await pb.collection('codedocs').create(data);
    
    
}


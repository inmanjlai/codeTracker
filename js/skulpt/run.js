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
generateEvent("start",true);

async function generateEvent(type, code)
{
    // log all the  events in the database
    // clear out the events.
    logevent();
    
    var userid = pb.authStore.model.id;
    var prog = editor.getValue();

    timestamp = Date.now();

    var evt = {"code":prog,"timestamp":timestamp};
    var evnt = JSON.stringify(evt);
    // create data with event and user id
        const data = {
            "eventtype":evnt,
            "userid": userid,
            "whichevent": type
    };
    // write to database
    const record =  await pb.collection('events').create(data);

}
async function logevent()
{
    var userid = pb.authStore.model.id;
    // process all events and clear our the array
    while(events.length > 0) {
        // get each event
        evt = events.shift();
        // create data with event and user id
        const data = {
            "eventtype":evt,
            "userid": userid,
            "whichevent": "key"
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
    //console.log(events.length);
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
    //console.log(mypre, "HERE")
    mypre.innerHTML = '';

    
    Sk.pre = "system-output";
    if (prog.includes("turtle"))
    {  
        // Sk.configure({output:outf, read:builtinRead}); 
        Sk.configure({output:outf, read:builtinRead, inputfun:sInput, inputfunTakesPrompt: true});
        //(Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'system-output';
        (Sk.TurtleGraphics || (Sk.TurtleGraphics = {'width':1000, 'target':'system-output'}));//.target = 'system-output';
        var myPromise = Sk.misceval.asyncToPromise(function() {
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
    
    generateEvent("execute",true)
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
        "userid": userid,
        "user": userid
    };
    console.log(data);

    try {
        const doesRecordWithNameExist = await pb.collection('codedocs')
            .getFirstListItem(`filename="${file}" && userid="${userid}"`)
            const confirmSaveDialog = document.querySelector('.overwrite-save-dialog')
            const cancelSaveBtn = document.querySelector('.cancelSaveBtn')
            const confirmSave = document.querySelector('.confirmSaveBtn')
        
            cancelSaveBtn.addEventListener('click', (e) => {
                confirmSaveDialog.close()
            })
        
            confirmSave.addEventListener('click', async(e) => {
                // make this update instead of create
                const record = await pb.collection('codedocs').update(doesRecordWithNameExist.id, data);
                confirmSaveDialog.close()
                snackbarNotification(`${data.filename} saved successfully.`)
            })
        
            if (doesRecordWithNameExist) {
                confirmSaveDialog.showModal()
            }
    } catch(err) {
        console.log('Saving new file')
        const record = await pb.collection('codedocs').create(data);
        snackbarNotification(`${data.filename} saved successfully.`)
    }   
}


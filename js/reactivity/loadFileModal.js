const modal = document.querySelector('.load-file-dialog')
const button = document.querySelector('.open-dialog-btn')
const fileList = document.querySelector('.left')
const preview = document.querySelector('.right')
const textEditor = document.querySelector('.codemirror')

button.addEventListener('click', async() => {
    
    // get files
    const files = await pb.collection('codedocs').getFullList({filter: `userid="${pb.authStore.model.id}"`});
    let currentCode;

    if (files.length > 0) {

        // populate list with files
        while (fileList.firstChild) {
            fileList.removeChild(fileList.firstChild);
        }
    
        for(let record in files) {
            let file = files[record]
    
            let fileButton = document.createElement("p")
            let fileButtonContent = document.createTextNode(file.filename)
            fileButton.appendChild(fileButtonContent)
            fileList.appendChild(fileButton)
    
            fileButton.addEventListener('click', () => {
                preview.innerText = file.code
                // if theres a button with a class of active, remove it
                let activeBtn = document.querySelector('.activeBtn')
                currentCode = file.code
                if (activeBtn !== null) {
                    activeBtn.classList.remove('activeBtn')
                }
                // then set this buttons class to active
                fileButton.classList.add('activeBtn')
            })
        }
        // set the first file to active when modal is opened
        fileList.firstChild.classList.add('activeBtn')
        currentCode = files[0].code
    
        // preview the first file by default
        while (preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }
        
        let previewContainer = document.createElement("p")
        previewContainer.innerText = files[0].code
        preview.appendChild(previewContainer)
    
        // when the load button is clicked, load the value of the preview into codemirror editor
        const loadFileBtn = document.querySelector('.loadBtn')

        const loadCode = () => {
            editor.setValue(currentCode)
            loadFileBtn.removeEventListener('click', loadCode)
            modal.close()
        }

        loadFileBtn.addEventListener('click', loadCode)
        
        // show modal
    } else {
        fileList.innerText = 'No Save Files Exist'
    }
    
    modal.showModal()
})

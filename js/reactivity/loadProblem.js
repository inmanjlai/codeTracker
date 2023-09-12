const problemId = localStorage.getItem('problem')
const filename = document.querySelector('#filename')

const user = localStorage.getItem('pocketbase_auth')
const userJson = JSON.parse(user)

console.log(userJson)

const username = userJson.model.username
const userId = userJson.model.id

const getProblem = async() => {
    const problem = await pb.collection('assignments').getOne(problemId, {expand: 'questions'})
    const currentProblem =  problem.expand.questions[0].id
    localStorage.setItem('currentQuestion', currentProblem)

    // const code = editor.getValue()
    filenameWithName = userJson.model.username + "_" + currentProblem

    async function setInitialCodeValue() {
        try {
            console.log(username)
            const currentProblemCode = await pb.collection('codedocs')
                .getFirstListItem(`filename="${username}_${currentProblem}"`, {expand: "problem"})
            console.log(currentProblemCode, "HERE")
            // change the editor value to be the codedoc for the associated problem
            let codeValue = `${currentProblemCode.code}`
            editor.setValue(codeValue)
        } catch (err) {
            const currentProblemCode = await pb.collection('coding_problems').getOne(currentProblem)

            let codeValue = `# ${currentProblemCode.description}`
            editor.setValue(codeValue)
        }
    }
    setInitialCodeValue()

    const questionList = document.querySelector('.question-container');
    problem.expand.questions.forEach((question) => {
        questionList.innerHTML += `
            <div class='question'>
                <input type='hidden' value='${question.id}' class='questionId'></input>
                <p>${question.title} <em>${question.points} points</em></p>
            </div>
        `
    })

    questionList.children[1].classList.add('active-question')

    const questions = document.querySelectorAll('.question')
    questions.forEach((question) => {
        question.addEventListener('click', (e) => {
            questions.forEach(ele => {
                if(ele.classList.contains('active-question')) {
                    if (e.currentTarget !== ele)
                    ele.classList.remove('active-question')
                } else {
                    if(e.currentTarget == ele) {
                        // set the current question to this question
                        ele.classList.add('active-question')
                        let questionId = ele.children[0].value
                        localStorage.setItem('currentQuestion', questionId)
                        // fetch code for the current problem
                        async function getCode() {
                            try {
                                console.log(username)
                                const currentProblemCode = await pb.collection('codedocs')
                                    .getFirstListItem(`filename="${username}_${questionId}"`, {expand: "problem"})
                                console.log(currentProblemCode, "HERE")
                                // change the editor value to be the codedoc for the associated problem
                                let codeValue = `${currentProblemCode.code}`
                                editor.setValue(codeValue)
                            } catch (err) {
                                const currentProblemCode = await pb.collection('coding_problems').getOne(questionId)

                                let codeValue = `# ${currentProblemCode.description}`
                                editor.setValue(codeValue)
                            }
                        }
                        getCode()
                    }


                }
            })
        })

    })

    filename.innerText = problem.title
    
    try {
        const problemCode = await pb.collection('codedocs').getFirstListItem(`userid="${userId}" && problem="${problem.id}"`)
        editor.setValue(`${problemCode.code}`)

    } catch (err) {
        editor.setValue(`${problemCode.code}`)
    }

}

getProblem()

const saveProblem = async() => {
    const code = editor.getValue()
    console.log(userId, filename.innerText, code, problemId)

    filenameWithName = userJson.model.username + "_" + filename.innerText
    try {
        const doesExist = await pb.collection('codedocs').getFirstListItem(`userid="${userId}" && filename="${filenameWithName}"`)
        await pb.collection('codedocs').update(doesExist.id, {code: code})
        snackbarNotification(`${filename.innerText} saved successfully.`)
    } catch (err) {
        await pb.collection('codedocs').create({userid: userId, filename: filenameWithName, code: code, problem: problemId})
        snackbarNotification(`${filename.innerText} saved successfully.`)
    }
}

const saveCurrentProblem = async() => {
    // find current problem in local storage
    currentProblem = localStorage.getItem('currentQuestion')

    const code = editor.getValue()
    filenameWithName = userJson.model.username + "_" + currentProblem

    try {
        const doesExist = await pb.collection('codedocs').getFirstListItem(`userid="${userId}" && filename="${filenameWithName}"`)
        await pb.collection('codedocs').update(doesExist.id, {code: code})
        snackbarNotification(`${currentProblem} saved successfully.`)
    } catch (err) {
        console.log("FILE DOES NOT EXIST, CREATING A NEW ONE")
        console.log(userId, filenameWithName, code, currentProblem)
        await pb.collection('codedocs').create({userid: userId, filename: filenameWithName, code: code, problem: currentProblem})
        snackbarNotification(`${currentProblem} saved successfully.`)
    }


    // save that problem by id and show a snackbar notification
}

const submitAssignment = async() => {
    // find assignment by id in local storage
    const assignment = localStorage.getItem('problem')
    const confirmationModal = document.querySelector('.confirm-submit-dialog')
    confirmationModal.showModal()

    const confirmBtn = document.querySelector('.confirmSubmitBtn')
    const cancelBtn = document.querySelector('.cancelSubmitBtn')

    confirmBtn.addEventListener('click', async(e) => {
        const problem = await pb.collection('assignments').getOne(assignment)
        await pb.collection('assignments').update(problemId, { submitted_by: [...problem.submitted_by, userId], assigned_to: problem.assigned_to.filter((id) => id !== userId)})
        
        confirmationModal.close()
        snackbarNotification(`${filename.innerText} submitted successfully. You will be redirected to the dashboard.`)
        setTimeout(() =>{
            window.location.href = `${BASE_URL}/dashboard.html`
        }, 3300)
    })

    cancelBtn.addEventListener('click', () => {
        confirmationModal.close()
    })

}

const submitProblem = async() => {
    const confirmationModal = document.querySelector('.confirm-submit-dialog')
    confirmationModal.showModal()

    const confirmBtn = document.querySelector('.confirmSubmitBtn')
    const cancelBtn = document.querySelector('.cancelSubmitBtn')

    confirmBtn.addEventListener('click', async(e) => {
        const problem = await pb.collection('coding_problems').getOne(problemId)
        await pb.collection('coding_problems').update(problemId, { submitted_by: [...problem.submitted_by, userId], assigned_to: problem.assigned_to.filter((id) => id !== userId)})
        
        confirmationModal.close()
        snackbarNotification(`${filename.innerText} submitted successfully. You will be redirected to the dashboard.`)
        setTimeout(() =>{
            window.location.href = `${BASE_URL}/dashboard.html`
        }, 3300)
    })

    cancelBtn.addEventListener('click', () => {
        confirmationModal.close()
    })
}

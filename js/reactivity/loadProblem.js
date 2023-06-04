const problemId = localStorage.getItem('problem')
const filename = document.querySelector('#filename')

const user = localStorage.getItem('pocketbase_auth')
const userJson = JSON.parse(user)
const userId = userJson.model.id

const getProblem = async() => {
    const problem = await pb.collection('coding_problems').getOne(problemId)

    filename.innerText = problem.title
    
    try {
        const problemCode = await pb.collection('codedocs').getFirstListItem(`userid="${userId}" && problem="${problem.id}"`)
        editor.setValue(problemCode.code)

    } catch (err) {
        editor.setValue('print("Work on your assigned problem here")')
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
    } catch (err) {
        await pb.collection('codedocs').create({userid: userId, filename: filenameWithName, code: code, problem: problemId})
    }
}

const submitProblem = async() => {
    const problem = await pb.collection('coding_problems').getOne(problemId)
    await pb.collection('coding_problems').update(problemId, { submitted_by: [...problem.submitted_by, userId], assigned_to: problem.assigned_to.filter((id) => id !== userId)})
}

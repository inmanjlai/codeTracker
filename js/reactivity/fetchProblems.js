let currentUser = localStorage.getItem('pocketbase_auth')
currentUser = JSON.parse(currentUser)
currentUser = currentUser.model.id

const assignedList = document.querySelector('.assigned-problem-list')
const submittedList = document.querySelector('.submitted-problem-list')

const openProblem = (problem) => {
    localStorage.setItem('problem', problem)
    window.location.href = `${BASE_URL}/problem.html`
}

window.addEventListener('load', async() => {
    users_assigned_problems = await pb.collection('coding_problems').getFullList({
        filter: `assigned_to~"${currentUser}"`
    })

    users_assigned_problems.forEach((problem) => {
        const ele = `
            <div onclick="openProblem('${problem.id}')">
                <div class="problem">
                    <h3>${problem.title}</h3>
                    <p>${problem.description}</p>
                </div>
            </div>
        `
        assignedList.innerHTML += ele
    })

    users_submitted_problems = await pb.collection('coding_problems').getFullList({
        filter: `submitted_by~"${currentUser}"`
    })

    users_submitted_problems.forEach((problem) => {
        const ele = `
            <div>
                <div class="problem">
                    <h3>${problem.title}</h3>
                    <p>${problem.description}</p>
                </div>
            </div>
        `
        submittedList.innerHTML += ele
    })
})
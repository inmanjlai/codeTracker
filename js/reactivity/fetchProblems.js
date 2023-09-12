let currentUser = localStorage.getItem('pocketbase_auth')
currentUser = JSON.parse(currentUser)
currentUser = currentUser.model.id

const assignedList = document.querySelector('.assigned-problem-list')
const submittedList = document.querySelector('.submitted-problem-list')

const openProblem = (problem) => {
    localStorage.setItem('problem', problem)
    window.location.href = `${BASE_URL}/assignment.html`
}

window.addEventListener('load', async() => {
    users_assigned_problems = await pb.collection('assignments').getFullList({
        filter: `assigned_to~"${currentUser}"`,
        expand: "questions"
    })

    users_assigned_problems.forEach((problem) => {
        const points = problem.expand.questions.map((question) => {
            return question.points
        })

        let totalPoints = 0;
        for (let point of points) {
            console.log(point)
            totalPoints += point
        }

        const ele = `
            <div onclick="openProblem('${problem.id}')">
                <div class="problem">
                    <h3>${problem.title}</h3>
                    <p><em>${totalPoints} points</em></p>
                </div>
            </div>
        `
        assignedList.innerHTML += ele
    })

    users_submitted_problems = await pb.collection('assignments').getFullList({
        filter: `submitted_by~"${currentUser}"`
    })

    users_submitted_problems.forEach((problem) => {
        const ele = `
            <div>
                <div class="problem">
                    <p>${problem.title}</p>
                </div>
            </div>
        `
        submittedList.innerHTML += ele
    })
})
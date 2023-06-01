let currentUser = localStorage.getItem('pocketbase_auth')
currentUser = JSON.parse(currentUser)
currentUser = currentUser.model.id

const assignedList = document.querySelector('.assigned-problem-list')

window.addEventListener('load', async() => {
    users_assigned_problems = await pb.collection('coding_problems').getFullList({
        filter: `assigned_to~"${currentUser}"`
    })

    users_assigned_problems.forEach((problem) => {
        const ele = document.createElement('div')
        ele.innerHTML = `
            <div class="problem">
                <h3>${problem.title}</h3>
                <p>${problem.description}</p>
            </div>
        `
        assignedList.appendChild(ele)
    })
})
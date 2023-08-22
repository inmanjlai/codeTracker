
// make a request to see if the current user is an admin
const user = localStorage.getItem('pocketbase_auth');

if (user !== null) {
    const userJson =  JSON.parse(user)
    console.log(userJson.model.id)

    async function getUser() {
        foundUser = await pb.collection('users').getOne(userJson.model.id)

        // if the user is an admin, rehydrate the page with the admin dashboard built using JS
        const main = document.querySelector('main')
        const section = document.querySelector('.admin-dashboard-container')
        if (foundUser.isAdmin) {
            main.style.display = 'none'
            section.innerHTML = `
                <div>
                    <h2>Admin Dashboard</h2>
                    <div class='admin-dashboard'>
                        <div class='question-list-container'>
                            <h3>Questions<span class="material-symbols-rounded add-question">Add</span></h3>
                            <div class="question-list">
                            </div>
                        </div>
                        <div class='assignment-list-container'>
                            <h3>Assignments</h3>
                        <div class="assignment-list">
                        </div>

                        </div>
                        <div class='submission-list-container'>
                            <h3>Submissions</h3>
                        </div>
                   </div>
                </div>
            `

            // get all assignments and put them in the assingment list
            const codingProblems = await pb.collection('coding_problems').getFullList();
            console.log(codingProblems[0])
            const questionList = document.querySelector('.question-list')

            questionList.innerHTML = '';
            codingProblems.forEach(ele =>{
                questionList.innerHTML += `
                    <div class="question">
                        <h4>${ele.title}</h4>
                        <p>${ele.description}</p>
                        <input type='hidden' value='${ele.id}' class='questionId'></input>
                        <input type='hidden' value='${ele.points}'></input>
                        <span class="material-symbols-rounded">Settings</span>
                    </div>
                `
            })
            
            const question = document.querySelectorAll('.question');
            const adminDialog = document.querySelector('.admin-dialog')

            adminDialog.innerHTML = `
                <div class="edit-admin-dialog-content">
                    <h2>Edit question</h2>
                    <label>Title</label>
                    <input class="title" type="text" placeholder="Title"></input>
                    <label>Description</label>
                    <textarea class="description" placeholder="Description"></textarea>
                    <label>Points</label>
                    <input type="text" class="points" placeholder="Points"></input>
                    <form method="dialog"><button class="cancelButton">Cancel</button></form>
                    <button class="confirmChanges">Confirm Changes</button>
                </div>
            `

            const modalId = document.querySelector('.questionId')
            const modalTitle = document.querySelector('.title')
            const modalDescription = document.querySelector('.description')
            const modalPoints = document.querySelector('.points')
            const confirmChangesButton = document.querySelector('.confirmChanges')

            confirmChangesButton.addEventListener('click', async(e) => {
                const data = {
                    title: modalTitle.value,
                    description: modalDescription.value,
                    points: modalPoints.value
                }
                await pb.collection('coding_problems').update(modalId.value, data)
                snackbarNotification(`${modalTitle.value} updated. Your page will be refreshed to display changes momentarily`)
                
                adminDialog.close()
                setTimeout(() => {
                    window.location.href = `${BASE_URL}/dashboard.html`
                }, 3000)
            })

            question.forEach((ele) => {
                ele.children[4].addEventListener('click', () => {
                    console.log(modalPoints)
                    adminDialog.showModal()
                    modalId.value = ele.children[2].value
                    modalTitle.value = ele.children[0].textContent
                    modalDescription.value = ele.children[1].textContent
                    modalPoints.value = ele.children[3].value
                })
            })

            const createQuestionDialog = document.querySelector('.create-question-dialog');

            createQuestionDialog.innerHTML = `
                <div class="edit-admin-dialog-content">
                    <h2>Create question</h2>
                    <label>Title</label>
                    <input class="create-title" type="text" placeholder="Title"></input>
                    <label>Description</label>
                    <textarea class="create-description" placeholder="Description"></textarea>
                    <label>Points</label>
                    <input type="text" class="create-points" placeholder="Points"></input>
                    <form method="dialog"><button class="cancelButton">Cancel</button></form>
                    <button class="createQuestion">Create Question</button>
                </div>
            `

            const addQuestion = document.querySelector('.add-question')
            addQuestion.addEventListener('click', (e) => {
                createQuestionDialog.showModal()
            })

            const createQuestionButton = document.querySelector('.createQuestion')
            const createTitle = document.querySelector('.create-title')
            const createDescription = document.querySelector('.create-description')
            const createPoints = document.querySelector('.create-points')


            createQuestionButton.addEventListener('click', async(e) => {
                const data = {
                    title: createTitle.value,
                    description: createDescription.value,
                    points: createPoints.value
                }
                await pb.collection('coding_problems').create(data)
                snackbarNotification(`${createTitle.value} created. Your page will be refreshed to display changes momentarily`)
                
                createQuestionDialog.close()
                setTimeout(() => {
                    window.location.href = `${BASE_URL}/dashboard.html`
                }, 3000)
            })
        } else {
            section.style.display = "none"
        }
    }

    getUser()
}
    

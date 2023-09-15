
// make a request to see if the current user is an admin

    const user = localStorage.getItem('pocketbase_auth');
    
    if (user !== null) {
    const userJson =  JSON.parse(user)
    
    async function getUser() {
        foundUser = await pb.collection('users').getOne(userJson.model.id)
        
        const main = document.querySelector('main')
        const section = document.querySelector('.admin-dashboard-container')
        if (foundUser.isAdmin) {
            main.style.display = 'none'
            section.innerHTML = `
            <div>
            <div class='admin-nav'>
            <h2>Admin Dashboard</h2>
            <ul>
            <li class="active admin-link" id="question-link">Questions</li>
            <li id="assignment-link" class='admin-link'>Assignments</li>
            <li id="student-link" class='admin-link'>Students</li>
            </ul>
            </div>
            <div class='admin-dashboard'>
            <div class='question-list-container'>
            <div class='question-header'>
            <h3>Questions</h3>
            <!--<input type='search' placeholder='Search for a question'></input>-->
            <span class="material-symbols-rounded add-question">Add</span>
            </div>
            <div class="question-list">
            </div>
            </div>
            <div class='assignment-list-container'>
            <div class='assignment-header'>
            <h3>Assignments</h3>
            <!--<input type='search' placeholder='Search for an assignment'></input>-->
                                <span class="material-symbols-rounded add-assignment">Add</span>
                                </div>
                                <div class="assignment-list">
                                </div>
                                </div>
                                <div class='student-list-container'>
                                <div class='student-header'>
                                <h3>Students</h3>
                                </div>
                                <div class="student-list">
                                </div>
                                </div>
                                </div>
                                </div>
                                `
                                
                                // LOADING ALL QUESTIONS
                                const codingProblems = await pb.collection('coding_problems').getFullList();
                                const questionList = document.querySelector('.question-list')
                                
                                questionList.innerHTML = '';
                                codingProblems.forEach(ele =>{
                                    questionList.innerHTML += `
                                    <div class="question">
                                    <p class='questionPoints'>${ele.points}</p>
                                    <div class='question-info'>
                                    <h4>${ele.title}</h4>
                                    <p>${ele.description}</p>
                                    <input type='hidden' value='${ele.id}' class='questionId'></input>
                                    </div>
                                    <span class="material-symbols-rounded">Settings</span>
                                    </div>
                                    `
                                })
                                
                                // LOADING ALL ASSIGNMENTS
                                const assignments = await pb.collection('assignments').getFullList({expand:"problems"});
                                const assignmentList = document.querySelector('.assignment-list')
                                
                                assignmentList.innerHTML = '';
                                assignments.forEach(ele =>{
                                    assignmentList.innerHTML += `
                                    <div class="assignment">
                                    <div class='assignment-info'>
                                    <p>${ele.title}</p>
                                    <input type='hidden' value='${ele.id}'></input>
                                    </div>
                                    <div class='assignment-controls'>
                                    <span class="material-symbols-rounded add-student" title="assign students">group</span>
                                    <span class="material-symbols-rounded editAssignmentBtn" data-id="${ele.id}" title="assignment settings">Settings</span>
                                    </div>
                                    </div>
                                    `
                                })
                                
                                // LOADING ALL STUDENTS
                                const classes = await pb.collection('classes').getFullList({expand: 'students'});
                                
                                console.log('classes', classes)
                                
                                const studentList = document.querySelector('.student-list')
                                
                                const allStudents = []
                                classes.forEach((classEl) => {
                classEl.expand.students.forEach((student) => {
                    allStudents.push(student)
                })
            })

            console.log(allStudents)

            studentList.innerHTML = '';
            allStudents.forEach(ele =>{
                studentList.innerHTML += `
                <div class="student">
                <div class='student-info'>
                <p>${ele.username}</p>
                <input type='hidden' value='${ele.id}' class='questionId'></input>
                </div>
                <span class="material-symbols-rounded">Settings</span>
                </div>
                `
            })
            
            // EDIT AND CREATE QUESTION DIALOGS
            
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
                ele.children[2].addEventListener('click', () => {
                    adminDialog.showModal()
                    modalId.value = ele.children[1].children[2].value
                    modalTitle.value = ele.children[1].children[0].textContent
                    modalDescription.value = ele.children[1].children[1].textContent
                    modalPoints.value = ele.children[0].textContent
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
            
            // EDIT AND CREATE ASSIGNMENTS
            const createAssignmentDialog = document.querySelector('.create-assignment-dialog');
            createAssignmentDialog.innerHTML = `
            <div class="create-assignment-content">
            <h2>Create Assignment</h2>
            <label>Name</label>
            <input type='text' placeholder='Name' class='create-assignment-title'></input>
            <label>Questions</label>
            <div class="questions-for-assignment">
            </div>
            <button class='closeAssignmentModal'>Cancel</button>
            <button class="createAssignmentBtn">Create Assignment</button>
                    </div>
                    `
                    const addAssignment = document.querySelector('.add-assignment')
                    const questionsForAssignment = document.querySelector('.questions-for-assignment')
                    
                    codingProblems.forEach((problem) => {
                        questionsForAssignment.innerHTML += `
                        <label class='question-to-select'>
                        <input type='checkbox'></input>
                        <input type='hidden' value="${problem.id}" class=''></input>
                        ${problem.title}
                        </label>
                        `
                    })
                    
                    addAssignment.addEventListener('click', () => {
                        createAssignmentDialog.showModal();
                    })
                    
                    const createAssignmentButton = document.querySelector('.createAssignmentBtn')
                    
                    createAssignmentButton.addEventListener('click', async(e) => {
                        let selectedProblems = [];
                        const questionList = document.querySelectorAll('.question-to-select');
                        questionList.forEach(question => {
                            inputs = question.children;
                            
                            if (inputs[0].checked == true) selectedProblems.push(inputs[1].value)
                            
                        })
                        
                        const title = document.querySelector('.create-assignment-title').value;
                        console.log(selectedProblems, "HERE")
                        data = {title: title, questions: selectedProblems}
                        
                        await pb.collection('assignments').create(data)
                        createAssignmentDialog.close()
                        snackbarNotification(`${title} created. Your page will be refreshed to display changes momentarily.`)
                        
                        setTimeout(() => {
                    window.location.href = `${BASE_URL}/dashboard.html`
                }, 3000)
            })

            const closeAssignmentModal = document.querySelector('.closeAssignmentModal')
            
            closeAssignmentModal.addEventListener('click', (e) => {
                createAssignmentDialog.close()
            })
            
            const editAssignmentDialog = document.querySelector('.edit-assignment-dialog');
            const editAssignmentButton = document.querySelectorAll('.editAssignmentBtn')
            
            editAssignmentButton.forEach(button => {
                button.addEventListener('click', async(e) => {
                
                    const currentAssingmentId = e.currentTarget.dataset.id;
                    const currentAssignmentObj = await pb.collection('assignments').getOne(currentAssingmentId, {expand: "questions"});
                    
                    editAssignmentDialog.innerHTML = `
                    <div class="create-assignment-content">
                    <h2>Edit Assignment</h2>
                    <input type='hidden' class='edit-assignment-id' value='${currentAssignmentObj.id}' />
                    <label>Name</label>
                    <input type='text' placeholder='Name' class='edit-assignment-title' value="${currentAssignmentObj.title}"></input>
                    <label>Questions</label>
                    <div class="edit-questions-for-assignment">
                    </div>
                    <button class='closeEditAssignmentModal'>Cancel</button>
                    <button class="confirmEditAssignmentBtn">Edit Assignment</button>
                    </div>
                    `

                    const closeEditAssignmentModal = document.querySelector('.closeEditAssignmentModal');

                    closeEditAssignmentModal.addEventListener('click', (e) => {
                        editAssignmentDialog.close()
                    })

                    const questionsForEdit = document.querySelector('.edit-questions-for-assignment');
                    const allQuestionsToShow = await pb.collection('coding_problems').getFullList();
                    
                    const questionsForEditList = []
                    
                    const checkedQuestions = new Set()
                    currentAssignmentObj.expand.questions.forEach((question) => {
                        checkedQuestions.add(question.id)
                    })
    
                    for (let question of allQuestionsToShow) {
                        let ele = {
                            id: question.id,
                            title: question.title,
                            checked: false
                        }
                        if (checkedQuestions.has(question.id)) {
                            ele.checked = true;
                        }
                        questionsForEditList.push(ele)
                    }
    
                    questionsForEditList.forEach((problem) => {
                        questionsForEdit.innerHTML += `
                            <label class='question-to-select'>
                                <input type='checkbox' class='checkboxQuestion' ${problem.checked ? 'checked="true"' : "" }></input>
                                <input type='hidden' value="${problem.id}" class=''></input>
                                ${problem.title}
                            </label>
                        `
    
                    })
    
                    editAssignmentDialog.showModal();

                    const confirmEditAssignmentBtn = document.querySelector('.confirmEditAssignmentBtn');
                    confirmEditAssignmentBtn.addEventListener('click', async(e) => {
                        let title = document.querySelector('.edit-assignment-title').value
                        let questions = document.querySelectorAll('.question-to-select')
                        let selectedQuestions = []
                        questions.forEach((question) => {
                            if (question.children[0].checked) selectedQuestions.push(question.children[1].value)
                        })

                        let editData = {
                            title:title,
                            questions:selectedQuestions,

                        }
                        await pb.collection('assignments').update(currentAssignmentObj.id, editData)
                        
                        editAssignmentDialog.close()
                        snackbarNotification(`${title} updated. Your page will be refreshed to display changes momentarily.`)
                        
                        setTimeout(() => {
                            window.location.href = `${BASE_URL}/dashboard.html`
                        }, 3000)

                    })

                })
            })

            



            // ADMIN DASHBOARD NAVIGATION

            const questionLink = document.querySelector('#question-link')
            const assignmentLink = document.querySelector('#assignment-link')
            const studentLink = document.querySelector('#student-link')

            const questionContainer = document.querySelector('.question-list-container');
            const assignmentContainer = document.querySelector('.assignment-list-container');
            const studentContainer = document.querySelector('.student-list-container');

            questionLink.addEventListener('click', (e) => {
                // SET LINK TO ACTIVE
                assignmentLink.classList.remove('active')
                studentLink.classList.remove('active')

                questionLink.classList.add('active')
                // SHOW QUESTION DIV
                studentContainer.style.display = "none"
                assignmentContainer.style.display = "none"
                questionContainer.style.display = "block"

            })

            assignmentLink.addEventListener('click', (e) => {
                // SET LINK TO ACTIVE
                questionLink.classList.remove('active')
                studentLink.classList.remove('active')

                assignmentLink.classList.add('active')
                // SHOW ASSIGNMENT DIV
                studentContainer.style.display = "none"
                questionContainer.style.display = "none"
                assignmentContainer.style.display = "block"
            })

            studentLink.addEventListener('click', (e) => {
                // SET LINK TO ACTIVE
                assignmentLink.classList.remove('active')
                questionLink.classList.remove('active')
                
                studentLink.classList.add('active')
                // SHOW STUDENT DIV
                questionContainer.style.display = "none"
                assignmentContainer.style.display = "none"
                studentContainer.style.display = "block"
            })






        } else {
            section.style.display = "none"
        }
    }

    getUser()
}
    

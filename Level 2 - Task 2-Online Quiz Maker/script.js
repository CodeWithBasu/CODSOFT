// =========================================
// QUIZZY - SPA Logic & State Management
// =========================================

// --- State ---
let currentUser = null;
let currentQuizzes = [];
let defaultQuizzes = [
    {
        id: '1',
        title: 'JavaScript Basics',
        creator: 'Admin',
        questions: [
            { text: 'Which operator is used to assign a value to a variable?', options: ['*', '-', '=', 'x'], correctAnswer: 2 },
            { text: 'Inside which HTML element do we put the JavaScript?', options: ['<js>', '<script>', '<javascript>', '<scripting>'], correctAnswer: 1 },
            { text: 'How do you write "Hello World" in an alert box?', options: ['msgBox("Hello World");', 'alert("Hello World");', 'msg("Hello World");', 'alertBox("Hello World");'], correctAnswer: 1 }
        ]
    },
    {
        id: '2',
        title: 'CSS Styling Concepts',
        creator: 'Admin',
        questions: [
            { text: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], correctAnswer: 1 },
            { text: 'Which HTML attribute is used to define inline styles?', options: ['styles', 'class', 'style', 'font'], correctAnswer: 2 }
        ]
    }
];

// Active Quiz State
let activeQuiz = null;
let activeQuestionIndex = 0;
let userScore = 0;
let selectedOptionIndex = null;

// --- DOM Elements ---
const views = {
    auth: document.getElementById('auth-view'),
    home: document.getElementById('home-view'),
    list: document.getElementById('quiz-list-view'),
    creation: document.getElementById('quiz-creation-view'),
    taking: document.getElementById('quiz-taking-view'),
    results: document.getElementById('quiz-results-view')
};

// --- Initialization ---
function init() {
    // Load Quizzes
    const savedQuizzes = localStorage.getItem('quizzy_quizzes');
    if (savedQuizzes) {
        currentQuizzes = JSON.parse(savedQuizzes);
    } else {
        currentQuizzes = [...defaultQuizzes];
        saveQuizzes();
    }

    // Check Auth
    const savedUser = localStorage.getItem('quizzy_user');
    if (savedUser) {
        currentUser = savedUser;
        updateNavActions();
        switchView('home');
    } else {
        updateNavActions();
        switchView('auth');
    }
}

// --- Navigation & Views ---
function switchView(viewName) {
    Object.values(views).forEach(view => view.classList.add('hidden'));
    views[viewName].classList.remove('hidden');
    window.scrollTo(0, 0);
}

function updateNavActions() {
    const navActions = document.getElementById('nav-actions');
    if (currentUser) {
        navActions.innerHTML = `
            <span style="color:var(--text-secondary); margin-right:15px;">Hi, ${currentUser}</span>
            <button class="btn btn-outline btn-sm" id="logout-btn">Logout</button>
        `;
        document.getElementById('logout-btn').addEventListener('click', logout);
    } else {
        navActions.innerHTML = '';
    }
}

// --- Toast Notifications ---
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
}

// --- Authentication ---
document.getElementById('nav-logo').addEventListener('click', () => {
    if(currentUser) switchView('home');
});

document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    if (user.length < 3) {
        showToast('Username must be at least 3 characters.');
        return;
    }
    currentUser = user;
    localStorage.setItem('quizzy_user', currentUser);
    updateNavActions();
    switchView('home');
    showToast(`Welcome back, ${currentUser}!`);
});

document.getElementById('toggle-auth').addEventListener('click', () => {
    const title = document.getElementById('auth-title');
    if(title.innerText.includes('Welcome')) {
        title.innerText = 'Create an Account';
        document.getElementById('toggle-auth').innerText = 'Login here';
    } else {
        title.innerText = 'Welcome to Quizzy';
        document.getElementById('toggle-auth').innerText = 'Register here';
    }
});

function logout() {
    currentUser = null;
    localStorage.removeItem('quizzy_user');
    updateNavActions();
    switchView('auth');
    showToast('Logged out successfully.');
}

// --- Home Actions ---
document.getElementById('go-to-create').addEventListener('click', () => {
    initQuizBuilder();
    switchView('creation');
});
document.getElementById('go-to-list').addEventListener('click', () => {
    renderQuizList();
    switchView('list');
});
document.getElementById('back-from-list').addEventListener('click', () => switchView('home'));
document.getElementById('back-from-create').addEventListener('click', () => switchView('home'));
document.getElementById('back-to-home-btn').addEventListener('click', () => switchView('home'));

// --- Quiz Listing ---
function renderQuizList() {
    const container = document.getElementById('quizzes-container');
    container.innerHTML = '';
    
    if(currentQuizzes.length === 0) {
        container.innerHTML = '<p>No quizzes available. Create one to get started!</p>';
        return;
    }

    currentQuizzes.forEach(quiz => {
        const card = document.createElement('div');
        card.className = 'quiz-card glassmorphism';
        card.innerHTML = `
            <h3>${quiz.title}</h3>
            <div class="quiz-meta">
                <span>By: ${quiz.creator}</span>
                <span>${quiz.questions.length} Questions</span>
            </div>
            <button class="btn btn-primary btn-block take-quiz-btn" data-id="${quiz.id}">Start Quiz</button>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.take-quiz-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const quizId = e.target.getAttribute('data-id');
            startQuiz(quizId);
        });
    });
}

// --- Quiz Creation (Builder) ---
let builderQuestions = [];

function initQuizBuilder() {
    document.getElementById('quiz-title').value = '';
    builderQuestions = [];
    addBuilderQuestion(); // Add one by default
}

function addBuilderQuestion() {
    const qObj = { text: '', options: ['', '', '', ''], correctAnswer: 0 };
    builderQuestions.push(qObj);
    renderBuilderQuestions();
}

function renderBuilderQuestions() {
    const container = document.getElementById('questions-builder');
    container.innerHTML = '';
    
    builderQuestions.forEach((q, qIndex) => {
        const block = document.createElement('div');
        block.className = 'question-block';
        
        let optionsHTML = '';
        for(let i=0; i<4; i++) {
            optionsHTML += `
                <div class="option-row">
                    <input type="radio" name="correct-${qIndex}" value="${i}" ${q.correctAnswer === i ? 'checked' : ''} onchange="updateCorrectAnswer(${qIndex}, ${i})">
                    <input type="text" class="input-option" placeholder="Option ${i+1}" value="${q.options[i]}" oninput="updateOptionText(${qIndex}, ${i}, this.value)" required style="width:100%; padding: 0.8rem; background:rgba(0,0,0,0.3); border:1px solid var(--glass-border); border-radius:4px; color:white;">
                </div>
            `;
        }

        block.innerHTML = `
            ${builderQuestions.length > 1 ? `<button class="remove-question" onclick="removeBuilderQuestion(${qIndex})">&times;</button>` : ''}
            <div class="input-group">
                <label>Question ${qIndex + 1}</label>
                <input type="text" placeholder="Enter your question details" value="${q.text}" oninput="updateQuestionText(${qIndex}, this.value)" required>
            </div>
            <label style="display:block; margin-bottom:0.5rem; font-size:0.9rem; color:var(--text-secondary);">Select correct answer & provide options:</label>
            <div class="options-wrapper">
                ${optionsHTML}
            </div>
        `;
        container.appendChild(block);
    });
}

// Global functions for inline HTML handlers
window.updateQuestionText = (qIndex, val) => builderQuestions[qIndex].text = val;
window.updateOptionText = (qIndex, optIndex, val) => builderQuestions[qIndex].options[optIndex] = val;
window.updateCorrectAnswer = (qIndex, val) => builderQuestions[qIndex].correctAnswer = parseInt(val);
window.removeBuilderQuestion = (qIndex) => {
    builderQuestions.splice(qIndex, 1);
    renderBuilderQuestions();
};

document.getElementById('add-question-btn').addEventListener('click', addBuilderQuestion);
document.getElementById('save-quiz-btn').addEventListener('click', () => {
    const title = document.getElementById('quiz-title').value.trim();
    if(!title) return showToast('Quiz Title is required!');
    
    // Validate
    let isValid = true;
    builderQuestions.forEach((q, i) => {
        if(!q.text.trim()) isValid = false;
        q.options.forEach(opt => { if(!opt.trim()) isValid = false; });
    });

    if(!isValid) return showToast('All questions and options must be filled out!');

    const newQuiz = {
        id: Date.now().toString(),
        title: title,
        creator: currentUser,
        questions: builderQuestions
    };

    currentQuizzes.push(newQuiz);
    saveQuizzes();
    showToast('Quiz published successfully!');
    renderQuizList();
    switchView('list');
});

function saveQuizzes() {
    localStorage.setItem('quizzy_quizzes', JSON.stringify(currentQuizzes));
}

// --- Quiz Taking ---
function startQuiz(quizId) {
    activeQuiz = currentQuizzes.find(q => q.id === quizId);
    if(!activeQuiz) return;
    
    activeQuestionIndex = 0;
    userScore = 0;
    
    document.getElementById('taking-quiz-title').innerText = activeQuiz.title;
    switchView('taking');
    renderActiveQuestion();
}

function renderActiveQuestion() {
    selectedOptionIndex = null;
    const question = activeQuiz.questions[activeQuestionIndex];
    document.getElementById('taking-progress').innerText = `Question ${activeQuestionIndex + 1} / ${activeQuiz.questions.length}`;
    document.getElementById('taking-question-text').innerText = question.text;
    
    const optionsContainer = document.getElementById('taking-options');
    optionsContainer.innerHTML = '';
    
    const nextBtn = document.getElementById('next-question-btn');
    nextBtn.disabled = true;
    nextBtn.innerText = (activeQuestionIndex === activeQuiz.questions.length - 1) ? 'Finish Quiz' : 'Next Question';
    nextBtn.onclick = handleNextQuestion; // Need to bind properly

    question.options.forEach((optText, i) => {
        const optDiv = document.createElement('div');
        optDiv.className = 'take-option';
        optDiv.innerText = optText;
        optDiv.onclick = () => selectOption(optDiv, i);
        optionsContainer.appendChild(optDiv);
    });
}

function selectOption(element, index) {
    // If already revealed don't allow changing
    if(!document.getElementById('next-question-btn').disabled) return;

    selectedOptionIndex = index;
    const allOptions = document.querySelectorAll('.take-option');
    allOptions.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    
    const nextBtn = document.getElementById('next-question-btn');
    nextBtn.disabled = false;
    
    // Evaluate Correctness Immediately
    const question = activeQuiz.questions[activeQuestionIndex];
    
    if (selectedOptionIndex === question.correctAnswer) {
        element.classList.add('correct');
        userScore++;
    } else {
        element.classList.add('wrong');
        allOptions[question.correctAnswer].classList.add('correct');
    }
}

function handleNextQuestion() {
    activeQuestionIndex++;
    if (activeQuestionIndex < activeQuiz.questions.length) {
        renderActiveQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    document.getElementById('result-score').innerText = Math.round((userScore / activeQuiz.questions.length) * 100) + '%';
    document.getElementById('result-text').innerText = `You answered ${userScore} out of ${activeQuiz.questions.length} questions correctly.`;
    switchView('results');
}

// Start
init();

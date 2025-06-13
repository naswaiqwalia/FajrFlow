let timerInterval;
let timeLeft = 25 * 60;
let isRunning = false;
let isWork = true;
let currentMode = 'pomodoro';
let workTime = 25;
let breakTime = 5;
let sessionCount = 0;

const timerDisplay = document.querySelector('.timer-display');
const progressBar = document.querySelector('.progress');
const startBtn = document.querySelector('#start-btn');
const pauseBtn = document.querySelector('#pause-btn');
const resetBtn = document.querySelector('#reset-btn');
const modeButtons = document.querySelectorAll('.mode-btn');
const customInput = document.querySelector('.custom-input');
const customWork = document.querySelector('#custom-work');
const customBreak = document.querySelector('#custom-break');
const sessionCountDisplay = document.querySelector('#session-count');

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const progress = isWork ? (1 - timeLeft / (workTime * 60)) * 100 : (1 - timeLeft / (breakTime * 60)) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                isWork = !isWork;
                if (isWork) {
                    timeLeft = workTime * 60;
                    sessionCount++;
                    sessionCountDisplay.textContent = sessionCount;
                    checkForBadge();
                    saveSessionCount();
                    showGratitudePrompt();
                } else {
                    timeLeft = breakTime * 60;
                    showPrayerSuggestion();
                }
                updateTimerDisplay();
            }
        }, 1000);
    }
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    timeLeft = workTime * 60;
    isWork = true;
    updateTimerDisplay();
}

modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        if (currentMode === 'pomodoro') {
            workTime = 25;
            breakTime = 5;
            customInput.classList.add('hidden');
        } else if (currentMode === 'deepwork') {
            workTime = 50;
            breakTime = 10;
            customInput.classList.add('hidden');
        } else {
            customInput.classList.remove('hidden');
            workTime = parseInt(customWork.value) || 25;
            breakTime = parseInt(customBreak.value) || 5;
        }
        resetTimer();
    });
});

customWork.addEventListener('input', () => {
    workTime = parseInt(customWork.value) || 25;
    resetTimer();
});
customBreak.addEventListener('input', () => {
    breakTime = parseInt(customBreak.value) || 5;
    resetTimer();
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

const todoText = document.getElementById('todo-text');
const todoSubject = document.getElementById('todo-subject');
const todoDeadline = document.getElementById('todo-deadline');
const addTodoBtn = document.getElementById('add-todo');
const todoList = document.getElementById('todo-list');
const todoCompleted = document.getElementById('todo-completed');
const todoTotal = document.getElementById('todo-total');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function isDeadlineNear(deadline) {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const oneDayBefore = new Date(deadlineDate);
    oneDayBefore.setDate(deadlineDate.getDate() - 1);
    return today.toDateString() === oneDayBefore.toDateString();
}

function renderTodos() {
    todoList.innerHTML = '';
    let completedCount = 0;
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        if (isDeadlineNear(todo.deadline) && !todo.completed) {
            li.classList.add('deadline-near');
        }
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''}>
            <span>${todo.text} (${todo.subject || 'No Subject'}) ${todo.deadline ? 'Due: ' + todo.deadline : ''}</span>
            <button class="delete-btn">Delete</button>
        `;
        const checkbox = li.querySelector('input');
        checkbox.addEventListener('change', () => {
            todos[index].completed = checkbox.checked;
            saveTodos();
            renderTodos();
        });
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });
        todoList.appendChild(li);
        if (todo.completed) completedCount++;
    });
    todoCompleted.textContent = completedCount;
    todoTotal.textContent = todos.length;
}

addTodoBtn.addEventListener('click', () => {
    const text = todoText.value.trim();
    const subject = todoSubject.value;
    const deadline = todoDeadline.value;
    if (text && subject) {
        todos.push({
            text,
            subject,
            deadline,
            completed: false
        });
        saveTodos();
        renderTodos();
        todoText.value = '';
        todoSubject.value = '';
        todoDeadline.value = '';
    }
});

renderTodos();

let moods = JSON.parse(localStorage.getItem('moods')) || [];
const moodSelect = document.querySelector('#mood-select');
const addMoodBtn = document.querySelector('#add-mood');
const todayMoodDisplay = document.querySelector('#today-mood');

function saveMood() {
    localStorage.setItem('moods', JSON.stringify(moods));
}

function renderTodayMood() {
    const today = new Date().toLocaleDateString();
    const todayMood = moods.find(m => m.date === today);
    todayMoodDisplay.textContent = todayMood ? todayMood.mood : 'Not set yet';
}

addMoodBtn.addEventListener('click', () => {
    const mood = moodSelect.value;
    const today = new Date().toLocaleDateString();
    const existingMood = moods.find(m => m.date === today);
    if (existingMood) {
        existingMood.mood = mood;
    } else {
        moods.push({ date: today, mood });
    }
    saveMood();
    renderTodayMood();
});

let badges = JSON.parse(localStorage.getItem('badges')) || [];
const badgeGrid = document.querySelector('#badge-grid');

function saveBadges() {
    localStorage.setItem('badges', JSON.stringify(badges));
}

function renderBadges() {
    badgeGrid.innerHTML = '';
    badges.forEach(badge => {
        const div = document.createElement('div');
        div.classList.add('badge');
        div.textContent = badge.emoji;
        div.setAttribute('data-date', badge.date);
        badgeGrid.appendChild(div);
    });
}

function checkForBadge() {
    const today = new Date().toLocaleDateString();
    const todayMood = moods.find(m => m.date === today);
    if (todayMood && ['😊', '😊👍'].includes(todayMood.mood)) {
        const badgeEmojis = ['🌟', '💖', '🦋', '🌸'];
        const randomEmoji = badgeEmojis[Math.floor(Math.random() * badgeEmojis.length)];
        badges.push({ emoji: randomEmoji, date: today });
        saveBadges();
        renderBadges();
    }
}

function saveSessionCount() {
    localStorage.setItem('sessionCount', sessionCount);
}

let gratitudes = JSON.parse(localStorage.getItem('gratitudes')) || [];
const gratitudeText = document.querySelector('#gratitude-text');
const addGratitudeBtn = document.querySelector('#add-gratitude');
const gratitudeList = document.querySelector('#gratitude-list');
const viewWeeklyBtn = document.querySelector('#view-weekly-gratitude');
const weeklyGratitudeList = document.querySelector('#weekly-gratitude');

function saveGratitudes() {
    localStorage.setItem('gratitudes', JSON.stringify(gratitudes));
}

function renderGratitude() {
    gratitudeList.innerHTML = '';
    const today = new Date().toLocaleDateString();
    const todayGratitudes = gratitudes.filter(g => g.date === today);
    todayGratitudes.forEach(g => {
        const li = document.createElement('li');
        li.textContent = g.text;
        gratitudeList.appendChild(li);
    });
}

function renderWeeklyGratitude() {
    weeklyGratitudeList.innerHTML = '';
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyGratitudes = gratitudes.filter(g => {
        const gDate = new Date(g.date.split('/').reverse().join('-'));
        return gDate >= oneWeekAgo && gDate <= today;
    });
    weeklyGratitudes.forEach(g => {
        const li = document.createElement('li');
        li.textContent = `${g.date}: ${g.text}`;
        weeklyGratitudeList.appendChild(li);
    });
}

function showGratitudePrompt() {
    gratitudeText.focus();
}

addGratitudeBtn.addEventListener('click', () => {
    if (gratitudeText.value.trim()) {
        const today = new Date().toLocaleDateString();
        gratitudes.push({
            text: gratitudeText.value.trim(),
            date: today
        });
        gratitudeText.value = '';
        saveGratitudes();
        renderGratitude();
    }
});

viewWeeklyBtn.addEventListener('click', () => {
    weeklyGratitudeList.classList.toggle('hidden');
    if (!weeklyGratitudeList.classList.contains('hidden')) {
        renderWeeklyGratitude();
        viewWeeklyBtn.textContent = 'Hide Weekly Gratitude';
    } else {
        viewWeeklyBtn.textContent = 'View Weekly Gratitude';
    }
});

const focusModeBtn = document.querySelector('#focus-mode-btn');
focusModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('focus-mode');
    focusModeBtn.textContent = document.body.classList.contains('focus-mode') ? 'Exit Focus' : 'Focus Mode';
});

sessionCount = parseInt(localStorage.getItem('sessionCount')) || 0;
sessionCountDisplay.textContent = sessionCount;
updateTimerDisplay();
renderTodos();
renderTodayMood();
renderBadges();
renderGratitude();
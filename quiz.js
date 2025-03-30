let currentQuestionIndex = 0;
let selectedOption = null;
let timeLeft = 60;
let timerInterval;

async function fetchQuiz(subtopicId) {
    try {
        const response = await fetch('https://67e8f074bdcaa2b7f5b82880.mockapi.io/quizs');
        const quizzes = await response.json();
        const quiz = quizzes.find(q => q.id == parseInt(subtopicId));
        if (!quiz) {
            console.warn(`Không tìm thấy quiz với subtopicId=${subtopicId}`);
        }
        return quiz;
    } catch (error) {
        console.error('Lỗi khi fetch dữ liệu từ API quizs:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const subtopicId = urlParams.get('subtopicId');

    const quiz = await fetchQuiz(subtopicId);

    if (!quiz) {
        document.getElementById('questionText').textContent = `Không tìm thấy quiz với ID ${subtopicId}!`;
        return;
    }

    document.getElementById('quizTitle').textContent = `Quiz: ${quiz.title}`;
    document.getElementById('totalQuestions').textContent = quiz.questions.length;
    loadQuestion(quiz);

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Hết thời gian!");
            window.location.href = "index.html";
        }
    }, 1000);
});

function loadQuestion(quiz) {
    const question = quiz.questions[currentQuestionIndex];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectOption(optionElement, question.answer, index));
        optionsContainer.appendChild(optionElement);
    });

    document.getElementById('nextBtn').disabled = true;
    selectedOption = null;
}

function selectOption(optionElement, correctAnswer, index) {
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    optionElement.classList.add('selected');
    selectedOption = String.fromCharCode(65 + index); // A, B, C, D
    document.getElementById('nextBtn').disabled = false;
}

document.getElementById('nextBtn').addEventListener('click', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const subtopicId = urlParams.get('subtopicId');
    const quiz = await fetchQuiz(subtopicId);
    const question = quiz.questions[currentQuestionIndex];

    if (selectedOption === question.answer) {
        alert("Đúng rồi!");
    } else {
        alert(`Sai! Đáp án đúng là: ${question.answer}`);
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < quiz.questions.length) {
        loadQuestion(quiz);
    } else {
        clearInterval(timerInterval);
        alert("Hoàn thành quiz!");
        window.location.href = "index.html";
    }
});
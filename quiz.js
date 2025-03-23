// quiz.js
// Dữ liệu mẫu cho các câu hỏi (có thể mở rộng)
const quizData = {
    11: { // Văn hóa
        title: "Văn hóa",
        questions: [
            { question: "Đâu là thủ đô của Nhật Bản?", options: ["A. Tokyo", "B. Osaka", "C. Kyoto", "D. Hiroshima"], answer: "A" },
            { question: "Món ăn truyền thống của Việt Nam là gì?", options: ["A. Sushi", "B. Phở", "C. Pizza", "D. Hamburger"], answer: "B" }
        ]
    },
    12: { // Lịch sử
        title: "Lịch sử",
        questions: [
            { question: "Ai là vị vua đầu tiên của Việt Nam?", options: ["A. Lý Thái Tổ", "B. Hùng Vương", "C. Trần Hưng Đạo", "D. Nguyễn Huệ"], answer: "B" }
        ]
    },
    21: { // Hình học
        title: "Hình học",
        questions: [
            { question: "Tổng các góc trong tam giác bằng bao nhiêu độ?", options: ["A. 90", "B. 180", "C. 360", "D. 270"], answer: "B" }
        ]
    },
    22: { // Toán số
        title: "Toán số",
        questions: [
            { question: "2 + 2 bằng bao nhiêu?", options: ["A. 3", "B. 4", "C. 5", "D. 6"], answer: "B" }
        ]
    },
    31: { // Lập trình
        title: "Lập trình",
        questions: [
            { question: "Ngôn ngữ lập trình nào phổ biến nhất?", options: ["A. Python", "B. Java", "C. C++", "D. Ruby"], answer: "A" }
        ]
    },
    41: { // Ngữ pháp
        title: "Ngữ pháp",
        questions: [
            { question: "Đâu là thì hiện tại đơn?", options: ["A. I go", "B. I went", "C. I will go", "D. I am going"], answer: "A" }
        ]
    },
    42: { // Từ vựng
        title: "Từ vựng",
        questions: [
            { question: "Từ 'Happy' nghĩa là gì?", options: ["A. Buồn", "B. Vui", "C. Tức giận", "D. Mệt mỏi"], answer: "B" }
        ]
    }
};

let currentQuestionIndex = 0;
let selectedOption = null;
let timeLeft = 60;
let timerInterval;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const subtopicId = urlParams.get('subtopicId');
    const quiz = quizData[subtopicId];

    if (!quiz) {
        document.getElementById('questionText').textContent = "Không tìm thấy quiz!";
        return;
    }

    document.getElementById('quizTitle').textContent = `Quiz: ${quiz.title}`;
    document.getElementById('totalQuestions').textContent = quiz.questions.length;
    loadQuestion(quiz);

    // Khởi động đồng hồ
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

document.getElementById('nextBtn').addEventListener('click', () => {
    const quiz = quizData[new URLSearchParams(window.location.search).get('subtopicId')];
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
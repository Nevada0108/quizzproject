document.addEventListener('DOMContentLoaded', () => {
    const questionContainer = document.getElementById('questionContainer');
    const nextQuestionBtn = document.getElementById('nextQuestion');
    const prevQuestionBtn = document.getElementById('prevQuestion');
    const editQuizForm = document.getElementById('editQuizForm');
    const quizTitleInput = document.getElementById('quizTitleInput');
    const quizQuestionsInput = document.getElementById('quizQuestions');

    let currentQuestionIndex = 0;
    let quizData = {
        id: null,
        title: "",
        questions: []
    };

    // Lấy ID từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');

    // Tải dữ liệu quiz từ API
    async function loadQuiz() {
        try {
            const response = await fetch(`https://67e8f074bdcaa2b7f5b82880.mockapi.io/quizs/${quizId}`);
            if (!response.ok) throw new Error('Lỗi khi tải quiz');
            const quiz = await response.json();
            quizData = { ...quiz };
            quizTitleInput.value = quiz.title;
            quizQuestionsInput.value = quiz.questions.length;
            displayQuestion(currentQuestionIndex);
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Không thể tải quiz để chỉnh sửa!');
        }
    }

    // Gắn sự kiện cho nút "Chọn đúng"
    function attachCorrectButtonListeners(questionBlock) {
        const correctButtons = questionBlock.querySelectorAll('.correct-btn');
        const answerInputs = questionBlock.querySelectorAll('.answer-input');

        correctButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                answerInputs.forEach(input => input.classList.remove('correct'));
                const answerLetter = btn.getAttribute('data-answer');
                const input = questionBlock.querySelector(`input[placeholder="Đáp án ${answerLetter}"]`);
                if (input) input.classList.add('correct');
            });
        });
    }

    // Kiểm tra dữ liệu câu hỏi hiện tại
    function validateCurrentQuestion() {
        const block = questionContainer.querySelector('.question-block');
        if (!block) return false;

        const questionText = block.querySelector('textarea').value.trim();
        const answers = Array.from(block.querySelectorAll('.answer-input')).map(input => input.value.trim());
        const correctAnswer = block.querySelector('.answer-input.correct');

        if (!questionText) {
            alert('Vui lòng nhập nội dung câu hỏi!');
            return false;
        }
        if (answers.some(answer => !answer)) {
            alert('Vui lòng nhập đầy đủ tất cả các đáp án!');
            return false;
        }
        if (!correctAnswer) {
            alert('Vui lòng chọn đáp án đúng!');
            return false;
        }
        return true;
    }

    // Lưu dữ liệu câu hỏi hiện tại
    function saveCurrentQuestion() {
        const block = questionContainer.querySelector('.question-block');
        if (!block) return;

        const questionText = block.querySelector('textarea').value.trim();
        const answers = [
            `A. ${block.querySelector('input[placeholder="Đáp án A"]').value.trim()}`,
            `B. ${block.querySelector('input[placeholder="Đáp án B"]').value.trim()}`,
            `C. ${block.querySelector('input[placeholder="Đáp án C"]').value.trim()}`,
            `D. ${block.querySelector('input[placeholder="Đáp án D"]').value.trim()}`
        ];
        const correctAnswer = block.querySelector('.answer-input.correct')?.getAttribute('placeholder').replace('Đáp án ', '');

        if (questionText && answers.every(a => a.length > 3) && correctAnswer) {
            quizData.questions[currentQuestionIndex] = {
                question: questionText,
                options: answers,
                answer: correctAnswer
            };
        }
    }

    // Hiển thị câu hỏi tại chỉ số cụ thể
    function displayQuestion(index) {
        questionContainer.innerHTML = '';
        const question = quizData.questions[index] || { question: '', options: ['', '', '', ''], answer: '' };
        const newQuestion = createQuestionBlock(index + 1);

        newQuestion.querySelector('textarea').value = question.question || '';
        const answerInputs = newQuestion.querySelectorAll('.answer-input');
        answerInputs[0].value = question.options[0]?.replace('A. ', '') || '';
        answerInputs[1].value = question.options[1]?.replace('B. ', '') || '';
        answerInputs[2].value = question.options[2]?.replace('C. ', '') || '';
        answerInputs[3].value = question.options[3]?.replace('D. ', '') || '';
        if (question.answer) {
            newQuestion.querySelector(`input[placeholder="Đáp án ${question.answer}"]`).classList.add('correct');
        }

        questionContainer.appendChild(newQuestion);
        attachCorrectButtonListeners(newQuestion);

        prevQuestionBtn.disabled = index === 0;
        nextQuestionBtn.textContent = index === quizData.questions.length - 1 ? 'Câu hỏi cuối' : 'Câu hỏi tiếp theo';
    }

    // Chuyển sang câu hỏi tiếp theo
    nextQuestionBtn.addEventListener('click', () => {
        if (!validateCurrentQuestion()) return;

        saveCurrentQuestion();
        if (currentQuestionIndex < quizData.questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion(currentQuestionIndex);
        } else if (currentQuestionIndex < parseInt(quizQuestionsInput.value) - 1) {
            quizData.questions.push({ question: '', options: ['', '', '', ''], answer: '' });
            currentQuestionIndex++;
            displayQuestion(currentQuestionIndex);
        } else {
            alert('Đã đến câu hỏi cuối cùng!');
        }
    });

    // Chuyển về câu hỏi trước
    prevQuestionBtn.addEventListener('click', () => {
        if (currentQuestionIndex <= 0) return;

        saveCurrentQuestion();
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
    });

    // Xử lý submit form
    editQuizForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateCurrentQuestion()) return;
        saveCurrentQuestion();

        quizData.title = quizTitleInput.value.trim();
        if (!quizData.title) {
            alert('Vui lòng nhập tiêu đề quiz!');
            return;
        }

        const totalQuestions = parseInt(quizQuestionsInput.value);
        if (quizData.questions.length < totalQuestions) {
            alert('Số câu hỏi chưa đủ theo số lượng đã nhập!');
            return;
        }
        quizData.questions = quizData.questions.slice(0, totalQuestions); // Cắt bớt nếu vượt quá

        try {
            const response = await fetch(`https://67e8f074bdcaa2b7f5b82880.mockapi.io/quizs/${quizId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quizData)
            });

            if (!response.ok) throw new Error('Lỗi khi cập nhật quiz');
            alert('Quiz đã được cập nhật thành công!');
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra khi lưu thay đổi!');
        }
    });

    // Tạo khối câu hỏi
    function createQuestionBlock(count) {
        const newQuestion = document.createElement('div');
        newQuestion.classList.add('question-block', 'mb-4');
        newQuestion.setAttribute('data-question', count);
        newQuestion.innerHTML = `
            <h3>Câu hỏi ${count}</h3>
            <div class="mb-3">
                <label class="form-label">Nội dung câu hỏi:</label>
                <textarea class="form-control" rows="2" placeholder="Nhập câu hỏi..." required></textarea>
            </div>
            <div class="row">
                <div class="col-md-6 mb-2">
                    <label class="form-label">Đáp án A:</label>
                    <input type="text" class="form-control answer-input" placeholder="Đáp án A" required>
                    <button type="button" class="btn btn-sm btn-outline-danger mt-1 correct-btn" data-answer="A">Chọn đúng</button>
                </div>
                <div class="col-md-6 mb-2">
                    <label class="form-label">Đáp án B:</label>
                    <input type="text" class="form-control answer-input" placeholder="Đáp án B" required>
                    <button type="button" class="btn btn-sm btn-outline-danger mt-1 correct-btn" data-answer="B">Chọn đúng</button>
                </div>
                <div class="col-md-6 mb-2">
                    <label class="form-label">Đáp án C:</label>
                    <input type="text" class="form-control answer-input" placeholder="Đáp án C" required>
                    <button type="button" class="btn btn-sm btn-outline-danger mt-1 correct-btn" data-answer="C">Chọn đúng</button>
                </div>
                <div class="col-md-6 mb-2">
                    <label class="form-label">Đáp án D:</label>
                    <input type="text" class="form-control answer-input" placeholder="Đáp án D" required>
                    <button type="button" class="btn btn-sm btn-outline-danger mt-1 correct-btn" data-answer="D">Chọn đúng</button>
                </div>
            </div>
        `;
        return newQuestion;
    }

    // Khởi chạy
    if (quizId) loadQuiz();
    else alert('Không tìm thấy ID quiz để chỉnh sửa!');
});
document.addEventListener('DOMContentLoaded', () => {
    const questionContainer = document.getElementById('questionContainer');
    const nextQuestionBtn = document.getElementById('nextQuestion');
    const quizForm = document.getElementById('quizForm');
    const quizQuestionsInput = document.getElementById('quizQuestions');
    let questionCount = 1;
    let quizData = {
        title: "",
        questions: []
    };

    // Gắn sự kiện cho các nút "Chọn đúng"
    function attachCorrectButtonListeners(questionBlock) {
        const correctButtons = questionBlock.querySelectorAll('.correct-btn');
        const answerInputs = questionBlock.querySelectorAll('.answer-input');

        correctButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                answerInputs.forEach(input => input.classList.remove('correct'));
                const answerLetter = btn.getAttribute('data-answer');
                const input = questionBlock.querySelector(`input[placeholder="Đáp án ${answerLetter}"]`);
                if (input) {
                    input.classList.add('correct');
                }
            });
        });
    }

    // Gắn sự kiện cho câu hỏi đầu tiên
    const initialQuestionBlock = questionContainer.querySelector('.question-block');
    if (initialQuestionBlock) {
        attachCorrectButtonListeners(initialQuestionBlock);
    }

    // Chuyển sang câu hỏi tiếp theo
    nextQuestionBtn.addEventListener('click', () => {
        const totalQuestions = parseInt(quizQuestionsInput.value) || 0;
        if (questionCount >= totalQuestions) {
            alert('Bạn đã nhập đủ số câu hỏi! Nhấn "Hoàn tất" để lưu.');
            return;
        }

        saveCurrentQuestion();
        questionContainer.innerHTML = '';
        questionCount++;
        const newQuestion = createQuestionBlock(questionCount);
        questionContainer.appendChild(newQuestion);
        attachCorrectButtonListeners(newQuestion);
    });

    // Xử lý khi submit form
    quizForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Lưu câu hỏi cuối cùng
        saveCurrentQuestion();

        // Lấy title từ input
        quizData.title = document.getElementById('quizTitleInput').value;

        // Kiểm tra dữ liệu
        const totalQuestions = parseInt(quizQuestionsInput.value);
        if (quizData.questions.length !== totalQuestions) {
            alert('Số câu hỏi chưa đủ theo số lượng đã nhập!');
            return;
        }

        if (quizData.questions.some(q => !q.answer)) {
            alert('Vui lòng chọn đáp án đúng cho tất cả các câu hỏi!');
            return;
        }

        // Gửi dữ liệu lên API
        try {
            const response = await fetch('https://67e8f074bdcaa2b7f5b82880.mockapi.io/quizs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quizData)
            });

            if (!response.ok) {
                throw new Error('Lỗi khi gửi dữ liệu lên API');
            }

            const savedQuiz = await response.json();
            console.log('Quiz đã được lưu:', savedQuiz);
            alert('Quiz đã được tạo thành công!');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra khi lưu quiz!');
        }
    });

    // Hàm tạo khối câu hỏi mới
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

    // Hàm lưu dữ liệu câu hỏi hiện tại
    function saveCurrentQuestion() {
        const block = questionContainer.querySelector('.question-block');
        if (!block) return;

        const questionText = block.querySelector('textarea').value;
        const answers = [
            `A. ${block.querySelector('input[placeholder="Đáp án A"]').value}`,
            `B. ${block.querySelector('input[placeholder="Đáp án B"]').value}`,
            `C. ${block.querySelector('input[placeholder="Đáp án C"]').value}`,
            `D. ${block.querySelector('input[placeholder="Đáp án D"]').value}`
        ];
        const correctAnswer = block.querySelector('.answer-input.correct')?.getAttribute('placeholder').replace('Đáp án ', '');

        if (questionText && answers.every(a => a.length > 3) && correctAnswer) { // Kiểm tra dữ liệu hợp lệ
            quizData.questions[questionCount - 1] = {
                question: questionText,
                options: answers, // Trực tiếp dùng mảng answers với định dạng "A. text"
                answer: correctAnswer
            };
        }
    }
});
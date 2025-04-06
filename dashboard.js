document.addEventListener('DOMContentLoaded', () => {
    const quizList = document.getElementById('quizList');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const quizDetailModal = new bootstrap.Modal(document.getElementById('quizDetailModal'));
    const quizDetailContent = document.getElementById('quizDetailContent');

    let quizzes = [];
    let currentPage = 1;
    const quizzesPerPage = 5;

    // Lấy danh sách quiz từ API
    async function fetchQuizzes() {
        try {
            quizList.innerHTML = '<p>Đang tải...</p>';
            const response = await fetch('https://67e8f074bdcaa2b7f5b82880.mockapi.io/quizs');
            if (!response.ok) throw new Error(`Lỗi khi lấy danh sách quiz: ${response.status}`);
            quizzes = await response.json();
            applyFiltersAndDisplay();
        } catch (error) {
            console.error('Lỗi:', error);
            quizList.innerHTML = '<p>Có lỗi xảy ra khi tải danh sách quiz! Vui lòng kiểm tra API.</p>';
        }
    }

    // Áp dụng tìm kiếm, sắp xếp và phân trang
    function applyFiltersAndDisplay() {
        let filteredQuizzes = [...quizzes];

        // Tìm kiếm
        const searchText = searchInput.value.toLowerCase();
        filteredQuizzes = filteredQuizzes.filter(quiz => quiz.title.toLowerCase().includes(searchText));

        // Sắp xếp
        const sortValue = sortSelect.value;
        filteredQuizzes.sort((a, b) => {
            if (sortValue === 'title-asc') return a.title.localeCompare(b.title);
            if (sortValue === 'title-desc') return b.title.localeCompare(a.title);
            if (sortValue === 'questions-asc') return a.questions.length - b.questions.length;
            if (sortValue === 'questions-desc') return b.questions.length - a.questions.length;
            return 0;
        });

        // Phân trang
        const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);
        currentPage = Math.min(currentPage, totalPages || 1);
        const start = (currentPage - 1) * quizzesPerPage;
        const end = start + quizzesPerPage;
        const paginatedQuizzes = filteredQuizzes.slice(start, end);

        displayQuizzes(paginatedQuizzes);
        updatePagination(totalPages, filteredQuizzes.length);
    }

    // Hiển thị danh sách quiz
    function displayQuizzes(quizzesToShow) {
        quizList.innerHTML = '';
        if (quizzesToShow.length === 0) {
            quizList.innerHTML = '<p>Không tìm thấy quiz nào!</p>';
            return;
        }

        quizzesToShow.forEach(quiz => {
            const quizItem = document.createElement('div');
            quizItem.classList.add('quiz-item');
            quizItem.innerHTML = `
                <div>
                    <h3><a href="#" class="view-quiz" data-id="${quiz.id}">${quiz.title}</a></h3>
                    <p>${quiz.questions.length} câu hỏi</p>
                </div>
                <div>
                    <button class="btn btn-primary btn-sm edit-btn" data-id="${quiz.id}">Chỉnh sửa</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${quiz.id}">Xóa</button>
                </div>
            `;
            quizList.appendChild(quizItem);

            quizItem.querySelector('.delete-btn').addEventListener('click', () => deleteQuiz(quiz.id));
            quizItem.querySelector('.edit-btn').addEventListener('click', () => window.location.href = `editquiz.html?id=${quiz.id}`);
            quizItem.querySelector('.view-quiz').addEventListener('click', (e) => {
                e.preventDefault();
                viewQuiz(quiz.id);
            });
        });
    }

    // Xóa quiz
    async function deleteQuiz(quizId) {
        if (!confirm('Bạn có chắc chắn muốn xóa quiz này không?')) return;

        try {
            const response = await fetch(`https://67e8f074bdcaa2b7f5b82880.mockapi.io/quizs/${quizId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`Lỗi khi xóa quiz: ${response.status}`);
            alert('Quiz đã được xóa thành công!');
            fetchQuizzes();
        } catch (error) {
            console.error('Lỗi:', error);
            alert(`Không thể xóa quiz với ID ${quizId}. Có thể quiz không tồn tại!`);
        }
    }

    // Xem chi tiết quiz trong modal
    async function viewQuiz(quizId) {
        try {
            const response = await fetch(`https://67e8f074bdcaa2b7f5b82880.mockapi.io/quizs/${quizId}`);
            if (!response.ok) throw new Error(`Lỗi khi xem chi tiết: ${response.status}`);
            const quiz = await response.json();

            // Tạo nội dung chi tiết
            quizDetailContent.innerHTML = `
                <h4>${quiz.title}</h4>
                <p><strong>Số câu hỏi:</strong> ${quiz.questions.length}</p>
                <hr>
            `;
            quiz.questions.forEach((q, i) => {
                const questionDiv = document.createElement('div');
                questionDiv.classList.add('question-detail');
                questionDiv.innerHTML = `
                    <h6>Câu ${i + 1}: ${q.question}</h6>
                    <p><strong>Đáp án:</strong> ${q.options.join(', ')}</p>
                    <p><strong>Đáp án đúng:</strong> <span class="correct-answer">${q.answer}</span></p>
                `;
                quizDetailContent.appendChild(questionDiv);
            });

            // Hiển thị modal
            quizDetailModal.show();
        } catch (error) {
            console.error('Lỗi:', error);
            alert(`Không thể xem chi tiết quiz với ID ${quizId}. Có thể quiz không tồn tại!`);
        }
    }

    // Cập nhật phân trang
    function updatePagination(totalPages, totalItems) {
        pageInfo.textContent = `Trang ${currentPage} / ${totalPages} (${totalItems} quiz)`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Sự kiện tìm kiếm, sắp xếp, phân trang
    searchInput.addEventListener('input', applyFiltersAndDisplay);
    sortSelect.addEventListener('change', applyFiltersAndDisplay);
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            applyFiltersAndDisplay();
        }
    });
    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(quizzes.length / quizzesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            applyFiltersAndDisplay();
        }
    });

    // Khởi chạy
    fetchQuizzes();
});
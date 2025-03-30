// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCNOAnAd3eilEIz88EZYLwRQmQi2gIYpp0",
    authDomain: "spck-jsi-d16b4.firebaseapp.com",
    databaseURL: "https://spck-jsi-d16b4-default-rtdb.firebaseio.com",
    projectId: "spck-jsi-d16b4",
    storageBucket: "spck-jsi-d16b4.firebasestorage.app",
    messagingSenderId: "942812593050",
    appId: "1:942812593050:web:7188325f7c08b9aedfd823"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Fetch dữ liệu từ API quizs
async function fetchQuizzes() {
    try {
        const response = await fetch('https://67e8f074bdcaa2b7f5b82880.mockapi.io/quizs');
        const quizzes = await response.json();
        return quizzes;
    } catch (error) {
        console.error('Lỗi khi fetch dữ liệu từ API quizs:', error);
        return [];
    }
}

// Hiển thị tất cả quiz (thay cho topics)
async function displayTopics() {
    const topicsContainer = document.getElementById('topicsContainer');
    if (!topicsContainer) return; // Kiểm tra nếu không tìm thấy phần tử
    topicsContainer.innerHTML = '';

    const quizzes = await fetchQuizzes(); // Lấy dữ liệu từ API quizs

    // Tạo một section duy nhất cho tất cả các quiz
    const topicSection = document.createElement('div');
    topicSection.classList.add('topic-section');
    topicSection.innerHTML = `<h2 class="topic-title">Danh sách Quiz</h2>`;

    const subtopicsGrid = document.createElement('div');
    subtopicsGrid.classList.add('subtopics-grid');

    quizzes.forEach((quiz, index) => {
        const topicCard = document.createElement('div');
        topicCard.classList.add('topic-card');
        topicCard.style.animationDelay = `${index * 0.2}s`;
        topicCard.innerHTML = `
            <h3>${quiz.title}</h3>
            <p>${quiz.questions.length} câu hỏi</p>
        `;
        topicCard.addEventListener('click', () => startQuiz(quiz.id));
        subtopicsGrid.appendChild(topicCard);
    });

    topicSection.appendChild(subtopicsGrid);
    topicsContainer.appendChild(topicSection);
}

// Hiển thị quiz nổi bật (giả định không có thuộc tính featured trong API quizs)
async function displayFeaturedTopics() {
    const featuredGrid = document.getElementById('featuredGrid');
    if (!featuredGrid) return; // Kiểm tra nếu không tìm thấy phần tử

    const quizzes = await fetchQuizzes(); // Lấy dữ liệu từ API quizs
    featuredGrid.innerHTML = '';

    // Giả định chọn các quiz có số câu hỏi >= 15 làm nổi bật (hoặc bạn cần thêm logic khác)
    const featuredQuizzes = quizzes.filter(quiz => quiz.questions.length >= 15);

    featuredQuizzes.forEach((quiz, index) => {
        const topicCard = document.createElement('div');
        topicCard.classList.add('topic-card');
        topicCard.style.animationDelay = `${index * 0.2}s`;
        topicCard.innerHTML = `
            <h3>${quiz.title}</h3>
            <p>${quiz.questions.length} câu hỏi</p>
        `;
        topicCard.addEventListener('click', () => startQuiz(quiz.id));
        featuredGrid.appendChild(topicCard);
    });
}

// Hiển thị thanh quiz nổi bật
async function displayFeaturedBar() {
    const featuredBar = document.getElementById('featuredBar');
    if (!featuredBar) return; // Kiểm tra nếu không tìm thấy phần tử

    const quizzes = await fetchQuizzes(); // Lấy dữ liệu từ API quizs
    const featuredQuizzes = quizzes.filter(quiz => quiz.questions.length >= 15); // Giả định nổi bật

    featuredBar.innerHTML = '';
    featuredQuizzes.forEach(quiz => {
        const tag = document.createElement('div');
        tag.classList.add('featured-tag');
        tag.textContent = quiz.title;
        tag.addEventListener('click', () => filterByFeatured(quiz.title));
        featuredBar.appendChild(tag);
    });
}

// Chuyển hướng đến trang quiz
function startQuiz(quizId) {
    window.location.href = `quiz.html?subtopicId=${quizId}`;
}

// Thiết lập tìm kiếm và lọc
async function setupSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    if (!searchInput || !filterSelect) return; // Kiểm tra nếu không tìm thấy phần tử

    const quizzes = await fetchQuizzes(); // Lấy dữ liệu từ API quizs

    function filterQuizzes() {
        const searchText = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value;

        const filteredQuizzes = quizzes.filter(quiz => 
            quiz.title.toLowerCase().includes(searchText)
        ).filter(quiz => {
            if (filterValue === 'all') return true;
            const questionLimit = parseInt(filterValue);
            return filterValue === '10' ? quiz.questions.length < 15 : quiz.questions.length >= 15;
        });

        displayFilteredTopics(filteredQuizzes);
    }

    searchInput.addEventListener('input', filterQuizzes);
    filterSelect.addEventListener('change', filterQuizzes);
}

// Hiển thị quiz đã lọc (thay cho topics)
function displayFilteredTopics(filteredQuizzes) {
    const topicsContainer = document.getElementById('topicsContainer');
    if (!topicsContainer) return; // Kiểm tra nếu không tìm thấy phần tử
    topicsContainer.innerHTML = '';

    const topicSection = document.createElement('div');
    topicSection.classList.add('topic-section');
    topicSection.innerHTML = `<h2 class="topic-title">Danh sách Quiz</h2>`;

    const subtopicsGrid = document.createElement('div');
    subtopicsGrid.classList.add('subtopics-grid');

    filteredQuizzes.forEach((quiz, index) => {
        const topicCard = document.createElement('div');
        topicCard.classList.add('topic-card');
        topicCard.style.animationDelay = `${index * 0.2}s`;
        topicCard.innerHTML = `
            <h3>${quiz.title}</h3>
            <p>${quiz.questions.length} câu hỏi</p>
        `;
        topicCard.addEventListener('click', () => startQuiz(quiz.id));
        subtopicsGrid.appendChild(topicCard);
    });

    topicSection.appendChild(subtopicsGrid);
    topicsContainer.appendChild(topicSection);
}

// Lọc theo quiz nổi bật
async function filterByFeatured(title) {
    const tags = document.querySelectorAll('.featured-tag');
    tags.forEach(tag => tag.classList.remove('active'));
    event.target.classList.add('active');

    const quizzes = await fetchQuizzes(); // Lấy dữ liệu từ API quizs
    const filteredQuizzes = title === 'all' ? quizzes : quizzes.filter(quiz => quiz.title === title);

    displayFilteredTopics(filteredQuizzes);
}

// Khởi tạo khi trang tải
document.addEventListener('DOMContentLoaded', () => {
    // Hiển thị nội dung trang chủ
    displayTopics();
    displayFeaturedTopics();
    displayFeaturedBar();
    setupSearchAndFilter();

    // Kiểm tra trạng thái đăng nhập
    onAuthStateChanged(auth, (user) => {
        const authSection = document.querySelector('.auth-section');
        if (!authSection) return; // Kiểm tra nếu không tìm thấy phần tử

        if (user) {
            // Người dùng đã đăng nhập
            authSection.innerHTML = ''; // Xóa nút đăng nhập và đăng ký
            const createQuizBtn = document.createElement('button');
            createQuizBtn.textContent = 'Tạo Quiz';
            createQuizBtn.classList.add('signup-btn');
            createQuizBtn.addEventListener('click', () => {
                window.location.href = 'createquiz.html';
            });
            authSection.appendChild(createQuizBtn);
        }
        // Nếu không có user, giữ nguyên nút "Đăng nhập" và "Đăng ký" từ HTML
    });
});
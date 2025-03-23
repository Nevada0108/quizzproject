// script.js
const topics = [
    {
        id: 1,
        title: "Kiến thức chung",
        subtopics: [
            { id: 11, title: "Văn hóa", description: "Câu hỏi về văn hóa thế giới", questions: 10, featured: true },
            { id: 12, title: "Lịch sử", description: "Kiến thức lịch sử Việt Nam và thế giới", questions: 12 }
        ]
    },
    {
        id: 2,
        title: "Toán học",
        subtopics: [
            { id: 21, title: "Hình học", description: "Câu hỏi về hình học phẳng và không gian", questions: 15, featured: true },
            { id: 22, title: "Toán số", description: "Các bài toán số học cơ bản", questions: 10 }
        ]
    },
    {
        id: 3,
        title: "Công nghệ",
        subtopics: [
            { id: 31, title: "Lập trình", description: "Kiến thức lập trình cơ bản", questions: 12 }
        ]
    },
    {
        id: 4,
        title: "Tiếng Anh",
        subtopics: [
            { id: 41, title: "Ngữ pháp", description: "Kiểm tra ngữ pháp tiếng Anh", questions: 20, featured: true },
            { id: 42, title: "Từ vựng", description: "Mở rộng vốn từ tiếng Anh", questions: 15 }
        ]
    }
];

function displayTopics() {
    const topicsContainer = document.getElementById('topicsContainer');
    topicsContainer.innerHTML = '';

    topics.forEach((topic, index) => {
        const topicSection = document.createElement('div');
        topicSection.classList.add('topic-section');
        topicSection.innerHTML = `<h2 class="topic-title">${topic.title}</h2>`;

        const subtopicsGrid = document.createElement('div');
        subtopicsGrid.classList.add('subtopics-grid');

        topic.subtopics.forEach((subtopic, subIndex) => {
            const topicCard = document.createElement('div');
            topicCard.classList.add('topic-card');
            topicCard.style.animationDelay = `${(index * 0.5) + (subIndex * 0.2)}s`;
            topicCard.innerHTML = `
                <h3>${subtopic.title}</h3>
                <p>${subtopic.description}</p>
                <p>${subtopic.questions} câu hỏi</p>
            `;
            topicCard.addEventListener('click', () => startQuiz(subtopic.id));
            subtopicsGrid.appendChild(topicCard);
        });

        topicSection.appendChild(subtopicsGrid);
        topicsContainer.appendChild(topicSection);
    });
}

function displayFeaturedTopics() {
    const featuredGrid = document.getElementById('featuredGrid');
    const featuredSubtopics = topics.flatMap(topic => 
        topic.subtopics.filter(subtopic => subtopic.featured)
    );

    featuredGrid.innerHTML = '';
    featuredSubtopics.forEach((subtopic, index) => {
        const topicCard = document.createElement('div');
        topicCard.classList.add('topic-card');
        topicCard.style.animationDelay = `${index * 0.2}s`;
        topicCard.innerHTML = `
            <h3>${subtopic.title}</h3>
            <p>${subtopic.description}</p>
            <p>${subtopic.questions} câu hỏi</p>
        `;
        topicCard.addEventListener('click', () => startQuiz(subtopic.id));
        featuredGrid.appendChild(topicCard);
    });
}

function displayFeaturedBar() {
    const featuredBar = document.getElementById('featuredBar');
    const featuredSubtopics = topics.flatMap(topic => 
        topic.subtopics.filter(subtopic => subtopic.featured)
    );

    featuredSubtopics.forEach(subtopic => {
        const tag = document.createElement('div');
        tag.classList.add('featured-tag');
        tag.textContent = subtopic.title;
        tag.addEventListener('click', () => filterByFeatured(subtopic.title));
        featuredBar.appendChild(tag);
    });
}

function startQuiz(subtopicId) {
    const subtopic = topics
        .flatMap(topic => topic.subtopics)
        .find(st => st.id === subtopicId);
    alert(`Bắt đầu quiz: ${subtopic.title} với ${subtopic.questions} câu hỏi!`);
}

function setupSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');

    function filterTopics() {
        const searchText = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value;

        const filteredTopics = topics.map(topic => {
            const filteredSubtopics = topic.subtopics.filter(subtopic => 
                subtopic.title.toLowerCase().includes(searchText) ||
                subtopic.description.toLowerCase().includes(searchText)
            );

            if (filterValue !== 'all') {
                const questionLimit = parseInt(filterValue);
                return {
                    ...topic,
                    subtopics: filteredSubtopics.filter(subtopic => 
                        filterValue === '10' ? subtopic.questions < 15 : subtopic.questions >= 15
                    )
                };
            }
            return { ...topic, subtopics: filteredSubtopics };
        }).filter(topic => topic.subtopics.length > 0);

        displayFilteredTopics(filteredTopics);
    }

    searchInput.addEventListener('input', filterTopics);
    filterSelect.addEventListener('change', filterTopics);
}

function displayFilteredTopics(filteredTopics) {
    const topicsContainer = document.getElementById('topicsContainer');
    topicsContainer.innerHTML = '';

    filteredTopics.forEach((topic, index) => {
        const topicSection = document.createElement('div');
        topicSection.classList.add('topic-section');
        topicSection.innerHTML = `<h2 class="topic-title">${topic.title}</h2>`;

        const subtopicsGrid = document.createElement('div');
        subtopicsGrid.classList.add('subtopics-grid');

        topic.subtopics.forEach((subtopic, subIndex) => {
            const topicCard = document.createElement('div');
            topicCard.classList.add('topic-card');
            topicCard.style.animationDelay = `${(index * 0.5) + (subIndex * 0.2)}s`;
            topicCard.innerHTML = `
                <h3>${subtopic.title}</h3>
                <p>${subtopic.description}</p>
                <p>${subtopic.questions} câu hỏi</p>
            `;
            topicCard.addEventListener('click', () => startQuiz(subtopic.id));
            subtopicsGrid.appendChild(topicCard);
        });

        topicSection.appendChild(subtopicsGrid);
        topicsContainer.appendChild(topicSection);
    });
}

function filterByFeatured(title) {
    const tags = document.querySelectorAll('.featured-tag');
    tags.forEach(tag => tag.classList.remove('active'));
    event.target.classList.add('active');

    const filteredTopics = topics.map(topic => {
        const filteredSubtopics = topic.subtopics.filter(subtopic => 
            title === 'all' || subtopic.title === title
        );
        return { ...topic, subtopics: filteredSubtopics };
    }).filter(topic => topic.subtopics.length > 0);

    displayFilteredTopics(filteredTopics);
}

document.addEventListener('DOMContentLoaded', () => {
    displayTopics();
    displayFeaturedTopics();
    displayFeaturedBar();
    setupSearchAndFilter();
});

//
// script.js (chỉ cập nhật hàm startQuiz)
function startQuiz(subtopicId) {
    window.location.href = `quiz.html?subtopicId=${subtopicId}`;
}
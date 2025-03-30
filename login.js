// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
    getAuth, signInWithEmailAndPassword, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

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

const showMessage = (element, message, isError = true) => {
    element.style.display = 'block';
    element.textContent = message;
    element.className = isError ? 'error-message' : 'success-message';
};

const handleError = (error, errorElement) => {
    errorElement.style.display = 'block';
    const messages = {
        'auth/email-already-in-use': 'Email đã được sử dụng',
        'auth/invalid-email': 'Email không hợp lệ',
        'auth/weak-password': 'Mật khẩu phải có ít nhất 6 ký tự',
        'auth/user-not-found': 'Email hoặc mật khẩu không đúng',
        'auth/wrong-password': 'Email hoặc mật khẩu không đúng',
    };
    errorElement.textContent = messages[error.code] || 'Có lỗi xảy ra. Vui lòng thử lại';
};

export const initLogin = () => {
    const elements = {
        form: document.getElementById('loginForm'),
        error: document.getElementById('errorMessage'),
        success: document.getElementById('successMessage'),
        registerLink: document.getElementById('registerLink'),
        email: document.getElementById('email'),
        password: document.getElementById('password')
    };

    elements.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        elements.error.style.display = 'none';
        elements.success.style.display = 'none';

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                elements.email.value,
                elements.password.value
            );
            showMessage(elements.success, 'Đăng nhập thành công', false);
            setTimeout(() => window.location.href = 'index.html', 1000);
        } catch (error) {
            console.log(error);
            handleError(error, elements.error);
        }
    });

    elements.registerLink.addEventListener('click', () => {
        window.location.href = 'register.html';
    });
};

// Kiểm tra trạng thái đăng nhập khi tải trang
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Người dùng đã đăng nhập
        const authSection = document.querySelector('.auth-section');
        if (authSection) {
            authSection.innerHTML = ''; // Xóa nút đăng nhập và đăng ký
            const createQuizBtn = document.createElement('button');
            createQuizBtn.textContent = 'Tạo Quiz';
            createQuizBtn.classList.add('signup-btn'); // Dùng class signup-btn cho kiểu dáng
            createQuizBtn.addEventListener('click', () => {
                window.location.href = 'create-quiz.html';
            });
            authSection.appendChild(createQuizBtn);
        }
    }
});
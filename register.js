    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
    import {
        getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
        sendEmailVerification, signOut, onAuthStateChanged
    }
        from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
    
    
    // Your web app's Firebase configuration
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


export const initRegister = () => {

    // Lấy các DOM dữ liệu cần thiết
    const elements = {
        form: document.getElementById('registerForm'),
        error: document.getElementById('errorMessage'),
        succsess: document.getElementById('successMessage'),
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        loginLink: document.getElementById('loginLink'),
        verificationSection: document.getElementById('verificationSection'),
        resendEmail: document.getElementById('resendemail')
    }

    // Để hiện tại khong có người dùng
    let currentUser = null;

    // Kiểm tra form
    if (elements.form) {
        elements.form.addEventListener('submit', async (e) => {
            e.preventDefault()
            try {

                // Code xử lý đăng ký
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    elements.email.value,
                    document.getElementById('password').value
                );

                currentUser = userCredential.user;
                await sendEmailVerification(currentUser);
                elements.form.style.display = 'none';
                elements.verificationSection.style.display = 'block';
                showMessage(
                    elements.succsess,
                    'Đã đăng ký thành công! Vui lòng kiểm tra email xác nhận',
                    false
                )
                setTimeout(() => window.location.href = 'login.html', 1000);

            } catch (error) {
                    handleError(error, elements.error);

    }
});
    }
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, onAuthStateChanged, signInAnonymously, signOut,
    signInWithPopup, GoogleAuthProvider, 
    createUserWithEmailAndPassword, signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAVEiHOD1xTnlAFW3h-YjmQcHPsx4saaLo",
  authDomain: "cocaro-8be98.firebaseapp.com",
  projectId: "cocaro-8be98",
  storageBucket: "cocaro-8be98.firebasestorage.app",
  messagingSenderId: "620011719200",
  appId: "1:620011719200:web:fe8f79429587d96ddb4a45"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Lấy các DOM Element
const authPanel = document.getElementById("authPanel");
const btnLogout = document.getElementById("btnLogout");
const userName = document.getElementById("userName");
const avatar = document.getElementById("avatar");
const userRole = document.getElementById("userRole");

const emailInput = document.getElementById("emailInput");
const passInput = document.getElementById("passInput");

// ==========================================
// 1. TỰ ĐỘNG KHÁCH & QUẢN LÝ TRẠNG THÁI
// ==========================================
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // KHÔNG CÓ USER -> TỰ ĐỘNG TẠO KHÁCH NGAY LẬP TỨC
        signInAnonymously(auth).catch(err => alert("Lỗi kết nối máy chủ: " + err.message));
        return; // Dừng lại, Firebase sẽ tự động gọi lại hàm này khi tạo khách xong
    }

    // ĐÃ CÓ USER (LÀ KHÁCH HOẶC TÀI KHOẢN CHÍNH THỨC)
    localStorage.setItem("hub_uid", user.uid);

    if (user.isAnonymous) {
        // Xử lý Giao diện cho KHÁCH
        const guestName = "Khách_" + user.uid.substring(0, 4);
        userName.textContent = guestName;
        userRole.textContent = "Ẩn danh";
        userRole.className = "badge guest";
        avatar.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`;
        
        authPanel.style.display = "block"; // Hiện khung nâng cấp TK
        btnLogout.style.display = "none";  // Khách không cần nút đăng xuất
        
        localStorage.setItem("hub_name", guestName);
        localStorage.setItem("hub_is_guest", "true");
    } else {
        // Xử lý Giao diện cho TÀI KHOẢN CHÍNH THỨC
        // Nếu đăng nhập Google có displayName, nếu Email/Pass thì lấy khúc đầu của Email
        const finalName = user.displayName || user.email.split('@')[0];
        userName.textContent = finalName;
        userRole.textContent = "Thành viên";
        userRole.className = "badge";
        avatar.src = user.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.uid}`;
        
        authPanel.style.display = "none";  // Ẩn khung đăng nhập
        btnLogout.style.display = "block"; // Hiện nút đăng xuất
        
        localStorage.setItem("hub_name", finalName);
        localStorage.setItem("hub_is_guest", "false");
    }
});

// ==========================================
// 2. CÁC PHƯƠNG THỨC ĐĂNG NHẬP / ĐĂNG KÝ
// ==========================================

// Xử lý Đăng ký bằng Email
document.getElementById("btnEmailReg").addEventListener("click", () => {
    const email = emailInput.value.trim();
    const pass = passInput.value.trim();
    if (!email || pass.length < 6) return alert("Vui lòng nhập Email hợp lệ và Mật khẩu từ 6 ký tự!");
    
    document.getElementById("btnEmailReg").textContent = "Đang xử lý...";
    createUserWithEmailAndPassword(auth, email, pass)
        .then(() => alert("Đăng ký thành công!"))
        .catch(err => {
            alert("Lỗi đăng ký: " + err.message);
            document.getElementById("btnEmailReg").textContent = "Đăng ký mới";
        });
});

// Xử lý Đăng nhập bằng Email
document.getElementById("btnEmailLogin").addEventListener("click", () => {
    const email = emailInput.value.trim();
    const pass = passInput.value.trim();
    if (!email || !pass) return alert("Vui lòng nhập đầy đủ Email và Mật khẩu!");

    document.getElementById("btnEmailLogin").textContent = "Đang vào...";
    signInWithEmailAndPassword(auth, email, pass)
        .catch(err => {
            alert("Sai email hoặc mật khẩu!");
            document.getElementById("btnEmailLogin").textContent = "Đăng nhập";
        });
});

// Xử lý Đăng nhập bằng Google
document.getElementById("btnGoogle").addEventListener("click", () => {
    signInWithPopup(auth, googleProvider).catch(err => alert("Lỗi đăng nhập Google: " + err.message));
});

// Xử lý Đăng xuất (Sẽ tự động trả về Khách do logic ở onAuthStateChanged)
btnLogout.addEventListener("click", () => {
    signOut(auth);
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Bê nguyên Firebase Config của bạn vào đây
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
const provider = new GoogleAuthProvider();

// Lấy các DOM Elements
const loginSection = document.getElementById("loginSection");
const userInfo = document.getElementById("userInfo");
const gameMenu = document.getElementById("gameMenu");
const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");

// Lắng nghe trạng thái người dùng (Đã đăng nhập hay chưa)
onAuthStateChanged(auth, (user) => {
  if (user) {
    // ĐÃ ĐĂNG NHẬP
    loginSection.style.display = "none";
    userInfo.style.display = "flex";
    gameMenu.style.display = "block";
    
    document.getElementById("userName").textContent = user.displayName;
    document.getElementById("avatar").src = user.photoURL;
    
    // Lưu thông tin cơ bản vào LocalStorage để game con (như Caro) dễ dàng lấy ra dùng
    localStorage.setItem("hub_uid", user.uid);
    localStorage.setItem("hub_name", user.displayName);
  } else {
    // CHƯA ĐĂNG NHẬP
    loginSection.style.display = "block";
    userInfo.style.display = "none";
    gameMenu.style.display = "none";
    
    localStorage.removeItem("hub_uid");
    localStorage.removeItem("hub_name");
  }
});

// Xử lý nút Đăng nhập
btnLogin.addEventListener("click", () => {
    btnLogin.textContent = "Đang kết nối...";
    signInWithPopup(auth, provider).catch((error) => {
        console.error("Lỗi đăng nhập:", error);
        btnLogin.textContent = "Đăng nhập bằng Google";
        alert("Lỗi đăng nhập: " + error.message);
    });
});

// Xử lý nút Đăng xuất
btnLogout.addEventListener("click", () => {
    signOut(auth);
});

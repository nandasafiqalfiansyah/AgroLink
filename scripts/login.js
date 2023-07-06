const firebaseConfig = {
  apiKey: "AIzaSyDW5F9NFxmCiydrU4xvnhrwB04XGxStvV4",
  authDomain: "kecambah-hd-c46f3.firebaseapp.com",
  databaseURL: "https://kecambah-hd-c46f3-default-rtdb.firebaseio.com",
  projectId: "kecambah-hd-c46f3",
  storageBucket: "kecambah-hd-c46f3.appspot.com",
  messagingSenderId: "808821633061",
  appId: "1:808821633061:web:397da80129ed0f038c0fcc",
  measurementId: "G-S4QLRV0JK9",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Referensi elemen HTML
const loginContainer = document.getElementById("login-container");
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const errorMessage = document.getElementById("error-message");
const logoutButton = document.getElementById("logout-button");

// Event listener untuk form login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  // Login dengan Firebase
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      // Login berhasil
      console.log("login berhasil");
      errorMessage.textContent = "";
      window.location.href = "dashboard.html";
      console.log("sudah membuka dashboard");
    })
    .catch((error) => {
      // Tangani error saat login
      console.log("Login gagal", error.message);
      errorMessage.textContent = error.message;
    });
});

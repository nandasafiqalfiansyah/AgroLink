const firebaseConfig = {
  apiKey: "AIzaSyAjU5e6Ri_4K51FaG8b6sdtNQGkGtkjXGU",
  authDomain: "kecambah-hd-c46f3.firebaseapp.com",
  databaseURL: "https://kecambah-hd-c46f3-default-rtdb.firebaseio.com",
  projectId: "kecambah-hd-c46f3",
  storageBucket: "kecambah-hd-c46f3.appspot.com",
  messagingSenderId: "808821633061",
  appId: "1:808821633061:web:397da80129ed0f038c0fcc",
  measurementId: "G-S4QLRV0JK9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Referensi elemen HTML
const loginContainer = document.getElementById("login-container");
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const errorMessage = document.getElementById("error-message");

// Event listener untuk form lupa sandi
forgotPasswordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInput.value;

  // Reset sandi dengan Firebase
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      // Permintaan reset sandi berhasil
      console.log("Permintaan reset sandi berhasil");
      alert("Permintaan reset sandi berhasil");
      errorMessage.textContent =
        "Permintaan reset sandi berhasil. Silakan periksa email Anda.";
    })
    .catch((error) => {
      // Tangani error saat permintaan reset sandi
      console.log("Permintaan reset sandi gagal", error.message);
      errorMessage.textContent = error.message;
    });
});

const firebaseConfig = {
  apiKey: "AIzaSyDz2p26Xy5ujcmnYyxpUOSOPCtAgTLFpbY",
  authDomain: "agrolink-b98ed.firebaseapp.com",
  databaseURL: "https://agrolink-b98ed-default-rtdb.firebaseio.com",
  projectId: "agrolink-b98ed",
  storageBucket: "agrolink-b98ed.appspot.com",
  messagingSenderId: "54863140190",
  appId: "1:54863140190:web:130befcdc872d33700ebcf",
  measurementId: "G-DKBL14E0JS",
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

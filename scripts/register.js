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

// Event listener untuk form register
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  // Registrasi dengan Firebase
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      // Registrasi berhasil
      console.log("Registrasi berhasil");
      errorMessage.textContent = "";
      alert("Registrasi Berhasil!");
      window.location.href = "../layout/dashboard.html";
      console.log("sudah membuka dashboard");
    })
    .catch((error) => {
      // Tangani error saat registrasi
      console.log("Registrasi gagal", error.message);
      errorMessage.textContent = error.message;
    });
});

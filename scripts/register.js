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
// Wait for the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  // Referensi elemen HTML
  const registerForm = document.getElementById("registerForm");
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  const nameInput = document.getElementById("name-input");
  const errorMessage = document.getElementById("error-message");

  // Event listener untuk form pendaftaran
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    const name = nameInput.value;

    // Registrasi dengan Firebase
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Registrasi berhasil
        console.log("Registrasi berhasil");
        const user = userCredential.user;

        // Simpan nama pengguna ke database
        const usersRef = firebase.database().ref("users");
        const userRef = usersRef.child(user.uid);
        userRef.set({
          name: name,
          email: email,
        });

        errorMessage.textContent = "";
        alert("Registrasi Berhasil!");
        window.location.href = "profil.html";
      })
      .catch((error) => {
        // Tangani error saat registrasi
        console.log("Registrasi gagal", error.message);
        errorMessage.textContent = error.message;
      });
  });
});

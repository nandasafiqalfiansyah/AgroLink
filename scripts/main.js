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
// Inisialisasi Firebase

firebase.initializeApp(firebaseConfig);

function performSearch() {
  var searchInput = document.getElementById("search-input").value.toLowerCase(); // Mengubah menjadi huruf kecil untuk pencarian yang tidak case-sensitive
  var bodyText = document.body.innerText.toLowerCase(); // Mengambil teks dari elemen body
  var regex = new RegExp(searchInput, "gi");
  var highlightedText = bodyText.replace(regex, function (match) {
    return "<mark>" + match + "</mark>";
  });

  if (bodyText.indexOf(searchInput) !== -1) {
    Swal.fire({
      icon: "success",
      title: "Text Found!",
      html:
        "The searched text was found.<br><br>" +
        "Highlighted Text: " +
        highlightedText,
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Text Not Found",
      text: "The searched text was not found.",
    });
  }
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const userRef = firebase.database().ref("users/" + user.uid);

    // Event listener untuk tombol Save
    document.getElementById("save-btn").addEventListener("click", () => {
      const name = document.getElementById("nameuser").value;
      const phone = document.getElementById("phone").value;
      const file = document.getElementById("profile-image").files[0]; // Mengambil file gambar yang diunggah

      if (name === "" || phone === "" || file === undefined) {
        alert("Please fill in all fields.");
        return; // Menghentikan eksekusi jika ada nilai yang kosong
      }

      // Menghasilkan ID unik untuk gambar
      const imageId = Date.now().toString();

      // Mengunggah gambar ke Firebase Storage
      const storageRef = firebase.storage().ref("profile-images/" + imageId);
      const uploadTask = storageRef.put(file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Mengikuti proses pengungahan
        },
        (error) => {
          // Tangani error saat pengunggahan
          console.log("Failed to upload image:", error.message);
        },
        () => {
          // Pengungahan selesai
          // Mendapatkan URL gambar yang diunggah
          uploadTask.snapshot.ref.getDownloadURL().then((imageUrl) => {
            // Update data profil pengguna di database
            userRef
              .update({
                name: name,
                phone: phone,
                imageUrl: imageUrl,
              })
              .then(() => {
                alert("Profile updated successfully");
                console.log("Profile updated successfully");
              })
              .catch((error) => {
                alert("Failed to update profile:", error.message);
                console.log("Failed to update profile:", error.message);
              });
          });
        }
      );
    });
    // Event listener untuk tombol Delete
    document.getElementById("delete-btn").addEventListener("click", () => {
      const confirmation = confirm("Apakah Anda yakin ingin menghapus akun?");

      if (confirmation) {
        userRef
          .remove()
          .then(() => {
            // Menghapus akun pengguna dari Firebase Authentication
            user
              .delete()
              .then(() => {
                // Penggunaan berhasil dihapus
                console.log("Profile and account deleted successfully");
                alert("Profile and account deleted successfully");
                window.location.href = "../layout/index.html";
                // Redirect ke halaman login atau tindakan yang sesuai
              })
              .catch((error) => {
                // Penanganan kesalahan saat menghapus akun pengguna
                alert("Failed to delete account:", error.message);
                console.log("Failed to delete account:", error.message);
              });
          })
          .catch((error) => {
            // Penanganan kesalahan saat menghapus data profil pengguna
            console.log("Failed to delete profile:", error.message);
          });
      }
    });

    // Menampilkan data yang diperbarui di div updated-data-container
    userRef.on("value", (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        document.getElementById("updated-uid").textContent = user.uid;
        document.getElementById("updated-name").textContent = userData.name;
        document.getElementById("updated-nama").textContent = userData.name;
        document.getElementById("updated-email").textContent = user.email;
        document.getElementById("updated-phone").textContent = userData.phone;
        document.getElementById("updated-profile-image").src =
          userData.imageUrl || ""; // Menampilkan gambar profil
        document.getElementById("updated-profile-images").src =
          userData.imageUrl || ""; // Menampilkan gambar profil
      }
    });

    // Lanjutkan dengan penggunaan userRef untuk akses ke data pengguna
  } else {
    // Pengguna belum terotentikasi, lakukan penanganan sesuai kebutuhan
    // ...
  }
});

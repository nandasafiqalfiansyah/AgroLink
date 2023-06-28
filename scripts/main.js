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

// Menambahkan event listener pada tombol unduh
var downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", function () {
  // Mendapatkan referensi ke database Firebase
  var database = firebase.database();

  // Mendapatkan referensi ke folder "riwayat" di database
  var riwayatRef = database.ref("riwayat");

  // Mendownload data dari folder "riwayat"
  riwayatRef.once("value").then(function (snapshot) {
    var riwayatData = snapshot.val();

    // Mengkonversi data menjadi format yang sesuai untuk didownload (misalnya JSON)
    var riwayatJSON = JSON.stringify(riwayatData);

    // Membuat tautan untuk mengunduh data
    var downloadLink = document.createElement("a");
    downloadLink.href =
      "data:text/plain;charset=utf-8," + encodeURIComponent(riwayatJSON);
    downloadLink.download = "riwayat.json";

    // Memicu klik pada tautan untuk memulai unduhan
    downloadLink.click();

    // Menampilkan notifikasi setelah data diunduh
    alert("Data riwayat berhasil diunduh");
  });
});

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

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const userRef = firebase.database().ref("users/" + user.uid);

    // Event listener untuk tombol Save
    document.getElementById("save-btn").addEventListener("click", () => {
      const name = document.getElementById("nameuser").value;
      const phone = document.getElementById("phone").value;
      const file = document.getElementById("profile-image").files[0]; // Mengambil file gambar yang diunggah

      if (name === "" || phone === "" || file === undefined) {
        alert("Please fill in all fields. Tolong masukan semua data");
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
                window.location.href = "index.html";
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

      //chart
      const database = firebase.database();

      // Mendengarkan perubahan data pada node 'Hasil_Pembacaan'
      database.ref("Hasil_Pembacaan").on("value", function (snapshot) {
        var data = snapshot.val();
        var suhu = data ? data.suhu : null;
        var kelembapan = data ? data.kelembapan : null;

        // Memperbarui nilai suhu dan kelembapan pada elemen HTML
        var suhuElement = document.getElementById("suhu");
        var kelembapanElement = document.getElementById("kelembapan");

        if (suhuElement && kelembapanElement) {
          suhuElement.innerHTML = suhu !== null ? suhu + " °C" : "-";
          kelembapanElement.innerHTML =
            kelembapan !== null ? kelembapan + " %" : "-";
        }

        // Menggambar grafik lingkaran
        var ctx = document.getElementById("myChart").getContext("2d");
        var myChart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Suhu", "Kelembapan"],
            datasets: [
              {
                data: [suhu, kelembapan],
                backgroundColor: ["#0088cc", "#ffaa00"],
                borderColor: "#ffffff",
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              position: "bottom",
              labels: {
                fontColor: "#333333",
              },
            },
          },
        });
      });
    });

    // Mendengarkan perubahan data pada node 'Hasil_Pembacaan'
    database.ref("Hasil_Pembacaan").on("value", function (snapshot) {
      var data = snapshot.val();
      var suhu = data ? data.suhu : null;
      var kelembapan = data ? data.kelembapan : null;

      // Menghitung persentase width berdasarkan data suhu
      var suhuPersentase = suhu !== null ? (suhu / 100) * 100 : 0;

      // Mengubah style width pada elemen div progress bar suhu
      var suhuProgressBar = document.getElementById("suhuProgressBar");
      if (suhuProgressBar) {
        suhuProgressBar.style.width = suhuPersentase + "%";
        suhuProgressBar.setAttribute("aria-valuenow", suhuPersentase);
      }

      // Menghitung persentase width berdasarkan data kelembapan
      var kelembapanPersentase =
        kelembapan !== null ? (kelembapan / 100) * 100 : 0;

      // Mengubah style width pada elemen div progress bar kelembapan
      var kelembapanProgressBar = document.getElementById(
        "kelembapanProgressBar"
      );
      if (kelembapanProgressBar) {
        kelembapanProgressBar.style.width = kelembapanPersentase + "%";
        kelembapanProgressBar.setAttribute(
          "aria-valuenow",
          kelembapanPersentase
        );
      }
    });

    database.ref("riwayat").on("value", function (snapshot) {
      var data = snapshot.val();
      var riwayatArray = [];

      // Mengubah objek data menjadi array
      if (data) {
        riwayatArray = Object.keys(data).map(function (key) {
          return {
            timestamp: key,
            suhu: data[key].suhu,
            kelembapan: data[key].kelembapan,
          };
        });
      }

      // Memperbarui nilai suhu dan kelembapan pada elemen HTML
      var suhuElement = document.getElementById("suhu");
      var kelembapanElement = document.getElementById("kelembapan");

      if (suhuElement && kelembapanElement) {
        var latestData =
          riwayatArray.length > 0
            ? riwayatArray[riwayatArray.length - 1]
            : null;
        suhuElement.innerHTML = latestData ? latestData.suhu + " °C" : "-";
        kelembapanElement.innerHTML = latestData
          ? latestData.kelembapan + " %"
          : "-";
      }

      // Menghapus dan menginisialisasi tabel menggunakan plugin DataTables
      var table = $("#measurementTable").DataTable({
        destroy: true, // Menghancurkan tabel sebelumnya (jika ada)
        data: riwayatArray,
        columns: [
          {
            data: "timestamp",
            render: function (data) {
              return new Date(parseInt(data)).toLocaleString();
            },
          },
          { data: "suhu" },
          { data: "kelembapan" },
        ],
      });
    });

    //UPDATE DATA HISTORY SETIAP 1 JAM

    const storageRef = firebase.storage().ref();

    // Mendefinisikan nama folder
    const folderName = "data";

    // Memanggil fungsi saveHistory setiap satu jam
    setInterval(function () {
      // Mendapatkan data suhu dan kelembapan dari node 'Hasil_Pembacaan'
      database.ref("Hasil_Pembacaan").once("value", function (snapshot) {
        var data = snapshot.val();
        var suhu = data ? data.suhu : null;
        var kelembapan = data ? data.kelembapan : null;

        // Menyimpan data ke Firebase Database
        saveHistory(suhu, kelembapan);
      });
    }, 60 * 60 * 1000); // Setiap satu jam (60 menit x 60 detik x 1000 milidetik)

    function saveHistory(suhu, kelembapan) {
      // Menyimpan riwayat pengukuran ke Firebase Database
      const database = firebase.database();
      const historyRef = database.ref("riwayat");
      const timestamp = Date.now();

      historyRef
        .child(timestamp)
        .set({
          suhu: suhu,
          kelembapan: kelembapan,
        })
        .then(() => {
          console.log("History saved successfully");

          // Menyimpan data ke folder "data" di Firebase Storage
          const dataString = JSON.stringify({
            suhu: suhu,
            kelembapan: kelembapan,
          });
          const fileRef = storageRef.child(
            folderName + "/" + timestamp + ".json"
          );
          fileRef
            .putString(dataString, "raw")
            .then(() => {
              console.log("Data saved to folder successfully");
            })
            .catch((error) => {
              console.log("Failed to save data to folder:", error);
            });
        })
        .catch((error) => {
          console.log("Failed to save history:", error);
        });
    }
    // Lanjutkan dengan penggunaan userRef untuk akses ke data pengguna
  } else {
    // Pengguna belum terotentikasi, lakukan penanganan sesuai kebutuhan
    // ...
  }
});

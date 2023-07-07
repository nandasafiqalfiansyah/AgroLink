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

// Mengambil elemen span berdasarkan ID
const badge = document.getElementById("badge");
const note = document.getElementById("note");

// Menambahkan event listener untuk menangani klik
note.addEventListener("click", function () {
  // Mengubah properti display menjadi "none"
  badge.style.display = "none";
});

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

        // Simpan data pengguna ke database
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

      database.ref().on("value", function (snapshot) {
        var data = snapshot.val();
        var gelapData = data.Gelap;
        var terangData = data.Terang;

        var suhuGelap = gelapData ? gelapData.suhu : null;
        var suhuTerang = terangData ? terangData.suhu : null;

        var kelembapanGelap = gelapData ? gelapData.kelembapan : null;
        var kelembapanTerang = terangData ? terangData.kelembapan : null;

        // Memperbarui nilai suhu dan kelembapan untuk Gelap
        var suhuGelapElement = document.getElementById("suhuGelap");
        var kelembapanGelapElement = document.getElementById("kelembapanGelap");
        if (suhuGelapElement && kelembapanGelapElement) {
          suhuGelapElement.innerHTML =
            suhuGelap !== null ? suhuGelap + " °C" : "-";
          kelembapanGelapElement.innerHTML =
            kelembapanGelap !== null ? kelembapanGelap + " %" : "-";
        }

        // Memperbarui nilai suhu dan kelembapan untuk Terang
        var suhuTerangElement = document.getElementById("suhuTerang");
        var kelembapanTerangElement =
          document.getElementById("kelembapanTerang");
        if (suhuTerangElement && kelembapanTerangElement) {
          suhuTerangElement.innerHTML =
            suhuTerang !== null ? suhuTerang + " °C" : "-";
          kelembapanTerangElement.innerHTML =
            kelembapanTerang !== null ? kelembapanTerang + " %" : "-";
        }

        // Menggambar grafik lingkaran
        var ctx = document.getElementById("myChart").getContext("2d");
        var myChart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: [
              "Suhu Gelap",
              "Suhu Terang",
              "Kelembapan Gelap",
              "Kelembapan Terang",
            ],
            datasets: [
              {
                data: [
                  suhuGelap,
                  suhuTerang,
                  kelembapanGelap,
                  kelembapanTerang,
                ],
                backgroundColor: ["#1cc88a", "#f6c23e", "#4e73df", "#36b9cc"],
                borderColor: "#ffffff",
                borderWidth: 2,

                hoverBorderColor: "rgba(234, 236, 244, 1)",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false, // Menghilangkan label
            },
            tooltips: {
              backgroundColor: "rgb(255,255,255)",
              bodyFontColor: "#858796",
              borderColor: "#dddfeb",
              borderWidth: 1,
              xPadding: 15,
              yPadding: 15,
              displayColors: false,
              caretPadding: 10,
            },
            cutoutPercentage: 80,
          },
        });
      });

      // Mendengarkan perubahan data pada node 'Hasil_Pembacaan'
      database.ref().on("value", function (snapshot) {
        var data = snapshot.val();
        var gelapData = data.Gelap;
        var terangData = data.Terang;

        // Memperbarui nilai dalam elemen div suhu Gelap
        var gelapSuhuValueElement = document.getElementById("gelapSuhuValue");
        if (gelapSuhuValueElement) {
          gelapSuhuValueElement.innerHTML = gelapData
            ? "" + gelapData.suhu + " °C"
            : "";
        }

        // Memperbarui nilai dalam elemen div suhu Terang
        var terangSuhuValueElement = document.getElementById("terangSuhuValue");
        if (terangSuhuValueElement) {
          terangSuhuValueElement.innerHTML = terangData
            ? "" + terangData.suhu + " °C"
            : "";
        }

        // Memperbarui nilai dalam elemen div kelembapan Gelap
        var gelapKelembapanValueElement = document.getElementById(
          "gelapKelembapanValue"
        );
        if (gelapKelembapanValueElement) {
          gelapKelembapanValueElement.innerHTML = gelapData
            ? "" + gelapData.kelembapan + " %"
            : "";
        }

        // Memperbarui nilai dalam elemen div kelembapan Terang
        var terangKelembapanValueElement = document.getElementById(
          "terangKelembapanValue"
        );
        if (terangKelembapanValueElement) {
          terangKelembapanValueElement.innerHTML = terangData
            ? "" + terangData.kelembapan + " %"
            : "";
        }

        // Menghitung persentase width berdasarkan data suhu
        var gelapSuhuPersentase = gelapData ? (gelapData.suhu / 100) * 100 : 0;
        var terangSuhuPersentase = terangData
          ? (terangData.suhu / 100) * 100
          : 0;

        // Mengubah style width pada elemen div progress bar suhu Gelap
        var gelapSuhuProgressBar = document.getElementById(
          "gelapSuhuProgressBar"
        );
        if (gelapSuhuProgressBar) {
          gelapSuhuProgressBar.style.width = gelapSuhuPersentase + "%";
          gelapSuhuProgressBar.setAttribute(
            "aria-valuenow",
            gelapSuhuPersentase
          );
        }

        // Mengubah style width pada elemen div progress bar suhu Terang
        var terangSuhuProgressBar = document.getElementById(
          "terangSuhuProgressBar"
        );
        if (terangSuhuProgressBar) {
          terangSuhuProgressBar.style.width = terangSuhuPersentase + "%";
          terangSuhuProgressBar.setAttribute(
            "aria-valuenow",
            terangSuhuPersentase
          );
        }

        // Menghitung persentase width berdasarkan data kelembapan
        var gelapKelembapanPersentase = gelapData
          ? (gelapData.kelembapan / 100) * 100
          : 0;
        var terangKelembapanPersentase = terangData
          ? (terangData.kelembapan / 100) * 100
          : 0;

        // Mengubah style width pada elemen div progress bar kelembapan Gelap
        var gelapKelembapanProgressBar = document.getElementById(
          "gelapKelembapanProgressBar"
        );
        if (gelapKelembapanProgressBar) {
          gelapKelembapanProgressBar.style.width =
            gelapKelembapanPersentase + "%";
          gelapKelembapanProgressBar.setAttribute(
            "aria-valuenow",
            gelapKelembapanPersentase
          );
        }

        // Mengubah style width pada elemen div progress bar kelembapan Terang
        var terangKelembapanProgressBar = document.getElementById(
          "terangKelembapanProgressBar"
        );
        if (terangKelembapanProgressBar) {
          terangKelembapanProgressBar.style.width =
            terangKelembapanPersentase + "%";
          terangKelembapanProgressBar.setAttribute(
            "aria-valuenow",
            terangKelembapanPersentase
          );
        }
      });

      //home

      database.ref("riwayat").on("value", function (snapshot) {
        var data = snapshot.val();
        var riwayatArray = [];

        // Mengubah objek data menjadi array
        if (data) {
          Object.keys(data).forEach(function (timestamp) {
            var riwayatData = {
              timestamp: timestamp,
              kategori: data[timestamp].kategori,
              suhu: data[timestamp].suhu,
              kelembapan: data[timestamp].kelembapan,
              tanggal: data[timestamp].tanggal,
            };
            riwayatArray.push(riwayatData);
          });
        }

        // Memperbarui nilai suhu, kelembapan,
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
            { data: "kategori" },
            { data: "suhu" },
            { data: "kelembapan" },
            { data: "tanggal" },
          ],
        });

        // Mengatur panjang maksimum tabel menjadi 10 baris
        table.page.len(10).draw();
      });

      // Mendapatkan data riwayat dari Firebase Database
      database.ref("riwayat").on("value", function (snapshot) {
        var data = snapshot.val();
        var riwayatArray = [];

        // Mengubah objek data menjadi array
        if (data) {
          Object.entries(data).forEach(([key, value]) => {
            var riwayat = {
              timestamp: parseInt(key),
              suhu: value.suhu,
              kelembapan: value.kelembapan,
              kategori: value.kategori || "",
              tanggal: value.tanggal || "",
            };

            riwayatArray.push(riwayat);
          });
        }

        // Melakukan pengolahan data dan membuat grafik area
        createCombinedChart(riwayatArray);
      });

      function createCombinedChart(riwayatArray) {
        // Membuat array timestamps, suhu terang, suhu gelap, kelembapan terang, kelembapan gelap, dan tanggal berdasarkan riwayatArray
        var timestamps = [];
        var suhuTerangData = [];
        var suhuGelapData = [];
        var kelembapanTerangData = [];
        var kelembapanGelapData = [];
        var tanggalData = [];

        riwayatArray.forEach(function (riwayat) {
          var timestamp = new Date(parseInt(riwayat.timestamp));
          timestamps.push(timestamp);

          if (riwayat.kategori === "Terang") {
            suhuTerangData.push(riwayat.suhu);
            kelembapanTerangData.push(riwayat.kelembapan);
          } else if (riwayat.kategori === "Gelap") {
            suhuGelapData.push(riwayat.suhu);
            kelembapanGelapData.push(riwayat.kelembapan);
          }

          tanggalData.push(riwayat.tanggal);
        });

        // Combined Chart Example
        var ctxCombined = document
          .getElementById("myAreaChart")
          .getContext("2d");
        var myCombinedChart = new Chart(ctxCombined, {
          type: "line",
          data: {
            labels: timestamps,
            datasets: [
              {
                label: "Suhu Terang",
                lineTension: 0.3,
                backgroundColor: "rgba(255, 255, 0, 0.05)",
                borderColor: "#f6c23e",
                pointRadius: 3,
                pointBackgroundColor: "#f6c23e",
                pointBorderColor: "#f6c23f",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "#f6c23f",
                pointHoverBorderColor: "#f6c23f",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: suhuTerangData,
              },
              {
                label: "Suhu Gelap",
                lineTension: 0.3,
                backgroundColor: "rgba(0, 255, 255, 0.05)",
                borderColor: "#1cc88a",
                pointRadius: 3,
                pointBackgroundColor: "#1cc88a",
                pointBorderColor: "#1cc88a",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "#1cc88a",
                borderColor: "#1cc88a",
                pointHoverBackgroundColor: "#1cc88a",
                pointHoverBorderColor: "#1cc88a",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: suhuGelapData,
              },
              {
                label: "Kelembapan Terang",
                lineTension: 0.3,
                backgroundColor: "rgba(0, 99, 255, 0.05)",
                borderColor: "#36b9cc ",
                pointRadius: 3,
                pointBackgroundColor: "#36b9cc ",
                pointBorderColor: "#36b9cc ",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "#36b9cc ",
                pointHoverBorderColor: "#36b9cc ",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: kelembapanTerangData,
              },
              {
                label: "Kelembapan Gelap",
                lineTension: 0.3,
                backgroundColor: "rgba(255, 0, 255, 0.05)",
                borderColor: "#4e73df",
                pointRadius: 3,
                pointBackgroundColor: "#4e73df",
                pointBorderColor: "#4e73df",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "#4e73df",
                pointHoverBorderColor: "#4e73df",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: kelembapanGelapData,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,

            legend: {
              display: false,
            },
            scales: {
              xAxes: [
                {
                  display: false,
                },
              ],
            },
          },
        });
      }

      const storageRef = firebase.storage().ref();
      const folderName = "data";
      const maxDataCount = 100000;

      setInterval(function () {
        updateData();
      }, 300000); // Setiap 5 menit

      const updateBtn = document.getElementById("updateBtn");
      updateBtn.addEventListener("click", updateData);

      const clearBtn = document.getElementById("clearBtn");
      clearBtn.addEventListener("click", clearData);

      function updateData() {
        const database = firebase.database();
        const gelapRef = database.ref("Gelap");
        const terangRef = database.ref("Terang");

        gelapRef.once("value", function (gelapSnapshot) {
          var gelapData = gelapSnapshot.val();
          var gelapSuhu = gelapData ? gelapData.suhu : null;
          var gelapKelembapan = gelapData ? gelapData.kelembapan : null;

          saveHistory("Gelap", gelapSuhu, gelapKelembapan);
        });

        terangRef.once("value", function (terangSnapshot) {
          var terangData = terangSnapshot.val();
          var terangSuhu = terangData ? terangData.suhu : null;
          var terangKelembapan = terangData ? terangData.kelembapan : null;

          saveHistory("Terang", terangSuhu, terangKelembapan);
        });
      }

      function clearData() {
        const database = firebase.database();
        const historyRef = database.ref("riwayat");
        historyRef
          .orderByKey()
          .limitToFirst(maxDataCount)
          .once("value", function (snapshot) {
            const updates = {};
            snapshot.forEach(function (childSnapshot) {
              updates[childSnapshot.key] = null;
            });
            historyRef
              .update(updates)
              .then(() => {
                console.log("Data cleared successfully");
              })
              .catch((error) => {
                console.log("Failed to clear data:", error);
              });
          })
          .catch((error) => {
            console.log("Failed to clear data:", error);
          });
      }

      function saveHistory(kategori, suhu, kelembapan) {
        const database = firebase.database();
        const historyRef = database.ref("riwayat");
        const timestamp = Date.now();
        const date = new Date(timestamp);
        const tanggal = date.toLocaleDateString();
        const time = date.toLocaleTimeString();

        // Menyimpan data ke Firebase Database
        historyRef
          .child(timestamp)
          .set({
            tanggal: tanggal,
            waktu: time, // Tambahkan waktu
            kategori: kategori,
            suhu: suhu,
            kelembapan: kelembapan,
          })
          .then(() => {
            console.log("History saved successfully");

            // Menyimpan data ke folder "data" di Firebase Storage
            const dataString = JSON.stringify({
              tanggal: tanggal,
              waktu: time, // Tambahkan waktu
              kategori: kategori,
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

                // Menghapus entri lebih lama jika jumlah entri melebihi batas maksimum
                historyRef
                  .orderByKey()
                  .limitToFirst(maxDataCount)
                  .once("value", function (snapshot) {
                    if (snapshot.numChildren() >= maxDataCount) {
                      const oldestKey = Object.keys(snapshot.val())[0];
                      const updates = {};
                      updates[oldestKey] = null;
                      historyRef
                        .update(updates)
                        .then(() => {
                          console.log("Old entry removed successfully");
                        })
                        .catch((error) => {
                          console.log("Failed to remove old entry:", error);
                        });
                    }
                  });
              })
              .catch((error) => {
                console.log("Failed to save data to folder:", error);
              });
          })
          .catch((error) => {
            console.log("Failed to save history:", error);
          });
      }
    });

    // Lanjutkan dengan penggunaan userRef untuk akses ke data pengguna
  } else {
    // Pengguna belum terotentikasi, lakukan penanganan sesuai kebutuhan
    // ...
  }
});

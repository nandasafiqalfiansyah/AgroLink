// Referensi database
const database = firebase.database();

var senderName = "";
// Fungsi untuk mengambil data nama dari folder "users"
function sendMessage() {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  // Mendapatkan data pengguna saat ini
  var currentUser = firebase.auth().currentUser;

  if (currentUser) {
    // Mendapatkan ID pengguna saat ini
    var userId = currentUser.uid;

    // Mendapatkan referensi ke posisi "users" dalam database
    var usersRef = database.ref("users");

    // Mendapatkan referensi ke posisi "messages" dalam database
    var messagesRef = database.ref("messages");

    // Mendapatkan data pengguna saat ini dari folder "users"
    usersRef.child(userId).once("value", function (snapshot) {
      var userData = snapshot.val();

      if (userData) {
        var name = userData.name;
        var imageUrl = userData.imageUrl;

        // Menyimpan pesan ke database
        messagesRef.push().set({
          message: message,
          sender: name,
          imageUrl: imageUrl,
        });

        // Mengosongkan input pesan
        messageInput.value = "";
      }
    });
  }
}

let isMessagesLoaded = false; // Flag untuk memastikan fungsi hanya dipanggil sekali

function readMoreMessages() {
  if (isMessagesLoaded) {
    return; // Jika data sudah dimuat sebelumnya, keluar dari fungsi
  }

  const chatContainer = document.getElementById("chat-container");
  chatContainer.innerHTML = "";

  const messagesRef = database.ref("messages");

  messagesRef.off("value"); // Hapus listener sebelumnya

  messagesRef.on("value", function (snapshot) {
    chatContainer.innerHTML = ""; // Menghapus konten sebelumnya sebelum memuat pesan-pesan baru

    snapshot.forEach(function (childSnapshot) {
      const messageKey = childSnapshot.key;
      const messageData = childSnapshot.val();

      const messageElement = document.createElement("div");
      messageElement.innerHTML = `
        <table class="table table-striped">
        <tr class="row ml-0">
        <td><img class="img-profile rounded-circle border" style="width:35px;height:35px;align-item:center;border:black" src="${messageData.imageUrl}" alt="User Image" /></td>
        <td class="col"><span class="" style="font-size:20px;">${messageData.sender}</span></td>
        <td class="col">
          <a href="#" class="btn btn-danger btn-sm" onclick="deleteMessage('${messageKey}')">
          <i class="fas fa-trash"></i></a>
          </td>
        </tr>
        <tr><th>
        <span class="message-content ">pesan: ${messageData.message}</span>
          </th>
        </tr>
        <hr/>
        </table>
      `;

      chatContainer.appendChild(messageElement);
    });

    isMessagesLoaded = true; // Set flag menjadi true setelah data dimuat
  });
}

// Memanggil fungsi readMoreMessages saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  readMoreMessages();
});

// Fungsi untuk menghapus pesan
function deleteMessage(key) {
  // Mendapatkan referensi pesan yang akan dihapus
  const messageRef = database.ref("messages").child(key);

  messageRef
    .remove()
    .then(function () {
      console.log("Pesan berhasil dihapus");
    })
    .catch(function (error) {
      console.error("Error saat menghapus pesan:", error);
    });
}

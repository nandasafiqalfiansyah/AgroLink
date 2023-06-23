// Referensi database
const database = firebase.database();

// Fungsi untuk mengirim pesan
function sendMessage() {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  const nameInput = document.getElementById("name");
  const senderName = nameInput.value;

  // Menyimpan pesan ke database
  database.ref("messages").push().set({
    message: message,
    sender: senderName,
  });

  // Mengosongkan input pesan
  messageInput.value = "";
  window.location.href = "../layout/dashboard.html";
}

// Fungsi untuk membaca pesan-pesan dari database
function readMoreMessages() {
  const chatContainer = document.getElementById("chat-container");
  chatContainer.innerHTML = "";

  const messagesRef = database.ref("messages");

  messagesRef.on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      const messageKey = childSnapshot.key;
      const messageData = childSnapshot.val();

      const messageElement = document.createElement("div");
      messageElement.innerHTML = `
         <div>
         <hr/>
           <span class="message-sender m-5"> ${messageData.sender}</span>
           <span class="message-content m-5">${messageData.message} </span>
            <a href="#" class="btn btn-danger btn-circle btn-sm" onclick="deleteMessage('${messageKey}')">
             <i class="fas fa-trash"></i>
           </a>
           
         </div>
       `;

      chatContainer.appendChild(messageElement);
    });
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

  // Menampilkan konfirmasi dialog sebelum menghapus pesan
  const confirmDelete = confirm("Apakah Anda yakin ingin menghapus pesan ini?");

  if (confirmDelete) {
    // Menghapus pesan dari database
    messageRef
      .remove()
      .then(function () {
        console.log("Pesan berhasil dihapus");
      })
      .catch(function (error) {
        console.error("Error saat menghapus pesan:", error);
      });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const myRoomList = document.getElementById("myRoomList");
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    alert("Vui lòng đăng nhập");
    location.href = "../login/login.html";
    return;
  }

  let rooms = JSON.parse(localStorage.getItem("rooms")) || [];

  // Hàm render các phòng của chủ
  function renderRooms() {
    myRoomList.innerHTML = "";

    // Lọc phòng mà currentUser là chủ
    const myRooms = rooms.filter(r => r.owner === currentUser);

    if (myRooms.length === 0) {
      myRoomList.innerHTML = "<p>Bạn chưa đăng phòng nào</p>";
      return;
    }

    myRooms.forEach(room => {
      const roomEl = document.createElement("div");
      roomEl.className = "card";
      roomEl.innerHTML = `
        ${room.image ? `<img src="${room.image}" class="room-img">` : ""}
        <h3>${room.title}</h3>
        <p><b>Địa chỉ:</b> ${room.address}</p>
        <p><b>Giá:</b> ${room.price} VND</p>

        <!-- Nút xóa phòng -->
        <button onclick="deleteRoom(${room.id})" class="delete-btn">❌ Xóa phòng</button>

        <!-- Nút xem hóa đơn phòng đã thuê (nếu có người thuê) -->
        ${room.rentedBy ? `<button onclick="viewInvoice(${room.id})">🧾 Hóa đơn</button>` : ""}
      `;
      myRoomList.appendChild(roomEl);
    });
  }

  // Xóa phòng
  window.deleteRoom = function(id) {
    if (!confirm("Bạn có chắc muốn xóa phòng này?")) return;

    rooms = rooms.filter(r => r.id !== id);
    localStorage.setItem("rooms", JSON.stringify(rooms));
    renderRooms();
  }

  // Xem hóa đơn phòng (nếu đã được thuê)
  window.viewInvoice = function(id) {
    sessionStorage.setItem("roomId", id);
    location.href = "../invoices/invoice.html";
  }

  renderRooms();
});

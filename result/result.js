// result.js
const roomList = document.getElementById("roomList");
const query = sessionStorage.getItem("searchQuery") || "";
const rooms = JSON.parse(localStorage.getItem("rooms")) || [];

// Lọc phòng theo địa chỉ và chỉ hiển thị phòng chưa thuê
const filtered = rooms.filter(r => 
  r.address.toLowerCase().includes(query.toLowerCase()) && (!r.paid || !r.rentedBy)
);

if (!filtered.length) {
  roomList.innerHTML = "<p>Không tìm thấy phòng nào</p>";
} else {
  roomList.innerHTML = ""; // reset
  filtered.forEach(room => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      ${room.image ? `<img src="${room.image}" class="room-img">` : ""}
      <h3>${room.title}</h3>
      <p><b>Giá:</b> ${room.price} VND</p>
      <p><b>Địa chỉ:</b> ${room.address}</p>
      <button onclick="viewRoom(${room.id})">Xem phòng</button>
    `;
    roomList.appendChild(div);
  });
}

function viewRoom(id) {
  sessionStorage.setItem("roomId", id);
  window.location.href = "../info/info.html";
}

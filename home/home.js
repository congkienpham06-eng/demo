const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
const list = document.getElementById("list");
const currentUser = localStorage.getItem("currentUser"); // user hiện tại

list.innerHTML = ""; // reset

// Lọc phòng: chỉ hiển thị phòng chưa được thuê
const availableRooms = rooms.filter(r => !r.rentedBy);

if (availableRooms.length === 0) {
  // Không có phòng trống → hiển thị thông báo
  list.innerHTML = "<p style='text-align:center; margin-top:20px;'>Chưa có phòng nào đăng</p>";
} else {
  availableRooms.forEach(r => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      ${r.image ? `<img src="${r.image}" class="room-img">` : ""}
      <h4>${r.title}</h4>
      <p>${r.address || `${r.ward}, ${r.district}, ${r.city}`}</p>
      <p>${r.price} VND</p>
      <button onclick="view(${r.id})">Xem phòng</button>
    `;
    list.appendChild(div);
  });
}

// Xem phòng
function view(id) {
  sessionStorage.setItem("roomId", id);
  location.href = "../info/info.html";
}

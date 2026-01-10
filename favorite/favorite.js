// Lấy container
const listContainer = document.getElementById("list");

// Lấy user hiện tại
const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  listContainer.innerHTML = "<p style='text-align:center; margin-top:20px;'>Vui lòng đăng nhập để xem phòng ưa thích</p>";
} else {
  // Lấy dữ liệu rooms và favorites
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
  const userFavs = favorites[currentUser] || [];

  if (userFavs.length === 0) {
    listContainer.innerHTML = "<p style='text-align:center; margin-top:20px;'>Bạn chưa thêm phòng nào vào ưa thích</p>";
  } else {
    // Lọc ra các phòng vẫn tồn tại và chưa bị thuê (paid)
    const validFavs = userFavs.filter(roomId => {
      const room = rooms.find(r => r.id == roomId);
      return room && (!room.paid); // chỉ giữ phòng chưa thanh toán
    });

    if (validFavs.length === 0) {
      listContainer.innerHTML = "<p style='text-align:center; margin-top:20px;'>Không còn phòng ưa thích hợp lệ</p>";
    } else {
      // Render danh sách phòng hợp lệ
      listContainer.innerHTML = validFavs.map(roomId => {
        const room = rooms.find(r => r.id == roomId);
        return `
          <div class="card" onclick="viewRoom(${room.id})">
            ${room.image ? `<img src="${room.image}" alt="${room.title}" class="card-img">` : ""}
            <div class="card-info">
              <h3>${room.title}</h3>
              <p><b>Giá:</b> ${room.price} VND</p>
              <p><b>Địa chỉ:</b> ${room.address}</p>
            </div>
          </div>
        `;
      }).join("");
    }
  }
}

// Hàm xem chi tiết phòng
function viewRoom(id) {
  sessionStorage.setItem("roomId", id);
  location.href = "../info/info.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("invoiceInfo");

  const roomId = sessionStorage.getItem("roomId");
  if (!roomId) {
    container.innerHTML = "<p>Không tìm thấy thông tin phòng.</p>";
    return;
  }

  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = localStorage.getItem("currentUser");

  const room = rooms.find(r => r.id == roomId);
  if (!room) {
    container.innerHTML = "<p>Phòng không tồn tại.</p>";
    return;
  }

  // Lấy chủ phòng
  const owner = users.find(u => u.username === room.owner);
  const ownerName = owner ? (owner.fname || owner.username) : "Không rõ";
  const ownerPhone = owner ? (owner.phone || "Chưa có") : "Chưa có";

  // Lấy người thuê
  const tenant = room.rentedBy ? users.find(u => u.username === room.rentedBy) : null;
  const tenantName = tenant ? (tenant.fname || tenant.username) : "Chưa thuê";
  const tenantPhone = tenant ? (tenant.phone || "Chưa có") : "Chưa có";

  const today = new Date();
  const expire = new Date();
  expire.setDate(today.getDate() + 30);
  const formatDate = d => d.toISOString().split("T")[0];

  container.innerHTML = `
    <div class="card">
      <h3>Thông tin phòng</h3>
      <p><b>Tên phòng:</b> ${room.title}</p>
      <p><b>Địa chỉ:</b> ${room.address}</p>
      <p><b>Giá:</b> ${room.price} VND</p>
      <p><b>Ngày đặt:</b> ${room.rentedBy ? formatDate(today) : "-"}</p>
      <p><b>Ngày hết hạn:</b> ${room.rentedBy ? formatDate(expire) : "-"}</p>
    </div>

    <div class="card">
      <h3>Chủ phòng</h3>
      <p><b>Tên:</b> ${ownerName}</p>
      <p><b>SĐT:</b> ${ownerPhone}</p>
    </div>

    <div class="card">
      <h3>Người thuê</h3>
      <p><b>Tên:</b> ${tenantName}</p>
      <p><b>SĐT:</b> ${tenantPhone}</p>
    </div>

    <div class="card">
      <h3>Phương thức thanh toán</h3>
      <p>${room.paymentMethod || "Chưa thanh toán"}</p>
    </div>
  `;
});

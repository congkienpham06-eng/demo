document.addEventListener("DOMContentLoaded", () => {
  const rentedRoomList = document.getElementById("rentedRoomList");
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    alert("Vui lòng đăng nhập");
    location.href = "../login/login.html";
    return;
  }

  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const complaints = JSON.parse(localStorage.getItem("complaints")) || [];

  // Lọc các phòng đã thuê
  const rentedRooms = rooms
    .filter(r => r.paid && r.rentedBy === currentUser)
    .sort((a, b) => (b.rentedAt || 0) - (a.rentedAt || 0));

  if (rentedRooms.length === 0) {
    rentedRoomList.innerHTML = "<p>Bạn chưa thuê phòng nào</p>";
    return;
  }

  rentedRooms.forEach(room => {
    // Check review
    const roomReview = reviews.find(
      rev => rev.roomId == room.id && rev.user === currentUser && !rev.deleted
    );
    if (roomReview) room.reviewed = true;

    // Check complaint
    const roomComplaint = complaints.find(
      c => c.roomId == room.id && c.user === currentUser
    );

    if (roomComplaint) {
      room.revoked = roomComplaint.revoked || false;
      room.complaint = !room.revoked;
    } else {
      room.revoked = false;
      room.complaint = false;
    }

    // Lấy tên chủ
    const ownerUser = users.find(u => u.username === room.owner);
    const ownerName = ownerUser ? (ownerUser.fname || ownerUser.username) : room.owner;

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      ${room.image ? `<img src="${room.image}" class="room-img">` : ""}
      <h3>${room.title}</h3>
      <p><b>Địa chỉ:</b> ${room.address}</p>
      <p><b>Giá:</b> ${room.price} VND</p>
      <p>
        <b>Chủ phòng:</b>
        <span class="owner-link" onclick="viewOwner('${room.owner}')">
          ${ownerName}
        </span>
      </p>

      <button onclick="viewInvoice(${room.id})">🧾 Hóa đơn</button>

      <button onclick="viewReview(${room.id})">
        ${room.reviewed ? "⭐ Chi tiết đánh giá" : "⭐ Đánh giá"}
      </button>

      <button onclick="viewComplaint(${room.id})">
        ${
          room.revoked
            ? "✔ Đã thu hồi khiếu nại"
            : room.complaint
            ? "🚨 Chi tiết khiếu nại"
            : "🚨 Khiếu nại"
        }
      </button>
    `;

    rentedRoomList.appendChild(div);
  });

  localStorage.setItem("rooms", JSON.stringify(rooms));

  // ===== Functions =====
  window.viewInvoice = id => {
    sessionStorage.setItem("roomId", id);
    location.href = "../invoices/invoice.html";
  };

  window.viewReview = id => {
    sessionStorage.setItem("reviewRoomId", id);
    const room = rooms.find(r => r.id == id);
    location.href = "../review/" + (room.reviewed ? "review-detail.html" : "review.html");
  };

  window.viewComplaint = id => {
    sessionStorage.setItem("complaintRoomId", id);
    const complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    const roomComplaint = complaints.find(c => c.roomId == id && c.user === currentUser);

    if (roomComplaint) {
      location.href = "../complaint/complaint-detail.html"; // luôn vào chi tiết
    } else {
      location.href = "../complaint/complaint.html"; // chưa gửi → form mới
    }
  };

  window.viewOwner = username => {
    sessionStorage.setItem("ownerUsername", username);
    location.href = "../owner-info/owner-info.html";
  };
});

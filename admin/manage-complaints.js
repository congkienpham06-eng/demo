document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("Vui lòng đăng nhập");
    location.href = "../login/login.html";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const me = users.find(u => u.username === currentUser);
  if (!me || me.role !== "admin") {
    alert("Bạn không có quyền truy cập");
    location.href = "../home/home.html";
    return;
  }

  const complaints = JSON.parse(localStorage.getItem("complaints")) || [];
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const container = document.getElementById("adminComplaintList");

  if (!complaints.length) {
    container.innerHTML = "<p>Chưa có khiếu nại nào</p>";
    return;
  }

  // ===== Helper: lấy tên hiển thị (fname || username) =====
  const getDisplayName = username => {
    const u = users.find(us => us.username === username);
    return u ? (u.fname || u.username) : username;
  };

  // ===== Gộp khiếu nại theo phòng =====
  const complaintsByRoom = {};
  complaints.forEach(c => {
    if (!complaintsByRoom[c.roomId]) complaintsByRoom[c.roomId] = [];
    complaintsByRoom[c.roomId].push(c);
  });

  // ===== Xếp phòng: nếu khách thu hồi, phòng xuống dưới =====
  const roomsSorted = Object.keys(complaintsByRoom).sort((a, b) => {
    const aComplaints = complaintsByRoom[a];
    const bComplaints = complaintsByRoom[b];

    const aHasRevokedGuest = aComplaints.some(c => {
      const owner = rooms.find(r => r.id == a)?.owner;
      return c.user !== owner && c.revoked;
    });

    const bHasRevokedGuest = bComplaints.some(c => {
      const owner = rooms.find(r => r.id == b)?.owner;
      return c.user !== owner && c.revoked;
    });

    // Chưa có khách thu hồi => lên trên, đã thu hồi => xuống dưới
    return aHasRevokedGuest - bHasRevokedGuest;
  });

  container.innerHTML = "";

  roomsSorted.forEach(roomId => {
    const room = rooms.find(r => r.id == roomId);
    const roomComplaints = complaintsByRoom[roomId];
    const cardDiv = document.createElement("div");
    cardDiv.className = "complaint-card";

    // ===== Build UI =====
    let innerHTML = `<h3>Phòng: ${room?.title || roomId}</h3>`;

    roomComplaints.forEach(c => {
      innerHTML += `
        <p><b>Người khiếu nại:</b> ${getDisplayName(c.user)}</p>
        <p><b>Trạng thái:</b> ${
          c.revoked
            ? "✔ Đã thu hồi"
            : (c.status || "⚠ Chưa xử lý")
        }</p>
        <hr style="border:none;border-top:1px dashed #ccc;margin:6px 0;">
      `;
    });

    cardDiv.innerHTML = innerHTML;

    cardDiv.onclick = () => {
      sessionStorage.setItem("complaintRoomId", roomId);
      location.href = "./detail-complaints.html";
    };

    container.appendChild(cardDiv);
  });

  if (!container.innerHTML) {
    container.innerHTML = "<p>Chưa có khiếu nại nào</p>";
  }
});

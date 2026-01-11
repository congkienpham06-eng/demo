document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  const complaintList = document.getElementById("complaintList");

  if (!currentUser) {
    alert("Vui lòng đăng nhập");
    location.href = "../login/login.html";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const complaints = JSON.parse(localStorage.getItem("complaints")) || [];

  // ===== Helper: lấy tên hiển thị (fname || username) =====
  const getDisplayName = username => {
    const u = users.find(us => us.username === username);
    return u ? (u.fname || u.username) : username;
  };

  // Lấy phòng của owner
  const ownerRooms = rooms.filter(r => r.owner === currentUser);

  // Gộp khiếu nại theo phòng
  const complaintsByRoom = {};
  complaints.forEach(c => {
    if (!complaintsByRoom[c.roomId]) complaintsByRoom[c.roomId] = [];
    complaintsByRoom[c.roomId].push(c);
  });

  if (!ownerRooms.length) {
    complaintList.innerHTML = "<p>Chưa có phòng nào</p>";
    return;
  }

  // ===== Sort phòng: tất cả khiếu nại đã xử lý hoặc deleted xuống dưới =====
  ownerRooms.sort((a, b) => {
    const aComplaints = complaintsByRoom[a.id] || [];
    const bComplaints = complaintsByRoom[b.id] || [];
    const aDone = aComplaints.length && aComplaints.every(c => c.status || c.deleted);
    const bDone = bComplaints.length && bComplaints.every(c => c.status || c.deleted);
    return aDone - bDone; // chưa xử lý lên trên
  });

  complaintList.innerHTML = "";

  ownerRooms.forEach(room => {
    const roomComplaints = complaintsByRoom[room.id] || [];

    // Chỉ lấy khiếu nại CHƯA thu hồi của khách
    const activeComplaints = roomComplaints.filter(
      c => !c.revoked && c.user !== room.owner
    );

    if (!activeComplaints.length) return;

    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.style.cursor = "pointer";

    let innerHTML = `<h3>Phòng: ${room.title}</h3>`;

    activeComplaints.forEach(c => {
      const date = new Date(c.time);
      const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

      innerHTML += `
        <p><b>Người khiếu nại:</b> ${getDisplayName(c.user)}</p>
        <p><b>Ngày:</b> ${dateStr}</p>
        <p><b>Lý do tóm tắt:</b> ${c.reason.slice(0, 50)}${c.reason.length > 50 ? "..." : ""}</p>
        <p><b>Trạng thái:</b> ${
          c.revoked
            ? "✔ Đã thu hồi"
            : c.status === "✔ Đã được chấp nhận"
            ? "✔ Đã được chấp nhận"
            : c.status === "❌ Đã bị từ chối"
            ? "❌ Đã bị từ chối"
            : "⚠ Chưa xử lý"
        }</p>
        <hr style="border:none;border-top:1px dashed #ccc;margin:6px 0;">
      `;
    });

    cardDiv.innerHTML = innerHTML;

    cardDiv.onclick = () => {
      sessionStorage.setItem("complaintRoomId", room.id);
      location.href = "../complaint/complaint-detail.html";
    };

    complaintList.appendChild(cardDiv);
  });

  if (!complaintList.innerHTML) {
    complaintList.innerHTML = "<p>Chưa có khiếu nại nào</p>";
  }
});

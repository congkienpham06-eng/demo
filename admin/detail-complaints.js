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

  const complaintRoomId = sessionStorage.getItem("complaintRoomId");
  if (!complaintRoomId) {
    alert("Thiếu thông tin phòng");
    history.back();
    return;
  }

  const complaints = JSON.parse(localStorage.getItem("complaints")) || [];
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const room = rooms.find(r => r.id == complaintRoomId);
  if (!room) {
    alert("Phòng không tồn tại");
    history.back();
    return;
  }

  const relatedComplaints = complaints.filter(c => c.roomId == complaintRoomId);
  const container = document.getElementById("complaintDetailContainer");

  // ===== Helper: lấy tên hiển thị (fname || username) =====
  const getDisplayName = username => {
    const u = users.find(us => us.username === username);
    return u ? (u.fname || u.username) : username;
  };

  // ===== Build UI =====
  let html = `<h3>Phòng: ${room.title}</h3>`;

  relatedComplaints.forEach(c => {
    html += `
      <div class="complaint-card">
        <p><b>Người khiếu nại:</b> ${getDisplayName(c.user)}</p>
        <p><b>Lý do:</b> ${c.reason}</p>
        <p><b>Ngày gửi:</b> ${new Date(c.time).toLocaleString()}</p>
        <p><b>Trạng thái:</b> ${
          c.revoked
            ? "✔ Đã thu hồi"
            : (c.status || "⚠ Chưa xử lý")
        }</p>
        ${
          c.images && c.images.length
            ? c.images.map(img => `<img src="${img}" class="complaint-img">`).join("")
            : ""
        }
      </div>
      <hr style="border:none;border-top:1px dashed #ccc;margin:6px 0;">
    `;
  });

  // ===== Hiển thị nút Chấp nhận / Từ chối nếu có khiếu nại chưa xử lý =====
  const unhandled = relatedComplaints.some(c => !c.status && !c.deleted);
  if (unhandled) {
    html += `
      <button id="approveBtn" class="action-btn approve">Chấp nhận khiếu nại khách</button>
      <button id="rejectBtn" class="action-btn reject">Từ chối khiếu nại khách</button>
    `;
  }

  container.innerHTML = html;

  // ===== Xử lý Chấp nhận =====
  const approveBtn = document.getElementById("approveBtn");
  const rejectBtn = document.getElementById("rejectBtn");

  if (approveBtn) {
    approveBtn.onclick = () => {
      relatedComplaints.forEach(c => {
        if (!c.deleted) {
          if (c.user === room.owner) {
            c.status = "❌ Đã bị từ chối"; // Chủ bị từ chối
          } else {
            c.status = "✔ Đã được chấp nhận"; // Khách được chấp nhận
          }
        }
      });
      localStorage.setItem("complaints", JSON.stringify(complaints));
      alert("Đã chấp nhận tất cả khiếu nại: khách được chấp nhận, chủ bị từ chối");
      location.reload();
    };
  }

  // ===== Xử lý Từ chối =====
  if (rejectBtn) {
    rejectBtn.onclick = () => {
      relatedComplaints.forEach(c => {
        if (!c.deleted) {
          if (c.user === room.owner) {
            c.status = "✔ Đã được chấp nhận"; // Chủ được chấp nhận
          } else {
            c.status = "❌ Đã bị từ chối"; // Khách bị từ chối
          }
        }
      });
      localStorage.setItem("complaints", JSON.stringify(complaints));
      alert("Đã từ chối tất cả khiếu nại: khách bị từ chối, chủ được chấp nhận");
      location.reload();
    };
  }

  // ===== Hiển thị nút Xóa nếu tất cả đã xử lý =====
  const allHandled = relatedComplaints.every(c => c.status && !c.deleted);
  if (allHandled) {
    const deleteBtn = document.createElement("button");
    deleteBtn.id = "deleteRoomBtn";
    deleteBtn.className = "action-btn reject";
    deleteBtn.textContent = "🗑 Xóa phòng";
    deleteBtn.onclick = () => {
      if (confirm("Bạn có chắc muốn xóa phòng này khỏi danh sách?")) {
        relatedComplaints.forEach(c => c.deleted = true);
        localStorage.setItem("complaints", JSON.stringify(complaints));
        alert("Phòng đã được đánh dấu Xóa và sẽ được đẩy xuống dưới danh sách.");
        location.reload();
      }
    };
    container.appendChild(deleteBtn);
  }

  // ===== LIGHTBOX =====
  const images = relatedComplaints.flatMap(c => c.images || []);
  if (images.length) {
    const lb = document.getElementById("lightbox");
    const lbImg = document.getElementById("lightbox-img");
    const lbClose = document.querySelector("#lightbox .close");
    const btnPrev = document.querySelector("#lightbox .nav.left");
    const btnNext = document.querySelector("#lightbox .nav.right");

    let currentIndex = 0;
    const showImg = index => {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      currentIndex = index;
      lbImg.src = images[currentIndex];
    };

    document.querySelectorAll(".complaint-img").forEach((img, i) => {
      img.onclick = () => {
        currentIndex = i;
        lbImg.src = images[i];
        lb.classList.add("show");
      };
    });

    if (lbClose) lbClose.onclick = () => lb.classList.remove("show");
    if (btnPrev) btnPrev.onclick = () => showImg(currentIndex - 1);
    if (btnNext) btnNext.onclick = () => showImg(currentIndex + 1);
    lb.onclick = e => {
      if (e.target === lb) lb.classList.remove("show");
    };
  }
});

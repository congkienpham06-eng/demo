document.addEventListener("DOMContentLoaded", () => {
  const complaintRoomId = sessionStorage.getItem("complaintRoomId");
  const currentUser = localStorage.getItem("currentUser");

  if (!complaintRoomId || !currentUser) {
    alert("Thiếu thông tin");
    history.back();
    return;
  }

  const complaints = JSON.parse(localStorage.getItem("complaints")) || [];
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const room = rooms.find(r => r.id == complaintRoomId);
  if (!room) {
    alert("Phòng không tồn tại");
    history.back();
    return;
  }

  // ===== Helper: lấy tên hiển thị giống rentedrooms =====
  const getDisplayName = username => {
    const u = users.find(us => us.username === username);
    return u ? (u.fname || u.username) : username;
  };

  let relatedComplaints = complaints.filter(c => c.roomId == complaintRoomId);
  const isOwner = room.owner === currentUser;

  // ===== Sort: chưa xử lý lên trên =====
  relatedComplaints.sort((a, b) => (a.status ? 1 : 0) - (b.status ? 1 : 0));

  const container = document.getElementById("complaintDetail");
  if (!container) {
    console.error("Không tìm thấy element #complaintDetail");
    return;
  }

  let html = `<h3>Phòng: ${room.title}</h3>`;

  // ===== Render khiếu nại =====
  if (relatedComplaints.length === 2) {
    // Có 2 đơn (khách + chủ)
    relatedComplaints.forEach(c => {
      let displayStatus = "⚠ Chưa xử lý";

      if (c.revoked) {
        displayStatus = "✔ Đã thu hồi";
      } else if (c.status === "approved") {
        displayStatus = c.user === room.owner
          ? "✔ Chấp nhận 1"
          : "✔ Được chấp nhận 2";
      } else if (c.status === "rejected") {
        displayStatus = c.user === room.owner
          ? "❌ Bị từ chối 2"
          : "❌ Bị từ chối 1";
      }

      html += `
        <div class="complaint-card">
          <p><b>Người khiếu nại:</b> ${getDisplayName(c.user)}</p>
          <p><b>Lý do:</b> ${c.reason}</p>
          <p><b>Ngày gửi:</b> ${new Date(c.time).toLocaleString()}</p>
          ${c.images && c.images.length
            ? `<img src="${c.images[0]}" class="complaint-img">`
            : ""}
          <p><b>Trạng thái:</b> ${displayStatus}</p>
          ${
            !c.revoked && !c.status && c.user === currentUser
              ? `<button class="retractBtn" data-user="${c.user}">Thu hồi khiếu nại</button>`
              : ""
          }
        </div>
        <hr style="border:none;border-top:1px dashed #ccc;margin:6px 0;">
      `;
    });
  } else if (relatedComplaints.length === 1) {
    // Chỉ có 1 đơn
    const c = relatedComplaints[0];
    let displayStatus = "⚠ Chưa xử lý";

    if (c.revoked) {
      displayStatus = "✔ Đã thu hồi";
    } else if (c.status === "approved") {
      displayStatus = "✔ Được admin chấp nhận";
    } else if (c.status === "rejected") {
      displayStatus = "❌ Bị admin từ chối";
    }

    html += `
      <div class="complaint-card">
        <p><b>Người khiếu nại:</b> ${getDisplayName(c.user)}</p>
        <p><b>Lý do:</b> ${c.reason}</p>
        <p><b>Ngày gửi:</b> ${new Date(c.time).toLocaleString()}</p>
        ${c.images && c.images.length
          ? `<img src="${c.images[0]}" class="complaint-img">`
          : ""}
        <p><b>Trạng thái:</b> ${displayStatus}</p>
        ${
          !c.revoked && !c.status && c.user === currentUser
            ? `<button class="retractBtn" data-user="${c.user}">Thu hồi khiếu nại</button>`
            : ""
        }
      </div>
      <hr style="border:none;border-top:1px dashed #ccc;margin:6px 0;">
    `;
  }

  // ===== Nút khiếu nại cho owner =====
  if (
    isOwner &&
    !relatedComplaints.find(c => c.user === currentUser) &&
    !relatedComplaints.some(c => c.status)
  ) {
    html += `<button id="ownerComplaintBtn">🚨 Khiếu nại</button>`;
  }

  container.innerHTML = html;

  // ===== Thu hồi =====
  document.querySelectorAll(".retractBtn").forEach(btn => {
    btn.onclick = () => {
      const user = btn.dataset.user;
      const complaint = complaints.find(
        c => c.roomId == complaintRoomId && c.user === user
      );

      if (complaint && confirm("Bạn có chắc muốn thu hồi khiếu nại này?")) {
        complaint.revoked = true;
        localStorage.setItem("complaints", JSON.stringify(complaints));

        const roomData = rooms.find(r => r.id == complaintRoomId);
        if (roomData) roomData.revoked = true;
        localStorage.setItem("rooms", JSON.stringify(rooms));

        alert("Đã thu hồi khiếu nại.");
        location.reload();
      }
    };
  });

  // ===== Chủ khiếu nại =====
  const ownerComplaintBtn = document.getElementById("ownerComplaintBtn");
  if (ownerComplaintBtn) {
    ownerComplaintBtn.onclick = () => {
      sessionStorage.setItem("complaintRoomId", complaintRoomId);
      location.href = "../complaint/complaint.html";
    };
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

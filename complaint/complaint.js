document.addEventListener("DOMContentLoaded", () => {
  const roomId = sessionStorage.getItem("complaintRoomId");
  const currentUser = localStorage.getItem("currentUser");
  const imagesInput = document.getElementById("images");
  const preview = document.getElementById("preview");
  let imageData = [];

  if (!roomId || !currentUser) {
    alert("Thiếu thông tin phòng hoặc người dùng");
    history.back();
    return;
  }

  imagesInput.onchange = function() {
    const files = Array.from(this.files).slice(0,10);
    imageData = [];
    preview.innerHTML = "";
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        imageData.push(e.target.result);
        preview.innerHTML += `<img src="${e.target.result}" style="width:60px;height:60px;margin:4px;">`;
      };
      reader.readAsDataURL(file);
    });
  };

  document.getElementById("btnSubmit").onclick = function() {
    const reason = document.getElementById("reason").value.trim();
    if (!reason) { alert("Nhập lý do khiếu nại"); return; }

    const complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    complaints.push({
      roomId: roomId.toString(),
      user: currentUser,
      reason,
      images: imageData,
      time: Date.now(),
      revoked: false
    });
    localStorage.setItem("complaints", JSON.stringify(complaints));

    const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
    const room = rooms.find(r => r.id == roomId);
    if (room) room.complaint = true;
    localStorage.setItem("rooms", JSON.stringify(rooms));

    alert("Khiếu nại đã gửi");
    location.href = "../rentedrooms/rentedrooms.html";
  };
});

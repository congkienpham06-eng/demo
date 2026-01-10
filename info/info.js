document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("roomInfo");
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("Vui lòng đăng nhập");
    location.href = "../login/login.html";
    return;
  }

  const roomId = sessionStorage.getItem("roomId");
  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const room = rooms.find(r => r.id == roomId);
  if (!room) {
    container.innerHTML = "<p>Không tìm thấy thông tin phòng</p>";
    return;
  }

  const owner = users.find(u => u.username === room.owner);
  const ownerName = owner ? (owner.fname || owner.username) : room.owner;

  const images = room.images?.length ? room.images : room.image ? [room.image] : [];

  // Render thông tin phòng
  container.innerHTML = `
    ${images.length ? `<img src="${images[0]}" class="room-img" id="roomImg">` : ""}
    <div class="card">
      <h3>${room.title}</h3>
      <p><b>Giá:</b> ${room.price} VND</p>
      <p><b>Địa chỉ:</b> ${room.address}</p>
      <p>
        <b>Chủ phòng:</b>
        <span class="owner-link" onclick="viewOwner('${room.owner}')">${ownerName}</span>
      </p>
      ${room.mota ? `<p><b>Mô tả:</b> ${room.mota}</p>` : ""}
      <button onclick="fav()">❤️ Thêm ưa thích</button>
    </div>
  `;

  if (room.owner !== currentUser) {
    const rentBtn = document.createElement("button");
    rentBtn.innerText = "Thuê phòng";
    rentBtn.onclick = () => {
      sessionStorage.setItem("paymentRoomId", room.id);
      location.href = "../payment/payment.html";
    };
    container.appendChild(rentBtn);
  }

  // ===== FAVORITE =====
  window.fav = function () {
    const favs = JSON.parse(localStorage.getItem("favorites")) || {};
    favs[currentUser] = favs[currentUser] || [];
    if (!favs[currentUser].includes(roomId)) {
      favs[currentUser].push(roomId);
      localStorage.setItem("favorites", JSON.stringify(favs));
      alert("Đã thêm vào ưa thích ❤️");
    } else {
      alert("Phòng đã có trong ưa thích");
    }
  };

  // ===== VIEW OWNER =====
  window.viewOwner = function (username) {
    sessionStorage.setItem("ownerUsername", username);
    location.href = "../owner-info/owner-info.html";
  };

  // ===== LIGHTBOX =====
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  let currentIndex = 0;

  const roomImg = document.getElementById("roomImg");
  if (roomImg) {
    roomImg.onclick = () => {
      currentIndex = 0;
      showLightbox();
    };
  }

  function showLightbox() {
    lightbox.classList.add("show");
    lightboxImg.src = images[currentIndex];
  }

  window.closeLightbox = function () {
    lightbox.classList.remove("show");
  };

  window.prevImage = function () {
    if (images.length <= 1) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
  };

  window.nextImage = function () {
    if (images.length <= 1) return;
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex];
  };
});

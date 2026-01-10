// Lấy thông tin owner từ session
const ownerUsername = sessionStorage.getItem("ownerUsername");
if (!ownerUsername) {
  alert("Không có thông tin chủ phòng");
  history.back();
}

// Lấy dữ liệu từ localStorage
const users = JSON.parse(localStorage.getItem("users")) || [];
const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

// ===== OWNER =====
const owner = users.find(u => u.username === ownerUsername);
if (!owner) {
  alert("Không tìm thấy chủ phòng");
  history.back();
}

// ===== INFO =====
const ownerFullname = document.getElementById("ownerFullname");
const ownerPhone = document.getElementById("ownerPhone");
const roomCount = document.getElementById("roomCount");
const avgStar = document.getElementById("avgStar");
const reviewList = document.getElementById("reviewList");

ownerFullname.innerText = owner.fname || owner.fullname || owner.username;
ownerPhone.innerText = owner.phone || "Chưa cập nhật";

const ownerRooms = rooms.filter(r => r.owner === ownerUsername);
roomCount.innerText = ownerRooms.length;

// ===== REVIEW (CHỈ LẤY REVIEW CHƯA BỊ XÓA) =====
const ownerReviews = reviews.filter(r => {
  const room = rooms.find(room => room.id == r.roomId);
  return room && room.owner === ownerUsername && r.deleted !== true;
});

// ===== SAO TRUNG BÌNH =====
if (ownerReviews.length > 0) {
  const avg =
    (
      ownerReviews.reduce((sum, r) => sum + Number(r.star || 0), 0) /
      ownerReviews.length
    ).toFixed(1);
  avgStar.innerText = `${avg} / 5`;
} else {
  avgStar.innerText = "Chưa có";
}

// ===== RENDER REVIEW =====
reviewList.innerHTML = "";

if (!ownerReviews.length) {
  reviewList.innerHTML = "<p>Chưa có đánh giá</p>";
}

ownerReviews.forEach((r, idx) => {
  const imgs = (r.images || [])
    .map((img, i) => `<img src="${img}" onclick="openLightbox(${idx},${i})">`)
    .join("");

  reviewList.innerHTML += `
    <div class="card review">
      <b>${r.user}</b>
      <span>⭐ ${r.star}/5 ${r.reReviewed ? "✅ Đã đánh giá lại" : ""}</span>
      <p>${r.comment || ""}</p>
      ${imgs ? `<div class="review-images">${imgs}</div>` : ""}
    </div>
  `;
});

// ===== LIGHTBOX =====
let currentReview = 0;
let currentImg = 0;
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

window.openLightbox = function (rIdx, iIdx) {
  const imgs = ownerReviews[rIdx].images;
  if (!imgs || !imgs.length) return;

  currentReview = rIdx;
  currentImg = iIdx;

  lightboxImg.src = imgs[iIdx];
  lightbox.classList.add("show");
};

window.prevImg = function () {
  const imgs = ownerReviews[currentReview].images;
  currentImg = (currentImg - 1 + imgs.length) % imgs.length;
  lightboxImg.src = imgs[currentImg];
};

window.nextImg = function () {
  const imgs = ownerReviews[currentReview].images;
  currentImg = (currentImg + 1) % imgs.length;
  lightboxImg.src = imgs[currentImg];
};

window.closeLightbox = function () {
  lightbox.classList.remove("show");
};

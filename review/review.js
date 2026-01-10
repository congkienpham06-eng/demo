document.addEventListener("DOMContentLoaded", () => {
  const starRate = document.getElementById("starRate");
  const imageInput = document.getElementById("images");
  const commentInput = document.getElementById("comment");
  const preview = document.getElementById("preview");

  if (!starRate || !imageInput || !commentInput) return;

  const roomId = sessionStorage.getItem("reReviewRoomId") || sessionStorage.getItem("reviewRoomId");
  const currentUser = localStorage.getItem("currentUser");

  const rooms = JSON.parse(localStorage.getItem("rooms")) || [];
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  const room = rooms.find(r => r.id == roomId);
  if (!room) {
    alert("Không tìm thấy phòng");
    history.back();
    return;
  }

  const isReReview = !!sessionStorage.getItem("reReviewRoomId");

  let selectedStar = 0;
  let imageData = [];

  // Star chọn
  document.querySelectorAll("#starRate span").forEach(star => {
    star.onclick = () => {
      selectedStar = Number(star.dataset.star);
      document.querySelectorAll("#starRate span").forEach(s => {
        s.style.opacity = Number(s.dataset.star) <= selectedStar ? "1" : "0.3";
      });
    };
  });

  // Upload ảnh
  imageInput.onchange = function () {
    const files = Array.from(this.files).slice(0, 10);
    imageData = [];
    preview.innerHTML = "";
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        imageData.push(e.target.result);
        preview.innerHTML += `<img src="${e.target.result}">`;
      };
      reader.readAsDataURL(file);
    });
  };

  // Submit review
  window.submitReview = function () {
    const comment = commentInput.value.trim();

    if (!selectedStar) {
      alert("Chọn số sao");
      return;
    }

    let review = reviews.find(r => r.roomId == room.id && r.user === currentUser);

    if (isReReview && review) {
      // đánh giá lại → update review cũ
      review.star = selectedStar;
      review.comment = comment;
      review.images = imageData;
      review.deleted = false;
      review.reReviewed = true;
    } else if (!review) {
      // review mới
      review = {
        roomId: room.id,
        owner: room.owner,
        user: currentUser,
        star: selectedStar,
        comment,
        images: imageData,
        time: Date.now(),
        deleted: false,
        reReviewed: false
      };
      reviews.push(review);
    }

    room.reviewed = true;

    localStorage.setItem("reviews", JSON.stringify(reviews));
    localStorage.setItem("rooms", JSON.stringify(rooms));

    sessionStorage.removeItem("reReviewRoomId");
    alert(isReReview ? "Đã đánh giá lại" : "Đã gửi đánh giá");
    location.href = "../rentedrooms/rentedrooms.html";
  };
});

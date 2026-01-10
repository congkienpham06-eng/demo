document.addEventListener("DOMContentLoaded", () => {
  const roomId = sessionStorage.getItem("reviewRoomId");
  const currentUser = localStorage.getItem("currentUser");

  const container = document.getElementById("reviewDetail");
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  if (!roomId || !currentUser) {
    container.innerHTML = "<p>Thiếu thông tin đánh giá</p>";
    return;
  }

  const review = reviews.find(r => r.roomId == roomId && r.user === currentUser);

  if (!review) {
    container.innerHTML = "<p>Bạn chưa có đánh giá</p>";
    return;
  }

  const renderReview = () => {
    if (review.deleted) {
      container.innerHTML = "<p>Bạn đã xóa đánh giá</p>";
      return;
    }

    container.innerHTML = `
      <div class="card">
        <p>⭐ ${review.star}/5</p>
        <p>${review.comment || ""}</p>

        <div class="img-preview">
          ${(review.images || []).map(i => `<img src="${i}">`).join("")}
        </div>

        ${
          review.reReviewed
            ? `<button disabled>✅ Đã đánh giá lại</button>`
            : `<button id="btnReReview">🔁 Đánh giá lại (1 lần)</button>`
        }

        <button id="btnDelete">🗑️ Xóa đánh giá</button>
      </div>
    `;

    // Nút đánh giá lại → chuyển sang review.html
    const btnReReview = document.getElementById("btnReReview");
    if (btnReReview) {
      btnReReview.addEventListener("click", () => {
        sessionStorage.setItem("reReviewRoomId", roomId);
        location.href = "../review/review.html";
      });
    }

    // Nút xóa đánh giá
    document.getElementById("btnDelete").addEventListener("click", () => {
      review.deleted = true;
      localStorage.setItem("reviews", JSON.stringify(reviews));
      renderReview();
    });
  };

  renderReview();
});

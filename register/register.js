function register() {
  const u = username.value.trim();
  const p = password.value.trim();
  const n = fname.value.trim(); // 👈 TÊN HIỂN THỊ

  if (!u || !p || !n) {
    alert("Nhập đầy đủ thông tin");
    return;
  }
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(x => x.username === u)) {
    alert("Tên đăng nhập đã tồn tại");
    return;
  }

  users.push({ username: u, password: p, fname: n });
  localStorage.setItem("users", JSON.stringify(users));
  // ✅ FIX QUAN TRỌNG
  localStorage.setItem("currentUser", u); // hoặc sessionStorage nếu m đang dùng

  alert("Đăng ký thành công");
  location.href = "../login/login.html"; // khỏi phải login lại
}



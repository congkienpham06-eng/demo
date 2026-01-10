// ===== TẠO SẴN ADMIN NẾU CHƯA CÓ =====
(function initAdmin() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (!users.some(u => u.username === "admin")) {
    users.push({
      username: "admin",
      password: "admin123",
      role: "admin",
      fname: "Quản trị viên"
    });
    localStorage.setItem("users", JSON.stringify(users));
  }
})();

// ===== GHI NHỚ ROLE VÀ REDIRECT RIÊNG =====
function login() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    u => u.username === username.value && u.password === password.value
  );

  if (!user) {
    alert("Sai tài khoản hoặc mật khẩu");
    return;
  }

  localStorage.setItem("currentUser", user.username);
  localStorage.setItem("currentRole", user.role || "user"); // ⭐ thêm role

  // Redirect riêng nếu admin
  if (user.role === "admin") {
    location.href = "../admin/admin.html"; // frame riêng admin
  } else {
    location.href = "../home/home.html"; // frame user bình thường
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const avatar = document.getElementById("avatar");
  const nameEl = document.getElementById("name");
  const phone = document.getElementById("phone");
  const email = document.getElementById("email");
  const img = document.getElementById("img");

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const username = localStorage.getItem("currentUser");
  const role = localStorage.getItem("currentRole");

  if (!username || role !== "admin") {
    alert("Bạn không có quyền truy cập");
    location.href = "../login/login.html";
    return;
  }

  const user = users.find(u => u.username === username);
  if (!user) {
    alert("Tài khoản không tồn tại");
    sessionStorage.clear();
    location.href = "../login/login.html";
    return;
  }

  // Load dữ liệu profile
  nameEl.innerText = user.fname || user.username;
  phone.value = user.phone || "";
  email.value = user.email || "";
  avatar.src = user.avatar || "../assets/img/default-avatar.png";

  avatar.onclick = () => img.click();

  img.onchange = () => {
    const file = img.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => avatar.src = reader.result;
    reader.readAsDataURL(file);
  };

  window.save = function() {
    user.phone = phone.value;
    user.email = email.value;

    if (img.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        user.avatar = reader.result;
        localStorage.setItem("users", JSON.stringify(users));
        alert("Đã lưu hồ sơ");
      };
      reader.readAsDataURL(img.files[0]);
    } else {
      localStorage.setItem("users", JSON.stringify(users));
      alert("Đã lưu hồ sơ");
    }
  };

  window.logout = function() {
    sessionStorage.clear();
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentRole");
    location.href = "../login/login.html";
  };

  // ===== Chức năng admin =====
  window.addAdmin = function() {
    const newUsername = prompt("Nhập username admin mới:");
    if (!newUsername) return alert("Tên không hợp lệ");
    const exists = users.some(u => u.username === newUsername);
    if (exists) return alert("Tài khoản đã tồn tại");

    const newAdmin = {
      username: newUsername,
      password: "admin123",
      role: "admin",
      fname: "Admin mới"
    };
    users.push(newAdmin);
    localStorage.setItem("users", JSON.stringify(users));
    alert(`Đã tạo tài khoản admin: ${newUsername} (mật khẩu mặc định: admin123)`);
  };

  window.manageComplaints = function() {
    location.href = "../admin/manage-complaints.html"; // bạn tạo page quản lý khiếu nại
  };

  window.manageRooms = function() {
    location.href = "../admin/manage-rooms.html"; // page quản lý phòng đăng
  };

  window.manageUsers = function() {
    location.href = "../admin/manage-users.html"; // page quản lý tất cả user
  };
});

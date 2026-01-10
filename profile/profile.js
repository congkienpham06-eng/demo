document.addEventListener("DOMContentLoaded", () => {
  const avatar = document.getElementById("avatar");
  const nameEl = document.getElementById("name");
  const phone = document.getElementById("phone");
  const email = document.getElementById("email");
  const bank = document.getElementById("bank");
  const img = document.getElementById("img");

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const username = localStorage.getItem("currentUser");

  if (!username) {
    alert("Vui lòng đăng nhập");
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

  // ===== Load dữ liệu profile =====
  nameEl.innerText = user.fname || user.username;
  phone.value = user.phone || "";
  email.value = user.email || "";
  bank.value = user.bank || "";
  avatar.src = user.avatar || "../assets/img/default-avatar.png";

  avatar.onclick = () => img.click();

  img.onchange = () => {
    const file = img.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => avatar.src = reader.result;
    reader.readAsDataURL(file);
  };

  // ===== Lưu profile =====
  window.save = function () {
    user.phone = phone.value;
    user.email = email.value;
    user.bank = bank.value;

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

  // ===== Logout =====
  window.logout = function () {
    sessionStorage.clear();
    localStorage.removeItem("currentUser");
    location.href = "../login/login.html";
  };

  // ===== Đổi mật khẩu =====
  window.changePassword = function() {
    const current = document.getElementById("currentPass").value.trim();
    const newPass = document.getElementById("newPass").value.trim();
    const confirmPass = document.getElementById("confirmPass").value.trim();

    if (!current || !newPass || !confirmPass) {
      return alert("Vui lòng điền đầy đủ thông tin");
    }

    if (current !== user.password) {
      return alert("Mật khẩu hiện tại không đúng");
    }

    if (newPass !== confirmPass) {
      return alert("Xác nhận mật khẩu không khớp");
    }

    user.password = newPass;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Đổi mật khẩu thành công");

    // Xóa input sau khi đổi
    document.getElementById("currentPass").value = "";
    document.getElementById("newPass").value = "";
    document.getElementById("confirmPass").value = "";
  };
});

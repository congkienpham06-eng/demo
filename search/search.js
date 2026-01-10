const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");

let addressData = {}; // sẽ load từ file JSON

// Hàm chuẩn hóa chuỗi: bỏ dấu, chuyển thành lowercase
function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Load file JSON địa chỉ
fetch("../assets/data/address.json")
  .then(res => res.json())
  .then(data => {
    addressData = data;
  })
  .catch(err => console.error("Lỗi load địa chỉ:", err));

// Lấy gợi ý dựa trên input
function getSuggestions(value) {
  const results = [];
  const query = normalize(value);

  Object.keys(addressData).forEach(city => {
    // Gợi ý tên tỉnh
    if (normalize(city).includes(query)) results.push(city);

    // Gợi ý quận/huyện
    (addressData[city] || []).forEach(district => {
      if (normalize(district).includes(query)) {
        results.push(`${district}, ${city}`);
      }
    });
  });

  return results.slice(0, 5);
}

// Hiển thị gợi ý
function showSuggestions() {
  const value = searchInput.value.trim();
  suggestions.innerHTML = "";
  if (!value) return;

  getSuggestions(value).forEach(item => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.innerText = item;
    div.onclick = () => selectSuggestion(item);
    suggestions.appendChild(div);
  });
}

// Chọn gợi ý → lưu query → đi result
function selectSuggestion(value) {
  sessionStorage.setItem("searchQuery", value);
  window.location.href = "../result/result.html";
}

// Event
searchInput.addEventListener("input", showSuggestions);
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && searchInput.value.trim()) {
    selectSuggestion(searchInput.value.trim());
  }
});

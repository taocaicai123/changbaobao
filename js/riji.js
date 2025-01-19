// 显示当前日期
const currentDate = document.getElementById('current-date');
const today = new Date();
currentDate.textContent = `日期：${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

// 图片上传预览
const imageInput = document.getElementById("diary-image");
imageInput.addEventListener("change", function (event) {
  const previewContainer = document.getElementById("image-preview");
  previewContainer.innerHTML = ""; // 清空之前的预览

  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.maxWidth = "100px";
      img.style.maxHeight = "100px";
      previewContainer.appendChild(img);
    };

    reader.readAsDataURL(file);
  }
});

// 保存日记
document.getElementById("save-diary").addEventListener("click", async () => {
  const diaryText = document.getElementById("diary-text").value;
  const images = imageInput.files;

  if (diaryText.trim() === "" && images.length === 0) {
    alert("请输入日记内容或上传图片！");
    return;
  }

  const formData = new FormData();
  formData.append("diaryText", diaryText);
  for (let i = 0; i < images.length; i++) {
    formData.append("images", images[i]);
  }

  try {
    const response = await fetch("/diaries", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("日记保存成功！");
      loadDiaries();
    } else {
      alert("保存失败，请重试！");
    }
  } catch (error) {
    console.error("保存日记出错：", error);
    alert("保存失败，请重试！");
  }
});

// 加载日记
async function loadDiaries() {
  const response = await fetch(`/diaries?page=1&limit=10`);
  if (response.ok) {
    const result = await response.json();
    const diaryDisplay = document.getElementById("saved-diaries");
    diaryDisplay.innerHTML = ""; // 清空之前的日记

    result.data.forEach((diary) => {
      const diaryEntry = document.createElement("div");
      diaryEntry.classList.add("diary-entry");

      // 添加日期
      const entryDate = document.createElement("div");
      entryDate.classList.add("entry-date");
      entryDate.textContent = `保存时间：${diary.date}`;
      diaryEntry.appendChild(entryDate);

      // 添加日记内容
      if (diary.text) {
        const entryText = document.createElement("div");
        entryText.classList.add("entry-text");
        entryText.textContent = diary.text;
        diaryEntry.appendChild(entryText);
      }

      // 添加图片展示
      if (diary.images && diary.images.length > 0) {
        const entryImages = document.createElement("div");
        entryImages.classList.add("entry-images");

        diary.images.forEach((imageUrl) => {
          const img = document.createElement("img");
          img.src = imageUrl;
          img.style.maxWidth = "100px";
          img.style.maxHeight = "100px";
          entryImages.appendChild(img);
        });

        diaryEntry.appendChild(entryImages);
      }

      diaryDisplay.appendChild(diaryEntry);
    });

    // 显示分页信息
    const paginationInfo = document.getElementById("pagination-info");
    paginationInfo.textContent = `第 ${result.pagination.page} 页 / 共 ${result.pagination.totalPages} 页`;
  }
}

// 页面加载时加载日记
loadDiaries();


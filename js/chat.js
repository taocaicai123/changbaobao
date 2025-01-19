let currentUser = null;
let currentAvatar = null;

function toggleNav() {
  const navLinks = document.getElementById('navLinks');
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}
// 获取聊天记录的函数
async function fetchChat() {
  const response = await fetch("/chat");
  if (!response.ok) {
    throw new Error("网络请求失败，请稍后再试！");
  }
  return response.json();
}

// 保存聊天消息的函数
async function saveChat(message) {
  const response = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  if (!response.ok) {
    throw new Error("保存聊天消息失败，请稍后再试！");
  }
  return response.json();
}

// 格式化时间和日期的函数
function formatDateTime(date) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Intl.DateTimeFormat("zh-CN", options).format(new Date(date));
}

// 渲染聊天记录到页面的函数
function renderChat(chat) {
  const chatBody = document.getElementById("chat-body");
  chatBody.innerHTML = chat.map((msg) => {
    const isMe = msg.username === currentUser;
    const formattedTime = formatDateTime(msg.date); // 格式化时间和日期
    return `
      <div class="message-container ${isMe ? "me" : "other"}">
        <div class="message-time-above">${formattedTime}</div>
        <div class="message ${isMe ? "me" : "other"}">
          <img src="${isMe ? currentAvatar : (msg.username === "常江怡" ? "images/chang.jpg" : "images/bai.jpg")}" class="avatar" alt="${msg.username}">
          <div class="message-content">
            ${msg.text.includes("data:image") ? `<img src="${msg.text}" alt="图片">` : msg.text}
          </div>
        </div>
      </div>
    `;
  }).join("");

  chatBody.scrollTop = chatBody.scrollHeight; // 自动滚动到底部
}

// 插入表情到输入框的函数
function insertEmoji(emoji) {
  const messageInput = document.getElementById("message-input");
  messageInput.value += emoji;
}

// 选择用户名的函数
function selectUser(username, avatar) {
  currentUser = username;
  currentAvatar = avatar;
  const nameModal = document.getElementById("name-modal");
  nameModal.classList.remove("show");
  document.getElementById("chat-title").innerText = `${currentUser} 的聊天页面`;
}

// 提交聊天消息的逻辑
async function onSendMessage() {
  const messageInput = document.getElementById("message-input");
  const text = messageInput.value.trim();

  if (!text) {
    alert("聊天内容不能为空！");
    return;
  }

  const newChat = {
    username: currentUser,
    text,
    date: new Date().toLocaleString(),
  };

  try {
    await saveChat(newChat); // 保存聊天消息
    const chat = await fetchChat(); // 重新获取聊天记录
    renderChat(chat); // 重新渲染聊天记录
    messageInput.value = ""; // 清空输入框
  } catch (error) {
    alert("聊天消息保存失败，请稍后再试！");
  }
}

// 处理图片上传
function handleImageUpload() {
  const imageInput = document.getElementById("image-input");
  imageInput.click();
}

document.getElementById("image-input").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgUrl = e.target.result;
      const messageInput = document.getElementById("message-input");
      messageInput.value += imgUrl;
    };
    reader.readAsDataURL(file);
  }
});

// 页面加载时获取并渲染聊天记录
document.addEventListener("DOMContentLoaded", async () => {
  const nameModal = document.getElementById("name-modal");
  nameModal.classList.add("show");

  try {
    const chat = await fetchChat();
    renderChat(chat);
  } catch (error) {
    alert("获取聊天记录失败，请刷新页面重试！");
  }

  // 绑定发送按钮事件
  const sendButton = document.getElementById("send-button");
  sendButton.addEventListener("click", onSendMessage);

  // 绑定表情按钮事件
  const emojiButton = document.getElementById("emoji-button");
  emojiButton.addEventListener("click", () => {
    const emojiPicker = document.getElementById("emoji-picker");
    emojiPicker.classList.toggle("show");
  });

  // 绑定图片按钮事件
  const imageButton = document.getElementById("image-button");
  imageButton.addEventListener("click", handleImageUpload);

  // 注册表情点击事件
  const emojiPicker = document.getElementById("emoji-picker");
  emojiPicker.querySelectorAll(".emoji").forEach((emoji) => {
    emoji.addEventListener("click", () => insertEmoji(emoji.innerText));
  });
});

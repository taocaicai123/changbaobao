let currentUser = null;
let currentAvatar = null;

function toggleNav() {
  const navLinks = document.getElementById('navLinks');
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// 获取留言的函数
async function fetchMessages() {
  const response = await fetch("/messages");
  if (!response.ok) {
    throw new Error("网络请求失败，请稍后再试！");
  }
  return response.json();
}

// 保存留言的函数
async function saveMessage(message) {
  const response = await fetch("/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  if (!response.ok) {
    throw new Error("保存留言失败，请稍后再试！");
  }
  return response.json();
}

// 渲染留言到页面的函数
function renderMessages(messages) {
  const messageList = document.getElementById("message-list");
  messageList.innerHTML = messages
    .map(
      (msg) => `
      <li class="message-item">
        <img src="${msg.avatar}" alt="${msg.username}" class="avatar">
        <div class="message-content">
          <strong>${msg.username}</strong> 说：${msg.text}
          ${msg.media ? `<div><img src="${msg.media}" alt="图片" /></div>` : ""}
          <span class="message-meta">${new Date(msg.date).toLocaleString()}</span>
        </div>
      </li>`
    )
    .join("");
}

// 提交留言的逻辑
async function onSendMessage() {
  const messageInput = document.getElementById("message-input");
  const mediaInput = document.getElementById("media-input");

  const text = messageInput.value.trim();
  const mediaFile = mediaInput.files[0];

  if (!text) {
    alert("留言内容不能为空！");
    return;
  }

  const newMessage = {
    username: currentUser,
    avatar: currentAvatar,
    text,
    date: new Date().toISOString(),
  };

  if (mediaFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
      newMessage.media = e.target.result;
      saveMessage(newMessage)
        .then(() => fetchMessages())
        .then(renderMessages)
        .catch(console.error);
    };
    reader.readAsDataURL(mediaFile);
  } else {
    saveMessage(newMessage)
      .then(() => fetchMessages())
      .then(renderMessages)
      .catch(console.error);
  }

  messageInput.value = "";
  mediaInput.value = "";
}

// 清空所有留言的逻辑
async function onClearMessages() {
  if (!confirm("确定要清空所有留言吗？此操作无法恢复！")) {
    return;
  }

  try {
    await fetch("/messages", { method: "DELETE" });
    const messages = await fetchMessages();
    renderMessages(messages);
    alert("留言已清空！");
  } catch (error) {
    alert("清空留言失败，请稍后再试！");
  }
}

// 选择用户
function selectUser(username, avatar) {
  currentUser = username;
  currentAvatar = avatar;
  const userModal = document.getElementById("user-modal");
  userModal.classList.remove("show");
  document.getElementById("username-input").value = username;
}

// 页面加载时获取并渲染留言
document.addEventListener("DOMContentLoaded", async () => {
  const userModal = document.getElementById("user-modal");
  userModal.classList.add("show");

  try {
    const messages = await fetchMessages();
    renderMessages(messages);
  } catch (error) {
    alert("获取留言失败，请刷新页面重试！");
  }

  // 绑定发送按钮事件
  const sendMessageBtn = document.getElementById("send-message-btn");
  sendMessageBtn.addEventListener("click", onSendMessage);

  // 绑定清空留言按钮事件
  const clearMessagesBtn = document.getElementById("clear-messages-btn");
  clearMessagesBtn.addEventListener("click", onClearMessages);
});
